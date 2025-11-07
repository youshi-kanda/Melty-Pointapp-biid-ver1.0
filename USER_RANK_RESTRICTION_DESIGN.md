# 📊 Melty+ ユーザーランク別機能制限設計書

**作成日**: 2025年11月7日  
**バージョン**: 1.0  
**目的**: ユーザーランク(Bronze/Silver/Gold/Platinum)に応じた機能制限の設計

---

## 🎯 概要

### ランク体系

| ランク | 取得条件 | 初回ボーナス | 特徴 |
|-------|---------|------------|------|
| **Bronze (ブロンズ)** | Melty+直接登録 | 500pt | 基本機能のみ |
| **Silver (シルバー)** | MELTY連携登録 or 累計獲得10,000pt | 1,000pt | 優遇機能あり |
| **Gold (ゴールド)** | 累計獲得50,000pt | - | 大幅な優遇 |
| **Platinum (プラチナ)** | 累計獲得100,000pt or VIP招待 | - | 全機能無制限 + VIP特典 |

---

## 📱 ユーザー機能一覧

### 🏠 1. 基本機能 (全ランク共通)

| 機能カテゴリ | 機能名 | 画面/API | 説明 | 制限 |
|-----------|--------|---------|------|------|
| **認証** | 新規登録 | `/user/register` | アカウント作成 | なし |
| | ログイン | `/user/login` | ログイン | なし |
| | ログアウト | - | ログアウト | なし |
| | プロフィール閲覧 | `/user/profile` | 自分の情報確認 | なし |
| | プロフィール編集 | `/user/profile/settings` | 個人情報変更 | なし |

---

### 💰 2. ポイント関連機能

| 機能名 | 画面/API | 現在の仕様 | ランク制限 |
|-------|---------|-----------|-----------|
| **ポイント残高確認** | `/user/points` | ポイント残高・履歴表示 | **制限なし** (全ランク) |
| **ポイント獲得履歴** | `/user/points` | 獲得・消費履歴一覧 | **制限なし** (全ランク) |
| **店舗来店ポイント獲得** | QRコード読取 | 来店時ポイント付与 | **還元率差別化**<br>Bronze: 1%<br>Silver: 3%<br>Gold: 5%<br>Platinum: 10% |
| **EC購入申請** | `/user/points/ec-request` | レシート申請でポイント獲得 | **月間回数制限**<br>Bronze: 月3回まで<br>Silver: 月10回まで<br>Gold/Platinum: 無制限 |
| **ポイント購入** | API: `/points/purchase/` | クレジットでポイント購入 | **月間上限額**<br>Bronze: 月10,000ptまで<br>Silver: 月50,000ptまで<br>Gold/Platinum: 無制限 |

---

### 🎁 3. ギフト交換機能

| 機能名 | 画面/API | 現在の仕様 | ランク制限 |
|-------|---------|-----------|-----------|
| **ギフト一覧閲覧** | `/user/gifts` | デジタルギフト・商品一覧 | **制限なし** (全ランク) |
| **ギフト検索・フィルタ** | `/user/gifts` | カテゴリ・価格帯で検索 | **制限なし** (全ランク) |
| **ギフト詳細閲覧** | API: `/gifts/{id}/` | ギフト詳細情報 | **制限なし** (全ランク) |
| **デジタルギフト交換** | API: `/gifts/exchange/` | Amazonギフト券・電子マネー等 | **月間ポイント上限**<br>Bronze: 月5,000ptまで<br>Silver: 月20,000ptまで<br>Gold: 月100,000ptまで<br>Platinum: 無制限 |
| **物理商品交換** | API: `/gifts/exchange/` | 配送が必要な商品 | **月間回数制限**<br>Bronze: 月2回まで<br>Silver: 月5回まで<br>Gold/Platinum: 無制限 |
| **高額ギフト(10,000pt以上)** | - | プレミアム商品 | **ランク制限**<br>Bronze: ❌ 利用不可<br>Silver以上: ✅ 利用可能 |
| **限定ギフト** | - | 数量限定・期間限定商品 | **ランク制限**<br>Bronze/Silver: ❌ 利用不可<br>Gold: 一部利用可能<br>Platinum: すべて利用可能 |
| **ギフト交換履歴** | API: `/gifts/exchange-history/` | 過去の交換履歴 | **制限なし** (全ランク) |

