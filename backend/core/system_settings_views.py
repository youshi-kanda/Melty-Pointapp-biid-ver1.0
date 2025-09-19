"""
システム設定ビュー
運営管理画面のシステム設定機能
"""

from django.shortcuts import render, redirect
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json

from .system_settings_models import (
    SystemSettings, PaymentSettings, NotificationSettings, SecuritySettings
)
from .models import MeltyRankConfiguration


@staff_member_required
def system_settings_dashboard(request):
    """
    システム設定ダッシュボード
    """
    context = {
        'system_settings': SystemSettings.get_settings(),
        'payment_settings': PaymentSettings.get_settings(),
        'notification_settings': NotificationSettings.get_settings(),
        'security_settings': SecuritySettings.get_settings(),
        'melty_rank_configs': MeltyRankConfiguration.objects.all(),
    }
    return render(request, 'admin/system_settings/dashboard.html', context)


@staff_member_required
@require_http_methods(["GET", "POST"])
def general_settings(request):
    """
    一般設定の管理
    """
    settings = SystemSettings.get_settings()
    
    if request.method == 'POST':
        # 設定更新処理
        settings.site_name = request.POST.get('site_name', settings.site_name)
        settings.site_description = request.POST.get('site_description', settings.site_description)
        settings.support_email = request.POST.get('support_email', settings.support_email)
        settings.support_phone = request.POST.get('support_phone', settings.support_phone)
        settings.operation_area = request.POST.get('operation_area', settings.operation_area)
        settings.timezone = request.POST.get('timezone', settings.timezone)
        
        # メンテナンスモード
        settings.maintenance_mode = request.POST.get('maintenance_mode') == 'on'
        settings.debug_mode = request.POST.get('debug_mode') == 'on'
        
        if settings.maintenance_mode:
            settings.maintenance_message = request.POST.get('maintenance_message', settings.maintenance_message)
        
        settings.updated_by = request.user
        settings.save()
        
        messages.success(request, '一般設定を更新しました。')
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'status': 'success', 'message': '設定を更新しました。'})
        
        return redirect('admin:system_settings_general')
    
    return render(request, 'admin/system_settings/general.html', {'settings': settings})


@staff_member_required
@require_http_methods(["GET", "POST"])
def payment_settings(request):
    """
    決済設定の管理
    """
    settings = PaymentSettings.get_settings()
    
    if request.method == 'POST':
        # 決済設定更新処理
        settings.fincode_api_key = request.POST.get('fincode_api_key', settings.fincode_api_key)
        settings.fincode_secret_key = request.POST.get('fincode_secret_key', settings.fincode_secret_key)
        settings.fincode_shop_id = request.POST.get('fincode_shop_id', settings.fincode_shop_id)
        settings.fincode_is_production = request.POST.get('fincode_is_production') == 'on'
        
        # 金額設定
        try:
            settings.payment_timeout_seconds = int(request.POST.get('payment_timeout_seconds', settings.payment_timeout_seconds))
            settings.max_payment_amount = float(request.POST.get('max_payment_amount', settings.max_payment_amount))
            settings.min_payment_amount = float(request.POST.get('min_payment_amount', settings.min_payment_amount))
            settings.default_point_rate = float(request.POST.get('default_point_rate', settings.default_point_rate))
            settings.point_expiry_months = int(request.POST.get('point_expiry_months', settings.point_expiry_months))
        except (ValueError, TypeError):
            messages.error(request, '数値設定に無効な値が含まれています。')
            return render(request, 'admin/system_settings/payment.html', {'settings': settings})
        
        settings.save()
        messages.success(request, '決済設定を更新しました。')
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'status': 'success', 'message': '決済設定を更新しました。'})
        
        return redirect('admin:system_settings_payment')
    
    return render(request, 'admin/system_settings/payment.html', {'settings': settings})


@staff_member_required
@require_http_methods(["GET", "POST"])
def notification_settings(request):
    """
    通知設定の管理
    """
    settings = NotificationSettings.get_settings()
    
    if request.method == 'POST':
        # 通知設定更新処理
        settings.smtp_host = request.POST.get('smtp_host', settings.smtp_host)
        settings.smtp_username = request.POST.get('smtp_username', settings.smtp_username)
        settings.smtp_password = request.POST.get('smtp_password', settings.smtp_password)
        settings.smtp_use_tls = request.POST.get('smtp_use_tls') == 'on'
        settings.from_email = request.POST.get('from_email', settings.from_email)
        settings.from_name = request.POST.get('from_name', settings.from_name)
        
        # 通知機能ON/OFF
        settings.enable_welcome_email = request.POST.get('enable_welcome_email') == 'on'
        settings.enable_point_notification = request.POST.get('enable_point_notification') == 'on'
        settings.enable_gift_notification = request.POST.get('enable_gift_notification') == 'on'
        settings.enable_promotion_email = request.POST.get('enable_promotion_email') == 'on'
        
        # 数値設定
        try:
            settings.smtp_port = int(request.POST.get('smtp_port', settings.smtp_port))
            settings.email_batch_size = int(request.POST.get('email_batch_size', settings.email_batch_size))
            settings.email_rate_limit = int(request.POST.get('email_rate_limit', settings.email_rate_limit))
        except (ValueError, TypeError):
            messages.error(request, '数値設定に無効な値が含まれています。')
            return render(request, 'admin/system_settings/notification.html', {'settings': settings})
        
        settings.save()
        messages.success(request, '通知設定を更新しました。')
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'status': 'success', 'message': '通知設定を更新しました。'})
        
        return redirect('admin:system_settings_notification')
    
    return render(request, 'admin/system_settings/notification.html', {'settings': settings})


