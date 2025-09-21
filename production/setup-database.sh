#!/bin/bash

# BIID Point App データベースセットアップスクリプト
# PostgreSQL + Redis の起動とDjangoマイグレーション

set -e

echo "🐘 BIID Point App データベースセットアップ開始"

# 環境変数の確認
if [ ! -f .env.production ]; then
    echo "⚠️  .env.production ファイルが見つかりません"
    echo "📝 .env.production.example をコピーして設定してください"
    cp .env.production.example .env.production
    echo "✅ .env.production を作成しました。設定を確認してください。"
    exit 1
fi

# Docker Compose でPostgreSQL + Redis起動
echo "🚀 PostgreSQL と Redis を起動中..."
docker-compose -f docker-compose.postgresql.yml up -d

# ヘルスチェック待機
echo "⏳ データベースの起動を待機中..."
for i in {1..30}; do
    if docker-compose -f docker-compose.postgresql.yml exec postgresql pg_isready -U biid_user -d biid_production > /dev/null 2>&1; then
        echo "✅ PostgreSQL が準備完了"
        break
    fi
    echo "   データベース起動待機中... ($i/30)"
    sleep 2
done

echo "⏳ Redis の起動を待機中..."
for i in {1..10}; do
    if docker-compose -f docker-compose.postgresql.yml exec redis redis-cli ping > /dev/null 2>&1; then
        echo "✅ Redis が準備完了"
        break
    fi
    echo "   Redis起動待機中... ($i/10)"
    sleep 1
done

# 環境変数の設定
export USE_POSTGRESQL=True
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=biid_production
export DB_USER=biid_user
export DB_PASSWORD=${DB_PASSWORD:-biid_secure_password_2024}
export REDIS_URL=redis://localhost:6379/0

echo "🔧 Django マイグレーション実行中..."

# 各バックエンドでマイグレーション実行
backends=("admin-backend" "store-backend" "user-backend" "terminal-backend")

for backend in "${backends[@]}"; do
    echo "📦 $backend のマイグレーション実行..."
    cd $backend
    
    # マイグレーションファイル作成
    if [ "$backend" = "admin-backend" ]; then
        python manage.py makemigrations --settings=admin_settings
        python manage.py migrate --settings=admin_settings
    elif [ "$backend" = "store-backend" ]; then
        python manage.py makemigrations --settings=store_settings
        python manage.py migrate --settings=store_settings
    elif [ "$backend" = "user-backend" ]; then
        python manage.py makemigrations --settings=user_settings
        python manage.py migrate --settings=user_settings
    elif [ "$backend" = "terminal-backend" ]; then
        python manage.py makemigrations --settings=terminal_settings
        python manage.py migrate --settings=terminal_settings
    fi
    
    cd ..
    echo "✅ $backend マイグレーション完了"
done

# スーパーユーザー作成（オプション）
read -p "🔐 管理者用スーパーユーザーを作成しますか？ (y/N): " create_superuser
if [[ $create_superuser =~ ^[Yy]$ ]]; then
    echo "👤 スーパーユーザー作成..."
    cd admin-backend
    python manage.py createsuperuser --settings=admin_settings
    cd ..
fi

echo "🎉 データベースセットアップ完了！"
echo ""
echo "📋 アクセス情報:"
echo "   PostgreSQL: localhost:5432 (biid_production)"
echo "   Redis: localhost:6379"
echo "   pgAdmin: http://localhost:8080"
echo "     Email: admin@biid.app"
echo "     Password: \$PGADMIN_PASSWORD"
echo ""
echo "🚀 次のステップ:"
echo "   各バックエンドを起動してください:"
echo "   ./start_production_servers.sh"