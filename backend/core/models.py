from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.db.models import Sum
from django.core.validators import MinValueValidator, MaxValueValidator, EmailValidator


class ServiceArea(models.Model):
    """サービス提供エリアのマスタ"""
    area_code = models.CharField(max_length=20, unique=True, help_text="エリアコード（例: minami, kitashinchi）")
    area_name = models.CharField(max_length=100, help_text="エリア名（日本語）")
    area_name_en = models.CharField(max_length=100, blank=True, help_text="エリア名（英語）")
    
    # 境界座標（矩形で定義）
    boundary_north = models.DecimalField(max_digits=10, decimal_places=7, help_text="北端の緯度")
    boundary_south = models.DecimalField(max_digits=10, decimal_places=7, help_text="南端の緯度")
    boundary_east = models.DecimalField(max_digits=10, decimal_places=7, help_text="東端の経度")
    boundary_west = models.DecimalField(max_digits=10, decimal_places=7, help_text="西端の経度")
    
    # 中心座標（地図表示用）
    center_latitude = models.DecimalField(max_digits=10, decimal_places=7, help_text="中心の緯度")
    center_longitude = models.DecimalField(max_digits=10, decimal_places=7, help_text="中心の経度")
    
    # ステータス
    is_active = models.BooleanField(default=True, help_text="このエリアが有効かどうか")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'service_areas'
        verbose_name = 'サービスエリア'
        verbose_name_plural = 'サービスエリア'
        ordering = ['area_code']
    
    def __str__(self):
        return f"{self.area_name} ({self.area_code})"
    
    def contains_point(self, latitude, longitude):
        """指定された座標がこのエリア内にあるかチェック"""
        return (
            self.boundary_south <= latitude <= self.boundary_north and
            self.boundary_west <= longitude <= self.boundary_east
        )


class UserRank(models.Model):
    """会員ランクマスタ"""
    name = models.CharField(max_length=50, unique=True, help_text="ランク名 (例: Bronze, Silver)")
    required_points = models.IntegerField(default=0, help_text="昇格に必要な累計ポイント")
    
    # 制限設定 (null=True は無制限)
    ec_request_monthly_limit = models.IntegerField(null=True, blank=True, help_text="月間のEC申請回数上限 (null=無制限)")
    digital_gift_monthly_limit = models.IntegerField(null=True, blank=True, help_text="月間のデジタルギフト交換ポイント上限 (null=無制限)")
    physical_gift_monthly_limit = models.IntegerField(null=True, blank=True, help_text="月間の物理商品交換回数上限 (null=無制限)")
    favorite_limit = models.IntegerField(null=True, blank=True, help_text="お気に入り登録数上限 (null=無制限)")
    friend_limit = models.IntegerField(null=True, blank=True, help_text="友達登録数上限 (null=無制限)")
    social_post_monthly_limit = models.IntegerField(null=True, blank=True, help_text="月間のソーシャル投稿回数上限 (null=無制限)")
    point_purchase_monthly_limit = models.IntegerField(null=True, blank=True, help_text="月間のポイント購入額上限 (null=無制限)")
    
    # 還元率・ボーナス設定
    visit_point_rate = models.FloatField(default=0.01, help_text="来店ポイント還元率 (0.01=1%)")
    login_bonus_points = models.IntegerField(default=0, help_text="ログインボーナス (pt/日)")
    birthday_bonus_points = models.IntegerField(default=0, help_text="誕生日ボーナス (pt)")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_ranks'
        verbose_name = '会員ランク'
        verbose_name_plural = '会員ランク'
        ordering = ['required_points']

    def __str__(self):
        return f"{self.name} ({self.required_points}pt~)"


class User(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('store_manager', 'Store Manager'),
        ('admin', 'Admin'),
        ('terminal', 'Terminal'),
    ]
    
    member_id = models.CharField(max_length=50, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    registration_date = models.DateTimeField(auto_now_add=True)
    last_login_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[('active', 'Active'), ('inactive', 'Inactive')],
        default='active'
    )
    location = models.CharField(max_length=255, blank=True)
    avatar = models.URLField(blank=True)
    
    # 店舗管理者用
    store = models.ForeignKey('Store', on_delete=models.CASCADE, null=True, blank=True, related_name='managers')
    
    # 2FA設定
    is_2fa_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=32, blank=True)
    backup_codes = models.JSONField(default=list, blank=True)
    
    # Rank System
    rank = models.ForeignKey(
        'UserRank', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='users',
        help_text="現在の会員ランク"
    )
    
    # Rank Counters (Monthly)
    ec_requests_count_this_month = models.IntegerField(default=0, verbose_name="今月のEC購入申請回数")
    gift_exchanges_count_this_month = models.IntegerField(default=0, verbose_name="今月の物理ギフト交換回数")
    digital_gift_points_this_month = models.IntegerField(default=0, verbose_name="今月のデジタルギフト交換ポイント")
    social_posts_count_this_month = models.IntegerField(default=0, verbose_name="今月のソーシャル投稿回数")
    point_purchase_amount_this_month = models.IntegerField(default=0, verbose_name="今月のポイント購入額")
    
    # Rank Counters (Cumulative)
    favorite_stores_count = models.IntegerField(default=0, verbose_name="お気に入り店舗数")
    favorite_gifts_count = models.IntegerField(default=0, verbose_name="お気に入りギフト数")
    friends_count = models.IntegerField(default=0, verbose_name="友達数")
    
    monthly_counters_reset_at = models.DateTimeField(null=True, blank=True, verbose_name="月次カウンターリセット日時")

    # 2FA Fields
    email_verification_code = models.CharField(max_length=6, blank=True, help_text="Email 2FA Verification Code")
    email_verification_expiry = models.DateTimeField(null=True, blank=True, help_text="Email 2FA Code Expiry")

    # Email 2FA (Legacy fields integrated)
    is_2fa_enabled = models.BooleanField(default=False, help_text="Is Two-Factor Authentication enabled")
    two_factor_secret = models.CharField(max_length=32, blank=True, help_text="TOTP Secret (Legacy/Future Use)")

    # セキュリティ強化フィールド
    failed_login_attempts = models.IntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
    last_failed_login = models.DateTimeField(null=True, blank=True)
    suspicious_activity_count = models.IntegerField(default=0)
    
    # Remove legacy rank field

    
    # ソーシャル機能拡張
    display_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    
    def get_notification_preferences(self):
        from .social_models import NotificationPreference
        return NotificationPreference.objects.filter(user=self).first()
    
    def get_privacy_settings(self):
        from .social_models import UserPrivacySettings
        return UserPrivacySettings.objects.filter(user=self).first()
    
    def is_blocked_by(self, user):
        """指定されたユーザーにブロックされているかチェック"""
        from .social_models import BlockedUser
        return BlockedUser.objects.filter(blocker=user, blocked=self, is_active=True).exists()
    
    def has_blocked(self, user):
        """指定されたユーザーをブロックしているかチェック"""
        from .social_models import BlockedUser
        return BlockedUser.objects.filter(blocker=self, blocked=user, is_active=True).exists()
    
    # meltyアカウント連携機能
    melty_user_id = models.CharField(max_length=100, blank=True, null=True, unique=True)
    melty_email = models.EmailField(blank=True, null=True)
    melty_connected_at = models.DateTimeField(null=True, blank=True)
    is_melty_linked = models.BooleanField(default=False)
    melty_profile_data = models.JSONField(default=dict, blank=True)
    
    # 登録ソース追跡
    REGISTRATION_SOURCE_CHOICES = [
        ('direct', 'Direct biid registration'),
        ('melty', 'Melty app referral'),
        ('social', 'Social media'),
        ('store', 'Store referral'),
    ]
    registration_source = models.CharField(max_length=20, choices=REGISTRATION_SOURCE_CHOICES, default='direct')
    
    # socialスキン機能
    SOCIAL_SKIN_CHOICES = [
        ('classic', 'Classic'),
        ('modern', 'Modern'),
        ('casual', 'Casual'),
    ]
    selected_social_skin = models.CharField(
        max_length=20, 
        choices=SOCIAL_SKIN_CHOICES, 
        blank=True, 
        null=True,
        help_text="User's selected social profile theme"
    )
    unlocked_social_skins = models.JSONField(
        default=list,
        help_text="List of unlocked social skins for the user"
    )
    
    # ソーシャルプロフィール情報
    bio = models.TextField(
        max_length=500,
        blank=True,
        help_text="User's self-introduction"
    )
    birth_date = models.DateField(
        null=True,
        blank=True,
        help_text="User's birth date"
    )
    gender = models.CharField(
        max_length=10,
        choices=[('male', '男性'), ('female', '女性'), ('other', 'その他'), ('private', '非公開')],
        default='private',
        help_text="User's gender"
    )
    website = models.URLField(
        blank=True,
        help_text="User's personal website or blog"
    )
    
    # ソーシャル統計情報
    friends_count = models.IntegerField(
        default=0,
        help_text="Number of friends this user has"
    )
    posts_count = models.IntegerField(
        default=0,
        help_text="Number of social posts by this user"
    )
    reviews_count = models.IntegerField(
        default=0,
        help_text="Number of reviews posted by this user"
    )
    
    # プライバシー・表示設定
    profile_visibility = models.CharField(
        max_length=20,
        choices=[
            ('private', '非公開'),
            ('friends', 'フレンドのみ'),
            ('limited', '制限公開'),
            ('public', '完全公開')
        ],
        default='private',
        help_text="Overall profile visibility setting"
    )
    show_online_status = models.BooleanField(
        default=False,
        help_text="Show online/offline status to friends"
    )
    last_active_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Last time user was active on social features"
    )
    
    # 決済・レシート配信設定
    receipt_email = models.EmailField(
        blank=True, 
        null=True,
        help_text="Email address for receipt delivery (can be different from login email)"
    )
    receipt_delivery_preference = models.CharField(
        max_length=20,
        choices=[
            ('email_only', 'Email Only'),
            ('app_only', 'App Only'),
            ('both', 'Email + App'),
            ('none', 'No Receipt')
        ],
        default='email_only'
    )
    auto_receipt_email = models.BooleanField(
        default=True,
        help_text="Automatically send receipt emails after payment"
    )
    
    # 決済履歴設定
    payment_history_retention_days = models.IntegerField(
        default=365,
        help_text="Days to retain payment history in app"
    )
    preferred_payment_method = models.CharField(
        max_length=20,
        choices=[
            ('qr', 'QR Code'),
            ('nfc', 'NFC'),
            ('manual', 'Manual Entry')
        ],
        blank=True,
        null=True
    )
    unlocked_social_skins = models.JSONField(
        default=list,
        help_text="List of unlocked social skin themes"
    )
    
    # ========================================
    # 新規登録フォーム10項目対応 (2025-10-29追加)
    # MELTY_ACCOUNT_INTEGRATION_SPEC.md準拠
    # ========================================
    phone = models.CharField(
        max_length=20,
        unique=True,
        null=True,  # 既存ユーザーのため一時的にnull許可
        blank=True,
        help_text='電話番号 (090-1234-5678形式)'
    )
    phone_verified = models.BooleanField(
        default=False,
        help_text='SMS認証済みフラグ'
    )
    
    work_region = models.CharField(
        max_length=100,
        blank=True,
        help_text='勤務地域 (47都道府県)'
    )
    
    industry = models.CharField(
        max_length=200,
        blank=True,
        help_text='業種 (11選択肢)'
    )
    
    employment_type = models.CharField(
        max_length=50,
        choices=[('専業', '専業'), ('副業', '副業')],
        blank=True,
        help_text='働き方'
    )
    
    # ========================================
    # Melty連携拡張 (双方向同期対応)
    # ========================================
    melty_sync_enabled = models.BooleanField(
        default=False,
        help_text='Meltyアプリとの双方向同期有効フラグ'
    )
    # melty_linked_at は新規追加 (既存のmelty_connected_atと併用)
    # 将来的にmelty_connected_atは非推奨とし、melty_linked_atに統一予定
    # melty_user_id, melty_email, is_melty_linked は既存フィールド利用
    
    # birth_date → birthday エイリアス (フロントエンド互換性)
    @property
    def birthday(self):
        """birth_dateのエイリアス"""
        return self.birth_date
    
    @birthday.setter
    def birthday(self, value):
        self.birth_date = value
    
    def __str__(self):
        return f"{self.username} ({self.member_id}) - {self.role}"
    
    def is_locked(self):
        """アカウントがロックされているかチェック"""
        return self.locked_until and self.locked_until > timezone.now()
    
    def lock_account(self, duration_seconds=7200):
        """アカウントをロック"""
        self.locked_until = timezone.now() + timezone.timedelta(seconds=duration_seconds)
        self.save()
    
    def unlock_account(self):
        """アカウントのロックを解除"""
        self.locked_until = None
        self.failed_login_attempts = 0
        self.save()
    
    @property
    def point_balance(self):
        """有効なポイント残高を計算"""
        from django.db.models import Sum
        valid_points = self.user_points.filter(
            is_expired=False
        ).aggregate(total=Sum('points'))['total'] or 0
        return valid_points
    
    def add_points(self, points, expiry_months=6, source_description=""):
        """ポイントを追加（有効期限付き）"""
        from datetime import timedelta
        expiry_date = timezone.now() + timedelta(days=30 * expiry_months)
        
        user_point = UserPoint.objects.create(
            user=self,
            points=points,
            expiry_date=expiry_date
        )
        
        # 取引履歴を記録
        PointTransaction.objects.create(
            user=self,
            points=points,
            transaction_type='grant',
            description=source_description or f"{points}ポイント付与",
            balance_before=self.point_balance - points,
            balance_after=self.point_balance
        )
        
        # ランクアップチェック
        self.check_and_update_rank()
        
        return user_point
    
    def consume_points(self, points, description=""):
        """ポイントを消費（FIFO - 有効期限が近いものから）"""
        if self.point_balance < points:
            raise ValueError(f"ポイント残高不足: 残高{self.point_balance}pt, 必要{points}pt")
        
        remaining_points = points
        consumed_points = []
        
        # 有効期限が近い順に消費
        for user_point in self.user_points.filter(is_expired=False).order_by('expiry_date'):
            if remaining_points <= 0:
                break
                
            if user_point.points <= remaining_points:
                # このポイントを全て消費
                consumed_points.append((user_point, user_point.points))
                remaining_points -= user_point.points
                user_point.delete()
            else:
                # このポイントを部分消費
                consumed_points.append((user_point, remaining_points))
                user_point.points -= remaining_points
                user_point.save()
                remaining_points = 0
        
        # 取引履歴を記録
        PointTransaction.objects.create(
            user=self,
            points=-points,
            transaction_type='payment',
            description=description or f"{points}ポイント消費",
            balance_before=self.point_balance + points,
            balance_after=self.point_balance
        )
        
        return consumed_points
    
    def check_and_update_rank(self):
        """ランクアップチェックと自動更新"""
        try:
            total_points = PointTransaction.objects.filter(
                user=self,
                transaction_type__in=['grant', 'bonus'],
                points__gt=0
            ).aggregate(total=Sum('points'))['total'] or 0
            
            # 適用可能な最高ランクを取得
            suitable_rank = AccountRank.objects.filter(
                required_points__lte=total_points
            ).order_by('-required_points').first()
            
            if suitable_rank and self.rank != suitable_rank.rank:
                old_rank = self.rank
                self.rank = suitable_rank.rank
                self.save()
                
                # ランクアップ通知
                Notification.objects.create(
                    user=self,
                    notification_type='system',
                    title='ランクアップ！',
                    message=f'おめでとうございます！{old_rank}から{self.rank}にランクアップしました！',
                    priority='high'
                )
                
        except Exception as e:
            # ランクアップエラーはログに記録するが、メインの処理は継続
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Rank update failed for user {self.username}: {str(e)}")


