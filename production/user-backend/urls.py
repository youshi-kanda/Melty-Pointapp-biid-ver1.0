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

def serve_next_static(request, path):
    """Next.jsの静的ファイルを配信"""
    from django.http import FileResponse, Http404, JsonResponse
    import os
    import mimetypes
    
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    
    # _next/data/ のJSONファイルは空のオブジェクトを返す（静的エクスポートでは不要）
    if path.startswith('data/') and path.endswith('.json'):
        return JsonResponse({"pageProps": {}, "__N_SSG": True})
    
    # 開発環境のout/_nextを優先
    dev_file_path = os.path.join(base_dir, 'out', '_next', path)
    static_file_path = os.path.join(os.path.dirname(__file__), 'static', '_next', path)
    
    if os.path.exists(dev_file_path):
        file_path = dev_file_path
    elif os.path.exists(static_file_path):
        file_path = static_file_path
    else:
        raise Http404(f"Static file not found: {path}")
    
    # MIMEタイプを自動判定
    content_type, _ = mimetypes.guess_type(file_path)
    if content_type is None:
        if path.endswith('.js'):
            content_type = 'application/javascript'
        elif path.endswith('.css'):
            content_type = 'text/css'
        else:
            content_type = 'application/octet-stream'
    
    return FileResponse(open(file_path, 'rb'), content_type=content_type)

def serve_public_file(request, filename):
    """publicディレクトリの静的ファイルを配信（画像、アイコンなど）"""
    from django.http import FileResponse, Http404
    import os
    import mimetypes
    
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    
    # 開発環境のout/を優先
    dev_file_path = os.path.join(base_dir, 'out', filename)
    static_file_path = os.path.join(os.path.dirname(__file__), 'static', filename)
    
    if os.path.exists(dev_file_path):
        file_path = dev_file_path
    elif os.path.exists(static_file_path):
        file_path = static_file_path
    else:
        raise Http404(f"Public file not found: {filename}")
    
    # MIMEタイプを自動判定
    content_type, _ = mimetypes.guess_type(file_path)
    if content_type is None:
        content_type = 'application/octet-stream'
    
    return FileResponse(open(file_path, 'rb'), content_type=content_type)

def serve_user_page(request, page='login'):
    """Next.jsでビルドされたユーザーページを配信"""
    from django.http import FileResponse, Http404
    import os
    
    # 開発環境: out/user/{page}/index.html
    # 本番環境: static/user/{page}/index.html
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    
    # 開発環境のout/ディレクトリを優先
    dev_file_path = os.path.join(base_dir, 'out', 'user', page, 'index.html')
    static_file_path = os.path.join(os.path.dirname(__file__), 'static', 'user', page, 'index.html')
    
    if os.path.exists(dev_file_path):
        file_path = dev_file_path
    elif os.path.exists(static_file_path):
        file_path = static_file_path
    else:
        # フォールバック: user/{page}.html も試す
        dev_fallback = os.path.join(base_dir, 'out', 'user', f'{page}.html')
        static_fallback = os.path.join(os.path.dirname(__file__), 'static', 'user', f'{page}.html')
        if os.path.exists(dev_fallback):
            file_path = dev_fallback
        elif os.path.exists(static_fallback):
            file_path = static_fallback
        else:
            raise Http404(f"User page not found: {page}")
    
    response = FileResponse(open(file_path, 'rb'), content_type='text/html')
    # キャッシュを無効化
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response

def serve_user_subpage(request, page, subpage):
    """ユーザーサブページを配信（例: user/profile/settings）"""
    from django.http import FileResponse, Http404
    import os
    
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    
    # 開発環境のout/ディレクトリを優先
    dev_file_path = os.path.join(base_dir, 'out', 'user', page, subpage, 'index.html')
    static_file_path = os.path.join(os.path.dirname(__file__), 'static', 'user', page, subpage, 'index.html')
    
    if os.path.exists(dev_file_path):
        file_path = dev_file_path
    elif os.path.exists(static_file_path):
        file_path = static_file_path
    else:
        raise Http404(f"User subpage not found: {page}/{subpage}")
    
    response = FileResponse(open(file_path, 'rb'), content_type='text/html')
    # キャッシュを無効化
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response