---

### 🗺️ 4. 店舗検索・お気に入り機能

| 機能名 | 画面/API | 現在の仕様 | ランク制限 |
|-------|---------|-----------|-----------|
| **店舗マップ検索** | `/user/map` | 地図で加盟店検索 | **制限なし** (全ランク) |
| **店舗詳細閲覧** | - | 店舗情報・レビュー表示 | **制限なし** (全ランク) |
| **店舗お気に入り登録** | `/user/favorites` | 店舗をお気に入り | **登録数制限**<br>Bronze: 10店舗まで<br>Silver: 50店舗まで<br>Gold/Platinum: 無制限 |
| **ギフトお気に入り登録** | `/user/favorites` | ギフトをお気に入り | **登録数制限**<br>Bronze: 10件まで<br>Silver: 50件まで<br>Gold/Platinum: 無制限 |

---

### 👥 5. ソーシャル機能

| 機能名 | 画面/API | 現在の仕様 | ランク制限 |
|-------|---------|-----------|-----------|
| **マイ投稿** | `/user/social` | 自分の投稿一覧 | **月間投稿数制限**<br>Bronze: 月10投稿まで<br>Silver: 月50投稿まで<br>Gold/Platinum: 無制限 |
| **フィード閲覧** | `/user/social` | 友達の投稿閲覧 | **制限なし** (全ランク) |
| **友達追加** | `/user/social` | 友達申請・承認 | **友達数上限**<br>Bronze: 50人まで<br>Silver: 200人まで<br>Gold: 500人まで<br>Platinum: 無制限 |
| **投稿へのいいね** | - | 投稿にいいね | **制限なし** (全ランク) |
| **投稿へのコメント** | - | 投稿にコメント | **制限なし** (全ランク) |
| **ユーザー検索** | `/user/social` | 他ユーザー検索 | **制限なし** (全ランク) |

---

### 🔐 6. セキュリティ・アカウント設定

| 機能名 | 画面/API | 現在の仕様 | ランク制限 |
|-------|---------|-----------|-----------|
| **パスワード変更** | `/user/security` | パスワード更新 | **制限なし** (全ランク) |
| **2段階認証設定** | API: `/auth/2fa/setup/` | TOTP設定 | **必須化**<br>Bronze/Silver: 任意<br>Gold/Platinum: 必須 |
| **通知設定** | `/user/profile/settings` | プッシュ通知管理 | **制限なし** (全ランク) |
| **メール設定** | `/user/profile/settings` | メルマガ購読管理 | **制限なし** (全ランク) |

---

### 🎯 7. 特典・ボーナス

| 機能名 | 現在の仕様 | ランク制限 |
|-------|-----------|-----------|
| **新規登録ボーナス** | アカウント作成時 | **ランク差別化**<br>Bronze (直接登録): 500pt<br>Silver (MELTY連携): 1,000pt |
| **誕生日ボーナス** | 年1回自動付与 | **ランク差別化**<br>Bronze: 500pt<br>Silver: 1,000pt<br>Gold: 2,000pt<br>Platinum: 5,000pt |
| **ログインボーナス** | 毎日ログイン時 | **ランク差別化**<br>Bronze: なし<br>Silver: 10pt/日<br>Gold: 30pt/日<br>Platinum: 100pt/日 |
| **キャンペーン優先案内** | メール・プッシュ通知 | **ランク制限**<br>Bronze: なし<br>Silver以上: あり |
| **新商品先行アクセス** | 新ギフト発売前通知 | **ランク制限**<br>Platinum限定 |

---

