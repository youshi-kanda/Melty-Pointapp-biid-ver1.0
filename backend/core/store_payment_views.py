from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
import logging

from .models import Store, PointTransaction, User
from .serializers import PointTransactionSerializer
from .point_service import point_service

logger = logging.getLogger(__name__)
User = get_user_model()


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def lookup_customer_by_email(request):
    """メールアドレスで顧客検索"""
    try:
        email = request.GET.get('email')
        if not email:
            return Response(
                {'error': 'メールアドレスが必要です'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        customer = get_object_or_404(User, email=email, role='customer')
        
        return Response({
            'customer': {
                'id': customer.id,
                'username': customer.username,
                'email': customer.email,
                'point_balance': customer.point_balance,
                'nfc_uid': getattr(customer, 'nfc_uid', None)
            }
        })
        
    except User.DoesNotExist:
        return Response(
            {'error': '顧客が見つかりません'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Customer lookup by email failed: {str(e)}")
        return Response(
            {'error': '顧客検索に失敗しました'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def lookup_customer_by_qr(request):
    """QRコードで顧客検索"""
    try:
        qr_data = request.data.get('qr_data')
        if not qr_data:
            return Response(
                {'error': 'QRデータが必要です'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # QRデータからユーザーIDを抽出（実装は要件に応じて調整）
        try:
            user_id = int(qr_data.split('_')[-1])  # 例: "user_123" -> 123
        except (ValueError, IndexError):
            return Response(
                {'error': '無効なQRコードです'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        customer = get_object_or_404(User, id=user_id, role='customer')
        
        return Response({
            'customer': {
                'id': customer.id,
                'username': customer.username,
                'email': customer.email,
                'point_balance': customer.point_balance,
                'nfc_uid': getattr(customer, 'nfc_uid', None)
            }
        })
        
    except User.DoesNotExist:
        return Response(
            {'error': '顧客が見つかりません'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Customer lookup by QR failed: {str(e)}")
        return Response(
            {'error': '顧客検索に失敗しました'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def process_store_payment(request):
    """店舗でのポイント決済処理"""
    try:
        # 権限チェック（店舗管理者またはターミナルユーザー）
        if request.user.role not in ['store', 'terminal']:
            return Response(
                {'error': '権限がありません'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        customer_id = request.data.get('customer_id')
        points = request.data.get('points')
        description = request.data.get('description', 'ポイント決済')
        
        # バリデーション
        if not customer_id or not points:
            return Response(
                {'error': '顧客IDとポイント数が必要です'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            points = int(points)
        except (ValueError, TypeError):
            return Response(
                {'error': '有効なポイント数を入力してください'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if points <= 0:
            return Response(
                {'error': 'ポイント数は1以上である必要があります'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 顧客を取得
        customer = get_object_or_404(User, id=customer_id, role='customer')
        
        # 店舗情報を取得
        store = None
        if request.user.role == 'store':
            # 店舗管理者の場合、管理している店舗を取得
            try:
                store = request.user.managed_stores.first()
            except AttributeError:
                pass
        elif request.user.role == 'terminal':
            # ターミナルユーザーの場合、関連店舗を取得
            try:
                store = getattr(request.user, 'terminal_store', None)
            except AttributeError:
                pass
        
        if not store:
            return Response(
                {'error': '店舗情報が取得できません'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 統一ポイントサービスを使用してポイント決済処理
        point_transaction = point_service.process_store_payment(
            customer=customer,
            store=store,
            points=points,
            description=description,
            processed_by=request.user
        )
        
        # レスポンス
        return Response({
            'transaction_id': point_transaction.id,
            'points_consumed': points,
            'balance_after': customer.point_balance,  # 統一されたpoint_balanceを使用
            'customer_name': customer.username,
            'store_name': store.name,
            'message': f'{points}ポイントの決済が完了しました'
        }, status=status.HTTP_201_CREATED)
        
    except User.DoesNotExist:
        return Response(
            {'error': '顧客が見つかりません'},
            status=status.HTTP_404_NOT_FOUND
        )
    except ValidationError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Store payment processing failed: {str(e)}")
        return Response(
            {'error': 'ポイント決済処理に失敗しました'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_recent_transactions(request):
    """最近の取引履歴取得"""
    try:
        # 権限チェック（店舗管理者またはターミナルユーザー）
        if request.user.role not in ['store', 'terminal', 'admin']:
            return Response(
                {'error': '権限がありません'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        transaction_type = request.GET.get('type')
        limit = min(int(request.GET.get('limit', 10)), 50)  # 最大50件
        
        # 基本クエリ
        queryset = PointTransaction.objects.select_related('user', 'store').order_by('-created_at')
        
        # フィルタリング
        if transaction_type:
            if transaction_type == 'store_payment':
                queryset = queryset.filter(transaction_type='payment')
        
        # 権限に応じてフィルタリング
        if request.user.role == 'store':
            # 店舗管理者は自分の管理店舗の取引のみ
            try:
                managed_stores = request.user.managed_stores.all()
                queryset = queryset.filter(store__in=managed_stores)
            except AttributeError:
                queryset = queryset.none()
        elif request.user.role == 'terminal':
            # ターミナルユーザーは関連店舗の取引のみ
            try:
                terminal_store = getattr(request.user, 'terminal_store', None)
                if terminal_store:
                    queryset = queryset.filter(store=terminal_store)
                else:
                    queryset = queryset.none()
            except AttributeError:
                queryset = queryset.none()
        
        # 取引を取得
        transactions = queryset[:limit]
        
        # レスポンス用データ整形
        transaction_data = []
        for trans in transactions:
            transaction_data.append({
                'id': trans.id,
                'customer_name': trans.user.username if trans.user else '不明',
                'customer_email': trans.user.email if trans.user else '',
                'points': abs(trans.points),  # 絶対値表示
                'transaction_type': trans.transaction_type,
                'description': trans.description,
                'store_name': trans.store.name if trans.store else '不明な店舗',
                'created_at': trans.created_at.isoformat(),
                'processed_by': trans.processed_by.username if trans.processed_by else '不明'
            })
        
        return Response({
            'transactions': transaction_data,
            'count': len(transaction_data)
        })
        
    except Exception as e:
        logger.error(f"Get recent transactions failed: {str(e)}")
        return Response(
            {'error': '取引履歴取得に失敗しました'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )