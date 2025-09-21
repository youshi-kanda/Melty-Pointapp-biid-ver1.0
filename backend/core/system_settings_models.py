"""
BIID Point App システム設定モデル
運営管理画面のシステム設定機能に対応するモデル群
"""

from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator, EmailValidator
import json


class SystemSettings(models.Model):
    """
    システム全体の設定を管理するシングルトンモデル
    対象: システム全体 + ユーザー向け表示情報
    """
    # 基本設定 [システム全体]
    site_name = models.CharField(
        max_length=100, 
        default="biid Point Management",
        verbose_name="サイト名 [全インターフェース]",
        help_text="全インターフェース（運営・店舗・ユーザー・決済端末）のタイトルに表示"
    )
    site_description = models.TextField(
        blank=True,
        default="革新的なポイント管理システム",
        verbose_name="サイト説明 [システム全体]",
        help_text="システム全体のメタ情報として使用"
    )
    
    # サポート情報 [ユーザー向け]
    support_email = models.EmailField(
        default="support@biid.com",
        validators=[EmailValidator()],
        verbose_name="サポートメール [ユーザー向け]",
        help_text="ユーザー画面でのサポート情報表示"
    )
    support_phone = models.CharField(
        max_length=20,
        default="03-1234-5678",
        verbose_name="サポート電話 [ユーザー向け]",
        help_text="ユーザー画面でのサポート情報表示"
    )
    
    # 運営エリア [ユーザー向け]
    operation_area = models.CharField(
        max_length=100,
        default="大阪（北新地・ミナミエリア）",
        verbose_name="運営エリア [ユーザー向け]",
        help_text="ユーザーに対するサービスエリア表示"
    )
    
    # タイムゾーン設定 [システム全体]
    timezone = models.CharField(
        max_length=50,
        default="Asia/Tokyo",
        choices=[
            ('Asia/Tokyo', 'Asia/Tokyo'),
            ('UTC', 'UTC'),
            ('Asia/Seoul', 'Asia/Seoul'),
        ],
        verbose_name="タイムゾーン [システム全体]",
        help_text="全システムの時刻表示・処理に影響"
    )
    
    # システム状態 [システム全体]
    maintenance_mode = models.BooleanField(
        default=False,
        verbose_name="メンテナンスモード [システム全体]",
        help_text="全システムアクセスを制御"
    )
    debug_mode = models.BooleanField(
        default=False,
        verbose_name="デバッグモード [システム全体]",
        help_text="システム全体のログレベル・エラー表示を制御"
    )
    
    # メンテナンス情報 [ユーザー向け]
    maintenance_message = models.TextField(
        blank=True,
        default="現在システムメンテナンス中です。しばらくお待ちください。",
        verbose_name="メンテナンスメッセージ [ユーザー向け]",
        help_text="ユーザー向けメンテナンス画面で表示"
    )
    maintenance_start_time = models.DateTimeField(
        null=True, blank=True,
        verbose_name="メンテナンス開始時刻"
    )
    maintenance_end_time = models.DateTimeField(
        null=True, blank=True,
        verbose_name="メンテナンス終了予定時刻"
    )
    
    # 更新情報
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        'User', on_delete=models.SET_NULL, null=True, blank=True,
        verbose_name="更新者"
    )
    
    class Meta:
        verbose_name = "一般設定 (システム全体+ユーザー向け)"
        verbose_name_plural = "一般設定 (システム全体+ユーザー向け)"
        
    def __str__(self):
        return self.site_name
    
    def save(self, *args, **kwargs):
        # シングルトンパターンの実装
        self.pk = 1
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        # 削除を防ぐ
        pass
    
    @classmethod
    def get_settings(cls):
        """設定のシングルトンインスタンスを取得"""
        settings, created = cls.objects.get_or_create(pk=1)
        return settings


