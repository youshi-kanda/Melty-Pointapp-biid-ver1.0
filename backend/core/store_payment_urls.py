from django.urls import path
from . import store_payment_views

urlpatterns = [
    # 顧客検索
    path('customers/lookup/', store_payment_views.lookup_customer_by_email, name='lookup-customer-email'),
    path('customers/lookup-qr/', store_payment_views.lookup_customer_by_qr, name='lookup-customer-qr'),
    
    # 店舗決済
    path('store/payment/', store_payment_views.process_store_payment, name='store-payment'),
    
    # 取引履歴
    path('transactions/recent/', store_payment_views.get_recent_transactions, name='recent-transactions'),
    
    # 店舗ポイント購入
    path('purchase-points/', store_payment_views.purchase_store_points, name='purchase-store-points'),
    path('current-points/', store_payment_views.get_current_store_points, name='current-store-points'),
]