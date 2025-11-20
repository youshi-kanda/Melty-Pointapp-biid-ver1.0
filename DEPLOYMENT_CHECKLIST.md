# デプロイチェックリスト - BIID Point App

## 🚨 重要：本番反映前に必ず実行すること

### 1. Next.js静的エクスポートの準備

#### ビルド設定の確認
```javascript
// next.config.js
module.exports = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }
}
```

#### ビルドとパス修正（必須手順）
```bash
# 1. クリーンビルド
rm -rf .next out
npm run build

# 2. すべてのHTMLファイルのパス修正（/_next/ → /static/_next/）
cd out
find . -name "*.html" -exec sed -i '' 's|"/_next/|"/static/_next/|g' {} \;

# 3. index.htmlファイルの作成（Next.jsは admin.html として生成するため）
for dir in admin store terminal user; do
  if [ -f "${dir}.html" ]; then
    cp "${dir}.html" "${dir}/index.html"
  fi
done

# 4. production環境にコピー
cd ..
cp -r out/* production/admin-backend/static/
```

### 2. ナビゲーションURLの修正

#### ❌ 動作しない書き方（Next.js Router）
```tsx
// 静的エクスポート環境では動作しない
router.push('/admin');
router.push('/admin/users');
```

#### ✅ 正しい書き方（直接URL指定）
```tsx
// ログイン成功時
window.location.href = '/static/admin/';

// ログアウト時
window.location.href = '/static/admin/login.html';

// Linkコンポーネントのhref
<Link href="/static/admin/users.html">

// または通常のaタグ
<a href="/static/admin/users.html">
```

### 3. Django設定の確認

#### backend/pointapp/urls.py
```python
from django.views.generic import RedirectView

urlpatterns = [
    # ヘルスチェック（Fly.io用）
    path('health/', health, name='health'),
    
    # ルートから正しいログインページへリダイレクト
    path('', RedirectView.as_view(url='/static/admin/login.html', permanent=False)),
    
    # 静的ファイル配信
    *static(settings.STATIC_URL, document_root=settings.STATIC_ROOT),
]
```

#### production/admin-backend/admin_settings.py
```python
# WhiteNoise設定
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # ← 必須
    # ... 他のミドルウェア
]

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']
WHITENOISE_USE_FINDERS = True
WHITENOISE_INDEX_FILE = True

# 本番環境では適切なホストに変更
ALLOWED_HOSTS = ['*']  # TODO: 本番では具体的なドメインに変更
```

### 4. Fly.ioデプロイ前チェック

#### fly-admin.toml（または各サービスのtoml）
```toml
[build]
  context = "."  # ← 重要：ビルドコンテキスト

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
  path = "/health/"  # ← ヘルスチェックエンドポイント
```

### 5. デプロイ実行

```bash
# 変更をコミット
git add .
git commit -m "適切なコミットメッセージ"

# Fly.ioにデプロイ
flyctl deploy --config fly-admin.toml

# デプロイ確認
flyctl status --config fly-admin.toml
```

### 6. デプロイ後の確認事項

```bash
# 1. ヘルスチェック確認
curl -I https://biid-admin.fly.dev/health/

# 2. ログインページ表示確認
curl -I https://biid-admin.fly.dev/
# → 302 Found, location: /static/admin/login.html

# 3. ダッシュボード確認
curl -I https://biid-admin.fly.dev/static/admin/
# → 200 OK

# 4. CSS/JS読み込み確認
curl -I https://biid-admin.fly.dev/static/_next/static/css/xxxxx.css
# → 200 OK

# 5. 各ページの確認
for page in users stores transactions gifts reports settings features; do
  echo "Checking ${page}..."
  curl -I https://biid-admin.fly.dev/static/admin/${page}.html | grep "HTTP"
done
```

### 7. よくあるエラーと対処法

#### エラー1: CSS/JSが404
**原因**: HTMLファイル内のパスが `/_next/` のまま  
**対処**: ビルド後に必ず `sed` でパス修正

#### エラー2: ログイン後に画面が表示されない
**原因**: `index.html` が存在しない  
**対処**: `admin.html` を `admin/index.html` にコピー

#### エラー3: ページ遷移が動作しない
**原因**: `router.push()` を使用している  
**対処**: `window.location.href` に変更

#### エラー4: ヘルスチェック失敗
**原因**: `/health/` エンドポイントが未定義  
**対処**: `urls.py` に health ビューを追加

#### エラー5: ALLOWED_HOSTS エラー
**原因**: Django設定が厳しすぎる  
**対処**: 一時的に `['*']` に変更、後で適切なドメインに修正

## 🎯 新しいサービス（店舗管理画面など）を追加する場合

### 手順まとめ

1. **フロントエンド開発**
   ```bash
   # pages/store/ 配下にページを作成
   # components/store/ にコンポーネントを作成
   ```

2. **ビルド・パス修正・コピー**
   ```bash
   ./scripts/build-and-deploy.sh store
   ```

3. **Djangoルート設定**
   ```python
   # backend/pointapp/urls.py に追加
   path('store/', RedirectView.as_view(url='/static/store/login.html', permanent=False)),
   ```

4. **Fly.ioにデプロイ**
   ```bash
   flyctl deploy --config fly-store.toml
   ```

5. **動作確認**
   ```bash
   curl -I https://biid-store.fly.dev/
   curl -I https://biid-store.fly.dev/static/store/
   ```

## 📝 メモ

- `.gitignore` で `production/*/static/` は除外されているため、デプロイ時に毎回ビルドが必要
- WhiteNoiseは `/static/admin/` のようなディレクトリアクセス時に自動で `index.html` を返す
- 静的エクスポートでは Next.js の API Routes は使用不可
- すべての認証・API通信はバックエンド（Django）で処理

---

**最終更新**: 2025年11月20日  
**作成理由**: 運営管理画面の修復・デプロイで多くの時間を要したため、再発防止のために記録
