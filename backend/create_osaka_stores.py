"""
大阪エリア（ミナミ・北新地）の初期店舗データ作成スクリプト

使用方法:
    python create_osaka_stores.py
"""
import os
import sys
import django

# Django設定
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pointapp.settings')
django.setup()

from core.models import Store, ServiceArea
from decimal import Decimal


# ミナミエリアの店舗データ
MINAMI_STORES = [
    {
        'name': '心斎橋居酒屋 粋',
        'owner_name': '田中 太郎',
        'email': 'sui@minami-izakaya.jp',
        'phone': '06-6211-0001',
        'address': '大阪府大阪市中央区心斎橋筋1-5-10',
        'latitude': Decimal('34.6705'),
        'longitude': Decimal('135.5020'),
        'category': 'restaurant',
        'price_range': 'moderate',
        'hours': '17:00-24:00',
        'features': ['居酒屋', '日本料理', '宴会可能'],
        'specialties': ['串カツ', '刺身盛り合わせ', '焼き鳥'],
    },
    {
        'name': 'なんばグリル',
        'owner_name': '山田 花子',
        'email': 'info@namba-grill.jp',
        'phone': '06-6641-0002',
        'address': '大阪府大阪市中央区難波3-2-15',
        'latitude': Decimal('34.6650'),
        'longitude': Decimal('135.5010'),
        'category': 'restaurant',
        'price_range': 'moderate',
        'hours': '11:30-22:00',
        'features': ['洋食', 'ステーキ', 'ハンバーグ'],
        'specialties': ['オムライス', 'ハヤシライス', 'ビフカツ'],
    },
    {
        'name': '道頓堀たこ焼き 元祖',
        'owner_name': '佐藤 次郎',
        'email': 'ganso@dotonbori-tako.jp',
        'phone': '06-6211-0003',
        'address': '大阪府大阪市中央区道頓堀1-7-21',
        'latitude': Decimal('34.6687'),
        'longitude': Decimal('135.5025'),
        'category': 'restaurant',
        'price_range': 'budget',
        'hours': '10:00-23:00',
        'features': ['たこ焼き', 'テイクアウト', '立ち食い'],
        'specialties': ['たこ焼き8個入り', 'ねぎ焼き', '明石焼き'],
    },
    {
        'name': 'アメ村カフェ Rainbow',
        'owner_name': '鈴木 美咲',
        'email': 'rainbow@americamura-cafe.jp',
        'phone': '06-6241-0004',
        'address': '大阪府大阪市中央区西心斎橋2-11-5',
        'latitude': Decimal('34.6720'),
        'longitude': Decimal('135.4980'),
        'category': 'restaurant',
        'price_range': 'moderate',
        'hours': '10:00-22:00',
        'features': ['カフェ', 'Wi-Fi', 'テラス席'],
        'specialties': ['パンケーキ', 'タピオカドリンク', 'アボカドトースト'],
    },
    {
        'name': '心斎橋ラーメン 龍',
        'owner_name': '高橋 健',
        'email': 'ryu@shinsaibashi-ramen.jp',
        'phone': '06-6251-0005',
        'address': '大阪府大阪市中央区心斎橋筋2-3-8',
        'latitude': Decimal('34.6690'),
        'longitude': Decimal('135.5015'),
        'category': 'restaurant',
        'price_range': 'budget',
        'hours': '11:00-翌3:00',
        'features': ['ラーメン', '深夜営業', 'カウンター席'],
        'specialties': ['とんこつラーメン', 'チャーシュー麺', '替え玉'],
    },
    {
        'name': 'ミナミ焼肉 牛王',
        'owner_name': '伊藤 大輔',
        'email': 'gyuou@minami-yakiniku.jp',
        'phone': '06-6211-0006',
        'address': '大阪府大阪市中央区難波1-8-16',
        'latitude': Decimal('34.6670'),
        'longitude': Decimal('135.5005'),
        'category': 'restaurant',
        'price_range': 'expensive',
        'hours': '17:00-23:00',
        'features': ['焼肉', '個室あり', '宴会可能'],
        'specialties': ['特選カルビ', '厚切りタン', 'ホルモン盛り合わせ'],
    },
    {
        'name': '道頓堀お好み焼き さくら',
        'owner_name': '渡辺 春子',
        'email': 'sakura@dotonbori-okonomiyaki.jp',
        'phone': '06-6211-0007',
        'address': '大阪府大阪市中央区道頓堀2-1-10',
        'latitude': Decimal('34.6683'),
        'longitude': Decimal('135.5030'),
        'category': 'restaurant',
        'price_range': 'moderate',
        'hours': '11:30-22:30',
        'features': ['お好み焼き', '鉄板焼き', 'もんじゃ焼き'],
        'specialties': ['豚玉', 'モダン焼き', 'ねぎ焼き'],
    },
    {
        'name': '心斎橋バル イタリアーノ',
        'owner_name': 'マリオ・ロッシ',
        'email': 'mario@shinsaibashi-italiano.jp',
        'phone': '06-6251-0008',
        'address': '大阪府大阪市中央区南船場3-12-3',
        'latitude': Decimal('34.6745'),
        'longitude': Decimal('135.4995'),
        'category': 'restaurant',
        'price_range': 'expensive',
        'hours': '17:30-23:00',
        'features': ['イタリアン', 'ワインバー', 'テラス席'],
        'specialties': ['生ハム', 'カルボナーラ', 'ティラミス'],
    },
    {
        'name': 'アメ村古着 Vintage Shop',
        'owner_name': '木村 拓也',
        'email': 'vintage@americamura.jp',
        'phone': '06-6241-0009',
        'address': '大阪府大阪市中央区西心斎橋2-8-9',
        'latitude': Decimal('34.6715'),
        'longitude': Decimal('135.4975'),
        'category': 'retail',
        'price_range': 'moderate',
        'hours': '12:00-20:00',
        'features': ['古着', 'ヴィンテージ', 'アメカジ'],
        'specialties': ['Levi\'s', 'ミリタリージャケット', 'スニーカー'],
    },
    {
        'name': '心斎橋スイーツ パティスリー',
        'owner_name': '小林 さくら',
        'email': 'sweets@shinsaibashi-patisserie.jp',
        'phone': '06-6251-0010',
        'address': '大阪府大阪市中央区心斎橋筋1-9-5',
        'latitude': Decimal('34.6700'),
        'longitude': Decimal('135.5018'),
        'category': 'retail',
        'price_range': 'moderate',
        'hours': '10:00-20:00',
        'features': ['ケーキ', 'マカロン', 'テイクアウト'],
        'specialties': ['苺のショートケーキ', 'モンブラン', 'エクレア'],
    },
]

