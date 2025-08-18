from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.db import transaction
import logging

from .models import Store, User, Notification
from .email_service import send_store_registration_notification, send_store_status_notification

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Store)
def handle_store_creation(sender, instance, created, **kwargs):
    """店舗作成時の処理"""
    if created:
        logger.info(f"New store registered: {instance.name} (ID: {instance.id})")
        
        # 非同期でメール通知を送信（エラーハンドリング付き）
        transaction.on_commit(
            lambda: send_store_registration_notification(instance)
        )


@receiver(pre_save, sender=Store)  
def handle_store_status_change(sender, instance, **kwargs):
    """店舗ステータス変更の検知"""
    if instance.pk:  # 既存のレコードの場合
        try:
            old_instance = Store.objects.get(pk=instance.pk)
            
            # ステータスが変更された場合
            if old_instance.status != instance.status:
                logger.info(f"Store status changed: {instance.name} {old_instance.status} -> {instance.status}")
                
                # ステータス変更通知を送信
                transaction.on_commit(
                    lambda: send_store_status_notification(instance, instance.status)
                )
                
        except Store.DoesNotExist:
            pass


@receiver(post_save, sender=User)
def handle_user_creation(sender, instance, created, **kwargs):
    """ユーザー作成時の処理（店舗管理者の場合）"""
    if created and instance.role == 'store_manager':
        logger.info(f"New store manager created: {instance.username} (ID: {instance.id})")
        
        # ウェルカム通知を作成
        Notification.objects.create(
            user=instance,
            notification_type='welcome',
            title='biid Storeへようこそ',
            message='biid Store店舗管理システムへのご登録ありがとうございます。店舗運営を成功させるためのツールをご活用ください。',
            email_template='store_manager_welcome',
            priority='normal'
        )