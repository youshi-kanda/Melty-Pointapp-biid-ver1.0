import os
import sys
from pathlib import Path

# プロジェクトルートを取得（production/store-backend から ../../backend へ）
BASE_DIR = Path(__file__).resolve().parent.parent.parent / 'backend'
sys.path.append(str(BASE_DIR))

# 元のsettingsをimport
from pointapp.settings import *

# 店舗専用設定の上書き
DEBUG = os.getenv('STORE_DEBUG', 'True').lower() == 'true'  # 開発時はTrue

# 店舗用ホスト設定
ALLOWED_HOSTS = os.getenv('STORE_ALLOWED_HOSTS', 'store.biid.app,localhost,127.0.0.1').split(',')

# 静的ファイル設定（店舗画面専用）
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    Path(__file__).resolve().parent / 'static',
]

# テンプレート設定
TEMPLATES[0]['DIRS'].append(Path(__file__).resolve().parent / 'templates')

# 店舗専用ミドルウェア
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

# 店舗専用CORS設定
if DEBUG:
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ]
else:
    CORS_ALLOWED_ORIGINS = [
        'https://store.biid.app',
    ]

CORS_ALLOW_CREDENTIALS = True

# 店舗専用セキュリティ設定
if not DEBUG:
    # 適度なHTTPS設定
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 86400  # 24時間
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    
    # セキュアクッキー
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = True
    
    # セッション設定（店舗は長時間）
    SESSION_COOKIE_AGE = 28800  # 8時間
    SESSION_EXPIRE_AT_BROWSER_CLOSE = False
else:
    # 開発環境ではHTTP許可
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False

# 店舗用ログ設定
LOGGING['loggers']['store'] = {
    'handlers': ['file', 'console'],
    'level': 'INFO',
    'propagate': False,
}

# アプリケーション設定（店舗機能のみ有効）
ADMIN_INTERFACE_ENABLED = False
STORE_INTERFACE_ENABLED = True
USER_INTERFACE_ENABLED = False
TERMINAL_INTERFACE_ENABLED = False

# 店舗専用機能設定
STORE_FEATURES = {
    'PAYMENT_PROCESSING': True,
    'DEPOSIT_MANAGEMENT': True, 
    'PROMOTION_MANAGEMENT': True,
    'CUSTOMER_BILLING': True,
    'REPORTS': True,
}

# 店舗専用URL設定
ROOT_URLCONF = 'urls'