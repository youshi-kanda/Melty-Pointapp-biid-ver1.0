# Generated for MELTY rank configuration system

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_enhanced_social_security'),
    ]

    operations = [
        migrations.CreateModel(
            name='MeltyRankConfiguration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('melty_membership_type', models.CharField(choices=[('free', 'MELTY無料会員'), ('premium', 'MELTYプレミアム会員')], max_length=20, unique=True, verbose_name='MELTY会員種別')),
                ('biid_initial_rank', models.CharField(choices=[('bronze', 'ブロンズ'), ('silver', 'シルバー'), ('gold', 'ゴールド'), ('platinum', 'プラチナ'), ('diamond', 'ダイヤモンド')], max_length=20, verbose_name='BIID初期ランク')),
                ('welcome_bonus_points', models.IntegerField(default=1000, verbose_name='ウェルカムボーナスポイント')),
                ('points_expiry_months', models.IntegerField(default=12, verbose_name='ポイント有効期限（月）')),
                ('member_id_prefix', models.CharField(default='S', max_length=5, verbose_name='会員ID接頭辞')),
                ('is_active', models.BooleanField(default=True, verbose_name='有効')),
                ('description', models.TextField(blank=True, verbose_name='説明')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'MELTY会員ランク設定',
                'verbose_name_plural': 'MELTY会員ランク設定',
                'ordering': ['melty_membership_type'],
            },
        ),
        # Insert default configurations
        migrations.RunSQL(
            "INSERT INTO core_meltyrankConfiguration (melty_membership_type, biid_initial_rank, welcome_bonus_points, points_expiry_months, member_id_prefix, is_active, description, created_at, updated_at) VALUES "
            "('free', 'silver', 1000, 12, 'S', 1, 'MELTY無料会員向けのシルバーランク設定', datetime('now'), datetime('now')), "
            "('premium', 'gold', 2000, 18, 'G', 1, 'MELTYプレミアム会員向けのゴールドランク設定', datetime('now'), datetime('now'))"
        ),
    ]