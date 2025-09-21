#!/bin/bash

# BIID Point App - HTTP専用ブラウザ確認用起動スクリプト
set -e

echo "🌐 BIID Point App HTTP専用起動"

# SSL関連の環境変数を明示的にFalseに設定
export DEBUG=True
export USE_POSTGRESQL=False
export USE_REDIS=False
export SECRET_KEY=EXPHo0nPnc9SQzDyhUEHPlkQJWuO0lUzJ9Lv9h1hkc4SExSIGT
export JWT_SECRET_KEY=FJnAOCr-bFy7skL5kz7LiVW1mnhMkVRu
export ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
export SECURE_SSL_REDIRECT=False
export SESSION_COOKIE_SECURE=False
export CSRF_COOKIE_SECURE=False

echo "📋 SSL設定確認:"
echo "   SECURE_SSL_REDIRECT: $SECURE_SSL_REDIRECT"
echo "   SESSION_COOKIE_SECURE: $SESSION_COOKIE_SECURE"
echo "   CSRF_COOKIE_SECURE: $CSRF_COOKIE_SECURE"

# 既存プロセス停止
pkill -f "python manage.py runserver" 2>/dev/null || true
sleep 2

# 各バックエンドを起動
echo "🚀 HTTP専用サーバー起動中..."

cd admin-backend
python manage.py runserver 127.0.0.1:8001 --settings=admin_settings &
ADMIN_PID=$!
cd ..

cd store-backend  
python manage.py runserver 127.0.0.1:8002 --settings=store_settings &
STORE_PID=$!
cd ..

cd user-backend
python manage.py runserver 127.0.0.1:8003 --settings=user_settings &
USER_PID=$!
cd ..

cd terminal-backend
python manage.py runserver 127.0.0.1:8004 --settings=terminal_settings &
TERMINAL_PID=$!
cd ..

echo "⏳ サーバー起動待機中..."
sleep 5

echo ""
echo "🎉 HTTP専用サーバー起動完了！"
echo ""
echo "🌐 HTTPでアクセスしてください:"
echo ""
echo "   🔐 管理者画面:     http://127.0.0.1:8001"
echo "   🏪 店舗管理画面:   http://127.0.0.1:8002"  
echo "   👤 ユーザー画面:   http://127.0.0.1:8003"
echo "   💳 決済端末画面:   http://127.0.0.1:8004"
echo ""
echo "⚠️  注意: httpsではなくhttpでアクセスしてください"
echo ""

# メイン処理待機
trap "kill $ADMIN_PID $STORE_PID $USER_PID $TERMINAL_PID 2>/dev/null; echo '🛑 全サーバー停止完了'; exit 0" INT

echo "💡 Ctrl+C で停止します..."
while true; do
    sleep 1
done