class Industry(models.Model):
    """
    業種マスタテーブル
    MELTY_ACCOUNT_INTEGRATION_SPEC.md準拠
    """
    code = models.CharField(
        max_length=50,
        unique=True,
        help_text='業種コード (例: nightwork_cabaret)'
    )
    name = models.CharField(
        max_length=200,
        help_text='表示名 (例: ナイトワーク(キャバクラ・クラブ等))'
    )
    category = models.CharField(
        max_length=100,
        blank=True,
        help_text='カテゴリ (例: nightwork)'
    )
    display_order = models.IntegerField(
        default=0,
        help_text='表示順序'
    )
    
    class Meta:
        verbose_name = '業種'
        verbose_name_plural = '業種'
        ordering = ['display_order']
    
    def __str__(self):
        return self.name


class Store(models.Model):
    CATEGORY_CHOICES = [
        ('restaurant', 'Restaurant'),
        ('retail', 'Retail'),
        ('service', 'Service'),
        ('entertainment', 'Entertainment'),
        ('health', 'Health'),
        ('education', 'Education'),
    ]
    
    PRICE_RANGE_CHOICES = [
        ('budget', 'Budget'),
        ('moderate', 'Moderate'),
        ('expensive', 'Expensive'),
        ('luxury', 'Luxury'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('pending', 'Pending'),
        ('suspended', 'Suspended'),
    ]

    name = models.CharField(max_length=255)
    owner_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    registration_date = models.DateTimeField(auto_now_add=True)
    point_rate = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    monthly_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='restaurant')
    price_range = models.CharField(max_length=20, choices=PRICE_RANGE_CHOICES, default='moderate')
    features = models.JSONField(default=list, blank=True)
    specialties = models.JSONField(default=list, blank=True)
    
    rating = models.FloatField(default=0.0)
    reviews_count = models.IntegerField(default=0)
    hours = models.CharField(max_length=255, blank=True)
    biid_partner = models.BooleanField(default=True)
    
    # エリア展開制限機能（ForeignKey関係に変更）
    area = models.ForeignKey('Area', on_delete=models.PROTECT, null=True, blank=True, related_name='stores')
    
    # サービスエリア関連フィールド（大阪エリア限定機能）
    service_area = models.ForeignKey(
        'ServiceArea', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='area_stores',
        help_text="サービス提供エリア（ミナミ、北新地等）"
    )
    area_code = models.CharField(max_length=20, blank=True, help_text="エリアコード")
    prefecture = models.CharField(max_length=50, blank=True, help_text="都道府県")
    city = models.CharField(max_length=100, blank=True, help_text="市区町村")
    district = models.CharField(max_length=100, blank=True, help_text="地区名")
    is_area_verified = models.BooleanField(default=False, help_text="エリア検証済みフラグ")
    
    # デポジットポイント前払い機能
    deposit_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deposit_auto_charge = models.BooleanField(default=False)
    deposit_auto_charge_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.name
    
    def deduct_deposit(self, amount, description="", related_promotion=None):
        """デポジットを消費し、取引履歴を記録"""
        if self.deposit_balance < amount:
            raise ValueError(f"デポジット残高不足: 残高{self.deposit_balance}円, 必要額{amount}円")
        
        # 残高更新
        old_balance = self.deposit_balance
        self.deposit_balance -= amount
        self.save()
        
        # 取引履歴記録
        transaction = DepositTransaction.objects.create(
            store=self,
            transaction_id=self._generate_deposit_transaction_id(),
            transaction_type='consumption',
            amount=amount,
            balance_before=old_balance,
            balance_after=self.deposit_balance,
            payment_method='system',
            description=description or f"デポジット消費: {amount}円",
            status='completed',
            processed_at=timezone.now()
        )
        
        # 使用ログ記録
        if related_promotion:
            DepositUsageLog.objects.create(
                store=self,
                transaction=transaction,
                used_for='promotion_mail',
                used_amount=amount,
                related_promotion=related_promotion
            )
        
        # 自動チャージチェック
        self._check_auto_charge()
        
        return transaction
    
    def _generate_deposit_transaction_id(self):
        """デポジット取引IDを生成"""
        import uuid
        import time
        timestamp = int(time.time())
        unique_id = str(uuid.uuid4())[:8].upper()
        return f"DEP-{timestamp}-{unique_id}"
    
    def _check_auto_charge(self):
        """自動チャージのチェック"""
        try:
            auto_charge_rule = self.auto_charge_rule
            if (auto_charge_rule.is_enabled and 
                self.deposit_balance < auto_charge_rule.trigger_amount and
                auto_charge_rule.can_trigger_today() and 
                auto_charge_rule.can_trigger_this_month()):
                
                # 自動チャージ実行（実装は deposit_service で行う）
                from .deposit_service import deposit_service
                deposit_service.charge_deposit(
                    store=self,
                    amount=auto_charge_rule.charge_amount,
                    payment_method=auto_charge_rule.payment_method,
                    payment_reference=auto_charge_rule.payment_reference,
                    description=f"自動チャージ（残高: {self.deposit_balance}円 → トリガー: {auto_charge_rule.trigger_amount}円）"
                )
        except DepositAutoChargeRule.DoesNotExist:
            pass
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Auto charge check failed for store {self.name}: {str(e)}")
    
    def is_suspended_for_low_balance(self):
        """デポジット残高不足による停止状態チェック"""
        minimum_balance = 1000  # 最低残高（1000円）
        return self.deposit_balance < minimum_balance and self.status == 'suspended'


# 古いPointTransaction定義を削除（新しい定義を使用）