## 💎 ランク別 詳細仕様

### Bronze (ブロンズ) - 直接登録ユーザー

**取得条件:**
- Melty+で直接新規登録

**初回特典:**
- ウェルカムボーナス: 500pt

**利用可能機能:**
```
✅ 基本機能すべて利用可能
✅ ポイント獲得・確認
✅ ギフト交換(制限付き)
✅ 店舗検索・マップ
✅ ソーシャル機能(制限付き)
```

**制限内容:**
```
⚠️ EC購入申請: 月3回まで
⚠️ デジタルギフト交換: 月5,000ptまで
⚠️ 物理商品交換: 月2回まで
⚠️ お気に入り登録: 10件まで
⚠️ 友達登録: 50人まで
⚠️ ソーシャル投稿: 月10回まで
⚠️ ポイント購入: 月10,000ptまで
⚠️ 来店ポイント還元率: 1%
❌ 高額ギフト(10,000pt以上): 利用不可
❌ 限定ギフト: 利用不可
❌ ログインボーナス: なし
```

---

### Silver (シルバー) - MELTY連携 or 中級ユーザー

**取得条件:**
- MELTYアプリと連携登録 **または**
- 累計獲得ポイント 10,000pt 達成

**初回特典:**
- ウェルカムボーナス: 1,000pt (MELTY連携時)

**利用可能機能:**
```
✅ Bronze機能すべて
✅ 高額ギフト(10,000pt以上)
✅ ログインボーナス
✅ キャンペーン優先案内
```

**優遇内容:**
```
⭐ EC購入申請: 月10回まで (Bronze: 3回)
⭐ デジタルギフト交換: 月20,000ptまで (Bronze: 5,000pt)
⭐ 物理商品交換: 月5回まで (Bronze: 2回)
⭐ お気に入り登録: 50件まで (Bronze: 10件)
⭐ 友達登録: 200人まで (Bronze: 50人)
⭐ ソーシャル投稿: 月50回まで (Bronze: 10回)
⭐ ポイント購入: 月50,000ptまで (Bronze: 10,000pt)
⭐ 来店ポイント還元率: 3% (Bronze: 1%)
⭐ ログインボーナス: 10pt/日
⭐ 誕生日ボーナス: 1,000pt (Bronze: 500pt)
```

---

### Gold (ゴールド) - 上級ユーザー

**取得条件:**
- 累計獲得ポイント 50,000pt 達成

**初回特典:**
- なし (ランクアップ通知のみ)

**利用可能機能:**
```
✅ Silver機能すべて
✅ 限定ギフト一部アクセス
✅ 2段階認証必須
```

**優遇内容:**
```
⭐ EC購入申請: 無制限 (Silver: 10回)
⭐ デジタルギフト交換: 月100,000ptまで (Silver: 20,000pt)
⭐ 物理商品交換: 無制限 (Silver: 5回)
⭐ お気に入り登録: 無制限 (Silver: 50件)
⭐ 友達登録: 500人まで (Silver: 200人)
⭐ ソーシャル投稿: 無制限 (Silver: 50回)
⭐ ポイント購入: 無制限 (Silver: 50,000pt)
⭐ 来店ポイント還元率: 5% (Silver: 3%)
⭐ ログインボーナス: 30pt/日 (Silver: 10pt/日)
⭐ 誕生日ボーナス: 2,000pt (Silver: 1,000pt)
⭐ 限定ギフト: 一部利用可能
```

---

### Platinum (プラチナ) - VIPユーザー

**取得条件:**
- 累計獲得ポイント 100,000pt 達成 **または**
- 運営からのVIP招待

**初回特典:**
- なし (VIP専用特典あり)

**利用可能機能:**
```
✅ すべての機能無制限
✅ 限定ギフトすべてアクセス
✅ プレミアムサポート
✅ 新商品先行アクセス
```

