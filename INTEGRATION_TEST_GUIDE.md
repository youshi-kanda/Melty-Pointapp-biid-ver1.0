# BIID Point App - Fly.io 統合テストガイド
# 実行日: 2025年10月19日

## 🎯 テスト対象サービス

1. Admin Backend: https://biid-admin.fly.dev/
2. Store Backend: https://biid-store.fly.dev/
3. User Backend: https://biid-user.fly.dev/
4. Terminal Backend: https://biid-terminal.fly.dev/

---

## ✅ Phase 1: 基本接続確認

### 1.1 全サービスのヘルスチェック

```bash
# Admin Backend
curl https://biid-admin.fly.dev/api/health/
# 期待値: {"status": "ok", "service": "admin"}

# Store Backend
curl https://biid-store.fly.dev/api/health/
# 期待値: {"status": "ok", "service": "store"}

# User Backend
curl https://biid-user.fly.dev/api/health/
# 期待値: {"status": "ok", "service": "user"}

# Terminal Backend
curl https://biid-terminal.fly.dev/api/health/
# 期待値: {"status": "ok", "service": "terminal"}
```

### 1.2 フロントエンド表示確認

ブラウザで以下のURLにアクセスし、ログイン画面が表示されることを確認：

- [ ] Admin: https://biid-admin.fly.dev/
- [ ] Store: https://biid-store.fly.dev/
- [ ] User: https://biid-user.fly.dev/
- [ ] Terminal: https://biid-terminal.fly.dev/

### 1.3 データベース接続確認

```bash
# 各サービスのログでデータベース接続を確認
flyctl logs -a biid-admin -n | grep "Database connection"
flyctl logs -a biid-store -n | grep "Database connection"
flyctl logs -a biid-user -n | grep "Database connection"
flyctl logs -a biid-terminal -n | grep "Database connection"
```

---

## ✅ Phase 2: テストデータ投入

### 2.1 管理者ユーザー作成

```bash
# Admin Backendのコンソールに接続
flyctl ssh console -a biid-admin

# Django管理者作成
cd /app/backend
python manage.py createsuperuser
# Username: admin
# Email: admin@biid.app
# Password: (安全なパスワードを設定)
```

### 2.2 テストデータスクリプト実行

```bash
# テストデータ作成スクリプトを実行
python manage.py shell < /app/backend/create_test_data.py
```

---

## ✅ Phase 3: 機能テスト

### 3.1 Admin機能テスト

1. **ログイン**: https://biid-admin.fly.dev/admin/
   - [ ] Django管理画面にログインできる
   - [ ] ダッシュボードが表示される

2. **ユーザー管理**:
   - [ ] ユーザー一覧が表示される
   - [ ] 新規ユーザーを作成できる
   - [ ] ユーザー情報を編集できる

3. **店舗管理**:
   - [ ] 店舗一覧が表示される
   - [ ] 新規店舗を登録できる

4. **ギフト管理**:
   - [ ] ギフト一覧が表示される
   - [ ] 新規ギフトを作成できる

### 3.2 Store機能テスト

1. **ログイン**: https://biid-store.fly.dev/
   - [ ] 店舗アカウントでログインできる

2. **ポイント付与**:
   - [ ] QRコード読み取り画面が表示される
   - [ ] ポイント付与処理ができる

3. **売上確認**:
   - [ ] 本日の売上が表示される
   - [ ] 取引履歴が表示される

### 3.3 User機能テスト

1. **ログイン**: https://biid-user.fly.dev/
   - [ ] ユーザーアカウントでログインできる
   - [ ] 新規登録ができる

2. **ポイント確認**:
   - [ ] ポイント残高が表示される
   - [ ] 取引履歴が表示される

3. **ギフト購入**:
   - [ ] ギフト一覧が表示される
   - [ ] ギフトを購入できる
   - [ ] 購入履歴が表示される

### 3.4 Terminal機能テスト

1. **ログイン**: https://biid-terminal.fly.dev/
   - [ ] 端末アカウントでログインできる

2. **決済処理**:
   - [ ] 決済画面が表示される
   - [ ] 決済処理ができる
   - [ ] レシートが発行される

---

## ✅ Phase 4: API エンドポイントテスト

