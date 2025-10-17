"""
BIID Point App 5カテゴリ統合システム設定ビュー - 本番運用仕様
運営管理画面の5カテゴリ設定API（本番対応）
"""

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.views import View
from django.core import serializers
from django.forms.models import model_to_dict
import json
import logging
from datetime import datetime

# 新しい5カテゴリ設定モデル
from .models import (
    SystemInfrastructureSettings,
    SecuritySettings, 
    ExternalIntegrationSettings,
    NotificationSettings,
    BusinessOperationSettings,
    UserExperienceSettings
)

logger = logging.getLogger(__name__)


# ============================================
# 5カテゴリ統合設定API - 本番運用仕様
# ============================================

class SettingsAPIError(Exception):
    """設定API専用例外クラス"""
    def __init__(self, message, error_code=None):
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)


def log_settings_change(category, action, user, changes=None):
    """設定変更のログ記録"""
    logger.info(f"Settings Change: Category={category}, Action={action}, User={user}, Changes={changes}")


def validate_settings_data(category, data):
    """設定データの検証"""
    validation_rules = {
        'system_infrastructure': {
            'required_fields': ['site_name', 'timezone'],
            'field_types': {
                'maintenance_mode': bool,
                'debug_mode': bool,
            }
        },
        'security': {
            'required_fields': ['max_login_attempts', 'session_timeout_minutes'],
            'field_types': {
                'max_login_attempts': int,
                'session_timeout_minutes': int,
                'enable_ip_whitelist': bool,
            }
        },
        'external_integration': {
            'required_fields': ['fincode_is_production', 'payment_timeout_seconds'],
            'field_types': {
                'fincode_is_production': bool,
                'payment_timeout_seconds': int,
                'melty_connection_enabled': bool,
            }
        },
        'notification': {
            'required_fields': ['smtp_host', 'smtp_port', 'from_email'],
            'field_types': {
                'smtp_port': int,
                'smtp_use_tls': bool,
                'enable_welcome_email': bool,
            }
        },
        'business_operation': {
            'required_fields': ['default_point_rate', 'point_expiry_months'],
            'field_types': {
                'point_expiry_months': int,
                'default_point_rate': float,
                'system_fee_rate': float,
            }
        },
        'user_experience': {
            'required_fields': ['user_support_email', 'melty_membership_type'],
            'field_types': {
                'welcome_bonus_points': int,
                'enable_social_features': bool,
                'enable_gift_exchange': bool,
            }
        }
    }
    
    rules = validation_rules.get(category, {})
    
    # 必須フィールドチェック
    for field in rules.get('required_fields', []):
        if field not in data:
            raise SettingsAPIError(f"必須フィールド '{field}' が見つかりません", 'missing_field')
    
    # 型チェック
    for field, expected_type in rules.get('field_types', {}).items():
        if field in data:
            if expected_type == bool and not isinstance(data[field], bool):
                raise SettingsAPIError(f"フィールド '{field}' はboolean型である必要があります", 'invalid_type')
            elif expected_type == int and not isinstance(data[field], int):
                raise SettingsAPIError(f"フィールド '{field}' はint型である必要があります", 'invalid_type')
            elif expected_type == float and not isinstance(data[field], (int, float)):
                raise SettingsAPIError(f"フィールド '{field}' はnumber型である必要があります", 'invalid_type')


# ============================================
# 1. 🏗️ システム基盤設定API
# ============================================