class GiftCategory(models.Model):
    """ギフトカテゴリ管理"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class Gift(models.Model):
    """ギフト商品管理"""
    GIFT_TYPE_CHOICES = [
        ('digital', 'デジタルギフト'),
        ('coupon', 'クーポン'),
        ('voucher', 'バウチャー'),
        ('physical', '現物商品'),
    ]
    
    STATUS_CHOICES = [
        ('active', '有効'),
        ('inactive', '無効'),
        ('sold_out', '売り切れ'),
        ('discontinued', '販売終了'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(GiftCategory, on_delete=models.CASCADE, related_name='gifts')
    gift_type = models.CharField(max_length=20, choices=GIFT_TYPE_CHOICES, default='digital')
    
    # 価格・在庫情報
    points_required = models.IntegerField()
    original_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock_quantity = models.IntegerField(default=0)
    unlimited_stock = models.BooleanField(default=False)
    
    # 画像・メディア
    image_url = models.URLField(blank=True)
    thumbnail_url = models.URLField(blank=True)
    
    # 提供元情報
    provider_name = models.CharField(max_length=255)
    provider_url = models.URLField(blank=True)
    
    # ステータス・有効期限
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    available_from = models.DateTimeField(null=True, blank=True)
    available_until = models.DateTimeField(null=True, blank=True)
    
    # 使用条件
    usage_instructions = models.TextField(blank=True)
    terms_conditions = models.TextField(blank=True)
    
    # 統計情報
    exchange_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # デジタルギフト連携用フィールド
    is_external_gift = models.BooleanField(default=False, help_text='RealPay等の外部デジタルギフトAPI経由か')
    external_brand = models.ForeignKey(
        'DigitalGiftBrand',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='gifts',
        help_text='連携するデジタルギフトブランド'
    )
    external_price = models.IntegerField(null=True, blank=True, help_text='外部API購入金額(円)')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.points_required} pts)"
    
    def calculate_total_cost(self):
        """手数料込みの総コスト計算"""
        if not self.is_external_gift or not self.external_brand or not self.external_price:
            # 内部ギフトの場合は手数料なし
            return {
                'price': self.points_required,
                'commission': 0,
                'commission_tax': 0,
                'total': self.points_required,
                'currency': 'JPY'
            }
        
        # 外部ギフトの場合は external_brand の計算を使用
        return self.external_brand.calculate_total_cost(self.external_price)
    
    def is_available(self):
        """ギフトが交換可能かチェック"""
        if self.status != 'active':
            return False
        
        now = timezone.now()
        if self.available_from and now < self.available_from:
            return False
        if self.available_until and now > self.available_until:
            return False
        
        if not self.unlimited_stock and self.stock_quantity <= 0:
            return False
        
        return True


class GiftExchange(models.Model):
    """ギフト交換記録"""
    STATUS_CHOICES = [
        ('pending', '処理中'),
        ('completed', '完了'),
        ('failed', '失敗'),
        ('cancelled', 'キャンセル'),
        ('expired', '期限切れ'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='gift_exchanges')
    gift = models.ForeignKey(Gift, on_delete=models.CASCADE, related_name='exchanges')
    
    # 交換情報
    points_spent = models.IntegerField()
    exchange_code = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # 配送・受取情報
    delivery_method = models.CharField(max_length=50, blank=True)
    delivery_address = models.TextField(blank=True)
    recipient_name = models.CharField(max_length=255, blank=True)
    recipient_email = models.EmailField(blank=True)
    recipient_phone = models.CharField(max_length=20, blank=True)
    
    # デジタルギフト情報
    digital_code = models.CharField(max_length=500, blank=True)
    digital_url = models.URLField(blank=True)
    qr_code_url = models.URLField(blank=True)
    
    # 日時情報
    exchanged_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    used_at = models.DateTimeField(null=True, blank=True)
    
    # 備考
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-exchanged_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.gift.name} - {self.status}"
    
    def generate_exchange_code(self):
        """交換コード生成"""
        import uuid
        import time
        timestamp = int(time.time())
        unique_id = str(uuid.uuid4())[:8].upper()
        return f"GFT-{timestamp}-{unique_id}"


class SecurityLog(models.Model):
    """セキュリティログ"""
    EVENT_TYPES = [
        ('LOGIN_SUCCESS', 'ログイン成功'),
        ('LOGIN_FAILURE', 'ログイン失敗'),
        ('BLOCKED_IP_ACCESS', 'ブロックIPアクセス'),
        ('RATE_LIMIT_EXCEEDED', 'レート制限超過'),
        ('ANOMALY_DETECTED', '異常検知'),
        ('IP_BLOCKED', 'IPブロック'),
        ('FRAUD_ATTEMPT', '不正試行'),
        ('ACCOUNT_LOCKED', 'アカウントロック'),
        ('SUSPICIOUS_ACTIVITY', '不審な活動'),
    ]
    
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    request_path = models.CharField(max_length=255, blank=True)
    request_data = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    severity = models.CharField(max_length=10, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ], default='medium')
    additional_data = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['event_type', 'timestamp']),
            models.Index(fields=['ip_address', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
        ]
    
    def __str__(self):
        return f"{self.event_type} - {self.ip_address} - {self.timestamp}"


class AuditLog(models.Model):
    """監査ログ"""
    ACTION_TYPES = [
        ('CREATE', '作成'),
        ('UPDATE', '更新'),
        ('DELETE', '削除'),
        ('ACCESS', 'アクセス'),
        ('EXPORT', 'エクスポート'),
        ('IMPORT', 'インポート'),
        ('ADMIN_ACTION', '管理者アクション'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    object_type = models.CharField(max_length=50)  # モデル名
    object_id = models.CharField(max_length=100, blank=True)
    changes = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['action_type', 'timestamp']),
            models.Index(fields=['object_type', 'timestamp']),
        ]
    
    def __str__(self):
        return f"{self.action_type} - {self.object_type} - {self.user} - {self.timestamp}"


# === パートナーAPI関連モデル ===

class APIAccessKey(models.Model):
    """パートナーAPIアクセスキー管理"""
    key = models.CharField(max_length=40, unique=True)
    partner_name = models.CharField(max_length=255)
    shared_secret = models.CharField(max_length=255)
    hash_algorithm = models.CharField(max_length=10, default='SHA1')
    time_step = models.IntegerField(default=30)
    totp_digits = models.IntegerField(default=6)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_used = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.partner_name} - {self.key}"


class Brand(models.Model):
    """交換先ブランド管理"""
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    logo_url = models.URLField(blank=True)
    allowed_prices = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class PurchaseID(models.Model):
    """購入ID管理"""
    id = models.CharField(max_length=40, primary_key=True)
    access_key = models.ForeignKey(APIAccessKey, on_delete=models.CASCADE)
    prices = models.JSONField(default=list)
    name = models.CharField(max_length=255)
    issuer = models.CharField(max_length=255)
    brands = models.ManyToManyField(Brand, related_name='purchase_ids')
    is_strict = models.BooleanField(default=True)
    
    # 配色設定
    color_main = models.CharField(max_length=6, blank=True)
    color_sub = models.CharField(max_length=6, blank=True)
    
    # 画像設定
    face_image_url = models.URLField(blank=True)
    header_image_url = models.URLField(blank=True)
    
    # 動画設定
    video_url = models.URLField(blank=True)
    video_play_time = models.IntegerField(default=0)
    
    # 誘導枠設定
    ad_image_url = models.URLField(blank=True)
    ad_redirect_url = models.URLField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.id}"


class GiftPurchase(models.Model):
    """ギフト購入記録"""
    STATUS_CHOICES = [
        ('pending', '処理中'),
        ('completed', '完了'),
        ('failed', '失敗'),
        ('expired', '期限切れ'),
    ]
    
    request_id = models.CharField(max_length=40, unique=True)
    purchase_id = models.ForeignKey(PurchaseID, on_delete=models.CASCADE)
    gift_code = models.CharField(max_length=50, unique=True)
    gift_url = models.URLField()
    price = models.IntegerField()
    
    # 支払い情報
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    commission = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    commission_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='JPY')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    # 既存ギフトシステムとの連携
    gift_exchange = models.ForeignKey(GiftExchange, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"{self.gift_code} - {self.price}円 - {self.status}"
    
    def generate_gift_code(self):
        """ギフトコード生成"""
        import random
        import string
        return ''.join(random.choices(string.ascii_lowercase + string.digits, k=26))


class APIRateLimit(models.Model):
    """APIレート制限管理"""
    access_key = models.ForeignKey(APIAccessKey, on_delete=models.CASCADE)
    ip_address = models.GenericIPAddressField()
    request_count = models.IntegerField(default=0)
    window_start = models.DateTimeField()
    
    class Meta:
        unique_together = ['access_key', 'ip_address']
    
    def __str__(self):
        return f"{self.access_key.partner_name} - {self.ip_address} - {self.request_count}"


# === ユーザーポイント有効期限管理 ===

class UserPoint(models.Model):
    """ユーザーポイント詳細管理"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_points')
    points = models.IntegerField()
    expiry_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_expired = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['expiry_date']
    
    def __str__(self):
        return f"{self.user.username} - {self.points}pt - 期限: {self.expiry_date}"
    
    def is_valid(self):
        """ポイントが有効かチェック"""
        if self.is_expired:
            return False
        if self.expiry_date and self.expiry_date < timezone.now():
            self.is_expired = True
            self.save()
            return False
        return True


# === ポイント転送機能 ===

class PointTransfer(models.Model):
    """ポイント転送記録"""
    STATUS_CHOICES = [
        ('pending', '処理中'),
        ('completed', '完了'),
        ('failed', '失敗'),
        ('cancelled', 'キャンセル'),
    ]
    
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_transfers')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_transfers')
    points = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True)
    transfer_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.sender.username} → {self.recipient.username}: {self.points}pt"
    
    def execute_transfer(self):
        """ポイント転送を実行"""
        if self.status != 'pending':
            raise ValueError(f"転送実行できない状態です: {self.status}")
        
        try:
            # 送信者のポイント消費（手数料込み）
            total_cost = self.points + int(self.transfer_fee)
            consumed_points = self.sender.consume_points(
                total_cost,
                f"ポイント転送: {self.recipient.username}へ{self.points}pt（手数料{self.transfer_fee}pt）"
            )
            
            # 受信者にポイント付与
            self.recipient.add_points(
                self.points,
                source_description=f"ポイント受取: {self.sender.username}から{self.points}pt"
            )
            
            # ステータス更新
            self.status = 'completed'
            self.processed_at = timezone.now()
            self.save()
            
            # 通知作成
            Notification.objects.create(
                user=self.recipient,
                notification_type='point_received',
                title='ポイントを受け取りました',
                message=f'{self.sender.username}さんから{self.points}ポイントを受け取りました。',
                priority='normal'
            )
            
            return True
            
        except ValueError as e:
            self.status = 'failed'
            self.save()
            raise e


class PointTransaction(models.Model):
    """ポイント取引履歴"""
    TRANSACTION_TYPE_CHOICES = [
        ('grant', 'ポイント付与'),
        ('payment', 'ポイント決済'),
        ('refund', 'ポイント返金'),
        ('transfer_in', 'ポイント受取'),
        ('transfer_out', 'ポイント送付'),
        ('expire', 'ポイント失効'),
        ('bonus', 'ボーナスポイント'),
        ('correction', '調整'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='point_transactions')
    store = models.ForeignKey(Store, on_delete=models.SET_NULL, null=True, blank=True)
    points = models.IntegerField()  # 正の値は増加、負の値は減少
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    description = models.CharField(max_length=500, blank=True)
    balance_before = models.PositiveIntegerField(default=0)
    balance_after = models.PositiveIntegerField(default=0)
    reference_id = models.CharField(max_length=100, blank=True)  # 外部システムの参照ID
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='processed_transactions')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['store', 'created_at']),
            models.Index(fields=['transaction_type', 'created_at']),
        ]
    
    def __str__(self):
        sign = '+' if self.points >= 0 else ''
        return f"{self.user.username}: {sign}{self.points}pt ({self.transaction_type})"


# === 通知機能 ===

