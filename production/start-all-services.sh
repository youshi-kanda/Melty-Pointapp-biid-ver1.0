#!/bin/bash

# BIID 4つのインターフェース 一括起動スクリプト

echo "🚀 BIID ポイントアプリ - 4つのインターフェース起動"
echo "=============================================="

# ログディレクトリの作成
mkdir -p logs

# 各サービスを別々のポートで起動
echo "📱 管理者画面を起動中... (Port: 8001)"
cd admin-backend && python manage.py runserver 127.0.0.1:8001 > ../logs/admin.log 2>&1 &
ADMIN_PID=$!
cd ..

echo "🏪 店舗管理画面を起動中... (Port: 8002)"
cd store-backend && python manage.py runserver 127.0.0.1:8002 > ../logs/store.log 2>&1 &
STORE_PID=$!
cd ..

echo "👤 ユーザー画面を起動中... (Port: 8003)"
cd user-backend && python manage.py runserver 127.0.0.1:8003 > ../logs/user.log 2>&1 &
USER_PID=$!
cd ..

echo "💳 決済端末画面を起動中... (Port: 8004)"
cd terminal-backend && python manage.py runserver 127.0.0.1:8004 > ../logs/terminal.log 2>&1 &
TERMINAL_PID=$!
cd ..

# ちょっと待つ
sleep 3

echo ""
echo "✅ 全サービス起動完了！"
echo "=============================================="
echo "🔗 アクセス URL:"
echo "   管理者画面:     http://127.0.0.1:8001"
echo "   店舗管理画面:   http://127.0.0.1:8002"  
echo "   ユーザー画面:   http://127.0.0.1:8003"
echo "   決済端末画面:   http://127.0.0.1:8004"
echo ""
echo "📋 プロセス ID:"
echo "   Admin:    $ADMIN_PID"
echo "   Store:    $STORE_PID" 
echo "   User:     $USER_PID"
echo "   Terminal: $TERMINAL_PID"
echo ""
echo "⚠️  停止するには Ctrl+C を押してください"

# プロセス情報を保存
echo "$ADMIN_PID $STORE_PID $USER_PID $TERMINAL_PID" > .pids

# シグナルハンドラー設定（Ctrl+Cで全プロセス終了）
trap 'echo ""; echo "🛑 全サービスを停止中..."; kill $ADMIN_PID $STORE_PID $USER_PID $TERMINAL_PID 2>/dev/null; rm -f .pids; echo "✅ 停止完了"; exit' INT

# 待機（フォアグラウンドで実行継続）
wait