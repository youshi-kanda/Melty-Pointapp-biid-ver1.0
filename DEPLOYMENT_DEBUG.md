# 🔍 Cloudflare Pages 404エラー デバッグガイド

## 🚨 確認すべき点

### 1. アップロード後のファイル構造確認
Cloudflare Pages のダッシュボードで**実際のファイル構造**を確認：

```
期待される構造:
├── _next/
│   └── static/
│       ├── chunks/
│       │   ├── main-a6aeac9944c370c1.js
│       │   ├── framework-1594f84e519182f7.js
│       │   └── pages/
│       ├── css/
│       │   └── 4e79dc10c9742095.css
│       └── aUszd48C04Em7rYmP6LA9/
│           ├── _buildManifest.js
│           └── _ssgManifest.js
├── admin/
├── _headers
├── _redirects
└── index.html

⚠️ 実際の構造が違う場合:
├── admin-production/  ← 余分な階層
│   ├── _next/
│   └── admin/
```

### 2. ブラウザでの確認方法

1. **開発者ツール > Network タブ**
2. ページリロード
3. 失敗したリクエストのURLを確認：
   ```
   ❌ 404 エラー: https://your-site.pages.dev/_next/static/chunks/main-a6aeac9944c370c1.js
   ```

4. **手動でURLアクセステスト**：
   ```
   https://your-site.pages.dev/_next/static/chunks/main-a6aeac9944c370c1.js
   ↓
   404 = ファイルパス問題
   200 = _redirects問題
   ```

### 3. 修正方法

#### A. ZIPアップロード時の注意
```bash
❌ 間違い: admin-production フォルダをZIPに含める
✅ 正しい: admin-production の**中身**をZIPに含める
```

#### B. 正しいアップロード手順
1. `admin-production` フォルダを開く
2. **中身全体を選択** (Ctrl+A)
3. **選択した中身をZIP化**
4. Cloudflare Pages にアップロード

#### C. 確認コマンド
```bash
# ZIPの中身確認
PowerShell: Expand-Archive test.zip temp; ls temp
```

### 4. 緊急テスト方法

**シンプルなテストファイル作成:**
```html
<!-- test.html -->
<script>
  fetch('/_next/static/chunks/main-a6aeac9944c370c1.js')
    .then(r => console.log('Status:', r.status))
    .catch(e => console.error('Error:', e));
</script>
```

**結果判定:**
- `Status: 200` = ファイルアクセス成功
- `Status: 404` = ファイルパス問題
- `Status: 403` = _headers/_redirects問題

## 🎯 解決策の優先順位

1. **最優先**: ZIPの中身構造を確認
2. **次**: Cloudflare Dashboard でファイル構造確認  
3. **最後**: _headers/_redirects の調整

## 💡 最終手段

**最小構成テスト:**
1. HTMLファイル1つだけアップロード
2. 正常表示確認
3. 段階的にファイル追加

これで根本原因が特定できるはずです！