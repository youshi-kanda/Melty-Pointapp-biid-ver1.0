from rest_framework import serializers
from django.contrib.auth import get_user_model
from .social_models import (
    UserPrivacySettings, Friendship, SocialPost, SocialPostLike, 
    SocialPostComment, SocialPostShare, UserBlock, DetailedReview, ReviewHelpful
)

User = get_user_model()


class UserBasicInfoSerializer(serializers.ModelSerializer):
    """基本的なユーザー情報のシリアライザー"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'member_id', 'avatar', 'location', 'last_active_at']
        read_only_fields = fields


class UserPrivacySettingsSerializer(serializers.ModelSerializer):
    """プライバシー設定のシリアライザー"""
    
    class Meta:
        model = UserPrivacySettings
        fields = [
            'profile_name_visibility', 'profile_avatar_visibility', 'profile_bio_visibility',
            'profile_location_visibility', 'profile_age_visibility', 'profile_gender_visibility',
            'points_total_visibility', 'points_recent_visibility', 'stores_visited_visibility',
            'reviews_posted_visibility', 'gifts_received_visibility', 'achievements_visibility',
            'friend_requests_accept', 'messages_accept', 'post_comments_allow',
            'post_reactions_allow', 'friend_list_visibility', 'online_status_visibility',
            'notification_preferences', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, data):
        """プライバシー設定のバリデーション"""
        privacy_levels = ['private', 'friends', 'limited', 'public']
        friend_request_levels = ['none', 'mutual_friends', 'all']
        message_levels = ['none', 'friends', 'all']
        
        # プライバシーレベルのバリデーション
        for field in ['profile_name_visibility', 'profile_avatar_visibility', 'profile_bio_visibility',
                     'profile_location_visibility', 'profile_age_visibility', 'profile_gender_visibility',
                     'points_total_visibility', 'points_recent_visibility', 'stores_visited_visibility',
                     'reviews_posted_visibility', 'gifts_received_visibility', 'achievements_visibility',
                     'post_comments_allow', 'post_reactions_allow', 'friend_list_visibility',
                     'online_status_visibility']:
            if field in data and data[field] not in privacy_levels:
                raise serializers.ValidationError(f'{field} must be one of {privacy_levels}')
        
        # フレンド申請設定のバリデーション
        if 'friend_requests_accept' in data and data['friend_requests_accept'] not in friend_request_levels:
            raise serializers.ValidationError(f'friend_requests_accept must be one of {friend_request_levels}')
        
        # メッセージ受信設定のバリデーション
        if 'messages_accept' in data and data['messages_accept'] not in message_levels:
            raise serializers.ValidationError(f'messages_accept must be one of {message_levels}')
        
        return data


class FriendshipSerializer(serializers.ModelSerializer):
    """フレンド関係のシリアライザー"""
    
    from_user = UserBasicInfoSerializer(read_only=True)
    to_user = UserBasicInfoSerializer(read_only=True)
    
    class Meta:
        model = Friendship
        fields = [
            'id', 'from_user', 'to_user', 'status', 'message', 'category',
            'is_favorite', 'friends_since', 'last_interaction_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'friends_since', 'created_at', 'updated_at']
    
    def validate_message(self, value):
        """申請メッセージのバリデーション"""
        if value and len(value) > 500:
            raise serializers.ValidationError('メッセージは500文字以内で入力してください')
        return value


class SocialPostSerializer(serializers.ModelSerializer):
    """ソーシャル投稿のシリアライザー"""
    
    author = UserBasicInfoSerializer(read_only=True)
    location_name_display = serializers.SerializerMethodField()
    likes_data = serializers.SerializerMethodField()
    user_liked = serializers.SerializerMethodField()
    user_shared = serializers.SerializerMethodField()
    
    class Meta:
        model = SocialPost
        fields = [
            'id', 'author', 'post_type', 'content', 'images', 'location',
            'location_name', 'location_name_display', 'latitude', 'longitude',
            'visibility', 'hashtags', 'likes_count', 'comments_count', 
            'shares_count', 'views_count', 'is_pinned', 'metadata',
            'likes_data', 'user_liked', 'user_shared', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'author', 'likes_count', 'comments_count', 'shares_count',
            'views_count', 'likes_data', 'user_liked', 'user_shared', 
            'created_at', 'updated_at'
        ]
    
    def get_location_name_display(self, obj):
        """位置情報の表示名を取得"""
        if obj.location:
            return obj.location.name
        elif obj.location_name:
            return obj.location_name
        return None
    
    def get_likes_data(self, obj):
        """いいね情報を取得"""
        request = self.context.get('request')
        if not request:
            return []
        
        # 最新5件のいいねを取得
        recent_likes = SocialPostLike.objects.filter(post=obj).select_related('user')[:5]
        
        likes_info = []
        for like in recent_likes:
            likes_info.append({
                'user': {
                    'id': like.user.id,
                    'username': like.user.username,
                    'avatar': like.user.avatar,
                },
                'reaction_type': like.reaction_type,
                'created_at': like.created_at
            })
        
        return likes_info
    
    def get_user_liked(self, obj):
        """現在のユーザーがいいねしているかチェック"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        return SocialPostLike.objects.filter(user=request.user, post=obj).exists()
    
    def get_user_shared(self, obj):
        """現在のユーザーがシェアしているかチェック"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        return SocialPostShare.objects.filter(user=request.user, post=obj).exists()
    
    def validate_content(self, value):
        """投稿内容のバリデーション"""
        if not value or not value.strip():
            raise serializers.ValidationError('投稿内容を入力してください')
        
        if len(value) > 2000:
            raise serializers.ValidationError('投稿内容は2000文字以内で入力してください')
        
        return value.strip()
    
    def validate_images(self, value):
        """画像のバリデーション"""
        if not isinstance(value, list):
            raise serializers.ValidationError('画像は配列形式で指定してください')
        
        if len(value) > 10:
            raise serializers.ValidationError('画像は最大10枚まで添付できます')
        
        # URL形式のチェック
        for image_url in value:
            if not isinstance(image_url, str) or not image_url.startswith(('http://', 'https://')):
                raise serializers.ValidationError('有効な画像URLを指定してください')
        
        return value
    
    def validate_hashtags(self, value):
        """ハッシュタグのバリデーション"""
        if not isinstance(value, list):
            raise serializers.ValidationError('ハッシュタグは配列形式で指定してください')
        
        if len(value) > 20:
            raise serializers.ValidationError('ハッシュタグは最大20個まで指定できます')
        
        # ハッシュタグの形式チェック
        valid_hashtags = []
        for tag in value:
            if isinstance(tag, str):
                tag = tag.strip('#').strip()
                if tag and len(tag) <= 50:
                    valid_hashtags.append(tag)
        
        return valid_hashtags
    
    def create(self, validated_data):
        """投稿作成"""
        request = self.context.get('request')
        validated_data['author'] = request.user
        
        post = super().create(validated_data)
        
        # 投稿数を更新
        request.user.posts_count += 1
        request.user.save()
        
        return post


class SocialPostLikeSerializer(serializers.ModelSerializer):
    """投稿いいねのシリアライザー"""
    
    user = UserBasicInfoSerializer(read_only=True)
    
    class Meta:
        model = SocialPostLike
        fields = ['id', 'user', 'post', 'reaction_type', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class SocialPostCommentSerializer(serializers.ModelSerializer):
    """投稿コメントのシリアライザー"""
    
    user = UserBasicInfoSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    user_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = SocialPostComment
        fields = [
            'id', 'user', 'post', 'parent_comment', 'content', 
            'likes_count', 'replies_count', 'replies', 'user_liked',
            'is_deleted', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'likes_count', 'replies_count', 'replies', 
            'user_liked', 'is_deleted', 'created_at', 'updated_at'
        ]
    
    def get_replies(self, obj):
        """返信コメントを取得"""
        if obj.parent_comment is not None:
            return []  # 返信の返信は表示しない
        
        replies = SocialPostComment.objects.filter(
            parent_comment=obj,
            is_deleted=False
        ).select_related('user').order_by('created_at')[:5]  # 最新5件まで
        
        return SocialPostCommentSerializer(replies, many=True, context=self.context).data
    
    def get_user_liked(self, obj):
        """現在のユーザーがコメントにいいねしているかチェック"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        # コメントいいね機能は今回は省略（必要に応じて実装）
        return False
    
    def validate_content(self, value):
        """コメント内容のバリデーション"""
        if not value or not value.strip():
            raise serializers.ValidationError('コメント内容を入力してください')
        
        if len(value) > 1000:
            raise serializers.ValidationError('コメントは1000文字以内で入力してください')
        
        return value.strip()
    
    def create(self, validated_data):
        """コメント作成"""
        request = self.context.get('request')
        validated_data['user'] = request.user
        
        comment = super().create(validated_data)
        
        # 投稿のコメント数を更新
        post = comment.post
        post.comments_count += 1
        post.save()
        
        # 親コメントがある場合は返信数を更新
        if comment.parent_comment:
            parent = comment.parent_comment
            parent.replies_count += 1
            parent.save()
        
        return comment


