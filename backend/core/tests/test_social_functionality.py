from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch, Mock
import json

from ..social_models import (
    UserPrivacySettings, Friendship, SocialPost, PostComment, 
    PostLike, DetailedReview, Notification, NotificationPreference,
    BlockedUser, SecurityLog
)
from ..notification_service import (
    SocialNotificationService, SocialPointsService, SecurityMonitoringService
)

User = get_user_model()


class SocialModelsTestCase(TestCase):
    """ソーシャル機能のモデルテスト"""
    
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testuser1',
            email='test1@example.com',
            member_id='member1'
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            email='test2@example.com',
            member_id='member2'
        )
        
    def test_privacy_settings_creation(self):
        """プライバシー設定の作成テスト"""
        privacy = UserPrivacySettings.objects.create(
            user=self.user1,
            profile_name_visibility='friends',
            show_posts='private'
        )
        self.assertEqual(privacy.user, self.user1)
        self.assertEqual(privacy.profile_name_visibility, 'friends')
        self.assertEqual(privacy.show_posts, 'private')
        
    def test_friendship_creation(self):
        """フレンド関係の作成テスト"""
        friendship = Friendship.objects.create(
            requester=self.user1,
            receiver=self.user2,
            status='pending'
        )
        self.assertEqual(friendship.requester, self.user1)
        self.assertEqual(friendship.receiver, self.user2)
        self.assertEqual(friendship.status, 'pending')
        
    def test_friendship_acceptance(self):
        """フレンド申請承認テスト"""
        friendship = Friendship.objects.create(
            requester=self.user1,
            receiver=self.user2,
            status='pending'
        )
        
        friendship.accept()
        self.assertEqual(friendship.status, 'accepted')
        self.assertIsNotNone(friendship.accepted_at)
        
    def test_friendship_rejection(self):
        """フレンド申請拒否テスト"""
        friendship = Friendship.objects.create(
            requester=self.user1,
            receiver=self.user2,
            status='pending'
        )
        
        friendship.reject('not interested')
        self.assertEqual(friendship.status, 'rejected')
        self.assertEqual(friendship.rejection_reason, 'not interested')
        
    def test_social_post_creation(self):
        """ソーシャル投稿の作成テスト"""
        post = SocialPost.objects.create(
            author=self.user1,
            content='Test post content',
            privacy_level='friends'
        )
        self.assertEqual(post.author, self.user1)
        self.assertEqual(post.content, 'Test post content')
        self.assertEqual(post.privacy_level, 'friends')
        
    def test_post_like_functionality(self):
        """投稿いいね機能テスト"""
        post = SocialPost.objects.create(
            author=self.user1,
            content='Test post',
            privacy_level='public'
        )
        
        like = PostLike.objects.create(user=self.user2, post=post)
        self.assertEqual(like.user, self.user2)
        self.assertEqual(like.post, post)
        self.assertEqual(post.likes_count, 1)
        
    def test_post_comment_functionality(self):
        """投稿コメント機能テスト"""
        post = SocialPost.objects.create(
            author=self.user1,
            content='Test post',
            privacy_level='public'
        )
        
        comment = PostComment.objects.create(
            author=self.user2,
            post=post,
            content='Nice post!'
        )
        self.assertEqual(comment.author, self.user2)
        self.assertEqual(comment.post, post)
        self.assertEqual(comment.content, 'Nice post!')
        self.assertEqual(post.comments_count, 1)
        
    def test_blocked_user_functionality(self):
        """ブロック機能テスト"""
        block = BlockedUser.objects.create(
            blocker=self.user1,
            blocked=self.user2,
            reason='spam'
        )
        
        self.assertTrue(self.user2.is_blocked_by(self.user1))
        self.assertTrue(self.user1.has_blocked(self.user2))
        
        # ブロック解除
        block.is_active = False
        block.save()
        
        self.assertFalse(self.user2.is_blocked_by(self.user1))
        self.assertFalse(self.user1.has_blocked(self.user2))


class SocialNotificationTestCase(TestCase):
    """ソーシャル通知機能テスト"""
    
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testuser1',
            email='test1@example.com',
            member_id='member1'
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            email='test2@example.com',
            member_id='member2'
        )
        
    def test_friend_request_notification(self):
        """フレンド申請通知テスト"""
        notification = SocialNotificationService.notify_friend_request(
            requester=self.user1,
            receiver=self.user2
        )
        
        self.assertIsNotNone(notification)
        self.assertEqual(notification.user, self.user2)
        self.assertEqual(notification.actor, self.user1)
        self.assertEqual(notification.type, 'friend_request')
        
    def test_friend_accepted_notification(self):
        """フレンド承認通知テスト"""
        notification = SocialNotificationService.notify_friend_accepted(
            requester=self.user1,
            receiver=self.user2
        )
        
        self.assertIsNotNone(notification)
        self.assertEqual(notification.user, self.user1)
        self.assertEqual(notification.actor, self.user2)
        self.assertEqual(notification.type, 'friend_accepted')
        
    def test_post_interaction_notification(self):
        """投稿交流通知テスト"""
        post = SocialPost.objects.create(
            author=self.user1,
            content='Test post',
            privacy_level='public'
        )
        
        notification = SocialNotificationService.notify_post_interaction(
            post_author=self.user1,
            actor=self.user2,
            interaction_type='liked',
            post=post
        )
        
        self.assertIsNotNone(notification)
        self.assertEqual(notification.user, self.user1)
        self.assertEqual(notification.actor, self.user2)
        self.assertEqual(notification.type, 'post_liked')
        
    def test_notification_privacy_check(self):
        """通知プライバシーチェックテスト"""
        # プライベート設定
        UserPrivacySettings.objects.create(
            user=self.user1,
            allow_friend_requests='none'
        )
        
        notification = SocialNotificationService.notify_friend_request(
            requester=self.user2,
            receiver=self.user1
        )
        
        # プライベート設定により通知がブロックされる
        self.assertIsNone(notification)


