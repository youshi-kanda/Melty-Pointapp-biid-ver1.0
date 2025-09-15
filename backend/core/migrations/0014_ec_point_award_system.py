# Generated manually for EC Point Award System

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_add_fincode_integration'),
    ]

    operations = [
        # EC Point Request (統合ポイント申請テーブル)
        migrations.CreateModel(
            name='ECPointRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('request_type', models.CharField(
                    max_length=20,
                    choices=[('webhook', 'Webhook'), ('receipt', 'Receipt')],
                    verbose_name='申請方式'
                )),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to='core.user',
                    verbose_name='申請者'
                )),
                ('store', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to='core.store',
                    verbose_name='店舗'
                )),
                ('purchase_amount', models.DecimalField(
                    decimal_places=2,
                    max_digits=10,
                    verbose_name='購入金額'
                )),
                ('order_id', models.CharField(
                    max_length=100,
                    verbose_name='注文ID'
                )),
                ('purchase_date', models.DateTimeField(verbose_name='購入日時')),
                
                # レシート関連フィールド
                ('receipt_image', models.ImageField(
                    blank=True,
                    null=True,
                    upload_to='receipts/',
                    verbose_name='レシート画像'
                )),
                ('receipt_description', models.TextField(
                    blank=True,
                    verbose_name='レシート詳細'
                )),
                
                # 処理状況
                ('status', models.CharField(
                    max_length=20,
                    choices=[
                        ('pending', '店舗承認待ち'),
                        ('approved', '承認済み'),
                        ('rejected', '拒否済み'),
                        ('completed', 'ポイント付与完了'),
                        ('failed', '処理失敗')
                    ],
                    default='pending',
                    verbose_name='処理状況'
                )),
                ('points_to_award', models.IntegerField(verbose_name='付与予定ポイント')),
                ('points_awarded', models.IntegerField(default=0, verbose_name='実付与ポイント')),
                
                # 店舗処理情報
                ('store_approved_at', models.DateTimeField(
                    blank=True,
                    null=True,
                    verbose_name='店舗承認日時'
                )),
                ('store_approved_by', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='approved_ec_requests',
                    to='core.user',
                    verbose_name='店舗承認者'
                )),
                ('rejection_reason', models.TextField(
                    blank=True,
                    verbose_name='拒否理由'
                )),
                
                # 決済・デポジット情報
                ('payment_method', models.CharField(
                    max_length=20,
                    choices=[
                        ('card_payment', 'クレジット決済'),
                        ('deposit_consumption', 'デポジット消費')
                    ],
                    blank=True,
                    verbose_name='支払い方法'
                )),
                ('payment_reference', models.CharField(
                    max_length=100,
                    blank=True,
                    verbose_name='決済参照ID'
                )),
                ('deposit_transaction', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    to='core.deposittransaction',
                    verbose_name='デポジット取引'
                )),
                
                # 重複防止・監査
                ('request_hash', models.CharField(
                    max_length=64,
                    unique=True,
                    verbose_name='リクエストハッシュ'
                )),
                ('ip_address', models.GenericIPAddressField(verbose_name='IPアドレス')),
                ('user_agent', models.TextField(blank=True, verbose_name='User Agent')),
                
                # タイムスタンプ
                ('created_at', models.DateTimeField(
                    auto_now_add=True,
                    verbose_name='作成日時'
                )),
                ('updated_at', models.DateTimeField(
                    auto_now=True,
                    verbose_name='更新日時'
                )),
                ('completed_at', models.DateTimeField(
                    blank=True,
                    null=True,
                    verbose_name='完了日時'
                )),
            ],
            options={
                'db_table': 'ec_point_requests',
                'verbose_name': 'ECポイント申請',
                'verbose_name_plural': 'ECポイント申請',
                'ordering': ['-created_at'],
            },
        ),
        
        # Store Webhook Keys (店舗Webhook認証キー)
        migrations.CreateModel(
            name='StoreWebhookKey',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('store', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='webhook_key',
                    to='core.store',
                    verbose_name='店舗'
                )),
                ('webhook_key', models.CharField(
                    max_length=64,
                    unique=True,
                    verbose_name='Webhook認証キー'
                )),
                ('allowed_ips', models.JSONField(
                    default=list,
                    verbose_name='許可IPアドレス'
                )),
                ('is_active', models.BooleanField(
                    default=True,
                    verbose_name='有効状態'
                )),
                ('rate_limit_per_minute', models.IntegerField(
                    default=60,
                    verbose_name='分間リクエスト制限'
                )),
                ('last_used_at', models.DateTimeField(
                    blank=True,
                    null=True,
                    verbose_name='最終使用日時'
                )),
                ('created_at', models.DateTimeField(
                    auto_now_add=True,
                    verbose_name='作成日時'
                )),
                ('updated_at', models.DateTimeField(
                    auto_now=True,
                    verbose_name='更新日時'
                )),
            ],
            options={
                'db_table': 'store_webhook_keys',
                'verbose_name': '店舗Webhookキー',
                'verbose_name_plural': '店舗Webhookキー',
            },
        ),
        
        # Point Award Log (ポイント付与ログ)
        migrations.CreateModel(
            name='PointAwardLog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ec_request', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='award_log',
                    to='core.ecpointrequest',
                    verbose_name='EC申請'
                )),
                ('point_transaction', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to='core.pointtransaction',
                    verbose_name='ポイント取引'
                )),
                ('awarded_points', models.IntegerField(verbose_name='付与ポイント')),
                ('award_rate', models.DecimalField(
                    decimal_places=4,
                    max_digits=8,
                    verbose_name='付与率'
                )),
                ('processing_duration_ms', models.IntegerField(
                    blank=True,
                    null=True,
                    verbose_name='処理時間(ms)'
                )),
                ('created_at', models.DateTimeField(
                    auto_now_add=True,
                    verbose_name='作成日時'
                )),
            ],
            options={
                'db_table': 'point_award_logs',
                'verbose_name': 'ポイント付与ログ',
                'verbose_name_plural': 'ポイント付与ログ',
                'ordering': ['-created_at'],
            },
        ),
        
        # Duplicate Detection (重複検知)
        migrations.CreateModel(
            name='DuplicateDetection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('detection_type', models.CharField(
                    max_length=20,
                    choices=[
                        ('order_id', '注文ID重複'),
                        ('pattern_match', 'パターンマッチ'),
                        ('suspicious', '不審な活動')
                    ],
                    verbose_name='検知種別'
                )),
                ('original_request', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='duplicate_detections_as_original',
                    to='core.ecpointrequest',
                    verbose_name='元申請'
                )),
                ('duplicate_request', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='duplicate_detections_as_duplicate',
                    to='core.ecpointrequest',
                    verbose_name='重複申請'
                )),
                ('detection_details', models.JSONField(
                    default=dict,
                    verbose_name='検知詳細'
                )),
                ('severity', models.CharField(
                    max_length=20,
                    choices=[
                        ('low', '低'),
                        ('medium', '中'),
                        ('high', '高'),
                        ('critical', '重大')
                    ],
                    verbose_name='重要度'
                )),
                ('is_resolved', models.BooleanField(
                    default=False,
                    verbose_name='解決済み'
                )),
                ('resolved_by', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    to='core.user',
                    verbose_name='解決者'
                )),
                ('resolved_at', models.DateTimeField(
                    blank=True,
                    null=True,
                    verbose_name='解決日時'
                )),
                ('created_at', models.DateTimeField(
                    auto_now_add=True,
                    verbose_name='検知日時'
                )),
            ],
            options={
                'db_table': 'duplicate_detections',
                'verbose_name': '重複検知',
                'verbose_name_plural': '重複検知',
                'ordering': ['-created_at'],
            },
        ),
        
        # Indexes for performance
        migrations.RunSQL(
            """
            CREATE INDEX idx_ec_point_requests_status_created ON ec_point_requests (status, created_at);
            CREATE INDEX idx_ec_point_requests_store_status ON ec_point_requests (store_id, status);
            CREATE INDEX idx_ec_point_requests_user_created ON ec_point_requests (user_id, created_at);
            CREATE INDEX idx_ec_point_requests_order_id ON ec_point_requests (order_id);
            CREATE INDEX idx_ec_point_requests_request_hash ON ec_point_requests (request_hash);
            """
        ),
    ]