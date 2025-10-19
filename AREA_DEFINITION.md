# 大阪エリア限定サービス - エリア境界定義
# 最終更新: 2025年10月19日

## 📍 対象エリア

### 1. ミナミエリア（Minami Area）

**主要地域**:
- 心斎橋（Shinsaibashi）
- 難波（Namba）
- 道頓堀（Dotonbori）
- アメリカ村（Amerikamura）
- 宗右衛門町（Soemoncho）
- 千日前（Sennichimae）

**境界座標** (概算):
```javascript
{
  "area_name": "minami",
  "display_name": "ミナミ",
  "boundary": {
    "north": 34.6750,  // 長堀通付近
    "south": 34.6600,  // 難波駅南側
    "east": 135.5050,  // 堺筋付近
    "west": 135.4950   // 四ツ橋筋付近
  },
  "center": {
    "latitude": 34.6675,
    "longitude": 135.5000
  }
}
```

### 2. 北新地エリア（Kitashinchi Area）

**主要地域**:
- 北新地（Kitashinchi）
- 堂島（Dojima）
- 曽根崎新地（Sonezaki Shinchi）

**境界座標** (概算):
```javascript
{
  "area_name": "kitashinchi",
  "display_name": "北新地",
  "boundary": {
    "north": 34.7000,  // 梅田スカイビル付近
    "south": 34.6930,  // 堂島川
    "east": 135.5000,  // 大江橋付近
    "west": 135.4920   // 福島付近
  },
  "center": {
    "latitude": 34.6965,
    "longitude": 135.4960
  }
}
```

---

## 🔧 実装仕様

### データベーススキーマ

```sql
-- エリアマスターテーブル
CREATE TABLE service_areas (
    id SERIAL PRIMARY KEY,
    area_code VARCHAR(20) UNIQUE NOT NULL,  -- 'minami', 'kitashinchi'
    area_name VARCHAR(100) NOT NULL,        -- 'ミナミ', '北新地'
    area_name_en VARCHAR(100),              -- 'Minami', 'Kitashinchi'
    boundary_north DECIMAL(10, 7),
    boundary_south DECIMAL(10, 7),
    boundary_east DECIMAL(11, 7),
    boundary_west DECIMAL(11, 7),
    center_latitude DECIMAL(10, 7),
    center_longitude DECIMAL(11, 7),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 店舗テーブルへのカラム追加
ALTER TABLE stores ADD COLUMN latitude DECIMAL(10, 7);
ALTER TABLE stores ADD COLUMN longitude DECIMAL(11, 7);
ALTER TABLE stores ADD COLUMN area_code VARCHAR(20);
ALTER TABLE stores ADD COLUMN prefecture VARCHAR(50) DEFAULT '大阪府';
ALTER TABLE stores ADD COLUMN city VARCHAR(50) DEFAULT '大阪市';
ALTER TABLE stores ADD COLUMN district VARCHAR(50);  -- '中央区', '北区' など
ALTER TABLE stores ADD COLUMN is_area_verified BOOLEAN DEFAULT FALSE;
```

### エリア判定ロジック

```python
def is_within_service_area(latitude, longitude):
    """
    指定された座標がサービス提供エリア内かチェック
    """
    # ミナミエリア
    minami = {
        'north': 34.6750,
        'south': 34.6600,
        'east': 135.5050,
        'west': 135.4950
    }
    
    # 北新地エリア
    kitashinchi = {
        'north': 34.7000,
        'south': 34.6930,
        'east': 135.5000,
        'west': 135.4920
    }
    
    # ミナミエリア内チェック
    if (minami['south'] <= latitude <= minami['north'] and
        minami['west'] <= longitude <= minami['east']):
        return True, 'minami'
    
    # 北新地エリア内チェック
    if (kitashinchi['south'] <= latitude <= kitashinchi['north'] and
        kitashinchi['west'] <= longitude <= kitashinchi['east']):
        return True, 'kitashinchi'
    
    return False, None


def get_area_from_address(address):
    """
    住所からエリアを判定（ジオコーディング）
    """
    # TODO: Google Maps Geocoding API または OpenStreetMap Nominatim を使用
    # 住所 → 緯度経度 → エリア判定
    pass
```

---

## 📱 ユーザー向けメッセージ

### エリア外アクセス時

```
🗺️ サービス提供エリア外です

現在、本サービスは以下のエリアでご利用いただけます：

📍 大阪ミナミエリア
   心斎橋・難波・道頓堀・アメリカ村

📍 大阪北新地エリア
   北新地・堂島・曽根崎新地

順次エリアを拡大予定です！
最新情報はアプリ内でお知らせします。
```

### 店舗登録時（エリア外）

```
⚠️ この住所はサービス提供エリア外です

現在、以下のエリアのみ店舗登録が可能です：
• 大阪市中央区（ミナミエリア）
• 大阪市北区（北新地エリア）

エリア拡大のご希望がございましたら、
お問い合わせフォームよりご連絡ください。
```

---

## 🧪 テストケース

### 1. ミナミエリア内の座標
```javascript
// 心斎橋
{ latitude: 34.6718, longitude: 135.5004 } // → TRUE, 'minami'

// 道頓堀
{ latitude: 34.6686, longitude: 135.5023 } // → TRUE, 'minami'

// 難波
{ latitude: 34.6651, longitude: 135.5008 } // → TRUE, 'minami'
```

### 2. 北新地エリア内の座標
```javascript
// 北新地
{ latitude: 34.6965, longitude: 135.4960 } // → TRUE, 'kitashinchi'

// 堂島
{ latitude: 34.6950, longitude: 135.4980 } // → TRUE, 'kitashinchi'
```

### 3. エリア外の座標
```javascript
// 梅田（対象外）
{ latitude: 34.7024, longitude: 135.4959 } // → FALSE, null

// 天王寺（対象外）
{ latitude: 34.6453, longitude: 135.5144 } // → FALSE, null

// 京都（対象外）
{ latitude: 35.0116, longitude: 135.7681 } // → FALSE, null
```

---

## 🎯 次のステップ

1. ✅ エリア定義完了（このファイル）
2. ⬜ データベースマイグレーション作成
3. ⬜ バックエンドAPIにエリア判定機能追加
4. ⬜ フロントエンドに位置情報取得機能追加
5. ⬜ 店舗登録フォームにエリア検証追加
6. ⬜ テストデータ投入（ミナミ・北新地の実店舗）

---

## 📝 将来的なエリア拡大候補

- **大阪市内**: 梅田、天王寺、京橋、天満
- **大阪府内**: 江坂、豊中、吹田、堺
- **関西圏**: 神戸三宮、京都四条、奈良
- **全国展開**: 東京、名古屋、福岡、札幌...
