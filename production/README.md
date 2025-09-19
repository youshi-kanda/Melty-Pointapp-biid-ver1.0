# BIID ポイントアプリ - 本番用4インターフェース

このディレクトリには、4つの独立したドメインでデプロイするための本番用インターフェースが含まれています。

## 🏗️ 構成

```
production/
├── admin-backend/          # 運営管理画面 (admin.biid.app)
├── store-backend/          # 店舗管理画面 (store.biid.app)  
├── user-backend/           # ユーザー画面 (app.biid.app)
├── terminal-backend/       # 決済端末画面 (terminal.biid.app)
└── shared/                 # 共通コンポーネント
```

## 🚀 開発・テスト用起動

### 一括起動
```bash
cd production
./start-all-services.sh
```

### 個別起動
```bash
# 管理者画面 (Port: 8001)
cd production/admin-backend
python manage.py runserver 127.0.0.1:8001

# 店舗管理画面 (Port: 8002)  
cd production/store-backend
python manage.py runserver 127.0.0.1:8002

# ユーザー画面 (Port: 8003)
cd production/user-backend  
python manage.py runserver 127.0.0.1:8003

# 決済端末画面 (Port: 8004)
cd production/terminal-backend
python manage.py runserver 127.0.0.1:8004
```

## 🌐 本番デプロイ用ドメイン

| インターフェース | 本番URL | 機能 |
|----------------|---------|------|
| 運営管理画面 | `https://admin.biid.app` | システム全体の管理・監視 |
| 店舗管理画面 | `https://store.biid.app` | 店舗オーナー・スタッフ用 |
| ユーザー画面 | `https://app.biid.app` | エンドユーザー・顧客用 |
| 決済端末画面 | `https://terminal.biid.app` | 店舗レジ端末用 |

## 🔧 各インターフェースの特徴

### 管理者画面 (admin-backend)
- **対象**: システム運営者
- **認証**: 2FA必須・最高レベルセキュリティ
- **機能**: ユーザー・店舗・取引管理、システム設定
- **API**: 全機能アクセス可能

### 店舗管理画面 (store-backend)  
- **対象**: 店舗オーナー・スタッフ
- **認証**: 店舗限定アクセス
- **機能**: 決済処理・デポジット管理・プロモーション
- **API**: 店舗関連・決済API

### ユーザー画面 (user-backend)
- **対象**: エンドユーザー（ポイント保有者）
- **認証**: 個人データ保護
- **機能**: ポイント管理・ギフト交換・ソーシャル機能
- **API**: ユーザー・ソーシャルAPI

### 決済端末画面 (terminal-backend)
- **対象**: 店舗レジスタッフ
- **認証**: 端末認証・オフライン対応
- **機能**: NFC読取・決済処理・ポイント付与
- **API**: 決済・端末API

## 🔒 セキュリティ設定

各インターフェースは独立したセキュリティ設定を持っています：

- **管理者**: 最高レベル（HSTS 1年、セッション1時間）
- **店舗**: 業務用（HSTS 24時間、セッション8時間）  
- **ユーザー**: モバイル最適化（HSTS 24時間、セッション4時間）
- **端末**: 厳格（HSTS 1年、セッション12時間、オフライン対応）

## 📦 デプロイメント

各`deploy/`フォルダには：
- `Dockerfile`
- `docker-compose.yml`
- 環境変数設定ファイル
- デプロイスクリプト

## 🧪 テスト

各インターフェースは独立してテスト可能です：

```bash
# 管理者画面のテスト
cd production/admin-backend
python manage.py test

# 店舗管理画面のテスト
cd production/store-backend  
python manage.py test
```

## 🔄 API連携

すべてのインターフェースは元の`backend/`のAPIを共有しながら、それぞれ最適化されたエンドポイントを提供します。

- デモモード無効
- 実際のDjango APIと連携  
- 個別CORS設定
- インターフェース別認証