**VIP特典:**
```
⭐ すべての機能無制限
⭐ デジタルギフト交換: 無制限
⭐ 来店ポイント還元率: 10% (Gold: 5%)
⭐ ログインボーナス: 100pt/日 (Gold: 30pt/日)
⭐ 誕生日ボーナス: 5,000pt (Gold: 2,000pt)
⭐ 限定ギフト: すべて利用可能
⭐ 専用カスタマーサポート
⭐ 新商品先行アクセス
⭐ 特別イベント招待
⭐ 2段階認証必須
```

---

## 🔧 実装要件

### 1. データベース変更

#### User モデルに追加するフィールド

```python
# backend/core/models.py

class User(AbstractUser):
    # 既存フィールド...
    rank = models.CharField(max_length=20, choices=RANK_CHOICES, default='bronze')
    
    # ランク別制限カウンター (月次リセット)
    ec_requests_count_this_month = models.IntegerField(
        default=0,
        verbose_name="今月のEC購入申請回数"
    )
    gift_exchanges_count_this_month = models.IntegerField(
        default=0,
        verbose_name="今月のギフト交換回数"
    )
    digital_gift_points_this_month = models.IntegerField(
        default=0,
        verbose_name="今月のデジタルギフト交換ポイント"
    )
    social_posts_count_this_month = models.IntegerField(
        default=0,
        verbose_name="今月のソーシャル投稿回数"
    )
    point_purchase_amount_this_month = models.IntegerField(
        default=0,
        verbose_name="今月のポイント購入額"
    )
    
    # 累計カウンター
    favorite_stores_count = models.IntegerField(
        default=0,
        verbose_name="お気に入り店舗数"
    )
    favorite_gifts_count = models.IntegerField(
        default=0,
        verbose_name="お気に入りギフト数"
    )
    friends_count = models.IntegerField(
        default=0,
        verbose_name="友達数"
    )
    
    # カウンターリセット日時
    monthly_counters_reset_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="月次カウンターリセット日時"
    )
```

#### マイグレーション作成

```bash
cd backend
python manage.py makemigrations core -n add_rank_restriction_counters
python manage.py migrate
```

---

### 2. ランク制限チェック機能

#### ユーティリティ関数

