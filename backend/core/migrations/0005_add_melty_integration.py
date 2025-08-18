# Generated manually for melty integration

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_auto_20250729_1757'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='melty_user_id',
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='user',
            name='melty_email',
            field=models.EmailField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='melty_connected_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='is_melty_linked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='melty_profile_data',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name='user',
            name='registration_source',
            field=models.CharField(
                choices=[
                    ('direct', 'Direct biid registration'),
                    ('melty', 'Melty app referral'),
                    ('social', 'Social media'),
                    ('store', 'Store referral'),
                ],
                default='direct',
                max_length=20
            ),
        ),
    ]