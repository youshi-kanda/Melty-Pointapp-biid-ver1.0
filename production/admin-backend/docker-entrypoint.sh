#!/bin/bash
set -e

export PYTHONPATH="/app/backend:$PYTHONPATH"

echo "🚀 BIID Admin Backend Starting..."

# データベース接続確認
echo "⏳ Waiting for database..."
while ! python -c "
import os
import psycopg2
try:
    psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432'),
        user=os.getenv('DB_USER', 'biid_user'),
        password=os.getenv('DB_PASSWORD', ''),
        dbname=os.getenv('DB_NAME', 'biid_production')
    )
    print('✅ Database connection OK')
except Exception as e:
    print('❌ Database not ready:', e)
    exit(1)
"; do
    echo "   Database not ready, waiting 2 seconds..."
    sleep 2
done

# マイグレーション実行
echo "🔧 Running migrations..."
python manage.py migrate --settings=admin_settings --noinput

# 静的ファイル収集（本番用）
if [ "${DEBUG}" != "True" ]; then
    echo "📦 Collecting static files..."
    python manage.py collectstatic --settings=admin_settings --noinput
fi

# スーパーユーザー作成（初回のみ）
if [ "${CREATE_SUPERUSER}" = "True" ] && [ -n "${DJANGO_SUPERUSER_EMAIL}" ]; then
    echo "👤 Creating superuser..."
    python manage.py createsuperuser --noinput --settings=admin_settings || echo "Superuser already exists"
fi

echo "✅ Admin Backend ready!"

# 引数を実行
exec "$@"