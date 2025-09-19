"""
システム設定URL設定
"""

from django.urls import path
from . import system_settings_views

app_name = 'system_settings'

urlpatterns = [
    # システム設定ダッシュボード
    path('', system_settings_views.system_settings_dashboard, name='dashboard'),
    
    # 各設定画面
    path('general/', system_settings_views.general_settings, name='general'),
    path('payment/', system_settings_views.payment_settings, name='payment'),
    path('notification/', system_settings_views.notification_settings, name='notification'),
    path('security/', system_settings_views.security_settings, name='security'),
    path('rank/', system_settings_views.rank_settings, name='rank'),
    
    # システム状態・テスト機能
    path('status/', system_settings_views.system_status, name='status'),
    path('test-notification/', system_settings_views.test_notification, name='test_notification'),
]