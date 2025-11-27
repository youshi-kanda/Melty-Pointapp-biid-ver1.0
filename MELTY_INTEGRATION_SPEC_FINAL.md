# MELTY連携仕様書
**更新日**: 2025年11月13日  
**前提条件**: MELTY側のコード変更なし

---

## 1. 概要

### 1.1 目的
MELTY＋アプリにおいて、MELTYアプリの既存会員情報と連携し、会員種別（無料/有料）に応じて自動的に会員ランクとボーナスポイントを付与する。

### 1.2 技術的制約
- **MELTY側にSSO機構なし**: OAuth、SAML等の標準的なSSOは利用不可
- **MELTY側のコード変更なし**: 既存のMELTY APIのみを使用
- **開発環境なし**: 本番環境でのテストのみ可能

### 1.3 使用するMELTY API
- **ベースURL**: `http://app-melty.com/melty-app_system/api/`
- **認証API**: `/login/` または `/authenticate/` （既存ログインAPI）
- **プロフィール取得API**: `/user/profile/` （ユーザー情報取得）

---

## 2. 会員ランク体系

### 2.1 ランク定義（例）

| ランク | 登録方法 | 初回付与ポイント | 有効期限 | member_id プレフィックス |
|--------|----------|------------------|----------|--------------------------|
| **Bronze** | MELTY＋直接登録 | 500pt | 6ヶ月 | B* |
| **Silver** | MELTY無料会員連携 | 1,000pt | 12ヶ月 | S* |
| **Gold** | MELTY有料会員連携 | 2,000pt | 18ヶ月 | G* |
| **Platinum** | 管理者手動設定 | 5,000pt | 無期限 | P* |

### 2.2 ランク別機能制限
詳細は `USER_RANK_RESTRICTION_DESIGN.md` を参照

---

## 3. アカウント連携パターン

### 3.1 パターン1: 新規登録時にMELTY連携
```
ユーザー操作:
1. MELTY＋アプリで「MELTYアカウントで登録」を選択
2. MELTYメールアドレス・パスワードを入力
3. 自動的にMELTY会員種別を判定
4. Silver/Goldランクで登録完了

システム動作:
- MELTY既存ログインAPIで認証
- 会員種別（free/premium）を取得
- MELTY+カウントを作成（is_melty_linked=True）
- 会員種別に応じてランク・ボーナス付与
```

### 3.2 パターン2: MELTY＋直接登録後に連携
```
ユーザー操作:
1. MELTY＋アプリで直接登録（Bronze, 500pt）
2. マイページから「MELTY連携」を選択
3. MELTYメールアドレス・パスワードを入力
4. 自動的にランクアップ（Bronze → Silver/Gold）

システム動作:
- MELTY既存ログインAPIで認証
- 会員種別（free/premium）を取得
- 既存UserにMELTY情報を追加（is_melty_linked=True）
- ランクアップグレード + ボーナス付与
```

### 3.3 パターン3: 後からMELTY有料会員にアップグレード
```
ユーザー操作:
1. MELTY無料会員で連携済み（Silver, 1,000pt）
2. MELTY側で有料会員にアップグレード
3. MELTY＋アプリにログイン

システム動作:
- ログイン時にMELTY APIで最新の会員種別を確認
- premium検出 → 自動的にGoldランクへアップグレード
- 差額ボーナス付与（1,000pt追加）
```

---

## 4. 会員種別の判定ロジック

### 4.1 MELTY APIレスポンス例（想定）
```json
{
  "user_id": "12345",
  "email": "user@example.com",
  "name": "山田太郎",
  "membership_type": "premium",  // または "free"
  "is_premium": true,           // または false
  "status": "active"            // または "inactive"
}
```

### 4.2 判定ロジック
```python
def _extract_membership_type(profile: Dict) -> str:
    """
    複数のフィールド名・値に対応した柔軟な会員種別判定
    """
    # パターン1: membership_type フィールド
    if 'membership_type' in profile:
        if profile['membership_type'] in ['premium', 'paid', 'gold']:
            return 'premium'
        return 'free'
    
    # パターン2: is_premium フラグ
    if profile.get('is_premium') or profile.get('isPremium'):
        return 'premium'
    
    # パターン3: plan フィールド
    plan = profile.get('plan', '').lower()
    if 'premium' in plan or 'paid' in plan:
        return 'premium'
    
    # デフォルト: 無料会員
    return 'free'
```

