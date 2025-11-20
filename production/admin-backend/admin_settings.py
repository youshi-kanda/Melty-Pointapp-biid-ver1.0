import os
import sys
from pathlib import Path

# プロジェクトルートを取得（production/admin-backend から ../../backend へ）
BASE_DIR = Path(__file__).resolve().parent.parent.parent / 'backend'
sys.path.append(str(BASE_DIR))

# 元のsettingsをimport
from pointapp.settings import *

# 管理者専用設定の上書き
# 環境変数からDEBUG設定を取得（デフォルトはFalse）
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'

# 管理者用ホスト設定
# 一時的にすべてのホストを許可（デバッグ用）
ALLOWED_HOSTS = ['*']
print(f"🔧 ALLOWED_HOSTS: {ALLOWED_HOSTS}")

# 静的ファイル設定（管理者画面専用）
STATIC_URL = '/static/'
STATIC_ROOT = Path(__file__).resolve().parent / 'staticfiles'
STATICFILES_DIRS = [
    Path(__file__).resolve().parent / 'static',
]

# テンプレート設定
TEMPLATES[0]['DIRS'].append(Path(__file__).resolve().parent / 'templates')

# 管理者専用ミドルウェア（セキュリティ強化）
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# 管理者専用CORS設定
if DEBUG:
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ]
else:
    CORS_ALLOWED_ORIGINS = [
        'https://admin.biid.app',
    ]

CORS_ALLOW_CREDENTIALS = True

# 管理者専用セキュリティ設定（本番環境）
if not DEBUG:
    # 厳格なHTTPS設定
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000  # 1年
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    
    # セキュアクッキー
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = True
    
    # セッション設定（管理者は短時間）
    SESSION_COOKIE_AGE = 3600  # 1時間
    SESSION_EXPIRE_AT_BROWSER_CLOSE = True
else:
    # 開発環境ではHTTP許可
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False

# 開発環境での強制設定
SECURE_SSL_REDIRECT = False
USE_TLS = False

# キャッシュ設定（Redis不使用、ローカルメモリキャッシュ）
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'biid-admin-cache',
        'TIMEOUT': 300,
    }
}

# 管理者用ログ設定
LOGGING['loggers']['admin'] = {
    'handlers': ['security_file', 'file'],
    'level': 'INFO',
    'propagate': False,
}

# アプリケーション設定（管理者機能のみ有効）
ADMIN_INTERFACE_ENABLED = True
STORE_INTERFACE_ENABLED = False
USER_INTERFACE_ENABLED = False  
TERMINAL_INTERFACE_ENABLED = False

# 管理者専用URL設定
ROOT_URLCONF = 'pointapp.urls'