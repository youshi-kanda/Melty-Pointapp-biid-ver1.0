#!/bin/bash
# BIID Point App - 開発用サーバー起動スクリプト
# 4つの本番バックエンドを開発モードで起動

echo "🚀 BIID Point App - 開発サーバーを起動しています..."
echo ""

# 既存のプロセスを終了
echo "既存のサーバープロセスを終了中..."
pkill -f "manage.py runserver"
sleep 2

# 各バックエンドを開発モードで起動
cd "$(dirname "$0")"

echo "1️⃣  運営管理画面を起動中..."
cd admin-backend
python manage.py runserver 127.0.0.1:8002 --settings=dev_settings &
sleep 1

echo "2️⃣  ユーザー画面を起動中..."
cd ../user-backend  
python manage.py runserver 127.0.0.1:8003 --settings=dev_settings &
sleep 1

echo "3️⃣  決済端末画面を起動中..."
cd ../terminal-backend
python manage.py runserver 127.0.0.1:8004 --settings=dev_settings &
sleep 1

echo "4️⃣  店舗管理画面を起動中..."
cd ../store-backend
python manage.py runserver 127.0.0.1:8005 --settings=dev_settings &
sleep 2

echo ""
echo "✅ 全サーバーが起動しました！"
echo ""
echo "📱 アクセスURL:"
echo "   🚀 運営管理画面:   http://127.0.0.1:8002/"
echo "   👤 ユーザー画面:   http://127.0.0.1:8003/"  
echo "   💳 決済端末画面:   http://127.0.0.1:8004/"
echo "   🏪 店舗管理画面:   http://127.0.0.1:8005/"
echo ""
echo "⚡ ホットリロード有効 - ファイル変更が即座に反映されます"
echo "🛑 停止する場合: Ctrl+C または pkill -f 'manage.py runserver'"
echo ""

# フォアグラウンドで待機
wait