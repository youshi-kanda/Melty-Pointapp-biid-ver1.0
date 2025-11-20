# クイックリファレンス - 店舗管理画面の修復手順

## 🚀 店舗管理画面（Store Admin）を修復する際の手順

### 前提条件
- `pages/store/` 配下のファイルが存在すること
- `components/store/` にコンポーネントがあること

### 手順1: ナビゲーションURLを確認・修正

#### ❌ 修正が必要なパターン
```tsx
// router.push() は静的エクスポートで動作しない
router.push('/store');
router.push('/store/dashboard');
```

#### ✅ 正しいパターン
```tsx
// 直接URLを指定
window.location.href = '/static/store/';
window.location.href = '/static/store/dashboard.html';

// Linkコンポーネント
<Link href="/static/store/dashboard.html">ダッシュボード</Link>
```

### 手順2: 自動ビルド・デプロイスクリプトを実行

```bash
# プロジェクトルートで実行
./scripts/build-and-deploy.sh store

# スクリプトが以下を自動実行：
# 1. .next と out フォルダをクリーン
# 2. npm run build
# 3. すべてのHTMLで /_next/ → /static/_next/ に置換
# 4. store.html を store/index.html にコピー
# 5. production/store-backend/static/ にコピー
# 6. デプロイするか確認（y/n）
```

### 手順3: Django設定を確認

#### backend/pointapp/urls.py に追加
```python
urlpatterns = [
    # 既存のパス...
    
    # 店舗管理画面のルート
    path('store/', RedirectView.as_view(url='/static/store/login.html', permanent=False), name='store-root'),
]
```

### 手順4: Fly.io設定を確認

#### fly-store.toml を作成（存在しない場合）
```toml
app = "biid-store"
primary_region = "nrt"

[build]
  context = "."
  dockerfile = "production/store-backend/Dockerfile"

[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[http_service.checks]]
  interval = "15s"
  timeout = "10s"
  grace_period = "30s"
  method = "GET"
  path = "/health/"

[env]
  DJANGO_SETTINGS_MODULE = "store_settings"

[[mounts]]
  source = "store_data"
  destination = "/data"
```

### 手順5: デプロイと確認

```bash
# 変更をコミット
git add .
git commit -m "fix(store): Update store admin frontend"

# デプロイ（スクリプトで自動実行済みの場合はスキップ）
flyctl deploy --config fly-store.toml

# 確認
flyctl status --config fly-store.toml

# 動作テスト
curl -I https://biid-store.fly.dev/
curl -I https://biid-store.fly.dev/static/store/
curl -I https://biid-store.fly.dev/static/store/dashboard.html
```

## 📋 チェックリスト

修復作業の各ステップで以下を確認：

- [ ] `pages/store/` 内のすべての `router.push()` を `window.location.href` に変更
- [ ] `components/store/Sidebar.tsx` のリンクを `/static/store/xxx.html` 形式に変更
- [ ] ログイン成功時の遷移先を `/static/store/` に設定
- [ ] ログアウト時の遷移先を `/static/store/login.html` に設定
- [ ] `./scripts/build-and-deploy.sh store` を実行
- [ ] `backend/pointapp/urls.py` に店舗ルートを追加
- [ ] `fly-store.toml` が正しく設定されているか確認
- [ ] デプロイ後、すべてのページが200 OKを返すか確認
- [ ] ブラウザで実際にログイン→ダッシュボード→各ページの遷移を確認

## 🔍 トラブルシューティング

### CSS/JSが読み込まれない
```bash
# HTMLファイル内のパスを確認
curl -s https://biid-store.fly.dev/static/store/ | grep "_next"
# → /static/_next/ で始まっている必要がある

# 修正が必要な場合
cd out
find . -name "*.html" -exec sed -i '' 's|"/_next/|"/static/_next/|g' {} \;
cp -r out/* production/store-backend/static/
```

### index.htmlが404
```bash
# store.html が store/index.html にコピーされているか確認
ls -la production/store-backend/static/store/index.html

# なければ作成
cp production/store-backend/static/store.html production/store-backend/static/store/index.html
```

### ページ遷移が動作しない
- `router.push()` を使っていないか確認
- `window.location.href` に変更
- `.html` 拡張子を忘れずに

## 💡 ヒント

- **開発時**: `npm run dev` でローカル確認（router.push も動作）
- **本番前**: 必ず `./scripts/build-and-deploy.sh` を実行
- **デプロイ後**: `DEPLOYMENT_CHECKLIST.md` の確認項目をすべてチェック

---

**参考ドキュメント**: `DEPLOYMENT_CHECKLIST.md`  
**自動化スクリプト**: `scripts/build-and-deploy.sh`
