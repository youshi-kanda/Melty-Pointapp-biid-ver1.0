"""
BIID Point App 本番環境用 Django Admin 設定（修正版）
実際のモデルフィールドに合わせて調整
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.db.models import Count, Sum
from django.utils import timezone

from .models import (
    # 基本モデルのみ確実に存在するものを登録
    User, Store, PointTransaction, AccountRank, 
    PaymentTransaction, Receipt, Notification,
    Gift, GiftCategory, SecurityLog, AuditLog,
    MeltyRankConfiguration, APIAccessKey, DigitalGiftBrand,
    DigitalGiftPurchaseID, DigitalGiftPurchase
)

# ===== 基本設定 =====
class BaseAdmin(admin.ModelAdmin):
    """全Adminクラスの基底クラス"""
    save_as = True
    save_on_top = True


# ===== ユーザー・認証関連 =====
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'member_id', 'point_balance_display', 'rank', 'melty_linked_status', 'status', 'registration_date')
    list_filter = ('status', 'rank', 'registration_source', 'is_melty_linked', 'registration_date')
    search_fields = ('username', 'email', 'member_id')
    date_hierarchy = 'registration_date'
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('BIID Point System', {
            'fields': ('member_id', 'rank', 'status', 'location', 'avatar')
        }),
        ('MELTY Integration', {
            'fields': ('is_melty_linked', 'melty_user_id', 'melty_email', 'melty_connected_at', 'registration_source'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = BaseUserAdmin.readonly_fields + ('melty_connected_at', 'registration_date')
    
    actions = ['reset_melty_link', 'upgrade_to_silver', 'upgrade_to_gold', 'suspend_users', 'activate_users']
    
    def point_balance_display(self, obj):
        return f"{obj.point_balance:,}pt" if hasattr(obj, 'point_balance') else "0pt"
    point_balance_display.short_description = 'ポイント残高'
    
    def melty_linked_status(self, obj):
        if obj.is_melty_linked:
            return format_html('<span style="color: green;">✓ 連携済み</span>')
        return format_html('<span style="color: red;">× 未連携</span>')
    melty_linked_status.short_description = 'MELTY連携'
    
    # カスタムアクション
    def reset_melty_link(self, request, queryset):
        count = queryset.filter(is_melty_linked=True).update(
            is_melty_linked=False, melty_user_id=None, melty_email=None
        )
        self.message_user(request, f'{count}件のMELTY連携をリセットしました。')
    
    def suspend_users(self, request, queryset):
        count = queryset.update(status='suspended')
        self.message_user(request, f'{count}件のユーザーを停止しました。')
    
    def activate_users(self, request, queryset):
        count = queryset.update(status='active')
        self.message_user(request, f'{count}件のユーザーを有効化しました。')


@admin.register(AccountRank)
class AccountRankAdmin(BaseAdmin):
    list_display = ('rank', 'required_points', 'required_transactions', 'point_multiplier', 'user_count')
    list_filter = ('rank',)
    ordering = ['required_points']
    
    def user_count(self, obj):
        return User.objects.filter(rank=obj.rank).count()
    user_count.short_description = '該当ユーザー数'


# ===== 店舗関連 =====
@admin.register(Store)
class StoreAdmin(BaseAdmin):
    list_display = ('name', 'owner_name', 'category', 'status', 'registration_date')
    list_filter = ('status', 'category', 'registration_date')
    search_fields = ('name', 'owner_name', 'email')
    date_hierarchy = 'registration_date'
    readonly_fields = ('registration_date',)


# ===== 決済・金融関連 =====
@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(BaseAdmin):
    list_display = ('transaction_id', 'customer', 'store', 'total_amount', 'payment_method', 'status', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('transaction_id', 'customer__username', 'store__name')
    date_hierarchy = 'created_at'
    readonly_fields = ('transaction_id', 'created_at', 'completed_at')


@admin.register(Receipt)
class ReceiptAdmin(BaseAdmin):
    list_display = ('receipt_number', 'transaction', 'status', 'generated_at')
    list_filter = ('status', 'generated_at')
    search_fields = ('receipt_number', 'transaction__transaction_id')
    readonly_fields = ('generated_at',)


# ===== ポイントシステム =====
@admin.register(PointTransaction)
class PointTransactionAdmin(BaseAdmin):
    list_display = ('id', 'user', 'store', 'points', 'transaction_type', 'created_at')
    list_filter = ('transaction_type', 'created_at')
    search_fields = ('user__username', 'store__name', 'description')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)


# ===== ギフト・商品関連 =====
@admin.register(Gift)
class GiftAdmin(BaseAdmin):
    list_display = ('name', 'category', 'points_required', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'description')
    
    fieldsets = (
        ('基本情報', {
            'fields': ('name', 'category', 'description', 'image_url')
        }),
        ('ポイント設定', {
            'fields': ('points_required',)
        }),
    )


@admin.register(GiftCategory)
class GiftCategoryAdmin(BaseAdmin):
    list_display = ('name', 'gift_count')
    search_fields = ('name', 'description')
    
    def gift_count(self, obj):
        return obj.gift_set.count()
    gift_count.short_description = 'ギフト数'


# ===== 通知・コミュニケーション =====
@admin.register(Notification)
class NotificationAdmin(BaseAdmin):
    list_display = ('user', 'notification_type', 'title', 'is_read', 'is_sent', 'created_at')
    list_filter = ('notification_type', 'is_read', 'is_sent', 'created_at')
    search_fields = ('user__username', 'title')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)


# ===== セキュリティ・監査 =====
@admin.register(SecurityLog)
class SecurityLogAdmin(BaseAdmin):
    list_display = ('user', 'event_type', 'ip_address', 'user_agent_short', 'timestamp')
    list_filter = ('event_type', 'timestamp')
    search_fields = ('user__username', 'ip_address')
    date_hierarchy = 'timestamp'
    readonly_fields = ('timestamp',)
    
    def user_agent_short(self, obj):
        return obj.user_agent[:50] + '...' if len(obj.user_agent) > 50 else obj.user_agent
    user_agent_short.short_description = 'User Agent'


@admin.register(AuditLog)
class AuditLogAdmin(BaseAdmin):
    list_display = ('user', 'action_type', 'object_type', 'object_id', 'timestamp')
    list_filter = ('action_type', 'object_type', 'timestamp')
    search_fields = ('user__username', 'object_repr')
    date_hierarchy = 'timestamp'
    readonly_fields = ('timestamp',)


# ===== EC・外部連携 =====
@admin.register(MeltyRankConfiguration)
class MeltyRankConfigurationAdmin(BaseAdmin):
    list_display = ('melty_membership_type', 'biid_initial_rank', 'welcome_bonus_points', 'is_active')
    list_filter = ('is_active', 'biid_initial_rank', 'melty_membership_type')
    list_editable = ('welcome_bonus_points', 'is_active')
    
    fieldsets = (
        ('MELTY会員種別', {
            'fields': ('melty_membership_type', 'biid_initial_rank')
        }),
        ('ウェルカムボーナス設定', {
            'fields': ('welcome_bonus_points', 'points_expiry_months')
        }),
        ('会員ID設定', {
            'fields': ('member_id_prefix',)
        }),
        ('状態・説明', {
            'fields': ('is_active', 'description')
        }),
    )


# ===== デジタルギフトAPI関連 =====
@admin.register(APIAccessKey)
class APIAccessKeyAdmin(BaseAdmin):
    """RealPay APIアクセスキー管理"""
    list_display = ('key_display', 'is_active', 'created_at', 'last_used')
    list_filter = ('is_active', 'created_at')
    search_fields = ('key',)
    readonly_fields = ('created_at', 'last_used')
    
    fieldsets = (
        ('API認証情報', {
            'fields': ('key', 'shared_secret', 'is_active')
        }),
        ('TOTP設定', {
            'fields': ('time_step', 'totp_digits'),
            'classes': ('collapse',)
        }),
        ('利用状況', {
            'fields': ('created_at', 'last_used'),
            'classes': ('collapse',)
        }),
    )
    
    def key_display(self, obj):
        """キーを部分的に表示"""
        return f"{obj.key[:20]}..." if obj.key else ""
    key_display.short_description = 'APIキー'
    
    def save_model(self, request, obj, form, change):
        """保存時にバリデーション"""
        if len(obj.key) != 40:
            from django.contrib import messages
            messages.error(request, 'APIキーは40文字である必要があります')
            return
        super().save_model(request, obj, form, change)


@admin.register(DigitalGiftBrand)
class DigitalGiftBrandAdmin(BaseAdmin):
    """デジタルギフトブランド管理"""
    list_display = ('code', 'name', 'min_price_display', 'max_price_display', 'commission_rate', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('code', 'name')
    
    fieldsets = (
        ('基本情報', {
            'fields': ('code', 'name', 'description', 'logo_url')
        }),
        ('金額設定', {
            'fields': ('min_price', 'max_price', 'supported_prices')
        }),
        ('手数料設定', {
            'fields': ('commission_rate', 'commission_tax_rate')
        }),
        ('状態', {
            'fields': ('is_active',)
        }),
    )
    
    def min_price_display(self, obj):
        return f"¥{obj.min_price:,}" if obj.min_price else "¥0"
    min_price_display.short_description = '最小金額'
    
    def max_price_display(self, obj):
        return f"¥{obj.max_price:,}" if obj.max_price else "¥0"
    max_price_display.short_description = '最大金額'
    
    actions = ['sync_from_api']
    
    def sync_from_api(self, request, queryset):
        """APIからブランド情報を同期"""
        from .digital_gift_client import DigitalGiftAPIClient
        
        api_key = APIAccessKey.objects.filter(is_active=True).first()
        if not api_key:
            self.message_user(request, '有効なAPIアクセスキーがありません', level='error')
            return
        
        try:
            client = DigitalGiftAPIClient(api_key)
            brands = client.get_brands()
            self.message_user(request, f'{len(brands)}件のブランド情報を同期しました', level='success')
        except Exception as e:
            self.message_user(request, f'同期エラー: {e}', level='error')
    
    sync_from_api.short_description = 'APIからブランド情報を同期'


@admin.register(DigitalGiftPurchaseID)
class DigitalGiftPurchaseIDAdmin(BaseAdmin):
    """購入ID管理"""
    list_display = ('purchase_id_display', 'name', 'issuer', 'created_at', 'is_active')
    list_filter = ('is_active', 'created_at')
    search_fields = ('purchase_id', 'name', 'issuer')
    readonly_fields = ('purchase_id', 'created_at')
    
    fieldsets = (
        ('購入ID情報', {
            'fields': ('purchase_id', 'name', 'issuer')
        }),
        ('設定', {
            'fields': ('prices', 'brand_codes', 'is_strict')
        }),
        ('デザイン', {
            'fields': ('color_main', 'color_sub', 'image_face_url', 'image_header_url'),
            'classes': ('collapse',)
        }),
        ('状態', {
            'fields': ('is_active', 'created_at')
        }),
    )
    
    def purchase_id_display(self, obj):
        return f"{obj.purchase_id[:20]}..." if obj.purchase_id else ""
    purchase_id_display.short_description = '購入ID'


@admin.register(DigitalGiftPurchase)
class DigitalGiftPurchaseAdmin(BaseAdmin):
    """ギフト購入履歴管理"""
    list_display = ('gift_code_display', 'user', 'price', 'total_cost', 'status', 'purchased_at')
    list_filter = ('status', 'purchased_at')
    search_fields = ('gift_code', 'user__username', 'user__email')
    readonly_fields = ('purchased_at',)
    date_hierarchy = 'purchased_at'
    
    fieldsets = (
        ('購入情報', {
            'fields': ('user', 'purchase_id', 'gift_code', 'gift_url')
        }),
        ('金額', {
            'fields': ('price', 'commission', 'commission_tax', 'total_cost')
        }),
        ('状態', {
            'fields': ('status', 'purchased_at', 'expire_at')
        }),
        ('追加情報', {
            'fields': ('qr_code_url', 'request_id'),
            'classes': ('collapse',)
        }),
    )
    
    def gift_code_display(self, obj):
        return f"{obj.gift_code[:15]}..." if obj.gift_code else ""
    gift_code_display.short_description = 'ギフトコード'


# ===== 管理画面カスタマイズ =====
admin.site.site_header = 'BIID Point App 運営管理画面'
admin.site.site_title = 'BIID Point App Admin'
admin.site.index_title = 'システム管理'

# 本番環境用の管理画面設定
if hasattr(admin.site, 'enable_nav_sidebar'):
    admin.site.enable_nav_sidebar = False  # サイドバー無効化（パフォーマンス向上）