"""
請求管理サービス
"""
from django.db import transaction
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
import logging
from datetime import date, timedelta
import json

from ..models import Store, MonthlyBilling, PointPurchaseTransaction

logger = logging.getLogger(__name__)


class BillingService:
    """請求管理サービス"""
    
    def __init__(self, store):
        self.store = store
    
    def get_current_month_billing(self):
        """当月の請求情報を取得"""
        current_date = date.today()
        return self.get_billing(current_date.year, current_date.month)
    
    def get_billing(self, year, month):
        """指定月の請求情報を取得"""
        billing = MonthlyBilling.objects.filter(
            store=self.store,
            billing_year=year,
            billing_month=month
        ).first()
        
        return billing
    
    def create_or_update_billing(self, year, month):
        """請求書を作成または更新"""
        billing, created = MonthlyBilling.objects.get_or_create(
            store=self.store,
            billing_year=year,
            billing_month=month,
            defaults={
                'billing_period_start': date(year, month, 1),
                'billing_period_end': self._get_month_end(year, month),
                'due_date': self._get_due_date(year, month),
            }
        )
        
        # 関連取引から金額を再計算
        billing.calculate_totals()
        
        return billing, created
    
    @transaction.atomic
    def finalize_billing(self, billing_id):
        """請求書を確定する"""
        try:
            billing = MonthlyBilling.objects.get(
                billing_id=billing_id,
                store=self.store
            )
            
            if billing.status != 'draft':
                raise ValueError(f"請求書はすでに確定済みです (現在のステータス: {billing.status})")
            
            # 最終金額計算
            billing.calculate_totals()
            
            # ステータス更新
            billing.status = 'finalized'
            billing.finalized_at = timezone.now()
            billing.save()
            
            # PDF生成（オプション）
            self._generate_invoice_pdf(billing)
            
            logger.info(f"Billing finalized: {billing.billing_id}")
            return billing
            
        except MonthlyBilling.DoesNotExist:
            raise ValueError("指定された請求書が見つかりません")
    
    def send_billing_email(self, billing_id):
        """請求書メールを送信"""
        try:
            billing = MonthlyBilling.objects.get(
                billing_id=billing_id,
                store=self.store
            )
            
            if billing.status == 'draft':
                raise ValueError("下書き状態の請求書は送信できません")
            
            # メール内容作成
            context = {
                'store': self.store,
                'billing': billing,
                'transactions': billing.pointpurchasetransaction_set.filter(payment_status='success'),
            }
            
            html_content = render_to_string('billing/invoice_email.html', context)
            text_content = render_to_string('billing/invoice_email.txt', context)
            
            # メール送信
            success = send_mail(
                subject=f'【Point App BIID】{billing.billing_period_display} 請求書',
                message=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[self.store.managers.first().email],  # 店舗管理者のメール
                html_message=html_content,
                fail_silently=False,
            )
            
            if success:
                billing.status = 'sent'
                billing.save()
                logger.info(f"Billing email sent: {billing.billing_id}")
            
            return success
            
        except MonthlyBilling.DoesNotExist:
            raise ValueError("指定された請求書が見つかりません")
        except Exception as e:
            logger.error(f"Failed to send billing email: {str(e)}")
            raise
    
    def get_billing_history(self, limit=12):
        """請求履歴を取得"""
        return MonthlyBilling.objects.filter(
            store=self.store
        ).order_by('-billing_year', '-billing_month')[:limit]
    
    def get_billing_summary(self, start_date=None, end_date=None):
        """請求サマリーを取得"""
        if start_date is None:
            start_date = date.today().replace(day=1) - timedelta(days=90)  # 3ヶ月前から
        if end_date is None:
            end_date = date.today()
        
        billings = MonthlyBilling.objects.filter(
            store=self.store,
            billing_period_start__gte=start_date,
            billing_period_end__lte=end_date
        )
        
        summary = {
            'period_start': start_date,
            'period_end': end_date,
            'total_billings': billings.count(),
            'total_amount': sum(b.total_amount for b in billings),
            'total_points': sum(b.total_points_purchased for b in billings),
            'total_deposit_used': sum(b.deposit_used for b in billings),
            'total_credit_charged': sum(b.credit_charged for b in billings),
            'pending_amount': sum(b.total_amount for b in billings if b.status in ['draft', 'finalized', 'sent']),
            'paid_amount': sum(b.total_amount for b in billings if b.status == 'paid'),
            'overdue_amount': sum(b.total_amount for b in billings if b.status == 'overdue'),
        }
        
        return summary
    
    def mark_as_paid(self, billing_id, payment_date=None):
        """請求を支払い済みにマーク"""
        try:
            billing = MonthlyBilling.objects.get(
                billing_id=billing_id,
                store=self.store
            )
            
            billing.status = 'paid'
            billing.paid_at = payment_date or timezone.now()
            billing.save()
            
            logger.info(f"Billing marked as paid: {billing.billing_id}")
            return billing
            
        except MonthlyBilling.DoesNotExist:
            raise ValueError("指定された請求書が見つかりません")
    
    def check_overdue_billings(self):
        """延滞請求をチェック"""
        today = date.today()
        overdue_billings = MonthlyBilling.objects.filter(
            store=self.store,
            due_date__lt=today,
            status__in=['finalized', 'sent']
        )
        
        for billing in overdue_billings:
            billing.status = 'overdue'
            billing.save()
            logger.warning(f"Billing marked as overdue: {billing.billing_id}")
        
        return overdue_billings
    
    def get_analytics_data(self, months=12):
        """分析用データを取得"""
        end_date = date.today()
        start_date = end_date.replace(day=1) - timedelta(days=30 * months)
        
        billings = MonthlyBilling.objects.filter(
            store=self.store,
            billing_period_start__gte=start_date
        ).order_by('billing_year', 'billing_month')
        
        analytics = {
            'monthly_data': [],
            'payment_method_breakdown': {'credit_card': 0, 'deposit': 0},
            'trends': {
                'points_growth': 0,
                'revenue_growth': 0,
                'average_transaction': 0
            }
        }
        
        for billing in billings:
            monthly_entry = {
                'period': billing.billing_period_display,
                'year': billing.billing_year,
                'month': billing.billing_month,
                'points': billing.total_points_purchased,
                'revenue': billing.total_amount,
                'deposit_used': billing.deposit_used,
                'credit_charged': billing.credit_charged,
                'status': billing.status
            }
            analytics['monthly_data'].append(monthly_entry)
            
            # 決済方法別集計
            analytics['payment_method_breakdown']['credit_card'] += billing.credit_charged
            analytics['payment_method_breakdown']['deposit'] += billing.deposit_used
        
        # トレンド計算
        if len(analytics['monthly_data']) >= 2:
            recent = analytics['monthly_data'][-1]
            previous = analytics['monthly_data'][-2]
            
            if previous['points'] > 0:
                analytics['trends']['points_growth'] = round(
                    ((recent['points'] - previous['points']) / previous['points']) * 100, 2
                )
            
            if previous['revenue'] > 0:
                analytics['trends']['revenue_growth'] = round(
                    ((recent['revenue'] - previous['revenue']) / previous['revenue']) * 100, 2
                )
        
        # 平均取引額
        total_transactions = PointPurchaseTransaction.objects.filter(
            store=self.store,
            payment_status='success'
        ).count()
        
        if total_transactions > 0:
            total_revenue = sum(entry['revenue'] for entry in analytics['monthly_data'])
            analytics['trends']['average_transaction'] = round(total_revenue / total_transactions, 2)
        
        return analytics
    
    def _get_month_end(self, year, month):
        """月末日を取得"""
        if month == 12:
            next_month = date(year + 1, 1, 1)
        else:
            next_month = date(year, month + 1, 1)
        return next_month - timedelta(days=1)
    
    def _get_due_date(self, year, month):
        """支払期限を取得（翌月5日）"""
        if month == 12:
            return date(year + 1, 1, 5)
        else:
            return date(year, month + 1, 5)
    
    def _generate_invoice_pdf(self, billing):
        """請求書PDFを生成（プレースホルダー）"""
        # 実際の実装では reportlab や weasyprint を使用
        pdf_filename = f"invoice_{billing.billing_id}.pdf"
        pdf_path = f"invoices/{pdf_filename}"
        
        # PDF生成処理をここに実装
        # billing.invoice_pdf_path = pdf_path
        # billing.save()
        
        logger.info(f"Invoice PDF generation placeholder: {pdf_filename}")
        return pdf_path