# 北新地エリアの店舗データ
KITASHINCHI_STORES = [
    {
        'name': '北新地割烹 味彩',
        'owner_name': '松本 誠一',
        'email': 'aji@kitashinchi-kaiseki.jp',
        'phone': '06-6341-0001',
        'address': '大阪府大阪市北区曽根崎新地1-5-12',
        'latitude': Decimal('34.6970'),
        'longitude': Decimal('135.4980'),
        'category': 'restaurant',
        'price_range': 'luxury',
        'hours': '18:00-24:00 (完全予約制)',
        'features': ['割烹', '日本料理', '個室', 'カウンター席'],
        'specialties': ['季節の会席', 'フグ料理', '活き造り'],
    },
    {
        'name': '北新地鉄板焼き 神戸牛',
        'owner_name': '中村 龍也',
        'email': 'kobe@kitashinchi-teppanyaki.jp',
        'phone': '06-6341-0002',
        'address': '大阪府大阪市北区堂島1-3-8',
        'latitude': Decimal('34.6955'),
        'longitude': Decimal('135.4970'),
        'category': 'restaurant',
        'price_range': 'luxury',
        'hours': '17:00-23:00',
        'features': ['鉄板焼き', '神戸牛', 'シェフパフォーマンス'],
        'specialties': ['A5ランク神戸牛', 'フォアグラ', '伊勢海老'],
    },
    {
        'name': '新地イタリアン Bellissimo',
        'owner_name': 'ジョバンニ・ビアンキ',
        'email': 'bellissimo@kitashinchi-italian.jp',
        'phone': '06-6341-0003',
        'address': '大阪府大阪市北区曽根崎新地1-7-5',
        'latitude': Decimal('34.6975'),
        'longitude': Decimal('135.4985'),
        'category': 'restaurant',
        'price_range': 'expensive',
        'hours': '18:00-24:00',
        'features': ['イタリアン', 'ワインセラー', 'バル'],
        'specialties': ['トリュフパスタ', 'リゾット', 'カルパッチョ'],
    },
    {
        'name': '北新地寿司 大将',
        'owner_name': '吉田 修',
        'email': 'taisho@kitashinchi-sushi.jp',
        'phone': '06-6341-0004',
        'address': '大阪府大阪市北区堂島1-2-10',
        'latitude': Decimal('34.6950'),
        'longitude': Decimal('135.4965'),
        'category': 'restaurant',
        'price_range': 'luxury',
        'hours': '17:30-23:00',
        'features': ['寿司', 'カウンター', 'お任せコース'],
        'specialties': ['おまかせ握り', '中トロ', '雲丹'],
    },
    {
        'name': '新地バー Whisky Library',
        'owner_name': '森田 健太郎',
        'email': 'library@kitashinchi-bar.jp',
        'phone': '06-6341-0005',
        'address': '大阪府大阪市北区曽根崎新地1-9-3',
        'latitude': Decimal('34.6980'),
        'longitude': Decimal('135.4990'),
        'category': 'entertainment',
        'price_range': 'expensive',
        'hours': '19:00-翌3:00',
        'features': ['バー', 'ウイスキー', 'シガーバー'],
        'specialties': ['スコッチウイスキー', 'クラフトカクテル', '葉巻'],
    },
    {
        'name': '北新地フレンチ Le Jardin',
        'owner_name': 'ピエール・デュポン',
        'email': 'lejardin@kitashinchi-french.jp',
        'phone': '06-6341-0006',
        'address': '大阪府大阪市北区堂島1-4-12',
        'latitude': Decimal('34.6960'),
        'longitude': Decimal('135.4975'),
        'category': 'restaurant',
        'price_range': 'luxury',
        'hours': 'ランチ 12:00-14:00 / ディナー 18:00-22:00',
        'features': ['フレンチ', 'ミシュラン', 'ソムリエ在籍'],
        'specialties': ['フォアグラのポワレ', 'オマール海老', 'デギュスタシオンコース'],
    },
    {
        'name': '新地ラウンジ Crystal',
        'owner_name': '藤原 麗子',
        'email': 'crystal@kitashinchi-lounge.jp',
        'phone': '06-6341-0007',
        'address': '大阪府大阪市北区曽根崎新地1-6-8',
        'latitude': Decimal('34.6968'),
        'longitude': Decimal('135.4978'),
        'category': 'entertainment',
        'price_range': 'luxury',
        'hours': '20:00-翌5:00',
        'features': ['ラウンジ', 'VIPルーム', 'シャンパン'],
        'specialties': ['ドンペリ', 'カクテル', 'フィンガーフード'],
    },
    {
        'name': '北新地中華 鳳凰',
        'owner_name': '王 建国',
        'email': 'houou@kitashinchi-chinese.jp',
        'phone': '06-6341-0008',
        'address': '大阪府大阪市北区堂島1-5-15',
        'latitude': Decimal('34.6965'),
        'longitude': Decimal('135.4972'),
        'category': 'restaurant',
        'price_range': 'expensive',
        'hours': 'ランチ 11:30-14:30 / ディナー 17:30-22:00',
        'features': ['中華料理', '広東料理', '個室完備'],
        'specialties': ['北京ダック', 'フカヒレスープ', '小籠包'],
    },
    {
        'name': '新地カフェ&バー Moonlight',
        'owner_name': '岡田 美穂',
        'email': 'moonlight@kitashinchi-cafe.jp',
        'phone': '06-6341-0009',
        'address': '大阪府大阪市北区曽根崎新地1-8-10',
        'latitude': Decimal('34.6978'),
        'longitude': Decimal('135.4988'),
        'category': 'restaurant',
        'price_range': 'moderate',
        'hours': 'カフェ 10:00-18:00 / バー 18:00-24:00',
        'features': ['カフェ', 'バー', 'スイーツ'],
        'specialties': ['ランチセット', 'カクテル', 'チーズケーキ'],
    },
    {
        'name': '北新地ステーキ Prime',
        'owner_name': '大野 隆',
        'email': 'prime@kitashinchi-steak.jp',
        'phone': '06-6341-0010',
        'address': '大阪府大阪市北区堂島1-6-20',
        'latitude': Decimal('34.6972'),
        'longitude': Decimal('135.4982'),
        'category': 'restaurant',
        'price_range': 'luxury',
        'hours': '17:00-23:00',
        'features': ['ステーキ', 'ワインペアリング', 'カウンター席'],
        'specialties': ['A5和牛サーロイン', '熟成肉', 'フィレミニョン'],
    },
]


