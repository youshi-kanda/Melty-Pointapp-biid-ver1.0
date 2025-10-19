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
os.environ['DJANGO_SETTINGS_MODULE'] = 'admin_settings'

import django
django.setup()

# コマンドを実行
from django.core.management import call_command
call_command('create_osaka_stores')
