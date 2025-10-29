# Generated migration for Melty+ integration
# Created: 2025-10-29
# Purpose: Add registration form fields (phone, work_region, industry, employment_type)
# Database: PostgreSQL (Fly.io)

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_add_service_areas'),  # 前のマイグレーションに依存
    ]

    operations = [
        # 1. 電話番号フィールド追加
        migrations.AddField(
            model_name='user',
            name='phone',
            field=models.CharField(
                max_length=20,
                unique=True,
                null=True,  # 既存ユーザーのため一時的にnull許可
                blank=True,
                help_text='電話番号 (090-1234-5678形式)'
            ),
        ),
        migrations.AddField(
            model_name='user',
            name='phone_verified',
            field=models.BooleanField(
                default=False,
                help_text='SMS認証済みフラグ'
            ),
        ),
        
        # 2. 勤務地域フィールド追加
        migrations.AddField(
            model_name='user',
            name='work_region',
            field=models.CharField(
                max_length=100,
                blank=True,
                default='',
                help_text='勤務地域 (47都道府県)'
            ),
        ),
        
        # 3. 業種フィールド追加
        migrations.AddField(
            model_name='user',
            name='industry',
            field=models.CharField(
                max_length=200,
                blank=True,
                default='',
                help_text='業種 (11選択肢)'
            ),
        ),
        
        # 4. 働き方フィールド追加
        migrations.AddField(
            model_name='user',
            name='employment_type',
            field=models.CharField(
                max_length=50,
                choices=[('専業', '専業'), ('副業', '副業')],
                blank=True,
                default='',
                help_text='働き方'
            ),
        ),
        
        # 5. Melty連携フィールド拡張
        migrations.AddField(
            model_name='user',
            name='melty_sync_enabled',
            field=models.BooleanField(
                default=False,
                help_text='Meltyアプリとの双方向同期有効フラグ'
            ),
        ),
        
        # PostgreSQL: melty_linked_at フィールド追加 (既存のmelty_connected_atとは別)
        migrations.AddField(
            model_name='user',
            name='melty_linked_at',
            field=models.DateTimeField(
                null=True,
                blank=True,
                help_text='Melty連携完了日時'
            ),
        ),
        
        # PostgreSQL: 既存データをコピー (melty_connected_at → melty_linked_at)
        migrations.RunSQL(
            sql="""
                UPDATE core_user 
                SET melty_linked_at = melty_connected_at 
                WHERE melty_connected_at IS NOT NULL 
                AND melty_linked_at IS NULL;
            """,
            reverse_sql=migrations.RunSQL.noop
        ),
    ]
