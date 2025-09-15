# 決済ゲートウェイ統合サービス

from django.conf import settings
from typing import Dict, Any, Optional
import logging
from .gmopg_service import gmopg_service, GMOPGError
from .fincode_service import fincode_service, FINCODEError

logger = logging.getLogger(__name__)


class PaymentGatewayError(Exception):
    """決済ゲートウェイエラー"""
    def __init__(self, message: str, error_code: str = None, gateway: str = None):
        super().__init__(message)
        self.error_code = error_code
        self.gateway = gateway


class PaymentGatewayService:
    """決済ゲートウェイ統合サービス"""
    
    def __init__(self, gateway: str = None):
        """
        決済ゲートウェイサービスを初期化
        
        Args:
            gateway: 使用する決済ゲートウェイ ("gmopg" or "fincode")
                    指定されない場合は設定から取得
        """
        self.gateway = gateway or getattr(settings, 'PAYMENT_GATEWAY', 'fincode')
        
        # 使用可能なゲートウェイサービス
        self.services = {
            'gmopg': gmopg_service,
            'fincode': fincode_service
        }
        
        # エラークラスマッピング  
        self.error_classes = {
            'gmopg': GMOPGError,
            'fincode': FINCODEError
        }
        
        if self.gateway not in self.services:
            raise ValueError(f"Unsupported payment gateway: {self.gateway}")
        
        self.service = self.services[self.gateway]
        logger.info(f"PaymentGatewayService initialized with gateway: {self.gateway}")

    def initiate_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """決済開始"""
        try:
            logger.info(f"🔄 Initiating payment via {self.gateway.upper()}: {payment_data.get('order_id')}")
            
            if self.gateway == 'gmopg':
                result = self.service.initiate_qr_payment(payment_data)
            elif self.gateway == 'fincode':
                result = self.service.initiate_payment(payment_data)
            
            # レスポンス正規化
            return self._normalize_payment_response(result)
            
        except (GMOPGError, FINCODEError) as e:
            logger.error(f"❌ {self.gateway.upper()} payment error: {str(e)}")
            raise PaymentGatewayError(
                str(e), 
                error_code=getattr(e, 'error_code', None),
                gateway=self.gateway
            )
        except Exception as e:
            logger.error(f"❌ Payment gateway error: {str(e)}")
            raise PaymentGatewayError(f"Payment initiation failed: {str(e)}", gateway=self.gateway)

    def check_payment_status(self, transaction_id: str) -> Dict[str, Any]:
        """決済ステータス確認"""
        try:
            logger.info(f"🔍 Checking payment status via {self.gateway.upper()}: {transaction_id}")
            
            result = self.service.check_payment_status(transaction_id)
            
            # レスポンス正規化
            return self._normalize_status_response(result)
            
        except (GMOPGError, FINCODEError) as e:
            logger.error(f"❌ {self.gateway.upper()} status check error: {str(e)}")
            raise PaymentGatewayError(
                str(e),
                error_code=getattr(e, 'error_code', None),
                gateway=self.gateway
            )
        except Exception as e:
            logger.error(f"❌ Status check error: {str(e)}")
            raise PaymentGatewayError(f"Status check failed: {str(e)}", gateway=self.gateway)

    def refund_payment(self, transaction_id: str, amount: Optional[int] = None, reason: str = '') -> Dict[str, Any]:
        """返金処理"""
        try:
            logger.info(f"💸 Processing refund via {self.gateway.upper()}: {transaction_id}")
            
            result = self.service.refund_payment(transaction_id, amount, reason)
            
            # レスポンス正規化
            return self._normalize_refund_response(result)
            
        except (GMOPGError, FINCODEError) as e:
            logger.error(f"❌ {self.gateway.upper()} refund error: {str(e)}")
            raise PaymentGatewayError(
                str(e),
                error_code=getattr(e, 'error_code', None),
                gateway=self.gateway
            )
        except Exception as e:
            logger.error(f"❌ Refund error: {str(e)}")
            raise PaymentGatewayError(f"Refund failed: {str(e)}", gateway=self.gateway)

    def _normalize_payment_response(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """決済開始レスポンスの正規化"""
        if self.gateway == 'gmopg':
            return {
                'success': result.get('success', True),
                'payment_id': result.get('transaction_id'),
                'order_id': result.get('order_id'),
                'redirect_url': result.get('redirect_url'),
                'status': self._map_status(result.get('status', 'pending')),
                'gateway': 'gmopg',
                'db_transaction_id': result.get('db_transaction_id'),
                'original_response': result
            }
        elif self.gateway == 'fincode':
            return {
                'success': result.get('success', False),
                'payment_id': result.get('payment_id'),
                'order_id': result.get('order_id'),
                'redirect_url': result.get('redirect_url'),
                'status': result.get('status', 'pending'),
                'gateway': 'fincode',
                'db_transaction_id': result.get('db_transaction_id'),
                'original_response': result
            }
        
        return result

    def _normalize_status_response(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """ステータス確認レスポンスの正規化"""
        return {
            'success': result.get('success', False),
            'status': result.get('status', 'failed'),
            'payment_id': result.get('payment_id') or result.get('transaction_id'),
            'order_id': result.get('order_id'),
            'amount': result.get('amount'),
            'payment_method': result.get('payment_method'),
            'completed_at': result.get('completed_at'),
            'updated_at': result.get('updated_at'),
            'gateway': self.gateway,
            'original_response': result
        }

    def _normalize_refund_response(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """返金レスポンスの正規化"""
        return {
            'success': result.get('success', False),
            'refund_id': result.get('refund_id'),
            'refund_amount': result.get('refund_amount'),
            'status': result.get('status', 'failed'),
            'gateway': self.gateway,
            'original_response': result
        }

    def _map_status(self, status: str) -> str:
        """ステータス値のマッピング（GMOPG用）"""
        status_map = {
            'pending': 'pending',
            'processing': 'processing', 
            'completed': 'completed',
            'failed': 'failed',
            'cancelled': 'cancelled',
            'timeout': 'failed'
        }
        return status_map.get(status.lower(), 'failed')

    @property
    def gateway_name(self) -> str:
        """現在の決済ゲートウェイ名を取得"""
        return self.gateway

    @property
    def is_mock_mode(self) -> bool:
        """モックモードかどうかを確認"""
        if self.gateway == 'gmopg':
            return getattr(settings, 'GMOPG_MOCK', False)
        elif self.gateway == 'fincode':
            return getattr(settings, 'FINCODE_MOCK', True)
        return False

    def switch_gateway(self, gateway: str):
        """決済ゲートウェイを切り替え"""
        if gateway not in self.services:
            raise ValueError(f"Unsupported payment gateway: {gateway}")
        
        old_gateway = self.gateway
        self.gateway = gateway
        self.service = self.services[gateway]
        
        logger.info(f"Payment gateway switched from {old_gateway} to {gateway}")


# デフォルトインスタンス
payment_gateway_service = PaymentGatewayService()