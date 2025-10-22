# 本番環境アーキテクチャ解析レポート

## 🏗️ システム構成

### デプロイメント構造

本番環境は **4つの独立したDjangoバックエンド** + **静的ビルドされたNext.js** で構成されています。

```
Fly.io デプロイメント:
├── biid-admin.fly.dev (Port 8001) - 運営管理画面
├── biid-store.fly.dev (Port 8002) - 店舗管理画面  
├── biid-user.fly.dev (Port 8003) - ユーザー画面
└── biid-terminal.fly.dev (Port 8004) - 決済端末画面
```

### 各サービスの構造

#### 1. user-backend (biid-user.fly.dev)

**配信方式**: Django + 静的ビルド済みNext.js

- **Django**: `/api/*` エンドポイントのみ処理
- **静的ファイル**: `production/user-backend/static/` にNext.jsビルド結果を配置
- **ルーティング**:
  - `/` → `static/index.html` (Service Worker初期化)
  - `/user/map` → `static/user/map/index.html` (Django テンプレート)
  - `/user/login` → 404 (存在しない)
  - `/user/welcome` → 404 (存在しない)

**重要**: 本番の `/user/map` は **Django テンプレート** であり、Next.js ページではありません!

## 🔍 現在の問題点

### 1. ローカル開発 vs 本番環境の不一致

| パス | ローカル開発 | 本番環境 | 状態 |
|------|------------|---------|------|
| `/user/login` | Next.js TSX (elaborate UI) | 404 | ❌ 不一致 |
| `/user/map` | Next.js TSX (新規実装) | Django HTML | ❌ 不一致 |
| `/user/welcome` | Next.js TSX (新規実装) | 404 | ❌ 不一致 |
| `/` | Next.js index | Service Worker初期化 | ⚠️ 動作違い |

### 2. ビルド済みファイルの古さ

```bash
# 本番静的ファイルのビルドID
buildId: "pUNSGtetT1E1KfpW2r6R_"

# これは古いビルドで、現在のソースコードの変更が反映されていない
```

### 3. UI デザインの完全な不一致

#### ローカル開発 (pages/user/login.tsx)
```typescript
// 豪華なグラデーション背景
className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"

// 大きなアイコン (32x32)
<div className="w-32 h-32 bg-gradient-to-br from-pink-300 to-pink-400 
     rounded-3xl shadow-2xl flex items-center justify-center mb-6">

// 影エフェクト、アニメーション
```

#### 本番環境 (biid-user.fly.dev/)
```html
<!-- シンプルなフォーム -->
<div style="display:flex;justify-content:center;align-items:center;
     height:100vh;font-size:18px;color:#666">
    Service Worker初期化中...
</div>

<!-- 実際の UI は JavaScript でレンダリング (詳細不明) -->
```

## 📋 デプロイワークフローの現状

### ステップ1: ローカル開発
```bash
npm run dev  # localhost:3000 で開発サーバー起動
# pages/ ディレクトリで TSX ファイルを編集
```

### ステップ2: ビルド (手動)
```bash
npm run build  # Next.js を静的ファイルにビルド
npm run export  # /out ディレクトリに出力
```

### ステップ3: 本番環境へコピー (手動)
```bash
# ビルド済みファイルを各バックエンドの static/ にコピー
cp -r out/* production/user-backend/static/
```

### ステップ4: Fly.io デプロイ (手動)
```bash
cd production/user-backend
fly deploy
```

## 🚨 重大な問題

### 問題1: デプロイ手順が文書化されていない
- ✅ ビルドコマンドは `package.json` に存在
- ❌ ビルド → コピー → デプロイの手順が不明確
- ❌ どのファイルをどこにコピーするべきか不明

### 問題2: バージョン管理の欠如
- `.gitignore` が `/out/`, `.next/`, `admin-production/` を除外
- 本番環境のビルドが Git で追跡されていない
- **ロールバック不可能**

### 問題3: ローカル開発と本番の乖離
- ローカルの TSX ファイルが「模範」として作成されたが、実際は全く異なる
- クライアントが使用している本番 UI との整合性が取れていない
- 開発したコードが本番に反映される保証がない

## ✅ 推奨される安全な修正ワークフロー

### フェーズ1: 本番環境の完全把握

