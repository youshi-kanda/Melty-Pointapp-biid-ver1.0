#!/bin/bash

# BIID Point App - 正しい設定でのブラウザ確認用起動スクリプト
set -e

echo "🌐 BIID Point App 正しいインターフェース起動開始"

# 環境変数設定
export DEBUG=True
export USE_POSTGRESQL=False
export USE_REDIS=False
export SECRET_KEY=EXPHo0nPnc9SQzDyhUEHPlkQJWuO0lUzJ9Lv9h1hkc4SExSIGT
export JWT_SECRET_KEY=FJnAOCr-bFy7skL5kz7LiVW1mnhMkVRu
export ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# 既存プロセス停止
echo "🛑 既存プロセス停止中..."
pkill -f "python manage.py runserver" 2>/dev/null || true
sleep 2

# 各バックエンドを正しい設定で起動
echo "🚀 各バックエンドサービス起動中..."

# Admin Backend (ポート 8001) - 管理者用
cd admin-backend
echo "   🔐 管理者バックエンド起動 (ポート 8001)"
python manage.py runserver 127.0.0.1:8001 --settings=admin_settings &
ADMIN_PID=$!
cd ..

# Store Backend (ポート 8002) - 店舗管理用
cd store-backend
echo "   🏪 店舗バックエンド起動 (ポート 8002)"
python manage.py runserver 127.0.0.1:8002 --settings=store_settings &
STORE_PID=$!
cd ..

# User Backend (ポート 8003) - ユーザー用
cd user-backend
echo "   👤 ユーザーバックエンド起動 (ポート 8003)"
python manage.py runserver 127.0.0.1:8003 --settings=user_settings &
USER_PID=$!
cd ..

# Terminal Backend (ポート 8004) - 決済端末用
cd terminal-backend
echo "   💳 決済端末バックエンド起動 (ポート 8004)"
python manage.py runserver 127.0.0.1:8004 --settings=terminal_settings &
TERMINAL_PID=$!
cd ..

echo ""
echo "⏳ サーバー起動待機中..."
sleep 8

# プロセス確認
echo ""
echo "📊 プロセス状態確認:"
ps -p $ADMIN_PID >/dev/null 2>&1 && echo "   ✅ Admin Backend (PID: $ADMIN_PID)" || echo "   ❌ Admin Backend 起動失敗"
ps -p $STORE_PID >/dev/null 2>&1 && echo "   ✅ Store Backend (PID: $STORE_PID)" || echo "   ❌ Store Backend 起動失敗"
ps -p $USER_PID >/dev/null 2>&1 && echo "   ✅ User Backend (PID: $USER_PID)" || echo "   ❌ User Backend 起動失敗"
ps -p $TERMINAL_PID >/dev/null 2>&1 && echo "   ✅ Terminal Backend (PID: $TERMINAL_PID)" || echo "   ❌ Terminal Backend 起動失敗"

# エンドポイント確認
echo ""
echo "🔍 エンドポイント確認中..."
sleep 3

endpoints=(
    "http://127.0.0.1:8001|🔐 管理者画面"
    "http://127.0.0.1:8002|🏪 店舗管理画面"
    "http://127.0.0.1:8003|👤 ユーザー画面"
    "http://127.0.0.1:8004|💳 決済端末画面"
)

for endpoint in "${endpoints[@]}"; do
    url=$(echo "$endpoint" | cut -d'|' -f1)
    name=$(echo "$endpoint" | cut -d'|' -f2)
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|302"; then
        echo "   ✅ $name ($url)"
    else
        echo "   ⚠️  $name ($url) - 起動中または問題あり"
    fi
done

echo ""
echo "🎉 BIID Point App 起動完了！"
echo ""
echo "🌐 ブラウザで以下のURLにアクセスしてください:"
echo ""
echo "   🔐 管理者画面:     http://127.0.0.1:8001"
echo "      → システム管理・ユーザー管理・レポート"
echo ""
echo "   🏪 店舗管理画面:   http://127.0.0.1:8002"  
echo "      → 店舗ダッシュボード・決済・請求管理"
echo ""
echo "   👤 ユーザー画面:   http://127.0.0.1:8003"
echo "      → ポイント管理・ギフト・ソーシャル機能"
echo ""
echo "   💳 決済端末画面:   http://127.0.0.1:8004"
echo "      → NFC決済・ポイント付与・端末操作"
echo ""
echo "🛑 停止するには:"
echo "   Ctrl+C を押すか以下のコマンド:"
echo "   kill $ADMIN_PID $STORE_PID $USER_PID $TERMINAL_PID"
echo ""

# メイン処理待機（Ctrl+C で終了）
trap "kill $ADMIN_PID $STORE_PID $USER_PID $TERMINAL_PID 2>/dev/null; echo ''; echo '🛑 全サービス停止完了'; exit 0" INT

echo "💡 Ctrl+C で全サービス停止します..."
echo "📝 各サービスのログはターミナルに表示されます"

while true; do
    sleep 1
done