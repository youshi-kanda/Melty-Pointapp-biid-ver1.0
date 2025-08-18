from django.urls import path, include
from . import views, auth_views, melty_views

urlpatterns = [
    # 認証関連
    path('auth/login/customer/', auth_views.CustomerLoginView.as_view(), name='customer-login'),
    path('auth/login/store/', auth_views.StoreLoginView.as_view(), name='store-login'),
    path('auth/login/admin/', auth_views.AdminLoginView.as_view(), name='admin-login'),
    path('auth/login/terminal/', auth_views.TerminalLoginView.as_view(), name='terminal-login'),
    path('auth/refresh/', auth_views.TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/logout/', auth_views.LogoutView.as_view(), name='logout'),
    
    # 2FA関連
    path('auth/two-factor/setup/', auth_views.TwoFactorSetupView.as_view(), name='two-factor-setup'),
    path('auth/two-factor/status/', auth_views.TwoFactorStatusView.as_view(), name='two-factor-status'),
    path('auth/two-factor/disable/', auth_views.TwoFactorDisableView.as_view(), name='two-factor-disable'),
    path('auth/two-factor/backup-codes/', auth_views.GenerateBackupCodesView.as_view(), name='generate-backup-codes'),
    
    # パスワードリセット
    path('auth/password-reset/', auth_views.PasswordResetView.as_view(), name='password-reset'),
    path('auth/password-reset-confirm/', auth_views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # meltyアプリ連携
    path('auth/melty/url/', melty_views.melty_auth_url, name='melty-auth-url'),
    path('auth/melty/callback/', melty_views.melty_callback, name='melty-callback'),
    path('auth/melty/register/', melty_views.register_with_melty, name='register-with-melty'),
    path('auth/register/direct/', melty_views.register_direct, name='register-direct'),
    path('auth/melty/link/', melty_views.link_melty_account, name='link-melty-account'),
    path('auth/melty/unlink/', melty_views.unlink_melty_account, name='unlink-melty-account'),
    path('auth/melty/sync/', melty_views.melty_profile_sync, name='melty-profile-sync'),
    
    # 旧認証API（後方互換性）
    path('token/', views.TokenObtainView.as_view(), name='token-obtain'),
    path('token/refresh/', views.TokenRefreshView.as_view(), name='token-refresh'),
    path('user/me/', views.CurrentUserView.as_view(), name='current-user'),
    path('points/grant/', views.PointGrantView.as_view(), name='point-grant'),
    path('points/history/', views.PointHistoryView.as_view(), name='point-history'),
    path('charge/', views.ChargeView.as_view(), name='charge'),
    path('charge/history/', views.ChargeHistoryView.as_view(), name='charge-history'),
    path('dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('nfc/lookup/<str:uid>/', views.nfc_lookup, name='nfc-lookup'),
    path('users/', views.UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('stores/', views.StoreListCreateView.as_view(), name='store-list-create'),
    path('stores/<int:pk>/', views.StoreDetailView.as_view(), name='store-detail'),
    path('transactions/', views.PointTransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', views.PointTransactionDetailView.as_view(), name='transaction-detail'),
    path('extern/members/', views.member_sync, name='member-sync'),
    # ギフト関連
    path('gifts/categories/', views.GiftCategoryListView.as_view(), name='gift-categories'),
    path('gifts/', views.GiftListView.as_view(), name='gift-list'),
    path('gifts/<int:pk>/', views.GiftDetailView.as_view(), name='gift-detail'),
    path('gifts/exchange/', views.GiftExchangeView.as_view(), name='gift-exchange'),
    path('gifts/exchange/history/', views.GiftExchangeHistoryView.as_view(), name='gift-exchange-history'),
    path('gifts/exchange/<int:pk>/', views.GiftExchangeDetailView.as_view(), name='gift-exchange-detail'),
    
    # 新機能API
    path('', include('core.business_urls')),
    
    # Point Purchase & Billing API
    path('store/points/purchase/', views.PointPurchaseView.as_view(), name='point-purchase'),
    path('store/points/transactions/', views.PointPurchaseTransactionListView.as_view(), name='point-purchase-transactions'),
    path('store/points/summary/', views.PointPurchaseSummaryView.as_view(), name='point-purchase-summary'),
    path('store/billing/history/', views.BillingHistoryView.as_view(), name='billing-history'),
    path('store/billing/summary/', views.BillingSummaryView.as_view(), name='billing-summary'),
    path('store/billing/analytics/', views.BillingAnalyticsView.as_view(), name='billing-analytics'),
    path('store/billing/finalize/', views.FinalizeBillingView.as_view(), name='finalize-billing'),
    path('store/billing/send-email/', views.SendBillingEmailView.as_view(), name='send-billing-email'),
    
    # Social Skin API
    path('social-skin/', views.SocialSkinView.as_view(), name='social-skin'),
]