@method_decorator([staff_member_required, csrf_exempt], name='dispatch')
class SystemInfrastructureSettingsAPI(View):
    """システム基盤設定のCRUD API"""
    
    def get(self, request):
        """システム基盤設定取得"""
        try:
            settings = SystemInfrastructureSettings.get_settings()
            data = model_to_dict(settings)
            
            # 日時フィールドの変換
            for field in ['created_at', 'updated_at', 'maintenance_start_time', 'maintenance_end_time']:
                if data.get(field):
                    data[field] = data[field].isoformat()
            
            return JsonResponse({
                'success': True,
                'category': 'system_infrastructure',
                'data': data,
                'system_info': settings.get_system_info()
            })
        except Exception as e:
            logger.error(f"System Infrastructure Settings GET error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': str(e),
                'category': 'system_infrastructure'
            }, status=500)
    
    def post(self, request):
        """システム基盤設定更新"""
        try:
            data = json.loads(request.body)
            validate_settings_data('system_infrastructure', data)
            
            settings = SystemInfrastructureSettings.get_settings()
            changes = []
            
            # 更新可能フィールドの設定
            updatable_fields = [
                'site_name', 'site_description', 'system_version',
                'system_support_email', 'emergency_contact', 'organization_name',
                'operation_region', 'timezone', 'maintenance_mode', 'debug_mode',
                'maintenance_message', 'maintenance_start_time', 'maintenance_end_time'
            ]
            
            for field in updatable_fields:
                if field in data:
                    old_value = getattr(settings, field)
                    new_value = data[field]
                    if old_value != new_value:
                        setattr(settings, field, new_value)
                        changes.append(f"{field}: {old_value} -> {new_value}")
            
            # 更新者情報を設定
            if hasattr(settings, 'updated_by'):
                settings.updated_by = request.user
            
            settings.save()
            
            # ログ記録
            log_settings_change('system_infrastructure', 'update', request.user, changes)
            
            return JsonResponse({
                'success': True,
                'message': 'システム基盤設定を更新しました',
                'category': 'system_infrastructure',
                'changes': changes,
                'system_info': settings.get_system_info()
            })
            
        except SettingsAPIError as e:
            return JsonResponse({
                'success': False,
                'error': e.message,
                'error_code': e.error_code,
                'category': 'system_infrastructure'
            }, status=400)
        except Exception as e:
            logger.error(f"System Infrastructure Settings POST error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': str(e),
                'category': 'system_infrastructure'
            }, status=500)


# ============================================
# 2. 🔒 セキュリティ設定API
# ============================================

@method_decorator([staff_member_required, csrf_exempt], name='dispatch')
class SecuritySettingsAPI(View):
    """セキュリティ設定のCRUD API"""
    
    def get(self, request):
        """セキュリティ設定取得"""
        try:
            settings = SecuritySettings.get_settings()
            data = model_to_dict(settings)
            
            # セキュリティ上の理由で一部フィールドをマスク
            sensitive_fields = ['allowed_ip_addresses']
            for field in sensitive_fields:
                if data.get(field):
                    data[field] = '***MASKED***'
            
            return JsonResponse({
                'success': True,
                'category': 'security',
                'data': data,
                'security_policy': settings.get_security_policy()
            })
        except Exception as e:
            logger.error(f"Security Settings GET error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': str(e),
                'category': 'security'
            }, status=500)
    
    def post(self, request):
        """セキュリティ設定更新"""
        try:
            data = json.loads(request.body)
            validate_settings_data('security', data)
            
            settings = SecuritySettings.get_settings()
            changes = []
            
            # 更新可能フィールドの設定
            updatable_fields = [
                'max_login_attempts', 'login_lockout_duration_minutes', 'session_timeout_minutes',
                'api_rate_limit_per_minute', 'api_rate_limit_per_hour',
                'enable_ip_whitelist', 'allowed_ip_addresses',
                'enforce_2fa_for_admin', 'enforce_2fa_for_store'
            ]
            
            for field in updatable_fields:
                if field in data:
                    old_value = getattr(settings, field)
                    new_value = data[field]
                    if old_value != new_value:
                        setattr(settings, field, new_value)
                        # セキュリティログでは値をマスク
                        if field in ['allowed_ip_addresses']:
                            changes.append(f"{field}: ***UPDATED***")
                        else:
                            changes.append(f"{field}: {old_value} -> {new_value}")
            
            settings.save()
            
            # セキュリティ変更の特別ログ
            log_settings_change('security', 'update', request.user, changes)
            logger.warning(f"Security settings updated by user: {request.user}")
            
            return JsonResponse({
                'success': True,
                'message': 'セキュリティ設定を更新しました',
                'category': 'security',
                'changes': changes,
                'security_policy': settings.get_security_policy()
            })
            
        except SettingsAPIError as e:
            return JsonResponse({
                'success': False,
                'error': e.message,
                'error_code': e.error_code,
                'category': 'security'
            }, status=400)
        except Exception as e:
            logger.error(f"Security Settings POST error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': str(e),
                'category': 'security'
            }, status=500)


