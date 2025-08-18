# GMOペイメントゲートウェイ QR決済サービス

import requests
import json
import hashlib
import hmac
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, Tuple
from django.conf import settings
from django.core.cache import cache
from django.utils import timezone
from .models import User, PaymentTransaction

logger = logging.getLogger(__name__)

class GMOPGError(Exception):
    """GMOPG API エラー"""
    def __init__(self, message: str, error_code: str = None, status_code: int = None):
        super().__init__(message)
        self.error_code = error_code
        self.status_code = status_code

class GMOPGQRService:
    """GMOペイメントゲートウェイ QR決済サービス"""
    
    def __init__(self):
        self.shop_id = getattr(settings, 'GMOPG_SHOP_ID', 'tshop00000001')
        self.shop_password = getattr(settings, 'GMOPG_SHOP_PASSWORD', 'qpay2pay')
        self.site_id = getattr(settings, 'GMOPG_SITE_ID', 'tsite00000001')
        self.site_password = getattr(settings, 'GMOPG_SITE_PASSWORD', 'sitepswd')
        self.api_base_url = getattr(settings, 'GMOPG_API_BASE_URL', 'https://pt01.mul-pay.jp')
        self.is_production = getattr(settings, 'GMOPG_IS_PRODUCTION', False)
        self.timeout = 30
        
        # QR決済方法マッピング
        self.payment_method_map = {
            'paypay': '275',
            'dpay': '276', 
            'rakuten': '277',
            'aupay': '278',
            'merpay': '279',
            'amazon': '280'
        }
        
        # ステータスマッピング
        self.status_map = {
            'REQUESTED': 'pending',
            'PROCESSING': 'processing',
            'COMPLETED': 'completed',
            'FAILED': 'failed',
            'CANCELLED': 'cancelled',
            'TIMEOUT': 'timeout'
        }

    def initiate_qr_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """QR決済開始"""
        try:
            logger.info(f"🔄 Initiating GMOPG QR payment: {payment_data.get('order_id')}")
            
            # リクエストデータ構築
            request_data = self._build_payment_request(payment_data)
            
            # 本番環境とテスト環境の処理分岐
            if self.is_production:
                response_data = self._call_gmopg_api('/api/wallet/charge', request_data)
            else:
                # 開発環境ではモックレスポンス
                response_data = self._mock_gmopg_response('charge', request_data)
            
            # レスポンス処理
            if response_data.get('success', True):
                # トランザクション記録
                transaction = self._create_transaction_record(payment_data, response_data)
                
                return {
                    'success': True,
                    'redirect_url': response_data.get('redirectUrl') or response_data.get('paymentUrl'),
                    'transaction_id': response_data.get('accessId') or response_data.get('transactionId'),
                    'order_id': payment_data['order_id'],
                    'payment_url': response_data.get('paymentUrl'),
                    'db_transaction_id': transaction.id if transaction else None
                }
            else:
                raise GMOPGError(
                    response_data.get('errorMessage', 'QR決済の開始に失敗しました'),
                    response_data.get('errorCode'),
                    response_data.get('statusCode')
                )
                
        except GMOPGError:
            raise
        except Exception as e:
            logger.error(f"GMOPG QR payment initiation failed: {str(e)}")
            raise GMOPGError(f"QR決済処理でシステムエラーが発生しました: {str(e)}")

    def check_payment_status(self, transaction_id: str) -> Dict[str, Any]:
        """決済ステータス確認"""
        try:
            logger.info(f"🔍 Checking GMOPG payment status: {transaction_id}")
            
            # キャッシュから確認
            cache_key = f"gmopg_status_{transaction_id}"
            cached_status = cache.get(cache_key)
            if cached_status and cached_status.get('status') == 'completed':
                return cached_status
            
            if self.is_production:
                response_data = self._call_gmopg_api(f'/api/wallet/status/{transaction_id}')
            else:
                response_data = self._mock_gmopg_response('status', {'transaction_id': transaction_id})
            
            status_result = {
                'success': True,
                'status': self.status_map.get(response_data.get('status'), 'failed'),
                'transaction_id': transaction_id,
                'order_id': response_data.get('orderId'),
                'amount': response_data.get('amount'),
                'payment_method': response_data.get('payType'),
                'completed_at': response_data.get('completedAt')
            }
            
            # 完了ステータスの場合はキャッシュ（24時間）
            if status_result['status'] == 'completed':
                cache.set(cache_key, status_result, 86400)
                
                # DBのトランザクション更新
                self._update_transaction_status(transaction_id, 'completed', response_data)
            
            return status_result
            
        except Exception as e:
            logger.error(f"GMOPG status check failed: {str(e)}")
            return {
                'success': False,
                'status': 'failed',
                'error_message': str(e)
            }

    def refund_payment(self, transaction_id: str, amount: Optional[int] = None, reason: str = '') -> Dict[str, Any]:
        """返金処理"""
        try:
            logger.info(f"💸 GMOPG refund request: {transaction_id}, amount: {amount}")
            
            request_data = {
                'siteId': self.site_id,
                'sitePassword': self.site_password,
                'accessId': transaction_id,
                'reason': reason
            }
            
            if amount is not None:
                request_data['amount'] = amount
            
            if self.is_production:
                response_data = self._call_gmopg_api('/api/wallet/refund', request_data, method='POST')
            else:
                response_data = self._mock_gmopg_response('refund', request_data)
            
            if response_data.get('success', True):
                # 返金記録
                self._create_refund_record(transaction_id, response_data)
                
                return {
                    'success': True,
                    'refund_id': response_data.get('refundId'),
                    'refund_amount': response_data.get('refundAmount', amount)
                }
            else:
                raise GMOPGError(
                    response_data.get('errorMessage', '返金処理に失敗しました'),
                    response_data.get('errorCode')
                )
                
        except GMOPGError:
            raise
        except Exception as e:
            logger.error(f"GMOPG refund failed: {str(e)}")
            raise GMOPGError(f"返金処理でシステムエラーが発生しました: {str(e)}")

    def _build_payment_request(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """決済リクエストデータ構築"""
        pay_type = self.payment_method_map.get(payment_data.get('payment_method'), '275')
        
        return {
            'siteId': self.site_id,
            'sitePassword': self.site_password,
            'orderId': payment_data['order_id'],
            'amount': payment_data['amount'],
            'currency': payment_data.get('currency', 'JPY'),
            'payType': pay_type,
            'customerId': payment_data.get('customer_id'),
            'customerName': payment_data.get('customer_name'),
            'customerEmail': payment_data.get('customer_email'),
            'itemName': payment_data.get('description', 'Salute Terminal Payment'),
            'returnUrl': payment_data.get('return_url'),
            'cancelUrl': payment_data.get('cancel_url'),
            'notifyUrl': payment_data.get('notify_url'),
            'metadata': json.dumps(payment_data.get('metadata', {}))
        }

    def _call_gmopg_api(self, endpoint: str, data: Dict[str, Any] = None, method: str = 'GET') -> Dict[str, Any]:
        """GMOPG API呼び出し"""
        url = f"{self.api_base_url}{endpoint}"
        
        headers = {
            'Shop-Id': self.shop_id,
            'Shop-Password': self.shop_password,
            'Content-Type': 'application/json'
        }
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=self.timeout)
            else:
                response = requests.post(url, headers=headers, json=data, timeout=self.timeout)
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"GMOPG API call failed: {url}, error: {str(e)}")
            raise GMOPGError(f"GMOPG APIエラー: {str(e)}")

    def _mock_gmopg_response(self, operation: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """開発用モックレスポンス"""
        import time
        import random
        
        # 処理時間シミュレート
        time.sleep(random.uniform(0.5, 2.0))
        
        if operation == 'charge':
            # ローカル開発環境用のモック決済URL
            order_id = data.get('orderId')
            brand = data.get('brand', 'unknown')
            amount = data.get('amount', 0)
            
            return {
                'success': True,
                'redirectUrl': f'http://127.0.0.1:8000/api/gmopg/mock-payment/{order_id}/?brand={brand}&amount={amount}',
                'accessId': f'MOCK_{int(time.time())}_{random.randint(1000, 9999)}',
                'orderId': order_id,
                'paymentUrl': f'http://127.0.0.1:8000/api/gmopg/mock-payment/{order_id}/?brand={brand}&amount={amount}'
            }
        
        elif operation == 'status':
            # 80%の確率で完了
            is_completed = random.random() < 0.8
            status = 'COMPLETED' if is_completed else 'PROCESSING'
            
            return {
                'status': status,
                'accessId': data.get('transaction_id'),
                'orderId': f'ORDER_{int(time.time())}',
                'amount': 30000,
                'payType': '275',
                'completedAt': datetime.now().isoformat() if is_completed else None
            }
        
        elif operation == 'refund':
            return {
                'success': True,
                'refundId': f'REFUND_{int(time.time())}',
                'refundAmount': data.get('amount', 1000)
            }
        
        return {'success': False, 'errorMessage': 'Unknown operation'}

    def _create_transaction_record(self, payment_data: Dict[str, Any], response_data: Dict[str, Any]) -> Optional['Transaction']:
        """トランザクション記録作成"""
        try:
            from .models import Transaction
            
            customer_id = payment_data.get('customer_id')
            if not customer_id:
                return None
                
            customer = User.objects.filter(member_id=customer_id).first()
            if not customer:
                logger.warning(f"Customer not found: {customer_id}")
                return None
            
            transaction = PaymentTransaction.objects.create(
                user=customer,
                transaction_type='payment',
                payment_method='qr',
                amount=payment_data['amount'],
                points_earned=payment_data.get('points_earned', 0),
                points_used=payment_data.get('points_used', 0),
                status='pending',
                external_transaction_id=response_data.get('accessId') or response_data.get('transactionId'),
                order_id=payment_data['order_id'],
                terminal_id=payment_data.get('terminal_id'),
                store_id=payment_data.get('store_id'),
                metadata={
                    'gmopg_response': response_data,
                    'payment_method_detail': payment_data.get('payment_method'),
                    'redirect_url': response_data.get('redirectUrl'),
                    'payment_url': response_data.get('paymentUrl')
                }
            )
            
            logger.info(f"Transaction record created: {transaction.id}")
            return transaction
            
        except Exception as e:
            logger.error(f"Failed to create transaction record: {str(e)}")
            return None

    def _update_transaction_status(self, transaction_id: str, status: str, response_data: Dict[str, Any]):
        """トランザクションステータス更新"""
        try:
            from .models import Transaction
            
            transaction = PaymentTransaction.objects.filter(
                external_transaction_id=transaction_id
            ).first()
            
            if transaction:
                transaction.status = status
                if status == 'completed':
                    transaction.completed_at = timezone.now()
                    
                    # メタデータ更新
                    if transaction.metadata:
                        transaction.metadata.update({
                            'completion_response': response_data,
                            'completed_at': response_data.get('completedAt')
                        })
                    
                transaction.save()
                logger.info(f"Transaction status updated: {transaction.id} -> {status}")
            
        except Exception as e:
            logger.error(f"Failed to update transaction status: {str(e)}")

    def _create_refund_record(self, transaction_id: str, response_data: Dict[str, Any]):
        """返金記録作成"""
        try:
            from .models import Transaction
            
            # 元のトランザクション検索
            original_transaction = PaymentTransaction.objects.filter(
                external_transaction_id=transaction_id
            ).first()
            
            if original_transaction:
                # 返金記録作成
                refund_transaction = PaymentTransaction.objects.create(
                    user=original_transaction.user,
                    transaction_type='refund',
                    payment_method='qr',
                    amount=-response_data.get('refundAmount', 0),
                    status='completed',
                    external_transaction_id=response_data.get('refundId'),
                    related_transaction=original_transaction,
                    terminal_id=original_transaction.terminal_id,
                    store_id=original_transaction.store_id,
                    metadata={
                        'gmopg_refund_response': response_data,
                        'original_transaction_id': transaction_id
                    },
                    completed_at=timezone.now()
                )
                
                logger.info(f"Refund record created: {refund_transaction.id}")
                return refund_transaction
            
        except Exception as e:
            logger.error(f"Failed to create refund record: {str(e)}")
            return None


# サービスインスタンス
gmopg_service = GMOPGQRService()