---

## 5. ランクアップグレードロジック

### 5.1 初回連携時のランク設定

| 元のランク | MELTY会員種別 | 新ランク | ボーナスポイント | 備考 |
|-----------|--------------|---------|-----------------|------|
| - (新規) | free | Silver | 1,000pt | 初回登録ボーナス |
| - (新規) | premium | Gold | 2,000pt | 初回登録ボーナス |
| Bronze | free | Silver | 1,000pt | 連携ボーナス |
| Bronze | premium | Gold | 2,000pt | 連携ボーナス |
| Silver | premium | Gold | 2,000pt | 連携ボーナス |
| Silver | free | Silver | 0pt | 変更なし |
| Gold | free | Gold | 0pt | 降格なし（既得権保護） |
| Gold | premium | Gold | 0pt | 変更なし |

### 5.2 MELTY会員アップグレード時のランク変更

| 現在のランク | MELTY変更 | 新ランク | ボーナスポイント | トリガー |
|-------------|----------|---------|-----------------|---------|
| Silver (MELTY無料) | free → premium | Gold | 1,000pt | ログイン時自動検知 |
| Gold | - | Gold | 0pt | 変更なし |

---

## 6. MELTY会員解約時の対応

### 6.1 基本方針: 既得権保護（推奨）

**内容**: ランクもポイントもそのまま維持

**理由**:
- ユーザー体験の向上
- ポイント没収による法的問題の回避
- 実装がシンプル

### 6.2 解約検知方法

#### 方法1: ログイン時チェック（推奨）
```python
def check_melty_status_on_login(user: User) -> bool:
    """
    ログイン時にMELTY会員状態を確認
    解約済みの場合は連携解除（ランク・ポイントは維持）
    """
    try:
        profile = melty_api.get_user_profile(user.melty_user_id)
        
        # MELTY側で解約済み・削除済みの場合
        if profile.get('status') == 'inactive' or profile.get('deleted'):
            user.is_melty_linked = False
            user.melty_user_id = None
            user.save()
            return False
        
        return True
    except Exception:
        # APIエラー = アカウント削除済みと判断
        user.is_melty_linked = False
        user.melty_user_id = None
        user.save()
        return False
```

#### 方法2: エラーハンドリング
MELTY APIが404や403を返した場合、自動的に連携解除

### 6.3 解約後の扱い

| 項目 | 対応 |
|------|------|
| ランク | **維持**（例: Gold → Gold） |
| ポイント残高 | **維持** |
| is_melty_linked | False に変更 |
| melty_user_id | NULL に変更 |
| 再登録 | 可能（既存ランク・ポイントから継続） |

---

## 7. 実装フロー

### 7.1 新規登録時のMELTY連携

```
[フロントエンド] pages/auth/register.tsx
↓
1. 「MELTYアカウントで登録」ボタン追加
2. MELTYメール・パスワード入力フォーム表示
3. POST /api/auth/register-with-melty/
   {
     "melty_email": "user@example.com",
     "melty_password": "password123",
     "username": "yamada_taro",  // MELTY＋での表示名
     "phone_number": "090-1234-5678"
   }

[バックエンド] backend/core/melty_views.py
↓
4. MeltyAPIClient.verify_user_credentials() 呼び出し
   → MELTY既存ログインAPIで認証
   
5. MeltyAPIClient.get_user_profile() 呼び出し
   → 会員情報取得
   
6. MeltyUserService.create_biid_account_from_melty() 呼び出し
   → 会員種別判定（free/premium）
   → Userアカウント作成
   → ランク設定（Silver/Gold）
   → ボーナスポイント付与（1,000pt/2,000pt）
   
7. レスポンス返却
   {
     "user_id": 123,
     "rank": "gold",
     "point_balance": 2000,
     "melty_linked": true
   }

[フロントエンド]
↓
8. ログイン完了 → ダッシュボードへリダイレクト
```

### 7.2 既存ユーザーのMELTY連携