```python
# backend/core/rank_restrictions.py

from rest_framework.exceptions import PermissionDenied
from datetime import datetime
from django.utils import timezone

class RankRestrictions:
    """ランク別制限チェック"""
    
    # EC購入申請の月間回数制限
    EC_REQUEST_LIMITS = {
        'bronze': 3,
        'silver': 10,
        'gold': None,  # 無制限
        'platinum': None
    }
    
    # デジタルギフト交換の月間ポイント上限
    DIGITAL_GIFT_LIMITS = {
        'bronze': 5000,
        'silver': 20000,
        'gold': 100000,
        'platinum': None  # 無制限
    }
    
    # 物理商品交換の月間回数制限
    PHYSICAL_GIFT_LIMITS = {
        'bronze': 2,
        'silver': 5,
        'gold': None,
        'platinum': None
    }
    
    # お気に入り登録数上限
    FAVORITE_LIMITS = {
        'bronze': 10,
        'silver': 50,
        'gold': None,
        'platinum': None
    }
    
    # 友達数上限
    FRIEND_LIMITS = {
        'bronze': 50,
        'silver': 200,
        'gold': 500,
        'platinum': None
    }
    
    # ソーシャル投稿の月間回数制限
    SOCIAL_POST_LIMITS = {
        'bronze': 10,
        'silver': 50,
        'gold': None,
        'platinum': None
    }
    
    # ポイント購入の月間上限
    POINT_PURCHASE_LIMITS = {
        'bronze': 10000,
        'silver': 50000,
        'gold': None,
        'platinum': None
    }
    
    # 来店ポイント還元率
    VISIT_POINT_RATES = {
        'bronze': 0.01,  # 1%
        'silver': 0.03,  # 3%
        'gold': 0.05,    # 5%
        'platinum': 0.10 # 10%
    }
    
    @classmethod
    def check_ec_request_limit(cls, user):
        """EC購入申請の制限チェック"""
        cls._reset_monthly_counters_if_needed(user)
        
        limit = cls.EC_REQUEST_LIMITS.get(user.rank)
        if limit is None:
            return True  # 無制限
        
        if user.ec_requests_count_this_month >= limit:
            raise PermissionDenied(
                f"EC購入申請は月{limit}回までです。"
                f"Silverランク以上にアップグレードすると制限が緩和されます。"
            )
        return True
    
    @classmethod
    def check_digital_gift_limit(cls, user, points_to_exchange):
        """デジタルギフト交換の制限チェック"""
        cls._reset_monthly_counters_if_needed(user)
        
        limit = cls.DIGITAL_GIFT_LIMITS.get(user.rank)
        if limit is None:
            return True  # 無制限
        
        new_total = user.digital_gift_points_this_month + points_to_exchange
        if new_total > limit:
            raise PermissionDenied(
                f"デジタルギフト交換は月{limit:,}ptまでです。"
                f"今月の残り: {limit - user.digital_gift_points_this_month:,}pt"
            )
        return True
    
    @classmethod
    def check_physical_gift_limit(cls, user):
        """物理商品交換の制限チェック"""
        cls._reset_monthly_counters_if_needed(user)
        
        limit = cls.PHYSICAL_GIFT_LIMITS.get(user.rank)
        if limit is None:
            return True  # 無制限
        
        if user.gift_exchanges_count_this_month >= limit:
            raise PermissionDenied(
                f"物理商品交換は月{limit}回までです。"
                f"Silverランク以上にアップグレードすると制限が緩和されます。"
            )
        return True
    
    @classmethod
    def check_high_value_gift_access(cls, user, gift_points):
        """高額ギフトアクセス権限チェック"""
        if gift_points >= 10000 and user.rank == 'bronze':
            raise PermissionDenied(
                "10,000pt以上の高額ギフトはSilverランク以上で交換できます。"
            )
        return True
    
    @classmethod
    def check_favorite_limit(cls, user):
        """お気に入り登録数制限チェック"""
        limit = cls.FAVORITE_LIMITS.get(user.rank)
        if limit is None:
            return True  # 無制限
        
        total_favorites = user.favorite_stores_count + user.favorite_gifts_count
        if total_favorites >= limit:
            raise PermissionDenied(
                f"お気に入り登録は{limit}件までです。"
            )
        return True
    
    @classmethod
    def check_friend_limit(cls, user):
        """友達数制限チェック"""
        limit = cls.FRIEND_LIMITS.get(user.rank)
        if limit is None:
            return True  # 無制限
        
        if user.friends_count >= limit:
            raise PermissionDenied(
                f"友達登録は{limit}人までです。"
                f"ランクアップすると制限が緩和されます。"
            )
        return True
    
    @classmethod
    def check_social_post_limit(cls, user):
        """ソーシャル投稿制限チェック"""
        cls._reset_monthly_counters_if_needed(user)
        
        limit = cls.SOCIAL_POST_LIMITS.get(user.rank)
        if limit is None:
            return True  # 無制限
        
        if user.social_posts_count_this_month >= limit:
            raise PermissionDenied(
                f"ソーシャル投稿は月{limit}回までです。"
            )
        return True
    
    @classmethod
    def check_point_purchase_limit(cls, user, points_to_purchase):
        """ポイント購入制限チェック"""
        cls._reset_monthly_counters_if_needed(user)
        
        limit = cls.POINT_PURCHASE_LIMITS.get(user.rank)
        if limit is None:
            return True  # 無制限
        
        new_total = user.point_purchase_amount_this_month + points_to_purchase
        if new_total > limit:
            raise PermissionDenied(
                f"ポイント購入は月{limit:,}ptまでです。"
                f"今月の残り: {limit - user.point_purchase_amount_this_month:,}pt"
            )
        return True
    
    @classmethod
    def get_visit_point_rate(cls, user):
        """来店ポイント還元率取得"""
        return cls.VISIT_POINT_RATES.get(user.rank, 0.01)
    
    @classmethod
    def _reset_monthly_counters_if_needed(cls, user):
        """月次カウンターのリセットチェック"""
        now = timezone.now()
        
        # 初回 or 月が変わった場合
        if (user.monthly_counters_reset_at is None or 
            user.monthly_counters_reset_at.month != now.month):
            
            user.ec_requests_count_this_month = 0
            user.gift_exchanges_count_this_month = 0
            user.digital_gift_points_this_month = 0
            user.social_posts_count_this_month = 0
            user.point_purchase_amount_this_month = 0
            user.monthly_counters_reset_at = now
            user.save(update_fields=[
                'ec_requests_count_this_month',
                'gift_exchanges_count_this_month',
                'digital_gift_points_this_month',
                'social_posts_count_this_month',
                'point_purchase_amount_this_month',
                'monthly_counters_reset_at'
            ])
    
    @classmethod
    def get_user_limits_info(cls, user):
        """ユーザーの制限情報を取得"""
        cls._reset_monthly_counters_if_needed(user)
        
        return {
            'rank': user.rank,
            'ec_requests': {
                'limit': cls.EC_REQUEST_LIMITS.get(user.rank),
                'used': user.ec_requests_count_this_month,
                'remaining': (cls.EC_REQUEST_LIMITS.get(user.rank) - user.ec_requests_count_this_month) 
                            if cls.EC_REQUEST_LIMITS.get(user.rank) else None
            },
            'digital_gifts': {
                'limit': cls.DIGITAL_GIFT_LIMITS.get(user.rank),
                'used': user.digital_gift_points_this_month,
                'remaining': (cls.DIGITAL_GIFT_LIMITS.get(user.rank) - user.digital_gift_points_this_month)
                            if cls.DIGITAL_GIFT_LIMITS.get(user.rank) else None
            },
            'physical_gifts': {
                'limit': cls.PHYSICAL_GIFT_LIMITS.get(user.rank),
                'used': user.gift_exchanges_count_this_month,
                'remaining': (cls.PHYSICAL_GIFT_LIMITS.get(user.rank) - user.gift_exchanges_count_this_month)
                            if cls.PHYSICAL_GIFT_LIMITS.get(user.rank) else None
            },
            'favorites': {
                'limit': cls.FAVORITE_LIMITS.get(user.rank),
                'used': user.favorite_stores_count + user.favorite_gifts_count
            },
            'friends': {
                'limit': cls.FRIEND_LIMITS.get(user.rank),
                'used': user.friends_count
            },
            'social_posts': {
                'limit': cls.SOCIAL_POST_LIMITS.get(user.rank),
                'used': user.social_posts_count_this_month,
                'remaining': (cls.SOCIAL_POST_LIMITS.get(user.rank) - user.social_posts_count_this_month)
                            if cls.SOCIAL_POST_LIMITS.get(user.rank) else None
            },
            'point_purchase': {
                'limit': cls.POINT_PURCHASE_LIMITS.get(user.rank),
                'used': user.point_purchase_amount_this_month,
                'remaining': (cls.POINT_PURCHASE_LIMITS.get(user.rank) - user.point_purchase_amount_this_month)
                            if cls.POINT_PURCHASE_LIMITS.get(user.rank) else None
            },
            'visit_point_rate': cls.VISIT_POINT_RATES.get(user.rank)
        }
```

