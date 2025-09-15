from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from core.test_views import PartnerAPITestView, api_status, get_totp
from core import gmopg_views, fincode_views

def health(_request):  # フロント互換のヘルスエンドポイント
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('api/ec/', include('core.ec_point_urls')),  # EC購入ポイント付与システムAPI
    path('api/deposit/', include('core.deposit_urls')),  # デポジット管理API
    path('api/partner/', include('core.partner_urls')),
    path('api/gmopg/', include('core.gmopg_urls')),  # GMOPG QR決済API
    path('api/fincode/', include('core.fincode_urls')),  # GMO FINCODE決済API
    # 互換目的：POSTのAPPEND_SLASHが効かないケースのため両方受ける
    path('api/gmopg/payment/initiate', gmopg_views.initiate_qr_payment, name='gmopg_initiate_no_slash'),
    path('api/fincode/payment/initiate', fincode_views.initiate_payment, name='fincode_initiate_no_slash'),
    path('api/status/', api_status, name='api-status'),
    path('api/health/', health, name='api-health'),   # 追加: /api/health/
    path('api/get-totp/', get_totp, name='get-totp'),
    path('test/', PartnerAPITestView.as_view(), name='partner-api-test'),
    path('', PartnerAPITestView.as_view(), name='home'),
]
