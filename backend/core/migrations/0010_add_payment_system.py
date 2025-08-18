# Generated manually for payment system implementation
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_add_social_skin_fields'),
    ]

    operations = [
        # Add payment-related fields to User model
        migrations.AddField(
            model_name='user',
            name='receipt_email',
            field=models.EmailField(blank=True, help_text='Email address for receipt delivery (can be different from login email)', null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='receipt_delivery_preference',
            field=models.CharField(choices=[('email_only', 'Email Only'), ('app_only', 'App Only'), ('both', 'Email + App'), ('none', 'No Receipt')], default='email_only', max_length=20),
        ),
        migrations.AddField(
            model_name='user',
            name='auto_receipt_email',
            field=models.BooleanField(default=True, help_text='Automatically send receipt emails after payment'),
        ),
        migrations.AddField(
            model_name='user',
            name='payment_history_retention_days',
            field=models.IntegerField(default=365, help_text='Days to retain payment history in app'),
        ),
        migrations.AddField(
            model_name='user',
            name='preferred_payment_method',
            field=models.CharField(blank=True, choices=[('qr', 'QR Code'), ('nfc', 'NFC'), ('manual', 'Manual Entry')], max_length=20, null=True),
        ),
        
        # Create PaymentTransaction model
        migrations.CreateModel(
            name='PaymentTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transaction_id', models.CharField(max_length=100, unique=True)),
                ('terminal_id', models.CharField(blank=True, max_length=50)),
                ('transaction_type', models.CharField(choices=[('payment', 'Payment'), ('refund', 'Refund'), ('points_grant', 'Points Grant')], default='payment', max_length=20)),
                ('payment_method', models.CharField(choices=[('qr', 'QR Code Payment'), ('nfc', 'NFC Payment'), ('cash', 'Cash Payment'), ('card', 'Credit Card'), ('points', 'Points Payment'), ('deposit', 'Store Deposit')], max_length=20)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('processing', 'Processing'), ('completed', 'Completed'), ('failed', 'Failed'), ('cancelled', 'Cancelled'), ('refunded', 'Refunded'), ('partial_refunded', 'Partial Refunded')], default='pending', max_length=20)),
                ('subtotal', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('tax_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('points_earned', models.IntegerField(default=0)),
                ('points_used', models.IntegerField(default=0)),
                ('points_balance_before', models.IntegerField(default=0)),
                ('points_balance_after', models.IntegerField(default=0)),
                ('gmopg_order_id', models.CharField(blank=True, max_length=100, null=True)),
                ('gmopg_transaction_id', models.CharField(blank=True, max_length=100, null=True)),
                ('external_payment_data', models.JSONField(blank=True, default=dict)),
                ('description', models.TextField(blank=True)),
                ('metadata', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('receipt_number', models.CharField(blank=True, max_length=50, null=True, unique=True)),
                ('receipt_generated', models.BooleanField(default=False)),
                ('receipt_emailed', models.BooleanField(default=False)),
                ('receipt_email_sent_at', models.DateTimeField(blank=True, null=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payment_transactions', to='core.user')),
                ('store', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payment_transactions', to='core.store')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        
        # Create PaymentTransactionItem model
        migrations.CreateModel(
            name='PaymentTransactionItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_name', models.CharField(max_length=200)),
                ('item_code', models.CharField(blank=True, max_length=100)),
                ('category', models.CharField(blank=True, max_length=100)),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('quantity', models.IntegerField(default=1)),
                ('subtotal', models.DecimalField(decimal_places=2, max_digits=10)),
                ('tax_rate', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ('tax_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('metadata', models.JSONField(blank=True, default=dict)),
                ('transaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='core.paymenttransaction')),
            ],
        ),
        
        # Create PaymentLog model
        migrations.CreateModel(
            name='PaymentLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('level', models.CharField(choices=[('debug', 'Debug'), ('info', 'Info'), ('warning', 'Warning'), ('error', 'Error'), ('critical', 'Critical')], default='info', max_length=10)),
                ('message', models.TextField()),
                ('details', models.JSONField(blank=True, default=dict)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('transaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='core.paymenttransaction')),
            ],
            options={
                'ordering': ['-timestamp'],
            },
        ),
        
        # Create Receipt model
        migrations.CreateModel(
            name='Receipt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('receipt_number', models.CharField(max_length=50, unique=True)),
                ('receipt_data', models.JSONField(default=dict)),
                ('pdf_file_path', models.CharField(blank=True, max_length=500)),
                ('email_recipient', models.EmailField(blank=True, null=True)),
                ('email_sent_at', models.DateTimeField(blank=True, null=True)),
                ('app_delivered_at', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(choices=[('generated', 'Generated'), ('emailed', 'Emailed'), ('delivered', 'Delivered'), ('failed', 'Failed')], default='generated', max_length=20)),
                ('generated_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('transaction', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='receipt', to='core.paymenttransaction')),
            ],
            options={
                'ordering': ['-generated_at'],
            },
        ),
        
        # Create StoreConfiguration model
        migrations.CreateModel(
            name='StoreConfiguration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tax_rate', models.DecimalField(decimal_places=2, default=10.0, max_digits=5)),
                ('tax_inclusive', models.BooleanField(default=True)),
                ('receipt_logo_url', models.URLField(blank=True)),
                ('receipt_footer_message', models.TextField(blank=True, default='Thank you for your visit!')),
                ('receipt_template', models.CharField(default='standard', max_length=50)),
                ('gmopg_shop_id', models.CharField(blank=True, max_length=100)),
                ('gmopg_api_key', models.CharField(blank=True, max_length=200)),
                ('payment_timeout_seconds', models.IntegerField(default=300)),
                ('point_rate', models.DecimalField(decimal_places=2, default=1.0, max_digits=5)),
                ('minimum_payment_for_points', models.DecimalField(decimal_places=2, default=100, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('store', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='configuration', to='core.store')),
            ],
        ),
        
        # Add database indexes
        migrations.AddIndex(
            model_name='paymenttransaction',
            index=models.Index(fields=['customer', '-created_at'], name='core_paymen_custome_123456_idx'),
        ),
        migrations.AddIndex(
            model_name='paymenttransaction',
            index=models.Index(fields=['store', '-created_at'], name='core_paymen_store_i_123456_idx'),
        ),
        migrations.AddIndex(
            model_name='paymenttransaction',
            index=models.Index(fields=['status', 'created_at'], name='core_paymen_status_123456_idx'),
        ),
        migrations.AddIndex(
            model_name='paymenttransaction',
            index=models.Index(fields=['transaction_id'], name='core_paymen_transac_123456_idx'),
        ),
        migrations.AddIndex(
            model_name='paymenttransaction',
            index=models.Index(fields=['gmopg_order_id'], name='core_paymen_gmopg_o_123456_idx'),
        ),
    ]