def serve_user_detail_page(request, page, detail_id):
    """詳細ページを配信（例: user/stores/123）"""
    from django.http import FileResponse, Http404
    import os
    
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    
    # Next.jsの動的ルートは[id]フォルダ構造になる
    dev_file_path = os.path.join(base_dir, 'out', 'user', page, '[id]', 'index.html')
    static_file_path = os.path.join(os.path.dirname(__file__), 'static', 'user', page, '[id]', 'index.html')
    
    if os.path.exists(dev_file_path):
        file_path = dev_file_path
    elif os.path.exists(static_file_path):
        file_path = static_file_path
    else:
        raise Http404(f"User detail page not found: {page}/[id]")
    
    response = FileResponse(open(file_path, 'rb'), content_type='text/html')
    # キャッシュを無効化
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    return response




def serve_manifest(request):
    """PWA用manifest.json配信"""
    from django.http import JsonResponse
    manifest_data = {
        "name": "Melty+ (メルティプラス)",
        "short_name": "Melty+",
        "start_url": "/user/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#ec4899",
        "description": "大阪ミナミ・北新地で使えるポイント＆ギフトアプリ",
        "icons": [
            {
                "src": "/static/icons/icon-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/static/icons/icon-512x512.png",
                "sizes": "512x512",
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
        img = Image.new('RGB', (img_size, img_size), color='#ec4899')
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
    from django.http import FileResponse, Http404
    import os
    
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    
    # 開発環境のout/を優先
    dev_file_path = os.path.join(base_dir, 'out', 'favicon.ico')
    static_file_path = os.path.join(os.path.dirname(__file__), 'static', 'favicon.ico')
    
    if os.path.exists(dev_file_path):
        file_path = dev_file_path
    elif os.path.exists(static_file_path):
        file_path = static_file_path
    else:
        raise Http404("favicon.ico not found")
    
    return FileResponse(open(file_path, 'rb'), content_type='image/x-icon')

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

def health(_request):
    """ヘルスチェック"""
    return JsonResponse({
        "status": "ok", 
        "service": "melty-plus-user",
        "app_name": "Melty+"
    })

urlpatterns = [
    # Next.js静的ファイル配信
    path('_next/<path:path>', serve_next_static, name='next-static'),
    
    # PWAとConfig（faviconを先に定義）
    path('favicon.ico', serve_favicon, name='favicon'),
    path('manifest.json', serve_manifest, name='manifest'),
    path('static/manifest.json', serve_manifest, name='manifest-static'),
    path('config.json', serve_config, name='config'),
    path('static/icons/icon-<str:size>.png', serve_icon, name='pwa-icon'),
    
    # Publicファイル（画像、ロゴなど - faviconの後に配置）
    path('melty-logo.jpg', lambda request: serve_public_file(request, 'melty-logo.jpg'), name='melty-logo'),
    path('<str:filename>.jpg', serve_public_file, name='public-jpg'),
    path('<str:filename>.png', serve_public_file, name='public-png'),
    path('<str:filename>.svg', serve_public_file, name='public-svg'),
    path('<str:filename>.ico', serve_public_file, name='public-ico'),
    
    # API エンドポイント
    path('api/', include('core.urls')),
    path('api/social/', include('core.social_urls')),
    path('api/user/', include('core.urls')),
    path('api/status/', api_status, name='user-api-status'),
    path('api/health/', health, name='user-api-health'),
    path('api/get-totp/', get_totp, name='user-get-totp'),
    
    # ユーザーページルーティング（動的）
    # 詳細ページ（例: /user/stores/123/）
    path('user/<str:page>/<int:detail_id>/', serve_user_detail_page, name='user-detail-page'),
    
    # サブページ（例: /user/profile/settings/）
    path('user/<str:page>/<str:subpage>/', serve_user_subpage, name='user-subpage'),
    
    # メインページ（例: /user/login/）
    path('user/<str:page>/', serve_user_page, name='user-page'),
    
    # ルート（/user/ → login）
    path('user/', lambda request: serve_user_page(request, 'login'), name='user-root'),
    path('', lambda request: serve_user_page(request, 'login'), name='root'),
]

# 静的ファイル配信（開発時のみ）
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
