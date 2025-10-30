# Melty+ (メルティプラス) ユーザーアプリ 画面設計書・UI仕様書

**作成日**: 2025年10月28日  
**対象**: ユーザー向けWebアプリケーション  
**本番環境**: https://biid-user.fly.dev/  
**Build ID**: `pUNSGtetT1E1KfpW2r6R_`

---

## 📋 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [デザインシステム](#デザインシステム)
3. [画面構成](#画面構成)
4. [不足ページ一覧](#不足ページ一覧)
5. [再構築作業計画](#再構築作業計画)
6. [技術仕様](#技術仕様)

---

## 1. プロジェクト概要

### 1.1 基本情報

| 項目 | 内容 |
|------|------|
| アプリ名 | Melty+ (メルティプラス) |
| 対象エリア | 大阪ミナミ・北新地 |
| 主要機能 | ポイント管理、ギフト交換、店舗検索、ソーシャル機能 |
| 総ページ数 | 31ページ |
| 既存TSXファイル | 11ページ |
| 不足ページ | 20ページ |
| フレームワーク | Next.js 14.2.33 + Tailwind CSS |
| デプロイ形式 | 静的エクスポート (Static Export) |
| PWA対応 | あり |

### 1.2 現状分析

#### ✅ 既存ページ (11ページ)
- ログイン (`login.tsx`)
- 新規登録 (`register.tsx`)
- ウェルカム画面 (`welcome.tsx`)
- 地図画面 (`map.tsx`)
- プロフィール (`profile.tsx`)
- ポイント (`points.tsx`)
- ギフト (`gifts.tsx`)
- 店舗一覧 (`stores.tsx`)
- お気に入り (`favorites.tsx`)
- ソーシャル (`social.tsx`)
- セキュリティ設定 (`security.tsx`)

#### ❌ 不足ページ (20ページ)
- トップレベル: 3ページ
- Pointsモジュール: 3ページ
- Giftsモジュール: 1ページ
- Profileモジュール: 1ページ
- Socialモジュール: 5ページ
- その他: 7ページ

---

## 2. デザインシステム

### 2.1 カラーパレット

#### プライマリカラー
```css
--primary: #ec4899;        /* pink-500 */
--theme-color: #ec4899;    /* PWA Theme Color */
```

#### グラデーション
```css
--gradient-bg: from-purple-50 via-pink-50 to-purple-50;
--gradient-primary: from-primary-500 to-pink-500;
--gradient-orange: from-orange-400 to-red-500;
--gradient-purple: from-purple-400 to-pink-500;
--gradient-blue: from-blue-400 to-cyan-500;
--gradient-pink: from-pink-400 to-rose-500;
--gradient-indigo: from-indigo-400 to-purple-500;
--gradient-green: from-green-400 to-emerald-500;
```

### 2.2 タイポグラフィ

#### フォントファミリー

**プライマリフォント**:
```css
font-family: 'Nunito', sans-serif;
/* Weights: 300, 400, 500, 600, 700, 800 */
```

**装飾フォント**:
```css
font-family: 'Pacifico', cursive;           /* ロゴ・ブランディング */
font-family: 'Dancing Script', cursive;     /* エレガントな装飾 */
font-family: 'Great Vibes', cursive;        /* 高級感のある装飾 */
font-family: 'Satisfy', cursive;            /* 手書き風 */
```

**ディスプレイフォント**:
```css
font-family: 'Bungee', display;             /* インパクトのある見出し */
font-family: 'Fredoka One', display;        /* ポップな見出し */
```

**ボディフォント**:
```css
font-family: 'Comfortaa', sans-serif;       /* 柔らかい本文 */
font-family: 'Quicksand', sans-serif;       /* モダンな本文 */
font-family: 'Comic Neue', sans-serif;      /* カジュアルな本文 */
```

#### フォントサイズ階層
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### 2.3 スペーシング

Tailwind CSSデフォルトスケール使用:
```
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128px
```

### 2.4 コンポーネントスタイル

#### ボタン
```tsx
// プライマリボタン
className="bg-gradient-to-r from-primary-500 to-pink-500 text-white px-8 py-4 rounded-full font-cutie text-lg"

// セカンダリボタン
className="bg-white text-primary-600 border-2 border-primary-200 px-8 py-4 rounded-full"

// アウトラインボタン
className="border-2 border-pink-300 text-pink-600 px-6 py-3 rounded-full"
```

#### カード
```tsx
className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
```

#### インプット
```tsx
className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400"
```

---

## 3. 画面構成

### 3.1 ページ構造

```
pages/user/
├── login.tsx ✅
├── register.tsx ✅
├── register-form.tsx ❌ NEW
├── welcome.tsx ✅
├── map.tsx ✅
├── index.tsx ❌ NEW (ホーム画面)
│
├── profile/ (ディレクトリ化)
│   ├── index.tsx ✅ (現profile.tsxを移動)
│   └── settings.tsx ❌ NEW
│
├── points/ (ディレクトリ化)
│   ├── index.tsx ✅ (現points.tsxを移動)
│   ├── history.tsx ❌ NEW
│   ├── send-points.tsx ❌ NEW
│   └── receive-points.tsx ❌ NEW
│
├── gifts/ (ディレクトリ化)
│   ├── index.tsx ✅ (現gifts.tsxを移動)
│   └── exchange.tsx ❌ NEW
│
├── stores.tsx ✅
├── favorites.tsx ✅
├── security.tsx ✅
│
└── social/ (ディレクトリ化)
    ├── index.tsx ✅ (現social.tsxを移動)
    ├── feed.tsx ❌ NEW
    ├── friends.tsx ❌ NEW
    ├── notifications.tsx ❌ NEW
    ├── reviews.tsx ❌ NEW
    └── [id].tsx ❌ NEW (動的ルーティング)
```

---

## 4. 不足ページ一覧

### 4.1 優先度: CRITICAL (6ページ)

| # | ページ | パス | 目的 | 推定工数 |
|---|--------|------|------|----------|
| 1 | ホーム画面 | `/user` | アプリのメインダッシュボード | 2-3時間 |
| 2 | ログイン | `/user/login` | **修正**: router.push対応 | 30分 |
| 3 | 新規登録 | `/user/register` | **修正**: router.push対応 | 30分 |
| 4 | ウェルカム | `/user/welcome` | **修正**: router.push対応 | 30分 |
| 5 | 地図 | `/user/map` | **修正**: router.push対応 | 30分 |
| 6 | 登録フォーム | `/user/register-form` | 新規登録の詳細入力 | 1-2時間 |

### 4.2 優先度: HIGH (10ページ)

| # | ページ | パス | 目的 | 推定工数 |
|---|--------|------|------|----------|
| 7 | ポイント履歴 | `/user/points/history` | ポイント取得・使用履歴 | 1-2時間 |
| 8 | ポイント送信 | `/user/points/send-points` | 友達にポイント送る | 1-2時間 |
| 9 | ギフト交換 | `/user/gifts/exchange` | ギフト交換実行画面 | 1-2時間 |
| 10 | プロフィール設定 | `/user/profile/settings` | 詳細設定 | 1時間 |
| 11-16 | 既存ページ修正 | 各種 | router.push修正 | 3時間 |

### 4.3 優先度: MEDIUM (8ページ)

| # | ページ | パス | 目的 | 推定工数 |
|---|--------|------|------|----------|
| 17 | ポイント受取 | `/user/points/receive-points` | ポイント受取確認 | 1時間 |
| 18 | ソーシャルフィード | `/user/social/feed` | アクティビティフィード | 2時間 |
| 19 | 友達リスト | `/user/social/friends` | 友達管理 | 1-2時間 |
| 20 | 通知一覧 | `/user/social/notifications` | 通知センター | 1-2時間 |
| 21-24 | 既存ページ | 各種 | 微調整 | 2時間 |

### 4.4 優先度: LOW (2ページ)

| # | ページ | パス | 目的 | 推定工数 |
|---|--------|------|------|----------|
| 25 | レビュー一覧 | `/user/social/reviews` | ユーザーレビュー | 1時間 |
| 26 | ソーシャル詳細 | `/user/social/[id]` | 動的詳細ページ | 1時間 |

---

## 5. 再構築作業計画

### 5.1 フェーズ1: 緊急対応 (推定: 6-8時間)

**目的**: 既存11ページの動作を完全に保証

#### タスク一覧
1. ✅ **router.push → window.location.href 変換**
   - 全11ファイル修正
   - 67箇所の変更
   - 所要時間: 2-3時間

2. ✅ **ディレクトリ構造の再編成**
   - `pages/user/profile.tsx` → `pages/user/profile/index.tsx`
   - `pages/user/points.tsx` → `pages/user/points/index.tsx`
   - `pages/user/gifts.tsx` → `pages/user/gifts/index.tsx`
   - `pages/user/social.tsx` → `pages/user/social/index.tsx`
   - 所要時間: 1時間

3. ✅ **Django urls.py 更新**
   - ターミナル方式の動的ルーティング適用
   - 所要時間: 1時間

4. ✅ **ビルド・テスト**
   - `BUILD_TARGET=cloudflare npm run build`
   - ローカルテスト
   - 所要時間: 1-2時間

### 5.2 フェーズ2: CRITICAL機能追加 (推定: 8-10時間)

1. **ホーム画面作成** (`/user/index.tsx`)
   - ダッシュボードレイアウト
   - クイックアクション
   - ポイント残高表示
   - 所要時間: 2-3時間

2. **登録フォーム** (`/user/register-form.tsx`)
   - 詳細入力フォーム
   - バリデーション
   - 所要時間: 1-2時間

3. **ポイント履歴** (`/user/points/history.tsx`)
   - 履歴一覧表示
   - フィルター機能
   - 所要時間: 1-2時間

4. **ポイント送信** (`/user/points/send-points.tsx`)
   - 送信フォーム
   - 確認ダイアログ
   - 所要時間: 1-2時間

5. **ギフト交換** (`/user/gifts/exchange.tsx`)
   - 交換フロー
   - ポイント確認
   - 所要時間: 1-2時間

### 5.3 フェーズ3: HIGH/MEDIUM機能追加 (推定: 8-12時間)

1. **プロフィール設定** (`/user/profile/settings.tsx`)
2. **ポイント受取** (`/user/points/receive-points.tsx`)
3. **ソーシャルフィード** (`/user/social/feed.tsx`)
4. **友達リスト** (`/user/social/friends.tsx`)
5. **通知** (`/user/social/notifications.tsx`)

### 5.4 フェーズ4: LOW優先度 + 最終調整 (推定: 4-6時間)

1. **レビュー** (`/user/social/reviews.tsx`)
2. **動的ページ** (`/user/social/[id].tsx`)
3. **全体テスト**
4. **本番デプロイ**

---

## 6. 技術仕様

### 6.1 Next.js設定

```javascript
// next.config.js
module.exports = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

### 6.2 ビルドコマンド

```bash
# 環境変数設定
export BUILD_TARGET=cloudflare

# クリーンビルド
rm -rf .next out

# ビルド実行
npm run build

# 静的ファイルコピー
cp -r out/* production/user-backend/static/
```

### 6.3 Django URLルーティング

```python
# production/user-backend/urls.py (ターミナル方式)

def serve_user_page(request, page=''):
    """ユーザー画面の動的配信"""
    from django.http import FileResponse, Http404
    import os
    
    # ページパス解決
    if not page or page == '/':
        html_file = 'login.html'
    else:
        html_file = f"{page.rstrip('/')}.html"
    
    # サブディレクトリ対応
    static_file = os.path.join(
        os.path.dirname(__file__), 
        'static', 
        html_file
    )
    
    if not os.path.exists(static_file):
        raise Http404(f"Page not found: {page}")
    
    response = FileResponse(
        open(static_file, 'rb'), 
        content_type='text/html'
    )
    response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    
    return response

urlpatterns = [
    # 動的ルーティング
    path('', serve_user_page, name='user-root'),
    path('<path:page>/', serve_user_page, name='user-page'),
    
    # 静的ファイル
    path('_next/<path:path>', serve_next_static, name='next-static'),
]
```

### 6.4 PWA設定

```json
// production/user-backend/static/manifest.json
{
  "name": "Melty+ (メルティプラス)",
  "short_name": "Melty+",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ec4899",
  "description": "大阪ミナミ・北新地で使えるポイント＆ギフトアプリ",
  "icons": [
    {
      "src": "/static/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/static/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 7. 作業時間見積もり

| フェーズ | タスク | 推定時間 | 優先度 |
|---------|--------|----------|--------|
| Phase 1 | 既存修正・再構成 | 6-8時間 | CRITICAL |
| Phase 2 | CRITICAL機能追加 | 8-10時間 | CRITICAL |
| Phase 3 | HIGH/MEDIUM機能 | 8-12時間 | HIGH |
| Phase 4 | LOW優先度・調整 | 4-6時間 | MEDIUM |
| **合計** | **全体** | **26-36時間** | - |

### 推奨スケジュール

- **Day 1**: Phase 1 完了 (6-8時間)
- **Day 2**: Phase 2 完了 (8-10時間)
- **Day 3**: Phase 3 着手 (4-6時間)
- **Day 4**: Phase 3 完了 + Phase 4 (6-8時間)
- **Day 5**: 最終調整・デプロイ (2-4時間)

**最短**: 3-4日  
**推奨**: 5-7日 (余裕を持った開発)

---

## 8. 次のステップ

### ✅ 確認事項

1. **この画面設計書で了承しますか？**
2. **作業開始の承認をいただけますか？**
3. **優先順位の変更はありますか？**

### 🚀 作業開始準備

承認後、以下の順序で作業を開始します:

1. ✅ Phase 1: 既存11ページの修正
2. ✅ ディレクトリ構造の再編成
3. ✅ router.push → window.location.href変換
4. ✅ Django urls.py更新
5. ✅ ローカルビルド・テスト

---

**作成者**: GitHub Copilot  
**レビュー日**: 2025年10月28日  
**バージョン**: 1.0  
**ステータス**: 提案中 (承認待ち)
