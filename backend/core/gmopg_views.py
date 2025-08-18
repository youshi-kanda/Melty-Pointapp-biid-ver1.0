# GMOPG QR決済 API ビュー - 可観測化バージョン

from django.conf import settings
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import time
import random
import string
import logging
from typing import Dict, Any
from .gmopg_service import gmopg_service, GMOPGError
from .models import User, PaymentTransaction
from .serializers import PaymentTransactionSerializer

logger = logging.getLogger(__name__)


class GmoApiError(Exception):
    pass


def _uniq_order_id(prefix="ORD"):
    """ユニークなOrderIDを生成"""
    nonce = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(6))
    return f"{prefix}_{int(time.time())}_{nonce}"


@csrf_exempt
@require_POST
def initiate_qr_payment(request):
    """
    決済開始。入力検証→（モック or 実呼び出し）→結果を透過返却。
    エラーは 4xx/5xx で JSON 返却（GMOPGのErrCode/ErrInfoは422）。
    """
    try:
        body = json.loads(request.body.decode())
        amount = int(body.get("amount", 0))
        order_id = body.get("order_id") or _uniq_order_id()
        brand = (body.get("payment_method") or "").lower()  # e.g. paypay
        pay_method = "qr"  # QR決済固定
        customer_id = body.get("customer_id", "")

        logger.info(f"🔄 QR payment initiation: order_id={order_id}, amount={amount}, brand={brand}, customer_id={customer_id}")

        # 入力検証
        if amount <= 0:
            logger.warning(f"❌ Invalid amount: {amount}")
            return JsonResponse({"ok": False, "error": "INVALID_AMOUNT", "detail": f"金額が無効です: {amount}"}, status=400)
        
        if not order_id:
            logger.warning("❌ Missing order_id")
            return JsonResponse({"ok": False, "error": "MISSING_ORDER_ID", "detail": "注文IDが必要です"}, status=400)

        if not customer_id:
            logger.warning("❌ Missing customer_id")
            return JsonResponse({"ok": False, "error": "MISSING_CUSTOMER_ID", "detail": "顧客IDが必要です"}, status=400)

        # モック動作：開発を止めないため
        if getattr(settings, "GMOPG_MOCK", False):
            logger.info(f"🎭 Mock mode: returning success for order_id={order_id}")
            # ローカルモック決済ページURL
            base_url = request.build_absolute_uri('/').rstrip('/')
            mock_response = {
                "Status": "REQUESTED",
                "AccessId": f"MOCK_{int(time.time())}",
                "PayURL": f"{base_url}/api/gmopg/mock-payment/{order_id}?brand={brand}&amount={amount}",
                "Brand": brand,
                "PayMethod": pay_method,
                "OrderId": order_id
            }
            
            return JsonResponse({
                "ok": True,
                "mock": True,
                "gmo": mock_response,
                "success": True,
                "redirect_url": mock_response["PayURL"],
                "transaction_id": mock_response["AccessId"],
                "order_id": order_id
            }, status=200)

        # ---- 本番呼び出し ----
        try:
            logger.info(f"🔄 Calling GMOPG service: order_id={order_id}, amount={amount}")
            
            # GMOPG サービス呼び出し
            payment_data = {
                'order_id': order_id,
                'amount': amount,
                'currency': 'JPY',
                'customer_id': customer_id,
                'payment_method': brand,
                'description': f'Salute Terminal QR Payment - {brand}',
                'return_url': f"{request.build_absolute_uri('/').rstrip('/')}/api/gmopg/payment/return/{order_id}/",
                'cancel_url': f"{request.build_absolute_uri('/').rstrip('/')}/api/gmopg/payment/cancel/{order_id}/",
                'metadata': {
                    'original_amount': amount,
                    'payment_method': brand,
                    'terminal_id': 'TERMINAL_001'
                }
            }
            
            exec_result = gmopg_service.initiate_qr_payment(payment_data)
            logger.info(f"✅ GMOPG service response: {exec_result}")
            
        except Exception as e:
            logger.error(f"❌ GMOPG service error: {str(e)}")
            raise GmoApiError(f"GMOPG service error: {str(e)}")
        
        # 戻り値検証
        if not isinstance(exec_result, dict):
            logger.error(f"❌ GMOPG returned non-dict response: {type(exec_result)}")
            raise GmoApiError("gmopg_exec returned non-dict response")

        # GMOエラーコードチェック
        if exec_result.get("ErrCode") or exec_result.get("ErrInfo"):
            logger.warning(f"🚨 GMO business error: ErrCode={exec_result.get('ErrCode')}, ErrInfo={exec_result.get('ErrInfo')}")
            # GMOの業務エラーは422で透過返却
            return JsonResponse({
                "ok": False, 
                "gmo": exec_result,
                "success": False,
                "error": exec_result.get("ErrInfo", "GMO Payment Gateway error")
            }, status=422)

        logger.info(f"✅ Payment initiation successful: {exec_result}")
        return JsonResponse({
            "ok": True, 
            "gmo": exec_result,
            "success": True,
            "redirect_url": exec_result.get('redirect_url', exec_result.get('PayURL')),
            "transaction_id": exec_result.get('transaction_id', exec_result.get('AccessId')),
            "order_id": order_id
        }, status=200)

    except json.JSONDecodeError as e:
        logger.error(f"❌ JSON decode error: {str(e)}")
        return JsonResponse({"ok": False, "error": "INVALID_JSON", "detail": "無効なJSONデータです"}, status=400)
    
    except ValueError as e:
        logger.error(f"❌ Value error: {str(e)}")
        return JsonResponse({"ok": False, "error": "INVALID_DATA", "detail": str(e)}, status=400)
    
    except GmoApiError as e:
        logger.error(f"❌ GMO API error: {str(e)}")
        return JsonResponse({"ok": False, "error": "GMO_API_ERROR", "detail": str(e)}, status=502)
    
    except Exception as e:
        logger.error(f"❌ Unexpected error: {str(e)}")
        return JsonResponse({"ok": False, "error": "SERVER_EXCEPTION", "detail": str(e)}, status=500)