---

### 3. API実装例

#### EC購入申請API

```python
# backend/core/ec_point_views.py

from .rank_restrictions import RankRestrictions

class ECReceiptUploadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        
        # ランク制限チェック
        try:
            RankRestrictions.check_ec_request_limit(user)
        except PermissionDenied as e:
            return Response({
                'success': False,
                'error': str(e),
                'rank': user.rank,
                'upgrade_message': 'Silverランクにアップグレードすると月10回まで申請できます'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # EC申請処理...
        
        # カウンター増加
        user.ec_requests_count_this_month += 1
        user.save(update_fields=['ec_requests_count_this_month'])
        
        return Response({'success': True})
```

#### ギフト交換API

```python
# backend/core/views.py

class GiftExchangeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        gift_id = request.data.get('gift_id')
        
        try:
            gift = Gift.objects.get(id=gift_id)
        except Gift.DoesNotExist:
            return Response({'error': 'ギフトが見つかりません'}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        # 高額ギフトアクセス権限チェック
        try:
            RankRestrictions.check_high_value_gift_access(user, gift.points_required)
        except PermissionDenied as e:
            return Response({
                'error': str(e),
                'required_rank': 'silver'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # ギフトタイプ別の制限チェック
        if gift.gift_type == 'digital':
            try:
                RankRestrictions.check_digital_gift_limit(user, gift.points_required)
            except PermissionDenied as e:
                return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
        elif gift.gift_type == 'physical':
            try:
                RankRestrictions.check_physical_gift_limit(user)
            except PermissionDenied as e:
                return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)
        
        # ギフト交換処理...
        
        # カウンター更新
        if gift.gift_type == 'digital':
            user.digital_gift_points_this_month += gift.points_required
        if gift.gift_type == 'physical':
            user.gift_exchanges_count_this_month += 1
        user.save()
        
        return Response({'success': True})
```

