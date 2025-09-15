# Generated migration for social functionality

from django.db import migrations, models
import django.db.models.deletion
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_enhanced_store_payment_system'),
    ]

    operations = [
        # User モデルの拡張
        migrations.AddField(
            model_name='user',
            name='unlocked_social_skins',
            field=models.JSONField(default=list, help_text="List of unlocked social skins for the user"),
        ),
        migrations.AddField(
            model_name='user',
            name='bio',
            field=models.TextField(blank=True, help_text="User's self-introduction", max_length=500),
        ),
        migrations.AddField(
            model_name='user',
            name='birth_date',
            field=models.DateField(blank=True, help_text="User's birth date", null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='gender',
            field=models.CharField(choices=[('male', '男性'), ('female', '女性'), ('other', 'その他'), ('private', '非公開')], default='private', help_text="User's gender", max_length=10),
        ),
        migrations.AddField(
            model_name='user',
            name='website',
            field=models.URLField(blank=True, help_text="User's personal website or blog"),
        ),
        migrations.AddField(
            model_name='user',
            name='friends_count',
            field=models.IntegerField(default=0, help_text="Number of friends this user has"),
        ),
        migrations.AddField(
            model_name='user',
            name='posts_count',
            field=models.IntegerField(default=0, help_text="Number of social posts by this user"),
        ),
        migrations.AddField(
            model_name='user',
            name='reviews_count',
            field=models.IntegerField(default=0, help_text="Number of reviews posted by this user"),
        ),
        migrations.AddField(
            model_name='user',
            name='profile_visibility',
            field=models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='private', help_text='Overall profile visibility setting', max_length=20),
        ),
        migrations.AddField(
            model_name='user',
            name='show_online_status',
            field=models.BooleanField(default=False, help_text='Show online/offline status to friends'),
        ),
        migrations.AddField(
            model_name='user',
            name='last_active_at',
            field=models.DateTimeField(blank=True, help_text='Last time user was active on social features', null=True),
        ),

        # プライバシー設定テーブル
        migrations.CreateModel(
            name='UserPrivacySettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_name_visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='friends', help_text='表示名の公開範囲', max_length=20)),
                ('profile_avatar_visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='public', help_text='アバター画像の公開範囲', max_length=20)),
                ('profile_bio_visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='friends', help_text='自己紹介の公開範囲', max_length=20)),
                ('profile_location_visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='private', help_text='居住地の公開範囲', max_length=20)),
                ('profile_age_visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='private', help_text='年齢の公開範囲', max_length=20)),
                ('profile_gender_visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='private', help_text='性別の公開範囲', max_length=20)),
                ('points_total_visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='private', help_text='累計ポイントの公開範囲', max_length=20)),
                ('points_recent_visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='private', help_text='最近のポイント活動の公開範囲', max_length=20)),
                ('stores_visited_visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='limited', help_text='利用店舗情報の公開範囲', max_length=20)),
                ('reviews_posted_visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='public', help_text='投稿したレビューの公開範囲', max_length=20)),
                ('gifts_received_visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='friends', help_text='受け取ったギフトの公開範囲', max_length=20)),
                ('achievements_visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='public', help_text='獲得した実績・バッジの公開範囲', max_length=20)),
                ('friend_requests_accept', models.CharField(choices=[('none', '受け付けない'), ('mutual_friends', '相互フレンド経由'), ('all', 'すべてのユーザー')], default='all', help_text='フレンド申請の受付設定', max_length=20)),
                ('messages_accept', models.CharField(choices=[('none', '受け付けない'), ('friends', 'フレンドのみ'), ('all', 'すべてのユーザー')], default='friends', help_text='メッセージ受信設定', max_length=20)),
                ('post_comments_allow', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='friends', help_text='投稿へのコメント許可設定', max_length=20)),
                ('post_reactions_allow', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='public', help_text='投稿への反応許可設定', max_length=20)),
                ('friend_list_visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='friends', help_text='フレンドリストの表示設定', max_length=20)),
                ('online_status_visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='friends', help_text='オンライン状態の表示設定', max_length=20)),
                ('notification_preferences', models.JSONField(default=dict, help_text='通知設定の詳細（JSON形式）')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='privacy_settings', to='core.user')),
            ],
            options={
                'verbose_name': 'プライバシー設定',
                'verbose_name_plural': 'プライバシー設定',
                'db_table': 'user_privacy_settings',
            },
        ),

        # フレンド関係テーブル
        migrations.CreateModel(
            name='Friendship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', '申請中'), ('accepted', '承認済み'), ('declined', '拒否'), ('blocked', 'ブロック')], default='pending', help_text='フレンド申請の状態', max_length=20)),
                ('message', models.TextField(blank=True, help_text='申請時のメッセージ', max_length=500, null=True)),
                ('category', models.CharField(choices=[('family', '家族'), ('close_friend', '親友'), ('friend', '友人'), ('acquaintance', '知人'), ('colleague', '同僚'), ('other', 'その他')], default='friend', help_text='フレンドのカテゴリ分類', max_length=20)),
                ('is_favorite', models.BooleanField(default=False, help_text='お気に入りフレンドか')),
                ('friends_since', models.DateTimeField(blank=True, help_text='フレンドになった日時', null=True)),
                ('last_interaction_at', models.DateTimeField(blank=True, help_text='最後に交流した日時', null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('from_user', models.ForeignKey(help_text='フレンド申請を送ったユーザー', on_delete=django.db.models.deletion.CASCADE, related_name='sent_friend_requests', to='core.user')),
                ('to_user', models.ForeignKey(help_text='フレンド申請を受けたユーザー', on_delete=django.db.models.deletion.CASCADE, related_name='received_friend_requests', to='core.user')),
            ],
            options={
                'verbose_name': 'フレンド関係',
                'verbose_name_plural': 'フレンド関係',
                'db_table': 'friendships',
            },
        ),

        # ソーシャル投稿テーブル
        migrations.CreateModel(
            name='SocialPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('post_type', models.CharField(choices=[('text', 'テキスト'), ('image', '画像'), ('checkin', 'チェックイン'), ('review', 'レビュー'), ('achievement', '実績達成'), ('gift', 'ギフト投稿')], help_text='投稿タイプ', max_length=20)),
                ('content', models.TextField(help_text='投稿内容', max_length=2000)),
                ('images', models.JSONField(default=list, help_text='添付画像のURL一覧（JSON配列）')),
                ('location_name', models.CharField(blank=True, help_text='位置の名前（店舗以外の場所用）', max_length=255)),
                ('latitude', models.DecimalField(blank=True, decimal_places=8, help_text='緯度', max_digits=10, null=True)),
                ('longitude', models.DecimalField(blank=True, decimal_places=8, help_text='経度', max_digits=11, null=True)),
                ('visibility', models.CharField(choices=[('private', '自分のみ'), ('friends', 'フレンドのみ'), ('limited', '制限公開'), ('public', '完全公開')], default='friends', help_text='投稿の公開範囲', max_length=20)),
                ('hashtags', models.JSONField(default=list, help_text='ハッシュタグ一覧（JSON配列）')),
                ('likes_count', models.IntegerField(default=0, help_text='いいね数')),
                ('comments_count', models.IntegerField(default=0, help_text='コメント数')),
                ('shares_count', models.IntegerField(default=0, help_text='シェア数')),
                ('views_count', models.IntegerField(default=0, help_text='閲覧数')),
                ('is_pinned', models.BooleanField(default=False, help_text='プロフィール上部に固定')),
                ('is_deleted', models.BooleanField(default=False, help_text='削除済み')),
                ('is_reported', models.BooleanField(default=False, help_text='報告済み')),
                ('metadata', models.JSONField(default=dict, help_text='追加のメタデータ（JSON形式）')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('author', models.ForeignKey(help_text='投稿者', on_delete=django.db.models.deletion.CASCADE, related_name='social_posts', to='core.user')),
                ('location', models.ForeignKey(blank=True, help_text='関連する店舗', null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.store')),
                ('allowed_users', models.ManyToManyField(blank=True, help_text='特定ユーザーのみ公開時の対象ユーザー', related_name='allowed_posts', to='core.user')),
            ],
            options={
                'verbose_name': 'ソーシャル投稿',
                'verbose_name_plural': 'ソーシャル投稿',
                'db_table': 'social_posts',
                'ordering': ['-created_at'],
            },
        ),

        # 投稿いいねテーブル
        migrations.CreateModel(
            name='SocialPostLike',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reaction_type', models.CharField(choices=[('like', 'いいね'), ('love', '❤️'), ('laugh', '😂'), ('wow', '😮'), ('sad', '😢'), ('angry', '😡')], default='like', help_text='リアクションの種類', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('post', models.ForeignKey(help_text='いいねされた投稿', on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='core.socialpost')),
                ('user', models.ForeignKey(help_text='いいねしたユーザー', on_delete=django.db.models.deletion.CASCADE, related_name='post_likes', to='core.user')),
            ],
            options={
                'verbose_name': '投稿いいね',
                'verbose_name_plural': '投稿いいね',
                'db_table': 'social_post_likes',
            },
        ),

        # 投稿コメントテーブル
        migrations.CreateModel(
            name='SocialPostComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(help_text='コメント内容', max_length=1000)),
                ('likes_count', models.IntegerField(default=0, help_text='コメントへのいいね数')),
                ('replies_count', models.IntegerField(default=0, help_text='返信数')),
                ('is_deleted', models.BooleanField(default=False, help_text='削除済み')),
                ('is_reported', models.BooleanField(default=False, help_text='報告済み')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('parent_comment', models.ForeignKey(blank=True, help_text='親コメント（返信の場合）', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='replies', to='core.socialpostcomment')),
                ('post', models.ForeignKey(help_text='コメントされた投稿', on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='core.socialpost')),
                ('user', models.ForeignKey(help_text='コメントしたユーザー', on_delete=django.db.models.deletion.CASCADE, related_name='post_comments', to='core.user')),
            ],
            options={
                'verbose_name': '投稿コメント',
                'verbose_name_plural': '投稿コメント',
                'db_table': 'social_post_comments',
                'ordering': ['created_at'],
            },
        ),

        # 投稿シェアテーブル
        migrations.CreateModel(
            name='SocialPostShare',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('share_type', models.CharField(choices=[('repost', 'リポスト'), ('quote', '引用投稿'), ('private', 'プライベート共有'), ('external', '外部SNS')], help_text='シェアの種類', max_length=20)),
                ('comment', models.TextField(blank=True, help_text='シェア時のコメント', max_length=500)),
                ('external_platform', models.CharField(blank=True, help_text='外部プラットフォーム名', max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('post', models.ForeignKey(help_text='シェアされた投稿', on_delete=django.db.models.deletion.CASCADE, related_name='shares', to='core.socialpost')),
                ('user', models.ForeignKey(help_text='シェアしたユーザー', on_delete=django.db.models.deletion.CASCADE, related_name='post_shares', to='core.user')),
            ],
            options={
                'verbose_name': '投稿シェア',
                'verbose_name_plural': '投稿シェア',
                'db_table': 'social_post_shares',
            },
        ),

        # ユーザーブロックテーブル
        migrations.CreateModel(
            name='UserBlock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reason', models.CharField(choices=[('spam', 'スパム'), ('harassment', '嫌がらせ'), ('inappropriate_content', '不適切なコンテンツ'), ('fake_account', '偽アカウント'), ('personal_reasons', '個人的理由'), ('other', 'その他')], default='personal_reasons', help_text='ブロック理由', max_length=50)),
                ('notes', models.TextField(blank=True, help_text='ブロック理由の詳細', max_length=500)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('blocked', models.ForeignKey(help_text='ブロックされたユーザー', on_delete=django.db.models.deletion.CASCADE, related_name='blocked_by_users', to='core.user')),
                ('blocker', models.ForeignKey(help_text='ブロックしたユーザー', on_delete=django.db.models.deletion.CASCADE, related_name='blocking_users', to='core.user')),
            ],
            options={
                'verbose_name': 'ユーザーブロック',
                'verbose_name_plural': 'ユーザーブロック',
                'db_table': 'user_blocks',
            },
        ),

        # 詳細レビューテーブル
        migrations.CreateModel(
            name='DetailedReview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('overall_rating', models.IntegerField(choices=[(1, '1点'), (2, '2点'), (3, '3点'), (4, '4点'), (5, '5点')], help_text='総合評価（1-5点）', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('service_rating', models.IntegerField(choices=[(1, '1点'), (2, '2点'), (3, '3点'), (4, '4点'), (5, '5点')], help_text='サービス評価（1-5点）', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('atmosphere_rating', models.IntegerField(choices=[(1, '1点'), (2, '2点'), (3, '3点'), (4, '4点'), (5, '5点')], help_text='雰囲気評価（1-5点）', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('value_rating', models.IntegerField(choices=[(1, '1点'), (2, '2点'), (3, '3点'), (4, '4点'), (5, '5点')], help_text='コストパフォーマンス評価（1-5点）', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('title', models.CharField(help_text='レビューのタイトル', max_length=100)),
                ('content', models.TextField(help_text='レビュー本文', max_length=2000)),
                ('images', models.JSONField(default=list, help_text='レビュー画像のURL一覧')),
                ('usage_scenes', models.JSONField(default=list, help_text='利用シーン（複数選択可）')),
                ('visit_date', models.DateField(help_text='訪問日')),
                ('visit_count', models.IntegerField(default=1, help_text='訪問回数', validators=[django.core.validators.MinValueValidator(1)])),
                ('spent_amount', models.IntegerField(blank=True, help_text='利用金額（円）', null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('helpful_count', models.IntegerField(default=0, help_text='「役に立った」の数')),
                ('views_count', models.IntegerField(default=0, help_text='レビュー閲覧数')),
                ('visibility', models.CharField(choices=[('private', '非公開'), ('friends', 'フレンドのみ'), ('public', '公開')], default='public', help_text='レビューの公開範囲', max_length=20)),
                ('show_reviewer_name', models.BooleanField(default=True, help_text='レビュアー名を表示する')),
                ('is_verified_visit', models.BooleanField(default=False, help_text='訪問が認証済み（ポイント利用履歴と照合）')),
                ('is_featured', models.BooleanField(default=False, help_text='注目レビュー')),
                ('is_reported', models.BooleanField(default=False, help_text='報告済み')),
                ('is_deleted', models.BooleanField(default=False, help_text='削除済み')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('store', models.ForeignKey(help_text='レビュー対象の店舗', on_delete=django.db.models.deletion.CASCADE, related_name='detailed_reviews', to='core.store')),
                ('user', models.ForeignKey(help_text='レビュー投稿者', on_delete=django.db.models.deletion.CASCADE, related_name='detailed_reviews', to='core.user')),
            ],
            options={
                'verbose_name': '詳細レビュー',
                'verbose_name_plural': '詳細レビュー',
                'db_table': 'detailed_reviews',
                'ordering': ['-created_at'],
            },
        ),

        # レビュー役立ち評価テーブル
        migrations.CreateModel(
            name='ReviewHelpful',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('review', models.ForeignKey(help_text='「役に立った」をマークされたレビュー', on_delete=django.db.models.deletion.CASCADE, related_name='helpful_marks', to='core.detailedreview')),
                ('user', models.ForeignKey(help_text='「役に立った」をマークしたユーザー', on_delete=django.db.models.deletion.CASCADE, related_name='review_helpful_marks', to='core.user')),
            ],
            options={
                'verbose_name': 'レビュー役立ち評価',
                'verbose_name_plural': 'レビュー役立ち評価',
                'db_table': 'review_helpful',
            },
        ),

        # インデックスとユニーク制約の追加
        migrations.AddIndex(
            model_name='friendship',
            index=models.Index(fields=['from_user', 'status'], name='friendships_from_user_status_idx'),
        ),
        migrations.AddIndex(
            model_name='friendship',
            index=models.Index(fields=['to_user', 'status'], name='friendships_to_user_status_idx'),
        ),
        migrations.AddIndex(
            model_name='socialpost',
            index=models.Index(fields=['author', '-created_at'], name='social_posts_author_created_idx'),
        ),
        migrations.AddIndex(
            model_name='socialpost',
            index=models.Index(fields=['visibility', '-created_at'], name='social_posts_visibility_created_idx'),
        ),
        migrations.AddIndex(
            model_name='socialpost',
            index=models.Index(fields=['post_type', '-created_at'], name='social_posts_type_created_idx'),
        ),
        migrations.AddIndex(
            model_name='socialpostlike',
            index=models.Index(fields=['post', '-created_at'], name='social_post_likes_post_created_idx'),
        ),
        migrations.AddIndex(
            model_name='socialpostcomment',
            index=models.Index(fields=['post', 'created_at'], name='social_post_comments_post_created_idx'),
        ),
        migrations.AddIndex(
            model_name='socialpostcomment',
            index=models.Index(fields=['user', '-created_at'], name='social_post_comments_user_created_idx'),
        ),
        migrations.AddIndex(
            model_name='socialpostshare',
            index=models.Index(fields=['post', '-created_at'], name='social_post_shares_post_created_idx'),
        ),
        migrations.AddIndex(
            model_name='socialpostshare',
            index=models.Index(fields=['user', '-created_at'], name='social_post_shares_user_created_idx'),
        ),
        migrations.AddIndex(
            model_name='userblock',
            index=models.Index(fields=['blocker'], name='user_blocks_blocker_idx'),
        ),
        migrations.AddIndex(
            model_name='userblock',
            index=models.Index(fields=['blocked'], name='user_blocks_blocked_idx'),
        ),
        migrations.AddIndex(
            model_name='detailedreview',
            index=models.Index(fields=['store', '-created_at'], name='detailed_reviews_store_created_idx'),
        ),
        migrations.AddIndex(
            model_name='detailedreview',
            index=models.Index(fields=['user', '-created_at'], name='detailed_reviews_user_created_idx'),
        ),
        migrations.AddIndex(
            model_name='detailedreview',
            index=models.Index(fields=['overall_rating', '-created_at'], name='detailed_reviews_rating_created_idx'),
        ),

        # ユニーク制約の追加
        migrations.AddConstraint(
            model_name='friendship',
            constraint=models.UniqueConstraint(fields=['from_user', 'to_user'], name='unique_friendship'),
        ),
        migrations.AddConstraint(
            model_name='socialpostlike',
            constraint=models.UniqueConstraint(fields=['user', 'post'], name='unique_post_like'),
        ),
        migrations.AddConstraint(
            model_name='userblock',
            constraint=models.UniqueConstraint(fields=['blocker', 'blocked'], name='unique_user_block'),
        ),
        migrations.AddConstraint(
            model_name='detailedreview',
            constraint=models.UniqueConstraint(fields=['user', 'store', 'visit_date'], name='unique_user_store_review'),
        ),
        migrations.AddConstraint(
            model_name='reviewhelpful',
            constraint=models.UniqueConstraint(fields=['user', 'review'], name='unique_review_helpful'),
        ),
    ]