from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
import pyotp
import time


class PartnerAPITestView(TemplateView):
    """パートナーAPIテスト用WebUI"""
    template_name = 'partner_api_test.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'パートナーAPI テストツール'
        return context


@csrf_exempt
def api_status(request):
    """API状態チェック"""
    from .models import Brand, APIAccessKey
    
    return JsonResponse({
        'status': 'ok',
        'brands_count': Brand.objects.filter(is_active=True).count(),
        'api_keys_count': APIAccessKey.objects.filter(is_active=True).count(),
        'endpoints': [
            '/api/partner/brands/',
            '/api/partner/purchases/',
            '/api/partner/purchases/{purchaseId}/',
            '/api/partner/purchases/{purchaseId}/color/',
            '/api/partner/purchases/{purchaseId}/image/{imageType}/',
            '/api/partner/purchases/{purchaseId}/video/',
            '/api/partner/purchases/{purchaseId}/ad/',
            '/api/partner/purchases/{purchaseId}/gifts/',
        ]
    })


@csrf_exempt
def get_totp(request):
    """TOTP生成API"""
    try:
        secret = 'G3ZGZNLNRNXUSJHMXYYTVEIOLDE7HMAM'
        totp = pyotp.TOTP(secret, interval=30, digits=6)
        current_token = totp.now()
        
        return JsonResponse({
            'totp': current_token,
            'secret': secret,
            'timestamp': int(time.time())
        })
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'totp': '119484'  # フォールバック
        })