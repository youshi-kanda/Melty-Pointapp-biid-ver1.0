# デジタルギフトサービス連携調査レポート（完全版）

**作成日**: 2025年11月1日  
**最終更新**: 2025年11月1日（システム全体検証完了）  
**プロジェクト**: Melty+ ポイントアプリ  
**対象サービス**: RealPay デジタルギフトAPI + 既存ギフトシステム

---

## ⚠️ 重要な発見：システム併存の確認

プロジェクト内には **2つの異なるギフトシステム** が併存していることが判明しました。
本レポートでは両システムの分析と統合計画を提示します。

---

## 📋 目次

1. [システム全体の検証結果](#システム全体の検証結果)
2. [既存ギフトシステムの詳細](#既存ギフトシステムの詳細)
3. [RealPay連携システムの詳細](#realpay連携システムの詳細)
4. [統合アプローチの提案](#統合アプローチの提案)
5. [実装ロードマップ（修正版）](#実装ロードマップ修正版)
6. [データ移行計画](#データ移行計画)
7. [技術仕様](#技術仕様)
8. [4画面での連携シナリオ](#4画面での連携シナリオ)

---

## システム全体の検証結果

### API構造の分析

#### 1️⃣ **既存のギフト交換システム** (Legacy Gift System)

**実装場所**: 
- `backend/core/views.py` (Lines 442-580)
- `backend/core/models.py` (Lines 614-760)
- `backend/core/serializers.py` (Lines 81-127)

**エンドポイント**:
```
GET  /api/gifts/categories/          # ギフトカテゴリ一覧
GET  /api/gifts/                     # ギフト一覧
GET  /api/gifts/{id}/                # ギフト詳細
POST /api/gifts/exchange/            # ギフト交換 ⭐
GET  /api/gifts/exchange/history/   # 交換履歴
GET  /api/gifts/exchange/{id}/      # 交換詳細
```

**データモデル**:
```python
class GiftCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

class Gift(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(GiftCategory)
    gift_type = models.CharField(max_length=20)  # digital/coupon/voucher/physical
    points_required = models.IntegerField()
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField()
    unlimited_stock = models.BooleanField(default=False)
    provider_name = models.CharField(max_length=255)
    exchange_count = models.IntegerField(default=0)

class GiftExchange(models.Model):
    user = models.ForeignKey(User)
    gift = models.ForeignKey(Gift)
    points_spent = models.IntegerField()
    exchange_code = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20)  # pending/completed/failed
    digital_code = models.CharField(max_length=500)  # ⭐
    digital_url = models.URLField()
    qr_code_url = models.URLField()
```

**特徴**:
- ✅ シンプルなポイント交換システム
- ✅ デジタルコード生成機能（現在はモック実装）
- ✅ **ユーザーアプリで既に使用中**（`pages/user/gifts.tsx`）
- ✅ トランザクション管理
- ⚠️ 外部API連携なし（自己完結型）
- ⚠️ 手数料計算機能なし

---

#### 2️⃣ **RealPay デジタルギフトAPI連携システム** (Partner API System)

**実装場所**:
- `backend/core/partner_views.py` (Lines 1-678)
- `backend/core/digital_gift_client.py` (Lines 1-326)
- `backend/core/partner_auth.py` (TOTP認証)
- `backend/core/partner_serializers.py` (Lines 1-512)
- `backend/core/partner_urls.py`

**エンドポイント**:
```
# 新API
GET  /api/partner/digital-gifts/brands/      # RealPayブランド一覧
POST /api/partner/digital-gifts/purchase-id/ # 購入ID作成
POST /api/partner/digital-gifts/purchase/    # ギフト購入
POST /api/partner/digital-gifts/exchange/    # ポイント→ギフト交換 ⭐

# レガシーAPI（後方互換）
GET  /api/partner/brands/                    # ブランド一覧
POST /api/partner/purchases/                 # 購入ID作成
POST /api/partner/purchases/{id}/gifts/      # ギフト購入
```

**データモデル**:
```python
class DigitalGiftBrand(models.Model):
    code = models.CharField(max_length=50, unique=True)  # amazon, paypay
    name = models.CharField(max_length=255)
    supported_prices = models.JSONField(default=list)
    min_price = models.IntegerField(default=100)
    max_price = models.IntegerField(default=50000)
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    commission_tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)

class DigitalGiftPurchaseID(models.Model):
    purchase_id = models.CharField(max_length=40, unique=True)
    brand = models.ForeignKey(DigitalGiftBrand)
    price = models.IntegerField()
    # デザイン設定...
    expires_at = models.DateTimeField()  # 30分有効

class DigitalGiftPurchase(models.Model):
    gift_code = models.CharField(max_length=100, unique=True)
    gift_url = models.URLField()
    user = models.ForeignKey(User)
    brand = models.ForeignKey(DigitalGiftBrand)
    price = models.IntegerField()
    points_used = models.IntegerField()
    commission = models.IntegerField(default=0)
    commission_tax = models.IntegerField(default=0)
    total_cost = models.IntegerField()
    status = models.CharField(max_length=20)
    expire_at = models.DateTimeField()  # 1年有効

class DigitalGiftUsageLog(models.Model):
    gift_purchase = models.ForeignKey(DigitalGiftPurchase)
    action = models.CharField(max_length=50)
    timestamp = models.DateTimeField()
```

**特徴**:
- ✅ RealPay外部API連携（`https://api.realpay.jp/v1`）
- ✅ TOTP認証（30秒更新、pyotp使用）
- ✅ 手数料計算機能（`calculate_total_cost()`）
- ✅ 購入ID・リクエストID管理（重複チェック）
- ✅ 使用ログ記録（監査証跡）
- ✅ 有効期限管理（購入ID:30分、ギフト:1年）
- ⚠️ **ユーザーアプリとの連携未実装**
- ⚠️ フロントエンド画面なし

---

### 📊 システム併存の影響分析

#### 現状の問題点

1. **APIエンドポイントの二重化**
   ```
   既存: POST /api/gifts/exchange/
   新規: POST /api/partner/digital-gifts/exchange/
   ```
   - どちらを使うべきか不明確
   - フロントエンドの混乱を招く

2. **データモデルの分離**
   - `Gift` モデル（226個のフィールド）
   - `DigitalGiftBrand` モデル（別系統）
   - ユーザーは既存の`Gift`を見ているが、RealPayブランドは見えていない

3. **フロントエンドの不整合**
   - `pages/user/gifts.tsx` は `/api/gifts/exchange/` を使用
   - RealPay APIを呼んでいない
   - 手数料計算がフロントに反映されていない

4. **セットアップスクリプトの重複**
   - `backend/setup_partner_api.py` - RealPay用
   - `backend/create_gift_data.py` - 既存Gift用
   - 両方実行すると同じブランド（Amazon等）が二重登録

---

### ✅ 推奨される統合アプローチ

#### **Option A: ハイブリッドアプローチ（推奨）**

既存システムを維持しつつ、RealPay APIを段階的に統合

```python
# backend/core/models.py - Gift モデル拡張

class Gift(models.Model):
    # 既存フィールド...
    name = models.CharField(max_length=255)
    points_required = models.IntegerField()
    
    # ✨ RealPay連携フィールド追加
    is_external_gift = models.BooleanField(
        default=False,
        help_text="RealPay APIを使用するギフトかどうか"
    )
    external_brand = models.ForeignKey(
        'DigitalGiftBrand',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='linked_gifts',
        help_text="紐付けられたRealPayブランド"
    )
    commission_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="手数料率（%）"
    )
    
    def calculate_total_cost(self):
        """手数料込みの総コスト計算"""
        if self.is_external_gift and self.external_brand:
            return self.external_brand.calculate_total_cost(
                self.points_required
            )
        return {
            'price': self.points_required,
            'commission': 0,
            'commission_tax': 0,
            'total': self.points_required,
            'currency': 'JPY'
        }
```

```python
# backend/core/views.py - GiftExchangeView 改造

class GiftExchangeView(APIView):
    def post(self, request):
        gift = Gift.objects.get(id=gift_id)
        user = request.user
        
        # ✨ 外部ギフトかチェック
        if gift.is_external_gift and gift.external_brand:
            return self._exchange_external_gift(user, gift, serializer.validated_data)
        else:
            return self._exchange_internal_gift(user, gift, serializer.validated_data)
    
    def _exchange_external_gift(self, user, gift, data):
        """RealPay API経由でギフト購入"""
        from .digital_gift_client import get_digital_gift_client
        from django.db import transaction
        
        client = get_digital_gift_client()
        
        # 手数料込みコスト計算
        cost_info = gift.calculate_total_cost()
        required_points = cost_info['total']
        
        # ポイント残高チェック
        if user.point_balance < required_points:
            return Response({'error': 'ポイント不足'}, status=400)
        
        with transaction.atomic():
            # ポイント消費
            user.point_balance -= required_points
            user.save()
            
            # 購入ID作成
            purchase_id_response = client.create_purchase_id(
                brand_code=gift.external_brand.brand_code,
                price=gift.points_required,
                design_code='default'
            )
            
            # ギフト購入
            import time, uuid
            request_id = f"gft-{user.id}-{int(time.time())}-{uuid.uuid4().hex[:8]}"
            
            gift_response = client.purchase_gift(
                purchase_id=purchase_id_response['purchase_id'],
                request_id=request_id
            )
            
            # 交換記録作成
            exchange = GiftExchange.objects.create(
                user=user,
                gift=gift,
                points_spent=required_points,
                exchange_code=f"EXT-{request_id}",
                status='completed',
                digital_code=gift_response['gift_code'],
                digital_url=gift_response['gift_url'],
                processed_at=timezone.now()
            )
            
            # 使用ログ
            client.log_gift_usage(
                gift_id=gift_response['gift_id'],
                user_id=user.id,
                action='exchange',
                details={'cost_breakdown': cost_info}
            )
        
        return Response({
            'success': True,
            'exchange': GiftExchangeSerializer(exchange).data,
            'gift_code': gift_response['gift_code'],
            'gift_url': gift_response['gift_url'],
            'remaining_points': user.point_balance
        })
    
    def _exchange_internal_gift(self, user, gift, data):
        """従来のロジック（内部ギフト）"""
        # 既存のコードをそのまま使用...
        pass
```

**メリット**:
- ✅ 既存のユーザーアプリは変更不要
- ✅ エンドポイントは `/api/gifts/exchange/` のまま
- ✅ 段階的にRealPay連携を導入可能
- ✅ 内部ギフトと外部ギフトの共存

**デメリット**:
- ⚠️ `Gift`モデルが複雑化
- ⚠️ 管理画面でフラグ管理が必要

---

#### **Option B: 完全分離アプローチ**

2つのシステムを完全に分離して運用

```
内部ギフト（店舗独自）:
└─ /api/gifts/exchange/
    └─ 店舗限定クーポン、ノベルティ等

外部ギフト（RealPay）:
└─ /api/partner/digital-gifts/exchange/
    └─ Amazon、PayPay等のブランドギフト
```

**フロントエンド**:
```typescript
// pages/user/gifts/internal.tsx - 内部ギフト
// pages/user/gifts/external.tsx - RealPayギフト（新規）
// pages/user/gifts/index.tsx - 両方を表示
```

**メリット**:
- ✅ システムが明確に分離
- ✅ それぞれ独立して改善可能

**デメリット**:
- ❌ ユーザーが2つの画面を見る必要がある
- ❌ 開発・保守コスト増

### 基本フロー

```
1. ブランド取得
   └─> GET /gifts/brands
        └─> Amazon、PayPay等のブランド一覧を取得

2. 購入ID作成
   └─> POST /gifts/purchase-id
        ├─> ブランドコード指定
        ├─> 金額指定
        ├─> デザイン設定
        └─> 30分有効な購入IDを取得

3. ギフト購入
   └─> POST /gifts/purchase
        ├─> 購入ID使用
        ├─> リクエストID生成
        └─> ギフトコード・URL発行

4. ギフト確認
   └─> GET /gifts/status/{request_id}
        └─> ギフトの使用状況確認
```

### 認証メカニズム

```python
# TOTP認証
Headers:
  X-RealPay-Gift-API-Access-Key: <APIアクセスキー>
  X-RealPay-Gift-API-Access-Token: <TOTPトークン>

# TOTPトークン生成
totp = pyotp.TOTP(shared_secret, interval=30, digits=6)
token = totp.now()  # 30秒ごとに更新
```

---

## 実装状況

### ✅ 既存実装機能

#### 1. ブランド管理 (`DigitalGiftBrand`)

**モデル定義**: `backend/core/models.py:2607-2645`

```python
class DigitalGiftBrand(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    supported_prices = models.JSONField(default=list)  # [100, 500, 1000, ...]
    min_price = models.IntegerField(default=100)
    max_price = models.IntegerField(default=50000)
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    commission_tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
```

**主要機能**:
- ✅ ブランド一覧取得
- ✅ 対応金額設定管理
- ✅ 手数料計算 (`calculate_total_cost()`)
- ✅ 価格範囲バリデーション

**API**: `GET /api/partner/digital-gifts/brands`

---

#### 2. 購入ID管理 (`DigitalGiftPurchaseID`)

**モデル定義**: `backend/core/models.py:2648-2683`

```python
class DigitalGiftPurchaseID(models.Model):
    purchase_id = models.CharField(max_length=40, unique=True)
    name = models.CharField(max_length=255)
    prices = models.JSONField(default=list)
    brands = models.ManyToManyField(DigitalGiftBrand)
    
    # デザイン設定
    main_color = models.CharField(max_length=7)
    face_image_url = models.URLField()
    
    # 動画設定
    youtube_url = models.URLField()
    minimum_play_time = models.IntegerField(default=0)
    
    # 広告設定
    ad_image_url = models.URLField()
    redirect_url = models.URLField()
```

**主要機能**:
- ✅ 購入ID作成（30分有効期限）
- ✅ デザインカスタマイズ（色、画像）
- ✅ 動画メッセージ設定
- ✅ 広告誘導設定

**API**: `POST /api/partner/digital-gifts/purchase-id`

---

#### 3. ギフト購入処理 (`DigitalGiftPurchase`)

**モデル定義**: `backend/core/models.py:2685-2741`

```python
class DigitalGiftPurchase(models.Model):
    gift_code = models.CharField(max_length=100, unique=True)
    gift_url = models.URLField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    brand = models.ForeignKey(DigitalGiftBrand, on_delete=models.CASCADE)
    
    # 価格情報
    price = models.IntegerField()
    points_used = models.IntegerField()
    commission = models.IntegerField(default=0)
    commission_tax = models.IntegerField(default=0)
    total_cost = models.IntegerField()
    
    # ステータス
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    expire_at = models.DateTimeField()  # 1年有効
    purchased_at = models.DateTimeField(auto_now_add=True)
```

**主要機能**:
- ✅ ギフトコード発行
- ✅ ギフトURL生成
- ✅ PINコード管理
- ✅ 有効期限管理（1年間）
- ✅ ステータス管理（pending/completed/failed/expired/used）

**API**: `POST /api/partner/digital-gifts/purchase`

---

#### 4. ポイント連携 (`PointToGiftExchangeView`)

**実装**: `backend/core/partner_views.py:169-250`

```python
class PointToGiftExchangeView(PartnerAPIAuthMixin, APIView):
    def post(self, request):
        # 1. ユーザーポイント残高確認
        # 2. 手数料込みのコスト計算
        # 3. ポイント消費処理
        # 4. デジタルギフト購入
        # 5. ギフトコード発行
```

**主要機能**:
- ✅ ユーザーポイント消費
- ✅ デジタルギフト交換
- ✅ 手数料自動計算
- ✅ トランザクション記録
- ✅ 使用ログ記録

**API**: `POST /api/partner/digital-gifts/exchange`

---

#### 5. 使用履歴管理 (`DigitalGiftUsageLog`)

**モデル定義**: `backend/core/models.py:2743-2760`

```python
class DigitalGiftUsageLog(models.Model):
    gift_purchase = models.ForeignKey(DigitalGiftPurchase)
    used_amount = models.IntegerField()
    exchange_brand = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
```

**主要機能**:
- ✅ 全ての使用履歴を記録
- ✅ 不正利用検知
- ✅ 監査証跡

---

### ❌ 未実装機能

#### ユーザーアプリ
- ❌ ギフトコード即時表示UI
- ❌ QRコード生成・表示
- ❌ 有効期限通知
- ❌ ギフト再送信機能
- ❌ 交換履歴詳細表示

#### 店舗管理画面
- ❌ ポイントキャンペーン設定
- ❌ 店舗独自ギフト管理
- ❌ 実績レポート

#### 決済端末
- ❌ 即時ギフト交換機能
- ❌ レシート印刷（QRコード付き）

#### 運営管理画面
- ❌ ギフト交換統計ダッシュボード
- ❌ 手数料収益管理
- ❌ ユーザー利用状況分析

---

## 4画面での連携シナリオ

### 🏢 1. 運営管理画面（Admin）

#### 役割
システム全体の設定・監視を行う管理者向け画面

#### 実装済み機能
- ✅ ギフトブランドマスター管理
- ✅ 購入IDテンプレート管理
- ✅ API認証キー管理

#### 実装必要機能

**1.1 ギフトブランド管理**
```typescript
// pages/admin/digital-gifts/brands.tsx

機能:
- ブランド一覧表示
- 新規ブランド追加
- 手数料率設定（デフォルト5%）
- 対応金額設定（100円〜50,000円）
- 有効/無効切り替え

API:
- GET /api/admin/digital-gifts/brands
- POST /api/admin/digital-gifts/brands
- PATCH /api/admin/digital-gifts/brands/{id}
```

**1.2 統計・レポート**
```typescript
// pages/admin/digital-gifts/statistics.tsx

機能:
- 日次/月次交換実績
- ブランド別交換数
- 手数料収益レポート
- ユーザー利用ランキング
- 在庫状況（Purchase ID残数）

API:
- GET /api/admin/digital-gifts/statistics
  - date_from, date_to
  - brand_code (optional)
  - aggregation: daily/monthly
```

**1.3 購入IDテンプレート管理**
```typescript
// pages/admin/digital-gifts/templates.tsx

機能:
- デザインテンプレート作成
- 色設定（main_color, sub_color）
- 画像アップロード（face_image, header_image）
- 動画設定（YouTube URL, 再生時間）
- 広告設定（画像、リダイレクトURL）

API:
- GET /api/admin/digital-gifts/templates
- POST /api/admin/digital-gifts/templates
- PUT /api/admin/digital-gifts/templates/{id}
- DELETE /api/admin/digital-gifts/templates/{id}
```

---

### 🏪 2. 店舗管理画面（Store Admin）

#### 役割
各店舗が独自のポイントキャンペーンやギフト施策を管理

#### 実装必要機能

**2.1 ポイント付与キャンペーン**
```typescript
// pages/store/campaigns/create.tsx

シナリオ例:
- 「3,000円以上購入で100pt」
- 「デジタルギフト交換で5%ポイント増量」
- 「初回ギフト交換で200ptボーナス」

データモデル:
{
  campaign_name: string
  campaign_type: 'purchase_bonus' | 'gift_exchange_bonus'
  start_date: datetime
  end_date: datetime
  conditions: {
    min_purchase_amount?: number
    target_brands?: string[]
    bonus_rate?: number
    bonus_points?: number
  }
  is_active: boolean
}

API:
- POST /api/store/campaigns/create
- GET /api/store/campaigns/list
- PATCH /api/store/campaigns/{id}/status
```

**2.2 店舗独自ギフト**
```typescript
// pages/store/gifts/manage.tsx

機能:
- 店舗限定デジタルクーポン
- 期間限定ギフト設定
- 在庫管理

例:
- 「当店で使える500円クーポン」（100pt）
- 「ドリンク1杯無料券」（50pt）

API:
- POST /api/store/gifts/create
- GET /api/store/gifts/list
- PATCH /api/store/gifts/{id}
```

**2.3 実績確認**
```typescript
// pages/store/dashboard.tsx

表示内容:
- 今月のギフト交換数
- ブランド別人気ランキング
- 店舗発行ポイント総額
- キャンペーン効果測定

API:
- GET /api/store/statistics
  - store_id
  - date_from, date_to
```

---

### 📱 3. ユーザーアプリ（User App）

#### 役割
エンドユーザーがポイントをギフトに交換

#### 現在の実装状況

**既存ファイル**: `pages/user/gifts.tsx`

```typescript
✅ 実装済み:
- ギフト一覧表示
- カテゴリフィルター（tech/food/beauty/etc）
- ソート機能（人気順/価格順）
- ポイント残高表示
- 基本的な交換処理

❌ 未実装:
- デジタルギフト特有の機能
- リアルタイムデータ取得
- ギフトコード表示
- QRコード生成
```

#### 実装必要機能

**3.1 ギフト交換フロー完全実装**
```typescript
// pages/user/gifts/index.tsx（拡張）

フロー:
1. ギフト一覧表示
   └─> GET /api/partner/digital-gifts/brands
        └─> ブランドごとにカード表示

2. ギフト詳細確認
   └─> モーダルで詳細表示
        ├─> 必要ポイント（手数料込み）
        ├─> 有効期限（1年間）
        ├─> 利用可能店舗
        └─> 注意事項

3. 交換確認
   └─> 確認ダイアログ
        ├─> 使用ポイント表示
        ├─> 残りポイント表示
        └─> 「交換する」ボタン

4. 交換処理
   └─> POST /api/partner/digital-gifts/exchange
        {
          "brand_code": "amazon",
          "price": 1000,
          "design_code": "default"
        }

5. ギフトコード表示
   └─> 成功画面
        ├─> ギフトコード（コピー可能）
        ├─> ギフトURL
        ├─> QRコード
        ├─> 有効期限
        └─> 使い方ガイド
```

**3.2 ギフトコード表示画面**
```typescript
// pages/user/gifts/[id].tsx（新規作成）

機能:
- ギフトコード大きく表示
- ワンタップコピー
- QRコード生成（qrcode.react）
- 有効期限カウントダウン
- 使い方ガイドリンク
- ギフトURL（ブラウザで開く）

import QRCode from 'qrcode.react'

<QRCode 
  value={giftUrl} 
  size={200} 
  level="H"
  includeMargin={true}
/>
```

**3.3 交換履歴**
```typescript
// pages/user/gifts/history.tsx（新規作成）

表示内容:
- 交換日時
- ギフト名（ブランド）
- 使用ポイント
- ステータス（未使用/使用済み/期限切れ）
- 有効期限
- 詳細ボタン → ギフトコード再表示

API:
- GET /api/user/gift-history
  - page, limit
  - status (optional)

レスポンス:
{
  "history": [
    {
      "id": 123,
      "brand_name": "Amazon",
      "price": 1000,
      "points_used": 1055,
      "status": "completed",
      "gift_code": "XXXX-XXXX-XXXX",
      "gift_url": "https://...",
      "purchased_at": "2025-11-01T10:30:00Z",
      "expire_at": "2026-11-01T10:30:00Z"
    }
  ],
  "total": 10,
  "page": 1
}
```

**3.4 ギフト再送信機能**
```typescript
// pages/user/gifts/resend.tsx

ユースケース:
- メールが届かなかった
- ギフトコードを紛失した

機能:
- メールアドレス入力
- SMS送信（電話番号入力）
- PDF領収書ダウンロード

API:
- POST /api/user/gift/resend
  {
    "gift_id": 123,
    "method": "email" | "sms",
    "recipient": "user@example.com" | "+819012345678"
  }
```

---

### 💳 4. 決済端末画面（Payment Terminal）

#### 役割
店頭での即時ポイント付与とギフト交換

#### 実装必要機能

**4.1 ポイント付与フロー**
```typescript
// pages/terminal/point-award.tsx（新規作成）

フロー:
1. QRコード読み取り
   └─> ユーザーID取得

2. 購入金額入力
   └─> テンキー表示
        └─> 100円 = 1pt 自動計算

3. ポイント付与実行
   └─> POST /api/terminal/point/award
        {
          "user_id": "xxx",
          "purchase_amount": 3000,
          "points_awarded": 30,
          "store_id": "store_001"
        }

4. 完了画面
   └─> 付与ポイント表示
        └─> 現在の合計ポイント表示
             └─> レシート印刷オプション
```

**4.2 即時ギフト交換**
```typescript
// pages/terminal/gift-exchange.tsx（新規作成）

シナリオ:
「会計後、その場でギフト交換を提案」

フロー:
1. ポイント残高確認
   └─> GET /api/terminal/user/{user_id}/balance

2. 交換可能ギフト表示
   └─> ポイント範囲内のギフトのみ
        └─> 店員がタップして選択

3. 交換実行
   └─> POST /api/terminal/gift/exchange
        {
          "user_id": "xxx",
          "brand_code": "starbucks",
          "price": 500
        }

4. ギフトコード発行
   └─> レシート印刷
        ├─> ギフトコード
        ├─> QRコード
        ├─> 有効期限
        └─> 使い方
```

**4.3 レシート印刷**
```typescript
// components/terminal/ReceiptPrinter.tsx

印刷内容:
┌─────────────────────────┐
│   Melty+ ギフト交換     │
├─────────────────────────┤
│ 日時: 2025/11/01 14:30  │
│ ギフト: Amazon 1000円   │
│ 使用P: 1055pt           │
│                         │
│ ━━━━━━━━━━━━━━━━━━━━━ │
│   ギフトコード          │
│                         │
│ XXXX-XXXX-XXXX-XXXX     │
│                         │
│   [QRコード画像]        │
│                         │
│ ━━━━━━━━━━━━━━━━━━━━━ │
│ 有効期限: 2026/11/01    │
│                         │
│ ご利用方法:             │
│ 上記URLまたはQRコード   │
│ からアクセスしてください │
└─────────────────────────┘

実装:
- Thermal Printer API使用
- または PDF生成 → 印刷
```

---

## データフロー

### アーキテクチャ図

```
┌─────────────────────────────────────────────────────────────┐
│               RealPay Digital Gift API                       │
│              https://api.realpay.jp/v1                       │
│                                                               │
│  Endpoints:                                                   │
│  - GET  /gifts/brands          ブランド一覧                  │
│  - POST /gifts/purchase-id     購入ID作成                    │
│  - POST /gifts/purchase        ギフト購入                    │
│  - GET  /gifts/status/{id}     ステータス確認                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ TOTP認証
                 │ - X-RealPay-Gift-API-Access-Key
                 │ - X-RealPay-Gift-API-Access-Token
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│            Backend (Django REST Framework)                   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ digital_gift_client.py                               │   │
│  │  - DigitalGiftAPIClient                              │   │
│  │    ├─ get_brands()                                   │   │
│  │    ├─ create_purchase_id()                           │   │
│  │    ├─ purchase_gift()                                │   │
│  │    └─ get_gift_status()                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ partner_views.py                                     │   │
│  │  - DigitalGiftBrandListView                          │   │
│  │  - DigitalGiftPurchaseIDCreateView                   │   │
│  │  - DigitalGiftPurchaseView                           │   │
│  │  - PointToGiftExchangeView ⭐                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Models (PostgreSQL)                                  │   │
│  │  - DigitalGiftBrand                                  │   │
│  │  - DigitalGiftPurchaseID                             │   │
│  │  - DigitalGiftPurchase                               │   │
│  │  - DigitalGiftUsageLog                               │   │
│  │  - User (point_balance)                              │   │
│  └──────────────────────────────────────────────────────┘   │
└───┬─────────┬─────────┬─────────┬───────────────────────────┘
    │         │         │         │
    │         │         │         │
    ▼         ▼         ▼         ▼
┌─────┐  ┌─────┐  ┌─────┐  ┌──────────┐
│Admin│  │Store│  │User │  │Terminal  │
│ 画面 │  │ 画面 │  │ App │  │   画面   │
└─────┘  └─────┘  └─────┘  └──────────┘
  │         │         │         │
  │         │         │         │
  ▼         ▼         ▼         ▼
┌───────────────────────────────────────┐
│         Frontend (Next.js)             │
│                                        │
│ - ブランド管理                         │
│ - 統計レポート                         │
│ - キャンペーン設定                     │
│ - ギフト交換                           │
│ - 履歴表示                             │
│ - QRコード生成                         │
└───────────────────────────────────────┘
```

### シーケンス図：ユーザーがギフトを交換する場合

```
User App          Backend          RealPay API        Database
   │                 │                   │                │
   │  1. ブランド一覧要求                                 │
   ├────────────────>│                   │                │
   │                 │  2. DB取得        │                │
   │                 ├──────────────────────────────────>│
   │                 │<─────────────────────────────────┤
   │  3. ブランド一覧                                     │
   │<────────────────┤                   │                │
   │                 │                   │                │
   │  4. ギフト交換リクエスト                             │
   │  {brand: "amazon", price: 1000}                      │
   ├────────────────>│                   │                │
   │                 │  5. ポイント残高確認                │
   │                 ├──────────────────────────────────>│
   │                 │<─────────────────────────────────┤
   │                 │                   │                │
   │                 │  6. 購入ID作成    │                │
   │                 ├──────────────────>│                │
   │                 │<─────────────────┤                │
   │                 │  purchase_id      │                │
   │                 │                   │                │
   │                 │  7. ギフト購入    │                │
   │                 ├──────────────────>│                │
   │                 │<─────────────────┤                │
   │                 │  gift_code, url   │                │
   │                 │                   │                │
   │                 │  8. ポイント減算  │                │
   │                 ├──────────────────────────────────>│
   │                 │  9. 購入記録保存  │                │
   │                 ├──────────────────────────────────>│
   │                 │                   │                │
   │  10. ギフトコード                                    │
   │<────────────────┤                   │                │
   │  {gift_code, gift_url, qr_code}     │                │
   │                 │                   │                │
```

---

## コスト計算の仕組み

### 計算式

```python
# backend/core/models.py - DigitalGiftBrand.calculate_total_cost()

def calculate_total_cost(self, price: int) -> dict:
    """
    ギフト購入に必要な総コストを計算
    
    Args:
        price: ギフト額面（円）
    
    Returns:
        {
            'price': ギフト額面,
            'commission': 手数料,
            'commission_tax': 手数料消費税,
            'total': 合計（必要ポイント数）,
            'currency': 'JPY'
        }
    """
    commission = int(price * self.commission_rate / 100)
    commission_tax = int(commission * self.commission_tax_rate / 100)
    total = price + commission + commission_tax
    
    return {
        'price': price,
        'commission': commission,
        'commission_tax': commission_tax,
        'total': total,
        'currency': 'JPY'
    }
```

### 計算例

#### 例1: Amazon 1,000円ギフト券

```
ギフト額面:        1,000円
手数料 (5%):         50円
消費税 (10%):         5円
─────────────────────────
必要ポイント:     1,055pt
```

#### 例2: PayPay 5,000円ギフト

```
ギフト額面:        5,000円
手数料 (5%):        250円
消費税 (10%):        25円
─────────────────────────
必要ポイント:     5,275pt
```

#### 例3: スターバックス 500円

```
ギフト額面:          500円
手数料 (5%):         25円
消費税 (10%):         2円
─────────────────────────
必要ポイント:       527pt
```

### ブランドごとの手数料率

```python
# データベース設定例

DigitalGiftBrand.objects.create(
    code='amazon',
    name='Amazon',
    commission_rate=5.00,      # 5%
    commission_tax_rate=10.00  # 10%
)

DigitalGiftBrand.objects.create(
    code='paypay',
    name='PayPay',
    commission_rate=3.00,      # 3%（特別レート）
    commission_tax_rate=10.00  # 10%
)
```

---

## セキュリティ機能

### 1. 認証・認可

#### TOTP認証
```python
# backend/core/partner_auth.py

class PartnerAPIAuthMixin:
    def authenticate_request(self, request):
        # 1. API Access Key検証
        access_key_value = request.META.get('HTTP_X_REALPAY_GIFT_API_ACCESS_KEY')
        
        # 2. TOTP Token検証
        totp_token = request.META.get('HTTP_X_REALPAY_GIFT_API_ACCESS_TOKEN')
        
        # 3. TOTPトークン生成・比較
        totp = pyotp.TOTP(access_key.shared_secret, interval=30, digits=6)
        is_valid = totp.verify(totp_token, valid_window=1)  # ±30秒の誤差許容
```

**セキュリティポイント**:
- ✅ 30秒ごとにトークン更新
- ✅ ±30秒の時刻ずれ許容
- ✅ API Access Keyとの二要素認証
- ✅ リプレイ攻撃対策

---

### 2. リクエストID重複チェック

```python
# backend/core/digital_gift_client.py

def purchase_gift(self, purchase_id: str, request_id: str):
    # リクエストID重複チェック
    if DigitalGiftPurchase.objects.filter(request_id=request_id).exists():
        raise DigitalGiftAPIError(f"Request ID {request_id} already exists")
    
    # ギフト購入処理...
```

**目的**:
- ✅ 二重購入防止
- ✅ リトライ時の冪等性保証
- ✅ トランザクションの一意性確保

---

### 3. 使用ログ記録

```python
# backend/core/models.py - DigitalGiftUsageLog

class DigitalGiftUsageLog(models.Model):
    gift_purchase = models.ForeignKey(DigitalGiftPurchase)
    action = models.CharField(max_length=50)  # 'point_exchange', 'resend', 'view'
    user_id = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict)
```

**記録内容**:
- ✅ 全ての使用履歴（交換、再送信、閲覧）
- ✅ ユーザーID・タイムスタンプ
- ✅ 操作詳細（JSON形式）

**活用例**:
- 不正利用パターン検知
- 監査証跡
- サポート対応時の履歴確認

---

### 4. 有効期限管理

```python
def is_expired(self):
    """ギフトが期限切れかチェック"""
    return timezone.now() > self.expire_at

def can_be_used(self):
    """ギフトが使用可能かチェック"""
    return self.status == 'completed' and not self.is_expired()
```

**セキュリティポイント**:
- ✅ 購入ID: 30分有効
- ✅ ギフトコード: 1年有効
- ✅ 期限切れギフトの自動無効化
- ✅ クリーンアップバッチ処理

---

### 5. トランザクション管理

```python
# backend/core/partner_views.py

from django.db import transaction

@transaction.atomic
def post(self, request):
    # 1. ポイント消費
    point_service.consume_points(points=required_points, ...)
    
    # 2. デジタルギフト購入
    gift_response = client.purchase_gift(...)
    
    # 3. 購入記録保存
    # ← エラーが発生した場合、全てロールバック
```

**保証**:
- ✅ ACID特性
- ✅ ポイント消費とギフト発行の原子性
- ✅ エラー時の自動ロールバック

---

## 実装ロードマップ

### 🎯 Phase 1: 最優先（1-2週間）

#### 1.1 ユーザーアプリのギフト交換機能完成

**タスク**:
- [ ] ギフト詳細モーダル実装
- [ ] ポイント→ギフト交換フロー
- [ ] ギフトコード表示画面
- [ ] QRコード生成（qrcode.react）
- [ ] 交換履歴ページ

**API実装**:
```typescript
// 新規API
GET  /api/user/gift-history
POST /api/user/gift/resend
```

**優先理由**:
- エンドユーザー向け機能
- MVP（Minimum Viable Product）として必須
- 他機能の基盤となる

---

#### 1.2 決済端末のポイント付与

**タスク**:
- [ ] QRコードスキャナー連携
- [ ] ポイント付与画面
- [ ] テンキー入力UI
- [ ] レシート印刷機能（オプション）

**API実装**:
```typescript
POST /api/terminal/point/award
  {
    "user_id": "xxx",
    "purchase_amount": 3000,
    "points_awarded": 30,
    "store_id": "store_001",
    "transaction_id": "TXN-20251101-001"
  }
```

**優先理由**:
- 店頭での基本機能
- ポイント付与がないとギフト交換できない
- 決済端末の最小機能セット

---

### 🎯 Phase 2: 重要（2-3週間）

#### 2.1 店舗管理画面のキャンペーン機能

**タスク**:
- [ ] キャンペーン作成フォーム
- [ ] キャンペーン一覧・編集
- [ ] 条件設定（購入金額、対象ブランド）
- [ ] 有効期間設定
- [ ] 実績レポート

**データモデル**:
```python
class PointCampaign(models.Model):
    store = models.ForeignKey(Store)
    name = models.CharField(max_length=255)
    campaign_type = models.CharField(max_length=50)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    conditions = models.JSONField()
    is_active = models.BooleanField(default=True)
```

---

#### 2.2 運営管理画面の統計機能

**タスク**:
- [ ] ダッシュボード実装
- [ ] ブランド別交換統計
- [ ] 日次/月次レポート
- [ ] 手数料収益計算
- [ ] CSV/Excelエクスポート

**グラフライブラリ**:
```bash
npm install recharts
# または
npm install chart.js react-chartjs-2
```

---

### 🎯 Phase 3: 追加機能（3-4週間）

#### 3.1 通知機能

**タスク**:
- [ ] ギフト有効期限通知（メール/プッシュ）
- [ ] キャンペーン開始通知
- [ ] ポイント付与通知
- [ ] 交換完了通知

**実装**:
```python
# backend/core/utils/notification_service.py

class NotificationService:
    def send_gift_expiry_notice(self, gift_purchase):
        """ギフト有効期限通知"""
        days_until_expiry = (gift_purchase.expire_at - timezone.now()).days
        
        if days_until_expiry == 30:  # 30日前
            self.send_email(...)
        elif days_until_expiry == 7:  # 7日前
            self.send_push_notification(...)
```

---

#### 3.2 高度な分析

**タスク**:
- [ ] ユーザー行動分析（コホート分析）
- [ ] RFM分析（Recency, Frequency, Monetary）
- [ ] ブランド相関分析
- [ ] A/Bテスト機能

---

### 🎯 Phase 4: 最適化（4週間以降）

#### 4.1 パフォーマンス最適化

- [ ] Redis キャッシュ導入
- [ ] CDN設定（Cloudflare）
- [ ] 画像最適化
- [ ] API レスポンスタイム改善

#### 4.2 モバイルアプリ化

- [ ] React Native移行検討
- [ ] PWA対応強化
- [ ] オフライン機能

---

## 技術仕様

### 依存パッケージ

#### Backend（Python）
```txt
# backend/requirements.txt

Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.0

# デジタルギフトAPI連携
requests==2.31.0
pyotp==2.9.0           # TOTP認証

# その他
psycopg2-binary==2.9.9  # PostgreSQL
gunicorn==21.2.0
python-dotenv==1.0.0
```

#### Frontend（Node.js）
```json
// package.json

{
  "dependencies": {
    "next": "13.5.6",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "qrcode.react": "^3.1.0",        // QRコード生成
    "recharts": "^2.10.3",           // グラフ表示
    "lucide-react": "^0.292.0",      // アイコン
    "date-fns": "^2.30.0",           // 日付処理
    "swr": "^2.2.4"                  // データフェッチング
  }
}
```

---

### 環境変数

```bash
# backend/.env

# RealPay API設定
DIGITAL_GIFT_API_BASE_URL=https://api.realpay.jp/v1
DIGITAL_GIFT_API_TIMEOUT=30

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/pointapp

# Django
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=biid-user-api.fly.dev,localhost
```

---

### データベーススキーマ

```sql
-- DigitalGiftBrand
CREATE TABLE core_digitalgiftbrand (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    supported_prices JSONB DEFAULT '[]',
    min_price INTEGER DEFAULT 100,
    max_price INTEGER DEFAULT 50000,
    commission_rate DECIMAL(5,2) DEFAULT 5.00,
    commission_tax_rate DECIMAL(5,2) DEFAULT 10.00,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- DigitalGiftPurchase
CREATE TABLE core_digitalgiftpurchase (
    id SERIAL PRIMARY KEY,
    gift_code VARCHAR(100) UNIQUE NOT NULL,
    gift_url VARCHAR(200) NOT NULL,
    user_id INTEGER REFERENCES core_user(id),
    brand_id INTEGER REFERENCES core_digitalgiftbrand(id),
    price INTEGER NOT NULL,
    points_used INTEGER NOT NULL,
    commission INTEGER DEFAULT 0,
    commission_tax INTEGER DEFAULT 0,
    total_cost INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    expire_at TIMESTAMP NOT NULL,
    purchased_at TIMESTAMP DEFAULT NOW(),
    used_at TIMESTAMP,
    partner_request_id VARCHAR(40) NOT NULL,
    partner_response JSONB DEFAULT '{}'
);

CREATE INDEX idx_gift_purchase_user_status ON core_digitalgiftpurchase(user_id, status);
CREATE INDEX idx_gift_purchase_expire ON core_digitalgiftpurchase(status, expire_at);
```

---

### API仕様書

#### エンドポイント一覧

| Method | Endpoint | 説明 | 認証 |
|--------|----------|------|------|
| GET | `/api/partner/digital-gifts/brands` | ブランド一覧 | Partner API |
| POST | `/api/partner/digital-gifts/purchase-id` | 購入ID作成 | Partner API |
| POST | `/api/partner/digital-gifts/purchase` | ギフト購入 | Partner API |
| POST | `/api/partner/digital-gifts/exchange` | ポイント→ギフト交換 | Partner API |
| GET | `/api/user/gift-history` | 交換履歴 | JWT |
| POST | `/api/user/gift/resend` | ギフト再送信 | JWT |
| POST | `/api/terminal/point/award` | ポイント付与 | Terminal Auth |
| POST | `/api/terminal/gift/exchange` | 即時ギフト交換 | Terminal Auth |
| GET | `/api/admin/digital-gifts/statistics` | 統計データ | Admin JWT |
| POST | `/api/store/campaigns/create` | キャンペーン作成 | Store JWT |

---

#### リクエスト/レスポンス例

**POST /api/partner/digital-gifts/exchange**

```json
// Request
{
  "user_id": 123,
  "brand_code": "amazon",
  "price": 1000,
  "design_code": "default",
  "video_message": "",
  "advertising_text": ""
}

// Response
{
  "success": true,
  "gift": {
    "gift_id": 456,
    "gift_code": "AMZN-1234-5678-9012",
    "gift_url": "https://www.amazon.co.jp/gc/redeem/...",
    "pin_code": "1234",
    "expires_at": "2026-11-01T10:30:00Z",
    "brand_name": "Amazon",
    "price": 1000
  },
  "points_consumed": 1055,
  "remaining_points": 8945
}
```

---

## 参考資料

### プロジェクト内ファイル

- `backend/core/digital_gift_client.py` - RealPay API クライアント実装
- `backend/core/partner_views.py` - パートナーAPI ビュー
- `backend/core/models.py:2607-2760` - デジタルギフト関連モデル
- `backend/core/partner_serializers.py` - シリアライザー定義
- `pages/user/gifts.tsx` - ユーザーアプリのギフト画面

### 外部リンク

- RealPay API ドキュメント（要アクセス権）
- TOTP仕様: [RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238)
- QRコード生成: [qrcode.react](https://github.com/zpao/qrcode.react)

---

## 更新履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2025-11-01 | 1.0 | 初版作成 |

---

**作成者**: GitHub Copilot  
**レビュー**: 未実施  
**承認**: 未実施

## 📊 調査結果サマリー

### 重要な発見

1. **2つのギフトシステムが併存**
   - 既存システム: `/api/gifts/exchange/` (実装済み、ユーザーアプリで使用中)
   - RealPay連携: `/api/partner/digital-gifts/exchange/` (実装済みだが未使用)

2. **推奨アプローチ: ハイブリッド統合**
   - `Gift`モデルに`is_external_gift`フラグ追加
   - 既存エンドポイントを維持、内部で分岐処理
   - フロントエンド変更最小化

3. **実装優先順位**
   - Phase 1: モデル統合（1週間）
   - Phase 2: ユーザーアプリ改善（1-2週間）
   - Phase 3: 決済端末機能（2週間）
   - Phase 4: 管理画面機能（2-3週間）

---

## 次のアクション

### 今すぐ実施すべきこと

1. **システム統合の承認取得**
   - Option A（ハイブリッド）vs Option B（完全分離）の選択
   - データ移行計画の承認

2. **開発環境でテスト**
   ```bash
   # RealPay API テストキー取得
   python backend/setup_partner_api.py
   
   # マイグレーション実行（統合後）
   python backend/manage.py makemigrations
   python backend/manage.py migrate
   python backend/manage.py migrate_gifts_to_external
   ```

3. **ユーザーアプリの改善開始**
   - ギフト詳細モーダル実装
   - ギフトコード表示画面
   - 交換履歴ページ

---

**このレポートで質問がある場合は、GitHub Copilotに聞いてください。**
