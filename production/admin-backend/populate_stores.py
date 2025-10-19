#!/usr/bin/env python
"""
店舗データ投入スクリプト（Fly.io Admin Backend専用）

実行方法:
flyctl ssh console -a biid-admin
python /app/admin-backend/populate_stores.py
"""
import sys
import os

# パス設定
sys.path.insert(0, '/app/backend')
sys.path.insert(0, '/app/admin-backend')

# 環境変数設定（Fly.ioの環境変数を使用）
os.environ['DJANGO_SETTINGS_MODULE'] = 'admin_settings'

# DATABASE_URLから環境変数をパース（admin_settingsが行うのと同じ処理）
if 'DATABASE_URL' in os.environ:
    db_url = os.environ['DATABASE_URL']
    # postgres://user:pass@host:port/dbname の形式
    import re
    match = re.match(r'postgres://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', db_url)
    if match:
        os.environ['DB_USER'] = match.group(1)
        os.environ['DB_PASSWORD'] = match.group(2)
        os.environ['DB_HOST'] = match.group(3)
        os.environ['DB_PORT'] = match.group(4)
        os.environ['DB_NAME'] = match.group(5)

import django
django.setup()

# コマンドを実行
from django.core.management import call_command
call_command('create_osaka_stores')
