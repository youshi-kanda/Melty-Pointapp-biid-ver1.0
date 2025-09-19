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

def user_profile(request):
    """ユーザープロフィールページ"""
    from django.shortcuts import render
    return render(request, 'user/profile.html')

def user_points(request):
    """ポイント管理ページ"""
    from django.shortcuts import render
    return render(request, 'user/points.html')

def user_gifts(request):
    """ギフト管理ページ"""
    from django.shortcuts import render
    return render(request, 'user/gifts.html')

def user_social(request):
    """ソーシャルページ"""
    from django.shortcuts import render
    return render(request, 'user/social.html')

def user_stores(request):
    """店舗検索ページ"""
    from django.shortcuts import render
    return render(request, 'user/stores.html')

def user_map(request):
    """マップページ"""
    from django.shortcuts import render
    return render(request, 'user/map.html')

def user_security(request):
    """セキュリティ設定ページ"""
    from django.shortcuts import render
    return render(request, 'user/security.html')

def user_favorites(request):
    """お気に入りページ"""
    from django.shortcuts import render
    return render(request, 'user/favorites.html')

def user_login(request):
    """ユーザーログインページ"""
    from django.http import FileResponse
    import os
    static_file = os.path.join(os.path.dirname(__file__), 'static', 'login.html')
    return FileResponse(open(static_file, 'rb'), content_type='text/html')

def serve_next_static(request, path):
    """Next.jsの静的ファイルを配信"""
    from django.http import FileResponse, Http404
    import os
    import mimetypes
    
    # /out/_next フォルダからファイルを取得
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    static_file_path = os.path.join(base_dir, 'out', '_next', path)
    
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

def user_register(request):
    """ユーザー登録ページ"""
    from django.shortcuts import render
    return render(request, 'user/register.html')

def user_welcome(request):
    """ウェルカムページ"""
    from django.shortcuts import render
    return render(request, 'user/welcome.html')

def social_detail(request, social_id):
    """ソーシャル詳細ページ"""
    from django.shortcuts import render
    return render(request, 'social/detail.html', {'social_id': social_id})

def health(_request):
    """ヘルスチェック"""
    return JsonResponse({"status": "ok", "service": "user"})

urlpatterns = [
    # Next.js静的ファイル配信
    path('_next/<path:path>', serve_next_static, name='next-static'),
    
    # ユーザー画面のルート（ログインページ）
    path('', user_login, name='user-root'),
    path('profile/', user_profile, name='user-profile'),
    path('profile.html', user_profile, name='user-profile-html'),
    
    # ユーザー画面の各ページ
    path('points/', user_points, name='user-points'),
    path('points.html', user_points, name='user-points-html'),
    path('gifts/', user_gifts, name='user-gifts'),
    path('gifts.html', user_gifts, name='user-gifts-html'),
    path('social/', user_social, name='user-social'),
    path('social.html', user_social, name='user-social-html'),
    path('stores/', user_stores, name='user-stores'),
    path('stores.html', user_stores, name='user-stores-html'),
    path('map/', user_map, name='user-map'),
    path('map.html', user_map, name='user-map-html'),
    path('security/', user_security, name='user-security'),
    path('security.html', user_security, name='user-security-html'),
    path('favorites/', user_favorites, name='user-favorites'),
    path('favorites.html', user_favorites, name='user-favorites-html'),
    path('login/', user_login, name='user-login'),
    path('login.html', user_login, name='user-login-html'),
    path('register/', user_register, name='user-register'),
    path('register.html', user_register, name='user-register-html'),
    path('welcome/', user_welcome, name='user-welcome'),
    path('welcome.html', user_welcome, name='user-welcome-html'),
    
    # ソーシャル機能
    path('social/<int:social_id>/', social_detail, name='social-detail'),
    path('social/<int:social_id>.html', social_detail, name='social-detail-html'),
    
    # API エンドポイント（ユーザー用）
    path('api/', include('core.urls')),
    path('api/social/', include('core.social_urls')),  # ソーシャル機能API
    path('api/user/', include('core.urls')),  # ユーザー専用API
    path('api/status/', api_status, name='user-api-status'),
    path('api/health/', health, name='user-api-health'),
    path('api/get-totp/', get_totp, name='user-get-totp'),
]

# 静的ファイル配信（開発時のみ）
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])