#### ユーザー制限情報取得API

```python
# backend/core/views.py

class UserLimitsView(APIView):
    """ユーザーのランク別制限情報を取得"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        limits_info = RankRestrictions.get_user_limits_info(user)
        
        return Response({
            'success': True,
            'limits': limits_info
        })
```

---

### 4. フロントエンド実装例

#### ランク別制限表示コンポーネント

```tsx
// components/user/RankRestrictionBanner.tsx

interface RankRestrictionBannerProps {
  userRank: 'bronze' | 'silver' | 'gold' | 'platinum'
  feature: string
  currentUsage: number
  limit: number | null
  upgradeMessage?: string
}

export function RankRestrictionBanner({
  userRank,
  feature,
  currentUsage,
  limit,
  upgradeMessage
}: RankRestrictionBannerProps) {
  if (limit === null) {
    // 無制限の場合は表示しない
    return null
  }
  
  const percentage = (currentUsage / limit) * 100
  const isNearLimit = percentage >= 80
  const isAtLimit = currentUsage >= limit
  
  return (
    <div className={`rounded-lg p-3 mb-4 ${
      isAtLimit ? 'bg-red-50 border border-red-200' :
      isNearLimit ? 'bg-yellow-50 border border-yellow-200' :
      'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${
            isAtLimit ? 'text-red-800' :
            isNearLimit ? 'text-yellow-800' :
            'text-blue-800'
          }`}>
            {feature}の利用状況
          </p>
          <p className={`text-xs mt-1 ${
            isAtLimit ? 'text-red-600' :
            isNearLimit ? 'text-yellow-600' :
            'text-blue-600'
          }`}>
            {currentUsage} / {limit} 回
          </p>
          
          {/* プログレスバー */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                isAtLimit ? 'bg-red-500' :
                isNearLimit ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          
          {isAtLimit && upgradeMessage && (
            <p className="text-xs text-red-600 mt-2">
              💎 {upgradeMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
```

#### EC申請ページでの使用例