```
[フロントエンド] pages/user/profile/settings.tsx
↓
1. 「MELTY連携でランクアップ」セクション追加
2. MELTYメール・パスワード入力フォーム
3. POST /api/auth/link-melty/
   {
     "melty_email": "user@example.com",
     "melty_password": "password123"
   }

[バックエンド] backend/core/melty_views.py (新規作成必要)
↓
4. MeltyAPIClient.verify_user_credentials()
5. MeltyAPIClient.get_user_profile()
6. MeltyUserService.link_melty_to_existing_user() 呼び出し
   → 既存User更新
   → ランクアップグレード（Bronze → Silver/Gold）
   → ボーナスポイント付与
   
7. レスポンス返却
   {
     "success": true,
     "new_rank": "gold",
     "bonus_points": 2000,
     "total_points": 2500
   }

[フロントエンド]
↓
8. 成功通知表示「Goldランクにアップグレードしました！2,000ptボーナス獲得」
```

### 7.3 ログイン時の会員種別同期

```
[フロントエンド] pages/auth/login.tsx
↓
1. POST /api/auth/login/
   {
     "username": "yamada_taro",
     "password": "password123"
   }

[バックエンド] backend/core/auth_views.py
↓
2. Django認証でログイン
3. if user.is_melty_linked:
     → MeltyUserService.sync_melty_membership_on_login()
       → MELTY APIで最新の会員種別取得
       → 無料→有料アップグレード検知
       → 自動ランクアップ（Silver → Gold）
       → 差額ボーナス付与（1,000pt）
       
4. レスポンス返却
   {
     "user": {...},
     "rank_upgraded": true,  // アップグレードがあった場合
     "new_rank": "gold",
     "bonus_points": 1000
   }

[フロントエンド]
↓
5. ランクアップ通知表示（ある場合）
   「MELTYプレミアム会員になられたため、Goldランクに昇格しました！」
```

---

## 8. データベース設計

### 8.1 Userモデル拡張（実装済み）

```python
class User(AbstractUser):
    # 既存フィールド
    rank = models.CharField(max_length=10, choices=RANK_CHOICES, default='bronze')
    point_balance = models.IntegerField(default=0)
    
    # MELTY連携フィールド
    melty_user_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    melty_email = models.EmailField(null=True, blank=True)
    melty_connected_at = models.DateTimeField(null=True, blank=True)
    is_melty_linked = models.BooleanField(default=False)
    melty_profile_data = models.JSONField(default=dict, blank=True)
    
    # 追加推奨フィールド
    melty_last_sync_at = models.DateTimeField(null=True, blank=True)  # 最終同期日時
    melty_membership_type = models.CharField(max_length=20, null=True, blank=True)  # free/premium
```

### 8.2 MeltyRankConfiguration（実装済み）

```python
class MeltyRankConfiguration(models.Model):
    """MELTY会員種別とbiid初期ランクのマッピング"""
    melty_membership_type = models.CharField(max_length=20, choices=[
        ('free', 'MELTY無料会員'),
        ('premium', 'MELTY有料会員')
    ])
    biid_initial_rank = models.CharField(max_length=10, choices=User.RANK_CHOICES)
    welcome_bonus_points = models.IntegerField(default=0)
    rank_validity_months = models.IntegerField(default=12)
```

---

## 9. セキュリティ考慮事項

### 9.1 認証情報の取り扱い
- **MELTYパスワードは保存しない**: 認証時のみ使用し、即座に破棄
- **HTTPS通信必須**: MELTY APIとの通信は必ずHTTPS
- **MELTY API通信時のエラーログ**: パスワードを含めない

### 9.2 重複アカウント防止
- `melty_user_id` にユニーク制約
- 同一MELTYアカウントで複数のbiidアカウント作成を防止

### 9.3 MELTY API呼び出し制限
- レート制限対応（429エラーハンドリング）
- タイムアウト設定（10秒）
- リトライロジック（最大3回）

---

## 10. エラーハンドリング

### 10.1 MELTY API認証失敗

```python
try:
    auth_result = melty_api.verify_user_credentials(email, password)
except MeltyAuthenticationError:
    return Response({
        "error": "MELTYのメールアドレスまたはパスワードが正しくありません"
    }, status=400)
```

### 10.2 既にMELTY連携済み

```python
if User.objects.filter(melty_user_id=melty_user_id).exists():
    return Response({
        "error": "このMELTYアカウントは既に別のMELTY＋アカウントと連携されています"
    }, status=400)
```

### 10.3 MELTY API障害時

