from django.http import JsonResponse
from django.views import View
from django.conf import settings
import pyotp


class PartnerAPITestView(View):
    """Partner API test view"""
    
    def get(self, request):
        return JsonResponse({
            'status': 'success',
            'message': 'Partner API Test View',
            'version': '1.0.0'
        })


def api_status(request):
    """API status check view"""
    return JsonResponse({
        'status': 'active',
        'message': 'biid Point App API is running',
        'version': '1.0.0'
    })


def get_totp(request):
    """Get TOTP for testing purposes"""
    # This is a test function - in production, this should be secured
    secret = getattr(settings, 'TEST_TOTP_SECRET', 'JBSWY3DPEHPK3PXP')
    totp = pyotp.TOTP(secret)
    current_token = totp.now()
    
    return JsonResponse({
        'totp': current_token,
        'secret': secret,
        'message': 'Current TOTP token for testing'
    })