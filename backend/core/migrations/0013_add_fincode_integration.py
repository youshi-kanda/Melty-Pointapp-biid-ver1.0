# Generated migration for FINCODE integration

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_add_payment_system'),
    ]

    operations = [
        migrations.AddField(
            model_name='paymenttransaction',
            name='fincode_payment_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='paymenttransaction',
            name='fincode_order_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddIndex(
            model_name='paymenttransaction',
            index=models.Index(fields=['fincode_payment_id'], name='core_paymenttransaction_fincode_payment_id_idx'),
        ),
    ]