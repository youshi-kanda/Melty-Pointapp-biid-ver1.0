#!/bin/bash
set -e

export PYTHONPATH="/app/backend:$PYTHONPATH"

echo "🚀 BIID Admin Backend Starting..."

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
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if python -c "
import os
import psycopg2
try:
    psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432'),
        user=os.getenv('DB_USER', 'biid_user'),
        password=os.getenv('DB_PASSWORD', ''),
        dbname=os.getenv('DB_NAME', 'biid_production'),
        connect_timeout=5
    )
    print('✅ Database connection OK')
except Exception as e:
    print('❌ Database not ready:', e)
    exit(1)
"; then
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT+1))
    echo "   Database not ready (attempt $RETRY_COUNT/$MAX_RETRIES), waiting 2 seconds..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Database connection failed after $MAX_RETRIES attempts"
    echo "   Proceeding anyway..."
fi

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