from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class UserPrivacySettings(models.Model):
    """ユーザーのプライバシー設定を管理"""
    
    PRIVACY_LEVEL_CHOICES = [
        ('private', '非公開'),
        ('friends', 'フレンドのみ'),
        ('limited', '制限公開'),
        ('public', '完全公開'),
    ]
    
    FRIEND_REQUEST_CHOICES = [
        ('none', '受け付けない'),
        ('mutual_friends', '相互フレンド経由'),
        ('all', 'すべてのユーザー'),
    ]
    
    MESSAGE_CHOICES = [
        ('none', '受け付けない'),
        ('friends', 'フレンドのみ'),
        ('all', 'すべてのユーザー'),
    ]
    
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name='privacy_settings'
    )
    
    # プロフィール情報の公開設定
    profile_name_visibility = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='friends',
        help_text='表示名の公開範囲'
    )
    profile_avatar_visibility = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='public',
        help_text='アバター画像の公開範囲'
    )
    profile_bio_visibility = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='friends',
        help_text='自己紹介の公開範囲'
    )
    profile_location_visibility = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='private',
        help_text='居住地の公開範囲'
    )
    profile_age_visibility = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='private',
        help_text='年齢の公開範囲'
    )
    profile_gender_visibility = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='private',
        help_text='性別の公開範囲'
    )
    
    # 活動情報の公開設定
    points_total_visibility = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='private',
        help_text='累計ポイントの公開範囲'
    )
    points_recent_visibility = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='private',
        help_text='最近のポイント活動の公開範囲'
    )
    stores_visited_visibility = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='limited',
        help_text='利用店舗情報の公開範囲'
    )
    reviews_posted_visibility = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='public',
        help_text='投稿したレビューの公開範囲'
    )
    gifts_received_visibility = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='friends',
        help_text='受け取ったギフトの公開範囲'
    )
    achievements_visibility = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='public',
        help_text='獲得した実績・バッジの公開範囲'
    )
    
    # 交流設定
    friend_requests_accept = models.CharField(
        max_length=20, 
        choices=FRIEND_REQUEST_CHOICES, 
        default='all',
        help_text='フレンド申請の受付設定'
    )
    messages_accept = models.CharField(
        max_length=20, 
        choices=MESSAGE_CHOICES, 
        default='friends',
        help_text='メッセージ受信設定'
    )
    post_comments_allow = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='friends',
        help_text='投稿へのコメント許可設定'
    )
    post_reactions_allow = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='public',
        help_text='投稿への反応許可設定'
    )
    friend_list_visibility = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='friends',
        help_text='フレンドリストの表示設定'
    )
    online_status_visibility = models.CharField(
        max_length=20, 
        choices=PRIVACY_LEVEL_CHOICES, 
        default='friends',
        help_text='オンライン状態の表示設定'
    )
    
    # 通知設定（JSONフィールドで詳細設定）
    notification_preferences = models.JSONField(
        default=dict,
        help_text='通知設定の詳細（JSON形式）'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_privacy_settings'
        verbose_name = 'プライバシー設定'
        verbose_name_plural = 'プライバシー設定'
    
    def __str__(self):
        return f"{self.user.username}のプライバシー設定"


class Friendship(models.Model):
    """フレンド関係を管理"""
    
    STATUS_CHOICES = [
        ('pending', '申請中'),
        ('accepted', '承認済み'),
        ('declined', '拒否'),
        ('blocked', 'ブロック'),
    ]
    
    from_user = models.ForeignKey(
        User, 
        related_name='sent_friend_requests', 
        on_delete=models.CASCADE,
        help_text='フレンド申請を送ったユーザー'
    )
    to_user = models.ForeignKey(
        User, 
        related_name='received_friend_requests', 
        on_delete=models.CASCADE,
        help_text='フレンド申請を受けたユーザー'
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending',
        help_text='フレンド申請の状態'
    )
    message = models.TextField(
        blank=True, 
        null=True,
        max_length=500,
        help_text='申請時のメッセージ'
    )
    
    # フレンド分類（承認後に設定）
    FRIEND_CATEGORY_CHOICES = [
        ('family', '家族'),
        ('close_friend', '親友'),
        ('friend', '友人'),
        ('acquaintance', '知人'),
        ('colleague', '同僚'),
        ('other', 'その他'),
    ]
    category = models.CharField(
        max_length=20,
        choices=FRIEND_CATEGORY_CHOICES,
        default='friend',
        help_text='フレンドのカテゴリ分類'
    )
    
    # お気に入りフレンド設定
    is_favorite = models.BooleanField(
        default=False,
        help_text='お気に入りフレンドか'
    )
    
    # フレンドになった日時（承認時に設定）
    friends_since = models.DateTimeField(
        null=True,
        blank=True,
        help_text='フレンドになった日時'
    )
    
    # 最後の交流日時
    last_interaction_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='最後に交流した日時'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'friendships'
        verbose_name = 'フレンド関係'
        verbose_name_plural = 'フレンド関係'
        unique_together = ('from_user', 'to_user')
        indexes = [
            models.Index(fields=['from_user', 'status']),
            models.Index(fields=['to_user', 'status']),
        ]
    
    def __str__(self):
        return f"{self.from_user.username} → {self.to_user.username} ({self.status})"
    
    def approve(self):
        """フレンド申請を承認"""
        if self.status == 'pending':
            self.status = 'accepted'
            self.friends_since = timezone.now()
            
            # 逆方向のフレンド関係も作成（相互フレンド）
            reverse_friendship, created = Friendship.objects.get_or_create(
                from_user=self.to_user,
                to_user=self.from_user,
                defaults={
                    'status': 'accepted',
                    'friends_since': timezone.now(),
                }
            )
            if not created and reverse_friendship.status != 'accepted':
                reverse_friendship.status = 'accepted'
                reverse_friendship.friends_since = timezone.now()
                reverse_friendship.save()
            
            # フレンド数を更新
            self.from_user.friends_count += 1
            self.to_user.friends_count += 1
            self.from_user.save()
            self.to_user.save()
            
            self.save()
    
    def decline(self):
        """フレンド申請を拒否"""
        if self.status == 'pending':
            self.status = 'declined'
            self.save()
    
    def block(self):
        """ユーザーをブロック"""
        self.status = 'blocked'
        
        # 既にフレンドの場合はフレンド数を減らす
        if hasattr(self, 'friends_since') and self.friends_since:
            self.from_user.friends_count = max(0, self.from_user.friends_count - 1)
            self.to_user.friends_count = max(0, self.to_user.friends_count - 1)
            self.from_user.save()
            self.to_user.save()
        
        self.save()


class SocialPost(models.Model):
    """ソーシャル投稿を管理"""
    
    POST_TYPE_CHOICES = [
        ('text', 'テキスト'),
        ('image', '画像'),
        ('checkin', 'チェックイン'),
        ('review', 'レビュー'),
        ('achievement', '実績達成'),
        ('gift', 'ギフト投稿'),
    ]
    
    VISIBILITY_CHOICES = [
        ('private', '自分のみ'),
        ('friends', 'フレンドのみ'),
        ('limited', '制限公開'),
        ('public', '完全公開'),
    ]
    
    author = models.ForeignKey(
        User, 
        related_name='social_posts', 
        on_delete=models.CASCADE,
        help_text='投稿者'
    )
    post_type = models.CharField(
        max_length=20, 
        choices=POST_TYPE_CHOICES,
        help_text='投稿タイプ'
    )
    content = models.TextField(
        max_length=2000,
        help_text='投稿内容'
    )
    images = models.JSONField(
        default=list,
        help_text='添付画像のURL一覧（JSON配列）'
    )
    
    # 位置情報・店舗情報
    location = models.ForeignKey(
        'Store', 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL,
        help_text='関連する店舗'
    )
    location_name = models.CharField(
        max_length=255,
        blank=True,
        help_text='位置の名前（店舗以外の場所用）'
    )
    latitude = models.DecimalField(
        max_digits=10, 
        decimal_places=8, 
        null=True, 
        blank=True,
        help_text='緯度'
    )
    longitude = models.DecimalField(
        max_digits=11, 
        decimal_places=8, 
        null=True, 
        blank=True,
        help_text='経度'
    )
    
    # 公開設定
    visibility = models.CharField(
        max_length=20, 
        choices=VISIBILITY_CHOICES, 
        default='friends',
        help_text='投稿の公開範囲'
    )
    allowed_users = models.ManyToManyField(
        User, 
        blank=True,
        related_name='allowed_posts',
        help_text='特定ユーザーのみ公開時の対象ユーザー'
    )
    
    # ハッシュタグ
    hashtags = models.JSONField(
        default=list,
        help_text='ハッシュタグ一覧（JSON配列）'
    )
    
    # 統計情報
    likes_count = models.IntegerField(
        default=0,
        help_text='いいね数'
    )
    comments_count = models.IntegerField(
        default=0,
        help_text='コメント数'
    )
    shares_count = models.IntegerField(
        default=0,
        help_text='シェア数'
    )
    views_count = models.IntegerField(
        default=0,
        help_text='閲覧数'
    )
    
    # フラグ
    is_pinned = models.BooleanField(
        default=False,
        help_text='プロフィール上部に固定'
    )
    is_deleted = models.BooleanField(
        default=False,
        help_text='削除済み'
    )
    is_reported = models.BooleanField(
        default=False,
        help_text='報告済み'
    )
    
    # メタデータ
    metadata = models.JSONField(
        default=dict,
        help_text='追加のメタデータ（JSON形式）'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'social_posts'
        verbose_name = 'ソーシャル投稿'
        verbose_name_plural = 'ソーシャル投稿'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['author', '-created_at']),
            models.Index(fields=['visibility', '-created_at']),
            models.Index(fields=['post_type', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.author.username}の投稿 ({self.post_type})"


class SocialPostLike(models.Model):
    """投稿へのいいねを管理"""
    
    REACTION_CHOICES = [
        ('like', 'いいね'),
        ('love', '❤️'),
        ('laugh', '😂'),
        ('wow', '😮'),
        ('sad', '😢'),
        ('angry', '😡'),
    ]
    
    user = models.ForeignKey(
        User, 
        related_name='post_likes', 
        on_delete=models.CASCADE,
        help_text='いいねしたユーザー'
    )
    post = models.ForeignKey(
        SocialPost, 
        related_name='likes', 
        on_delete=models.CASCADE,
        help_text='いいねされた投稿'
    )
    reaction_type = models.CharField(
        max_length=10,
        choices=REACTION_CHOICES,
        default='like',
        help_text='リアクションの種類'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'social_post_likes'
        verbose_name = '投稿いいね'
        verbose_name_plural = '投稿いいね'
        unique_together = ('user', 'post')
        indexes = [
            models.Index(fields=['post', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} → {self.post} ({self.reaction_type})"


class SocialPostComment(models.Model):
    """投稿へのコメントを管理"""
    
    user = models.ForeignKey(
        User, 
        related_name='post_comments', 
        on_delete=models.CASCADE,
        help_text='コメントしたユーザー'
    )
    post = models.ForeignKey(
        SocialPost, 
        related_name='comments', 
        on_delete=models.CASCADE,
        help_text='コメントされた投稿'
    )
    parent_comment = models.ForeignKey(
        'self', 
        null=True, 
        blank=True, 
        related_name='replies', 
        on_delete=models.CASCADE,
        help_text='親コメント（返信の場合）'
    )
    
    content = models.TextField(
        max_length=1000,
        help_text='コメント内容'
    )
    
    # 統計情報
    likes_count = models.IntegerField(
        default=0,
        help_text='コメントへのいいね数'
    )
    replies_count = models.IntegerField(
        default=0,
        help_text='返信数'
    )
    
    # フラグ
    is_deleted = models.BooleanField(
        default=False,
        help_text='削除済み'
    )
    is_reported = models.BooleanField(
        default=False,
        help_text='報告済み'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'social_post_comments'
        verbose_name = '投稿コメント'
        verbose_name_plural = '投稿コメント'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['post', 'created_at']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username}のコメント → {self.post}"


class SocialPostShare(models.Model):
    """投稿のシェアを管理"""
    
    SHARE_TYPE_CHOICES = [
        ('repost', 'リポスト'),
        ('quote', '引用投稿'),
        ('private', 'プライベート共有'),
        ('external', '外部SNS'),
    ]
    
    user = models.ForeignKey(
        User, 
        related_name='post_shares', 
        on_delete=models.CASCADE,
        help_text='シェアしたユーザー'
    )
    post = models.ForeignKey(
        SocialPost, 
        related_name='shares', 
        on_delete=models.CASCADE,
        help_text='シェアされた投稿'
    )
    share_type = models.CharField(
        max_length=20,
        choices=SHARE_TYPE_CHOICES,
        help_text='シェアの種類'
    )
    comment = models.TextField(
        max_length=500,
        blank=True,
        help_text='シェア時のコメント'
    )
    
    # 外部シェア用
    external_platform = models.CharField(
        max_length=50,
        blank=True,
        help_text='外部プラットフォーム名'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'social_post_shares'
        verbose_name = '投稿シェア'
        verbose_name_plural = '投稿シェア'
        indexes = [
            models.Index(fields=['post', '-created_at']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username}がシェア → {self.post} ({self.share_type})"


class UserBlock(models.Model):
    """ユーザーブロックを管理"""
    
    BLOCK_REASON_CHOICES = [
        ('spam', 'スパム'),
        ('harassment', '嫌がらせ'),
        ('inappropriate_content', '不適切なコンテンツ'),
        ('fake_account', '偽アカウント'),
        ('personal_reasons', '個人的理由'),
        ('other', 'その他'),
    ]
    
    blocker = models.ForeignKey(
        User, 
        related_name='blocking_users', 
        on_delete=models.CASCADE,
        help_text='ブロックしたユーザー'
    )
    blocked = models.ForeignKey(
        User, 
        related_name='blocked_by_users', 
        on_delete=models.CASCADE,
        help_text='ブロックされたユーザー'
    )
    reason = models.CharField(
        max_length=50,
        choices=BLOCK_REASON_CHOICES,
        default='personal_reasons',
        help_text='ブロック理由'
    )
    notes = models.TextField(
        max_length=500,
        blank=True,
        help_text='ブロック理由の詳細'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_blocks'
        verbose_name = 'ユーザーブロック'
        verbose_name_plural = 'ユーザーブロック'
        unique_together = ('blocker', 'blocked')
        indexes = [
            models.Index(fields=['blocker']),
            models.Index(fields=['blocked']),
        ]
    
    def __str__(self):
        return f"{self.blocker.username} がブロック → {self.blocked.username}"


class DetailedReview(models.Model):
    """詳細レビューシステム"""
    
    RATING_CHOICES = [(i, f'{i}点') for i in range(1, 6)]
    
    user = models.ForeignKey(
        User, 
        related_name='detailed_reviews', 
        on_delete=models.CASCADE,
        help_text='レビュー投稿者'
    )
    store = models.ForeignKey(
        'Store', 
        related_name='detailed_reviews', 
        on_delete=models.CASCADE,
        help_text='レビュー対象の店舗'
    )
    
    # 評価項目
    overall_rating = models.IntegerField(
        choices=RATING_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text='総合評価（1-5点）'
    )
    service_rating = models.IntegerField(
        choices=RATING_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text='サービス評価（1-5点）'
    )
    atmosphere_rating = models.IntegerField(
        choices=RATING_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text='雰囲気評価（1-5点）'
    )
    value_rating = models.IntegerField(
        choices=RATING_CHOICES,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text='コストパフォーマンス評価（1-5点）'
    )
    
    # レビュー内容
    title = models.CharField(
        max_length=100,
        help_text='レビューのタイトル'
    )
    content = models.TextField(
        max_length=2000,
        help_text='レビュー本文'
    )
    images = models.JSONField(
        default=list,
        help_text='レビュー画像のURL一覧'
    )
    
    # 利用シーン
    USAGE_SCENE_CHOICES = [
        ('date', 'デート'),
        ('family', '家族'),
        ('friends', '友人'),
        ('business', 'ビジネス'),
        ('solo', '一人'),
        ('group', 'グループ'),
        ('special_occasion', '特別な日'),
        ('casual', '普段使い'),
    ]
    usage_scenes = models.JSONField(
        default=list,
        help_text='利用シーン（複数選択可）'
    )
    
    # 訪問情報
    visit_date = models.DateField(
        help_text='訪問日'
    )
    visit_count = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        help_text='訪問回数'
    )
    spent_amount = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text='利用金額（円）'
    )
    
    # 統計・反応
    helpful_count = models.IntegerField(
        default=0,
        help_text='「役に立った」の数'
    )
    views_count = models.IntegerField(
        default=0,
        help_text='レビュー閲覧数'
    )
    
    # 公開設定
    VISIBILITY_CHOICES = [
        ('private', '非公開'),
        ('friends', 'フレンドのみ'),
        ('public', '公開'),
    ]
    visibility = models.CharField(
        max_length=20,
        choices=VISIBILITY_CHOICES,
        default='public',
        help_text='レビューの公開範囲'
    )
    show_reviewer_name = models.BooleanField(
        default=True,
        help_text='レビュアー名を表示する'
    )
    
    # 認証・検証
    is_verified_visit = models.BooleanField(
        default=False,
        help_text='訪問が認証済み（ポイント利用履歴と照合）'
    )
    
    # フラグ
    is_featured = models.BooleanField(
        default=False,
        help_text='注目レビュー'
    )
    is_reported = models.BooleanField(
        default=False,
        help_text='報告済み'
    )
    is_deleted = models.BooleanField(
        default=False,
        help_text='削除済み'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'detailed_reviews'
        verbose_name = '詳細レビュー'
        verbose_name_plural = '詳細レビュー'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['store', '-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['overall_rating', '-created_at']),
        ]
        unique_together = ('user', 'store', 'visit_date')
    
    def __str__(self):
        return f"{self.user.username}の{self.store.name}レビュー"


class ReviewHelpful(models.Model):
    """レビューの「役に立った」を管理"""
    
    user = models.ForeignKey(
        User, 
        related_name='review_helpful_marks', 
        on_delete=models.CASCADE,
        help_text='「役に立った」をマークしたユーザー'
    )
    review = models.ForeignKey(
        DetailedReview, 
        related_name='helpful_marks', 
        on_delete=models.CASCADE,
        help_text='「役に立った」をマークされたレビュー'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'review_helpful'
        verbose_name = 'レビュー役立ち評価'
        verbose_name_plural = 'レビュー役立ち評価'
        unique_together = ('user', 'review')
    
    def __str__(self):
        return f"{self.user.username} → {self.review}が役に立った"