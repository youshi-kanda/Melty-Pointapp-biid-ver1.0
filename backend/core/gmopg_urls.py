# GMOPG QR決済 URL設定

from django.urls import path
from . import gmopg_views

app_name = 'gmopg'

urlpatterns = [
    # QR決済API
    path('payment/initiate/', gmopg_views.initiate_qr_payment, name='initiate_qr_payment'),
    path('payment/status/<str:transaction_id>/', gmopg_views.check_payment_status, name='check_payment_status'),
    path('payment/refund/<str:transaction_id>/', gmopg_views.refund_payment, name='refund_payment'),
    
    # 決済フロー用URL（リダイレクト）
    path('payment/return/<str:order_id>/', gmopg_views.payment_return, name='payment_return'),
    path('payment/cancel/<str:order_id>/', gmopg_views.payment_cancel, name='payment_cancel'),
    path('payment/notify/', gmopg_views.payment_notify, name='payment_notify'),
    
    # モック決済ページ
    path('mock-payment/<str:order_id>/', gmopg_views.mock_payment_page, name='mock_payment_page'),
    
    # 取引履歴
    path('transactions/', gmopg_views.get_transaction_history, name='transaction_history'),
]