def create_stores():
    """店舗データを作成"""
    
    print("=" * 60)
    print("大阪エリア店舗データ作成スクリプト")
    print("=" * 60)
    print()
    
    # サービスエリアを取得
    try:
        minami_area = ServiceArea.objects.get(area_code='minami')
        kitashinchi_area = ServiceArea.objects.get(area_code='kitashinchi')
        print(f"✅ サービスエリア取得成功")
        print(f"   - {minami_area.area_name} ({minami_area.area_code})")
        print(f"   - {kitashinchi_area.area_name} ({kitashinchi_area.area_code})")
        print()
    except ServiceArea.DoesNotExist as e:
        print(f"❌ エラー: サービスエリアが見つかりません")
        print(f"   マイグレーション0004_add_service_areas.pyを実行してください")
        return
    
    # ミナミエリアの店舗作成
    print("📍 ミナミエリアの店舗作成中...")
    minami_count = 0
    for store_data in MINAMI_STORES:
        store, created = Store.objects.get_or_create(
            email=store_data['email'],
            defaults={
                **store_data,
                'service_area': minami_area,
                'area_code': 'minami',
                'prefecture': '大阪府',
                'city': '大阪市中央区',
                'district': '心斎橋・難波・道頓堀・アメリカ村',
                'is_area_verified': True,
                'point_rate': 1,
                'status': 'active',
                'balance': Decimal('0.00'),
                'monthly_fee': Decimal('5000.00'),
                'rating': 4.5,
                'reviews_count': 0,
                'biid_partner': True,
            }
        )
        if created:
            minami_count += 1
            print(f"   ✓ {store.name}")
        else:
            print(f"   - {store.name} (既存)")
    
    print(f"✅ ミナミエリア: {minami_count}件の新規店舗を作成")
    print()
    
    # 北新地エリアの店舗作成
    print("📍 北新地エリアの店舗作成中...")
    kitashinchi_count = 0
    for store_data in KITASHINCHI_STORES:
        store, created = Store.objects.get_or_create(
            email=store_data['email'],
            defaults={
                **store_data,
                'service_area': kitashinchi_area,
                'area_code': 'kitashinchi',
                'prefecture': '大阪府',
                'city': '大阪市北区',
                'district': '曽根崎新地・堂島',
                'is_area_verified': True,
                'point_rate': 1,
                'status': 'active',
                'balance': Decimal('0.00'),
                'monthly_fee': Decimal('8000.00'),  # 北新地は少し高め
                'rating': 4.7,
                'reviews_count': 0,
                'biid_partner': True,
            }
        )
        if created:
            kitashinchi_count += 1
            print(f"   ✓ {store.name}")
        else:
            print(f"   - {store.name} (既存)")
    
    print(f"✅ 北新地エリア: {kitashinchi_count}件の新規店舗を作成")
    print()
    
    # 統計表示
    total_stores = Store.objects.filter(
        service_area__in=[minami_area, kitashinchi_area]
    ).count()
    
    print("=" * 60)
    print("📊 作成完了")
    print("=" * 60)
    print(f"総店舗数: {total_stores}件")
    print(f"  - ミナミエリア: {Store.objects.filter(service_area=minami_area).count()}件")
    print(f"  - 北新地エリア: {Store.objects.filter(service_area=kitashinchi_area).count()}件")
    print()
    print("カテゴリ別:")
    categories = Store.objects.filter(
        service_area__in=[minami_area, kitashinchi_area]
    ).values_list('category', flat=True)
    from collections import Counter
    category_counts = Counter(categories)
    for category, count in category_counts.items():
        print(f"  - {category}: {count}件")
    print()


if __name__ == '__main__':
    create_stores()