class DetailedReviewSerializer(serializers.ModelSerializer):
    """詳細レビューのシリアライザー"""
    
    user = UserBasicInfoSerializer(read_only=True)
    store_name = serializers.CharField(source='store.name', read_only=True)
    user_helpful = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = DetailedReview
        fields = [
            'id', 'user', 'store', 'store_name', 'overall_rating', 'service_rating',
            'atmosphere_rating', 'value_rating', 'average_rating', 'title', 'content',
            'images', 'usage_scenes', 'visit_date', 'visit_count', 'spent_amount',
            'helpful_count', 'views_count', 'visibility', 'show_reviewer_name',
            'is_verified_visit', 'is_featured', 'user_helpful', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'store_name', 'helpful_count', 'views_count', 
            'is_verified_visit', 'is_featured', 'user_helpful', 'average_rating',
            'created_at', 'updated_at'
        ]
    
    def get_user_helpful(self, obj):
        """現在のユーザーが「役に立った」をマークしているかチェック"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        return ReviewHelpful.objects.filter(user=request.user, review=obj).exists()
    
    def get_average_rating(self, obj):
        """平均評価を計算"""
        ratings = [obj.overall_rating, obj.service_rating, obj.atmosphere_rating, obj.value_rating]
        return round(sum(ratings) / len(ratings), 1)
    
    def validate_title(self, value):
        """タイトルのバリデーション"""
        if not value or not value.strip():
            raise serializers.ValidationError('レビュータイトルを入力してください')
        
        if len(value) > 100:
            raise serializers.ValidationError('タイトルは100文字以内で入力してください')
        
        return value.strip()
    
    def validate_content(self, value):
        """レビュー内容のバリデーション"""
        if not value or not value.strip():
            raise serializers.ValidationError('レビュー内容を入力してください')
        
        if len(value) > 2000:
            raise serializers.ValidationError('レビュー内容は2000文字以内で入力してください')
        
        return value.strip()
    
    def validate_usage_scenes(self, value):
        """利用シーンのバリデーション"""
        if not isinstance(value, list):
            raise serializers.ValidationError('利用シーンは配列形式で指定してください')
        
        valid_scenes = ['date', 'family', 'friends', 'business', 'solo', 'group', 'special_occasion', 'casual']
        for scene in value:
            if scene not in valid_scenes:
                raise serializers.ValidationError(f'無効な利用シーンです: {scene}')
        
        return value
    
    def validate_images(self, value):
        """レビュー画像のバリデーション"""
        if not isinstance(value, list):
            raise serializers.ValidationError('画像は配列形式で指定してください')
        
        if len(value) > 10:
            raise serializers.ValidationError('画像は最大10枚まで添付できます')
        
        return value
    
    def create(self, validated_data):
        """レビュー作成"""
        request = self.context.get('request')
        validated_data['user'] = request.user
        
        review = super().create(validated_data)
        
        # ユーザーのレビュー数を更新
        request.user.reviews_count += 1
        request.user.save()
        
        return review


class UserProfileSerializer(serializers.ModelSerializer):
    """ユーザープロフィール詳細のシリアライザー"""
    
    privacy_settings = UserPrivacySettingsSerializer(read_only=True)
    recent_posts = serializers.SerializerMethodField()
    recent_reviews = serializers.SerializerMethodField()
    is_friend = serializers.SerializerMethodField()
    can_send_friend_request = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'member_id', 'avatar', 'bio', 'location', 
            'website', 'birth_date', 'gender', 'rank', 'registration_date',
            'friends_count', 'posts_count', 'reviews_count', 'profile_visibility',
            'show_online_status', 'last_active_at', 'selected_social_skin',
            'privacy_settings', 'recent_posts', 'recent_reviews', 
            'is_friend', 'can_send_friend_request'
        ]
        read_only_fields = [
            'id', 'member_id', 'registration_date', 'friends_count', 
            'posts_count', 'reviews_count', 'privacy_settings',
            'recent_posts', 'recent_reviews', 'is_friend', 'can_send_friend_request'
        ]
    
    def get_recent_posts(self, obj):
        """最近の投稿を取得"""
        request = self.context.get('request')
        if not request:
            return []
        
        # プライバシー設定を考慮して投稿を取得
        posts = SocialPost.objects.filter(
            author=obj,
            is_deleted=False
        ).order_by('-created_at')[:5]
        
        # 表示権限をチェック
        visible_posts = []
        for post in posts:
            if self.can_view_post(request.user, post):
                visible_posts.append(post)
        
        return SocialPostSerializer(visible_posts, many=True, context=self.context).data
    
    def get_recent_reviews(self, obj):
        """最近のレビューを取得"""
        request = self.context.get('request')
        if not request:
            return []
        
        reviews = DetailedReview.objects.filter(
            user=obj,
            is_deleted=False
        ).select_related('store').order_by('-created_at')[:5]
        
        # 表示権限をチェック
        visible_reviews = []
        for review in reviews:
            if self.can_view_review(request.user, review):
                visible_reviews.append(review)
        
        return DetailedReviewSerializer(visible_reviews, many=True, context=self.context).data
    
    def get_is_friend(self, obj):
        """フレンド関係かチェック"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated or obj == request.user:
            return False
        
        return Friendship.objects.filter(
            Q(from_user=request.user, to_user=obj, status='accepted') |
            Q(from_user=obj, to_user=request.user, status='accepted')
        ).exists()
    
    def get_can_send_friend_request(self, obj):
        """フレンド申請を送信できるかチェック"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated or obj == request.user:
            return False
        
        # 既存の関係をチェック
        existing = Friendship.objects.filter(
            Q(from_user=request.user, to_user=obj) |
            Q(from_user=obj, to_user=request.user)
        ).exists()
        
        if existing:
            return False
        
        # ブロックされていないかチェック
        blocked = UserBlock.objects.filter(
            Q(blocker=request.user, blocked=obj) |
            Q(blocker=obj, blocked=request.user)
        ).exists()
        
        return not blocked
    
    def can_view_post(self, viewer, post):
        """投稿の表示権限をチェック"""
        if post.author == viewer:
            return True
        
        if post.visibility == 'public':
            return True
        elif post.visibility == 'friends':
            return self.are_friends(viewer, post.author)
        elif post.visibility == 'limited':
            return post.allowed_users.filter(id=viewer.id).exists()
        else:
            return False
    
    def can_view_review(self, viewer, review):
        """レビューの表示権限をチェック"""
        if review.user == viewer:
            return True
        
        if review.visibility == 'public':
            return True
        elif review.visibility == 'friends':
            return self.are_friends(viewer, review.user)
        else:
            return False
    
    def are_friends(self, user1, user2):
        """フレンド関係かチェック"""
        return Friendship.objects.filter(
            Q(from_user=user1, to_user=user2, status='accepted') |
            Q(from_user=user2, to_user=user1, status='accepted')
        ).exists()