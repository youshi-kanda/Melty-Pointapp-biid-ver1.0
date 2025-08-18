"""
meltyアプリとのSSO連携機能

このモジュールはmeltyアプリとのシングルサインオン（SSO）連携、
会員データの同期、ランク優遇機能を提供します。
"""

import requests
import logging
from typing import Dict, Optional, Tuple
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
import jwt
from datetime import datetime, timedelta

User = get_user_model()
logger = logging.getLogger(__name__)

class MeltyIntegrationError(Exception):
    """melty連携エラー"""
    pass

class MeltyAPIClient:
    """melty API クライアント"""
    
    def __init__(self):
        self.base_url = getattr(settings, 'MELTY_API_BASE_URL', 'https://api.melty.app/v1')
        self.client_id = getattr(settings, 'MELTY_CLIENT_ID', '')
        self.client_secret = getattr(settings, 'MELTY_CLIENT_SECRET', '')
        self.redirect_uri = getattr(settings, 'MELTY_REDIRECT_URI', '')
        
        if not all([self.client_id, self.client_secret]):
            logger.warning("melty API credentials not properly configured")
    
    def exchange_code_for_token(self, code: str) -> Dict:
        """認証コードをアクセストークンに交換"""
        try:
            response = requests.post(f"{self.base_url}/oauth/token", {
                'grant_type': 'authorization_code',
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'code': code,
                'redirect_uri': self.redirect_uri,
            }, timeout=10)
            
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Failed to exchange melty code for token: {str(e)}")
            raise MeltyIntegrationError(f"Token exchange failed: {str(e)}")
    
    def get_user_profile(self, access_token: str) -> Dict:
        """meltyユーザープロフィール取得"""
        try:
            headers = {'Authorization': f'Bearer {access_token}'}
            response = requests.get(f"{self.base_url}/user/profile", headers=headers, timeout=10)
            
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Failed to get melty user profile: {str(e)}")
            raise MeltyIntegrationError(f"Profile fetch failed: {str(e)}")
    
    def verify_token(self, access_token: str) -> bool:
        """アクセストークンの有効性確認"""
        try:
            headers = {'Authorization': f'Bearer {access_token}'}
            response = requests.get(f"{self.base_url}/user/verify", headers=headers, timeout=10)
            return response.status_code == 200
        except requests.RequestException:
            return False

