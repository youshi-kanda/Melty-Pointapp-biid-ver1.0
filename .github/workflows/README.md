# GitHub Actions ワークフロー

このディレクトリには、BIID Point Appの各サービスをビルド・テスト・デプロイするためのGitHub Actionsワークフローが含まれています。

## ワークフロー一覧

### 個別サービスビルド

各サービスごとに独立したビルド・テスト・イメージプッシュを行います。

- **build-admin-backend.yml** - 管理者バックエンド
- **build-store-backend.yml** - 店舗バックエンド
- **build-user-backend.yml** - ユーザーバックエンド
- **build-terminal-backend.yml** - 決済端末バックエンド

### 統合ビルド

- **build-all.yml** - 全サービスを一括ビルド

## 自動実行トリガー

各ワークフローは以下の条件で自動実行されます：

1. `main`または`develop`ブランチへのpush
2. 対象ファイルの変更時のみ（`backend/**`または`production/<service>/**`）
3. プルリクエスト作成時

## 処理フロー

1. **コードチェックアウト**
2. **Python環境セットアップ** (3.9)
3. **依存関係インストール**
4. **静的解析** (flake8)
5. **コードフォーマットチェック** (black)
6. **テスト実行** (pytest)
7. **Dockerイメージビルド** (mainブランチのみ)
8. **GitHub Container Registryへプッシュ** (mainブランチのみ)

## イメージの公開先

ビルドされたDockerイメージは以下に保存されます：

```
ghcr.io/youshi-kanda/melty-pointapp-biid-ver1.0/admin-backend:latest
ghcr.io/youshi-kanda/melty-pointapp-biid-ver1.0/store-backend:latest
ghcr.io/youshi-kanda/melty-pointapp-biid-ver1.0/user-backend:latest
ghcr.io/youshi-kanda/melty-pointapp-biid-ver1.0/terminal-backend:latest
```

## タグ戦略

- `latest` - mainブランチの最新
- `main-<sha>` - mainブランチの特定コミット
- `develop-<sha>` - developブランチの特定コミット

## 手動実行

GitHubのActionsタブから`build-all.yml`を選択し、「Run workflow」で手動実行可能です。

## 必要な設定

### リポジトリシークレット

現在は`GITHUB_TOKEN`（自動提供）のみ使用。将来的に以下が必要になる可能性：

- `DEPLOY_HOST` - デプロイ先サーバーのホスト名
- `DEPLOY_USER` - デプロイ用ユーザー名
- `SSH_PRIVATE_KEY` - SSH秘密鍵
- `DOCKER_REGISTRY` - 外部レジストリ使用時
- `DOCKER_USERNAME` / `DOCKER_PASSWORD` - 外部レジストリ認証情報

### GitHub Container Registry の有効化

1. リポジトリ設定 → Packages
2. Container registryへのアクセス許可を確認
3. パッケージの可視性設定（Public/Private）

## ローカルでのテスト

ワークフローと同じテストをローカルで実行：

```bash
# 依存関係インストール
cd backend
pip install -r requirements.txt
pip install flake8 black pytest pytest-django

# Linting
flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics

# フォーマットチェック
black --check .

# テスト実行
export DJANGO_SETTINGS_MODULE=pointapp.settings
export SECRET_KEY=test-secret-key
python manage.py test
```

## トラブルシューティング

### ビルド失敗時

1. Actionsタブでログを確認
2. 失敗したステップを特定
3. ローカルで同じコマンドを実行して再現

### イメージプッシュ失敗時

- リポジトリのPackages権限を確認
- `GITHUB_TOKEN`の権限スコープを確認
- Container Registryの容量制限を確認

## 次のステップ

- [ ] デプロイワークフロー追加
- [ ] ステージング環境へのデプロイ自動化
- [ ] スモークテスト追加
- [ ] パフォーマンステスト追加
- [ ] セキュリティスキャン追加