# ============================================
# 3. 🔗 決済・外部連携設定API
# ============================================

@method_decorator([staff_member_required, csrf_exempt], name='dispatch')
class ExternalIntegrationSettingsAPI(View):
    """決済・外部連携設定のCRUD API"""
    
    def get(self, request):
        """決済・外部連携設定取得"""
        try:
            settings = ExternalIntegrationSettings.get_settings()
            data = model_to_dict(settings)
            
            # セキュリティ上の理由でAPIキーをマスク
            sensitive_fields = ['fincode_api_key', 'fincode_secret_key', 'melty_api_key']
            for field in sensitive_fields:
                if data.get(field):
                    data[field] = '***MASKED***'
            
            return JsonResponse({
                'success': True,
                'category': 'external_integration',
                'data': data,
                'fincode_config': {k: v if k not in sensitive_fields else '***MASKED***' 
                                  for k, v in settings.get_fincode_config().items()},
                'production_ready': settings.is_production_ready()
            })
        except Exception as e:
            logger.error(f"External Integration Settings GET error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': str(e),
                'category': 'external_integration'
            }, status=500)
    
    def post(self, request):
        """決済・外部連携設定更新"""
        try:
            data = json.loads(request.body)
            validate_settings_data('external_integration', data)
            
            settings = ExternalIntegrationSettings.get_settings()
            changes = []
            
            # 更新可能フィールドの設定
            updatable_fields = [
                'fincode_api_key', 'fincode_secret_key', 'fincode_shop_id',
                'fincode_is_production', 'fincode_webhook_url', 'fincode_connection_timeout',
                'melty_api_base_url', 'melty_api_key', 'melty_connection_enabled',
                'melty_sync_interval_minutes', 'external_api_retry_count',
                'external_api_timeout_seconds', 'payment_timeout_seconds',
                'max_payment_amount', 'min_payment_amount'
            ]
            
            for field in updatable_fields:
                if field in data:
                    old_value = getattr(settings, field)
                    new_value = data[field]
                    if old_value != new_value:
                        setattr(settings, field, new_value)
                        # API キー等はログでマスク
                        if 'key' in field or 'secret' in field:
                            changes.append(f"{field}: ***UPDATED***")
                        else:
                            changes.append(f"{field}: {old_value} -> {new_value}")
            
            settings.save()
            
            # 外部連携設定変更の特別ログ
            log_settings_change('external_integration', 'update', request.user, changes)
            
            return JsonResponse({
                'success': True,
                'message': '決済・外部連携設定を更新しました',
                'category': 'external_integration',
                'changes': changes,
                'production_ready': settings.is_production_ready()
            })
            
        except SettingsAPIError as e:
            return JsonResponse({
                'success': False,
                'error': e.message,
                'error_code': e.error_code,
                'category': 'external_integration'
            }, status=400)
        except Exception as e:
            logger.error(f"External Integration Settings POST error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': str(e),
                'category': 'external_integration'
            }, status=500)


# ============================================
# 4. 📧 通知・メール設定API
# ============================================

