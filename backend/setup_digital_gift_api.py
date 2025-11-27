"""
デジタルギフトAPI連携の初期設定
RealPay APIアクセスキーの設定とブランド一覧の同期
"""
from django.core.management import execute_from_command_line
import os
import sys

# Djangoセットアップ
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pointapp.settings')
import django
django.setup()

from core.models import APIAccessKey, DigitalGiftBrand
from core.digital_gift_client import DigitalGiftAPIClient, DigitalGiftAPIError
import json


def setup_api_access_key():
    """APIアクセスキーの設定"""
    print("=" * 80)
    print("デジタルギフトAPI アクセスキー設定")
    print("=" * 80)
    print()
    
    # 既存のキーを確認
    existing_keys = APIAccessKey.objects.all()
    print(f"既存のAPIアクセスキー: {existing_keys.count()}件")
    
    if existing_keys.exists():
        print("\n現在のAPIアクセスキー:")
        for key in existing_keys:
            print(f"  - {key.key[:20]}... (環境: {key.environment}, 有効: {key.is_active})")
        
        response = input("\n新しいキーを追加しますか? (y/N): ")
        if response.lower() != 'y':
            print("キャンセルしました")
            return None
    
    print("\n新しいAPIアクセスキーを設定します")
    print("※ RealPay APIの契約情報が必要です")
    print()
    
    # キー情報の入力
    key = input("APIアクセスキー (40文字): ").strip()
    if len(key) != 40:
        print(f"❌ エラー: キーは40文字である必要があります (入力: {len(key)}文字)")
        return None
    
    shared_secret = input("共有シークレット (TOTPトークン生成用): ").strip()
    if not shared_secret:
        print("❌ エラー: 共有シークレットは必須です")
        return None
    
    print("\n環境を選択してください:")
    print("  1. production (本番環境)")
    print("  2. sandbox (テスト環境)")
    env_choice = input("選択 (1 or 2): ").strip()
    
    if env_choice == '1':
        environment = 'production'
    elif env_choice == '2':
        environment = 'sandbox'
    else:
        print("❌ エラー: 無効な選択です")
        return None
    
    # APIアクセスキーを作成
    try:
        api_key = APIAccessKey.objects.create(
            key=key,
            shared_secret=shared_secret,
            environment=environment,
            time_step=30,  # TOTP 30秒間隔
            totp_digits=6,  # TOTP 6桁
            is_active=True
        )
        print(f"\n✅ APIアクセスキーを作成しました")
        print(f"   環境: {api_key.environment}")
        print(f"   キー: {api_key.key[:20]}...")
        print(f"   TOTPステップ: {api_key.time_step}秒")
        return api_key
    
    except Exception as e:
        print(f"\n❌ エラー: {e}")
        return None


def test_api_connection(api_key):
    """API接続テスト"""
    print("\n" + "=" * 80)
    print("API接続テスト")
    print("=" * 80)
    print()
    
    try:
        client = DigitalGiftAPIClient(api_key)
        print("🔄 ブランド一覧を取得中...")
        
        brands = client.get_brands()
        
        print(f"\n✅ 接続成功! {len(brands)}件のブランドが利用可能です\n")
        print("=" * 80)
        print("利用可能なギフトブランド")
        print("=" * 80)
        
        for i, brand in enumerate(brands, 1):
            code = brand.get('code', '')
            name = brand.get('name', '')
            min_price = brand.get('min_price', 0)
            max_price = brand.get('max_price', 0)
            
            print(f"\n{i}. [{code}]")
            print(f"   名前: {name}")
            print(f"   金額範囲: {min_price:,}円 〜 {max_price:,}円")
        
        print("\n" + "=" * 80)
        
        return brands
    
    except DigitalGiftAPIError as e:
        print(f"\n❌ API接続エラー: {e.message}")
        if e.status_code:
            print(f"   ステータスコード: {e.status_code}")
        if e.response_data:
            print(f"   詳細: {json.dumps(e.response_data, ensure_ascii=False, indent=2)}")
        return None
    
    except Exception as e:
        print(f"\n❌ エラー: {e}")
        import traceback
        traceback.print_exc()
        return None


def sync_brands_to_db(brands):
    """ブランド情報をデータベースに同期"""
    print("\n" + "=" * 80)
    print("ブランド情報のデータベース同期")
    print("=" * 80)
    print()
    
    created_count = 0
    updated_count = 0
    
    for brand_data in brands:
        code = brand_data.get('code')
        if not code:
            continue
        
        brand, created = DigitalGiftBrand.objects.update_or_create(
            code=code,
            defaults={
                'name': brand_data.get('name', ''),
                'description': brand_data.get('description', ''),
                'logo_url': brand_data.get('logo_url', ''),
                'supported_prices': brand_data.get('supported_prices', []),
                'min_price': brand_data.get('min_price', 0),
                'max_price': brand_data.get('max_price', 0),
                'commission_rate': brand_data.get('commission_rate', 5.0),
                'commission_tax_rate': brand_data.get('commission_tax_rate', 10.0),
                'is_active': brand_data.get('is_active', True),
            }
        )
        
        if created:
            created_count += 1
            print(f"✅ 新規作成: [{code}] {brand.name}")
        else:
            updated_count += 1
            print(f"🔄 更新: [{code}] {brand.name}")
    
    print(f"\n完了: 新規作成 {created_count}件, 更新 {updated_count}件")


def main():
    """メイン処理"""
    print("\n")
    print("╔" + "=" * 78 + "╗")
    print("║" + " " * 20 + "デジタルギフトAPI 初期設定" + " " * 32 + "║")
    print("╚" + "=" * 78 + "╝")
    print()
    
    # ステップ1: APIアクセスキーの設定
    api_key = setup_api_access_key()
    if not api_key:
        print("\n⚠️  APIアクセスキーが設定されていません")
        print("   既存のキーを使用する場合は、管理画面から有効化してください")
        
        # 既存のキーで続行するか確認
        existing_keys = APIAccessKey.objects.filter(is_active=True)
        if existing_keys.exists():
            api_key = existing_keys.first()
            print(f"\n既存のキーを使用します: {api_key.key[:20]}...")
        else:
            return
    
    # ステップ2: API接続テスト & ブランド一覧取得
    brands = test_api_connection(api_key)
    if not brands:
        print("\n❌ API接続に失敗しました")
        print("   - APIアクセスキーが正しいか確認してください")
        print("   - 共有シークレットが正しいか確認してください")
        print("   - ネットワーク接続を確認してください")
        return
    
    # ステップ3: ブランド情報をDBに同期
    sync_brands_to_db(brands)
    
    print("\n" + "=" * 80)
    print("✅ セットアップ完了")
    print("=" * 80)
    print("\n次のステップ:")
    print("  1. 管理画面からギフト商品を作成")
    print("  2. ギフト交換機能のテスト実施")
    print("  3. デモギフトデータのインポート (API関連/デモギフト_biid株式会社様.csv)")
    print()


if __name__ == '__main__':
    main()