```python
try:
    profile = melty_api.get_user_profile(melty_user_id)
except MeltyAPIError:
    # ログイン自体は成功させる（会員種別同期はスキップ）
    logger.warning(f"MELTY API unavailable for user {user.id}")
    # フロントエンドには通知
    return Response({
        "user": {...},
        "melty_sync_failed": true,
        "message": "MELTY連携情報の同期に失敗しました。後ほど自動的に同期されます。"
    })
```

---

## 11. MELTY側に確認すべき事項

### 11.1 API仕様
- [ ] **既存ログインAPIのエンドポイント**: `/login/` または `/authenticate/`
- [ ] **認証方式**: POST リクエストのパラメータ名（email/password? username/password?）
- [ ] **レスポンス形式**: JSON? セッショントークン?
- [ ] **プロフィール取得API**: `/user/profile/` または `/api/user/`
- [ ] **会員種別のフィールド名**: `membership_type`? `is_premium`? `plan`?

### 11.2 会員管理
- [ ] **無料会員と有料会員の区別**: APIレスポンスにどう表現されるか
- [ ] **会員解約後のAPI動作**: 404エラー? `status: inactive`?
- [ ] **会員番号（ユニークID）**: `user_id`? `member_id`?

### 11.3 運用
- [ ] **MELTY側の開発環境**: 存在するか？テスト可能か？
- [ ] **本番環境でのテストアカウント**: 提供可能か？
- [ ] **Webhook機能**: 会員種別変更通知は可能か？

---

## 12. 実装タスク一覧

### Phase 1: バックエンドAPI実装（既存機能の拡張）
- [x] `MeltyAPIClient` クラス（実装済み）
- [x] `MeltyUserService` クラス（実装済み）
- [x] `create_biid_account_from_melty()` 関数（実装済み）
- [x] `link_melty_to_existing_user()` 関数（実装済み）
- [ ] **新規**: `/api/auth/link-melty/` エンドポイント
- [ ] **新規**: `sync_melty_membership_on_login()` 関数
- [ ] **新規**: MELTY API仕様の最終確認とクライアント調整

### Phase 2: フロントエンド実装
- [ ] `pages/auth/register.tsx` に「MELTYアカウントで登録」追加
- [ ] `pages/user/profile/settings.tsx` に「MELTY連携」セクション追加
- [ ] MELTY連携フォームコンポーネント作成
- [ ] ランクアップ通知コンポーネント作成

### Phase 3: テスト・デプロイ
- [ ] MELTY側にテストアカウント依頼
- [ ] 本番環境でのAPI疎通確認
- [ ] 新規登録フロー テスト（無料/有料）
- [ ] 後から連携フロー テスト
- [ ] ログイン時同期 テスト（無料→有料アップグレード）
- [ ] 解約時の動作確認

---

## 13. 付録: API仕様例

### 13.1 MELTY既存ログインAPI（想定）

**リクエスト**:
```http
POST http://app-melty.com/melty-app_system/api/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス（成功）**:
```json
{
  "success": true,
  "user_id": "12345",
  "email": "user@example.com",
  "name": "山田太郎",
  "membership_type": "premium",
  "token": "abc123xyz..."
}
```

**レスポンス（失敗）**:
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### 13.2 MELTYプロフィール取得API（想定）

**リクエスト**:
```http
GET http://app-melty.com/melty-app_system/api/user/profile/
Authorization: Bearer abc123xyz...
```

**レスポンス**:
```json
{
  "user_id": "12345",
  "email": "user@example.com",
  "name": "山田太郎",
  "membership_type": "premium",
  "is_premium": true,
  "status": "active",
  "registered_at": "2024-01-15T10:30:00Z"
}
```

---

## 14. まとめ

本仕様書に基づき、**MELTY側のコード変更なし**で以下を実現できます:

✅ **新規登録時のMELTY連携**（会員種別に応じた自動ランク設定）  
✅ **既存ユーザーの後からMELTY連携**（ランクアップグレード）  
✅ **MELTY有料会員へのアップグレード自動検知**（ログイン時同期）  
✅ **MELTY会員解約時の既得権保護**（ランク・ポイント維持）

**次のステップ**:
1. MELTY側にAPI仕様を確認（第11章の確認事項）
2. MELTY側APIクライアントの最終調整
3. フロントエンドUIの実装
4. 本番環境でのテスト