class Notification(models.Model):
    """ユーザー通知管理"""
    TYPE_CHOICES = [
        ('point_received', 'ポイント受取'),
        ('point_transfer', 'ポイント転送'),
        ('gift_exchange', 'ギフト交換'),
        ('store_registration', '店舗登録'),
        ('store_approval', '店舗承認'),
        ('store_rejection', '店舗却下'),
        ('promotion', 'プロモーション'),
        ('system', 'システム通知'),
        ('welcome', 'ウェルカム'),
        ('admin_alert', '管理者アラート'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    email_sent = models.BooleanField(default=False)
    email_sent_at = models.DateTimeField(null=True, blank=True)
    email_error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # メール送信関連フィールド
    email_template = models.CharField(max_length=100, blank=True)
    email_context = models.JSONField(default=dict, blank=True)
    priority = models.CharField(max_length=10, choices=[
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ], default='normal')
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['notification_type', 'created_at']),
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['email_sent', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"


# === EC Point Award System Models ===

class ECPointRequest(models.Model):
    """EC購入ポイント付与申請"""
    REQUEST_TYPE_CHOICES = [
        ('webhook', 'Webhook'),
        ('receipt', 'Receipt'),
    ]
    
    STATUS_CHOICES = [
        ('pending', '店舗承認待ち'),
        ('approved', '承認済み'),
        ('rejected', '拒否済み'),
        ('completed', 'ポイント付与完了'),
        ('failed', '処理失敗'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('card_payment', 'クレジット決済'),
        ('deposit_consumption', 'デポジット消費'),
    ]
    
    # 基本情報
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPE_CHOICES, verbose_name='申請方式')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='申請者')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, verbose_name='店舗')
    purchase_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='購入金額')
    order_id = models.CharField(max_length=100, verbose_name='注文ID')
    purchase_date = models.DateTimeField(verbose_name='購入日時')
    
    # レシート関連フィールド
    receipt_image = models.ImageField(upload_to='receipts/', blank=True, null=True, verbose_name='レシート画像')
    receipt_description = models.TextField(blank=True, verbose_name='レシート詳細')
    
    # 処理状況
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='処理状況')
    points_to_award = models.IntegerField(verbose_name='付与予定ポイント')
    points_awarded = models.IntegerField(default=0, verbose_name='実付与ポイント')
    
    # 店舗処理情報
    store_approved_at = models.DateTimeField(blank=True, null=True, verbose_name='店舗承認日時')
    store_approved_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        blank=True, 
        null=True, 
        related_name='approved_ec_requests', 
        verbose_name='店舗承認者'
    )
    rejection_reason = models.TextField(blank=True, verbose_name='拒否理由')
    
    # 決済・デポジット情報
    payment_method = models.CharField(
        max_length=20, 
        choices=PAYMENT_METHOD_CHOICES, 
        blank=True, 
        verbose_name='支払い方法'
    )
    payment_reference = models.CharField(max_length=100, blank=True, verbose_name='決済参照ID')
    deposit_transaction = models.ForeignKey(
        'DepositTransaction', 
        on_delete=models.SET_NULL, 
        blank=True, 
        null=True, 
        verbose_name='デポジット取引'
    )
    
    # 重複防止・監査
    request_hash = models.CharField(max_length=64, unique=True, verbose_name='リクエストハッシュ')
    ip_address = models.GenericIPAddressField(verbose_name='IPアドレス')
    user_agent = models.TextField(blank=True, verbose_name='User Agent')
    
    # タイムスタンプ
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='作成日時')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新日時')
    completed_at = models.DateTimeField(blank=True, null=True, verbose_name='完了日時')
    
    class Meta:
        db_table = 'ec_point_requests'
        verbose_name = 'ECポイント申請'
        verbose_name_plural = 'ECポイント申請'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['store', 'status']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['order_id']),
            models.Index(fields=['request_hash']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.store.name} - {self.purchase_amount}円 ({self.get_status_display()})"
    
    def calculate_points(self):
        """付与ポイント数を計算"""
        # 基本的には購入金額の1%（100円で1ポイント）
        return int(self.purchase_amount // 100)
    
    def generate_request_hash(self):
        """リクエストハッシュを生成"""
        import hashlib
        data = f"{self.user_id}_{self.store_id}_{self.order_id}_{self.purchase_amount}_{self.purchase_date}"
        return hashlib.sha256(data.encode()).hexdigest()
    
    def can_be_approved(self):
        """承認可能かチェック"""
        return self.status == 'pending'
    
    def approve(self, approved_by, payment_method, payment_reference=''):
        """申請を承認"""
        from django.utils import timezone
        
        self.status = 'approved'
        self.store_approved_by = approved_by
        self.store_approved_at = timezone.now()
        self.payment_method = payment_method
        self.payment_reference = payment_reference
        self.points_to_award = self.calculate_points()
        self.save()
    
    def reject(self, rejected_by, reason):
        """申請を拒否"""
        from django.utils import timezone
        
        self.status = 'rejected'
        self.store_approved_by = rejected_by
        self.store_approved_at = timezone.now()
        self.rejection_reason = reason
        self.save()
    
    def mark_completed(self, points_awarded):
        """付与完了マーク"""
        from django.utils import timezone
        
        self.status = 'completed'
        self.points_awarded = points_awarded
        self.completed_at = timezone.now()
        self.save()


class ECPointRequestMessage(models.Model):
    """EC申請に対するメッセージ（ユーザー⇔店舗間の質疑応答）"""
    request = models.ForeignKey(
        ECPointRequest,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name='EC申請'
    )
    sender = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='送信者')
    message = models.TextField(verbose_name='メッセージ本文')
    is_from_store = models.BooleanField(default=False, verbose_name='店舗からの送信')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='送信日時')
    
    class Meta:
        db_table = 'ec_point_request_messages'
        verbose_name = 'ECポイント申請メッセージ'
        verbose_name_plural = 'ECポイント申請メッセージ'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['request', 'created_at']),
        ]
    
    def __str__(self):
        sender_type = '店舗' if self.is_from_store else 'ユーザー'
        return f"{sender_type}メッセージ - {self.request.order_id} - {self.created_at}"


class StoreWebhookKey(models.Model):
    """店舗Webhook認証キー"""
    store = models.OneToOneField(
        Store, 
        on_delete=models.CASCADE, 
        related_name='webhook_key', 
        verbose_name='店舗'
    )
    webhook_key = models.CharField(max_length=64, unique=True, verbose_name='Webhook認証キー')
    allowed_ips = models.JSONField(default=list, verbose_name='許可IPアドレス')
    is_active = models.BooleanField(default=True, verbose_name='有効状態')
    rate_limit_per_minute = models.IntegerField(default=60, verbose_name='分間リクエスト制限')
    last_used_at = models.DateTimeField(blank=True, null=True, verbose_name='最終使用日時')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='作成日時')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新日時')
    
    class Meta:
        db_table = 'store_webhook_keys'
        verbose_name = '店舗Webhookキー'
        verbose_name_plural = '店舗Webhookキー'
    
    def __str__(self):
        return f"{self.store.name} - Webhook Key"
    
    @classmethod
    def generate_key(cls):
        """Webhookキーを生成"""
        import secrets
        return secrets.token_hex(32)


# ============================================
# 新5カテゴリ統合設定モデル - 本番運用仕様
# ============================================

class SystemInfrastructureSettings(models.Model):
    """🏗️ システム基盤設定"""
    site_name = models.CharField(
        max_length=100, 
        default="BIID Point Management System",
        verbose_name="システム名",
        help_text="全インターフェース共通のシステム名称"
    )
    site_description = models.TextField(
        blank=True,
        default="エンタープライズ級ポイント管理プラットフォーム",
        verbose_name="システム説明",
        help_text="システム概要・メタ情報"
    )
    system_version = models.CharField(
        max_length=20,
        default="2.0.0",
        verbose_name="システムバージョン",
        help_text="現在運用中のシステムバージョン"
    )
    system_support_email = models.EmailField(
        default="admin@biid-system.com",
        validators=[EmailValidator()],
        verbose_name="システム管理者メール",
        help_text="システム管理・技術サポート用連絡先"
    )
    emergency_contact = models.CharField(
        max_length=50,
        default="080-1234-5678",
        verbose_name="緊急連絡先",
        help_text="システム障害時の緊急連絡先"
    )
    organization_name = models.CharField(
        max_length=100,
        default="BIID Systems Inc.",
        verbose_name="運営組織名",
        help_text="システム運営組織の正式名称"
    )
    operation_region = models.CharField(
        max_length=100,
        default="関西域（大阪・京都・神戸）",
        verbose_name="運営地域",
        help_text="システム運営対象地域"
    )
    timezone = models.CharField(
        max_length=50,
        choices=[
            ('Asia/Tokyo', 'Asia/Tokyo'),
            ('UTC', 'UTC'),
            ('Asia/Seoul', 'Asia/Seoul')
        ],
        default='Asia/Tokyo',
        verbose_name="タイムゾーン",
        help_text="全システムの時刻表示・処理に影響"
    )
    maintenance_mode = models.BooleanField(
        default=False,
        verbose_name="メンテナンスモード",
        help_text="全システムアクセスを制御"
    )
    debug_mode = models.BooleanField(
        default=False,
        verbose_name="デバッグモード",
        help_text="システム全体のログレベル・エラー表示を制御"
    )
    maintenance_message = models.TextField(
        blank=True,
        default="現在システムメンテナンス中です。しばらくお待ちください。",
        verbose_name="メンテナンスメッセージ",
        help_text="メンテナンス画面で表示されるメッセージ"
    )
    maintenance_start_time = models.DateTimeField(null=True, blank=True, verbose_name="メンテナンス開始時刻")
    maintenance_end_time = models.DateTimeField(null=True, blank=True, verbose_name="メンテナンス終了予定時刻")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="更新者")

    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(pk=1)
        return settings

    def get_system_info(self):
        return {
            'site_name': self.site_name,
            'version': self.system_version,
            'maintenance_mode': self.maintenance_mode,
            'debug_mode': self.debug_mode,
            'region': self.operation_region
        }

    class Meta:
        verbose_name = "🏗️ システム基盤設定"
        verbose_name_plural = "🏗️ システム基盤設定"
        db_table = 'core_system_infrastructure_settings'


class SecuritySettings(models.Model):
    """🔒 セキュリティ設定"""
    max_login_attempts = models.IntegerField(
        default=5,
        validators=[MinValueValidator(3), MaxValueValidator(20)],
        verbose_name="最大ログイン試行回数",
        help_text="アカウントロック前の最大ログイン試行回数"
    )
    login_lockout_duration_minutes = models.IntegerField(
        default=30,
        validators=[MinValueValidator(5), MaxValueValidator(1440)],
        verbose_name="ロック時間（分）",
        help_text="アカウントロック時間"
    )
    session_timeout_minutes = models.IntegerField(
        default=60,
        validators=[MinValueValidator(5), MaxValueValidator(480)],
        verbose_name="セッション有効時間（分）",
        help_text="ログインセッションの有効時間"
    )
    api_rate_limit_per_minute = models.IntegerField(
        default=100,
        validators=[MinValueValidator(10), MaxValueValidator(1000)],
        verbose_name="API制限/分",
        help_text="1分間あたりのAPI呼出制限"
    )
    api_rate_limit_per_hour = models.IntegerField(
        default=1000,
        validators=[MinValueValidator(100), MaxValueValidator(10000)],
        verbose_name="API制限/時",
        help_text="1時間あたりのAPI呼出制限"
    )
    enable_ip_whitelist = models.BooleanField(
        default=False,
        verbose_name="IP制限有効",
        help_text="管理者ログインのIP制限機能"
    )
    allowed_ip_addresses = models.TextField(
        blank=True,
        verbose_name="許可IPアドレス",
        help_text="許可IP（カンマ区切り、CIDR対応）"
    )
    enforce_2fa_for_admin = models.BooleanField(
        default=True,
        verbose_name="管理者2FA強制",
        help_text="管理者への2FA強制"
    )
    enforce_2fa_for_store = models.BooleanField(
        default=False,
        verbose_name="店舗2FA強制",
        help_text="店舗管理者への2FA強制"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(pk=1)
        return settings

    def get_security_policy(self):
        return {
            'max_attempts': self.max_login_attempts,
            'lockout_duration': self.login_lockout_duration_minutes,
            'session_timeout': self.session_timeout_minutes,
            '2fa_required': self.enforce_2fa_for_admin,
            'ip_restriction': self.enable_ip_whitelist
        }

    class Meta:
        verbose_name = "🔒 セキュリティ設定"
        verbose_name_plural = "🔒 セキュリティ設定"
        db_table = 'core_security_settings'


class ExternalIntegrationSettings(models.Model):
    """🔗 決済・外部連携設定"""
    # FINCODE設定
    fincode_api_key = models.CharField(
        max_length=200,
        default="",
        verbose_name="FINCODE APIキー",
        help_text="本番環境用APIキー（要暗号化保存）"
    )
    fincode_secret_key = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="FINCODE シークレットキー",
        help_text="本番環境用シークレットキー（要暗号化保存）"
    )
    fincode_shop_id = models.CharField(
        max_length=100,
        default="",
        verbose_name="FINCODE ショップID",
        help_text="契約ショップID"
    )
    fincode_is_production = models.BooleanField(
        default=True,
        verbose_name="FINCODE 本番環境",
        help_text="本番運用時はTrue必須"
    )
    fincode_webhook_url = models.URLField(
        blank=True,
        verbose_name="FINCODE Webhook URL",
        help_text="決済結果通知受信URL"
    )
    fincode_connection_timeout = models.IntegerField(
        default=30,
        validators=[MinValueValidator(5), MaxValueValidator(120)],
        verbose_name="FINCODE接続タイムアウト（秒）",
        help_text="API通信タイムアウト設定"
    )
    
    # MELTY連携設定
    melty_api_base_url = models.URLField(
        default="https://api.melty-system.com/v2/",
        verbose_name="MELTY API ベースURL",
        help_text="MELTY連携API接続先"
    )
    melty_api_key = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="MELTY APIキー",
        help_text="MELTY連携認証キー（要暗号化保存）"
    )
    melty_connection_enabled = models.BooleanField(
        default=True,
        verbose_name="MELTY連携有効",
        help_text="MELTY システムとの連携機能"
    )
    melty_sync_interval_minutes = models.IntegerField(
        default=60,
        validators=[MinValueValidator(5), MaxValueValidator(1440)],
        verbose_name="MELTY同期間隔（分）",
        help_text="会員情報同期間隔"
    )
    
    # 外部API共通設定
    external_api_retry_count = models.IntegerField(
        default=3,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        verbose_name="外部API再試行回数",
        help_text="通信失敗時の自動再試行回数"
    )
    external_api_timeout_seconds = models.IntegerField(
        default=30,
        validators=[MinValueValidator(5), MaxValueValidator(300)],
        verbose_name="外部API全般タイムアウト（秒）",
        help_text="外部システム通信タイムアウト"
    )
    payment_timeout_seconds = models.IntegerField(
        default=300,
        validators=[MinValueValidator(60), MaxValueValidator(1800)],
        verbose_name="決済タイムアウト（秒）",
        help_text="決済処理全体のタイムアウト"
    )
    max_payment_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=1000000.00,
        validators=[MinValueValidator(1), MaxValueValidator(10000000.00)],
        verbose_name="最大決済金額（円）",
        help_text="1回の決済での上限金額"
    )
    min_payment_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=100.00,
        validators=[MinValueValidator(1), MaxValueValidator(100000.00)],
        verbose_name="最小決済金額（円）",
        help_text="1回の決済での下限金額"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(pk=1)
        return settings

    def get_fincode_config(self):
        return {
            'api_key': self.fincode_api_key,
            'shop_id': self.fincode_shop_id,
            'is_production': self.fincode_is_production,
            'timeout': self.fincode_connection_timeout
        }

    def is_production_ready(self):
        return bool(self.fincode_api_key and self.fincode_shop_id and self.fincode_is_production)

    class Meta:
        verbose_name = "🔗 決済・外部連携設定"
        verbose_name_plural = "🔗 決済・外部連携設定"
        db_table = 'core_external_integration_settings'


