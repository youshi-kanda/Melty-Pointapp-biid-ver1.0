"""
デジタルギフトAPI統合テスト
RealPay APIの動作確認を行う
"""
import os
import sys

# Djangoセットアップ
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pointapp.settings')
import django
django.setup()

from core.models import APIAccessKey, DigitalGiftBrand, DigitalGiftPurchaseID, User, PointTransaction, Gift
from core.digital_gift_client import DigitalGiftAPIClient, DigitalGiftAPIError
from decimal import Decimal
import json


def test_get_brands():
    """ブランド一覧取得のテスト"""
    print("\n" + "=" * 80)
    print("テスト1: ブランド一覧取得")
    print("=" * 80)
    
    api_key = APIAccessKey.objects.filter(is_active=True).first()
    if not api_key:
        print("❌ 有効なAPIアクセスキーが見つかりません")
        return False
    
    try:
        client = DigitalGiftAPIClient(api_key)
        brands = client.get_brands()
        
        print(f"✅ 成功: {len(brands)}件のブランドを取得")
        
        # ATM受取を検索
        atm_brands = [b for b in brands if any(kw in b.get('code', '').lower() or kw in b.get('name', '').lower() 
                                                 for kw in ['atm', 'セブン', 'seven', '銀行', '現金', 'cash'])]
        
        if atm_brands:
            print(f"\n⭐️ ATM/現金関連ブランド: {len(atm_brands)}件")
            for brand in atm_brands:
                print(f"   - [{brand['code']}] {brand['name']}")
        else:
            print("\nℹ️  ATM受取関連のブランドは見つかりませんでした")
        
        return True
    
    except Exception as e:
        print(f"❌ エラー: {e}")
        return False


def test_create_purchase_id():
    """購入ID作成のテスト"""
    print("\n" + "=" * 80)
    print("テスト2: 購入ID作成")
    print("=" * 80)
    
    api_key = APIAccessKey.objects.filter(is_active=True).first()
    if not api_key:
        print("❌ 有効なAPIアクセスキーが見つかりません")
        return False, None
    
    # 利用可能なブランドを取得
    brands = DigitalGiftBrand.objects.filter(is_active=True)
    if not brands.exists():
        print("❌ 利用可能なブランドがデータベースにありません")
        print("   先にブランド一覧を同期してください")
        return False, None
    
    # テスト用パラメータ
    brand_codes = list(brands.values_list('code', flat=True)[:2])  # 最初の2つのブランド
    prices = [1000, 3000, 5000]
    
    print(f"ブランド: {brand_codes}")
    print(f"金額: {prices}")
    
    try:
        client = DigitalGiftAPIClient(api_key)
        
        purchase_id = client.create_purchase_id(
            prices=prices,
            name="Melty+ テストギフト",
            issuer="株式会社biid",
            brand_codes=brand_codes,
            is_strict=False
        )
        
        print(f"✅ 成功: 購入ID作成")
        print(f"   ID: {purchase_id}")
        
        return True, purchase_id
    
    except DigitalGiftAPIError as e:
        print(f"❌ APIエラー: {e.message}")
        if e.status_code:
            print(f"   ステータスコード: {e.status_code}")
        return False, None
    
    except Exception as e:
        print(f"❌ エラー: {e}")
        import traceback
        traceback.print_exc()
        return False, None


