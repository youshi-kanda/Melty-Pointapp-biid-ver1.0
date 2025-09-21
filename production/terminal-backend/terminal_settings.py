import os
import sys
from pathlib import Path

# プロジェクトルートを取得（production/terminal-backend から ../../backend へ）
BASE_DIR = Path(__file__).resolve().parent.parent.parent / 'backend'
sys.path.append(str(BASE_DIR))

# 元のsettingsをimport
from pointapp.settings import *

# 決済端末専用設定の上書き
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'  # 開発時はTrue

# 決済端末用ホスト設定
ALLOWED_HOSTS = os.getenv('TERMINAL_ALLOWED_HOSTS', 'terminal.biid.app,localhost,127.0.0.1').split(',')

# 静的ファイル設定（決済端末画面専用）
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    Path(__file__).resolve().parent / 'static',
]

# テンプレート設定
TEMPLATES[0]['DIRS'].append(Path(__file__).resolve().parent / 'templates')

# 決済端末専用ミドルウェア（最小構成・高速化）
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

# 決済端末専用CORS設定
if DEBUG:
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ]
else:
    CORS_ALLOWED_ORIGINS = [
        'https://terminal.biid.app',
    ]

CORS_ALLOW_CREDENTIALS = True

# 決済端末専用セキュリティ設定（厳格）
if not DEBUG:
    # 端末用厳格なセキュリティ
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000  # 1年
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    
    # セキュアクッキー
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = True
    
    # セッション設定（端末は長時間・自動ログアウト）
    SESSION_COOKIE_AGE = 43200  # 12時間
    SESSION_EXPIRE_AT_BROWSER_CLOSE = False
else:
    # 開発環境ではHTTP許可
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False

# 決済端末用ログ設定（取引ログ重要）
LOGGING['loggers']['terminal'] = {
    'handlers': ['security_file', 'file'],
    'level': 'INFO',
    'propagate': False,
}

# 決済端末専用の取引ログ
LOGGING['loggers']['payment'] = {
    'handlers': ['security_file'],
    'level': 'INFO',
    'propagate': False,
}

# アプリケーション設定（決済端末機能のみ有効）
ADMIN_INTERFACE_ENABLED = False
STORE_INTERFACE_ENABLED = False
USER_INTERFACE_ENABLED = False
TERMINAL_INTERFACE_ENABLED = True

# 決済端末専用機能設定
TERMINAL_FEATURES = {
    'NFC_SCANNING': True,
    'PAYMENT_PROCESSING': True,
    'POINT_GRANTING': True,
    'RECEIPT_PRINTING': True,
    'OFFLINE_MODE': True,  # オフライン対応
    'AUTO_LOGOUT': True,
}

# URL設定 - 決済端末専用URLを使用
ROOT_URLCONF = 'urls'