1. **本番 UI の完全キャプチャ**
   ```bash
   # 各ページの実際の HTML/CSS/JS を取得
   curl -s https://biid-user.fly.dev/ > production-snapshot/index.html
   # ブラウザのデベロッパーツールで完全なレンダリング後のHTMLを保存
   ```

2. **Django テンプレートの確認**
   ```bash
   # production/user-backend/templates/ の内容を確認
   # Django が何をレンダリングしているか把握
   ```

3. **静的ファイルマッピング**
   ```bash
   # production/user-backend/static/ の構造を文書化
   tree production/user-backend/static/
   ```

### フェーズ2: ローカル開発環境の調整

1. **本番 UI に合わせた TSX の修正**
   - `pages/user/login.tsx` から elaborate gradient を削除
   - シンプルな本番スタイルに変更
   - 実際のフォームフィールドを本番に合わせる

2. **ルーティングの修正**
   - ログイン成功後の遷移先を確認
   - 本番で実際に存在するパスのみ使用

3. **テスト環境の構築**
   ```bash
   # ビルドをローカルで確認できる環境
   npm run build && npm run serve
   # localhost:3001 などで静的ビルド結果をプレビュー
   ```

### フェーズ3: 安全なデプロイプロセス確立

1. **デプロイスクリプトの作成**
   ```bash
   # scripts/deploy-user.sh
   #!/bin/bash
   set -e
   
   echo "Building Next.js..."
   npm run build
   
   echo "Copying static files..."
   rm -rf production/user-backend/static/_next
   cp -r out/_next production/user-backend/static/
   
   echo "Deploying to Fly.io..."
   cd production/user-backend
   fly deploy
   
   echo "✅ Deployment complete!"
   ```

2. **ステージング環境の設定**
   - Fly.io で `biid-user-staging` アプリを作成
   - 本番前にテスト可能にする

3. **バージョンタグの付与**
   ```bash
   # デプロイ時にビルドIDをメタデータとして記録
   echo "buildId: $(date +%Y%m%d-%H%M%S)" > production/user-backend/static/version.txt
   ```

### フェーズ4: 文書化

1. **DEPLOYMENT.md の作成**
   - 完全なデプロイ手順
   - トラブルシューティングガイド
   - ロールバック手順

2. **ARCHITECTURE.md の更新**
   - 現在のシステム構成
   - データフロー
   - 各コンポーネントの責任範囲

## 🎯 次のアクションアイテム

### 即座に実施すべきこと

1. **本番 UI の完全スナップショット取得**
   - ブラウザで https://biid-user.fly.dev/ を開く
   - デベロッパーツールで DOM を確認
   - 実際の CSS とレイアウトを記録

2. **Django テンプレートの確認**
   ```bash
   find production/user-backend/templates -name "*.html" | xargs grep -l "map\|login\|welcome"
   ```

3. **ローカル TSX と本番 UI の比較表作成**
   - 各要素のスタイル差分
   - 機能の差分
   - 修正が必要な箇所のリスト

### 中期的な改善

1. **CI/CD パイプラインの構築**
   - GitHub Actions でビルド自動化
   - PR マージ時に自動デプロイ

2. **モニタリングの導入**
   - デプロイ後の動作確認自動化
   - エラートラッキング (Sentry等)

3. **バージョン管理戦略の策定**
   - Git タグとビルドIDの紐付け
   - ロールバック手順の確立

## 📝 まとめ

### 現状
- ✅ 本番環境は Fly.io で稼働中
- ⚠️ ローカル開発と本番が完全に乖離
- ❌ デプロイ手順が不明確
- ❌ バージョン管理が不十分

### 優先度
1. **緊急**: 本番 UI の完全把握とドキュメント化
2. **高**: ローカル開発環境を本番に合わせる
3. **中**: デプロイプロセスの自動化
4. **低**: CI/CD パイプラインの構築

### 危険な作業
❌ **絶対に避けるべきこと**:
- 本番環境の直接編集
- ビルドせずに TSX ファイルを直接デプロイ
- バックアップなしのデプロイ

✅ **安全な作業手順**:
1. ローカルで開発
2. `npm run build` でビルド
3. `npm run serve` でプレビュー確認
4. ステージング環境でテスト
5. 本番デプロイ
6. 動作確認
7. 問題があればロールバック
