"""
meltyアプリ連携用のAPIビュー - SSO非対応版（既存API活用）
"""

from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model, login
from django.conf import settings
from django.urls import reverse
from django.http import HttpResponseRedirect
import logging

from .melty_integration import melty_direct_auth, melty_user_service, MeltyIntegrationError
from .serializers import UserSerializer

User = get_user_model()
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def melty_direct_login(request):
    """melty既存ログインAPI経由ログイン"""
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not all([email, password]):
            return Response({
                'success': False,
                'error': 'メールアドレスとパスワードが必要です'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # melty既存APIで認証
        user, is_new = melty_direct_auth.authenticate_user(email, password)
        
        # Django認証
        login(request, user)
        
        # ユーザー情報をシリアライズ
        serializer = UserSerializer(user)
        
        return Response({
            'success': True,
            'user': serializer.data,
            'is_new_user': is_new,
            'message': 'MELTYアカウントでのログインが完了しました'
        })
        
    except MeltyIntegrationError as e:
        if "registration required" in str(e):
            return Response({
                'success': False,
                'error': 'アカウント登録が必要です',
                'requires_registration': True
            }, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        logger.error(f"melty direct login error: {str(e)}")
        return Response({
            'success': False,
            'error': 'ログイン処理中にエラーが発生しました'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def melty_verify_email(request):
    """meltyアカウント存在確認（パスワードリセットAPI活用）"""
    try:
        email = request.data.get('email')
        
        if not email:
            return Response({
                'success': False,
                'error': 'メールアドレスが必要です'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # meltyパスワードリセットAPIでアカウント存在確認
        exists = melty_direct_auth.verify_email_exists(email)
        
        return Response({
            'success': True,
            'exists': exists,
            'message': 'MELTYアカウント確認完了' if exists else 'MELTYアカウントが見つかりません'
        })
        
    except Exception as e:
        logger.error(f"melty email verification error: {str(e)}")
        return Response({
            'success': False,
            'error': 'アカウント確認中にエラーが発生しました'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_with_melty(request):
    """melty既存API経由での新規登録"""
    try:
        # リクエストデータ取得
        email = request.data.get('email')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        melty_password = request.data.get('melty_password')
        
        if not all([email, first_name, last_name, melty_password]):
            return Response({
                'success': False,
                'error': '必須項目が不足しています'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # melty既存API経由でbiidアカウント作成
        user, is_new = melty_user_service.create_biid_account_from_melty(
            email=email,
            first_name=first_name,
            last_name=last_name,
            melty_password=melty_password
        )
        
        # Django認証
        login(request, user)
        
        # ユーザー情報をシリアライズ
        serializer = UserSerializer(user)
        
        # MELTY会員種別に応じたボーナスポイント計算
        welcome_bonus = 0
        if is_new:
            welcome_bonus = 2000 if user.rank == 'gold' else 1000
        
        return Response({
            'success': True,
            'user': serializer.data,
            'is_new_user': is_new,
            'rank': user.rank,
            'membership_type': 'premium' if user.rank == 'gold' else 'standard',
            'welcome_bonus': welcome_bonus,
            'special_benefits': self._get_rank_benefits(user.rank),
            'message': self._get_registration_message(user.rank, is_new)
        }, status=status.HTTP_201_CREATED if is_new else status.HTTP_200_OK)
        
    except MeltyIntegrationError as e:
        logger.error(f"melty registration failed: {str(e)}")
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Unexpected melty registration error: {str(e)}")
        return Response({
            'success': False,
            'error': '登録処理中にエラーが発生しました'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_direct(request):
    """biid直接登録（ブロンズランク）"""
    try:
        # リクエストデータ取得
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        
        if not all([email, password, first_name, last_name]):
            return Response({
                'success': False,
                'error': '必須項目が不足しています'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 既存ユーザーチェック
        if User.objects.filter(email=email).exists():
            return Response({
                'success': False,
                'error': 'このメールアドレスは既に登録されています'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # ユニークなusernameを生成
        base_username = f"{first_name}_{last_name}".lower()
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1
        
        # ユニークなmember_idを生成
        import uuid
        member_id = f"B{str(uuid.uuid4().hex[:8]).upper()}"
        while User.objects.filter(member_id=member_id).exists():
            member_id = f"B{str(uuid.uuid4().hex[:8]).upper()}"
        
        # 直接登録ユーザーはブロンズランクでスタート
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            member_id=member_id,
            rank='bronze',  # 直接登録はブロンズランク
            registration_source='direct',
            is_active=True
        )
        
        # 基本ウェルカムボーナス（ブロンズランク）
        user.add_points(
            points=500,
            expiry_months=6,
            source_description="biid新規登録ウェルカムボーナス"
        )
        
        # Django認証
        login(request, user)
        
        # ユーザー情報をシリアライズ
        serializer = UserSerializer(user)
        
        logger.info(f"New direct registration: {user.username} (Bronze rank)")
        
        return Response({
            'success': True,
            'user': serializer.data,
            'is_new_user': True,
            'rank': user.rank,
            'welcome_bonus': 500,
            'message': 'biidアカウントの作成が完了しました'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Direct registration failed: {str(e)}")
        return Response({
            'success': False,
            'error': '登録処理中にエラーが発生しました'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def link_melty_account(request):
    """既存biidアカウントにmeltyアカウントをリンク"""
    try:
        email = request.data.get('melty_email')
        melty_password = request.data.get('melty_password')
        
        if not all([email, melty_password]):
            return Response({
                'success': False,
                'error': 'melty認証情報が必要です'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        
        if user.is_melty_linked:
            return Response({
                'success': False,
                'error': '既にmeltyアカウントとリンクされています'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # melty認証確認
        auth_result = melty_user_service.api_client.verify_user_credentials(email, melty_password)
        
        if not auth_result or not auth_result.get('verified'):
            return Response({
                'success': False,
                'error': 'melty認証に失敗しました'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # ユーザー情報取得
        melty_user_data = auth_result.get('user_data', {})
        melty_user_id = auth_result.get('user_id', '') or melty_user_data.get('id', '')
        
        # 他のユーザーが同じmeltyアカウントを使用していないかチェック
        if User.objects.filter(melty_user_id=melty_user_id).exists():
            return Response({
                'success': False,
                'error': 'このmeltyアカウントは既に他のbiidアカウントとリンクされています'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # リンク実行
        melty_user_service.link_melty_to_existing_user(user, melty_user_id, melty_user_data)
        
        # ユーザー情報を更新して返す
        user.refresh_from_db()
        serializer = UserSerializer(user)
        
        rank_upgrade = user.rank == 'silver'
        
        # アップグレードボーナス計算
        upgrade_bonus = 0
        if rank_upgrade:
            upgrade_bonus = 2000 if user.rank == 'gold' else 1000
        
        return Response({
            'success': True,
            'user': serializer.data,
            'rank_upgraded': rank_upgrade,
            'new_rank': user.rank,
            'membership_type': 'premium' if user.rank == 'gold' else 'standard',
            'welcome_bonus': upgrade_bonus,
            'special_benefits': self._get_rank_benefits(user.rank) if rank_upgrade else [],
            'message': self._get_link_message(user.rank, rank_upgrade)
        })
        
    except MeltyIntegrationError as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"melty account linking failed: {str(e)}")
        return Response({
            'success': False,
            'error': 'リンク処理中にエラーが発生しました'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def unlink_melty_account(request):
    """meltyアカウントリンクを解除"""
    try:
        user = request.user
        
        if not user.is_melty_linked:
            return Response({
                'success': False,
                'error': 'meltyアカウントとリンクされていません'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # リンク解除
        success = melty_user_service.unlink_melty_account(user)
        
        if success:
            user.refresh_from_db()
            serializer = UserSerializer(user)
            
            return Response({
                'success': True,
                'user': serializer.data,
                'message': 'meltyアカウントとのリンクを解除しました'
            })
        else:
            return Response({
                'success': False,
                'error': 'リンク解除に失敗しました'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        logger.error(f"melty account unlinking failed: {str(e)}")
        return Response({
            'success': False,
            'error': 'リンク解除処理中にエラーが発生しました'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def melty_profile_sync(request):
    """meltyプロフィール同期"""
    try:
        user = request.user
        
        if not user.is_melty_linked:
            return Response({
                'success': False,
                'error': 'meltyアカウントとリンクされていません'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # meltyプロフィール同期
        sync_success = melty_user_service.sync_melty_profile(user)
        
        if sync_success:
            user.refresh_from_db()
            
        return Response({
            'success': True,
            'melty_profile': user.melty_profile_data,
            'linked_at': user.melty_connected_at,
            'sync_success': sync_success,
            'message': 'meltyプロフィール情報を取得しました'
        })
        
    except Exception as e:
        logger.error(f"melty profile sync failed: {str(e)}")
        return Response({
            'success': False,
            'error': 'プロフィール同期中にエラーが発生しました'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _get_rank_benefits(self, rank: str) -> list:
        """ランク別特典一覧を取得"""
        benefits = {
            'bronze': [
                '基本ポイント機能',
                'ギフト交換',
                'サポートチケット'
            ],
            'silver': [
                '基本ポイント機能',
                'ギフト交換',
                'MELTY連携特典',
                'ポイント有効期限延長（12ヶ月）',
                '優先サポート',
                '特別キャンペーン参加資格'
            ],
            'gold': [
                'すべてのSilver特典',
                'MELTYプレミアム連携特典',
                'ポイント有効期限延長（18ヶ月）',
                'お仕事関連店舗でポイント2倍',
                'VIP優先サポート',
                '限定ギフトアクセス',
                '特別イベント招待',
                'パーソナルコンシェルジュサービス'
            ]
        }
        return benefits.get(rank, [])
    
    def _get_registration_message(self, rank: str, is_new: bool) -> str:
        """登録完了メッセージを生成"""
        if not is_new:
            return 'meltyアカウントにリンクしました'
            
        if rank == 'gold':
            return '🎆 MELTYプレミアム会員限定！ゴールドランクでアカウント作成が完了しました'
        else:
            return '✨ MELTY連携でシルバーランクアカウント作成が完了しました'
    
    def _get_link_message(self, rank: str, rank_upgraded: bool) -> str:
        """リンク完了メッセージを生成"""
        if not rank_upgraded:
            return 'meltyアカウントとのリンクが完了しました'
            
        if rank == 'gold':
            return '🎆 MELTYプレミアム連携でゴールドランクにアップグレード！リンク完了しました'
        else:
            return '✨ MELTY連携でシルバーランクにアップグレード！リンク完了しました'