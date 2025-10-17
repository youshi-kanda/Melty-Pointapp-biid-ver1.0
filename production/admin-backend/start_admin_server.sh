#!/bin/bash

echo "🚀 BIID運営管理画面サーバーを起動します..."

# 既存のサーバーを停止
pkill -f "manage.py runserver" || true
sleep 2

# サーバーを起動
echo "📡 Django開発サーバーを起動中..."
python manage.py runserver 8001 &

# プロセスIDを保存
SERVER_PID=$!
echo $SERVER_PID > server.pid

# 起動確認
sleep 3
if curl -s http://localhost:8001/ > /dev/null; then
    echo "✅ 運営管理画面サーバーが正常に起動しました！"
    echo ""
    echo "📋 アクセス可能なURL:"
    echo "   • ログイン画面: http://localhost:8001/"
    echo "   • 6カテゴリ設定: http://localhost:8001/admin/settings"
    echo "   • ダッシュボード: http://localhost:8001/api/admin/management/"
    echo "   • ユーザー管理: http://localhost:8001/users/"
    echo "   • 店舗管理: http://localhost:8001/stores/"
    echo ""
    echo "🔧 サーバー停止: kill $SERVER_PID または ./stop_admin_server.sh"
else
    echo "❌ サーバー起動に失敗しました"
    exit 1
fi

# フォアグラウンドで実行継続
wait $SERVER_PID