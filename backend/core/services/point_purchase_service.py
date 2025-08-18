"""
ポイント購入サービス（従量課金システム）
"""
from django.db import transaction
from django.utils import timezone
from decimal import Decimal
import logging

from ..models import (
    Store, User, PointPurchaseTransaction, MonthlyBilling,
    DepositTransaction
)
from ..deposit_service import DepositService

logger = logging.getLogger(__name__)


class PointPurchaseService:
    """ポイント購入サービス - 従量課金システム"""
    
    UNIT_PRICE = Decimal('1.08')  # 1ポイント = 1.08円（税込）
    TAX_RATE = Decimal('0.08')    # 消費税率8%
    
    def __init__(self, store):
        self.store = store
        self.deposit_service = DepositService(store)
    
    @transaction.atomic
    def purchase_points_for_user(self, user, points_amount, description="", payment_method_preference=None):
        """
        ユーザーにポイントを付与し、従量課金で請求
        
        Args:
            user: 対象ユーザー
            points_amount: 付与ポイント数
            description: 取引説明
            payment_method_preference: 希望決済方法 ('credit_card' or 'deposit')
        
        Returns:
            PointPurchaseTransaction: 作成された取引
        """
        try:
            # 取引レコード作成
            purchase_transaction = self._create_transaction(user, points_amount, description)
            
            # 決済処理
            success = self._process_payment(purchase_transaction, payment_method_preference)
            
            if success:
                # ポイント付与
                user.add_points(points_amount, source_description=purchase_transaction.description)
                
                # 取引完了
                purchase_transaction.payment_status = 'success'
                purchase_transaction.completed_at = timezone.now()
                purchase_transaction.save()
                
                # 月次請求に追加
                self._add_to_monthly_billing(purchase_transaction)
                
                logger.info(f"Point purchase successful: {purchase_transaction.transaction_id}")
                return purchase_transaction
            else:
                raise Exception("決済処理に失敗しました")
                
        except Exception as e:
            logger.error(f"Point purchase failed for store {self.store.id}, user {user.id}: {str(e)}")
            if 'purchase_transaction' in locals():
                purchase_transaction.error_message = str(e)
                purchase_transaction.save()
            raise
    
    def _create_transaction(self, user, points_amount, description):
        """取引レコードを作成"""
        # 金額計算
        subtotal = int(points_amount * float(self.UNIT_PRICE) / (1 + float(self.TAX_RATE)))
        tax = int(subtotal * float(self.TAX_RATE))
        total_amount = subtotal + tax
        
        transaction = PointPurchaseTransaction.objects.create(
            store=self.store,
            target_user=user,
            points_amount=points_amount,
            unit_price=self.UNIT_PRICE,
            subtotal=subtotal,
            tax=tax,
            total_amount=total_amount,
            description=description or f"{self.store.name}でのポイント付与"
        )
        
        return transaction
    
    def _process_payment(self, transaction, payment_method_preference=None):
        """決済処理"""
        # 決済方法決定ロジック
        if payment_method_preference == 'deposit':
            # デポジット優先
            if self._try_deposit_payment(transaction):
                return True
            elif self._try_credit_card_payment(transaction):
                return True
            else:
                transaction.payment_status = 'failed_deposit'
                transaction.error_message = "デポジット残高不足、かつクレジットカード決済も失敗"
                transaction.save()
                return False
        else:
            # クレジットカード優先（デフォルト）
            if self._try_credit_card_payment(transaction):
                return True
            elif self._try_deposit_payment(transaction):
                return True
            else:
                transaction.payment_status = 'failed_card'
                transaction.error_message = "クレジットカード決済失敗、かつデポジット残高不足"
                transaction.save()
                return False
    
    def _try_credit_card_payment(self, transaction):
        """クレジットカード決済を試行"""
        try:
            # 実際の実装では決済ゲートウェイAPIを呼び出し
            # ここではシミュレーション
            import random
            success_rate = 0.95  # 95%成功率
            
            if random.random() < success_rate:
                transaction.payment_method = 'credit_card'
                transaction.card_payment_id = f"CARD_{timezone.now().strftime('%Y%m%d%H%M%S')}"
                transaction.save()
                logger.info(f"Credit card payment successful: {transaction.transaction_id}")
                return True
            else:
                logger.warning(f"Credit card payment failed (simulated): {transaction.transaction_id}")
                return False
                
        except Exception as e:
            logger.error(f"Credit card payment error: {str(e)}")
            return False
    
    def _try_deposit_payment(self, transaction):
        """デポジット決済を試行"""
        try:
            current_balance = self.deposit_service.get_current_balance()
            
            if current_balance >= transaction.total_amount:
                # デポジット使用記録
                deposit_transaction = DepositTransaction.objects.create(
                    store=self.store,
                    transaction_type='usage',
                    amount=-transaction.total_amount,
                    description=f"ポイント購入: {transaction.points_amount}pt",
                    reference_id=transaction.transaction_id
                )
                
                transaction.payment_method = 'deposit'
                transaction.deposit_transaction = deposit_transaction
                transaction.save()
                
                logger.info(f"Deposit payment successful: {transaction.transaction_id}")
                return True
            else:
                logger.warning(f"Insufficient deposit balance: need {transaction.total_amount}, have {current_balance}")
                return False
                
        except Exception as e:
            logger.error(f"Deposit payment error: {str(e)}")
            return False
    
    def _add_to_monthly_billing(self, transaction):
        """月次請求に取引を追加"""
        from datetime import date
        current_date = date.today()
        
        billing, created = MonthlyBilling.objects.get_or_create(
            store=self.store,
            billing_year=current_date.year,
            billing_month=current_date.month,
            defaults={
                'billing_period_start': current_date.replace(day=1),
                'billing_period_end': self._get_month_end(current_date),
                'due_date': self._get_next_month_5th(current_date),
            }
        )
        
        transaction.monthly_billing = billing
        transaction.save()
        
        # 請求額を再計算
        billing.calculate_totals()
        
        if created:
            logger.info(f"Created new monthly billing: {billing.billing_id}")
        else:
            logger.info(f"Added transaction to existing billing: {billing.billing_id}")
    
    def _get_month_end(self, date):
        """月末日を取得"""
        from datetime import date as Date
        next_month = date.replace(day=28) + timezone.timedelta(days=4)
        return next_month - timezone.timedelta(days=next_month.day)
    
    def _get_next_month_5th(self, date):
        """翌月5日を取得"""
        from datetime import date as Date
        next_month = date.replace(day=1) + timezone.timedelta(days=32)
        return next_month.replace(day=5)
    
    def get_monthly_usage(self, year, month):
        """指定月の利用額を取得"""
        billing = MonthlyBilling.objects.filter(
            store=self.store,
            billing_year=year,
            billing_month=month
        ).first()
        
        if billing:
            return {
                'total_points': billing.total_points_purchased,
                'total_amount': billing.total_amount,
                'deposit_used': billing.deposit_used,
                'credit_charged': billing.credit_charged,
                'status': billing.status,
                'billing': billing
            }
        else:
            return {
                'total_points': 0,
                'total_amount': 0,
                'deposit_used': 0,
                'credit_charged': 0,
                'status': None,
                'billing': None
            }
    
    def get_recent_transactions(self, limit=10):
        """最近の取引履歴を取得"""
        return PointPurchaseTransaction.objects.filter(
            store=self.store
        ).order_by('-created_at')[:limit]
    
    def get_daily_summary(self, date=None):
        """日別サマリーを取得"""
        if date is None:
            date = timezone.now().date()
        
        transactions = PointPurchaseTransaction.objects.filter(
            store=self.store,
            created_at__date=date,
            payment_status='success'
        )
        
        summary = {
            'date': date,
            'transaction_count': transactions.count(),
            'total_points': sum(t.points_amount for t in transactions),
            'total_amount': sum(t.total_amount for t in transactions),
            'credit_amount': sum(t.total_amount for t in transactions if t.payment_method == 'credit_card'),
            'deposit_amount': sum(t.total_amount for t in transactions if t.payment_method == 'deposit'),
        }
        
        return summary