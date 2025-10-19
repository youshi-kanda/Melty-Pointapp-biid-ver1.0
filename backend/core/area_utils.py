# -*- coding: utf-8 -*-
"""
BIID Point App - エリア管理ユーティリティ
大阪ミナミ・北新地エリア限定サービスの地理的判定
"""

from decimal import Decimal
from typing import Tuple, Optional, Dict, List
from django.core.cache import cache


class AreaValidator:
    """サービス提供エリアの検証クラス"""
    
    # キャッシュキー
    CACHE_KEY_AREAS = 'service_areas_active'
    CACHE_TIMEOUT = 3600  # 1時間
    
    @staticmethod
    def is_within_service_area(latitude: float, longitude: float) -> Tuple[bool, Optional[str]]:
        """
        指定された座標がサービス提供エリア内かチェック
        
        Args:
            latitude: 緯度
            longitude: 経度
            
        Returns:
            (エリア内か, エリアコード)のタプル
            例: (True, 'minami'), (False, None)
        """
        from core.models import ServiceArea
        
        # キャッシュから取得
        areas = cache.get(AreaValidator.CACHE_KEY_AREAS)
        if areas is None:
            areas = list(ServiceArea.objects.filter(is_active=True).values())
            cache.set(AreaValidator.CACHE_KEY_AREAS, areas, AreaValidator.CACHE_TIMEOUT)
        
        lat_decimal = Decimal(str(latitude))
        lon_decimal = Decimal(str(longitude))
        
        for area in areas:
            if (area['boundary_south'] <= lat_decimal <= area['boundary_north'] and
                area['boundary_west'] <= lon_decimal <= area['boundary_east']):
                return True, area['area_code']
        
        return False, None
    
    @staticmethod
    def get_area_info(area_code: str) -> Optional[Dict]:
        """
        エリアコードから詳細情報を取得
        
        Args:
            area_code: エリアコード ('minami', 'kitashinchi')
            
        Returns:
            エリア情報の辞書、見つからない場合はNone
        """
        from core.models import ServiceArea
        
        try:
            area = ServiceArea.objects.get(area_code=area_code, is_active=True)
            return {
                'code': area.area_code,
                'name': area.area_name,
                'name_en': area.area_name_en,
                'center': {
                    'latitude': float(area.center_latitude),
                    'longitude': float(area.center_longitude)
                },
                'boundary': {
                    'north': float(area.boundary_north),
                    'south': float(area.boundary_south),
                    'east': float(area.boundary_east),
                    'west': float(area.boundary_west)
                }
            }
        except ServiceArea.DoesNotExist:
            return None
    
    @staticmethod
    def get_all_active_areas() -> List[Dict]:
        """有効な全エリア情報を取得"""
        from core.models import ServiceArea
        
        areas = []
        for area in ServiceArea.objects.filter(is_active=True):
            areas.append({
                'code': area.area_code,
                'name': area.area_name,
                'name_en': area.area_name_en,
                'center': {
                    'latitude': float(area.center_latitude),
                    'longitude': float(area.center_longitude)
                }
            })
        return areas
    
    @staticmethod
    def validate_store_location(address: str, latitude: Optional[float] = None, 
                               longitude: Optional[float] = None) -> Dict:
        """
        店舗の住所と座標を検証
        
        Args:
            address: 店舗住所
            latitude: 緯度（オプション）
            longitude: 経度（オプション）
            
        Returns:
            検証結果の辞書
            {
                'is_valid': bool,
                'area_code': str or None,
                'message': str,
                'latitude': float or None,
                'longitude': float or None
            }
        """
        # 座標が提供されている場合
        if latitude is not None and longitude is not None:
            is_valid, area_code = AreaValidator.is_within_service_area(latitude, longitude)
            
            if is_valid:
                return {
                    'is_valid': True,
                    'area_code': area_code,
                    'message': f'サービス提供エリア内です（{area_code}）',
                    'latitude': latitude,
                    'longitude': longitude
                }
            else:
                return {
                    'is_valid': False,
                    'area_code': None,
                    'message': 'この場所はサービス提供エリア外です',
                    'latitude': latitude,
                    'longitude': longitude
                }
        
        # 住所のみの場合（ジオコーディングが必要）
        # TODO: Google Maps Geocoding API or OpenStreetMap Nominatim を実装
        return {
            'is_valid': False,
            'area_code': None,
            'message': '位置情報の取得が必要です',
            'latitude': None,
            'longitude': None
        }
    
    @staticmethod
    def get_nearest_area(latitude: float, longitude: float) -> Optional[Dict]:
        """
        指定座標に最も近いエリアを取得（エリア外の場合）
        
        Args:
            latitude: 緯度
            longitude: 経度
            
        Returns:
            最寄りエリア情報、エリアが見つからない場合はNone
        """
        from core.models import ServiceArea
        import math
        
        def calculate_distance(lat1, lon1, lat2, lon2):
            """2点間の距離を計算（簡易版・km単位）"""
            R = 6371  # 地球の半径（km）
            lat1_rad = math.radians(lat1)
            lat2_rad = math.radians(lat2)
            delta_lat = math.radians(lat2 - lat1)
            delta_lon = math.radians(lon2 - lon1)
            
            a = (math.sin(delta_lat / 2) ** 2 +
                 math.cos(lat1_rad) * math.cos(lat2_rad) *
                 math.sin(delta_lon / 2) ** 2)
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            
            return R * c
        
        nearest_area = None
        min_distance = float('inf')
        
        for area in ServiceArea.objects.filter(is_active=True):
            distance = calculate_distance(
                latitude, longitude,
                float(area.center_latitude), float(area.center_longitude)
            )
            
            if distance < min_distance:
                min_distance = distance
                nearest_area = {
                    'code': area.area_code,
                    'name': area.area_name,
                    'distance_km': round(distance, 2)
                }
        
        return nearest_area


def check_area_permission(user_location: Dict) -> Dict:
    """
    ユーザーの位置情報からサービス利用可否を判定
    
    Args:
        user_location: {'latitude': float, 'longitude': float}
        
    Returns:
        {'allowed': bool, 'area_code': str or None, 'message': str}
    """
    latitude = user_location.get('latitude')
    longitude = user_location.get('longitude')
    
    if latitude is None or longitude is None:
        return {
            'allowed': False,
            'area_code': None,
            'message': '位置情報の取得に失敗しました'
        }
    
    is_valid, area_code = AreaValidator.is_within_service_area(latitude, longitude)
    
    if is_valid:
        area_info = AreaValidator.get_area_info(area_code)
        return {
            'allowed': True,
            'area_code': area_code,
            'area_name': area_info['name'] if area_info else area_code,
            'message': f'{area_info["name"]}エリアでサービスをご利用いただけます'
        }
    else:
        nearest = AreaValidator.get_nearest_area(latitude, longitude)
        message = 'サービス提供エリア外です'
        if nearest:
            message += f'（最寄り: {nearest["name"]} - 約{nearest["distance_km"]}km）'
        
        return {
            'allowed': False,
            'area_code': None,
            'nearest_area': nearest,
            'message': message
        }
