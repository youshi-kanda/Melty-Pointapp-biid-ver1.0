# 📤 運営管理画面・店舗管理画面 別々アップロードガイド

## 🎯 **アップロードファイル**

### **1. 運営管理画面用**
```
📁 biid-admin-only.zip
```
- **場所**: プロジェクトルートディレクトリ
- **サイズ**: 約8-10MB
- **内容**: 運営管理画面 + 共通ファイル

### **2. 店舗管理画面用**
```
📁 biid-store-only.zip
```
- **場所**: プロジェクトルートディレクトリ
- **サイズ**: 約8-10MB
- **内容**: 店舗管理画面 + 共通ファイル

## 🚀 **Cloudflare Pages アップロード手順**

### **運営管理画面のアップロード**

#### **Step 1: 新しいプロジェクト作成**
1. https://dash.cloudflare.com/ にログイン
2. 左サイドバー「Pages」をクリック
3. 「Create a project」をクリック
4. 「Upload assets」を選択

#### **Step 2: プロジェクト設定**
```
Project name: biid-admin-panel
Production branch: main
```

#### **Step 3: ファイルアップロード**
1. 「Upload a folder」をクリック
2. `biid-admin-only.zip` をドラッグ&ドロップ
3. アップロード完了を待つ

#### **Step 4: デプロイ確認**
- **URL**: `https://biid-admin-panel.pages.dev`
- **ログイン**: `https://biid-admin-panel.pages.dev/admin/login`

---

### **店舗管理画面のアップロード**

#### **Step 1: 新しいプロジェクト作成**
1. Cloudflare Dashboard → Pages → Create a project
2. 「Upload assets」を選択

#### **Step 2: プロジェクト設定**
```
Project name: biid-store-panel
Production branch: main
```

#### **Step 3: ファイルアップロード**
1. 「Upload a folder」をクリック
2. `biid-store-only.zip` をドラッグ&ドロップ
3. アップロード完了を待つ

#### **Step 4: デプロイ確認**
- **URL**: `https://biid-store-panel.pages.dev`
- **ログイン**: `https://biid-store-panel.pages.dev/store/login`

## 🔗 **アクセス情報**

### **運営管理画面**
- **メインURL**: `https://biid-admin-panel.pages.dev`
- **ログインURL**: `https://biid-admin-panel.pages.dev/admin/login`
- **ログイン情報**:
  ```
  Email: admin@example.com
  Password: adminpass123
  ```

### **店舗管理画面**
- **メインURL**: `https://biid-store-panel.pages.dev`
- **ログインURL**: `https://biid-store-panel.pages.dev/store/login`
- **ログイン情報**:
  ```
  Email: store@example.com
  Password: storepass123
  ```

## 📁 **ファイル構成**

### **運営管理画面用 (biid-admin-only.zip)**
```
📁 admin-only/
├── 📁 _next/               # Next.js静的ファイル
├── 📁 admin/               # 運営管理画面
│   ├── index.html          # ダッシュボード
│   ├── login/index.html    # ログイン
│   ├── reports/index.html  # レポート・分析
│   ├── users/index.html    # ユーザー管理
│   ├── stores/index.html   # 店舗管理
│   ├── settings/index.html # システム設定
│   └── ...                 # その他管理機能
├── 📁 auth/                # 認証機能
├── 📁 login/               # 共通ログイン
├── 📄 index.html           # ランディングページ
├── 📄 404.html             # エラーページ
├── 📄 _headers             # セキュリティ設定
├── 📄 _redirects           # リダイレクト設定
└── 📄 favicon.ico          # アイコン
```

### **店舗管理画面用 (biid-store-only.zip)**
```
📁 store-only/
├── 📁 _next/               # Next.js静的ファイル
├── 📁 store/               # 店舗管理画面
│   ├── index.html          # 店舗ホーム
│   ├── login/index.html    # ログイン
│   ├── dashboard/index.html # ダッシュボード
│   ├── profile/index.html  # 店舗プロフィール
│   ├── charge/index.html   # チャージ
│   ├── receipt/index.html  # レシート
│   ├── reports/index.html  # レポート
│   ├── promotions/index.html # プロモーション
│   └── settings/index.html # 設定
├── 📁 auth/                # 認証機能
├── 📁 login/               # 共通ログイン
├── 📄 index.html           # ランディングページ
├── 📄 404.html             # エラーページ
├── 📄 _headers             # セキュリティ設定
├── 📄 _redirects           # リダイレクト設定
└── 📄 favicon.ico          # アイコン
```

## 🎨 **確認ポイント**

### **運営管理画面**
- ✅ **ダッシュボード**: 統計カード・システム状態・アクティビティ
- ✅ **レポート・分析**: 8つの分析機能（概要・トレンド・カテゴリ・店舗・ユーザー・ギフト・決済・地域）
- ✅ **新機能**: トレンド分析グラフ（Chart.js）
- ✅ **ユーザー管理**: アイコン表示（名前の頭文字）
- ✅ **店舗管理**: 店舗一覧・詳細管理
- ✅ **システム設定**: 基本設定・API管理
- ✅ **ブランド**: 「Melty Point」→「Biid Point」変更済み

### **店舗管理画面**
- ✅ **店舗ダッシュボード**: 統計・売上・取引履歴
- ✅ **店舗プロフィール**: 基本情報・設定
- ✅ **チャージ機能**: アカウントチャージ
- ✅ **レシート管理**: 取引履歴・レシート
- ✅ **月次レポート**: 売上・統計レポート
- ✅ **プロモーション管理**: キャンペーン管理
- ✅ **ブランド**: 「Melty Point」→「Biid Point」変更済み

## 🔄 **リダイレクト設定**

### **運営管理画面**
- `/` → `/admin/login` (自動リダイレクト)
- `/admin` → `/admin/login` (自動リダイレクト)
- `/login` → `/admin/login` (自動リダイレクト)

### **店舗管理画面**
- `/` → `/store/login` (自動リダイレクト)
- `/store` → `/store/login` (自動リダイレクト)
- `/login` → `/store/login` (自動リダイレクト)

## 🛠️ **環境変数（オプション）**

両方のプロジェクトで同じ環境変数を使用:
```
NEXT_PUBLIC_API_BASE_URL=https://api.biid-point.com
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_MOCK_API=false
```

## 🎉 **デプロイ後の確認**

### **運営管理画面**
1. `https://biid-admin-panel.pages.dev` にアクセス
2. 自動的に `/admin/login` にリダイレクト
3. `admin@example.com` / `adminpass123` でログイン
4. ダッシュボード・レポート・分析機能を確認

### **店舗管理画面**
1. `https://biid-store-panel.pages.dev` にアクセス
2. 自動的に `/store/login` にリダイレクト
3. `store@example.com` / `storepass123` でログイン
4. 店舗ダッシュボード・各種機能を確認

## 📞 **サポート**

アップロードやデプロイに関する質問は、開発チームまでお問い合わせください。

---

**🎉 これで運営管理画面と店舗管理画面を別々のプロジェクトとして確認していただけます！**