class NotificationSettings(models.Model):
    """📧 通知・メール設定"""
    # SMTP設定
    smtp_host = models.CharField(
        max_length=255,
        default="smtp.sendgrid.net",
        verbose_name="SMTPホスト",
        help_text="メール送信サーバーのホスト名"
    )
    smtp_port = models.IntegerField(
        default=587,
        validators=[MinValueValidator(1), MaxValueValidator(65535)],
        verbose_name="SMTPポート",
        help_text="SMTP接続ポート（TLS: 587, SSL: 465）"
    )
    smtp_username = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="SMTPユーザー名",
        help_text="SMTP認証用ユーザー名"
    )
    smtp_password = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="SMTPパスワード",
        help_text="SMTP認証用パスワード（要暗号化保存）"
    )
    smtp_use_tls = models.BooleanField(
        default=True,
        verbose_name="TLS使用",
        help_text="STARTTLS使用（推奨）"
    )
    smtp_use_ssl = models.BooleanField(
        default=False,
        verbose_name="SSL使用",
        help_text="SSL直接接続（TLSと排他）"
    )
    from_email = models.EmailField(
        default="no-reply@biid-system.com",
        validators=[EmailValidator()],
        verbose_name="送信者メール",
        help_text="送信者メールアドレス"
    )
    from_name = models.CharField(
        max_length=100,
        default="BIID Point System",
        verbose_name="送信者名",
        help_text="送信者名"
    )
    reply_to_email = models.EmailField(
        blank=True,
        validators=[EmailValidator()],
        verbose_name="返信先メールアドレス",
        help_text="ユーザーが返信する際の宛先（空白時はfrom_emailを使用）"
    )
    
    # 通知設定
    enable_welcome_email = models.BooleanField(
        default=True,
        verbose_name="ウェルカムメール",
        help_text="新規ユーザー登録完了メール"
    )
    enable_point_notification = models.BooleanField(
        default=True,
        verbose_name="ポイント通知",
        help_text="ポイント付与・消費・有効期限通知"
    )
    enable_gift_notification = models.BooleanField(
        default=True,
        verbose_name="ギフト通知",
        help_text="ギフト交換・受取り・期限通知"
    )
    enable_promotion_email = models.BooleanField(
        default=True,
        verbose_name="プロモーションメール",
        help_text="店舗からのプロモーション・キャンペーン通知"
    )
    enable_security_notification = models.BooleanField(
        default=True,
        verbose_name="セキュリティ通知",
        help_text="ログイン・パスワード変更・2FA設定通知"
    )
    enable_transaction_notification = models.BooleanField(
        default=True,
        verbose_name="取引通知",
        help_text="決済・送金・チャージ完了通知"
    )
    
    # 配信制御設定
    email_batch_size = models.IntegerField(
        default=100,
        validators=[MinValueValidator(1), MaxValueValidator(1000)],
        verbose_name="バッチ送信数",
        help_text="一度に送信するメール数"
    )
    email_rate_limit_per_hour = models.IntegerField(
        default=1000,
        validators=[MinValueValidator(10), MaxValueValidator(10000)],
        verbose_name="時間あたり送信制限",
        help_text="1時間あたりの最大メール送信数"
    )
    email_queue_retry_count = models.IntegerField(
        default=3,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        verbose_name="送信再試行回数",
        help_text="メール送信失敗時の再試行回数"
    )
    email_queue_retry_delay_minutes = models.IntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(60)],
        verbose_name="再試行間隔（分）",
        help_text="メール送信再試行の間隔"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(pk=1)
        return settings

    def get_smtp_config(self):
        return {
            'host': self.smtp_host,
            'port': self.smtp_port,
            'username': self.smtp_username,
            'password': self.smtp_password,
            'use_tls': self.smtp_use_tls,
            'use_ssl': self.smtp_use_ssl,
            'from_email': self.from_email,
            'from_name': self.from_name
        }

    class Meta:
        verbose_name = "📧 通知・メール設定"
        verbose_name_plural = "📧 通知・メール設定"
        db_table = 'core_notification_settings'


class BusinessOperationSettings(models.Model):
    """💼 事業運営設定"""
    # ポイントシステム基本設定
    default_point_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=1.0,
        validators=[MinValueValidator(0.1), MaxValueValidator(10.0)],
        verbose_name="基本ポイント還元率（%）",
        help_text="標準的なポイント付与率"
    )
    point_expiry_months = models.IntegerField(
        default=12,
        validators=[MinValueValidator(1), MaxValueValidator(60)],
        verbose_name="ポイント有効期限（月）",
        help_text="付与ポイントの有効期限"
    )
    max_point_balance = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        default=1000000,
        validators=[MinValueValidator(10000), MaxValueValidator(10000000)],
        verbose_name="最大ポイント保有数",
        help_text="1ユーザーあたりの最大保有ポイント"
    )
    
    # 店舗関連設定
    store_deposit_required = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=100000.00,
        validators=[MinValueValidator(10000), MaxValueValidator(10000000)],
        verbose_name="店舗デポジット必要額（円）",
        help_text="店舗開始時に必要なデポジット金額"
    )
    store_minimum_transaction = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=50000.00,
        validators=[MinValueValidator(1000), MaxValueValidator(1000000)],
        verbose_name="店舗最小決済額（円）",
        help_text="店舗での最小決済金額"
    )
    store_refund_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=95.0,
        validators=[MinValueValidator(50.0), MaxValueValidator(100.0)],
        verbose_name="店舗払戻還元率（%）",
        help_text="店舗への払戻時の還元率"
    )
    
    # 手数料設定
    system_fee_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=3.0,
        validators=[MinValueValidator(0.1), MaxValueValidator(20.0)],
        verbose_name="システム手数料率（%）",
        help_text="システム利用料率"
    )
    payment_processing_fee = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=300.00,
        validators=[MinValueValidator(0), MaxValueValidator(10000)],
        verbose_name="決済処理手数料（円）",
        help_text="1件あたりの決済処理手数料"
    )
    transfer_fee = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=200.00,
        validators=[MinValueValidator(0), MaxValueValidator(5000)],
        verbose_name="送金手数料（円）",
        help_text="ポイント送金時の手数料"
    )
    bank_transfer_fee = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=330.00,
        validators=[MinValueValidator(0), MaxValueValidator(2000)],
        verbose_name="銀行振込手数料（円）",
        help_text="銀行振込時の手数料"
    )
    promotion_email_cost = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=15.00,
        validators=[MinValueValidator(1), MaxValueValidator(1000)],
        verbose_name="プロモーションメール送信料（円）",
        help_text="1通あたりのプロモーションメール送信コスト"
    )
    minimum_cashout_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=30000.00,
        validators=[MinValueValidator(1000), MaxValueValidator(1000000)],
        verbose_name="最小出金額（円）",
        help_text="現金化可能な最小金額"
    )
    
    # ポイント価格設定
    point_unit_price = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=1.00,
        validators=[MinValueValidator(0.5), MaxValueValidator(5.0)],
        verbose_name="基本ポイント単価（円）",
        help_text="1ポイントあたりの基本価格"
    )
    tax_rate = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=10.00,
        validators=[MinValueValidator(0), MaxValueValidator(30)],
        verbose_name="消費税率（%）",
        help_text="ポイント購入時の消費税率"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(pk=1)
        return settings

    def get_fee_structure(self):
        return {
            'system_fee_rate': float(self.system_fee_rate),
            'payment_processing_fee': float(self.payment_processing_fee),
            'transfer_fee': float(self.transfer_fee),
            'bank_transfer_fee': float(self.bank_transfer_fee),
            'point_unit_price': float(self.point_unit_price),
            'tax_rate': float(self.tax_rate)
        }

    class Meta:
        verbose_name = "💼 事業運営設定"
        verbose_name_plural = "💼 事業運営設定"
        db_table = 'core_business_operation_settings'