@csrf_exempt
def check_payment_status(request, transaction_id):
    """決済状態確認API"""
    try:
        if getattr(settings, "GMOPG_MOCK", False):
            # モック: 常に成功を返す
            return JsonResponse({
                "ok": True,
                "mock": True,
                "status": "COMPLETED",
                "transaction_id": transaction_id
            })
        
        # 実装: GMOPG APIで状態確認
        result = gmopg_service.check_payment_status(transaction_id)
        return JsonResponse({"ok": True, "gmo": result, "status": result.get("Status")})
    
    except Exception as e:
        logger.error(f"❌ Status check error: {str(e)}")
        return JsonResponse({"ok": False, "error": "STATUS_CHECK_ERROR", "detail": str(e)}, status=500)


@csrf_exempt
def payment_return(request, order_id):
    """決済完了時のリターンURL"""
    logger.info(f"🔄 Payment return: order_id={order_id}")
    return JsonResponse({"ok": True, "message": "Payment completed", "order_id": order_id})


@csrf_exempt 
def payment_cancel(request, order_id):
    """決済キャンセル時のキャンセルURL"""
    logger.info(f"🔄 Payment cancelled: order_id={order_id}")
    return JsonResponse({"ok": False, "message": "Payment cancelled", "order_id": order_id})


@csrf_exempt
def payment_notify(request):
    """決済通知受信"""
    logger.info(f"🔄 Payment notification received: {request.body}")
    return JsonResponse({"ok": True, "message": "Notification received"})


