from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from django.conf import settings
from django.db import models
from datetime import datetime, timedelta
import jwt
from .models import (
    Store, PointTransaction, Gift, GiftCategory, GiftExchange,
    AccountRank, Friendship, PointTransfer, Notification
)
from .serializers import (
    UserSerializer, StoreSerializer, PointTransactionSerializer, MemberSyncSerializer,
    GiftSerializer, GiftCategorySerializer, GiftExchangeSerializer, GiftExchangeRequestSerializer,
    AccountRankSerializer, UserWithRankSerializer, FriendshipSerializer, FriendRequestSerializer,
    PointTransferSerializer, PointTransferRequestSerializer, NotificationSerializer
)
from .utils.pdf_generator import generate_gift_receipt_pdf
from .utils.email_service import send_gift_exchange_notification
import logging

logger = logging.getLogger(__name__)

User = get_user_model()


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class StoreListCreateView(generics.ListCreateAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer


class StoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer


class PointTransactionListCreateView(generics.ListCreateAPIView):
    queryset = PointTransaction.objects.all()
    serializer_class = PointTransactionSerializer


class PointTransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PointTransaction.objects.all()
    serializer_class = PointTransactionSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def member_sync(request):
    """
    External member sync endpoint.
    Receives member data and creates or updates existing members.
    """
    serializer = MemberSyncSerializer(data=request.data)
    
    if serializer.is_valid():
        data = serializer.validated_data
        
        try:
            user, created = User.objects.update_or_create(
                member_id=data['member_id'],
                defaults={
                    'username': data['username'],
                    'email': data['email'],
                    'first_name': data.get('first_name', ''),
                    'last_name': data.get('last_name', ''),
                    'points': data['points'],
                    'status': data['status'],
                    'location': data.get('location', ''),
                    'avatar': data.get('avatar', ''),
                }
            )
            
            if created:
                user.registration_date = timezone.now()
            user.last_login_date = timezone.now()
            user.save()
            
            user_serializer = UserSerializer(user)
            
            return Response({
                'success': True,
                'created': created,
                'message': 'Member created successfully' if created else 'Member updated successfully',
                'user': user_serializer.data
            }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': f'Database error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nfc_lookup(request, uid):
    """
    NFC lookup endpoint.
    Looks up user by UID (member_id or username).
    """
    try:
        try:
            user = User.objects.get(member_id=uid)
        except User.DoesNotExist:
            user = User.objects.get(username=uid)
        
        user_serializer = UserSerializer(user)
        
        return Response({
            'success': True,
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            'success': False,
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Lookup error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TokenObtainView(APIView):
    permission_classes = []
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({'error': 'Email and password required'}, status=400)
        
        # メールアドレスまたはユーザー名でログイン可能
        user = None
        try:
            # まずメールアドレスで検索
            if '@' in email:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            else:
                # ユーザー名で直接認証
                user = authenticate(username=email, password=password)
        except User.DoesNotExist:
            # ユーザー名でも試す
            user = authenticate(username=email, password=password)
        
        if not user:
            return Response({'error': 'Invalid credentials'}, status=401)
        
        access_payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=1)
        }
        refresh_payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        
        access_token = jwt.encode(access_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        refresh_token = jwt.encode(refresh_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        
        return Response({
            'access': access_token,
            'refresh': refresh_token
        })


class TokenRefreshView(APIView):
    permission_classes = []
    
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token required'}, status=400)
        
        try:
            payload = jwt.decode(refresh_token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            user_id = payload.get('user_id')
            
            access_payload = {
                'user_id': user_id,
                'exp': datetime.utcnow() + timedelta(hours=1)
            }
            access_token = jwt.encode(access_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
            
            return Response({'access': access_token})
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Refresh token expired'}, status=401)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid refresh token'}, status=401)


class CurrentUserView(APIView):
    def get(self, request):
        user_serializer = UserSerializer(request.user)
        return Response(user_serializer.data)


class PointGrantView(APIView):
    def post(self, request):
        uid = request.data.get('uid')
        points = request.data.get('points')
        reason = request.data.get('reason', '')
        
        if not uid or not points:
            return Response({'error': 'UID and points required'}, status=400)
        
        try:
            try:
                user = User.objects.get(member_id=uid)
            except User.DoesNotExist:
                user = User.objects.get(username=uid)
            
            user.points += int(points)
            user.save()
            
            from .models import Store
            default_store = Store.objects.first()
            
            transaction = PointTransaction.objects.create(
                user=user,
                store=default_store,
                amount=0,
                points_issued=int(points),
                payment_method='grant',
                status='completed',
                description=reason
            )
            
            return Response({
                'success': True,
                'message': f'{points} points granted to {user.username}',
                'user_points': user.points
            })
            
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class PointHistoryView(APIView):
    def get(self, request):
        transactions = PointTransaction.objects.filter(
            points_issued__gt=0
        ).order_by('-transaction_date')[:50]
        
        serializer = PointTransactionSerializer(transactions, many=True)
        return Response({
            'success': True,
            'transactions': serializer.data
        })


class ChargeView(APIView):
    def post(self, request):
        amount = request.data.get('amount')
        payment_method = request.data.get('payment_method')
        
        if not amount or not payment_method:
            return Response({'error': 'Amount and payment method required'}, status=400)
        
        try:
            from .models import Store
            default_store = Store.objects.first()
            
            transaction = PointTransaction.objects.create(
                user=request.user,
                store=default_store,
                amount=float(amount),
                points_issued=0,
                payment_method=payment_method,
                status='completed',
                description='Charge transaction'
            )
            
            return Response({
                'success': True,
                'message': f'Charged {amount} yen',
                'transaction_id': transaction.transaction_id
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class ChargeHistoryView(APIView):
    def get(self, request):
        transactions = PointTransaction.objects.filter(
            amount__gt=0
        ).order_by('-transaction_date')[:50]
        
        serializer = PointTransactionSerializer(transactions, many=True)
        return Response({
            'success': True,
            'transactions': serializer.data
        })


class DashboardStatsView(APIView):
    def get(self, request):
        total_users = User.objects.count()
        total_points = sum(User.objects.values_list('points', flat=True))
        total_transactions = PointTransaction.objects.count()
        today_transactions = PointTransaction.objects.filter(
            transaction_date__date=timezone.now().date()
        ).count()
        
        return Response({
            'success': True,
            'stats': {
                'total_users': total_users,
                'total_points_granted': total_points,
                'total_revenue': sum(PointTransaction.objects.filter(amount__gt=0).values_list('amount', flat=True)),
                'average_rating': 4.8,
                'today_transactions': today_transactions,
                'monthly_growth': 12.5
            }
        })


# === ギフト関連API ===

class GiftCategoryListView(generics.ListAPIView):
    queryset = GiftCategory.objects.filter(is_active=True)
    serializer_class = GiftCategorySerializer
    permission_classes = [IsAuthenticated]


class GiftListView(generics.ListAPIView):
    serializer_class = GiftSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Gift.objects.filter(status='active')
        
        # カテゴリでフィルタ
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # ギフトタイプでフィルタ
        gift_type = self.request.query_params.get('type')
        if gift_type:
            queryset = queryset.filter(gift_type=gift_type)
        
        # 在庫有りのみ
        in_stock = self.request.query_params.get('in_stock')
        if in_stock == 'true':
            queryset = queryset.filter(
                models.Q(unlimited_stock=True) | models.Q(stock_quantity__gt=0)
            )
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # 在庫状況を追加
        for item in serializer.data:
            gift = Gift.objects.get(id=item['id'])
            item['is_available'] = gift.is_available()
        
        return Response({
            'success': True,
            'gifts': serializer.data,
            'total_count': queryset.count()
        })


class GiftDetailView(generics.RetrieveAPIView):
    queryset = Gift.objects.all()
    serializer_class = GiftSerializer
    permission_classes = [IsAuthenticated]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        data['is_available'] = instance.is_available()
        
        return Response({
            'success': True,
            'gift': data
        })


class GiftExchangeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """ギフト交換処理"""
        serializer = GiftExchangeRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        gift_id = serializer.validated_data['gift_id']
        user = request.user
        
        try:
            gift = Gift.objects.get(id=gift_id)
        except Gift.DoesNotExist:
            return Response({
                'success': False,
                'error': 'ギフトが見つかりません'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # ギフトの利用可能性をチェック
        if not gift.is_available():
            return Response({
                'success': False,
                'error': 'このギフトは現在交換できません'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # ユーザーのポイント残高をチェック
        if user.points < gift.points_required:
            return Response({
                'success': False,
                'error': f'ポイントが不足しています（必要: {gift.points_required}pt, 所持: {user.points}pt）'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 在庫をチェック
        if not gift.unlimited_stock and gift.stock_quantity <= 0:
            return Response({
                'success': False,
                'error': '在庫が不足しています'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # トランザクション内で処理
            from django.db import transaction
            with transaction.atomic():
                # ポイントを減算
                user.points -= gift.points_required
                user.save()
                
                # 在庫を減らす
                if not gift.unlimited_stock:
                    gift.stock_quantity -= 1
                    gift.save()
                
                # 交換回数を増やす
                gift.exchange_count += 1
                gift.save()
                
                # 交換記録を作成
                exchange = GiftExchange.objects.create(
                    user=user,
                    gift=gift,
                    points_spent=gift.points_required,
                    exchange_code=GiftExchange().generate_exchange_code(),
                    delivery_method=serializer.validated_data.get('delivery_method', ''),
                    delivery_address=serializer.validated_data.get('delivery_address', ''),
                    recipient_name=serializer.validated_data.get('recipient_name', ''),
                    recipient_email=serializer.validated_data.get('recipient_email', ''),
                    recipient_phone=serializer.validated_data.get('recipient_phone', ''),
                    notes=serializer.validated_data.get('notes', '')
                )
                
                # デジタルギフトの場合、即座に処理
                if gift.gift_type == 'digital':
                    exchange.status = 'completed'
                    exchange.processed_at = timezone.now()
                    exchange.digital_code = self._generate_digital_code(gift)
                    exchange.save()
                
                # ポイント取引記録を作成
                PointTransaction.objects.create(
                    user=user,
                    store=Store.objects.first(),
                    transaction_id=f"GFT-{exchange.exchange_code}",
                    amount=0,
                    points_issued=-gift.points_required,
                    payment_method='gift_exchange',
                    status='completed',
                    description=f'ギフト交換: {gift.name}'
                )
                
                # PDF領収書の生成
                pdf_data = None
                try:
                    exchange_data = {
                        'exchange_code': exchange.exchange_code,
                        'user_name': f"{user.first_name} {user.last_name}".strip() or user.username,
                        'user_email': user.email,
                        'gift_name': gift.name,
                        'provider_name': gift.provider_name,
                        'points_spent': exchange.points_spent,
                        'original_price': float(gift.original_price),
                        'exchange_date': exchange.exchanged_at.isoformat(),
                        'digital_code': exchange.digital_code if gift.gift_type == 'digital' else None,
                        'recipient_email': exchange.recipient_email,
                        'recipient_name': exchange.recipient_name,
                    }
                    
                    pdf_data = generate_gift_receipt_pdf(exchange_data)
                    logger.info(f"PDF receipt generated for exchange {exchange.exchange_code}")
                    
                except Exception as e:
                    logger.error(f"Failed to generate PDF receipt: {e}")
                
                # メール通知の送信
                try:
                    email_sent = send_gift_exchange_notification(exchange_data, pdf_data)
                    if email_sent:
                        logger.info(f"Email notification sent for exchange {exchange.exchange_code}")
                    else:
                        logger.warning(f"Failed to send email notification for exchange {exchange.exchange_code}")
                except Exception as e:
                    logger.error(f"Failed to send email notification: {e}")
                
                serializer = GiftExchangeSerializer(exchange)
                response_data = {
                    'success': True,
                    'message': 'ギフト交換が完了しました',
                    'exchange': serializer.data,
                    'remaining_points': user.points
                }
                
                # PDF領収書のダウンロードリンクを含める（開発時）
                if pdf_data:
                    response_data['pdf_available'] = True
                    
                return Response(response_data, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response({
                'success': False,
                'error': f'交換処理中にエラーが発生しました: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _generate_digital_code(self, gift):
        """デジタルギフトコード生成（モック）"""
        import random
        import string
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=16))


class GiftExchangeHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """ギフト交換履歴取得"""
        exchanges = GiftExchange.objects.filter(user=request.user)
        serializer = GiftExchangeSerializer(exchanges, many=True)
        
        return Response({
            'success': True,
            'exchanges': serializer.data,
            'total_count': exchanges.count()
        })


class GiftExchangeDetailView(generics.RetrieveAPIView):
    queryset = GiftExchange.objects.all()
    serializer_class = GiftExchangeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return GiftExchange.objects.filter(user=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'exchange': serializer.data
        })


# === アカウントランク管理API ===

class AccountRankListCreateView(generics.ListCreateAPIView):
    """アカウントランク一覧・作成"""
    queryset = AccountRank.objects.all()
    serializer_class = AccountRankSerializer
    permission_classes = [IsAuthenticated]


class AccountRankDetailView(generics.RetrieveUpdateDestroyAPIView):
    """アカウントランク詳細・更新・削除"""
    queryset = AccountRank.objects.all()
    serializer_class = AccountRankSerializer
    permission_classes = [IsAuthenticated]


# === 友達機能API ===

class FriendshipListView(APIView):
    """友達一覧取得"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # 承認済みの友達関係を取得
        friendships = Friendship.objects.filter(
            models.Q(requester=user) | models.Q(addressee=user),
            status='accepted'
        )
        
        serializer = FriendshipSerializer(friendships, many=True)
        return Response({
            'success': True,
            'friendships': serializer.data,
            'total_count': friendships.count()
        })


class SendFriendRequestView(APIView):
    """友達申請送信"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = FriendRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        target_user = serializer.validated_data['user_identifier']
        requester = request.user
        
        # 自分に送信はできない
        if target_user == requester:
            return Response({
                'success': False,
                'error': '自分に友達申請はできません'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 既存の友達関係をチェック
        existing = Friendship.objects.filter(
            models.Q(requester=requester, addressee=target_user) |
            models.Q(requester=target_user, addressee=requester)
        ).first()
        
        if existing:
            return Response({
                'success': False,
                'error': '既に友達関係が存在します'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 友達上限チェック
        rank = requester.get_current_rank()
        if rank:
            friend_count = Friendship.objects.filter(
                models.Q(requester=requester) | models.Q(addressee=requester),
                status='accepted'
            ).count()
            
            if friend_count >= rank.max_friends:
                return Response({
                    'success': False,
                    'error': f'友達上限({rank.max_friends}人)に達しています'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # 友達申請作成
        friendship = Friendship.objects.create(
            requester=requester,
            addressee=target_user
        )
        
        # 通知作成
        Notification.objects.create(
            user=target_user,
            notification_type='friend_request',
            title='友達申請が届きました',
            message=f'{requester.first_name} {requester.last_name}さんから友達申請が届きました',
            data={'friendship_id': friendship.id}
        )
        
        serializer = FriendshipSerializer(friendship)
        return Response({
            'success': True,
            'message': '友達申請を送信しました',
            'friendship': serializer.data
        }, status=status.HTTP_201_CREATED)


class RespondFriendRequestView(APIView):
    """友達申請への応答"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, friendship_id):
        action = request.data.get('action')  # 'accept' or 'decline'
        
        if action not in ['accept', 'decline']:
            return Response({
                'success': False,
                'error': 'actionは"accept"または"decline"である必要があります'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            friendship = Friendship.objects.get(
                id=friendship_id,
                addressee=request.user,
                status='pending'
            )
        except Friendship.DoesNotExist:
            return Response({
                'success': False,
                'error': '申請が見つかりません'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # ステータス更新
        friendship.status = 'accepted' if action == 'accept' else 'declined'
        friendship.save()
        
        # 通知作成
        if action == 'accept':
            Notification.objects.create(
                user=friendship.requester,
                notification_type='friend_accepted',
                title='友達申請が承認されました',
                message=f'{request.user.first_name} {request.user.last_name}さんが友達申請を承認しました',
                data={'friendship_id': friendship.id}
            )
        
        serializer = FriendshipSerializer(friendship)
        return Response({
            'success': True,
            'message': '承認しました' if action == 'accept' else '拒否しました',
            'friendship': serializer.data
        })


# === ポイント送受信API ===

class SendPointsView(APIView):
    """ポイント送信"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = PointTransferRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        sender = request.user
        receiver = serializer.validated_data['receiver_identifier']
        amount = serializer.validated_data['amount']
        message = serializer.validated_data.get('message', '')
        
        # 自分に送信はできない
        if receiver == sender:
            return Response({
                'success': False,
                'error': '自分にポイントは送信できません'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 友達関係をチェック
        friendship = Friendship.objects.filter(
            models.Q(requester=sender, addressee=receiver) |
            models.Q(requester=receiver, addressee=sender),
            status='accepted'
        ).first()
        
        if not friendship:
            return Response({
                'success': False,
                'error': '友達関係にないユーザーには送信できません'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # ランクと制限をチェック
        rank = sender.get_current_rank()
        if not rank:
            return Response({
                'success': False,
                'error': 'アカウントランクが設定されていません'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 日次送信制限チェック
        today = timezone.now().date()
        daily_sent = PointTransfer.objects.filter(
            sender=sender,
            created_at__date=today,
            status__in=['pending', 'accepted']
        ).aggregate(total=models.Sum('amount'))['total'] or 0
        
        if daily_sent + amount > rank.daily_send_limit:
            return Response({
                'success': False,
                'error': f'日次送信上限({rank.daily_send_limit}pt)を超えます'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 手数料計算
        fee = int(amount * rank.send_fee_rate)
        total_cost = amount + fee
        
        # 残高チェック
        if sender.points < total_cost:
            return Response({
                'success': False,
                'error': f'ポイント残高が不足しています（必要: {total_cost}pt）'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # ポイント送信処理
        from django.db import transaction
        with transaction.atomic():
            # 送信者からポイントを減算
            sender.points -= total_cost
            sender.save()
            
            # 送信記録作成
            transfer = PointTransfer.objects.create(
                sender=sender,
                receiver=receiver,
                amount=amount,
                fee=fee,
                message=message,
                expires_at=timezone.now() + timedelta(days=7)
            )
            
            # 通知作成
            Notification.objects.create(
                user=receiver,
                notification_type='point_received',
                title='ポイントが送られました',
                message=f'{sender.first_name} {sender.last_name}さんから{amount}ptが送られました',
                data={'transfer_id': transfer.transfer_id}
            )
        
        serializer = PointTransferSerializer(transfer)
        return Response({
            'success': True,
            'message': 'ポイントを送信しました',
            'transfer': serializer.data,
            'remaining_points': sender.points
        }, status=status.HTTP_201_CREATED)


class AcceptPointsView(APIView):
    """ポイント受取"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, transfer_id):
        try:
            transfer = PointTransfer.objects.get(
                transfer_id=transfer_id,
                receiver=request.user
            )
        except PointTransfer.DoesNotExist:
            return Response({
                'success': False,
                'error': '送信が見つかりません'
            }, status=status.HTTP_404_NOT_FOUND)
        
        success, message = transfer.accept_transfer()
        
        if success:
            # 送信者に通知
            Notification.objects.create(
                user=transfer.sender,
                notification_type='point_accepted',
                title='ポイントが受け取られました',
                message=f'{request.user.first_name} {request.user.last_name}さんがポイントを受け取りました',
                data={'transfer_id': transfer.transfer_id}
            )
            
            serializer = PointTransferSerializer(transfer)
            return Response({
                'success': True,
                'message': message,
                'transfer': serializer.data
            })
        else:
            return Response({
                'success': False,
                'error': message
            }, status=status.HTTP_400_BAD_REQUEST)


class PointTransferHistoryView(APIView):
    """ポイント送受信履歴"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        transfer_type = request.query_params.get('type', 'all')  # 'sent', 'received', 'all'
        
        if transfer_type == 'sent':
            transfers = PointTransfer.objects.filter(sender=user)
        elif transfer_type == 'received':
            transfers = PointTransfer.objects.filter(receiver=user)
        else:
            transfers = PointTransfer.objects.filter(
                models.Q(sender=user) | models.Q(receiver=user)
            )
        
        transfers = transfers.order_by('-created_at')
        serializer = PointTransferSerializer(transfers, many=True)
        
        return Response({
            'success': True,
            'transfers': serializer.data,
            'total_count': transfers.count()
        })


# === 通知API ===

class NotificationListView(APIView):
    """通知一覧"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        unread_count = notifications.filter(is_read=False).count()
        
        serializer = NotificationSerializer(notifications, many=True)
        return Response({
            'success': True,
            'notifications': serializer.data,
            'unread_count': unread_count
        })


class MarkNotificationReadView(APIView):
    """通知既読"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=request.user
            )
            notification.is_read = True
            notification.save()
            
            return Response({
                'success': True,
                'message': '既読にしました'
            })
        except Notification.DoesNotExist:
            return Response({
                'success': False,
                'error': '通知が見つかりません'
            }, status=status.HTTP_404_NOT_FOUND)