class UserExperienceSettings(models.Model):
    """👤 ユーザー体験設定"""
    # ユーザーサポート設定
    user_support_email = models.EmailField(
        default="support@biid-user.com",
        validators=[EmailValidator()],
        verbose_name="ユーザーサポートメール",
        help_text="ユーザー向けサポート連絡先"
    )
    user_support_phone = models.CharField(
        max_length=20,
        default="0120-456-789",
        verbose_name="ユーザーサポート電話",
        help_text="ユーザー向けサポート電話番号（フリーダイヤル推奨）"
    )
    service_area_description = models.CharField(
        max_length=200,
        default="関西域（大阪・京都・神戸）を中心としたプレミアムエリア",
        verbose_name="サービスエリア説明",
        help_text="ユーザー向けサービス提供エリアの説明"
    )
    
    # MELTY連携・ランク設定
    melty_membership_type = models.CharField(
        max_length=20,
        choices=[
            ('standard', 'スタンダード会員'),
            ('premium', 'プレミアム会員'),
            ('vip', 'VIP会員'),
            ('platinum', 'プラチナ会員')
        ],
        default='standard',
        verbose_name="MELTY会員種別",
        help_text="デフォルトのMELTY会員レベル"
    )
    biid_initial_rank = models.CharField(
        max_length=20,
        choices=[
            ('bronze', 'ブロンズ'),
            ('silver', 'シルバー'),
            ('gold', 'ゴールド'),
            ('platinum', 'プラチナ')
        ],
        default='bronze',
        verbose_name="BIID初期ランク",
        help_text="新規ユーザーの初期ランク"
    )
    
    # ボーナス・インセンティブ設定
    welcome_bonus_points = models.IntegerField(
        default=1000,
        validators=[MinValueValidator(0), MaxValueValidator(10000)],
        verbose_name="ウェルカムボーナスポイント",
        help_text="新規登録時の付与ポイント"
    )
    referral_bonus_points = models.IntegerField(
        default=500,
        validators=[MinValueValidator(0), MaxValueValidator(5000)],
        verbose_name="紹介ボーナスポイント",
        help_text="友達紹介時の付与ポイント"
    )
    
    # 機能有効化設定
    enable_social_features = models.BooleanField(
        default=True,
        verbose_name="ソーシャル機能有効",
        help_text="友達機能・投稿・レビューなどのソーシャル機能"
    )
    enable_gift_exchange = models.BooleanField(
        default=True,
        verbose_name="ギフト交換機能",
        help_text="ユーザー間でのギフト交換機能"
    )
    enable_point_transfer = models.BooleanField(
        default=True,
        verbose_name="ポイント送金機能",
        help_text="ユーザー間でのポイント送金機能"
    )
    max_daily_point_transfer = models.IntegerField(
        default=10000,
        validators=[MinValueValidator(100), MaxValueValidator(100000)],
        verbose_name="1日最大送金ポイント数",
        help_text="ユーザーが1日に送金可能な最大ポイント"
    )
    
    # UI・UX設定
    default_theme = models.CharField(
        max_length=20,
        choices=[
            ('light', 'ライトテーマ'),
            ('dark', 'ダークテーマ'),
            ('auto', '自動切り替え')
        ],
        default='light',
        verbose_name="デフォルトテーマ",
        help_text="ユーザー画面のデフォルトテーマ"
    )
    enable_push_notifications = models.BooleanField(
        default=True,
        verbose_name="プッシュ通知",
        help_text="モバイルアプリでのプッシュ通知機能"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(pk=1)
        return settings

    def get_user_support_info(self):
        return {
            'email': self.user_support_email,
            'phone': self.user_support_phone,
            'service_area': self.service_area_description
        }

    def get_melty_integration_config(self):
        return {
            'membership_type': self.melty_membership_type,
            'initial_rank': self.biid_initial_rank,
            'welcome_bonus': self.welcome_bonus_points,
            'referral_bonus': self.referral_bonus_points
        }

    def get_feature_flags(self):
        return {
            'social_features': self.enable_social_features,
            'gift_exchange': self.enable_gift_exchange,
            'point_transfer': self.enable_point_transfer,
            'push_notifications': self.enable_push_notifications,
            'max_daily_transfer': self.max_daily_point_transfer
        }

    class Meta:
        verbose_name = "👤 ユーザー体験設定"
        verbose_name_plural = "👤 ユーザー体験設定"
        db_table = 'core_user_experience_settings'
    
    def is_ip_allowed(self, ip_address):
        """IPアドレスが許可されているかチェック"""
        if not self.allowed_ips:
            return True  # 制限なし
        return ip_address in self.allowed_ips
    
    def update_last_used(self):
        """最終使用日時を更新"""
        from django.utils import timezone
        self.last_used_at = timezone.now()
        self.save(update_fields=['last_used_at'])


class PointAwardLog(models.Model):
    """ポイント付与ログ"""
    ec_request = models.OneToOneField(
        ECPointRequest, 
        on_delete=models.CASCADE, 
        related_name='award_log', 
        verbose_name='EC申請'
    )
    point_transaction = models.ForeignKey(
        'PointTransaction', 
        on_delete=models.CASCADE, 
        verbose_name='ポイント取引'
    )
    awarded_points = models.IntegerField(verbose_name='付与ポイント')
    award_rate = models.DecimalField(max_digits=8, decimal_places=4, verbose_name='付与率')
    processing_duration_ms = models.IntegerField(blank=True, null=True, verbose_name='処理時間(ms)')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='作成日時')
    
    class Meta:
        db_table = 'point_award_logs'
        verbose_name = 'ポイント付与ログ'
        verbose_name_plural = 'ポイント付与ログ'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.ec_request.user.username} - {self.awarded_points}pt"


class DuplicateDetection(models.Model):
    """重複検知"""
    DETECTION_TYPE_CHOICES = [
        ('order_id', '注文ID重複'),
        ('pattern_match', 'パターンマッチ'),
        ('suspicious', '不審な活動'),
    ]
    
    SEVERITY_CHOICES = [
        ('low', '低'),
        ('medium', '中'),
        ('high', '高'),
        ('critical', '重大'),
    ]
    
    detection_type = models.CharField(max_length=20, choices=DETECTION_TYPE_CHOICES, verbose_name='検知種別')
    original_request = models.ForeignKey(
        ECPointRequest, 
        on_delete=models.CASCADE, 
        related_name='duplicate_detections_as_original', 
        verbose_name='元申請'
    )
    duplicate_request = models.ForeignKey(
        ECPointRequest, 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True, 
        related_name='duplicate_detections_as_duplicate', 
        verbose_name='重複申請'
    )
    detection_details = models.JSONField(default=dict, verbose_name='検知詳細')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, verbose_name='重要度')
    is_resolved = models.BooleanField(default=False, verbose_name='解決済み')
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, verbose_name='解決者')
    resolved_at = models.DateTimeField(blank=True, null=True, verbose_name='解決日時')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='検知日時')
    
    class Meta:
        db_table = 'duplicate_detections'
        verbose_name = '重複検知'
        verbose_name_plural = '重複検知'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_detection_type_display()} - {self.get_severity_display()}"


class EmailTemplate(models.Model):
    """メールテンプレート管理"""
    name = models.CharField(max_length=100, unique=True)
    subject = models.CharField(max_length=255)
    body_html = models.TextField()
    body_text = models.TextField(blank=True)
    description = models.TextField(blank=True)
    
    # テンプレート変数の定義
    available_variables = models.JSONField(default=list, blank=True, help_text="使用可能な変数のリスト")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class EmailLog(models.Model):
    """メール送信ログ"""
    STATUS_CHOICES = [
        ('pending', '送信待ち'),
        ('sent', '送信完了'),
        ('failed', '送信失敗'),
        ('bounced', 'バウンス'),
        ('spam', 'スパム'),
    ]
    
    notification = models.OneToOneField(Notification, on_delete=models.CASCADE, null=True, blank=True)
    recipient_email = models.EmailField()
    subject = models.CharField(max_length=255)
    template_used = models.CharField(max_length=100, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    sent_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    retry_count = models.IntegerField(default=0)
    
    # メタデータ
    provider_message_id = models.CharField(max_length=255, blank=True)
    bounce_reason = models.CharField(max_length=255, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['recipient_email', 'sent_at']),
        ]
    
    def __str__(self):
        return f"{self.recipient_email} - {self.subject} - {self.status}"


# === デポジットポイント前払い機能 ===

class DepositTransaction(models.Model):
    """デポジット取引記録"""
    TRANSACTION_TYPE_CHOICES = [
        ('charge', 'チャージ'),
        ('consumption', '消費'),
        ('refund', '返金'),
        ('auto_charge', '自動チャージ'),
        ('bonus', 'ボーナス'),
        ('penalty', 'ペナルティ'),
    ]
    
    STATUS_CHOICES = [
        ('pending', '処理中'),
        ('completed', '完了'),
        ('failed', '失敗'),
        ('cancelled', 'キャンセル'),
        ('refunded', '返金済み'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('credit_card', 'クレジットカード'),
        ('bank_transfer', '銀行振込'),
        ('convenience_store', 'コンビニ決済'),
        ('digital_wallet', 'デジタルウォレット'),
        ('system', 'システム処理'),
    ]
    
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='deposit_transactions')
    transaction_id = models.CharField(max_length=100, unique=True)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # 残高情報
    balance_before = models.DecimalField(max_digits=10, decimal_places=2)
    balance_after = models.DecimalField(max_digits=10, decimal_places=2)
    
    # 決済情報
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, null=True, blank=True)
    payment_reference = models.CharField(max_length=255, blank=True)
    
    # ステータス・タイムスタンプ
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    processed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # メタデータ
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    # 関連取引（返金・キャンセル時の元取引）
    related_transaction = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    
    # 手数料情報
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    fee_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['store', 'created_at']),
            models.Index(fields=['transaction_type', 'status']),
            models.Index(fields=['status', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.store.name} - {self.transaction_type} - {self.amount}円"
    
    def generate_transaction_id(self):
        """取引IDを生成"""
        import uuid
        import time
        timestamp = int(time.time())
        unique_id = str(uuid.uuid4())[:8].upper()
        return f"DEP-{timestamp}-{unique_id}"


class DepositAutoChargeRule(models.Model):
    """デポジット自動チャージルール"""
    store = models.OneToOneField(Store, on_delete=models.CASCADE, related_name='auto_charge_rule')
    
    # 自動チャージ設定
    is_enabled = models.BooleanField(default=False)
    trigger_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="この金額を下回ったら自動チャージ")
    charge_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="チャージする金額")
    
    # 支払い方法設定
    payment_method = models.CharField(max_length=20, choices=DepositTransaction.PAYMENT_METHOD_CHOICES)
    payment_reference = models.CharField(max_length=255, blank=True, help_text="カード番号（下4桁）など")
    
    # 制限設定
    max_charge_per_day = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_charge_per_month = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # 通知設定
    notification_enabled = models.BooleanField(default=True)
    notification_email = models.EmailField(blank=True)
    
    # 日時情報
    last_triggered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.store.name} - 自動チャージ{'有効' if self.is_enabled else '無効'}"
    
    def can_trigger_today(self):
        """今日の制限内で自動チャージ可能か"""
        if not self.max_charge_per_day:
            return True
        
        today = timezone.now().date()
        today_charges = DepositTransaction.objects.filter(
            store=self.store,
            transaction_type='auto_charge',
            status='completed',
            created_at__date=today
        ).aggregate(total=models.Sum('amount'))['total'] or 0
        
        return today_charges + self.charge_amount <= self.max_charge_per_day
    
    def can_trigger_this_month(self):
        """今月の制限内で自動チャージ可能か"""
        if not self.max_charge_per_month:
            return True
        
        now = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        month_charges = DepositTransaction.objects.filter(
            store=self.store,
            transaction_type='auto_charge',
            status='completed',
            created_at__gte=month_start
        ).aggregate(total=models.Sum('amount'))['total'] or 0
        
        return month_charges + self.charge_amount <= self.max_charge_per_month


class DepositUsageLog(models.Model):
    """デポジット使用履歴"""
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='deposit_usage_logs')
    transaction = models.ForeignKey(DepositTransaction, on_delete=models.CASCADE, related_name='usage_logs')
    
    # 使用詳細
    used_for = models.CharField(max_length=100, help_text="使用目的（プロモーション、広告費など）")
    used_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # 関連情報
    related_promotion = models.ForeignKey('PromotionMail', on_delete=models.SET_NULL, null=True, blank=True)
    user_count = models.IntegerField(default=0, help_text="対象ユーザー数")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.store.name} - {self.used_for} - {self.used_amount}円"


# === プロモーションメール課金機能 ===

class PromotionMail(models.Model):
    """プロモーションメール管理"""
    STATUS_CHOICES = [
        ('draft', '下書き'),
        ('pending', '送信待ち'),
        ('sending', '送信中'),
        ('sent', '送信完了'),
        ('failed', '送信失敗'),
    ]
    
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='promotion_mails')
    title = models.CharField(max_length=255)
    content = models.TextField()
    target_area = models.ForeignKey('Area', on_delete=models.SET_NULL, null=True, blank=True, related_name='promotion_mails')
    target_user_rank = models.CharField(max_length=20, null=True, blank=True)
    send_cost = models.DecimalField(max_digits=10, decimal_places=2)  # 送信コスト
    recipients_count = models.IntegerField(default=0)
    sent_count = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    scheduled_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.store.name} - {self.title}"
    
    def calculate_cost(self):
        """送信コストを計算"""
        base_cost = 10  # 基本コスト（1通あたり10円）
        if self.target_area:
            # エリア限定の場合は割増
            base_cost *= 1.2
        if self.target_user_rank in ['gold', 'platinum', 'diamond']:
            # 上位ランクターゲットは割増
            base_cost *= 1.5
        
        self.send_cost = base_cost * self.recipients_count
        return self.send_cost
    
    def execute_with_deposit_charge(self):
        """デポジットを消費してプロモーションメールを実行"""
        if self.status != 'pending':
            raise ValueError(f"送信実行できない状態です: {self.status}")
        
        # コスト計算
        total_cost = self.calculate_cost()
        
        # デポジット消費
        try:
            deposit_transaction = self.store.deduct_deposit(
                amount=total_cost,
                description=f"プロモーションメール送信: {self.title}",
                related_promotion=self
            )
            
            # ステータス更新
            self.status = 'sending'
            self.save()
            
            # メール送信処理をキューに追加（実際の送信は非同期処理）
            from .email_service import email_service
            email_service.queue_promotion_mail(self)
            
            return deposit_transaction
            
        except ValueError as e:
            # デポジット不足の場合
            self.status = 'failed'
            self.save()
            raise e


