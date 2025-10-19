from django.contrib import admin
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
from core import views as core_views

def admin_index(request):
    """管理者メインページ"""
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

def admin_users(request):
    """ユーザー管理ページ"""
    from django.shortcuts import render
    return render(request, 'admin/users.html')

def admin_stores(request):
    """店舗管理ページ"""
    from django.shortcuts import render
    return render(request, 'admin/stores.html')

def admin_transactions(request):
    """取引管理ページ"""
    from django.shortcuts import render
    return render(request, 'admin/transactions.html')

def admin_gifts(request):
    """ギフト管理ページ"""
    from django.shortcuts import render
    return render(request, 'admin/gifts.html')

def admin_reports(request):
    """レポートページ"""
    from django.shortcuts import render
    return render(request, 'admin/reports.html')

def admin_settings(request):
    """設定ページ（5カテゴリ統合版）"""
    from django.http import FileResponse
    import os
    static_file = os.path.join(os.path.dirname(__file__), 'static', 'settings.html')
    return FileResponse(open(static_file, 'rb'), content_type='text/html')

def admin_features(request):
    """機能管理ページ"""
    from django.shortcuts import render
    return render(request, 'admin/features.html')

def health(_request):
    """ヘルスチェック"""
    return JsonResponse({
        "status": "ok", 
        "service": "melty-plus-admin",
        "app_name": "Melty+ 管理画面"
    })

def serve_manifest(_request):
    """PWA manifest.jsonを配信"""
    from django.http import FileResponse
    import os
    manifest_file = os.path.join(os.path.dirname(__file__), 'static', 'manifest.json')
    return FileResponse(open(manifest_file, 'rb'), content_type='application/manifest+json')

urlpatterns = [
    # Django Admin(最優先)
    path('admin/', admin.site.urls),
    
    # PWA Manifest
    path('manifest.json', serve_manifest, name='manifest'),
    
    # Next.js静的ファイル配信
    path('_next/<path:path>', serve_next_static, name='next-static'),
    
    # 管理者画面のルート
    path('', admin_index, name='admin-index'),
    path('index.html', admin_index, name='admin-index-html'),
    path('login.html', admin_index, name='admin-login'),
    
    # 管理者画面の各ページ
    path('users/', admin_users, name='admin-users'),
    path('users/index.html', admin_users, name='admin-users-html'),
    path('stores/', admin_stores, name='admin-stores'),
    path('stores/index.html', admin_stores, name='admin-stores-html'),
    path('transactions/', admin_transactions, name='admin-transactions'),
    path('transactions/index.html', admin_transactions, name='admin-transactions-html'),
    path('gifts/', admin_gifts, name='admin-gifts'),
    path('gifts/index.html', admin_gifts, name='admin-gifts-html'),
    path('reports/', admin_reports, name='admin-reports'),
    path('reports/index.html', admin_reports, name='admin-reports-html'),
    path('settings/', admin_settings, name='admin-settings'),
    path('settings/index.html', admin_settings, name='admin-settings-html'),
    path('features/', admin_features, name='admin-features'),
    path('features/index.html', admin_features, name='admin-features-html'),
    
    # API エンドポイント（管理者用）
    path('api/', include('core.urls')),
    path('', include('core.production_admin_urls')),  # 本番管理者URL
    
    # エリア管理API
    path('api/area/', include('core.area_urls')),
    
    # 新5カテゴリ統合システム設定API
    path('api/admin/', include('core.system_settings_urls_new')),  # 5カテゴリ設定API
    
    path('api/status/', api_status, name='admin-api-status'),
    path('api/health/', health, name='admin-api-health'),
    path('api/get-totp/', get_totp, name='admin-get-totp'),
]

# 静的ファイル配信（開発時のみ）
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])