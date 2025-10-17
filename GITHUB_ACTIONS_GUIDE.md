# BIID Point App - GitHub Actions デプロイガイド

このドキュメントでは、GitHub Actionsを使用して各サービスをビルド・テスト・デプロイする方法を説明します。

## 📋 目次

1. [概要](#概要)
2. [セットアップ](#セットアップ)
3. [ワークフローの使用方法](#ワークフローの使用方法)
4. [各サービスの確認方法](#各サービスの確認方法)
5. [トラブルシューティング](#トラブルシューティング)

## 概要

BIID Point Appは4つの独立したバックエンドサービスで構成されています：

| サービス | 説明 | ポート | 公開URL予定 |
|---------|------|--------|------------|
| **admin-backend** | 管理者用API | 8001 | admin.biid.app |
| **store-backend** | 店舗用API | 8002 | store.biid.app |
| **user-backend** | ユーザー用API（アプリ化予定） | 8003 | app.biid.app |
| **terminal-backend** | 決済端末用API（アプリ化予定） | 8004 | terminal.biid.app |

## セットアップ

### 1. GitHub Container Registryの有効化

リポジトリにパッケージを公開するための設定：

1. GitHubリポジトリ → Settings → Actions → General
2. "Workflow permissions"で「Read and write permissions」を選択
3. 「Allow GitHub Actions to create and approve pull requests」にチェック

### 2. 必要なシークレットの設定（将来の拡張用）

リポジトリ → Settings → Secrets and variables → Actions で以下を追加（現時点では不要）：

```
DEPLOY_HOST=your-server.example.com
DEPLOY_USER=deploy
SSH_PRIVATE_KEY=<your-private-key>
```

## ワークフローの使用方法

### 自動ビルド

以下の操作で自動的にワークフローが実行されます：

1. **mainまたはdevelopブランチへのpush**
   ```bash
   git add .
   git commit -m "Update backend services"
   git push origin main
   ```

2. **プルリクエストの作成**
   - テストのみ実行（イメージはプッシュされません）

### 手動ビルド

1. GitHubリポジトリ → Actions タブ
2. 左サイドバーから実行したいワークフローを選択
3. 「Run workflow」ボタンをクリック
4. ブランチを選択して実行

### ビルド状況の確認

1. Actions タブでワークフロー実行一覧を表示
2. 各ワークフローをクリックしてログを確認
3. ステータスバッジ：
   - ✅ 成功
   - ❌ 失敗
   - 🟡 実行中

## 各サービスの確認方法

### ローカルでの動作確認

#### 1. Docker Composeでの起動

```bash
cd production

# データベース起動
docker-compose -f docker-compose.postgresql.yml up -d

# 全サービス起動
docker-compose up -d

# ログ確認
docker-compose logs -f
```

#### 2. 各サービスへのアクセス

```bash
# 管理者サービス
curl http://localhost:8001/health/

# 店舗サービス
curl http://localhost:8002/health/

# ユーザーサービス
curl http://localhost:8003/health/

# 決済端末サービス
curl http://localhost:8004/health/
```

### GitHub Container Registryからのイメージ取得

```bash
# イメージのプル
docker pull ghcr.io/youshi-kanda/melty-pointapp-biid-ver1.0/admin-backend:latest
docker pull ghcr.io/youshi-kanda/melty-pointapp-biid-ver1.0/store-backend:latest
docker pull ghcr.io/youshi-kanda/melty-pointapp-biid-ver1.0/user-backend:latest
docker pull ghcr.io/youshi-kanda/melty-pointapp-biid-ver1.0/terminal-backend:latest

# イメージの実行（例：admin-backend）
docker run -d \
  -p 8001:8001 \
  -e DEBUG=False \
  -e SECRET_KEY=your-secret-key \
  ghcr.io/youshi-kanda/melty-pointapp-biid-ver1.0/admin-backend:latest
```

## Web公開の準備

### オプション1: GitHub Pagesでの静的コンテンツ公開

静的フロントエンド（Next.js build出力）の公開：

```bash
npm run build
npm run export
# outディレクトリをGitHub Pagesで公開
```

### オプション2: 外部サーバーでのDocker運用

```bash
# サーバーでイメージをプル
ssh user@your-server.com
docker pull ghcr.io/youshi-kanda/melty-pointapp-biid-ver1.0/admin-backend:latest

# docker-compose.ymlを配置してサービス起動
docker-compose up -d
```

### オプション3: クラウドプラットフォーム

- **Vercel**: Next.jsフロントエンド向け
- **Render / Railway**: Dockerコンテナのホスティング
- **AWS ECS / GCP Cloud Run**: エンタープライズ向け

## 各サービスのURL確認手順

### 1. ローカル環境

| サービス | URL |
|---------|-----|
| Admin | http://localhost:8001 |
| Store | http://localhost:8002 |
| User | http://localhost:8003 |
| Terminal | http://localhost:8004 |

### 2. 本番環境（予定）

ドメイン取得後、以下のサブドメインを設定：

| サービス | URL |
|---------|-----|
| Admin | https://admin.biid.app |
| Store | https://store.biid.app |
| User | https://app.biid.app |
| Terminal | https://terminal.biid.app |

## トラブルシューティング

### ビルドエラー

**問題**: GitHub Actionsでビルドが失敗する

**解決策**:
1. Actionsタブでエラーログを確認
2. ローカルで同じコマンドを実行して再現
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py test
   ```
3. エラーを修正してpush

### イメージプッシュエラー

**問題**: "permission denied"エラー

**解決策**:
1. リポジトリSettings → Actions → General
2. Workflow permissionsを「Read and write permissions」に変更
3. ワークフローを再実行

### Docker起動エラー

**問題**: コンテナが起動しない

**解決策**:
```bash
# ログ確認
docker-compose logs <service-name>

# 環境変数確認
docker-compose config

# 再ビルド
docker-compose build --no-cache <service-name>
docker-compose up -d <service-name>
```

## 次のステップ

- [ ] ドメインの取得と設定
- [ ] nginx/Traefikでのリバースプロキシ設定
- [ ] Let's Encryptでの自動SSL/TLS証明書取得
- [ ] デプロイ自動化ワークフローの追加
- [ ] モバイルアプリ向けAPI仕様書（OpenAPI）の生成

## 参考資料

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