# === アカウントランク管理 ===

class AccountRank(models.Model):
    """アカウントランク詳細設定"""
    rank = models.CharField(max_length=20, unique=True)
    required_points = models.IntegerField()  # ランクアップに必要なポイント
    required_transactions = models.IntegerField(default=0)  # ランクアップに必要な取引回数
    point_multiplier = models.DecimalField(max_digits=5, decimal_places=2, default=1.00)  # ポイント倍率
    privileges = models.JSONField(default=dict)  # ランク特典
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['required_points']
    
    def __str__(self):
        return f"{self.get_rank_display()} - {self.required_points}pt"


class MeltyRankConfiguration(models.Model):
    """
    MELTY会員ランク設定
    対象: ユーザー向け(MELTY連携・初期ランク・ボーナスポイント)
    """
    MELTY_MEMBERSHIP_CHOICES = [
        ('free', 'MELTY無料会員'),
        ('premium', 'MELTYプレミアム会員'),
    ]
    
    melty_membership_type = models.CharField(
        max_length=20, 
        choices=MELTY_MEMBERSHIP_CHOICES, 
        unique=True,
        verbose_name="MELTY会員種別 [ユーザー向け]",
        help_text="MELTY連携ユーザーの初期ランク決定"
    )
    biid_initial_rank = models.CharField(
        max_length=20, 
        verbose_name="BIID初期ランク [ユーザー向け]",
        help_text="MELTY連携ユーザーの初期ランク決定"
    )
    welcome_bonus_points = models.IntegerField(
        default=1000,
        verbose_name="ウェルカムボーナスポイント [ユーザー向け]",
        help_text="新規ユーザーへの初期ポイント付与"
    )
    points_expiry_months = models.IntegerField(
        default=12,
        verbose_name="ポイント有効期限 [ユーザー向け]",
        help_text="ユーザーのポイント管理(月)"
    )
    member_id_prefix = models.CharField(
        max_length=5,
        default="S",
        verbose_name="会員ID接頭辞 [ユーザー向け]",
        help_text="ユーザーの会員ID生成ルール"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="有効"
    )
    description = models.TextField(
        blank=True,
        verbose_name="説明"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['melty_membership_type']
        verbose_name = "会員ランク設定 (ユーザー向け)"
        verbose_name_plural = "会員ランク設定 (ユーザー向け)"
    
    def __str__(self):
        return f"{self.get_melty_membership_type_display()} → {self.get_biid_initial_rank_display()}"


# === ポイント払戻し申請・管理機能 ===

class RefundRequest(models.Model):
    """ポイント払戻し申請管理"""
    STATUS_CHOICES = [
        ('pending', '申請中'),
        ('reviewing', '審査中'),
        ('approved', '承認済み'),
        ('rejected', '却下'),
        ('completed', '完了'),
        ('cancelled', 'キャンセル'),
    ]
    
    REFUND_TYPE_CHOICES = [
        ('cash', '現金払戻し'),
        ('bank_transfer', '銀行振込'),
        ('gift_card', 'ギフトカード'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='refund_requests')
    points_to_refund = models.IntegerField()
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2)
    refund_type = models.CharField(max_length=20, choices=REFUND_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField()
    
    # 銀行情報（銀行振込の場合）
    bank_name = models.CharField(max_length=255, blank=True)
    branch_name = models.CharField(max_length=255, blank=True)
    account_type = models.CharField(max_length=10, blank=True)
    account_number = models.CharField(max_length=20, blank=True)
    account_holder = models.CharField(max_length=255, blank=True)
    
    # 処理情報
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='processed_refunds')
    admin_notes = models.TextField(blank=True)
    processing_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # 日時情報
    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-requested_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.points_to_refund}pt - {self.status}"
    
    def calculate_refund_amount(self):
        """払戻し金額を計算（手数料等を考慮）"""
        point_value = 1.0  # 1ポイント = 1円
        base_amount = self.points_to_refund * point_value
        
        # 処理手数料を差し引き
        self.refund_amount = base_amount - self.processing_fee
        return self.refund_amount


# === エリア展開制限機能 ===

class Area(models.Model):
    """エリアマスタ管理"""
    name = models.CharField(max_length=100)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = 'エリア'
        verbose_name_plural = 'エリア'
    
    def __str__(self):
        return self.name


# === ブログ画面デザイン着せ替え機能 ===

