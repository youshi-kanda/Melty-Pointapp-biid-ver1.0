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

def terminal_main(request):
    """決済端末メインページ"""
    from django.shortcuts import render
    return render(request, 'terminal/main.html')

def terminal_login(request):
    """決済端末ログインページ"""
    from django.http import FileResponse, HttpResponse
    import os
    static_file = os.path.join(os.path.dirname(__file__), 'static', 'login.html')
    response = FileResponse(open(static_file, 'rb'), content_type='text/html')
    # キャッシュを無効化
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response

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

def serve_terminal_page(request, page='index'):
    """Next.jsでビルドされた決済端末ページを配信"""
    from django.http import FileResponse, Http404, HttpResponse
    import os
    
    # terminal/{page}/index.html を static/terminal/ から取得
    static_file_path = os.path.join(os.path.dirname(__file__), 'static', 'terminal', page, 'index.html')
    
    if not os.path.exists(static_file_path):
        # フォールバック: terminal/{page}.html も試す
        static_file_path = os.path.join(os.path.dirname(__file__), 'static', 'terminal', f'{page}.html')
        if not os.path.exists(static_file_path):
            raise Http404(f"Terminal page not found: {page}")
    
    response = FileResponse(open(static_file_path, 'rb'), content_type='text/html')
    # キャッシュを無効化
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response

def terminal_payment(request):
    """決済処理ページ"""
    from django.shortcuts import render
    return render(request, 'terminal/payment.html')

def terminal_nfc_lookup(request):
    """NFC読取ページ"""
    from django.shortcuts import render
    return render(request, 'terminal/nfc_lookup.html')

def terminal_points_grant(request):
    """ポイント付与ページ"""
    from django.shortcuts import render
    return render(request, 'terminal/points_grant.html')

def terminal_points_history(request):
    """ポイント履歴ページ"""
    from django.shortcuts import render
    return render(request, 'terminal/points_history.html')

def terminal_test(request):
    """端末テストページ"""
    from django.shortcuts import render
    return render(request, 'terminal/test.html')

def health(_request):
    """ヘルスチェック"""
    return JsonResponse({
        "status": "ok", 
        "service": "melty-plus-terminal",
        "app_name": "Melty+ 決済端末"
    })

def serve_manifest(_request):
    """PWA manifest.jsonを配信"""
    from django.http import FileResponse
    import os
    manifest_file = os.path.join(os.path.dirname(__file__), 'static', 'manifest.json')
    return FileResponse(open(manifest_file, 'rb'), content_type='application/manifest+json')

urlpatterns = [
    # PWA Manifest
    path('manifest.json', serve_manifest, name='manifest'),
    
    # Next.js静的ファイル配信
    path('_next/<path:path>', serve_next_static, name='next-static'),
    
    # Next.jsでビルドされた決済端末ページ
    path('terminal/', lambda r: serve_terminal_page(r, 'index'), name='terminal-index'),
    path('terminal/login/', lambda r: serve_terminal_page(r, 'login'), name='terminal-nextjs-login'),
    path('terminal/nfc/', lambda r: serve_terminal_page(r, 'nfc'), name='terminal-nextjs-nfc'),
    path('terminal/qr-scan/', lambda r: serve_terminal_page(r, 'qr-scan'), name='terminal-qr-scan'),
    path('terminal/manual-input/', lambda r: serve_terminal_page(r, 'manual-input'), name='terminal-manual-input'),
    path('terminal/customer-confirm/', lambda r: serve_terminal_page(r, 'customer-confirm'), name='terminal-customer-confirm'),
    path('terminal/amount-input/', lambda r: serve_terminal_page(r, 'amount-input'), name='terminal-amount-input'),
    path('terminal/payment/', lambda r: serve_terminal_page(r, 'payment'), name='terminal-payment'),
    path('terminal/payment-confirm/', lambda r: serve_terminal_page(r, 'payment-confirm'), name='terminal-payment-confirm'),
    path('terminal/processing/', lambda r: serve_terminal_page(r, 'processing'), name='terminal-processing'),
    path('terminal/payment-complete/', lambda r: serve_terminal_page(r, 'payment-complete'), name='terminal-payment-complete'),
    path('terminal/points/', lambda r: serve_terminal_page(r, 'points'), name='terminal-points'),
    path('terminal/points-input/', lambda r: serve_terminal_page(r, 'points-input'), name='terminal-points-input'),
    path('terminal/points-complete/', lambda r: serve_terminal_page(r, 'points-complete'), name='terminal-points-complete'),
    path('terminal/error/', lambda r: serve_terminal_page(r, 'error'), name='terminal-error'),
    path('terminal/settings/', lambda r: serve_terminal_page(r, 'settings'), name='terminal-settings'),
    path('terminal/history/', lambda r: serve_terminal_page(r, 'history'), name='terminal-history'),
    path('terminal/transaction-history/', lambda r: serve_terminal_page(r, 'transaction-history'), name='terminal-transaction-history'),
    
    # 決済端末画面のルート（ログインページ）
    path('', terminal_login, name='terminal-root'),
    path('main/', terminal_main, name='terminal-main'),
    path('terminal.html', terminal_main, name='terminal-main-html'),
    path('terminal-simple.html', terminal_main, name='terminal-simple-html'),
    path('terminal-enhanced.html', terminal_main, name='terminal-enhanced-html'),
    
    # 決済端末の各ページ
    path('login/', terminal_login, name='terminal-login'),
    path('login.html', terminal_login, name='terminal-login-html'),
    path('payment/', terminal_payment, name='terminal-payment'),
    path('payment.html', terminal_payment, name='terminal-payment-html'),
    path('payment-demo.html', terminal_payment, name='terminal-payment-demo-html'),
    path('payment-prod.html', terminal_payment, name='terminal-payment-prod-html'),
    path('payment-simple.html', terminal_payment, name='terminal-payment-simple-html'),
    path('payment-test.html', terminal_payment, name='terminal-payment-test-html'),
    
    # NFC・ポイント機能
    path('nfc/lookup/', terminal_nfc_lookup, name='terminal-nfc-lookup'),
    path('nfc/lookup.html', terminal_nfc_lookup, name='terminal-nfc-lookup-html'),
    path('points/grant/', terminal_points_grant, name='terminal-points-grant'),
    path('points/grant.html', terminal_points_grant, name='terminal-points-grant-html'),
    path('points/history/', terminal_points_history, name='terminal-points-history'),
    path('points/history.html', terminal_points_history, name='terminal-points-history-html'),
    
    # テスト機能
    path('test/', terminal_test, name='terminal-test'),
    path('test.html', terminal_test, name='terminal-test-html'),
    
    # API エンドポイント（決済端末用）
    path('api/', include('core.urls')),
    path('api/terminal/', include('core.urls')),  # 端末専用API
    path('api/fincode/', include('core.fincode_urls')),  # 決済API
    path('api/status/', api_status, name='terminal-api-status'),
    path('api/health/', health, name='terminal-api-health'),
    path('api/get-totp/', get_totp, name='terminal-get-totp'),
]

# 静的ファイル配信（開発時のみ）
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])