@method_decorator([staff_member_required, csrf_exempt], name='dispatch')
class NotificationSettingsAPI(View):
    """通知・メール設定のCRUD API"""
    
    def get(self, request):
        """通知・メール設定取得"""
        try:
            settings = NotificationSettings.get_settings()
            data = model_to_dict(settings)
            
            # SMTPパスワードをマスク
            if data.get('smtp_password'):
                data['smtp_password'] = '***MASKED***'
            
            return JsonResponse({
                'success': True,
                'category': 'notification',
                'data': data,
                'smtp_config': {k: v if k != 'password' else '***MASKED***' 
                               for k, v in settings.get_smtp_config().items()}
            })
        except Exception as e:
            logger.error(f"Notification Settings GET error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': str(e),
                'category': 'notification'
            }, status=500)
    
    def post(self, request):
        """通知・メール設定更新"""
        try:
            data = json.loads(request.body)
            validate_settings_data('notification', data)
            
            settings = NotificationSettings.get_settings()
            changes = []
            
            # 更新可能フィールドの設定
            updatable_fields = [
                'smtp_host', 'smtp_port', 'smtp_username', 'smtp_password',
                'smtp_use_tls', 'smtp_use_ssl', 'from_email', 'from_name', 'reply_to_email',
                'enable_welcome_email', 'enable_point_notification', 'enable_gift_notification',
                'enable_promotion_email', 'enable_security_notification', 'enable_transaction_notification',
                'email_batch_size', 'email_rate_limit_per_hour',
                'email_queue_retry_count', 'email_queue_retry_delay_minutes'
            ]
            
            for field in updatable_fields:
                if field in data:
                    old_value = getattr(settings, field)
                    new_value = data[field]
                    if old_value != new_value:
                        setattr(settings, field, new_value)
                        # パスワードはログでマスク
                        if 'password' in field:
                            changes.append(f"{field}: ***UPDATED***")
                        else:
                            changes.append(f"{field}: {old_value} -> {new_value}")
            
            settings.save()
            
            # 通知設定変更のログ
            log_settings_change('notification', 'update', request.user, changes)
            
            return JsonResponse({
                'success': True,
                'message': '通知・メール設定を更新しました',
                'category': 'notification',
                'changes': changes
            })
            
        except SettingsAPIError as e:
            return JsonResponse({
                'success': False,
                'error': e.message,
                'error_code': e.error_code,
                'category': 'notification'
            }, status=400)
        except Exception as e:
            logger.error(f"Notification Settings POST error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': str(e),
                'category': 'notification'
            }, status=500)


# ============================================
# 5. 💼 事業運営設定API
# ============================================

@method_decorator([staff_member_required, csrf_exempt], name='dispatch')
class BusinessOperationSettingsAPI(View):
    """事業運営設定のCRUD API"""
    
    def get(self, request):
        """事業運営設定取得"""
        try:
            settings = BusinessOperationSettings.get_settings()
            data = model_to_dict(settings)
            
            return JsonResponse({
                'success': True,
                'category': 'business_operation',
                'data': data,
                'fee_structure': settings.get_fee_structure()
            })
        except Exception as e:
            logger.error(f"Business Operation Settings GET error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': str(e),
                'category': 'business_operation'
            }, status=500)
    
    def post(self, request):
        """事業運営設定更新"""
        try:
            data = json.loads(request.body)
            validate_settings_data('business_operation', data)
            
            settings = BusinessOperationSettings.get_settings()
            changes = []
            
            # 更新可能フィールドの設定
            updatable_fields = [
                'default_point_rate', 'point_expiry_months', 'max_point_balance',
                'store_deposit_required', 'store_minimum_transaction', 'store_refund_rate',
                'system_fee_rate', 'payment_processing_fee', 'transfer_fee',
                'bank_transfer_fee', 'promotion_email_cost', 'minimum_cashout_amount',
                'point_unit_price', 'tax_rate'
            ]
            
            for field in updatable_fields:
                if field in data:
                    old_value = getattr(settings, field)
                    new_value = data[field]
                    if old_value != new_value:
                        setattr(settings, field, new_value)
                        changes.append(f"{field}: {old_value} -> {new_value}")
            
            settings.save()
            
            # 事業運営設定変更のログ
            log_settings_change('business_operation', 'update', request.user, changes)
            
            return JsonResponse({
                'success': True,
                'message': '事業運営設定を更新しました',
                'category': 'business_operation',
                'changes': changes,
                'fee_structure': settings.get_fee_structure()
            })
            
        except SettingsAPIError as e:
            return JsonResponse({
                'success': False,
                'error': e.message,
                'error_code': e.error_code,
                'category': 'business_operation'
            }, status=400)
        except Exception as e:
            logger.error(f"Business Operation Settings POST error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': str(e),
                'category': 'business_operation'
            }, status=500)


