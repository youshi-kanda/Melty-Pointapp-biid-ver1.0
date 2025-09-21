#!/bin/bash

# BIID Point App - ブラウザ確認用開発サーバー起動スクリプト
set -e

echo "🌐 BIID Point App ブラウザ確認用起動開始"

# 環境変数設定
export DEBUG=True
export USE_POSTGRESQL=False
export USE_REDIS=False
export SECRET_KEY=EXPHo0nPnc9SQzDyhUEHPlkQJWuO0lUzJ9Lv9h1hkc4SExSIGT
export JWT_SECRET_KEY=FJnAOCr-bFy7skL5kz7LiVW1mnhMkVRu
export ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

echo "📋 設定確認:"
echo "   DEBUG: $DEBUG"
echo "   USE_POSTGRESQL: $USE_POSTGRESQL" 
echo "   USE_REDIS: $USE_REDIS"

# 各バックエンドを別プロセスで起動
echo "🚀 各バックエンドサービス起動中..."

# Admin Backend (ポート 8001)
cd admin-backend
echo "   🔐 管理者バックエンド起動 (ポート 8001)"
python manage.py runserver 127.0.0.1:8001 --settings=admin_settings &
ADMIN_PID=$!

cd ..

# Store Backend (ポート 8002)  
cd store-backend
echo "   🏪 店舗バックエンド起動 (ポート 8002)"
python manage.py runserver 127.0.0.1:8002 --settings=store_settings &
STORE_PID=$!

cd ..

# User Backend (ポート 8003)
cd user-backend
echo "   👤 ユーザーバックエンド起動 (ポート 8003)"
python manage.py runserver 127.0.0.1:8003 --settings=user_settings &
USER_PID=$!

cd ..

# Terminal Backend (ポート 8004)
cd terminal-backend  
echo "   💳 決済端末バックエンド起動 (ポート 8004)"
python manage.py runserver 127.0.0.1:8004 --settings=terminal_settings &
TERMINAL_PID=$!

cd ..

echo ""
echo "⏳ サーバー起動待機中..."
sleep 10

# プロセス確認
echo ""
echo "📊 プロセス状態確認:"
ps -p $ADMIN_PID >/dev/null && echo "   ✅ Admin Backend (PID: $ADMIN_PID)" || echo "   ❌ Admin Backend"
ps -p $STORE_PID >/dev/null && echo "   ✅ Store Backend (PID: $STORE_PID)" || echo "   ❌ Store Backend"
ps -p $USER_PID >/dev/null && echo "   ✅ User Backend (PID: $USER_PID)" || echo "   ❌ User Backend"
ps -p $TERMINAL_PID >/dev/null && echo "   ✅ Terminal Backend (PID: $TERMINAL_PID)" || echo "   ❌ Terminal Backend"

# エンドポイント確認
echo ""
echo "🔍 エンドポイント確認中..."
sleep 5

endpoints=(
    "http://127.0.0.1:8001|管理者画面"
    "http://127.0.0.1:8002|店舗管理画面"
    "http://127.0.0.1:8003|ユーザー画面"
    "http://127.0.0.1:8004|決済端末画面"
)

for endpoint in "${endpoints[@]}"; do
    url=$(echo "$endpoint" | cut -d'|' -f1)
    name=$(echo "$endpoint" | cut -d'|' -f2)
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|302\|404"; then
        echo "   ✅ $name ($url)"
    else
        echo "   ⚠️  $name ($url) - 起動中..."
    fi
done

echo ""
echo "🎉 BIID Point App 開発環境起動完了！"
echo ""
echo "🌐 ブラウザで以下のURLにアクセスしてください:"
echo ""
echo "   🔐 管理者画面:     http://127.0.0.1:8001"
echo "   🏪 店舗管理画面:   http://127.0.0.1:8002"
echo "   👤 ユーザー画面:   http://127.0.0.1:8003"
echo "   💳 決済端末画面:   http://127.0.0.1:8004"
echo ""
echo "🛑 停止するには:"
echo "   Ctrl+C を押すか"
echo "   kill $ADMIN_PID $STORE_PID $USER_PID $TERMINAL_PID"
echo ""
echo "📝 ログ確認:"
echo "   各ターミナルでログを確認できます"

# メイン処理待機（Ctrl+C で終了）
trap "kill $ADMIN_PID $STORE_PID $USER_PID $TERMINAL_PID 2>/dev/null; echo ''; echo '🛑 全サービス停止完了'; exit 0" INT

echo "💡 Ctrl+C で全サービス停止します..."
while true; do
    sleep 1
done