class SocialPointsTestCase(TestCase):
    """ソーシャルポイント機能テスト"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            member_id='member1'
        )
        
    @patch('core.models.PointTransaction')
    def test_points_award_first_post(self, mock_transaction):
        """初回投稿ポイント付与テスト"""
        mock_transaction.objects.create.return_value = Mock(id=1)
        mock_transaction.objects.filter.return_value.exists.return_value = False
        
        result = SocialPointsService.award_points(
            user=self.user,
            activity_type='first_post'
        )
        
        self.assertIsNotNone(result)
        mock_transaction.objects.create.assert_called_once()
        
    @patch('core.models.PointTransaction')
    def test_points_award_duplicate_prevention(self, mock_transaction):
        """ポイント重複付与防止テスト"""
        # 既に初回投稿ポイントが付与済み
        mock_transaction.objects.filter.return_value.exists.return_value = True
        
        result = SocialPointsService.award_points(
            user=self.user,
            activity_type='first_post'
        )
        
        # 重複付与なし
        self.assertIsNone(result)
        
    @patch('core.models.PointTransaction')
    def test_rank_up_check(self, mock_transaction):
        """ランクアップチェックテスト"""
        # 総ポイント1000で Silver ランクに
        mock_aggregate = Mock()
        mock_aggregate.aggregate.return_value = {'total': 1000}
        mock_transaction.objects.filter.return_value = mock_aggregate
        
        initial_rank = self.user.rank
        SocialPointsService._check_rank_up(self.user)
        
        # ランクが変更されているかチェック
        self.user.refresh_from_db()
        self.assertEqual(self.user.rank, 'silver')


class SecurityMonitoringTestCase(TestCase):
    """セキュリティ監視機能テスト"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            member_id='member1'
        )
        
    @patch('core.social_models.Friendship.objects')
    def test_rapid_friend_requests_detection(self, mock_friendship):
        """高速フレンド申請検出テスト"""
        # 1時間以内に10件のフレンド申請
        mock_friendship.filter.return_value.count.return_value = 10
        
        result = SecurityMonitoringService.monitor_activity(
            user=self.user,
            activity_type='rapid_friend_requests'
        )
        
        # 不審な活動として検出される
        self.assertTrue(result)
        
    @patch('core.social_models.SocialPost.objects')
    def test_spam_posts_detection(self, mock_posts):
        """スパム投稿検出テスト"""
        # 10分間に5件の投稿
        mock_posts.filter.return_value.count.return_value = 5
        
        result = SecurityMonitoringService.monitor_activity(
            user=self.user,
            activity_type='spam_posts'
        )
        
        # 不審な活動として検出される
        self.assertTrue(result)
        
    def test_security_log_creation(self):
        """セキュリティログ作成テスト"""
        log = self.user.create_security_log(
            action='test_action',
            severity='warning',
            details={'test': 'data'},
            ip_address='192.168.1.1'
        )
        
        self.assertEqual(log.user, self.user)
        self.assertEqual(log.action, 'test_action')
        self.assertEqual(log.severity, 'warning')
        self.assertEqual(log.details, {'test': 'data'})
        self.assertEqual(log.ip_address, '192.168.1.1')


