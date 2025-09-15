from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .social_views import PrivacySettingsViewSet, FriendshipViewSet, UserSearchViewSet
from .social_posts_views import SocialPostViewSet, PostInteractionViewSet
from .review_views import DetailedReviewViewSet

router = DefaultRouter()

# プライバシー設定
router.register(r'privacy', PrivacySettingsViewSet, basename='privacy')

# フレンド管理
router.register(r'friends', FriendshipViewSet, basename='friendship')

# ユーザー検索
router.register(r'users', UserSearchViewSet, basename='user-search')

# ソーシャル投稿
router.register(r'posts', SocialPostViewSet, basename='social-post')

# 投稿への交流は手動でパターンを定義
# router.register(r'posts/(?P<pk>[^/.]+)/interactions', PostInteractionViewSet, basename='post-interaction')

# 詳細レビュー
router.register(r'reviews', DetailedReviewViewSet, basename='detailed-review')

urlpatterns = [
    path('social/', include(router.urls)),
    
    # カスタムエンドポイント
    path('social/posts/<int:pk>/like/', PostInteractionViewSet.as_view({'post': 'like'}), name='post-like'),
    path('social/posts/<int:pk>/comment/', PostInteractionViewSet.as_view({'post': 'comment'}), name='post-comment'),
    path('social/posts/<int:pk>/comments/', PostInteractionViewSet.as_view({'get': 'comments'}), name='post-comments'),
    path('social/posts/<int:pk>/share/', PostInteractionViewSet.as_view({'post': 'share'}), name='post-share'),
]