@csrf_exempt
def get_transaction_history(request):
    """取引履歴取得API"""
    try:
        customer_id = request.GET.get('customer_id')
        limit = int(request.GET.get('limit', 20))
        
        if not customer_id:
            return JsonResponse({
                'success': False,
                'error': '顧客IDが必要です'
            }, status=400)
        
        # QR決済取引履歴取得
        transactions = PaymentTransaction.objects.filter(
            customer__member_id=customer_id,
            payment_method='qr'
        ).order_by('-created_at')[:limit]
        
        serializer = PaymentTransactionSerializer(transactions, many=True)
        
        return JsonResponse({
            'success': True,
            'transactions': serializer.data
        })
        
    except Exception as e:
        logger.error(f"❌ Transaction history error: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': 'サーバーエラーが発生しました',
            'detail': str(e)
        }, status=500)


# 下位互換性のため
refund_payment = lambda request, transaction_id: JsonResponse({"ok": False, "error": "NOT_IMPLEMENTED"}, status=501)


def mock_payment_page(request, order_id):
    """
    モック決済ページ
    実際の決済処理をシミュレートするHTMLページを返す
    """
    brand = request.GET.get('brand', 'unknown')
    amount = request.GET.get('amount', '0')
    
    # パラメータログ
    logger.info(f"🎭 Mock payment page accessed: order_id={order_id}, brand={brand}, amount={amount}")
    
    # 決済ページHTMLを返す
    html_content = f"""
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>モック決済ページ - {brand.upper()}</title>
    <style>
        body {{ 
            font-family: Arial, sans-serif; 
            max-width: 400px; 
            margin: 50px auto; 
            padding: 20px; 
            background: #f5f5f5; 
        }}
        .payment-card {{ 
            background: white; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            text-align: center; 
        }}
        .brand-logo {{ 
            font-size: 24px; 
            font-weight: bold; 
            color: #333; 
            margin-bottom: 20px; 
        }}
        .amount {{ 
            font-size: 36px; 
            color: #e74c3c; 
            margin: 20px 0; 
        }}
        .btn {{
            background: #3498db;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px;
            min-width: 120px;
        }}
        .btn:hover {{ background: #2980b9; }}
        .btn.success {{ background: #27ae60; }}
        .btn.success:hover {{ background: #229954; }}
        .btn.cancel {{ background: #e74c3c; }}
        .btn.cancel:hover {{ background: #c0392b; }}
        .order-info {{ 
            background: #ecf0f1; 
            padding: 15px; 
            border-radius: 5px; 
            margin-bottom: 20px; 
            font-size: 14px; 
            color: #555; 
        }}
    </style>
</head>
<body>
    <div class="payment-card">
        <div class="brand-logo">{brand.upper()} モック決済</div>
        <div class="order-info">
            <strong>注文ID:</strong> {order_id}<br>
            <strong>決済方法:</strong> {brand.upper()} QR決済
        </div>
        <div class="amount">¥{amount}</div>
        <p>これはテスト用の決済ページです。<br>実際の決済は行われません。</p>
        <div>
            <button class="btn success" onclick="simulateSuccess()">決済成功</button>
            <button class="btn cancel" onclick="simulateCancel()">決済キャンセル</button>
        </div>
    </div>
    
    <script>
        function simulateSuccess() {{
            alert('決済成功をシミュレートしています...');
            // 元の画面に戻る（実際の実装ではreturn_urlにリダイレクト）
            setTimeout(() => {{
                window.location.href = 'http://localhost:3000/terminal-simple?payment=return&order_id={order_id}&status=success';
            }}, 1000);
        }}
        
        function simulateCancel() {{
            alert('決済キャンセルをシミュレートしています...');
            // 元の画面に戻る（実際の実装ではcancel_urlにリダイレクト）
            setTimeout(() => {{
                window.location.href = 'http://localhost:3000/terminal-simple?payment=cancel&order_id={order_id}&status=cancel';
            }}, 1000);
        }}
        
        // 自動リダイレクトオプション（10秒後）
        setTimeout(() => {{
            if (confirm('10秒経過しました。自動で決済成功として処理しますか？')) {{
                simulateSuccess();
            }}
        }}, 10000);
    </script>
</body>
</html>
    """
    
    from django.http import HttpResponse
    return HttpResponse(html_content, content_type='text/html')