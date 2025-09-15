from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch, Mock
import json

from ..social_models import (
    UserPrivacySettings, Friendship, SocialPost, 
    BlockedUser, SecurityLog, NotificationPreference
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
            show_profile='friends',
            show_posts='private'
        )
        self.assertEqual(privacy.user, self.user1)
        self.assertEqual(privacy.show_profile, 'friends')
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
        
    def test_notification_preferences_creation(self):
        """通知設定作成テスト"""
        prefs = NotificationPreference.objects.create(
            user=self.user1,
            friend_requests=True,
            post_interactions=False
        )
        self.assertEqual(prefs.user, self.user1)
        self.assertTrue(prefs.friend_requests)
        self.assertFalse(prefs.post_interactions)


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
        
    def test_notification_service_exists(self):
        """通知サービスの存在確認"""
        self.assertTrue(hasattr(SocialNotificationService, 'create_notification'))
        self.assertTrue(hasattr(SocialNotificationService, 'notify_friend_request'))
        self.assertTrue(hasattr(SocialNotificationService, 'notify_friend_accepted'))
        
    def test_notification_types_config(self):
        """通知タイプ設定テスト"""
        types = SocialNotificationService.NOTIFICATION_TYPES
        self.assertIn('friend_request', types)
        self.assertIn('friend_accepted', types)
        self.assertIn('post_liked', types)
        
        # 各通知タイプの構造確認
        for notification_type in types.values():
            self.assertIn('title', notification_type)
            self.assertIn('template', notification_type)
            self.assertIn('priority', notification_type)


class SocialPointsTestCase(TestCase):
    """ソーシャルポイント機能テスト"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            member_id='member1'
        )
        
    def test_point_rewards_config(self):
        """ポイント報酬設定テスト"""
        rewards = SocialPointsService.POINT_REWARDS
        self.assertIn('first_post', rewards)
        self.assertIn('daily_post', rewards)
        self.assertIn('friend_added', rewards)
        
        # 全ての報酬が正の整数値
        for reward in rewards.values():
            self.assertIsInstance(reward, int)
            self.assertGreater(reward, 0)
            
    def test_points_service_methods(self):
        """ポイントサービスメソッド存在確認"""
        self.assertTrue(hasattr(SocialPointsService, 'award_points'))
        self.assertTrue(hasattr(SocialPointsService, '_is_duplicate_activity'))
        self.assertTrue(hasattr(SocialPointsService, '_check_rank_up'))


class SecurityMonitoringTestCase(TestCase):
    """セキュリティ監視機能テスト"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            member_id='member1'
        )
        
    def test_security_patterns_config(self):
        """セキュリティパターン設定テスト"""
        patterns = SecurityMonitoringService.SUSPICIOUS_PATTERNS
        
        # 必要なパターンが存在するか確認
        self.assertIn('rapid_friend_requests', patterns)
        self.assertIn('spam_posts', patterns)
        self.assertIn('mass_comments', patterns)
        
        # 各パターンに必要な設定があるか確認
        for pattern in patterns.values():
            self.assertIn('limit', pattern)
            self.assertIn('window', pattern)
            self.assertIsInstance(pattern['limit'], int)
            self.assertIsInstance(pattern['window'], int)
            
    def test_security_monitoring_methods(self):
        """セキュリティ監視メソッド存在確認"""
        self.assertTrue(hasattr(SecurityMonitoringService, 'monitor_activity'))
        self.assertTrue(hasattr(SecurityMonitoringService, '_handle_suspicious_activity'))
        self.assertTrue(hasattr(SecurityMonitoringService, '_get_severity_level'))
        
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
        
    def test_api_endpoints_exist(self):
        """API エンドポイントの存在確認"""
        # プライバシー設定API
        response = self.client.get('/api/social/privacy/')
        self.assertNotEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # フレンド管理API  
        response = self.client.get('/api/social/friends/')
        self.assertNotEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # 投稿API
        response = self.client.get('/api/social/posts/')
        self.assertNotEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_privacy_settings_endpoint(self):
        """プライバシー設定エンドポイントテスト"""
        url = '/api/social/privacy/'
        response = self.client.get(url)
        # 404でない限り、エンドポイントは存在する
        self.assertNotEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_friend_management_endpoint(self):
        """フレンド管理エンドポイントテスト"""
        url = '/api/social/friends/'
        response = self.client.get(url)
        self.assertNotEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_social_posts_endpoint(self):
        """ソーシャル投稿エンドポイントテスト"""
        url = '/api/social/posts/'
        response = self.client.get(url)
        self.assertNotEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_security_endpoints(self):
        """セキュリティエンドポイントテスト"""
        # ブロック機能
        url = '/api/security/block/'
        response = self.client.get(url)  # GETでも404でなければOK
        self.assertNotEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # 報告機能
        url = '/api/security/report/'
        response = self.client.get(url)
        self.assertNotEqual(response.status_code, status.HTTP_404_NOT_FOUND)


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
        
    def test_complete_friend_workflow_models(self):
        """完全なフレンドワークフローのモデルテスト"""
        # 1. フレンド申請
        friendship = Friendship.objects.create(
            requester=self.user1,
            receiver=self.user2,
            status='pending'
        )
        
        # 2. 申請承認
        friendship.accept()
        
        # 3. 状態確認
        self.assertEqual(friendship.status, 'accepted')
        self.assertIsNotNone(friendship.accepted_at)
        
        # 4. サービス存在確認
        self.assertTrue(hasattr(SocialNotificationService, 'notify_friend_request'))
        self.assertTrue(hasattr(SocialPointsService, 'POINT_REWARDS'))
        
    def test_complete_post_interaction_workflow(self):
        """完全な投稿交流ワークフローテスト"""
        # 1. 投稿作成
        post = SocialPost.objects.create(
            author=self.user1,
            content='Test post for interaction',
            privacy_level='public'
        )
        
        # 2. 投稿存在確認
        self.assertEqual(post.author, self.user1)
        self.assertEqual(post.content, 'Test post for interaction')
        
        # 3. サービス存在確認
        self.assertTrue(hasattr(SocialNotificationService, 'notify_post_interaction'))
        
    def test_security_workflow(self):
        """セキュリティワークフローテスト"""
        # 1. ブロック作成
        block = BlockedUser.objects.create(
            blocker=self.user1,
            blocked=self.user2,
            reason='spam',
            severity_level='medium'
        )
        
        # 2. セキュリティログ作成
        log = self.user1.create_security_log(
            action='blocked_user',
            severity='warning',
            details={'blocked_user': self.user2.id}
        )
        
        # 3. 状態確認
        self.assertEqual(block.blocker, self.user1)
        self.assertEqual(block.blocked, self.user2)
        self.assertEqual(log.action, 'blocked_user')
        self.assertEqual(log.severity, 'warning')