class PaymentSettings(models.Model):
    """
    決済関連の設定
    """
    # FINCODE設定
    fincode_api_key = models.CharField(
        max_length=200,
        default="p_test_YTY3YTRkZDMtOWIzNS00ODlhLTkzZDYtMzQzYWE5ZDQyMDQ5",
        verbose_name="FINCODE APIキー"
    )
    fincode_secret_key = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="FINCODE シークレットキー"
    )
    fincode_shop_id = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="FINCODE ショップID"
    )
    fincode_is_production = models.BooleanField(
        default=False,
        verbose_name="FINCODE 本番環境"
    )
    
    # 決済設定
    payment_timeout_seconds = models.IntegerField(
        default=300,
        validators=[MinValueValidator(60), MaxValueValidator(1800)],
        verbose_name="決済タイムアウト（秒）"
    )
    max_payment_amount = models.DecimalField(
        max_digits=10, decimal_places=2,
        default=500000.00,
        verbose_name="最大決済金額"
    )
    min_payment_amount = models.DecimalField(
        max_digits=10, decimal_places=2,
        default=100.00,
        verbose_name="最小決済金額"
    )
    
    # ポイント設定
    default_point_rate = models.DecimalField(
        max_digits=5, decimal_places=2,
        default=1.0,
        validators=[MinValueValidator(0.1), MaxValueValidator(10.0)],
        verbose_name="デフォルトポイント還元率（%）"
    )
    point_expiry_months = models.IntegerField(
        default=12,
        validators=[MinValueValidator(1), MaxValueValidator(60)],
        verbose_name="ポイント有効期限（月）"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "決済設定"
        verbose_name_plural = "決済設定"
    
    def __str__(self):
        return "決済設定"
    
    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(pk=1)
        return settings


class NotificationSettings(models.Model):
    """
    通知関連の設定
    """
    # メール設定
    smtp_host = models.CharField(
        max_length=200,
        default="smtp.gmail.com",
        verbose_name="SMTPホスト"
    )
    smtp_port = models.IntegerField(
        default=587,
        validators=[MinValueValidator(1), MaxValueValidator(65535)],
        verbose_name="SMTPポート"
    )
    smtp_username = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="SMTPユーザー名"
    )
    smtp_password = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="SMTPパスワード [システム全体]",
        help_text="全システムからのメール送信基盤"
    )
    smtp_use_tls = models.BooleanField(
        default=True,
        verbose_name="TLS使用 [システム全体]",
        help_text="全システムからのメール送信基盤"
    )
    
    # 送信者情報 [システム全体]
    from_email = models.EmailField(
        default="noreply@biid.com",
        verbose_name="送信元メールアドレス [システム全体]",
        help_text="全システムからのメール送信者情報"
    )
    from_name = models.CharField(
        max_length=100,
        default="BIID Point System",
        verbose_name="送信者名 [システム全体]",
        help_text="全システムからのメール送信者情報"
    )
    
    # 通知設定 [ユーザー向け]
    enable_welcome_email = models.BooleanField(
        default=True,
        verbose_name="ウェルカムメール送信 [ユーザー向け]",
        help_text="新規ユーザー登録時の自動メール"
    )
    enable_point_notification = models.BooleanField(
        default=True,
        verbose_name="ポイント通知 [ユーザー向け]",
        help_text="ユーザーのポイント付与・消費通知"
    )
    enable_gift_notification = models.BooleanField(
        default=True,
        verbose_name="ギフト通知 [ユーザー向け]",
        help_text="ギフト交換通知"
    )
    enable_promotion_email = models.BooleanField(
        default=True,
        verbose_name="プロモーションメール [ユーザー向け]",
        help_text="プロモーション・キャンペーンメール"
    )
    
    # バッチ送信設定 [システム全体]
    email_batch_size = models.IntegerField(
        default=100,
        validators=[MinValueValidator(1), MaxValueValidator(1000)],
        verbose_name="メールバッチサイズ [システム全体]",
        help_text="システム全体のメール送信パフォーマンス制御"
    )
    email_rate_limit = models.IntegerField(
        default=60,
        validators=[MinValueValidator(1), MaxValueValidator(3600)],
        verbose_name="メール送信間隔 [システム全体]",
        help_text="システム全体のメール送信パフォーマンス制御(秒)"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "通知設定 (システム全体+ユーザー向け)"
        verbose_name_plural = "通知設定 (システム全体+ユーザー向け)"
    
    def __str__(self):
        return "通知設定"
    
    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(pk=1)
        return settings


class SecuritySettings(models.Model):
    """
    セキュリティ設定
    対象: システム全体(ログイン制御・API制限) + 管理者・店舗向け(2FA設定)
    """
    # ログイン制御 [システム全体]
    max_login_attempts = models.IntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(20)],
        verbose_name="最大ログイン試行回数 [システム全体]",
        help_text="全ユーザー種別のログインセキュリティ"
    )
    login_lockout_duration_minutes = models.IntegerField(
        default=30,
        validators=[MinValueValidator(1), MaxValueValidator(1440)],
        verbose_name="ログインロック時間 [システム全体]",
        help_text="全ユーザー種別のログインセキュリティ(分)"
    )
    
    # セッション設定 [システム全体]
    session_timeout_minutes = models.IntegerField(
        default=60,
        validators=[MinValueValidator(5), MaxValueValidator(720)],
        verbose_name="セッションタイムアウト [システム全体]",
        help_text="全インターフェースのセッション管理(分)"
    )
    
    # API制限設定 [システム全体]
    api_rate_limit_per_minute = models.IntegerField(
        default=100,
        validators=[MinValueValidator(1), MaxValueValidator(10000)],
        verbose_name="API制限(分) [システム全体]",
        help_text="全システムのAPI使用制限(回/分)"
    )
    api_rate_limit_per_hour = models.IntegerField(
        default=1000,
        validators=[MinValueValidator(10), MaxValueValidator(100000)],
        verbose_name="API制限(時) [システム全体]",
        help_text="全システムのAPI使用制限(回/時)"
    )
    
    # IP制限 [システム全体]
    enable_ip_whitelist = models.BooleanField(
        default=False,
        verbose_name="IP許可リスト有効 [システム全体]",
        help_text="システムアクセス制御"
    )
    allowed_ip_addresses = models.TextField(
        blank=True,
        help_text="システムアクセス制御 - カンマ区切りでIPアドレスを入力",
        verbose_name="許可IPアドレス [システム全体]"
    )
    
    # 2FA設定 [ユーザー種別別]
    enforce_2fa_for_admin = models.BooleanField(
        default=True,
        verbose_name="管理者2FA必須 [管理者向け]",
        help_text="運営管理画面ユーザー向け"
    )
    enforce_2fa_for_store = models.BooleanField(
        default=False,
        verbose_name="店舗2FA必須 [店舗向け]",
        help_text="店舗管理画面ユーザー向け"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "セキュリティ設定 (システム全体+管理者・店舗向け)"
        verbose_name_plural = "セキュリティ設定 (システム全体+管理者・店舗向け)"
    
    def __str__(self):
        return "セキュリティ設定"
    
    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(pk=1)
        return settings
    
    def get_allowed_ips(self):
        """許可IPアドレスのリストを返す"""
        if not self.allowed_ip_addresses:
            return []
        return [ip.strip() for ip in self.allowed_ip_addresses.split(',') if ip.strip()]