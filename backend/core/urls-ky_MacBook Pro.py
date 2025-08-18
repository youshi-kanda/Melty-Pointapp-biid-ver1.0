from django.urls import path
from . import views

urlpatterns = [
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
    
    # アカウントランク管理
    path('ranks/', views.AccountRankListCreateView.as_view(), name='account-rank-list'),
    path('ranks/<int:pk>/', views.AccountRankDetailView.as_view(), name='account-rank-detail'),
    
    # 友達機能
    path('friends/', views.FriendshipListView.as_view(), name='friendship-list'),
    path('friends/request/', views.SendFriendRequestView.as_view(), name='send-friend-request'),
    path('friends/request/<int:friendship_id>/respond/', views.RespondFriendRequestView.as_view(), name='respond-friend-request'),
    
    # ポイント送受信
    path('points/send/', views.SendPointsView.as_view(), name='send-points'),
    path('points/accept/<str:transfer_id>/', views.AcceptPointsView.as_view(), name='accept-points'),
    path('points/transfers/', views.PointTransferHistoryView.as_view(), name='point-transfer-history'),
    
    # 通知
    path('notifications/', views.NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:notification_id>/read/', views.MarkNotificationReadView.as_view(), name='mark-notification-read'),
]
