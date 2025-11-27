"""
デジタルギフトAPI で利用可能なブランド一覧を取得
ATM受取が含まれているか確認

Usage: python manage.py shell < check_available_brands.py
"""
from core.models import APIAccessKey
from core.digital_gift_client import DigitalGiftAPIClient, DigitalGiftAPIError
import json


def check_brands():
    """ブランド一覧を取得して表示"""
    try:
        # APIアクセスキーを取得
        access_key = APIAccessKey.objects.filter(is_active=True).first()
        
        if not access_key:
            print("❌ 有効なAPIアクセスキーが見つかりません")
            print("   管理画面からAPIアクセスキーを設定してください")
            return
        
        print(f"✅ APIアクセスキー取得: {access_key.key[:20]}...")
        print(f"   環境: {access_key.environment}")
        print()
        
        # APIクライアント初期化
        client = DigitalGiftAPIClient(access_key)
        print("🔄 ブランド一覧を取得中...")
        
        # ブランド一覧取得
        brands = client.get_brands()
        
        print(f"\n✅ {len(brands)}件のブランドが利用可能です\n")
        print("=" * 80)
        
        # ATM受取を検索
        atm_brands = []
        
        for i, brand in enumerate(brands, 1):
            code = brand.get('code', '')
            name = brand.get('name', '')
            name_en = brand.get('name_en', '')
            min_price = brand.get('min_price', 0)
            max_price = brand.get('max_price', 0)
            
            print(f"{i}. [{code}]")
            print(f"   名前: {name}")
            if name_en:
                print(f"   英名: {name_en}")
            print(f"   金額範囲: {min_price:,}円 〜 {max_price:,}円")
            
            # ATM関連キーワードをチェック
            keywords = ['atm', 'ATM', 'セブン', 'seven', '銀行', 'bank', '現金', 'cash', '受取', 'receipt']
            if any(kw in code.lower() or kw in name.lower() or kw in name_en.lower() for kw in keywords):
                atm_brands.append(brand)
                print("   ⭐️ ATM/現金関連ブランド候補")
            
            print()
        
        print("=" * 80)
        
        # ATM受取の有無を表示
        if atm_brands:
            print(f"\n✅ ATM/現金関連ブランドが {len(atm_brands)} 件見つかりました:\n")
            for brand in atm_brands:
                print(f"  - [{brand['code']}] {brand['name']}")
        else:
            print("\n❌ ATM受取に関連するブランドが見つかりませんでした")
            print("   Note: ATM受取は別途契約が必要なサービスの可能性があります")
        
        print("\n" + "=" * 80)
        print("\n📋 完全なブランドリスト (JSON):\n")
        print(json.dumps(brands, ensure_ascii=False, indent=2))
        
    except DigitalGiftAPIError as e:
        print(f"\n❌ APIエラー: {e.message}")
        if e.status_code:
            print(f"   ステータスコード: {e.status_code}")
        if e.response_data:
            print(f"   詳細: {json.dumps(e.response_data, ensure_ascii=False, indent=2)}")
    
    except Exception as e:
        print(f"\n❌ エラー: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    print("=" * 80)
    print("デジタルギフト ブランド一覧取得")
    print("ATM受取の利用可否を確認")
    print("=" * 80)
    print()
    
    check_brands()
