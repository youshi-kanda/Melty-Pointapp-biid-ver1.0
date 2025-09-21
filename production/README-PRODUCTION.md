# 🚀 BIID Point App - 本番環境セットアップ手順

## Phase 1 本番環境構築が完了しました！

### ✅ 完了した改善項目

1. **セキュリティ設定修正**
   - SECRET_KEY, JWT_SECRET_KEY の環境変数化
   - DEBUG設定の修正（本番環境でFalse）

2. **PostgreSQL環境構築**
   - Docker Compose によるPostgreSQL設定
   - データベース接続プール最適化
   - 初期化スクリプト自動実行

3. **Redis導入**
   - キャッシュ・セッション管理にRedis使用
   - 本番環境用のRedis設定最適化

4. **Dockerコンテナ化**
   - 各バックエンド用Dockerfile作成
   - 本番用Docker Compose設定
   - 自動起動スクリプト完備

---

## 🛠️ セットアップ手順

### 1. 環境変数設定

```bash
cd production

# 本番環境用の環境変数ファイル作成
cp .env.production.example .env.production

# 重要: 以下の値を本番用に変更してください
nano .env.production
```

**必須設定項目:**
```bash
# セキュリティ（必ず変更）
SECRET_KEY=9TB9B(=$grL$vNRkx+qx\KC()PNTtYz!CsQ%hS52glYiH&^W1Y
JWT_SECRET_KEY=IcwfqYsIaK9b5Gqwtxgph2uGHu1YSZyq

# データベース
DB_PASSWORD=your_secure_db_password_here

# 決済（本番APIキー）
FINCODE_API_KEY=your_production_fincode_api_key
```

### 2. 本番サーバー起動

```bash
# 全自動セットアップ・起動
./start_production_servers.sh
```

このスクリプトが以下を自動実行します：
- 環境変数チェック
- Docker イメージビルド
- PostgreSQL + Redis 起動
- 4つのバックエンドサービス起動
- データベースマイグレーション
- エンドポイント確認

### 3. アクセス確認

起動完了後、以下のURLでアクセス可能：

| サービス | URL | 説明 |
|---------|-----|------|
| 🔐 管理者画面 | http://localhost:8001 | システム運営者用 |
| 🏪 店舗管理画面 | http://localhost:8002 | 店舗オーナー・スタッフ用 |
| 👤 ユーザー画面 | http://localhost:8003 | エンドユーザー用 |
| 💳 決済端末画面 | http://localhost:8004 | 店舗レジ端末用 |

---

## 📊 監視・管理コマンド

### サービス状態確認
```bash
docker-compose ps                    # サービス一覧
docker-compose logs -f               # 全ログをリアルタイム表示
docker-compose logs admin-backend    # 特定サービスのログ
```

### サービス制御
```bash
docker-compose restart admin-backend  # 特定サービス再起動
docker-compose down                   # 全サービス停止
docker-compose up -d                  # 全サービス起動
```

### データベース管理
```bash
# pgAdmin (Webベース管理ツール)
# http://localhost:8080
# Email: admin@biid.app
# Password: $PGADMIN_PASSWORD (環境変数で設定)

# コマンドライン接続
docker-compose exec postgresql psql -U biid_user -d biid_production
```

---

## 🔧 トラブルシューティング

### 起動エラーの場合

1. **環境変数確認**
   ```bash
   grep -E "(SECRET_KEY|DB_PASSWORD|JWT_SECRET)" .env.production
   ```

2. **ログ確認**
   ```bash
   docker-compose logs admin-backend
   docker-compose logs postgresql
   ```

3. **ポート競合確認**
   ```bash
   lsof -i :8001 -i :8002 -i :8003 -i :8004 -i :5432 -i :6379
   ```

### データベース接続エラー

```bash
# PostgreSQL手動起動
docker-compose up -d postgresql redis

# 接続テスト
docker-compose exec postgresql pg_isready -U biid_user
```

---

## 🎯 次のステップ（Phase 2 以降）

Phase 1完了により、**基本的な本番環境は稼働可能**です。

継続開発・改善項目：

### 近日対応推奨
- **SSL/HTTPS設定** (Let's Encrypt)
- **Nginx リバースプロキシ**
- **監視システム導入**
- **自動バックアップ**

### UI調整・機能追加
本番環境稼働中に並行して実施可能：
- Next.jsフロントエンドの改善
- APIエンドポイント追加
- 新機能開発
- A/Bテスト実装

---

## 📋 本番運用チェックリスト

### 起動前確認
- [ ] .env.production の設定完了
- [ ] SECRET_KEY, JWT_SECRET_KEY を変更
- [ ] DB_PASSWORD を設定
- [ ] FINCODE_API_KEY を本番用に設定
- [ ] ALLOWED_HOSTS を本番ドメインに設定

### 起動後確認  
- [ ] 4つのサービスすべて起動（docker-compose ps）
- [ ] データベース接続確認
- [ ] 各エンドポイントにアクセス可能
- [ ] ログエラーなし確認

### セキュリティ確認
- [ ] DEBUG=False で起動
- [ ] 管理者画面アクセス制限
- [ ] API認証動作確認

---

**🎉 おめでとうございます！**

BIID Point Appの本番環境Phase 1が完了しました。
継続的な開発とUI改善を並行して進められます。