#!/bin/bash

# BIID Point App - 本番サーバー起動スクリプト
set -e

echo "🚀 BIID Point App 本番環境起動開始"

# 環境変数ファイル確認
if [ ! -f .env.production ]; then
    echo "⚠️  .env.production ファイルが見つかりません"
    echo "📝 .env.production.example をコピーして設定してください"
    exit 1
fi

# Docker環境確認
if ! command -v docker &> /dev/null; then
    echo "❌ Docker がインストールされていません"
    echo "🔗 https://docs.docker.com/get-docker/ からインストールしてください"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose がインストールされていません"
    exit 1
fi

# 本番環境セットアップ確認
echo "🔍 本番環境設定確認中..."
source .env.production

# 必須環境変数チェック
required_vars=("SECRET_KEY" "DB_PASSWORD" "JWT_SECRET_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ 環境変数 $var が設定されていません"
        echo "📝 .env.production ファイルを確認してください"
        exit 1
    fi
done

# 既存サービス停止
echo "🛑 既存サービス停止中..."
docker-compose down 2>/dev/null || true

# イメージビルド
echo "🏗️  Docker イメージビルド中..."
docker-compose build

# サービス起動
echo "🚀 サービス起動中..."
docker-compose up -d

# 起動確認
echo "⏳ サービス起動確認中..."
services=("postgresql" "redis" "admin-backend" "store-backend" "user-backend" "terminal-backend")

for service in "${services[@]}"; do
    for i in {1..30}; do
        if docker-compose ps "$service" | grep -q "Up"; then
            echo "✅ $service 起動完了"
            break
        fi
        if [ $i -eq 30 ]; then
            echo "❌ $service 起動失敗"
            docker-compose logs "$service"
            exit 1
        fi
        sleep 2
    done
done

# エンドポイント確認
echo "🔍 エンドポイント確認中..."
sleep 10

endpoints=(
    "http://localhost:8001|Admin Backend"
    "http://localhost:8002|Store Backend" 
    "http://localhost:8003|User Backend"
    "http://localhost:8004|Terminal Backend"
)

for endpoint in "${endpoints[@]}"; do
    url=$(echo "$endpoint" | cut -d'|' -f1)
    name=$(echo "$endpoint" | cut -d'|' -f2)
    
    if curl -s "$url" > /dev/null; then
        echo "✅ $name ($url) - OK"
    else
        echo "⚠️  $name ($url) - 応答なし（起動中の可能性）"
    fi
done

echo ""
echo "🎉 BIID Point App 本番環境起動完了！"
echo ""
echo "📋 アクセス情報:"
echo "   🔐 管理者画面:     http://localhost:8001"
echo "   🏪 店舗管理画面:   http://localhost:8002"
echo "   👤 ユーザー画面:   http://localhost:8003"  
echo "   💳 決済端末画面:   http://localhost:8004"
echo ""
echo "📊 監視コマンド:"
echo "   docker-compose logs -f          # 全ログ表示"
echo "   docker-compose ps               # サービス状態確認"
echo "   docker-compose down             # サービス停止"
echo ""
echo "✨ 本番運用準備完了しました！"