# ============================================
# 6. 👤 ユーザー体験設定API
# ============================================

@method_decorator([staff_member_required, csrf_exempt], name='dispatch')
class UserExperienceSettingsAPI(View):
    """ユーザー体験設定のCRUD API"""
    
    def get(self, request):
        """ユーザー体験設定取得"""
        try:
            settings = UserExperienceSettings.get_settings()
            data = model_to_dict(settings)
            
            return JsonResponse({
                'success': True,
                'category': 'user_experience',
                'data': data,
                'support_info': settings.get_user_support_info(),
                'melty_config': settings.get_melty_integration_config(),
                'feature_flags': settings.get_feature_flags()
            })
        except Exception as e:
            logger.error(f"User Experience Settings GET error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': str(e),
                'category': 'user_experience'
            }, status=500)
    
    def post(self, request):
        """ユーザー体験設定更新"""
        try:
            data = json.loads(request.body)
            validate_settings_data('user_experience', data)
            
            settings = UserExperienceSettings.get_settings()
            changes = []
            
            # 更新可能フィールドの設定
            updatable_fields = [
                'user_support_email', 'user_support_phone', 'service_area_description',
                'melty_membership_type', 'biid_initial_rank', 'welcome_bonus_points', 'referral_bonus_points',
                'enable_social_features', 'enable_gift_exchange', 'enable_point_transfer',
                'max_daily_point_transfer', 'default_theme', 'enable_push_notifications'
            ]
            
            for field in updatable_fields:
                if field in data:
                    old_value = getattr(settings, field)
                    new_value = data[field]
                    if old_value != new_value:
                        setattr(settings, field, new_value)
                        changes.append(f"{field}: {old_value} -> {new_value}")
            
            settings.save()
            
            # ユーザー体験設定変更のログ
            log_settings_change('user_experience', 'update', request.user, changes)
            
            return JsonResponse({
                'success': True,
                'message': 'ユーザー体験設定を更新しました',
                'category': 'user_experience',
                'changes': changes,
                'feature_flags': settings.get_feature_flags()
            })
            
        except SettingsAPIError as e:
            return JsonResponse({
                'success': False,
                'error': e.message,
                'error_code': e.error_code,
                'category': 'user_experience'
            }, status=400)
        except Exception as e:
            logger.error(f"User Experience Settings POST error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': str(e),
                'category': 'user_experience'
            }, status=500)


# ============================================
# 統合設定ダッシュボードAPI
# ============================================

