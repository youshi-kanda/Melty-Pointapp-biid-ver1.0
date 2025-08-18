from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Store, PointTransaction


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'member_id', 'point_balance', 'rank', 'status', 'registration_date')
    list_filter = ('status', 'rank', 'registration_date', 'last_login_date')
    search_fields = ('username', 'email', 'member_id')
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Point System Info', {
            'fields': ('member_id', 'rank', 'status', 'location', 'avatar')
        }),
    )
    
    def point_balance(self, obj):
        """ポイント残高を表示"""
        return f"{obj.point_balance}pt"
    point_balance.short_description = 'ポイント残高'


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner_name', 'category', 'status', 'point_rate', 'registration_date')
    list_filter = ('status', 'category', 'price_range', 'biid_partner')
    search_fields = ('name', 'owner_name', 'email')
    readonly_fields = ('registration_date',)


@admin.register(PointTransaction)
class PointTransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'store', 'points', 'transaction_type', 'balance_after', 'created_at')
    list_filter = ('transaction_type', 'created_at')
    search_fields = ('user__username', 'store__name', 'description')
    readonly_fields = ('created_at', 'balance_before', 'balance_after')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'store', 'processed_by')
