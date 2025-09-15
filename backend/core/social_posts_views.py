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
    SocialPostSerializer, SocialPostLikeSerializer,
    SocialPostCommentSerializer, DetailedReviewSerializer
)
from .models import User, Store, Notification


class SocialPostViewSet(viewsets.ModelViewSet):
    """ソーシャル投稿管理API"""
    
    serializer_class = SocialPostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """プライバシー設定を考慮した投稿取得"""
        user = self.request.user
        
        # フレンドリストを取得
        friend_ids = set()
        friendships = Friendship.objects.filter(
            Q(from_user=user, status='accepted') | 
            Q(to_user=user, status='accepted')
        ).values_list('from_user_id', 'to_user_id')
        
        for from_id, to_id in friendships:
            friend_ids.add(from_id if from_id != user.id else to_id)
        
        # ブロックユーザーを除外
        blocked_ids = set()
        blocks = UserBlock.objects.filter(
            Q(blocker=user) | Q(blocked=user)
        ).values_list('blocker_id', 'blocked_id')
        
        for blocker_id, blocked_id in blocks:
            blocked_ids.add(blocker_id)
            blocked_ids.add(blocked_id)
        
        # 表示可能な投稿を取得
        queryset = SocialPost.objects.filter(
            is_deleted=False
        ).exclude(
            author_id__in=blocked_ids
        ).select_related('author', 'location').prefetch_related(
            'likes', 'comments', 'shares'
        )
        
        # プライバシー設定を考慮してフィルタリング
        visible_posts = []
        for post in queryset:
            if self.can_view_post(user, post, friend_ids):
                visible_posts.append(post.id)
        
        return SocialPost.objects.filter(id__in=visible_posts).order_by('-created_at')
    
    def can_view_post(self, user, post, friend_ids=None):
        """投稿の表示権限をチェック"""
        if post.author == user:
            return True
        
        if post.visibility == 'public':
            return True
        elif post.visibility == 'friends':
            if friend_ids is None:
                return self.are_friends(user, post.author)
            return post.author_id in friend_ids
        elif post.visibility == 'limited':
            return post.allowed_users.filter(id=user.id).exists()
        else:  # private
            return False
    
    @action(detail=False, methods=['get'])
    def feed(self, request):
        """フレンドのフィード取得"""
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        
        # ページネーション
        queryset = self.get_queryset()
        paginator = Paginator(queryset, page_size)
        
        try:
            posts_page = paginator.page(page)
        except:
            posts_page = paginator.page(1)
        
        serializer = self.get_serializer(posts_page.object_list, many=True)
        
        return Response({
            'success': True,
            'page': page,
            'page_size': page_size,
            'total_pages': paginator.num_pages,
            'total_posts': paginator.count,
            'has_next': posts_page.has_next(),
            'has_previous': posts_page.has_previous(),
            'posts': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def my_posts(self, request):
        """自分の投稿一覧"""
        posts = SocialPost.objects.filter(
            author=request.user,
            is_deleted=False
        ).order_by('-created_at')
        
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        paginator = Paginator(posts, page_size)
        
        try:
            posts_page = paginator.page(page)
        except:
            posts_page = paginator.page(1)
        
        serializer = self.get_serializer(posts_page.object_list, many=True)
        
        return Response({
            'success': True,
            'page': page,
            'total_pages': paginator.num_pages,
            'total_posts': paginator.count,
            'posts': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def user_posts(self, request):
        """特定ユーザーの投稿一覧"""
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response({
                'success': False,
                'error': 'user_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({
                'success': False,
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # フレンド関係をチェック
        friend_ids = set()
        if target_user != request.user:
            friendships = Friendship.objects.filter(
                Q(from_user=request.user, status='accepted') | 
                Q(to_user=request.user, status='accepted')
            ).values_list('from_user_id', 'to_user_id')
            
            for from_id, to_id in friendships:
                friend_ids.add(from_id if from_id != request.user.id else to_id)
        
        # 表示可能な投稿を取得
        posts = SocialPost.objects.filter(
            author=target_user,
            is_deleted=False
        ).order_by('-created_at')
        
        visible_posts = []
        for post in posts:
            if self.can_view_post(request.user, post, friend_ids):
                visible_posts.append(post)
        
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        paginator = Paginator(visible_posts, page_size)
        
        try:
            posts_page = paginator.page(page)
        except:
            posts_page = paginator.page(1)
        
        serializer = self.get_serializer(posts_page.object_list, many=True)
        
        return Response({
            'success': True,
            'user': {
                'id': target_user.id,
                'username': target_user.username,
                'avatar': target_user.avatar
            },
            'posts': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        """投稿作成"""
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            post = serializer.save()
            
            # 投稿数をインクリメント
            request.user.last_active_at = timezone.now()
            request.user.save()
            
            return Response({
                'success': True,
                'message': '投稿を作成しました',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        """投稿編集"""
        instance = self.get_object()
        
        # 投稿者のみ編集可能
        if instance.author != request.user:
            return Response({
                'success': False,
                'error': 'この投稿を編集する権限がありません'
            }, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': '投稿を更新しました',
                'data': serializer.data
            })
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """投稿削除（論理削除）"""
        instance = self.get_object()
        
        # 投稿者のみ削除可能
        if instance.author != request.user:
            return Response({
                'success': False,
                'error': 'この投稿を削除する権限がありません'
            }, status=status.HTTP_403_FORBIDDEN)
        
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()
        
        # 投稿数をデクリメント
        request.user.posts_count = max(0, request.user.posts_count - 1)
        request.user.save()
        
        return Response({
            'success': True,
            'message': '投稿を削除しました'
        })
    
    @action(detail=True, methods=['post'])
    def pin(self, request, pk=None):
        """投稿をプロフィール上部に固定"""
        post = self.get_object()
        
        if post.author != request.user:
            return Response({
                'success': False,
                'error': 'この投稿を固定する権限がありません'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # 他の固定投稿を解除
        SocialPost.objects.filter(author=request.user, is_pinned=True).update(is_pinned=False)
        
        post.is_pinned = True
        post.save()
        
        return Response({
            'success': True,
            'message': '投稿を固定しました'
        })
    
    @action(detail=True, methods=['post'])
    def unpin(self, request, pk=None):
        """投稿の固定を解除"""
        post = self.get_object()
        
        if post.author != request.user:
            return Response({
                'success': False,
                'error': 'この投稿の固定を解除する権限がありません'
            }, status=status.HTTP_403_FORBIDDEN)
        
        post.is_pinned = False
        post.save()
        
        return Response({
            'success': True,
            'message': '投稿の固定を解除しました'
        })
    
    @action(detail=True, methods=['post'])
    def report(self, request, pk=None):
        """投稿を報告"""
        post = self.get_object()
        reason = request.data.get('reason', '')
        details = request.data.get('details', '')
        
        if post.author == request.user:
            return Response({
                'success': False,
                'error': '自分の投稿は報告できません'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 報告フラグを設定
        post.is_reported = True
        post.save()
        
        # 管理者に通知（実装は通知システム拡張時に詳細化）
        try:
            admin_user = User.objects.filter(role='admin').first()
            if admin_user:
                Notification.objects.create(
                    user=admin_user,
                    notification_type='admin_alert',
                    title='投稿が報告されました',
                    message=f'投稿ID:{post.id}が報告されました。理由:{reason}',
                    metadata={
                        'post_id': post.id,
                        'reported_by': request.user.id,
                        'reason': reason,
                        'details': details
                    }
                )
        except:
            pass  # 通知送信失敗時もエラーにしない
        
        return Response({
            'success': True,
            'message': '投稿を報告しました。運営チームが確認いたします。'
        })
    
    def are_friends(self, user1, user2):
        """フレンド関係かチェック"""
        return Friendship.objects.filter(
            Q(from_user=user1, to_user=user2, status='accepted') |
            Q(from_user=user2, to_user=user1, status='accepted')
        ).exists()


class PostInteractionViewSet(viewsets.ViewSet):
    """投稿への交流機能（いいね・コメント・シェア）"""
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """投稿にいいね"""
        try:
            post = SocialPost.objects.get(pk=pk, is_deleted=False)
        except SocialPost.DoesNotExist:
            return Response({
                'success': False,
                'error': '投稿が見つかりません'
            }, status=status.HTTP_404_NOT_FOUND)
        
        reaction_type = request.data.get('reaction_type', 'like')
        valid_reactions = ['like', 'love', 'laugh', 'wow', 'sad', 'angry']
        
        if reaction_type not in valid_reactions:
            return Response({
                'success': False,
                'error': f'無効なリアクションタイプです。利用可能: {valid_reactions}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 既存のいいねをチェック
        existing_like = SocialPostLike.objects.filter(
            user=request.user,
            post=post
        ).first()
        
        if existing_like:
            if existing_like.reaction_type == reaction_type:
                # 同じリアクションの場合は削除（いいね取り消し）
                existing_like.delete()
                post.likes_count = max(0, post.likes_count - 1)
                post.save()
                
                return Response({
                    'success': True,
                    'message': 'リアクションを取り消しました',
                    'action': 'removed',
                    'likes_count': post.likes_count
                })
            else:
                # 異なるリアクションの場合は更新
                existing_like.reaction_type = reaction_type
                existing_like.save()
                
                return Response({
                    'success': True,
                    'message': 'リアクションを変更しました',
                    'action': 'updated',
                    'reaction_type': reaction_type,
                    'likes_count': post.likes_count
                })
        else:
            # 新しいいいねを作成
            SocialPostLike.objects.create(
                user=request.user,
                post=post,
                reaction_type=reaction_type
            )
            post.likes_count += 1
            post.save()
            
            # 投稿者に通知（自分の投稿以外）
            if post.author != request.user:
                Notification.objects.create(
                    user=post.author,
                    notification_type='post_like',
                    title='投稿にリアクションがありました',
                    message=f'{request.user.username}さんがあなたの投稿にリアクションしました',
                    metadata={
                        'post_id': post.id,
                        'from_user_id': request.user.id,
                        'reaction_type': reaction_type
                    }
                )
            
            return Response({
                'success': True,
                'message': 'リアクションを送信しました',
                'action': 'added',
                'reaction_type': reaction_type,
                'likes_count': post.likes_count
            })
    
    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        """投稿にコメント"""
        try:
            post = SocialPost.objects.get(pk=pk, is_deleted=False)
        except SocialPost.DoesNotExist:
            return Response({
                'success': False,
                'error': '投稿が見つかりません'
            }, status=status.HTTP_404_NOT_FOUND)
        
        content = request.data.get('content', '').strip()
        parent_comment_id = request.data.get('parent_comment_id')
        
        if not content:
            return Response({
                'success': False,
                'error': 'コメント内容を入力してください'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(content) > 1000:
            return Response({
                'success': False,
                'error': 'コメントは1000文字以内で入力してください'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        parent_comment = None
        if parent_comment_id:
            try:
                parent_comment = SocialPostComment.objects.get(
                    id=parent_comment_id,
                    post=post,
                    is_deleted=False
                )
            except SocialPostComment.DoesNotExist:
                return Response({
                    'success': False,
                    'error': '親コメントが見つかりません'
                }, status=status.HTTP_404_NOT_FOUND)
        
        # コメント作成
        comment = SocialPostComment.objects.create(
            user=request.user,
            post=post,
            parent_comment=parent_comment,
            content=content
        )
        
        # 投稿のコメント数を更新
        post.comments_count += 1
        post.save()
        
        # 親コメントがある場合は返信数を更新
        if parent_comment:
            parent_comment.replies_count += 1
            parent_comment.save()
        
        # 投稿者に通知（自分の投稿以外）
        if post.author != request.user:
            Notification.objects.create(
                user=post.author,
                notification_type='post_comment',
                title='投稿にコメントがありました',
                message=f'{request.user.username}さんがあなたの投稿にコメントしました',
                metadata={
                    'post_id': post.id,
                    'comment_id': comment.id,
                    'from_user_id': request.user.id
                }
            )
        
        # 親コメントの投稿者に通知（返信の場合、自分以外）
        if parent_comment and parent_comment.user != request.user:
            Notification.objects.create(
                user=parent_comment.user,
                notification_type='comment_reply',
                title='コメントに返信がありました',
                message=f'{request.user.username}さんがあなたのコメントに返信しました',
                metadata={
                    'post_id': post.id,
                    'comment_id': comment.id,
                    'parent_comment_id': parent_comment.id,
                    'from_user_id': request.user.id
                }
            )
        
        serializer = SocialPostCommentSerializer(comment, context={'request': request})
        
        return Response({
            'success': True,
            'message': 'コメントを投稿しました',
            'data': serializer.data,
            'comments_count': post.comments_count
        })
    
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """投稿のコメント一覧"""
        try:
            post = SocialPost.objects.get(pk=pk, is_deleted=False)
        except SocialPost.DoesNotExist:
            return Response({
                'success': False,
                'error': '投稿が見つかりません'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # 親コメントのみ取得（返信は各コメントで取得）
        comments = SocialPostComment.objects.filter(
            post=post,
            parent_comment=None,
            is_deleted=False
        ).select_related('user').order_by('-created_at')
        
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        paginator = Paginator(comments, page_size)
        
        try:
            comments_page = paginator.page(page)
        except:
            comments_page = paginator.page(1)
        
        serializer = SocialPostCommentSerializer(
            comments_page.object_list, 
            many=True, 
            context={'request': request}
        )
        
        return Response({
            'success': True,
            'page': page,
            'total_pages': paginator.num_pages,
            'total_comments': paginator.count,
            'comments': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """投稿をシェア"""
        try:
            post = SocialPost.objects.get(pk=pk, is_deleted=False)
        except SocialPost.DoesNotExist:
            return Response({
                'success': False,
                'error': '投稿が見つかりません'
            }, status=status.HTTP_404_NOT_FOUND)
        
        share_type = request.data.get('share_type', 'repost')
        comment = request.data.get('comment', '').strip()
        
        valid_share_types = ['repost', 'quote', 'private', 'external']
        if share_type not in valid_share_types:
            return Response({
                'success': False,
                'error': f'無効なシェアタイプです。利用可能: {valid_share_types}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 既にシェア済みかチェック
        existing_share = SocialPostShare.objects.filter(
            user=request.user,
            post=post,
            share_type=share_type
        ).first()
        
        if existing_share:
            return Response({
                'success': False,
                'error': '既にシェア済みです'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # シェア作成
        share = SocialPostShare.objects.create(
            user=request.user,
            post=post,
            share_type=share_type,
            comment=comment[:500] if comment else ''
        )
        
        # 投稿のシェア数を更新
        post.shares_count += 1
        post.save()
        
        # 投稿者に通知（自分の投稿以外）
        if post.author != request.user:
            Notification.objects.create(
                user=post.author,
                notification_type='post_share',
                title='投稿がシェアされました',
                message=f'{request.user.username}さんがあなたの投稿をシェアしました',
                metadata={
                    'post_id': post.id,
                    'share_id': share.id,
                    'share_type': share_type,
                    'from_user_id': request.user.id
                }
            )
        
        return Response({
            'success': True,
            'message': '投稿をシェアしました',
            'shares_count': post.shares_count
        })