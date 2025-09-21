import os
import sys
from pathlib import Path

# プロジェクトルートを取得（production/user-backend から ../../backend へ）
BASE_DIR = Path(__file__).resolve().parent.parent.parent / 'backend'
sys.path.append(str(BASE_DIR))

# 元のsettingsをimport
from pointapp.settings import *

# ユーザー専用設定の上書き
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'  # 開発時はTrue

# ユーザー用ホスト設定
ALLOWED_HOSTS = os.getenv('USER_ALLOWED_HOSTS', 'app.biid.app,localhost,127.0.0.1').split(',')

# 静的ファイル設定（ユーザー画面専用）
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    Path(__file__).resolve().parent / 'static',
]

# テンプレート設定
TEMPLATES[0]['DIRS'].append(Path(__file__).resolve().parent / 'templates')

# カスタムミドルウェア
class ForceHTTPMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        # 開発環境でHTTPS強制を防ぐ
        if hasattr(response, '__setitem__'):
            response['Strict-Transport-Security'] = 'max-age=0'
        return response

# ユーザー専用ミドルウェア
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'user_settings.ForceHTTPMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ユーザー専用CORS設定
if DEBUG:
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ]
else:
    CORS_ALLOWED_ORIGINS = [
        'https://app.biid.app',
    ]

CORS_ALLOW_CREDENTIALS = True

# ユーザー専用セキュリティ設定
if not DEBUG:
    # モバイル最適化されたHTTPS設定
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 86400  # 24時間
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    
    # セキュアクッキー
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = True
    
    # セッション設定（ユーザーは中時間）
    SESSION_COOKIE_AGE = 14400  # 4時間
    SESSION_EXPIRE_AT_BROWSER_CLOSE = False
else:
    # 開発環境ではHTTP許可
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    
    # 開発環境でのセキュリティヘッダー無効化
    SECURE_HSTS_SECONDS = 0
    SECURE_CONTENT_TYPE_NOSNIFF = False
    SECURE_BROWSER_XSS_FILTER = False
    SECURE_REFERRER_POLICY = None

# ユーザー用ログ設定
LOGGING['loggers']['user'] = {
    'handlers': ['file', 'console'],
    'level': 'INFO',
    'propagate': False,
}

# アプリケーション設定（ユーザー機能のみ有効）
ADMIN_INTERFACE_ENABLED = False
STORE_INTERFACE_ENABLED = False
USER_INTERFACE_ENABLED = True
TERMINAL_INTERFACE_ENABLED = False

# ユーザー専用機能設定
USER_FEATURES = {
    'SOCIAL_FEATURES': True,
    'POINT_MANAGEMENT': True,
    'GIFT_EXCHANGE': True,
    'STORE_LOCATOR': True,
    'MELTY_INTEGRATION': True,
    'TWO_FACTOR_AUTH': True,
}

# URL設定 - ユーザー専用URLを使用
ROOT_URLCONF = 'urls'