@staff_member_required
@require_http_methods(["GET", "POST"])
def security_settings(request):
    """
    セキュリティ設定の管理
    """
    settings = SecuritySettings.get_settings()
    
    if request.method == 'POST':
        # セキュリティ設定更新処理
        try:
            settings.max_login_attempts = int(request.POST.get('max_login_attempts', settings.max_login_attempts))
            settings.login_lockout_duration_minutes = int(request.POST.get('login_lockout_duration_minutes', settings.login_lockout_duration_minutes))
            settings.session_timeout_minutes = int(request.POST.get('session_timeout_minutes', settings.session_timeout_minutes))
            settings.api_rate_limit_per_minute = int(request.POST.get('api_rate_limit_per_minute', settings.api_rate_limit_per_minute))
            settings.api_rate_limit_per_hour = int(request.POST.get('api_rate_limit_per_hour', settings.api_rate_limit_per_hour))
        except (ValueError, TypeError):
            messages.error(request, '数値設定に無効な値が含まれています。')
            return render(request, 'admin/system_settings/security.html', {'settings': settings})
        
        # IP制限設定
        settings.enable_ip_whitelist = request.POST.get('enable_ip_whitelist') == 'on'
        settings.allowed_ip_addresses = request.POST.get('allowed_ip_addresses', settings.allowed_ip_addresses)
        
        # 2FA設定
        settings.enforce_2fa_for_admin = request.POST.get('enforce_2fa_for_admin') == 'on'
        settings.enforce_2fa_for_store = request.POST.get('enforce_2fa_for_store') == 'on'
        
        settings.save()
        messages.success(request, 'セキュリティ設定を更新しました。')
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'status': 'success', 'message': 'セキュリティ設定を更新しました。'})
        
        return redirect('admin:system_settings_security')
    
    return render(request, 'admin/system_settings/security.html', {'settings': settings})


@staff_member_required
@require_http_methods(["GET", "POST"])
def rank_settings(request):
    """
    会員ランク設定の管理
    """
    melty_configs = MeltyRankConfiguration.objects.all()
    
    if request.method == 'POST':
        config_id = request.POST.get('config_id')
        if config_id:
            # 既存設定の更新
            try:
                config = MeltyRankConfiguration.objects.get(id=config_id)
                config.biid_initial_rank = request.POST.get('biid_initial_rank', config.biid_initial_rank)
                config.welcome_bonus_points = int(request.POST.get('welcome_bonus_points', config.welcome_bonus_points))
                config.points_expiry_months = int(request.POST.get('points_expiry_months', config.points_expiry_months))
                config.is_active = request.POST.get('is_active') == 'on'
                config.save()
                messages.success(request, 'ランク設定を更新しました。')
            except MeltyRankConfiguration.DoesNotExist:
                messages.error(request, '設定が見つかりません。')
            except (ValueError, TypeError):
                messages.error(request, '数値設定に無効な値が含まれています。')
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'status': 'success', 'message': 'ランク設定を更新しました。'})
        
        return redirect('admin:system_settings_rank')
    
    context = {
        'melty_configs': melty_configs,
        'rank_choices': MeltyRankConfiguration._meta.get_field('melty_membership_type').choices,
        'biid_rank_choices': MeltyRankConfiguration._meta.get_field('biid_initial_rank').choices,
    }
    
    return render(request, 'admin/system_settings/rank.html', context)


@staff_member_required
@require_http_methods(["POST"])
def test_notification(request):
    """
    通知設定のテスト送信
    """
    try:
        settings = NotificationSettings.get_settings()
        
        # テストメール送信処理（実装は通知サービスで行う）
        from .notification_service import send_test_email
        
        result = send_test_email(
            to_email=request.user.email,
            smtp_settings=settings
        )
        
        if result['success']:
            return JsonResponse({'status': 'success', 'message': 'テストメールを送信しました。'})
        else:
            return JsonResponse({'status': 'error', 'message': f'送信に失敗しました: {result["error"]}'})
    
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'エラーが発生しました: {str(e)}'})


@staff_member_required
def system_status(request):
    """
    システム状態の確認
    """
    try:
        from django.db import connection
        from django.core.cache import cache
        import os
        
        # データベース接続テスト
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            db_status = True
    except Exception:
        db_status = False
    
    # キャッシュテスト
    try:
        cache.set('system_check', 'ok', 10)
        cache_status = cache.get('system_check') == 'ok'
    except Exception:
        cache_status = False
    
    # ディスク容量チェック（簡単な実装）
    try:
        disk_usage = os.statvfs('.')
        free_bytes = disk_usage.f_frsize * disk_usage.f_bavail
        total_bytes = disk_usage.f_frsize * disk_usage.f_blocks
        disk_usage_percent = ((total_bytes - free_bytes) / total_bytes) * 100
    except:
        disk_usage_percent = 0
    
    status_data = {
        'database': db_status,
        'cache': cache_status,
        'disk_usage_percent': round(disk_usage_percent, 1),
        'system_settings': SystemSettings.get_settings(),
    }
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse(status_data)
    
    return render(request, 'admin/system_settings/status.html', status_data)