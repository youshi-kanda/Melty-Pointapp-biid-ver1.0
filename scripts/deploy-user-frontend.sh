#!/bin/bash

# Melty+ User Frontend デプロイスクリプト
# ローカルで開発したNext.jsアプリを本番環境にデプロイ

set -e  # エラーで停止

echo "🚀 Melty+ User Frontend デプロイ開始..."
echo ""

# 1. カレントディレクトリ確認
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "📁 プロジェクトルート: $PROJECT_ROOT"
echo ""

# 2. Next.jsビルド
echo "🔨 Next.jsをビルド中..."
npm run build

if [ ! -d "out" ]; then
    echo "❌ ビルド失敗: out/ ディレクトリが作成されませんでした"
    exit 1
fi

echo "✅ ビルド完了"
echo ""

# 3. 既存ファイルのバックアップ
BACKUP_DIR="production/user-backend/static.backup-$(date +%Y%m%d-%H%M%S)"
echo "💾 既存ファイルをバックアップ: $BACKUP_DIR"

if [ -d "production/user-backend/static/_next" ]; then
    mkdir -p "$BACKUP_DIR"
    cp -r production/user-backend/static/_next "$BACKUP_DIR/"
    echo "✅ バックアップ完了"
else
    echo "⚠️  既存の_nextディレクトリが見つかりません（初回デプロイ?）"
fi
echo ""

# 4. 静的ファイルのコピー
echo "📦 ビルドファイルをproduction/user-backend/static/にコピー中..."

# _nextディレクトリを削除して新しいビルドをコピー
if [ -d "production/user-backend/static/_next" ]; then
    rm -rf production/user-backend/static/_next
fi

cp -r out/_next production/user-backend/static/

# 各HTMLファイルもコピー（必要に応じて）
# cp out/user/login.html production/user-backend/static/ 2>/dev/null || true
# cp out/user/map.html production/user-backend/static/ 2>/dev/null || true
# cp out/user/welcome.html production/user-backend/static/ 2>/dev/null || true

echo "✅ ファイルコピー完了"
echo ""

# 5. ビルドIDを記録
BUILD_ID=$(cat out/_next/BUILD_ID 2>/dev/null || echo "unknown")
echo "📝 Build ID: $BUILD_ID"
echo "$BUILD_ID" > production/user-backend/static/BUILD_ID.txt
echo "$(date)" >> production/user-backend/static/BUILD_ID.txt
echo ""

# 6. デプロイ確認
echo "🎯 次のステップ:"
echo ""
echo "1. ローカルで動作確認:"
echo "   cd production/user-backend"
echo "   python manage.py runserver 127.0.0.1:8003"
echo ""
echo "2. 問題なければFly.ioにデプロイ:"
echo "   cd production/user-backend"
echo "   fly deploy"
echo ""
echo "3. デプロイ後の確認:"
echo "   https://biid-user.fly.dev/"
echo ""

read -p "Fly.ioにデプロイしますか? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Fly.ioにデプロイ中..."
    cd production/user-backend
    fly deploy
    echo ""
    echo "✅ デプロイ完了!"
    echo "🌐 本番URL: https://biid-user.fly.dev/"
else
    echo "⏸️  デプロイをスキップしました"
    echo "💡 手動でデプロイする場合は上記のコマンドを実行してください"
fi

echo ""
echo "🎉 処理完了!"