```tsx
// pages/user/points/ec-request.tsx

export default function ECRequestPage() {
  const [limits, setLimits] = useState(null)
  
  useEffect(() => {
    // ユーザーの制限情報を取得
    fetch(`${getApiUrl()}/user/limits/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => setLimits(data.limits))
  }, [])
  
  return (
    <UserLayout>
      <div className="p-4">
        <h1>EC購入ポイント申請</h1>
        
        {limits && (
          <RankRestrictionBanner
            userRank={limits.rank}
            feature="EC購入申請"
            currentUsage={limits.ec_requests.used}
            limit={limits.ec_requests.limit}
            upgradeMessage="Silverランクにアップグレードすると月10回まで申請できます"
          />
        )}
        
        {/* 申請フォーム */}
      </div>
    </UserLayout>
  )
}
```

---

## 📊 管理画面での確認

### ランク別統計ダッシュボード

管理画面で各ランクのユーザー数や利用状況を確認できるようにする:

```python
# backend/core/admin.py

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = [
        'username', 'email', 'rank', 'point_balance',
        'ec_requests_count_this_month', 'total_earned_points'
    ]
    list_filter = ['rank', 'registration_source']
    search_fields = ['username', 'email', 'member_id']
    
    fieldsets = (
        ('基本情報', {
            'fields': ('username', 'email', 'first_name', 'last_name', 'rank')
        }),
        ('ポイント情報', {
            'fields': ('point_balance', 'total_earned_points', 'total_used_points')
        }),
        ('月次制限カウンター', {
            'fields': (
                'ec_requests_count_this_month',
                'gift_exchanges_count_this_month',
                'digital_gift_points_this_month',
                'social_posts_count_this_month',
                'monthly_counters_reset_at'
            )
        }),
        ('累計カウンター', {
            'fields': ('favorite_stores_count', 'favorite_gifts_count', 'friends_count')
        }),
    )
```

---

## 🎯 テスト計画

### 単体テスト

```python
# backend/core/tests/test_rank_restrictions.py

from django.test import TestCase
from core.models import User
from core.rank_restrictions import RankRestrictions
from rest_framework.exceptions import PermissionDenied

class RankRestrictionsTestCase(TestCase):
    
    def setUp(self):
        self.bronze_user = User.objects.create_user(
            username='bronze_user',
            email='bronze@test.com',
            rank='bronze'
        )
        self.silver_user = User.objects.create_user(
            username='silver_user',
            email='silver@test.com',
            rank='silver'
        )
    
    def test_bronze_ec_request_limit(self):
        """Bronzeユーザーは月3回までEC申請可能"""
        user = self.bronze_user
        
        # 3回まではOK
        for i in range(3):
            RankRestrictions.check_ec_request_limit(user)
            user.ec_requests_count_this_month += 1
            user.save()
        
        # 4回目はエラー
        with self.assertRaises(PermissionDenied):
            RankRestrictions.check_ec_request_limit(user)
    
    def test_silver_ec_request_limit(self):
        """SilverユーザーはEC申請が10回まで可能"""
        user = self.silver_user
        
        # 10回まではOK
        for i in range(10):
            RankRestrictions.check_ec_request_limit(user)
            user.ec_requests_count_this_month += 1
            user.save()
        
        # 11回目はエラー
        with self.assertRaises(PermissionDenied):
            RankRestrictions.check_ec_request_limit(user)
    
    def test_high_value_gift_restriction(self):
        """Bronzeユーザーは10,000pt以上のギフト交換不可"""
        bronze_user = self.bronze_user
        silver_user = self.silver_user
        
        # Bronzeはエラー
        with self.assertRaises(PermissionDenied):
            RankRestrictions.check_high_value_gift_access(bronze_user, 10000)
        
        # Silverは OK
        RankRestrictions.check_high_value_gift_access(silver_user, 10000)
```

---

## 📝 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|----------|---------|--------|
| 2025-11-07 | 1.0 | 初版作成 | Melty+開発チーム |

---

## 🚀 今後の拡張案

1. **ダイナミックランクアップ通知**
   - 累計ポイントが閾値到達時に自動ランクアップ + 通知

2. **期間限定ランクボーナス**
   - キャンペーン期間中のランク別特典

3. **ランクダウン機能**
   - 長期間未利用でランクダウン (オプション)

4. **カスタムランク**
   - 企業向け特別ランクの追加

5. **ランク別UI/UX**
   - ランクごとに画面デザイン・カラーテーマを変更
