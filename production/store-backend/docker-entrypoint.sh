#!/bin/bash
set -e

echo "🚀 BIID Store Backend Starting..."

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

echo "🔧 Running migrations..."
python manage.py migrate --settings=store_settings --noinput

if [ "${DEBUG}" != "True" ]; then
    echo "📦 Collecting static files..."
    python manage.py collectstatic --settings=store_settings --noinput
fi

echo "✅ Store Backend ready!"

exec "$@"