### 4.1 認証API

```bash
# ユーザー登録
curl -X POST https://biid-user.fly.dev/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123"}'

# ログイン（JWTトークン取得）
curl -X POST https://biid-user.fly.dev/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

### 4.2 ポイントAPI

```bash
# ポイント残高確認
curl -X GET https://biid-user.fly.dev/api/points/balance/ \
  -H "Authorization: Bearer <JWT_TOKEN>"

# ポイント履歴
curl -X GET https://biid-user.fly.dev/api/points/history/ \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### 4.3 ギフトAPI

```bash
# ギフト一覧
curl -X GET https://biid-user.fly.dev/api/gifts/ \
  -H "Authorization: Bearer <JWT_TOKEN>"

# ギフト購入
curl -X POST https://biid-user.fly.dev/api/gifts/purchase/ \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"gift_id":1,"quantity":1}'
```

---

## ✅ Phase 5: エラーハンドリング確認

### 5.1 404エラー

```bash
curl -I https://biid-user.fly.dev/nonexistent-page/
# 期待値: HTTP/1.1 404 Not Found
```

### 5.2 401エラー（認証なし）

```bash
curl https://biid-user.fly.dev/api/points/balance/
# 期待値: {"detail": "Authentication credentials were not provided."}
```

### 5.3 バリデーションエラー

```bash
curl -X POST https://biid-user.fly.dev/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"","password":"123"}'
# 期待値: バリデーションエラーメッセージ
```

---

## ✅ Phase 6: パフォーマンステスト

### 6.1 応答時間確認

```bash
# 各エンドポイントの応答時間計測
time curl https://biid-admin.fly.dev/api/health/
time curl https://biid-store.fly.dev/api/health/
time curl https://biid-user.fly.dev/api/health/
time curl https://biid-terminal.fly.dev/api/health/
```

### 6.2 同時アクセステスト

```bash
# Apache Benchでの負荷テスト（10並列、100リクエスト）
ab -n 100 -c 10 https://biid-user.fly.dev/api/health/
```

### 6.3 メモリ使用量確認

```bash
# 各サービスのメモリ使用状況
flyctl status -a biid-admin
flyctl status -a biid-store
flyctl status -a biid-user
flyctl status -a biid-terminal
```

---

## ✅ Phase 7: セキュリティ確認

### 7.1 CORS設定

```bash
# ブラウザコンソールで確認
fetch('https://biid-user.fly.dev/api/health/')
  .then(r => r.json())
  .then(d => console.log(d))
```

### 7.2 HTTPS確認

```bash
# SSL証明書確認
curl -vI https://biid-user.fly.dev/ 2>&1 | grep "SSL"
```

### 7.3 セキュアヘッダー確認

```bash
curl -I https://biid-user.fly.dev/ | grep -E "X-Frame-Options|X-Content-Type-Options|Referrer-Policy"
```

---

## 📊 テスト結果記録

| テスト項目 | 結果 | 備考 |
|-----------|------|------|
| ヘルスチェック | ⬜ | |
| フロントエンド表示 | ⬜ | |
| データベース接続 | ⬜ | |
| 管理者ログイン | ⬜ | |
| ユーザー登録 | ⬜ | |
| ギフト購入 | ⬜ | |
| ポイント付与 | ⬜ | |
| 決済処理 | ⬜ | |
| APIレスポンス時間 | ⬜ | |
| エラーハンドリング | ⬜ | |

---

## 🚨 問題が発生した場合

### ログ確認

```bash
# リアルタイムログ
flyctl logs -a biid-admin

# 過去のログ（最新100行）
flyctl logs -a biid-admin -n 100

# エラーログのみ抽出
flyctl logs -a biid-admin | grep ERROR
```

### デバッグモード有効化

一時的にDEBUG=Trueにする場合：

```bash
flyctl secrets set DEBUG=True -a biid-admin
```

**注意**: 本番環境ではDEBUG=Falseに戻すこと！

---

## 📝 次のステップ

全テストが完了したら：

1. ✅ テスト結果を記録
2. 🐛 発見した問題を修正
3. 📄 ドキュメント作成
4. 💾 バックアップ手順確認
5. 🚀 AWS移行準備開始
