"""
BIID Point App 5カテゴリ統合システム設定URL - 本番運用仕様
運営管理画面の5カテゴリ設定API用URL設定（本番対応）
"""

from django.urls import path
from . import system_settings_views_new as views

# 5カテゴリ統合設定APIのURL設定
app_name = 'system_settings'

urlpatterns = [
    # ============================================
    # 5カテゴリ設定API エンドポイント
    # ============================================
    
    # 1. 🏗️ システム基盤設定API
    path('settings/system_infrastructure/', 
         views.SystemInfrastructureSettingsAPI.as_view(), 
         name='system_infrastructure_api'),
    
    # 2. 🔒 セキュリティ設定API
    path('settings/security/', 
         views.SecuritySettingsAPI.as_view(), 
         name='security_api'),
    
    # 3. 🔗 決済・外部連携設定API
    path('settings/external_integration/', 
         views.ExternalIntegrationSettingsAPI.as_view(), 
         name='external_integration_api'),
    
    # 4. 📧 通知・メール設定API
    path('settings/notification/', 
         views.NotificationSettingsAPI.as_view(), 
         name='notification_api'),
    
    # 5. 💼 事業運営設定API
    path('settings/business_operation/', 
         views.BusinessOperationSettingsAPI.as_view(), 
         name='business_operation_api'),
    
    # 6. 👤 ユーザー体験設定API
    path('settings/user_experience/', 
         views.UserExperienceSettingsAPI.as_view(), 
         name='user_experience_api'),
    
    # ============================================
    # 統合管理API エンドポイント
    # ============================================
    
    # 統合設定ダッシュボードAPI
    path('settings/dashboard/', 
         views.settings_dashboard_api, 
         name='settings_dashboard_api'),
    
    # 設定変更影響範囲チェックAPI
    path('settings/impact-check/', 
         views.settings_impact_check_api, 
         name='settings_impact_check_api'),
    
    # 本番環境準備チェックAPI
    path('settings/production-readiness/', 
         views.production_readiness_check_api, 
         name='production_readiness_check_api'),
    
    # ============================================
    # 後方互換性維持用エンドポイント（廃止予定）
    # ============================================
    
    # 従来のシステム設定API（system_infrastructureにリダイレクト）
    path('system-settings/', 
         views.SystemInfrastructureSettingsAPI.as_view(), 
         name='legacy_system_settings_api'),
    
    # 従来の決済設定API（external_integrationにリダイレクト）
    path('payment-settings/', 
         views.ExternalIntegrationSettingsAPI.as_view(), 
         name='legacy_payment_settings_api'),
]

# ============================================
# RESTful API 設計パターン
# ============================================
"""
新しい5カテゴリAPI設計:

GET /api/settings/{category}/ - 指定カテゴリ設定取得
POST /api/settings/{category}/ - 指定カテゴリ設定更新

支援API:
GET /api/settings/dashboard/ - 全カテゴリ統合ダッシュボード
POST /api/settings/impact-check/ - 設定変更影響範囲分析
GET /api/settings/production-readiness/ - 本番環境準備チェック

カテゴリ一覧:
- system-infrastructure: システム基盤設定
- security: セキュリティ設定  
- external-integration: 決済・外部連携設定
- notification: 通知・メール設定
- business-operation: 事業運営設定
- user-experience: ユーザー体験設定
"""