def test_purchase_gift(purchase_id):
    """ギフト購入のテスト"""
    print("\n" + "=" * 80)
    print("テスト3: ギフト購入")
    print("=" * 80)
    
    if not purchase_id:
        print("⚠️  スキップ: 購入IDがありません")
        return False
    
    api_key = APIAccessKey.objects.filter(is_active=True).first()
    if not api_key:
        print("❌ 有効なAPIアクセスキーが見つかりません")
        return False
    
    print(f"購入ID: {purchase_id}")
    print(f"金額: 1000円")
    
    try:
        client = DigitalGiftAPIClient(api_key)
        
        result = client.purchase_gift(
            purchase_id=purchase_id,
            price=1000
        )
        
        print(f"✅ 成功: ギフト購入完了")
        print(f"\nギフト情報:")
        print(f"   コード: {result['gift']['code']}")
        print(f"   URL: {result['gift']['url']}")
        print(f"   金額: {result['gift']['price']}円")
        print(f"   有効期限: {result['gift']['expire_at']}")
        
        print(f"\n支払情報:")
        print(f"   本体価格: {result['payment']['price']}円")
        print(f"   手数料: {result['payment']['commission']}円")
        print(f"   消費税: {result['payment']['commission_tax']}円")
        print(f"   総額: {result['payment']['total']}円")
        
        return True
    
    except DigitalGiftAPIError as e:
        print(f"❌ APIエラー: {e.message}")
        if e.status_code:
            print(f"   ステータスコード: {e.status_code}")
        if e.response_data:
            print(f"   詳細: {json.dumps(e.response_data, ensure_ascii=False, indent=2)}")
        return False
    
    except Exception as e:
        print(f"❌ エラー: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_gift_exchange_flow():
    """ギフト交換フロー全体のテスト"""
    print("\n" + "=" * 80)
    print("テスト4: ギフト交換フロー (エンドツーエンド)")
    print("=" * 80)
    
    # テストユーザーを作成または取得
    test_user, created = User.objects.get_or_create(
        phone_number='09000000001',
        defaults={
            'name': 'テストユーザー',
            'email': 'test@example.com',
            'point_balance': 10000,
        }
    )
    
    if created:
        print(f"✅ テストユーザー作成: {test_user.phone_number}")
    else:
        print(f"ℹ️  既存のテストユーザーを使用: {test_user.phone_number}")
        # ポイント残高を更新
        test_user.point_balance = 10000
        test_user.save()
    
    print(f"   ポイント残高: {test_user.point_balance}pt")
    
    # テスト用ギフトを作成
    brand = DigitalGiftBrand.objects.filter(is_active=True).first()
    if not brand:
        print("❌ 利用可能なブランドがありません")
        return False
    
    gift, created = Gift.objects.get_or_create(
        name="テスト用デジタルギフト",
        defaults={
            'description': 'API統合テスト用',
            'points_required': 1000,
            'gift_type': 'digital',
            'is_available': True,
            'is_external_gift': True,
            'external_brand': brand,
            'external_price': 1000,
            'unlimited_stock': True,
        }
    )
    
    if created:
        print(f"✅ テストギフト作成: {gift.name}")
    else:
        print(f"ℹ️  既存のテストギフトを使用: {gift.name}")
    
    print(f"   必要ポイント: {gift.points_required}pt")
    print(f"   ブランド: {brand.name}")
    
    print("\n⚠️  実際のギフト交換は管理画面またはユーザーアプリから行ってください")
    print("   このスクリプトではデータ準備のみを実施しています")
    
    return True


def main():
    """メイン処理"""
    print("\n")
    print("╔" + "=" * 78 + "╗")
    print("║" + " " * 22 + "デジタルギフトAPI 統合テスト" + " " * 28 + "║")
    print("╚" + "=" * 78 + "╝")
    
    results = []
    
    # テスト1: ブランド一覧取得
    result1 = test_get_brands()
    results.append(("ブランド一覧取得", result1))
    
    # テスト2: 購入ID作成
    result2, purchase_id = test_create_purchase_id()
    results.append(("購入ID作成", result2))
    
    # テスト3: ギフト購入 (デモ環境のみ)
    if purchase_id:
        response = input("\nギフト購入テストを実行しますか? (実際にギフトが購入されます) (y/N): ")
        if response.lower() == 'y':
            result3 = test_purchase_gift(purchase_id)
            results.append(("ギフト購入", result3))
        else:
            print("⚠️  ギフト購入テストをスキップしました")
    
    # テスト4: ギフト交換フロー
    result4 = test_gift_exchange_flow()
    results.append(("ギフト交換フロー準備", result4))
    
    # 結果サマリー
    print("\n" + "=" * 80)
    print("テスト結果サマリー")
    print("=" * 80)
    
    for test_name, result in results:
        status = "✅ 成功" if result else "❌ 失敗"
        print(f"{status}: {test_name}")
    
    success_count = sum(1 for _, r in results if r)
    total_count = len(results)
    
    print(f"\n成功率: {success_count}/{total_count} ({success_count*100//total_count}%)")
    
    if success_count == total_count:
        print("\n🎉 すべてのテストが成功しました!")
    else:
        print("\n⚠️  一部のテストが失敗しました。ログを確認してください。")


if __name__ == '__main__':
    main()
