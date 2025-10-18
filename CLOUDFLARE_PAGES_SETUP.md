# Cloudflare Pages デプロイガイド

このガイドでは、BIID Point AppのフロントエンドをCloudflare Pagesにデプロイする手順を説明します。

## 🚀 デプロイ手順

### 1. Cloudflareアカウント準備

1. [Cloudflare Dashboard](https://dash.cloudflare.com) にアクセス
2. アカウントがなければ無料登録（メール認証が必要）
3. ログイン後、左メニューから **「Workers & Pages」** → **「Pages」** を選択

### 2. プロジェクト作成

1. **「Create application」** ボタンをクリック
2. **「Pages」** タブを選択
3. **「Connect to Git」** を選択

### 3. GitHubリポジトリ接続

1. **「Connect GitHub」** をクリック
2. GitHubアカウントで認証
3. リポジトリアクセス権限を付与
   - オプション1: すべてのリポジトリ
   - オプション2: 特定リポジトリのみ（`Melty-Pointapp-biid-ver1.0`）
4. リポジトリ一覧から **`Melty-Pointapp-biid-ver1.0`** を選択

### 4. ビルド設定

以下の設定を入力してください:

| 項目 | 設定値 |
|------|--------|
| **プロジェクト名** | `biid-pointapp` |
| **本番ブランチ** | `main` |
| **フレームワークプリセット** | `Next.js` |
| **ビルドコマンド** | `npm run build` |
| **ビルド出力ディレクトリ** | `.next` |
| **Root directory** | (空白のまま) |

### 5. 環境変数の設定

**「Environment variables (advanced)」** セクションを展開し、以下を追加:

#### Production環境

```
NODE_ENV=production
BUILD_TARGET=cloudflare
NEXT_PUBLIC_API_URL=https://api.biid.app
NEXT_PUBLIC_ADMIN_URL=https://admin.biid.app
NEXT_PUBLIC_STORE_URL=https://store.biid.app
NEXT_PUBLIC_TERMINAL_URL=https://terminal.biid.app
```

**注意:** バックエンドがまだデプロイされていない場合、一旦ローカル環境のURLを設定してもOKです。後で更新できます。

### 6. デプロイ実行

1. **「Save and Deploy」** をクリック
2. 初回ビルドが開始されます（通常2-5分）
3. ビルドログを確認して、エラーがないか確認

### 7. デプロイ確認

デプロイが完了すると、自動生成されたURL（例: `biid-pointapp.pages.dev`）が発行されます。

1. URLをクリックしてアクセス
2. フロントエンドが正常に表示されることを確認

## 🌐 カスタムドメイン設定

### 前提条件
- ドメイン `biid.app` がCloudflareで管理されていること
- DNS設定の権限があること

### 設定手順

1. Cloudflare Pages プロジェクト → **「Custom domains」** タブ
2. **「Set up a custom domain」** をクリック
3. ドメイン入力: `app.biid.app`
4. **「Continue」** をクリック
5. DNS設定を確認
   - Cloudflareが自動的にCNAMEレコードを追加します
   - 既にCloudflareで管理されている場合は即座に反映
6. SSL/TLS証明書が自動発行されます（数分～数時間）

### DNS設定例

```
Type: CNAME
Name: app
Content: biid-pointapp.pages.dev
Proxy status: Proxied (オレンジクラウド)
```

## 🔄 自動デプロイ設定

GitHubの`main`ブランチにプッシュすると、自動的に再デプロイされます。

### ブランチ別デプロイ

- **Production**: `main` ブランチ → `app.biid.app`
- **Preview**: その他のブランチ → `<branch-name>.biid-pointapp.pages.dev`

プルリクエストを作成すると、自動的にプレビューURLが生成されます。

## 📝 環境変数の更新方法

1. Cloudflare Pages プロジェクト → **「Settings」** → **「Environment variables」**
2. 変数を追加/編集
3. **「Save」** をクリック
4. **「Deployments」** タブ → **「Retry deployment」** で再デプロイ

## 🐛 トラブルシューティング

### ビルドエラーが発生する場合

1. **「Deployments」** タブでビルドログを確認
2. よくあるエラー:
   - Node.jsバージョン不一致 → `package.json` で指定
   - 環境変数未設定 → 上記の環境変数を確認
   - 依存パッケージエラー → `package-lock.json` を確認

### ビルドログ確認方法

```
Deployments → 最新のデプロイ → View build logs
```

### Node.jsバージョン指定

`package.json`に以下を追加:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 📊 Cloudflare Pages の特徴

### メリット
- ✅ 無料枠: 月500回のビルド、100GB帯域
- ✅ 自動HTTPS/SSL証明書
- ✅ グローバルCDN（高速配信）
- ✅ GitHubとの自動連携
- ✅ プレビューデプロイ（プルリクエストごと）
- ✅ Rollback機能（過去のデプロイに戻せる）

### 制限事項
- ファイルサイズ上限: 25MB
- 最大ファイル数: 20,000
- ビルド時間上限: 20分

## 🔗 参考リンク

- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)

## 📞 サポート

問題が発生した場合:
1. Cloudflare コミュニティフォーラム
2. Cloudflare サポート（Proプラン以上）
3. GitHubリポジトリのIssue

---

**作成日**: 2025年10月18日
**更新日**: 2025年10月18日
