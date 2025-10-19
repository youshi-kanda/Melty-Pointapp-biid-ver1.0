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
    response = FileResponse(open(static_file, 'rb'), content_type='text/html')
    # 開発環境でHTTPSを防ぐためのヘッダー
    csp_policy = (
        "default-src 'self' http://127.0.0.1:* http://localhost:* 'unsafe-inline' 'unsafe-eval'; "
        "font-src 'self' https://fonts.gstatic.com data:; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com; "
        "img-src 'self' data: https:; "
        "connect-src 'self' http://127.0.0.1:* http://localhost:* https://maps.googleapis.com"
    )
    response['Content-Security-Policy'] = csp_policy
    response['Strict-Transport-Security'] = 'max-age=0'
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

def serve_manifest(request):
    """PWA用manifest.json配信"""
    from django.http import JsonResponse
    manifest_data = {
        "name": "biid ユーザーアプリ",
        "short_name": "biid User",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#000000",
        "icons": [
            {
                "src": "/static/icons/icon-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
            }
        ]
    }
    return JsonResponse(manifest_data)

def serve_icon(request, size):
    """PWA用アイコン配信（ダミー）"""
    from django.http import HttpResponse
    from io import BytesIO
    try:
        from PIL import Image, ImageDraw
        
        # ダミーアイコンを生成
        img_size = int(size.split('x')[0]) if 'x' in size else 192
        img = Image.new('RGB', (img_size, img_size), color='#4F46E5')
        draw = ImageDraw.Draw(img)
        
        # 簡単なロゴ風デザイン
        margin = img_size // 4
        draw.rectangle([margin, margin, img_size-margin, img_size-margin], fill='white')
        
        # PNG形式で出力
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        return HttpResponse(buffer.getvalue(), content_type='image/png')
    except ImportError:
        # Pillowがない場合は404
        from django.http import HttpResponseNotFound
        return HttpResponseNotFound('Icon generation requires Pillow')

def serve_favicon(request):
    """favicon.ico配信"""
    return serve_icon(request, '32x32')

def serve_config(request):
    """設定ファイル配信"""
    from django.http import JsonResponse
    config_data = {
        "api_endpoint": "/api",
        "features": {
            "social": True,
            "points": True,
            "gifts": True
        }
    }
    return JsonResponse(config_data)

def serve_next_data(request, path=None):
    """Next.jsのデータファイル配信"""
    from django.http import JsonResponse
    # 空のデータを返す（Next.jsの静的エクスポート用）
    return JsonResponse({})

def serve_next_data_fixed(request):
    """Next.jsのデータファイル配信（パスなし）"""
    from django.http import JsonResponse
    # 空のデータを返す（Next.jsの静的エクスポート用）
    return JsonResponse({})

def health(_request):
    """ヘルスチェック"""
    return JsonResponse({"status": "ok", "service": "user"})

urlpatterns = [
    # Next.jsデータファイル（具体的なパス - 優先順位高）
    path('_next/data/pUNSGtetT1E1KfpW2r6R_/index.json', serve_next_data_fixed, name='next-data-index'),
    path('_next/data/pUNSGtetT1E1KfpW2r6R_/user.json', serve_next_data_fixed, name='next-data-user'),
    path('_next/data/pUNSGtetT1E1KfpW2r6R_/user/login.json', serve_next_data_fixed, name='next-data-user-login'),
    path('_next/data/pUNSGtetT1E1KfpW2r6R_/user/social.json', serve_next_data_fixed, name='next-data-user-social'),
    path('_next/data/pUNSGtetT1E1KfpW2r6R_/user/register.json', serve_next_data_fixed, name='next-data-user-register'),
    path('_next/data/pUNSGtetT1E1KfpW2r6R_/user/map.json', serve_next_data_fixed, name='next-data-user-map'),
    path('_next/data/pUNSGtetT1E1KfpW2r6R_/<path:path>', serve_next_data, name='next-data-catchall'),
    
    # Next.js静的ファイル配信
    path('_next/<path:path>', serve_next_static, name='next-static'),
    
    # PWAとConfig
    path('manifest.json', serve_manifest, name='manifest'),
    path('static/manifest.json', serve_manifest, name='manifest-static'),  # 静的パスからもアクセス可能に
    path('config.json', serve_config, name='config'),
    path('favicon.ico', serve_favicon, name='favicon'),
    path('static/icons/icon-<str:size>.png', serve_icon, name='pwa-icon'),
    
    # userルート追加
    path('user', user_login, name='user-alt'),
    path('user/', user_login, name='user-alt-slash'),
    path('user.html', user_login, name='user-html'),
    path('user/map', user_map, name='user-map-direct'),
    
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