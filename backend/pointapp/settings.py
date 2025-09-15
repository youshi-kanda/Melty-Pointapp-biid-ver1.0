import os
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-me-in-production')

DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'core',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'core.partner_auth.PartnerAPIMiddleware',
    'core.security_middleware.SecurityMiddleware',
    'core.security_middleware.FraudDetectionMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'pointapp.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'pointapp.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'core.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'core.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

if DEBUG:
    # 開発環境では全てのオリジンを許可
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOW_HEADERS = [
        'accept',
        'accept-encoding',
        'authorization',
        'content-type',
        'dnt',
        'origin',
        'user-agent',
        'x-csrftoken',
        'x-requested-with',
        'x-client-version',
        'x-terminal-request',
    ]
else:
    # 本番環境では特定のオリジンのみ許可
    CORS_ALLOWED_ORIGINS = [
        'https://extending-guys-chess-prescribed.trycloudflare.com',
    ]
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOW_HEADERS = [
        'accept',
        'accept-encoding',
        'authorization',
        'content-type',
        'dnt',
        'origin',
        'user-agent',
        'x-csrftoken',
        'x-requested-with',
        'x-client-version',
        'x-terminal-request',
    ]

JWT_SECRET_KEY = config('JWT_SECRET_KEY', default='your-jwt-secret-here')
JWT_ALGORITHM = config('JWT_ALGORITHM', default='HS256')

# セキュリティ設定
SECURITY_SETTINGS = {
    'MAX_LOGIN_ATTEMPTS': 5,
    'LOGIN_LOCKOUT_DURATION': 7200,  # 2時間
    'RATE_LIMIT_WINDOW': 300,        # 5分
    'RATE_LIMIT_REQUESTS': 50,       # 5分間に50回
    'ANOMALY_THRESHOLD': 20,         # 1分間に20回
    'EXCESSIVE_POINTS_THRESHOLD': 100000,  # 10万ポイント
    'GIFT_EXCHANGE_LIMIT': 5,        # 1時間に5回
}

# ログ設定
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
            'formatter': 'verbose',
        },
        'security_file': {
            'level': 'WARNING',
            'class': 'logging.FileHandler',
            'filename': 'security.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'core.security_middleware': {
            'handlers': ['security_file', 'console'],
            'level': 'WARNING',
            'propagate': False,
        },
    },
}

# キャッシュ設定（Redis推奨）
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

# URL末尾スラッシュ問題を解消
APPEND_SLASH = False

# 決済ゲートウェイ設定
import os

# GMOPG設定（既存）
GMOPG_MOCK = os.getenv("GMOPG_MOCK", "false").lower() == "true"
GMOPG_SHOP_ID = os.getenv("GMOPG_SHOP_ID", "your_shop_id")  # 名前変更
GMOPG_SHOP_PASSWORD = os.getenv("GMOPG_SHOP_PASSWORD", "your_shop_pass")  # 名前変更
GMOPG_SITE_ID = os.getenv("GMOPG_SITE_ID", "your_site_id")  # 名前変更
GMOPG_SITE_PASSWORD = os.getenv("GMOPG_SITE_PASSWORD", "your_site_pass")  # 名前変更
GMOPG_API_BASE_URL = os.getenv("GMOPG_API_BASE_URL", "https://pt01.mul-pay.jp")
GMOPG_IS_PRODUCTION = os.getenv("GMOPG_IS_PRODUCTION", "false").lower() == "true"

# GMO FINCODE設定（新規）
FINCODE_MOCK = os.getenv("FINCODE_MOCK", "false").lower() == "true"  # テストAPIキー提供でfalseに変更
FINCODE_API_KEY = os.getenv("FINCODE_API_KEY", "p_test_YTY3YTRkZDMtOWIzNS00ODlhLTkzZDYtMzQzYWE5ZDQyMDQ5ZDdmZjIyYzgtNGNlZi00ODRhLWE0OTQtMzY3NTk2NTc4ZmZmc18yNTA4MjEwODQyOQ")
FINCODE_SECRET_KEY = os.getenv("FINCODE_SECRET_KEY", "")
FINCODE_SHOP_ID = os.getenv("FINCODE_SHOP_ID", "")
FINCODE_API_BASE_URL = os.getenv("FINCODE_API_BASE_URL", "https://api.test.fincode.jp")  # テスト環境URL
FINCODE_IS_PRODUCTION = os.getenv("FINCODE_IS_PRODUCTION", "false").lower() == "true"

# 決済ゲートウェイ選択設定
PAYMENT_GATEWAY = os.getenv("PAYMENT_GATEWAY", "fincode").lower()  # "gmopg" or "fincode"

# 後方互換性のため（既存のGMOPG設定を維持）
GMO_SHOP_ID = GMOPG_SHOP_ID
GMO_SHOP_PASS = GMOPG_SHOP_PASSWORD
GMO_SITE_ID = GMOPG_SITE_ID
GMO_SITE_PASS = GMOPG_SITE_PASSWORD
GMO_ENV = "production" if GMOPG_IS_PRODUCTION else "sandbox"
GMO_ENDPOINT = GMOPG_API_BASE_URL

# MELTY API連携設定（既存API活用版）
MELTY_API_BASE_URL = os.getenv('MELTY_API_BASE_URL', 'http://app-melty.com/melty-app_system/api')
# APIキー不要（既存ログインAPIを直接使用）
