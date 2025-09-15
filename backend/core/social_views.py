from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from django.utils import timezone
from django.core.paginator import Paginator

from .social_models import (
    UserPrivacySettings, Friendship, SocialPost, SocialPostLike, 
    SocialPostComment, SocialPostShare, UserBlock, DetailedReview, ReviewHelpful
)
from .social_serializers import (
    UserPrivacySettingsSerializer, FriendshipSerializer, 
    SocialPostSerializer, SocialPostLikeSerializer,
    SocialPostCommentSerializer, DetailedReviewSerializer
)
from .models import User, Store, Notification


class PrivacySettingsViewSet(viewsets.ModelViewSet):
    """ユーザーのプライバシー設定管理API"""
    
    serializer_class = UserPrivacySettingsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserPrivacySettings.objects.filter(user=self.request.user)
    
    def get_object(self):
        """現在のユーザーのプライバシー設定を取得または作成"""
        obj, created = UserPrivacySettings.objects.get_or_create(
            user=self.request.user,
            defaults={
                'profile_name_visibility': 'friends',
                'profile_avatar_visibility': 'public',
                'profile_bio_visibility': 'friends',
                'points_total_visibility': 'private',
                'friend_requests_accept': 'all',
                'messages_accept': 'friends',
            }
        )
        return obj
    
    def list(self):
        """プライバシー設定の取得"""
        settings = self.get_object()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        """プライバシー設定の更新"""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'プライバシー設定を更新しました',
                'data': serializer.data
            })
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def reset_to_private(self, request):
        """すべての設定を非公開に戻す"""
        settings = self.get_object()
        
        # すべてを非公開に設定
        private_settings = {
            'profile_name_visibility': 'private',
            'profile_avatar_visibility': 'private',
            'profile_bio_visibility': 'private',
            'profile_location_visibility': 'private',
            'profile_age_visibility': 'private',
            'profile_gender_visibility': 'private',
            'points_total_visibility': 'private',
            'points_recent_visibility': 'private',
            'stores_visited_visibility': 'private',
            'reviews_posted_visibility': 'private',
            'gifts_received_visibility': 'private',
            'achievements_visibility': 'private',
            'friend_requests_accept': 'none',
            'messages_accept': 'none',
            'post_comments_allow': 'private',
            'post_reactions_allow': 'private',
            'friend_list_visibility': 'private',
            'online_status_visibility': 'private',
        }
        
        for field, value in private_settings.items():
            setattr(settings, field, value)
        
        settings.save()
        
        serializer = self.get_serializer(settings)
        return Response({
            'success': True,
            'message': 'すべての設定を非公開にしました',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['post'])
    def reset_to_recommended(self, request):
        """推奨設定に戻す"""
        settings = self.get_object()
        
        # 推奨設定（プライバシーとソーシャル性のバランス）
        recommended_settings = {
            'profile_name_visibility': 'friends',
            'profile_avatar_visibility': 'public',
            'profile_bio_visibility': 'friends',
            'profile_location_visibility': 'friends',
            'profile_age_visibility': 'private',
            'profile_gender_visibility': 'private',
            'points_total_visibility': 'friends',
            'points_recent_visibility': 'private',
            'stores_visited_visibility': 'limited',
            'reviews_posted_visibility': 'public',
            'gifts_received_visibility': 'friends',
            'achievements_visibility': 'public',
            'friend_requests_accept': 'all',
            'messages_accept': 'friends',
            'post_comments_allow': 'friends',
            'post_reactions_allow': 'public',
            'friend_list_visibility': 'friends',
            'online_status_visibility': 'friends',
        }
        
        for field, value in recommended_settings.items():
            setattr(settings, field, value)
        
        settings.save()
        
        serializer = self.get_serializer(settings)
        return Response({
            'success': True,
            'message': '推奨設定を適用しました',
            'data': serializer.data
        })


class FriendshipViewSet(viewsets.ModelViewSet):
    """フレンド関係管理API"""
    
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Friendship.objects.filter(
            Q(from_user=user) | Q(to_user=user)
        ).select_related('from_user', 'to_user')
    
    @action(detail=False, methods=['get'])
    def friends_list(self, request):
        """承認済みフレンドの一覧"""
        user = request.user
        
        # 承認済みのフレンド関係を取得
        friendships = Friendship.objects.filter(
            Q(from_user=user, status='accepted') | 
            Q(to_user=user, status='accepted')
        ).select_related('from_user', 'to_user')
        
        friends_data = []
        for friendship in friendships:
            # 自分以外のユーザーを取得
            friend = friendship.to_user if friendship.from_user == user else friendship.from_user
            
            # プライバシー設定を考慮したユーザー情報を取得
            friend_privacy = getattr(friend, 'privacy_settings', None)
            can_see_profile = self.can_view_user_profile(user, friend, friend_privacy)
            
            if can_see_profile:
                friends_data.append({
                    'id': friend.id,
                    'username': friend.username,
                    'member_id': friend.member_id,
                    'avatar': friend.avatar if self.can_see_avatar(user, friend, friend_privacy) else '',
                    'location': friend.location if self.can_see_location(user, friend, friend_privacy) else '',
                    'last_active_at': friend.last_active_at,
                    'friends_since': friendship.friends_since,
                    'category': friendship.category,
                    'is_favorite': friendship.is_favorite,
                    'is_online': self.can_see_online_status(user, friend, friend_privacy),
                })
        
        return Response({
            'success': True,
            'friends_count': len(friends_data),
            'friends': friends_data
        })
    
    @action(detail=False, methods=['get'])
    def friend_requests(self, request):
        """受信したフレンド申請の一覧"""
        user = request.user
        
        # 自分宛の申請中のフレンド申請
        pending_requests = Friendship.objects.filter(
            to_user=user,
            status='pending'
        ).select_related('from_user').order_by('-created_at')
        
        requests_data = []
        for friendship in pending_requests:
            requests_data.append({
                'id': friendship.id,
                'from_user': {
                    'id': friendship.from_user.id,
                    'username': friendship.from_user.username,
                    'member_id': friendship.from_user.member_id,
                    'avatar': friendship.from_user.avatar,
                },
                'message': friendship.message,
                'created_at': friendship.created_at
            })
        
        return Response({
            'success': True,
            'requests_count': len(requests_data),
            'requests': requests_data
        })
    
    @action(detail=False, methods=['post'])
    def send_request(self, request):
        """フレンド申請を送信"""
        user = request.user
        target_user_id = request.data.get('user_id')
        message = request.data.get('message', '')
        
        if not target_user_id:
            return Response({
                'success': False,
                'error': 'user_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            target_user = User.objects.get(id=target_user_id)
        except User.DoesNotExist:
            return Response({
                'success': False,
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # 自分自身に申請していないかチェック
        if user == target_user:
            return Response({
                'success': False,
                'error': '自分自身にフレンド申請はできません'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 既存の関係をチェック
        existing_friendship = Friendship.objects.filter(
            Q(from_user=user, to_user=target_user) |
            Q(from_user=target_user, to_user=user)
        ).first()
        
        if existing_friendship:
            if existing_friendship.status == 'accepted':
                return Response({
                    'success': False,
                    'error': '既にフレンドです'
                }, status=status.HTTP_400_BAD_REQUEST)
            elif existing_friendship.status == 'pending':
                return Response({
                    'success': False,
                    'error': 'フレンド申請は既に送信済みです'
                }, status=status.HTTP_400_BAD_REQUEST)
            elif existing_friendship.status == 'blocked':
                return Response({
                    'success': False,
                    'error': 'この操作はできません'
                }, status=status.HTTP_403_FORBIDDEN)
        
        # ブロックされていないかチェック
        if UserBlock.objects.filter(blocker=target_user, blocked=user).exists():
            return Response({
                'success': False,
                'error': 'この操作はできません'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # 相手のプライバシー設定をチェック
        target_privacy = getattr(target_user, 'privacy_settings', None)
        if target_privacy and target_privacy.friend_requests_accept == 'none':
            return Response({
                'success': False,
                'error': 'この方はフレンド申請を受け付けていません'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # フレンド申請を作成
        friendship = Friendship.objects.create(
            from_user=user,
            to_user=target_user,
            message=message[:500] if message else ''  # メッセージの長さ制限
        )
        
        # 通知を送信
        Notification.objects.create(
            user=target_user,
            notification_type='friend_request',
            title='新しいフレンド申請',
            message=f'{user.username}さんからフレンド申請が届きました',
            metadata={
                'from_user_id': user.id,
                'friendship_id': friendship.id
            }
        )
        
        serializer = self.get_serializer(friendship)
        return Response({
            'success': True,
            'message': 'フレンド申請を送信しました',
            'data': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def accept_request(self, request, pk=None):
        """フレンド申請を承認"""
        friendship = get_object_or_404(Friendship, pk=pk)
        
        # 承認権限チェック
        if friendship.to_user != request.user:
            return Response({
                'success': False,
                'error': 'この申請を承認する権限がありません'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if friendship.status != 'pending':
            return Response({
                'success': False,
                'error': '申請中の関係ではありません'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 申請を承認
        friendship.approve()
        
        # 承認通知を送信
        Notification.objects.create(
            user=friendship.from_user,
            notification_type='friend_accepted',
            title='フレンド申請が承認されました',
            message=f'{request.user.username}さんがフレンド申請を承認しました',
            metadata={
                'accepted_by_user_id': request.user.id,
                'friendship_id': friendship.id
            }
        )
        
        serializer = self.get_serializer(friendship)
        return Response({
            'success': True,
            'message': 'フレンド申請を承認しました',
            'data': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def decline_request(self, request, pk=None):
        """フレンド申請を拒否"""
        friendship = get_object_or_404(Friendship, pk=pk)
        
        # 拒否権限チェック
        if friendship.to_user != request.user:
            return Response({
                'success': False,
                'error': 'この申請を拒否する権限がありません'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if friendship.status != 'pending':
            return Response({
                'success': False,
                'error': '申請中の関係ではありません'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 申請を拒否
        friendship.decline()
        
        serializer = self.get_serializer(friendship)
        return Response({
            'success': True,
            'message': 'フレンド申請を拒否しました',
            'data': serializer.data
        })
    
    @action(detail=True, methods=['delete'])
    def remove_friend(self, request, pk=None):
        """フレンド関係を解除"""
        friendship = get_object_or_404(Friendship, pk=pk)
        user = request.user
        
        # 解除権限チェック
        if friendship.from_user != user and friendship.to_user != user:
            return Response({
                'success': False,
                'error': 'このフレンド関係を解除する権限がありません'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if friendship.status != 'accepted':
            return Response({
                'success': False,
                'error': 'フレンド関係にありません'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # フレンド関係を削除（双方向の関係を削除）
        other_user = friendship.to_user if friendship.from_user == user else friendship.from_user
        
        Friendship.objects.filter(
            Q(from_user=user, to_user=other_user) |
            Q(from_user=other_user, to_user=user)
        ).delete()
        
        # フレンド数を更新
        user.friends_count = max(0, user.friends_count - 1)
        other_user.friends_count = max(0, other_user.friends_count - 1)
        user.save()
        other_user.save()
        
        return Response({
            'success': True,
            'message': 'フレンド関係を解除しました'
        })
    
    @action(detail=True, methods=['post'])
    def block_user(self, request, pk=None):
        """ユーザーをブロック"""
        friendship = get_object_or_404(Friendship, pk=pk)
        user = request.user
        
        # ブロック権限チェック
        if friendship.from_user != user and friendship.to_user != user:
            return Response({
                'success': False,
                'error': 'このユーザーをブロックする権限がありません'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # ブロック対象ユーザーを特定
        blocked_user = friendship.to_user if friendship.from_user == user else friendship.from_user
        
        # ブロック関係を作成
        UserBlock.objects.get_or_create(
            blocker=user,
            blocked=blocked_user,
            defaults={
                'reason': request.data.get('reason', 'personal_reasons'),
                'notes': request.data.get('notes', '')
            }
        )
        
        # フレンド関係をブロック状態に更新
        friendship.block()
        
        return Response({
            'success': True,
            'message': 'ユーザーをブロックしました'
        })
    
    def can_view_user_profile(self, viewer, target, target_privacy):
        """プロフィール表示権限をチェック"""
        if not target_privacy:
            return True  # プライバシー設定がない場合は表示
        
        if target == viewer:
            return True  # 本人は常に表示可能
        
        if target_privacy.profile_name_visibility == 'public':
            return True
        elif target_privacy.profile_name_visibility == 'friends':
            return self.are_friends(viewer, target)
        else:
            return False
    
    def can_see_avatar(self, viewer, target, target_privacy):
        """アバター表示権限をチェック"""
        if not target_privacy:
            return True
        
        if target_privacy.profile_avatar_visibility == 'public':
            return True
        elif target_privacy.profile_avatar_visibility == 'friends':
            return self.are_friends(viewer, target)
        else:
            return False
    
    def can_see_location(self, viewer, target, target_privacy):
        """位置情報表示権限をチェック"""
        if not target_privacy:
            return False  # デフォルトは非表示
        
        if target_privacy.profile_location_visibility == 'public':
            return True
        elif target_privacy.profile_location_visibility == 'friends':
            return self.are_friends(viewer, target)
        else:
            return False
    
    def can_see_online_status(self, viewer, target, target_privacy):
        """オンライン状態表示権限をチェック"""
        if not target_privacy:
            return False
        
        if target_privacy.online_status_visibility == 'public':
            return True
        elif target_privacy.online_status_visibility == 'friends':
            return self.are_friends(viewer, target)
        else:
            return False
    
    def are_friends(self, user1, user2):
        """2人のユーザーがフレンド関係かチェック"""
        return Friendship.objects.filter(
            Q(from_user=user1, to_user=user2, status='accepted') |
            Q(from_user=user2, to_user=user1, status='accepted')
        ).exists()


class UserSearchViewSet(viewsets.ViewSet):
    """ユーザー検索API"""
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """ユーザー検索"""
        query = request.GET.get('q', '').strip()
        
        if not query:
            return Response({
                'success': False,
                'error': '検索クエリが必要です'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(query) < 2:
            return Response({
                'success': False,
                'error': '検索クエリは2文字以上である必要があります'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # ブロックしているユーザー・されているユーザーを除外
        blocked_user_ids = set()
        blocks = UserBlock.objects.filter(
            Q(blocker=request.user) | Q(blocked=request.user)
        ).values_list('blocker_id', 'blocked_id')
        
        for blocker_id, blocked_id in blocks:
            blocked_user_ids.add(blocker_id)
            blocked_user_ids.add(blocked_id)
        
        # ユーザー検索（member_id, username, email での部分一致）
        users = User.objects.filter(
            Q(member_id__icontains=query) |
            Q(username__icontains=query) |
            Q(email__icontains=query),
            status='active'
        ).exclude(
            id__in=blocked_user_ids
        ).exclude(
            id=request.user.id
        )[:20]  # 最大20件まで
        
        results = []
        for user in users:
            # プライバシー設定を考慮した情報表示
            privacy = getattr(user, 'privacy_settings', None)
            
            if not privacy or privacy.profile_name_visibility in ['public', 'friends']:
                results.append({
                    'id': user.id,
                    'username': user.username,
                    'member_id': user.member_id,
                    'avatar': user.avatar if (not privacy or privacy.profile_avatar_visibility == 'public') else '',
                    'location': user.location if (privacy and privacy.profile_location_visibility == 'public') else '',
                    'friends_count': user.friends_count,
                    'is_friend': self.is_friend(request.user, user),
                })
        
        return Response({
            'success': True,
            'query': query,
            'results_count': len(results),
            'results': results
        })
    
    def is_friend(self, user1, user2):
        """フレンド関係かチェック"""
        return Friendship.objects.filter(
            Q(from_user=user1, to_user=user2, status='accepted') |
            Q(from_user=user2, to_user=user1, status='accepted')
        ).exists()