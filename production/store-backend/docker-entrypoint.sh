#!/bin/bash
set -e

export PYTHONPATH="/app/backend:$PYTHONPATH"

echo "🚀 BIID Store Backend Starting..."

# DATABASE_URLから個別の環境変数を解析（存在しない場合のみ）
if [ -n "$DATABASE_URL" ] && [ -z "$DB_HOST" ]; then
    echo "📝 Parsing DATABASE_URL..."
    export DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    export DB_PASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
    export DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    export DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    export DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    echo "   DB_HOST=$DB_HOST"
    echo "   DB_PORT=$DB_PORT"
    echo "   DB_NAME=$DB_NAME"
    echo "   DB_USER=$DB_USER"
fi

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