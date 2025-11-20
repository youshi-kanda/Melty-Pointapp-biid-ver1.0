# BIID Point App - Melty+ ポイントアプリケーション

## 📖 プロジェクト概要

BIID株式会社様向けのポイント管理システム。4つの独立したサービスで構成されています。

### サービス一覧

1. **運営管理画面（Admin）** - https://biid-admin.fly.dev/
   - システム全体の管理
   - ユーザー・店舗・ギフト・取引の管理
   - レポート・分析機能

2. **店舗管理画面（Store）** - https://biid-store.fly.dev/
   - 店舗スタッフ向け管理画面
   - ポイント付与・使用
   - 店舗別レポート

3. **ユーザーアプリ（User）** - https://biid-user.fly.dev/
   - エンドユーザー向けアプリ
   - ポイント残高確認
   - ギフト交換

4. **決済端末（Terminal）** - https://biid-terminal.fly.dev/
   - 店舗での決済処理
   - QRコード読み取り
   - ポイント付与

## 🏗 技術スタック

### フロントエンド
- **Next.js 14.0.0** - React フレームワーク（静的エクスポートモード）
- **React 18.2.0** - UIライブラリ
- **TypeScript 5.2.0** - 型安全な開発
- **Tailwind CSS 3.3.0** - ユーティリティファーストCSS
- **Lucide React** - アイコンライブラリ

### バックエンド
- **Django 3.x** - Pythonウェブフレームワーク
- **Python 3.9** - プログラミング言語
- **Gunicorn** - WSGIサーバー
- **WhiteNoise** - 静的ファイル配信

### インフラ
- **Fly.io** - クラウドプラットフォーム
- **PostgreSQL** - データベース（biid-db）
- **Docker** - コンテナ化

## 🚀 クイックスタート

### 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone <repository-url>
cd Melty-Pointapp-biid-ver1.0

# 依存関係のインストール
npm install

# Pythonパッケージのインストール
cd backend
pip install -r requirements.txt

# 開発サーバーの起動
npm run dev
```

### 本番ビルド・デプロイ

**⚠️ 重要**: 本番反映前に必ず `DEPLOYMENT_CHECKLIST.md` を確認してください。

```bash
# 自動ビルド・デプロイスクリプトを使用（推奨）
./scripts/build-and-deploy.sh admin

# または手動でビルド
npm run build
cd out
find . -name "*.html" -exec sed -i '' 's|"/_next/|"/static/_next/|g' {} \;
for dir in admin store terminal user; do
  [ -f "${dir}.html" ] && cp "${dir}.html" "${dir}/index.html"
done
cd ..
cp -r out/* production/admin-backend/static/

# デプロイ
flyctl deploy --config fly-admin.toml
```

## 📚 ドキュメント

- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - 本番反映の完全ガイド（必読）
- **[STORE_ADMIN_QUICK_GUIDE.md](./STORE_ADMIN_QUICK_GUIDE.md)** - 店舗管理画面修復のクイックガイド
- **[MELTY_INTEGRATION_SPEC_FINAL.md](./MELTY_INTEGRATION_SPEC_FINAL.md)** - Meltyアカウント連携仕様
- **[USER_TESTING_MANUAL.md](./USER_TESTING_MANUAL.md)** - ユーザーテストマニュアル

## 🔧 重要な設定ファイル

### Next.js設定（next.config.js）
```javascript
module.exports = {
  output: 'export',        // 静的エクスポート有効化
  trailingSlash: true,     // URLに末尾スラッシュを追加
  images: { 
    unoptimized: true      // 画像最適化を無効化（静的エクスポート用）
  }
}
```

### Django URL設定（backend/pointapp/urls.py）
```python
urlpatterns = [
    path('health/', health, name='health'),
    path('', RedirectView.as_view(url='/static/admin/login.html', permanent=False)),
    *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT),
]
```

## 🎯 開発ガイドライン

### ナビゲーションの実装

#### ❌ 動作しないパターン
```tsx
// Next.js Router は静的エクスポートで一部機能が制限される
router.push('/admin/users');  // 動作しない
```

#### ✅ 推奨パターン
```tsx
// 直接URLを指定
window.location.href = '/static/admin/users.html';

// またはLinkコンポーネント
<Link href="/static/admin/users.html">ユーザー管理</Link>
```

### ビルド時の注意点

1. **必ずパス修正を実行**: `/_next/` → `/static/_next/`
2. **index.htmlの作成**: `admin.html` → `admin/index.html`
3. **全HTMLファイルを処理**: `find` コマンドで一括置換

## 🐛 トラブルシューティング

### CSS/JSが読み込まれない
→ `DEPLOYMENT_CHECKLIST.md` の「エラー1」を参照

### ログイン後に画面が表示されない  
→ `DEPLOYMENT_CHECKLIST.md` の「エラー2」を参照

### ページ遷移が動作しない
→ `DEPLOYMENT_CHECKLIST.md` の「エラー3」を参照

### その他の問題
→ `DEPLOYMENT_CHECKLIST.md` の「よくあるエラーと対処法」セクションを確認

## 📞 サポート

問題が発生した場合は、以下のドキュメントを確認してください：

1. **DEPLOYMENT_CHECKLIST.md** - デプロイに関する全情報
2. **STORE_ADMIN_QUICK_GUIDE.md** - 店舗管理画面の修復手順
3. GitHub Issues - バグ報告・機能要望

## 📝 ライセンス

BIID株式会社 - 非公開プロジェクト

---

**最終更新**: 2025年11月20日  
**メンテナー**: BIID開発チーム
