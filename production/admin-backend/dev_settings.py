# -*- coding: utf-8 -*-
"""
運営管理画面 開発用設定
ホットリロード対応・404エラー適切処理
"""

from admin_settings import *

# 開発モード有効化
DEBUG = True
ALLOWED_HOSTS = ['*']

# CORS設定（開発用）
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# ログ設定（開発用）
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
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

# キャッシュ無効化（開発用）
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# 静的ファイル設定（開発用）
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# タイムゾーン設定
USE_TZ = True
TIME_ZONE = 'Asia/Tokyo'

# セキュリティ設定（開発用に緩和）
SECURE_SSL_REDIRECT = False
SECURE_HSTS_SECONDS = 0
SECURE_CONTENT_TYPE_NOSNIFF = False
SECURE_BROWSER_XSS_FILTER = False
X_FRAME_OPTIONS = 'SAMEORIGIN'

# セッション設定（開発用）
SESSION_COOKIE_SECURE = False
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_AGE = 3600  # 1時間

# CSRF設定（開発用）
CSRF_COOKIE_SECURE = False
CSRF_TRUSTED_ORIGINS = [
    'http://127.0.0.1:8002',
    'http://localhost:8002',
]

# 開発用メール設定
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

print("🚀 運営管理画面 - 開発モードで起動しました (Port: 8002)")
print("   URL: http://127.0.0.1:8002/")
print("   ホットリロード: 有効")
print("   デバッグ: 有効")