class SocialAPITestCase(APITestCase):
    """ソーシャル機能API テスト"""
    
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testuser1',
            email='test1@example.com',
            member_id='member1'
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            email='test2@example.com',
            member_id='member2'
        )
        
        # JWT認証をモック
        self.client.force_authenticate(user=self.user1)
        
    def test_privacy_settings_api(self):
        """プライバシー設定API テスト"""
        url = '/api/social/privacy/'
        data = {
            'profile_name_visibility': 'friends',
            'show_posts': 'private',
            'allow_friend_requests': 'mutual_friends'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # 設定が保存されているか確認
        privacy = UserPrivacySettings.objects.get(user=self.user1)
        self.assertEqual(privacy.profile_name_visibility, 'friends')
        self.assertEqual(privacy.show_posts, 'private')
        
    def test_friend_request_api(self):
        """フレンド申請API テスト"""
        url = '/api/social/friends/'
        data = {'receiver_id': self.user2.id}
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # フレンド申請が作成されているか確認
        friendship = Friendship.objects.get(
            requester=self.user1,
            receiver=self.user2
        )
        self.assertEqual(friendship.status, 'pending')
        
    def test_social_post_creation_api(self):
        """ソーシャル投稿作成API テスト"""
        url = '/api/social/posts/'
        data = {
            'content': 'Test post content',
            'privacy_level': 'friends'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # 投稿が作成されているか確認
        post = SocialPost.objects.get(author=self.user1)
        self.assertEqual(post.content, 'Test post content')
        self.assertEqual(post.privacy_level, 'friends')
        
    def test_post_like_api(self):
        """投稿いいねAPI テスト"""
        post = SocialPost.objects.create(
            author=self.user2,
            content='Test post',
            privacy_level='public'
        )
        
        url = f'/api/social/posts/{post.id}/like/'
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # いいねが記録されているか確認
        like = PostLike.objects.get(user=self.user1, post=post)
        self.assertIsNotNone(like)
        
    def test_block_user_api(self):
        """ユーザーブロックAPI テスト"""
        url = '/api/security/block/'
        data = {
            'user_id': self.user2.id,
            'reason': 'spam',
            'severity_level': 'medium'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # ブロックが記録されているか確認
        block = BlockedUser.objects.get(
            blocker=self.user1,
            blocked=self.user2
        )
        self.assertEqual(block.reason, 'spam')
        self.assertEqual(block.severity_level, 'medium')
        
    def test_content_report_api(self):
        """コンテンツ報告API テスト"""
        post = SocialPost.objects.create(
            author=self.user2,
            content='Inappropriate post',
            privacy_level='public'
        )
        
        url = '/api/security/report/'
        data = {
            'content_type': 'post',
            'content_id': post.id,
            'reason': 'inappropriate',
            'description': 'This post contains inappropriate content'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # 報告が記録されているか確認
        from ..social_models import ContentModerationQueue
        report = ContentModerationQueue.objects.get(
            reported_by=self.user1,
            object_id=post.id
        )
        self.assertEqual(report.report_reason, 'inappropriate')


class IntegrationTestCase(TestCase):
    """統合テスト"""
    
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            member_id='member1'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            member_id='member2'
        )
        
    def test_complete_friend_workflow(self):
        """完全なフレンド申請ワークフローテスト"""
        # 1. フレンド申請
        friendship = Friendship.objects.create(
            requester=self.user1,
            receiver=self.user2,
            status='pending'
        )
        
        # 2. 通知送信
        notification = SocialNotificationService.notify_friend_request(
            requester=self.user1,
            receiver=self.user2
        )
        
        # 3. 申請承認
        friendship.accept()
        
        # 4. 承認通知送信
        accept_notification = SocialNotificationService.notify_friend_accepted(
            requester=self.user1,
            receiver=self.user2
        )
        
        # 5. ポイント付与
        points_transaction = SocialPointsService.award_points(
            user=self.user1,
            activity_type='friend_added'
        )
        
        # 検証
        self.assertEqual(friendship.status, 'accepted')
        self.assertIsNotNone(notification)
        self.assertIsNotNone(accept_notification)
        # ポイント付与はモックが必要
        
    def test_complete_post_interaction_workflow(self):
        """完全な投稿交流ワークフローテスト"""
        # 1. 投稿作成
        post = SocialPost.objects.create(
            author=self.user1,
            content='Test post for interaction',
            privacy_level='public'
        )
        
        # 2. いいね
        like = PostLike.objects.create(
            user=self.user2,
            post=post
        )
        
        # 3. いいね通知
        like_notification = SocialNotificationService.notify_post_interaction(
            post_author=self.user1,
            actor=self.user2,
            interaction_type='liked',
            post=post
        )
        
        # 4. コメント
        comment = PostComment.objects.create(
            author=self.user2,
            post=post,
            content='Great post!'
        )
        
        # 5. コメント通知
        comment_notification = SocialNotificationService.notify_post_interaction(
            post_author=self.user1,
            actor=self.user2,
            interaction_type='commented',
            post=post
        )
        
        # 検証
        self.assertEqual(post.likes_count, 1)
        self.assertEqual(post.comments_count, 1)
        self.assertIsNotNone(like_notification)
        self.assertIsNotNone(comment_notification)


# テスト実行時の設定
if __name__ == '__main__':
    import django
    from django.conf import settings
    from django.test.utils import get_runner
    
    if not settings.configured:
        settings.configure(
            DEBUG=True,
            DATABASES={
                'default': {
                    'ENGINE': 'django.db.backends.sqlite3',
                    'NAME': ':memory:',
                }
            },
            INSTALLED_APPS=[
                'django.contrib.auth',
                'django.contrib.contenttypes',
                'core',
            ],
            SECRET_KEY='test-secret-key',
        )
    
    django.setup()
    TestRunner = get_runner(settings)
    test_runner = TestRunner()
    failures = test_runner.run_tests(['core.tests.test_social_functionality'])
    
    if failures:
        exit(1)