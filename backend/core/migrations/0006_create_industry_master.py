# Generated migration for Industry master table
# Created: 2025-10-29
# Purpose: Create industries master table for business classification

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_add_melty_integration_fields'),  # 前のマイグレーションに依存
    ]

    operations = [
        # Industry master table creation
        migrations.CreateModel(
            name='Industry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50, unique=True, help_text='業種コード')),
                ('name', models.CharField(max_length=200, help_text='表示名')),
                ('category', models.CharField(max_length=100, blank=True, help_text='カテゴリ')),
                ('display_order', models.IntegerField(default=0, help_text='表示順序')),
            ],
            options={
                'verbose_name': '業種',
                'verbose_name_plural': '業種',
                'ordering': ['display_order'],
            },
        ),
        
        # Insert master data (11 industries)
        migrations.RunSQL(
            sql="""
                INSERT INTO core_industry (id, code, name, category, display_order) VALUES
                (1, 'nightwork_cabaret', 'ナイトワーク(キャバクラ・クラブ等)', 'nightwork', 1),
                (2, 'nightwork_girls_bar', 'ナイトワーク(ガールズバー・スナック等)', 'nightwork', 2),
                (3, 'nightwork_host', 'ナイトワーク(ホスト・ボーイズバー等)', 'nightwork', 3),
                (4, 'nightwork_other', 'ナイトワーク(その他)', 'nightwork', 4),
                (5, 'beauty', '美容・エステ・ネイル', 'service', 5),
                (6, 'fashion', 'アパレル・ファッション', 'retail', 6),
                (7, 'food_service', '飲食・サービス', 'service', 7),
                (8, 'office_worker', '会社員・OL', 'office', 8),
                (9, 'freelance', '自営業・フリーランス', 'self_employed', 9),
                (10, 'student', '学生・アルバイト', 'student', 10),
                (11, 'other', 'その他', 'other', 11);
            """,
            reverse_sql="DELETE FROM core_industry;"
        ),
    ]
