from django.urls import path, include
from django.http import JsonResponse
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
import os
import sys

# backendディレクトリをPATHに追加
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
backend_path = os.path.join(BASE_DIR, 'backend')
sys.path.append(backend_path)

from core.test_views import api_status, get_totp

def store_dashboard(request):
    """店舗ダッシュボード"""
    from django.http import FileResponse
    import os
    static_file = os.path.join(os.path.dirname(__file__), 'static', 'login.html')
    return FileResponse(open(static_file, 'rb'), content_type='text/html')

def store_charge(request):
    """ポイントチャージページ"""
    from django.shortcuts import render
    return render(request, 'store/charge.html')

def store_billing(request):
    """請求管理ページ"""
    from django.shortcuts import render
    return render(request, 'store/billing.html')

def store_payment(request):
    """決済ページ"""
    from django.shortcuts import render
    return render(request, 'store/payment.html')

def store_receipt(request):
    """レシートページ"""
    from django.shortcuts import render
    return render(request, 'store/receipt.html')

def store_refund(request):
    """返金ページ"""
    from django.shortcuts import render
    return render(request, 'store/refund.html')

def store_reports(request):
    """レポートページ"""
    from django.shortcuts import render
    return render(request, 'store/reports.html')

def store_settings(request):
    """店舗設定ページ"""
    from django.shortcuts import render
    return render(request, 'store/settings.html')

def store_promotions(request):
    """プロモーション管理ページ"""
    from django.shortcuts import render
    return render(request, 'store/promotions.html')

def store_profile(request):
    """店舗プロフィールページ"""
    from django.shortcuts import render
    return render(request, 'store/profile.html')

def store_point_purchase(request):
    """ポイント購入ページ"""
    from django.http import FileResponse
    import os
    static_file = os.path.join(os.path.dirname(__file__), 'static', 'point-purchase.html')
    return FileResponse(open(static_file, 'rb'), content_type='text/html')

def store_login(request):
    """店舗ログインページ"""
    from django.http import FileResponse
    import os
    static_file = os.path.join(os.path.dirname(__file__), 'static', 'login.html')
    return FileResponse(open(static_file, 'rb'), content_type='text/html')

def serve_next_static(request, path):
    """Next.jsの静的ファイルを配信"""
    from django.http import FileResponse, Http404
    import os
    import mimetypes
    
    # 内部の static/_next フォルダからファイルを取得
    static_file_path = os.path.join(os.path.dirname(__file__), 'static', '_next', path)
    
    if not os.path.exists(static_file_path):
        raise Http404(f"Static file not found: {path}")
    
    # MIMEタイプを自動判定
    content_type, _ = mimetypes.guess_type(static_file_path)
    if content_type is None:
        if path.endswith('.js'):
            content_type = 'application/javascript'
        elif path.endswith('.css'):
            content_type = 'text/css'
        else:
            content_type = 'application/octet-stream'
    
    return FileResponse(open(static_file_path, 'rb'), content_type=content_type)

def health(_request):
    """ヘルスチェック"""
    return JsonResponse({"status": "ok", "service": "store"})

urlpatterns = [
    # Next.js静的ファイル配信
    path('_next/<path:path>', serve_next_static, name='next-static'),
    
    # 店舗画面のルート（ログインページ）
    path('', store_dashboard, name='store-root'),
    path('dashboard/', store_dashboard, name='store-dashboard'),
    path('dashboard.html', store_dashboard, name='store-dashboard-html'),
    
    # 店舗画面の各ページ
    path('charge/', store_charge, name='store-charge'),
    path('charge.html', store_charge, name='store-charge-html'),
    path('billing/', store_billing, name='store-billing'),
    path('billing.html', store_billing, name='store-billing-html'),
    path('payment/', store_payment, name='store-payment'),
    path('payment.html', store_payment, name='store-payment-html'),
    path('receipt/', store_receipt, name='store-receipt'),
    path('receipt.html', store_receipt, name='store-receipt-html'),
    path('refund/', store_refund, name='store-refund'),
    path('refund.html', store_refund, name='store-refund-html'),
    path('reports/', store_reports, name='store-reports'),
    path('reports.html', store_reports, name='store-reports-html'),
    path('settings/', store_settings, name='store-settings'),
    path('settings.html', store_settings, name='store-settings-html'),
    path('promotions/', store_promotions, name='store-promotions'),
    path('promotions.html', store_promotions, name='store-promotions-html'),
    path('profile/', store_profile, name='store-profile'),
    path('profile.html', store_profile, name='store-profile-html'),
    path('point-purchase/', store_point_purchase, name='store-point-purchase'),
    path('point-purchase.html', store_point_purchase, name='store-point-purchase-html'),
    path('login/', store_login, name='store-login'),
    path('login.html', store_login, name='store-login-html'),
    
    # API エンドポイント（店舗用）
    path('api/', include('core.urls')),
    path('api/store/', include('core.store_payment_urls')),  # 店舗専用API
    path('api/fincode/', include('core.fincode_urls')),  # 決済API
    path('api/deposit/', include('core.deposit_urls')),  # デポジット管理API
    path('api/partner/', include('core.partner_urls')),  # パートナーAPI
    path('api/status/', api_status, name='store-api-status'),
    path('api/health/', health, name='store-api-health'),
    path('api/get-totp/', get_totp, name='store-get-totp'),
]

# 静的ファイル配信（開発時のみ）
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])