@staff_member_required
def settings_dashboard_api(request):
    """全設定カテゴリの統合ダッシュボードAPI"""
    try:
        dashboard_data = {
            'system_infrastructure': {
                'name': '🏗️ システム基盤設定',
                'status': 'active',
                'last_updated': SystemInfrastructureSettings.get_settings().updated_at.isoformat(),
                'key_info': SystemInfrastructureSettings.get_settings().get_system_info()
            },
            'security': {
                'name': '🔒 セキュリティ設定', 
                'status': 'active',
                'last_updated': SecuritySettings.get_settings().updated_at.isoformat(),
                'key_info': SecuritySettings.get_settings().get_security_policy()
            },
            'external_integration': {
                'name': '🔗 決済・外部連携設定',
                'status': 'production_ready' if ExternalIntegrationSettings.get_settings().is_production_ready() else 'configuration_needed',
                'last_updated': ExternalIntegrationSettings.get_settings().updated_at.isoformat(),
                'key_info': {'production_ready': ExternalIntegrationSettings.get_settings().is_production_ready()}
            },
            'notification': {
                'name': '📧 通知・メール設定',
                'status': 'active',
                'last_updated': NotificationSettings.get_settings().updated_at.isoformat(),
                'key_info': NotificationSettings.get_settings().get_smtp_config()
            },
            'business_operation': {
                'name': '💼 事業運営設定',
                'status': 'active',
                'last_updated': BusinessOperationSettings.get_settings().updated_at.isoformat(),
                'key_info': BusinessOperationSettings.get_settings().get_fee_structure()
            },
            'user_experience': {
                'name': '👤 ユーザー体験設定',
                'status': 'active',
                'last_updated': UserExperienceSettings.get_settings().updated_at.isoformat(),
                'key_info': UserExperienceSettings.get_settings().get_feature_flags()
            }
        }
        
        return JsonResponse({
            'success': True,
            'dashboard': dashboard_data,
            'system_status': {
                'total_categories': len(dashboard_data),
                'active_categories': len([cat for cat in dashboard_data.values() if cat['status'] == 'active']),
                'production_ready': all([
                    SystemInfrastructureSettings.get_settings().site_name,
                    SecuritySettings.get_settings().max_login_attempts,
                    ExternalIntegrationSettings.get_settings().is_production_ready(),
                    NotificationSettings.get_settings().smtp_host
                ])
            }
        })
        
    except Exception as e:
        logger.error(f"Settings Dashboard API error: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


# ============================================
# 設定影響範囲チェックAPI
# ============================================

@staff_member_required
def settings_impact_check_api(request):
    """設定変更の影響範囲をチェックするAPI"""
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'POST method required'}, status=405)
    
    try:
        data = json.loads(request.body)
        category = data.get('category')
        changes = data.get('changes', {})
        
        impact_analysis = {
            'high_impact': [],
            'medium_impact': [],
            'low_impact': [],
            'affected_interfaces': [],
            'restart_required': False,
            'user_notification_needed': False
        }
        
        # カテゴリ別影響分析
        if category == 'system_infrastructure':
            if 'maintenance_mode' in changes:
                impact_analysis['high_impact'].append('全システムアクセスに影響')
                impact_analysis['affected_interfaces'] = ['admin', 'store', 'user', 'terminal']
                impact_analysis['user_notification_needed'] = True
            if 'timezone' in changes:
                impact_analysis['medium_impact'].append('時刻表示・処理に影響')
                impact_analysis['restart_required'] = True
                
        elif category == 'security':
            if any(field in changes for field in ['max_login_attempts', 'session_timeout_minutes']):
                impact_analysis['high_impact'].append('ログインセキュリティポリシーに影響')
                impact_analysis['affected_interfaces'] = ['admin', 'store', 'user']
            if 'enable_ip_whitelist' in changes:
                impact_analysis['high_impact'].append('システムアクセス制御に影響')
                impact_analysis['affected_interfaces'] = ['admin', 'store', 'user', 'terminal']
                
        elif category == 'external_integration':
            if 'fincode_is_production' in changes:
                impact_analysis['high_impact'].append('決済処理に重大な影響')
                impact_analysis['affected_interfaces'] = ['store', 'terminal']
                impact_analysis['restart_required'] = True
            if 'melty_connection_enabled' in changes:
                impact_analysis['medium_impact'].append('MELTY連携機能に影響')
                impact_analysis['affected_interfaces'] = ['user']
                
        elif category == 'notification':
            if any(field in changes for field in ['smtp_host', 'smtp_port', 'smtp_password']):
                impact_analysis['medium_impact'].append('メール送信機能に影響')
            if any(field.startswith('enable_') for field in changes):
                impact_analysis['low_impact'].append('通知機能の有効/無効に影響')
                impact_analysis['user_notification_needed'] = True
                
        elif category == 'business_operation':
            if any(field in changes for field in ['default_point_rate', 'system_fee_rate']):
                impact_analysis['high_impact'].append('料金計算・収益に影響')
                impact_analysis['affected_interfaces'] = ['store', 'user']
            if 'point_expiry_months' in changes:
                impact_analysis['medium_impact'].append('ポイント有効期限に影響')
                impact_analysis['affected_interfaces'] = ['user']
                
        elif category == 'user_experience':
            if any(field.startswith('enable_') for field in changes):
                impact_analysis['low_impact'].append('ユーザー機能の有効/無効に影響')
                impact_analysis['affected_interfaces'] = ['user']
            if any(field in changes for field in ['welcome_bonus_points', 'referral_bonus_points']):
                impact_analysis['medium_impact'].append('新規ユーザー獲得施策に影響')
                impact_analysis['affected_interfaces'] = ['user']
        
        return JsonResponse({
            'success': True,
            'category': category,
            'impact_analysis': impact_analysis
        })
        
    except Exception as e:
        logger.error(f"Settings Impact Check API error: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


# ============================================
# 本番環境準備チェックAPI
# ============================================

@staff_member_required
def production_readiness_check_api(request):
    """本番環境準備状況をチェックするAPI"""
    try:
        readiness_check = {
            'overall_ready': True,
            'categories': {},
            'critical_issues': [],
            'warnings': [],
            'recommendations': []
        }
        
        # システム基盤設定チェック
        sys_settings = SystemInfrastructureSettings.get_settings()
        sys_ready = not sys_settings.debug_mode and sys_settings.site_name != "BIID Point Management System"
        readiness_check['categories']['system_infrastructure'] = {
            'ready': sys_ready,
            'issues': [] if sys_ready else ['デバッグモードが有効', 'デフォルトサイト名使用']
        }
        
        # セキュリティ設定チェック
        sec_settings = SecuritySettings.get_settings()
        sec_ready = (sec_settings.enforce_2fa_for_admin and 
                    sec_settings.max_login_attempts <= 5 and
                    sec_settings.enable_ip_whitelist)
        readiness_check['categories']['security'] = {
            'ready': sec_ready,
            'issues': [] if sec_ready else ['2FA未強制', 'IP制限未有効', 'ログイン制限が緩い']
        }
        
        # 外部連携設定チェック
        ext_settings = ExternalIntegrationSettings.get_settings()
        ext_ready = ext_settings.is_production_ready()
        readiness_check['categories']['external_integration'] = {
            'ready': ext_ready,
            'issues': [] if ext_ready else ['FINCODE本番設定未完了', 'APIキー未設定']
        }
        
        # 通知設定チェック
        notif_settings = NotificationSettings.get_settings()
        notif_ready = (notif_settings.smtp_host != "smtp.sendgrid.net" or 
                      notif_settings.smtp_password)
        readiness_check['categories']['notification'] = {
            'ready': notif_ready,
            'issues': [] if notif_ready else ['本番SMTP設定未完了']
        }
        
        # 事業運営設定チェック（警告レベル）
        biz_settings = BusinessOperationSettings.get_settings()
        readiness_check['categories']['business_operation'] = {
            'ready': True,
            'warnings': ['手数料設定の最終確認推奨', 'ポイント価格設定の再確認推奨']
        }
        
        # ユーザー体験設定チェック（警告レベル）
        user_settings = UserExperienceSettings.get_settings()
        readiness_check['categories']['user_experience'] = {
            'ready': True,
            'warnings': ['サポート連絡先の最終確認推奨']
        }
        
        # 全体準備状況判定
        readiness_check['overall_ready'] = all([
            cat.get('ready', True) for cat in readiness_check['categories'].values()
        ])
        
        # 重要な問題を収集
        for cat_name, cat_data in readiness_check['categories'].items():
            if not cat_data.get('ready', True):
                readiness_check['critical_issues'].extend(cat_data.get('issues', []))
            readiness_check['warnings'].extend(cat_data.get('warnings', []))
        
        return JsonResponse({
            'success': True,
            'readiness_check': readiness_check
        })
        
    except Exception as e:
        logger.error(f"Production Readiness Check API error: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)