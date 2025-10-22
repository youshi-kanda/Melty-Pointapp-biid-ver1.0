# ユーザーアプリ HTML ファイル分析レポート

**日時**: 2025-10-21  
**目的**: ログイン後のデフォルトルート変更（Welcome → Map）のための既存アプリ構造分析

---

## 📊 全体構造

### ビルド情報
- **フレームワーク**: Next.js (Static Export モード)
- **Build ID**: `pUNSGtetT1E1KfpW2r6R_`
- **言語**: 日本語 (`lang="ja"`)
- **CSS**: `/_next/static/css/160f526fac4d567d.css` (共通スタイル)

### フォント設定
Google Fonts を使用:
- **Comic Neue** (300, 400, 700)
- **Nunito** (300, 400, 500, 600, 700, 800)
- **Comfortaa** (300, 400, 500, 600, 700)
- **Quicksand** (300, 400, 500, 600, 700)
- **Dancing Script** (400, 500, 600, 700)
- **Pacifico**, **Great Vibes**, **Satisfy**, **Fredoka One**, **Bungee**

### ページ構成
全13ページ確認済み:

```
production/user-backend/static/
├── login.html              # ログインページ
├── welcome.html            # ホーム画面（現在のデフォルト）⭐
├── map.html                # マップ画面（新しいデフォルトに変更予定）⭐
├── profile.html            # プロフィール
├── stores.html             # 店舗一覧
├── gifts.html              # ギフト一覧
├── points.html             # ポイント履歴
├── register.html           # 新規登録
├── register-form.html      # 新規登録フォーム
├── security.html           # セキュリティ設定
├── social.html             # ソーシャル設定
├── favorites.html          # お気に入り
└── gift-exchange.html      # ギフト交換
```

---

## 🔍 主要ページ分析

### 1️⃣ login.html
**タイトル**: `Melty+ (メルティプラス) - ログイン`

**読み込みスクリプト**:
```
/_next/static/chunks/pages/user/login-aef5c21e8a87091a.js
```

**Next.js データ**:
```json
{
  "page": "/user/login",
  "buildId": "pUNSGtetT1E1KfpW2r6R_"
}
```

**初期表示**:
```html
<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-size:18px;color:#666">
  Service Worker初期化中...
</div>
```

**推測される機能**:
- ログインフォーム（メール/パスワード）
- 認証API呼び出し → トークン取得
- 成功時のリダイレクト処理
- Service Worker による PWA 機能

---

### 2️⃣ welcome.html (現在のホーム画面)
**タイトル**: なし（metaタグのみ）

**読み込みスクリプト**:
```
/_next/static/chunks/pages/user/welcome-e57dd9e8542376da.js
```

**Next.js データ**:
```json
{
  "page": "/user/welcome",
  "buildId": "pUNSGtetT1E1KfpW2r6R_"
}
```

**現在の役割**:
- **ログイン後のデフォルト画面**（変更対象）
- ユーザー情報表示
- 各機能へのナビゲーション
- ポイント残高表示（推定）
- お知らせ表示（推定）

**変更後の役割** (要件):
- マップ画面右上の「ホーム」ボタンからアクセス可能
- セカンダリページに降格

---

### 3️⃣ map.html (新しいデフォルト画面)
**タイトル**: なし（metaタグのみ）

**読み込みスクリプト**:
```
/_next/static/chunks/7d0bf13e-b21f38a4f7635312.js (Map ライブラリ用)
/_next/static/chunks/pages/user/map-0a022b0a65cbb77b.js
```

**Next.js データ**:
```json
{
  "page": "/user/map",
  "buildId": "pUNSGtetT1E1KfpW2r6R_"
}
```

**推測される機能**:
- 地図表示（Google Maps または Leaflet）
- 店舗マーカー表示
- 現在地取得（Geolocation API）
- 店舗検索・フィルタリング
- 店舗詳細へのリンク

**新しい役割** (要件):
- **ログイン後のデフォルト画面**
- 右上に「ホーム」ボタンを追加 → `/user/welcome` へ遷移

---

## 🛠️ 技術スタック推測

### フロントエンド
- **Next.js** (Static Export)
- **React** (Next.js ベース)
- **TypeScript** または JavaScript
- **Service Worker** (PWA 対応)
- **CSS-in-JS** または CSS Modules

### 状態管理
- React Context API (推定)
- または Redux/Zustand (要確認)

### API通信
- `fetch` または `axios`
- Django REST framework とのやりとり
- JWT トークン認証（推定）

### ルーティング
- **Next.js Router** (`next/router`)
- クライアントサイドルーティング
- ログイン後リダイレクト: `/user/login` → `/user/welcome` (現在)
- **変更予定**: `/user/login` → `/user/map`

---

## 📝 実装タスク整理

### タスク6完了: HTML分析結果
✅ 3つの主要HTMLファイル分析完了
✅ Next.js Static Export構造の理解
✅ ページ間ルーティングの推測
✅ 必要な変更箇所の特定

### 次のタスク7-13: ソースコード再作成
以下のファイルを作成する必要があります:

```
pages/
├── user/
│   ├── index.tsx          # → /user/map にリダイレクト（新仕様）
│   ├── login.tsx          # ログインページ
│   ├── welcome.tsx        # ホーム画面（セカンダリ）
│   ├── map.tsx            # マップ画面（プライマリ）+ ホームボタン追加
│   ├── profile.tsx        # プロフィール
│   ├── stores.tsx         # 店舗一覧
│   ├── gifts.tsx          # ギフト一覧
│   ├── points.tsx         # ポイント履歴
│   ├── register.tsx       # 新規登録
│   ├── register-form.tsx  # 新規登録フォーム
│   ├── security.tsx       # セキュリティ設定
│   ├── social.tsx         # ソーシャル設定
│   ├── favorites.tsx      # お気に入り
│   └── gift-exchange.tsx  # ギフト交換
└── _app.tsx              # App wrapper (既存)
```

### 重要な実装ポイント

1. **ルーティング変更**:
   ```typescript
   // pages/user/index.tsx (旧仕様)
   // export default WelcomePage
   
   // pages/user/index.tsx (新仕様)
   export default MapPage // またはリダイレクト
   ```

2. **マップページにホームボタン追加**:
   ```tsx
   // pages/user/map.tsx
   <button onClick={() => router.push('/user/welcome')}>
     🏠 ホーム
   </button>
   ```

3. **ログイン成功時のリダイレクト**:
   ```typescript
   // pages/user/login.tsx (変更前)
   router.push('/user/welcome')
   
   // pages/user/login.tsx (変更後)
   router.push('/user/map')
   ```

---

## ⚠️ 注意事項

1. **UIの保持**: "もとのUIやデザインは変更しないようにしてください"
   - 既存のスタイル・レイアウトを完全に維持
   - ホームボタンの追加のみ

2. **機能の維持**: ルーティング以外の動作は変更しない
   - API呼び出しロジック
   - 認証フロー
   - データ表示ロジック

3. **バックアップの確保**: 
   - ✅ `backups/backup-before-rebuild-20251021_195324/`
   - ✅ Git tag: `before-user-app-rebuild`
   - ✅ Branch: `client-delivery`

---

## 🎯 次のステップ

1. タスク7: `pages/user/` ディレクトリ作成
2. タスク8: 共通コンポーネント作成 (`components/user/`)
3. タスク9: `pages/user/login.tsx` 実装
4. タスク10: `pages/user/welcome.tsx` 実装
5. タスク11: `pages/user/map.tsx` 実装（ホームボタン追加）
6. タスク12: `pages/user/index.tsx` ルーティング設定
7. タスク13: 残りのページ実装
