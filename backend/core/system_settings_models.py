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
    """
    # 基本設定
    site_name = models.CharField(
        max_length=100, 
        default="biid Point Management",
        verbose_name="サイト名"
    )
    site_description = models.TextField(
        blank=True,
        default="革新的なポイント管理システム",
        verbose_name="サイト説明"
    )
    
    # サポート情報
    support_email = models.EmailField(
        default="support@biid.com",
        validators=[EmailValidator()],
        verbose_name="サポートメール"
    )
    support_phone = models.CharField(
        max_length=20,
        default="03-1234-5678",
        verbose_name="サポート電話"
    )
    
    # 運営エリア
    operation_area = models.CharField(
        max_length=100,
        default="大阪（北新地・ミナミエリア）",
        verbose_name="運営エリア"
    )
    
    # タイムゾーン設定
    timezone = models.CharField(
        max_length=50,
        default="Asia/Tokyo",
        choices=[
            ('Asia/Tokyo', 'Asia/Tokyo'),
            ('UTC', 'UTC'),
            ('Asia/Seoul', 'Asia/Seoul'),
        ],
        verbose_name="タイムゾーン"
    )
    
    # システム状態
    maintenance_mode = models.BooleanField(
        default=False,
        verbose_name="メンテナンスモード"
    )
    debug_mode = models.BooleanField(
        default=False,
        verbose_name="デバッグモード"
    )
    
    # メンテナンス情報
    maintenance_message = models.TextField(
        blank=True,
        default="現在システムメンテナンス中です。しばらくお待ちください。",
        verbose_name="メンテナンスメッセージ"
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
        verbose_name = "システム設定"
        verbose_name_plural = "システム設定"
        
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
        verbose_name="SMTPパスワード"
    )
    smtp_use_tls = models.BooleanField(
        default=True,
        verbose_name="TLS使用"
    )
    
    # 送信者情報
    from_email = models.EmailField(
        default="noreply@biid.com",
        verbose_name="送信元メールアドレス"
    )
    from_name = models.CharField(
        max_length=100,
        default="BIID Point System",
        verbose_name="送信者名"
    )
    
    # 通知設定
    enable_welcome_email = models.BooleanField(
        default=True,
        verbose_name="ウェルカムメール送信"
    )
    enable_point_notification = models.BooleanField(
        default=True,
        verbose_name="ポイント通知"
    )
    enable_gift_notification = models.BooleanField(
        default=True,
        verbose_name="ギフト通知"
    )
    enable_promotion_email = models.BooleanField(
        default=True,
        verbose_name="プロモーションメール"
    )
    
    # バッチ送信設定
    email_batch_size = models.IntegerField(
        default=100,
        validators=[MinValueValidator(1), MaxValueValidator(1000)],
        verbose_name="メールバッチサイズ"
    )
    email_rate_limit = models.IntegerField(
        default=60,
        validators=[MinValueValidator(1), MaxValueValidator(3600)],
        verbose_name="メール送信間隔（秒）"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "通知設定"
        verbose_name_plural = "通知設定"
    
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
    セキュリティ関連の設定
    """
    # ログイン設定
    max_login_attempts = models.IntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(20)],
        verbose_name="最大ログイン試行回数"
    )
    login_lockout_duration_minutes = models.IntegerField(
        default=30,
        validators=[MinValueValidator(1), MaxValueValidator(1440)],
        verbose_name="ログインロック時間（分）"
    )
    
    # セッション設定
    session_timeout_minutes = models.IntegerField(
        default=60,
        validators=[MinValueValidator(5), MaxValueValidator(720)],
        verbose_name="セッションタイムアウト（分）"
    )
    
    # API制限設定
    api_rate_limit_per_minute = models.IntegerField(
        default=100,
        validators=[MinValueValidator(1), MaxValueValidator(10000)],
        verbose_name="API制限（回/分）"
    )
    api_rate_limit_per_hour = models.IntegerField(
        default=1000,
        validators=[MinValueValidator(10), MaxValueValidator(100000)],
        verbose_name="API制限（回/時）"
    )
    
    # IP制限
    enable_ip_whitelist = models.BooleanField(
        default=False,
        verbose_name="IP許可リスト有効"
    )
    allowed_ip_addresses = models.TextField(
        blank=True,
        help_text="カンマ区切りでIPアドレスを入力",
        verbose_name="許可IPアドレス"
    )
    
    # 2FA設定
    enforce_2fa_for_admin = models.BooleanField(
        default=True,
        verbose_name="管理者2FA必須"
    )
    enforce_2fa_for_store = models.BooleanField(
        default=False,
        verbose_name="店舗2FA必須"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "セキュリティ設定"
        verbose_name_plural = "セキュリティ設定"
    
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