class BillingAutomationService:
    """請求自動化サービス"""
    
    @staticmethod
    def auto_finalize_monthly_billings():
        """月次請求の自動確定（月初実行用）"""
        from django.db.models import Q
        
        # 前月の下書き請求書を確定
        yesterday = date.today() - timedelta(days=1)
        previous_month_billings = MonthlyBilling.objects.filter(
            billing_year=yesterday.year,
            billing_month=yesterday.month,
            status='draft'
        )
        
        finalized_count = 0
        for billing in previous_month_billings:
            try:
                service = BillingService(billing.store)
                service.finalize_billing(billing.billing_id)
                finalized_count += 1
            except Exception as e:
                logger.error(f"Auto-finalization failed for {billing.billing_id}: {str(e)}")
        
        logger.info(f"Auto-finalized {finalized_count} billings")
        return finalized_count
    
    @staticmethod
    def check_all_overdue_billings():
        """全店舗の延滞請求チェック"""
        stores_with_overdue = []
        
        for store in Store.objects.filter(status='active'):
            try:
                service = BillingService(store)
                overdue_billings = service.check_overdue_billings()
                if overdue_billings.exists():
                    stores_with_overdue.append({
                        'store': store,
                        'overdue_count': overdue_billings.count(),
                        'overdue_amount': sum(b.total_amount for b in overdue_billings)
                    })
            except Exception as e:
                logger.error(f"Overdue check failed for store {store.id}: {str(e)}")
        
        return stores_with_overdue