class MeltyUserService:
    """meltyユーザー管理サービス"""
    
    def __init__(self):
        self.api_client = MeltyAPIClient()
    
    def create_biid_account_from_melty(self, melty_code: str, email: str, 
                                     first_name: str, last_name: str) -> Tuple[User, bool]:
        """
        melty認証コードから biidアカウントを作成
        
        Returns:
            Tuple[User, bool]: (ユーザーオブジェクト, 新規作成フラグ)
        """
        try:
            # 1. meltyからアクセストークンを取得
            token_data = self.api_client.exchange_code_for_token(melty_code)
            access_token = token_data.get('access_token')
            
            if not access_token:
                raise MeltyIntegrationError("Access token not received from melty")
            
            # 2. meltyユーザープロフィールを取得
            melty_profile = self.api_client.get_user_profile(access_token)
            melty_user_id = melty_profile.get('user_id')
            melty_email = melty_profile.get('email', email)
            
            if not melty_user_id:
                raise MeltyIntegrationError("melty user ID not found in profile")
            
            # 3. 既存のmelty連携アカウントチェック
            existing_user = None
            try:
                existing_user = User.objects.get(melty_user_id=melty_user_id)
                logger.info(f"Found existing melty-linked user: {existing_user.username}")
                return existing_user, False
            except User.DoesNotExist:
                pass
            
            # 4. 同じメールアドレスの既存ユーザーチェック
            try:
                existing_user = User.objects.get(email=melty_email)
                # 既存ユーザーにmelty連携を追加
                return self.link_melty_to_existing_user(existing_user, melty_user_id, melty_profile), False
            except User.DoesNotExist:
                pass
            
            # 5. 新規biidアカウント作成（シルバーランクで開始）
            new_user = self.create_new_biid_user_with_melty(
                email=melty_email,
                first_name=first_name,
                last_name=last_name,
                melty_user_id=melty_user_id,
                melty_profile=melty_profile
            )
            
            logger.info(f"Created new biid user from melty: {new_user.username} (Silver rank)")
            return new_user, True
            
        except Exception as e:
            logger.error(f"Failed to create biid account from melty: {str(e)}")
            raise MeltyIntegrationError(f"Account creation failed: {str(e)}")
    
    def create_new_biid_user_with_melty(self, email: str, first_name: str, 
                                       last_name: str, melty_user_id: str, 
                                       melty_profile: Dict) -> User:
        """melty連携付きの新規biidユーザー作成"""
        
        # ユニークなusernameを生成
        base_username = f"{first_name}_{last_name}".lower()
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1
        
        # ユニークなmember_idを生成
        import uuid
        member_id = f"M{str(uuid.uuid4().hex[:8]).upper()}"
        while User.objects.filter(member_id=member_id).exists():
            member_id = f"M{str(uuid.uuid4().hex[:8]).upper()}"
        
        # melty経由ユーザーはシルバーランクでスタート
        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            member_id=member_id,
            rank='silver',  # melty経由はシルバーランク
            registration_source='melty',
            melty_user_id=melty_user_id,
            melty_email=email,
            melty_connected_at=timezone.now(),
            is_melty_linked=True,
            melty_profile_data=melty_profile,
            is_active=True
        )
        
        # シルバーランク特典として初回ボーナスポイントを付与
        self.grant_melty_welcome_bonus(user)
        
        return user
    
    def link_melty_to_existing_user(self, user: User, melty_user_id: str, melty_profile: Dict) -> User:
        """既存ユーザーにmelty連携を追加"""
        user.melty_user_id = melty_user_id
        user.melty_email = melty_profile.get('email')
        user.melty_connected_at = timezone.now()
        user.is_melty_linked = True
        user.melty_profile_data = melty_profile
        
        # 既存ユーザーがブロンズランクの場合、シルバーにアップグレード
        if user.rank == 'bronze':
            user.rank = 'silver'
            self.grant_melty_welcome_bonus(user)
            logger.info(f"Upgraded user {user.username} from Bronze to Silver via melty link")
        
        user.save()
        return user
    
    def grant_melty_welcome_bonus(self, user: User):
        """melty連携ウェルカムボーナス付与"""
        try:
            # シルバーランク特典：1000ポイント付与
            bonus_points = 1000
            user.add_points(
                points=bonus_points,
                expiry_months=12,  # 12ヶ月有効
                source_description="meltyアプリ連携ウェルカムボーナス"
            )
            logger.info(f"Granted melty welcome bonus {bonus_points}pt to user {user.username}")
        except Exception as e:
            logger.error(f"Failed to grant melty welcome bonus: {str(e)}")
    
    def sync_melty_profile(self, user: User, access_token: str) -> bool:
        """meltyプロフィール情報を同期"""
        try:
            if not user.is_melty_linked:
                return False
            
            melty_profile = self.api_client.get_user_profile(access_token)
            
            # プロフィール情報を更新
            user.melty_profile_data = melty_profile
            
            # メールアドレスが変更されている場合は更新
            melty_email = melty_profile.get('email')
            if melty_email and melty_email != user.melty_email:
                user.melty_email = melty_email
            
            user.save()
            logger.info(f"Synced melty profile for user {user.username}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to sync melty profile: {str(e)}")
            return False
    
    def unlink_melty_account(self, user: User) -> bool:
        """meltyアカウント連携を解除"""
        try:
            user.melty_user_id = None
            user.melty_email = None
            user.melty_connected_at = None
            user.is_melty_linked = False
            user.melty_profile_data = {}
            user.save()
            
            logger.info(f"Unlinked melty account for user {user.username}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to unlink melty account: {str(e)}")
            return False

class MeltySSO:
    """melty シングルサインオン"""
    
    def __init__(self):
        self.api_client = MeltyAPIClient()
        self.user_service = MeltyUserService()
    
    def generate_auth_url(self, state: str = None) -> str:
        """melty OAuth認証URLを生成"""
        import urllib.parse
        
        params = {
            'client_id': self.api_client.client_id,
            'response_type': 'code',
            'redirect_uri': self.api_client.redirect_uri,
            'scope': 'profile email',
        }
        
        if state:
            params['state'] = state
        
        query_string = urllib.parse.urlencode(params)
        return f"{self.api_client.base_url}/oauth/authorize?{query_string}"
    
    def handle_callback(self, code: str, state: str = None) -> Tuple[User, str]:
        """
        melty OAuth コールバック処理
        
        Returns:
            Tuple[User, str]: (ユーザーオブジェクト, アクセストークン)
        """
        try:
            # アクセストークンを取得
            token_data = self.api_client.exchange_code_for_token(code)
            access_token = token_data.get('access_token')
            
            if not access_token:
                raise MeltyIntegrationError("Access token not received")
            
            # ユーザープロフィールを取得
            melty_profile = self.api_client.get_user_profile(access_token)
            melty_user_id = melty_profile.get('user_id')
            
            if not melty_user_id:
                raise MeltyIntegrationError("User ID not found in melty profile")
            
            # 既存のmelty連携ユーザーを探す
            try:
                user = User.objects.get(melty_user_id=melty_user_id)
                logger.info(f"melty SSO login: {user.username}")
                return user, access_token
            except User.DoesNotExist:
                # 新規ユーザーの場合は登録画面にリダイレクトする必要がある
                raise MeltyIntegrationError("User not found - registration required")
                
        except Exception as e:
            logger.error(f"melty SSO callback failed: {str(e)}")
            raise MeltyIntegrationError(f"SSO callback failed: {str(e)}")

# サービスインスタンス
melty_sso = MeltySSO()
melty_user_service = MeltyUserService()
melty_api_client = MeltyAPIClient()