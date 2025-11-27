# デジタルギフトAPI統合ガイド

## 概要

このガイドでは、RealPay デジタルギフトAPIとの統合手順を説明します。

## 前提条件

- RealPay APIの契約が完了していること
- APIアクセスキー(40文字)を取得していること
- TOTP認証用の共有シークレットを取得していること

## セットアップ手順

### 1. APIアクセスキーの設定

#### 方法A: 管理画面から設定 (推奨)

1. 管理画面にアクセス: `https://biid-admin.fly.dev/admin/`
2. 「Core」→「API access keys」を選択
3. 「ADD API ACCESS KEY」をクリック
4. 以下の情報を入力:
   - **Key**: RealPayから提供された40文字のAPIアクセスキー
   - **Shared secret**: TOTP認証用の共有シークレット
   - **Environment**: `production` または `sandbox`
   - **Time step**: `30` (デフォルト)
   - **Totp digits**: `6` (デフォルト)
   - **Is active**: チェック
5. 「SAVE」をクリック

#### 方法B: スクリプトから設定

```bash
# ローカル環境
cd backend
python setup_digital_gift_api.py

# 本番環境
fly ssh console --app biid-admin --command "python /app/backend/setup_digital_gift_api.py"
```

### 2. ブランド一覧の同期

APIから利用可能なギフトブランド一覧を取得し、データベースに同期します。

#### 管理画面から同期

1. 「Core」→「Digital gift brands」を選択
2. ブランドを選択
3. アクション: 「APIからブランド情報を同期」を選択
4. 「Go」をクリック

#### スクリプトから同期

```bash
# ローカル環境
cd backend
python test_digital_gift_integration.py

# 本番環境
fly ssh console --app biid-admin --command "python /app/backend/test_digital_gift_integration.py"
```

### 3. 統合テストの実行

```bash
cd backend
python test_digital_gift_integration.py
```

テストは以下の項目を確認します:
- ✅ ブランド一覧取得
- ✅ 購入ID作成
- ✅ ギフト購入 (オプション)
- ✅ ギフト交換フロー準備

### 4. デモギフトのインポート

`API関連/デモギフト_biid株式会社様.csv` には10件のデモギフト(5000円×10)が含まれています。

**注意**: デモギフトには有効期限があります。期限切れの場合は、DIGITAL FINTECH社に新規デモデータを依頼してください。

## トラブルシューティング

### エラー: 「有効なAPIアクセスキーがありません」

**解決策**:
1. 管理画面で APIAccessKey が作成されているか確認
2. `is_active` がチェックされているか確認
3. キーの長さが40文字か確認

### エラー: 「API接続エラー」

**原因と解決策**:
- **401 Unauthorized**: TOTP認証失敗
  - 共有シークレットが正しいか確認
  - time_stepが30秒に設定されているか確認
- **400 Bad Request**: パラメータエラー
  - リクエストパラメータを確認
- **503 Service Unavailable**: サーバーエラー
  - しばらく待ってから再試行

### ATM受取が利用できない

ATM受取(セブン銀行ATM受取)は以下の理由で利用できない可能性があります:

1. **RealPay Partner APIに含まれていない**
   - `/brands` エンドポイントのレスポンスにATM受取が含まれているか確認
   - 含まれていない場合は別途契約が必要

2. **別サービスとして提供されている**
   - Seven Payment Service社との直接契約が必要
   - 月額10,000円 + 取引手数料
   - 実装期間: 1-2ヶ月

3. **代替手段: RefundRequestシステム**
   - 既存の現金払戻し機能を使用
   - 最低20,000円から
   - 10%の手数料
   - 銀行振込で現金化

## API呼び出しフロー

### ギフト交換フロー

```
1. ユーザーがギフトを選択
   ↓
2. バックエンド: 購入ID作成 (create_purchase_id)
   - prices: [1000, 3000, 5000]
   - name: "Melty+ ギフト"
   - issuer: "株式会社biid"
   - brands: ["amazon", "paypay"]
   ↓
3. バックエンド: ギフト購入 (purchase_gift)
   - purchase_id: "xxx..."
   - price: 5000
   ↓
4. レスポンス受信
   - gift_code: ギフトコード
   - gift_url: ギフトURL
   - qr_code_url: QRコードURL
   - expire_at: 有効期限
   ↓
5. ユーザーにギフトコードを表示
```

### API認証フロー (TOTP)

```python
import pyotp

# TOTP生成
totp = pyotp.TOTP(shared_secret, interval=30, digits=6)
token = totp.now()

# HTTPヘッダーに追加
headers = {
    'x-realpay-gift-api-access-token': token,
    'x-realpay-gift-api-access-key': api_key
}
```

## 関連ファイル

- `backend/core/models.py`: APIAccessKey, DigitalGiftBrand モデル
- `backend/core/digital_gift_client.py`: RealPay APIクライアント
- `backend/core/views.py`: GiftExchangeView (ギフト交換API)
- `backend/core/admin.py`: 管理画面設定
- `backend/setup_digital_gift_api.py`: 初期設定スクリプト
- `backend/test_digital_gift_integration.py`: 統合テストスクリプト
- `pages/user/gifts.tsx`: ユーザー向けギフト交換UI

## 参考資料

- `API関連/パートナー様用API.txt`: RealPay Partner API仕様書
- `API関連/DIGITAL_GIFT_INTEGRATION_REPORT.md`: 統合仕様書(1679行)
- `API関連/デモギフト_biid株式会社様.csv`: デモギフトデータ

## サポート

問題が解決しない場合は、以下に問い合わせてください:
- DIGITAL FINTECH, Inc. (デジタルギフト提供元)
- https://digital-plus.co.jp/
- https://digital-gift.jp/contact