class BlogTheme(models.Model):
    """ブログテーマ管理"""
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    # カラー設定
    primary_color = models.CharField(max_length=7, default='#ec4899')  # HEXカラー
    secondary_color = models.CharField(max_length=7, default='#f43f5e')
    accent_color = models.CharField(max_length=7, default='#8b5cf6')
    background_color = models.CharField(max_length=7, default='#fdf2f8')
    text_color = models.CharField(max_length=7, default='#1f2937')
    
    # フォント設定
    font_family = models.CharField(max_length=255, default='Inter, sans-serif')
    font_size_base = models.CharField(max_length=10, default='16px')
    
    # レイアウト設定
    layout_type = models.CharField(max_length=20, choices=[
        ('default', 'デフォルト'),
        ('sidebar', 'サイドバー'),
        ('grid', 'グリッド'),
        ('magazine', 'マガジン'),
    ], default='default')
    
    # CSS設定
    custom_css = models.TextField(blank=True)
    
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)  # プレミアムテーマ
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class UserBlogTheme(models.Model):
    """ユーザーのブログテーマ選択"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='blog_theme')
    theme = models.ForeignKey(BlogTheme, on_delete=models.CASCADE)
    purchased_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.theme.name}"


# === デジタルギフトAPI連携モデル ===

class DigitalGiftBrand(models.Model):
    """デジタルギフトブランド管理"""
    code = models.CharField(max_length=50, unique=True)  # amazon, paypay など
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    logo_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    
    # 対応金額設定
    supported_prices = models.JSONField(default=list)  # [100, 500, 1000, 3000, 5000]
    min_price = models.IntegerField(default=100)
    max_price = models.IntegerField(default=50000)
    
    # 手数料設定
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)  # パーセンテージ
    commission_tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)  # 消費税
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    def calculate_total_cost(self, price: int) -> dict:
        """購入総額を計算"""
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


class DigitalGiftPurchaseID(models.Model):
    """デジタルギフト購入ID管理"""
    purchase_id = models.CharField(max_length=40, unique=True)  # パートナーAPIから取得
    
    # 購入設定
    name = models.CharField(max_length=255)  # ギフト名
    issuer = models.CharField(max_length=255)  # 発行者名
    prices = models.JSONField(default=list)  # [100, 500, 1000]
    brands = models.ManyToManyField(DigitalGiftBrand)  # 対応ブランド
    is_strict = models.BooleanField(default=True)  # 厳密モード
    
    # デザイン設定
    main_color = models.CharField(max_length=7, blank=True)  # HEXカラー
    sub_color = models.CharField(max_length=7, blank=True)
    face_image_url = models.URLField(blank=True)
    header_image_url = models.URLField(blank=True)
    
    # 動画設定
    youtube_url = models.URLField(blank=True)
    minimum_play_time = models.IntegerField(default=0)  # 秒
    
    # 誘導設定
    ad_image_url = models.URLField(blank=True)
    redirect_url = models.URLField(blank=True)
    
    # ステータス
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.purchase_id})"


class DigitalGiftPurchase(models.Model):
    """デジタルギフト購入記録"""
    STATUS_CHOICES = [
        ('pending', '処理中'),
        ('completed', '完了'),
        ('failed', '失敗'),
        ('expired', '期限切れ'),
        ('used', '使用済み'),
    ]
    
    # 基本情報
    gift_code = models.CharField(max_length=100, unique=True)  # ギフトコード
    gift_url = models.URLField()  # ギフトURL
    purchase_id_record = models.ForeignKey(DigitalGiftPurchaseID, on_delete=models.CASCADE, related_name='purchases')
    brand = models.ForeignKey(DigitalGiftBrand, on_delete=models.CASCADE)
    
    # 購入者情報
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='digital_gift_purchases')
    
    # 価格情報
    price = models.IntegerField()  # ギフト額面
    points_used = models.IntegerField()  # 使用ポイント数
    commission = models.IntegerField(default=0)  # 手数料
    commission_tax = models.IntegerField(default=0)  # 手数料消費税
    total_cost = models.IntegerField()  # 総額
    
    # ステータス・日時
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    expire_at = models.DateTimeField()  # ギフト有効期限
    purchased_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)
    
    # API連携情報
    partner_request_id = models.CharField(max_length=40)  # パートナーAPIリクエストID
    partner_response = models.JSONField(default=dict)  # パートナーAPIレスポンス
    
    class Meta:
        ordering = ['-purchased_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['status', 'expire_at']),
            models.Index(fields=['gift_code']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.brand.name} {self.price}円 ({self.status})"
    
    def is_expired(self):
        """ギフトが期限切れかチェック"""
        return timezone.now() > self.expire_at
    
    def can_be_used(self):
        """ギフトが使用可能かチェック"""
        return self.status == 'completed' and not self.is_expired()


class DigitalGiftUsageLog(models.Model):
    """デジタルギフト使用履歴"""
    gift_purchase = models.ForeignKey(DigitalGiftPurchase, on_delete=models.CASCADE, related_name='usage_logs')
    
    # 使用情報
    used_amount = models.IntegerField()  # 使用金額
    exchange_brand = models.CharField(max_length=50)  # 交換先ブランド
    exchange_reference = models.CharField(max_length=255, blank=True)  # 交換先参照ID
    
    # メタデータ
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    used_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-used_at']
    
    def __str__(self):
        return f"{self.gift_purchase.gift_code} - {self.used_amount}円 ({self.exchange_brand})"


class PointPurchaseTransaction(models.Model):
    """ポイント購入取引（従量課金）"""
    PAYMENT_STATUS_CHOICES = [
        ('pending', '処理中'),
        ('success', '成功'),
        ('failed_card', 'カード決済失敗'),
        ('failed_deposit', 'デポジット不足'),
        ('refunded', '返金済み'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('credit_card', 'クレジットカード'),
        ('deposit', 'デポジット'),
    ]
    
    # 基本情報
    transaction_id = models.CharField(max_length=40, unique=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='point_purchases')
    target_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='point_purchases_received')
    
    # ポイント・価格情報
    points_amount = models.IntegerField()  # 付与ポイント数
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=1.08)  # 1ポイント単価（税込）
    subtotal = models.IntegerField()  # 小計
    tax = models.IntegerField()  # 消費税
    total_amount = models.IntegerField()  # 総額
    
    # 決済情報
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    card_payment_id = models.CharField(max_length=100, blank=True)  # カード決済ID
    deposit_transaction = models.ForeignKey('DepositTransaction', on_delete=models.SET_NULL, null=True, blank=True)
    
    # メタデータ
    description = models.TextField(blank=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # 請求関連
    monthly_billing = models.ForeignKey('MonthlyBilling', on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['store', 'payment_status']),
            models.Index(fields=['target_user', 'created_at']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['monthly_billing']),
        ]
    
    def __str__(self):
        return f"{self.store.name} → {self.target_user.username}: {self.points_amount}pt (¥{self.total_amount})"
    
    def save(self, *args, **kwargs):
        if not self.transaction_id:
            from datetime import datetime
            self.transaction_id = f"PP{datetime.now().strftime('%Y%m%d%H%M%S')}{self.pk or ''}"
        
        # 金額自動計算
        if not self.subtotal:
            self.subtotal = int(self.points_amount * float(self.unit_price) / 1.08)  # 税抜き
            self.tax = int(self.subtotal * 0.08)  # 8%消費税
            self.total_amount = self.subtotal + self.tax
        
        super().save(*args, **kwargs)


class MonthlyBilling(models.Model):
    """月次請求"""
    BILLING_STATUS_CHOICES = [
        ('draft', '下書き'),
        ('finalized', '確定'),
        ('sent', '送信済み'),
        ('paid', '支払い済み'),
        ('overdue', '延滞'),
        ('cancelled', 'キャンセル'),
    ]
    
    # 基本情報
    billing_id = models.CharField(max_length=40, unique=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='monthly_billings')
    
    # 請求期間
    billing_year = models.IntegerField()
    billing_month = models.IntegerField()
    billing_period_start = models.DateField()
    billing_period_end = models.DateField()
    
    # 請求金額
    total_points_purchased = models.IntegerField(default=0)  # 総購入ポイント数
    subtotal = models.IntegerField(default=0)  # 小計
    tax = models.IntegerField(default=0)  # 消費税
    total_amount = models.IntegerField(default=0)  # 総額
    deposit_used = models.IntegerField(default=0)  # デポジット使用額
    credit_charged = models.IntegerField(default=0)  # クレジット請求額
    
    # ステータス・日時
    status = models.CharField(max_length=20, choices=BILLING_STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    finalized_at = models.DateTimeField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    # メタデータ
    invoice_pdf_path = models.CharField(max_length=500, blank=True)  # 請求書PDF保存パス
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-billing_year', '-billing_month']
        unique_together = ['store', 'billing_year', 'billing_month']
        indexes = [
            models.Index(fields=['store', 'billing_year', 'billing_month']),
            models.Index(fields=['status', 'due_date']),
            models.Index(fields=['billing_id']),
        ]
    
    def __str__(self):
        return f"{self.store.name} - {self.billing_year}/{self.billing_month:02d} (¥{self.total_amount})"
    
    def save(self, *args, **kwargs):
        if not self.billing_id:
            self.billing_id = f"BILL{self.billing_year}{self.billing_month:02d}{self.store.id}"
        super().save(*args, **kwargs)
    
    @property
    def billing_period_display(self):
        return f"{self.billing_year}年{self.billing_month}月"
    
    def calculate_totals(self):
        """関連する取引から金額を再計算"""
        transactions = self.pointpurchasetransaction_set.filter(payment_status='success')
        
        self.total_points_purchased = sum(t.points_amount for t in transactions)
        self.subtotal = sum(t.subtotal for t in transactions)
        self.tax = sum(t.tax for t in transactions)
        self.total_amount = sum(t.total_amount for t in transactions)
        
        # 決済方法別集計
        self.deposit_used = sum(
            t.total_amount for t in transactions 
            if t.payment_method == 'deposit'
        )
        self.credit_charged = sum(
            t.total_amount for t in transactions 
            if t.payment_method == 'credit_card'
        )
        
        self.save()


# Store モデルに新しいメソッドを追加
class StorePointPurchaseManager:
    """店舗のポイント購入管理"""
    
    def __init__(self, store):
        self.store = store
    
    def purchase_points_for_user(self, user, points, description="", force_payment_method=None):
        """ユーザーにポイントを付与（従量課金）"""
        from decimal import Decimal
        
        # 取引作成
        transaction = PointPurchaseTransaction(
            store=self.store,
            target_user=user,
            points_amount=points,
            description=description or f"{self.store.name}でのポイント付与"
        )
        transaction.save()  # 金額は自動計算される
        
        try:
            # 決済方法決定
            if force_payment_method:
                payment_method = force_payment_method
            else:
                # デフォルト: クレジットカード優先、失敗時デポジット
                payment_method = 'credit_card'
            
            if payment_method == 'credit_card':
                # クレジットカード決済を試行
                success = self._process_credit_card_payment(transaction)
                if not success:
                    # 失敗時はデポジットにフォールバック
                    payment_method = 'deposit'
            
            if payment_method == 'deposit':
                # デポジット決済
                success = self._process_deposit_payment(transaction)
                if not success:
                    transaction.payment_status = 'failed_deposit'
                    transaction.error_message = "デポジット残高不足"
                    transaction.save()
                    raise ValueError("デポジット残高不足のため決済できません")
            
            if success:
                # ポイント付与
                user.add_points(points, source_description=transaction.description)
                transaction.payment_status = 'success'
                transaction.completed_at = timezone.now()
                transaction.save()
                
                # 月次請求に追加
                self._add_to_monthly_billing(transaction)
                
                return transaction
        
        except Exception as e:
            transaction.error_message = str(e)
            transaction.save()
            raise
    
    def _process_credit_card_payment(self, transaction):
        """クレジットカード決済処理（モック）"""
        # 実際の実装では決済ゲートウェイ API を呼び出し
        import random
        success_rate = 0.95  # 95%成功率でシミュレート
        
        if random.random() < success_rate:
            transaction.payment_method = 'credit_card'
            transaction.card_payment_id = f"CARD_{timezone.now().strftime('%Y%m%d%H%M%S')}"
            return True
        else:
            transaction.error_message = "クレジットカード決済エラー（シミュレート）"
            return False
    
    def _process_deposit_payment(self, transaction):
        """デポジット決済処理"""
        deposit_service = DepositService(self.store)
        
        if deposit_service.get_current_balance() >= transaction.total_amount:
            # デポジット使用記録
            deposit_transaction = DepositTransaction.objects.create(
                store=self.store,
                transaction_type='usage',
                amount=-transaction.total_amount,
                description=f"ポイント購入: {transaction.points_amount}pt",
                reference_id=transaction.transaction_id
            )
            
            transaction.payment_method = 'deposit'
            transaction.deposit_transaction = deposit_transaction
            return True
        else:
            return False
    
    def _add_to_monthly_billing(self, transaction):
        """月次請求に取引を追加"""
        from datetime import date
        current_date = date.today()
        
        billing, created = MonthlyBilling.objects.get_or_create(
            store=self.store,
            billing_year=current_date.year,
            billing_month=current_date.month,
            defaults={
                'billing_period_start': current_date.replace(day=1),
                'billing_period_end': (current_date.replace(day=1) + timezone.timedelta(days=32)).replace(day=1) - timezone.timedelta(days=1),
                'due_date': current_date.replace(day=1) + timezone.timedelta(days=35),  # 翌月5日
            }
        )
        
        transaction.monthly_billing = billing
        transaction.save()
        
        # 請求額を再計算
        billing.calculate_totals()


# Store モデルにマネージャーメソッドを追加するためのプロパティ
def store_point_purchase_manager(self):
    if not hasattr(self, '_point_purchase_manager'):
        self._point_purchase_manager = StorePointPurchaseManager(self)
    return self._point_purchase_manager

Store.point_purchase_manager = property(store_point_purchase_manager)


# ====================
# 決済システム関連モデル
# ====================

class PaymentTransaction(models.Model):
    """決済取引メインテーブル"""
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
        ('partial_refunded', 'Partial Refunded'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('qr', 'QR Code Payment'),
        ('nfc', 'NFC Payment'),
        ('cash', 'Cash Payment'),
        ('card', 'Credit Card'),
        ('points', 'Points Payment'),
        ('deposit', 'Store Deposit'),
    ]
    
    TRANSACTION_TYPE_CHOICES = [
        ('payment', 'Payment'),
        ('refund', 'Refund'),
        ('points_grant', 'Points Grant'),
    ]
    
    # 基本情報
    transaction_id = models.CharField(max_length=100, unique=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_transactions')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='payment_transactions')
    terminal_id = models.CharField(max_length=50, blank=True)
    
    # 取引詳細
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES, default='payment')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    # 金額関連
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # ポイント関連
    points_earned = models.IntegerField(default=0)
    points_used = models.IntegerField(default=0)
    points_balance_before = models.IntegerField(default=0)
    points_balance_after = models.IntegerField(default=0)
    
    # 外部システム連携
    gmopg_order_id = models.CharField(max_length=100, blank=True, null=True)
    gmopg_transaction_id = models.CharField(max_length=100, blank=True, null=True)
    fincode_payment_id = models.CharField(max_length=100, blank=True, null=True)
    fincode_order_id = models.CharField(max_length=100, blank=True, null=True)
    external_payment_data = models.JSONField(default=dict, blank=True)
    
    # メタデータ
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    # タイムスタンプ
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # レシート関連
    receipt_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    receipt_generated = models.BooleanField(default=False)
    receipt_emailed = models.BooleanField(default=False)
    receipt_email_sent_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['customer', '-created_at']),
            models.Index(fields=['store', '-created_at']),
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['gmopg_order_id']),
            models.Index(fields=['fincode_payment_id']),
        ]
    
    def __str__(self):
        return f"{self.transaction_id} - {self.customer.username} - ¥{self.total_amount}"
    
    def generate_receipt_number(self):
        """レシート番号生成"""
        if not self.receipt_number:
            from datetime import datetime
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            self.receipt_number = f"R-{timestamp}-{self.id}"
            self.save()
    
    def mark_completed(self):
        """取引完了処理"""
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.generate_receipt_number()
        self.save()


class PaymentTransactionItem(models.Model):
    """決済取引明細"""
    transaction = models.ForeignKey(PaymentTransaction, on_delete=models.CASCADE, related_name='items')
    
    # 商品情報
    item_name = models.CharField(max_length=200)
    item_code = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=100, blank=True)
    
    # 価格・数量
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    
    # 税金
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # メタデータ
    metadata = models.JSONField(default=dict, blank=True)
    
    def save(self, *args, **kwargs):
        # 小計と税額を自動計算
        self.subtotal = self.unit_price * self.quantity
        self.tax_amount = self.subtotal * (self.tax_rate / 100)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.item_name} x{self.quantity} - ¥{self.subtotal}"


class PaymentLog(models.Model):
    """決済処理ログ"""
    LOG_LEVEL_CHOICES = [
        ('debug', 'Debug'),
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('critical', 'Critical'),
    ]
    
    transaction = models.ForeignKey(PaymentTransaction, on_delete=models.CASCADE, related_name='logs')
    level = models.CharField(max_length=10, choices=LOG_LEVEL_CHOICES, default='info')
    message = models.TextField()
    details = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.level.upper()}: {self.message[:50]}"


class Receipt(models.Model):
    """レシート管理"""
    RECEIPT_STATUS_CHOICES = [
        ('generated', 'Generated'),
        ('emailed', 'Emailed'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
    ]
    
    transaction = models.OneToOneField(PaymentTransaction, on_delete=models.CASCADE, related_name='receipt')
    receipt_number = models.CharField(max_length=50, unique=True)
    
    # レシートデータ
    receipt_data = models.JSONField(default=dict)
    pdf_file_path = models.CharField(max_length=500, blank=True)
    
    # 配信情報
    email_recipient = models.EmailField(blank=True, null=True)
    email_sent_at = models.DateTimeField(null=True, blank=True)
    app_delivered_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=RECEIPT_STATUS_CHOICES, default='generated')
    
    # タイムスタンプ
    generated_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-generated_at']
    
    def __str__(self):
        return f"Receipt {self.receipt_number} - {self.transaction.customer.username}"


class StoreConfiguration(models.Model):
    """店舗設定（税率、レシート設定等）"""
    store = models.OneToOneField(Store, on_delete=models.CASCADE, related_name='configuration')
    
    # 税率設定
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    tax_inclusive = models.BooleanField(default=True)
    
    # レシート設定
    receipt_logo_url = models.URLField(blank=True)
    receipt_footer_message = models.TextField(blank=True, default="Thank you for your visit!")
    receipt_template = models.CharField(max_length=50, default='standard')
    
    # 決済設定
    gmopg_shop_id = models.CharField(max_length=100, blank=True)
    gmopg_api_key = models.CharField(max_length=200, blank=True)
    payment_timeout_seconds = models.IntegerField(default=300)
    
    # ポイント設定
    point_rate = models.DecimalField(max_digits=5, decimal_places=2, default=1.0)
    minimum_payment_for_points = models.DecimalField(max_digits=10, decimal_places=2, default=100)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Config for {self.store.name}"
