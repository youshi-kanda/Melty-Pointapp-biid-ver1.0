#!/bin/bash
# BIID Point App - 開発用サーバー停止スクリプト

echo "🛑 開発サーバーを停止しています..."

# 開発サーバープロセスを終了
pkill -f "manage.py runserver.*dev_settings"

sleep 2

echo "✅ 全ての開発サーバーが停止しました"

# プロセス確認
echo ""
echo "📊 残存プロセス確認:"
ps aux | grep -E "manage\.py.*runserver" | grep -v grep || echo "   (残存プロセスなし)"