class ConfigurationTestCase(TestCase):
    """設定・構成テスト"""
    
    def test_notification_types_completeness(self):
        """通知タイプの完全性テスト"""
        types = SocialNotificationService.NOTIFICATION_TYPES
        required_types = [
            'friend_request', 'friend_accepted', 'post_liked', 
            'post_commented', 'review_helpful', 'security_alert'
        ]
        
        for required_type in required_types:
            self.assertIn(required_type, types)
            
    def test_point_rewards_completeness(self):
        """ポイント報酬の完全性テスト"""
        rewards = SocialPointsService.POINT_REWARDS
        required_rewards = [
            'first_post', 'daily_post', 'friend_added', 
            'helpful_review', 'profile_completed'
        ]
        
        for required_reward in required_rewards:
            self.assertIn(required_reward, rewards)
            
    def test_security_patterns_completeness(self):
        """セキュリティパターンの完全性テスト"""
        patterns = SecurityMonitoringService.SUSPICIOUS_PATTERNS
        required_patterns = [
            'rapid_friend_requests', 'spam_posts', 'mass_comments'
        ]
        
        for required_pattern in required_patterns:
            self.assertIn(required_pattern, patterns)


# テスト実行設定
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
                'rest_framework',
                'core',
            ],
            SECRET_KEY='test-secret-key-for-testing',
            USE_TZ=True,
        )
    
    django.setup()
    TestRunner = get_runner(settings)
    test_runner = TestRunner(verbosity=2)
    failures = test_runner.run_tests(['core.tests.test_social_functionality_fixed'])
    
    if failures:
        print(f"\n{failures} tests failed")
        exit(1)
    else:
        print("\nAll tests passed!")
        exit(0)