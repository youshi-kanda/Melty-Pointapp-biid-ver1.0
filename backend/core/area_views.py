"""
エリア管理用ビューセット
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from decimal import Decimal
import math

from .models import ServiceArea, Store
from .area_serializers import (
    ServiceAreaSerializer,
    AreaValidationSerializer,
    AreaValidationResponseSerializer,
    NearbyStoreSerializer,
    StoreLocationUpdateSerializer
)
from .area_utils import AreaValidator


class ServiceAreaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    サービスエリア管理API
    
    list: 全サービスエリア一覧
    retrieve: 特定エリアの詳細
    validate: 座標がサービスエリア内かチェック
    """
    queryset = ServiceArea.objects.filter(is_active=True)
    serializer_class = ServiceAreaSerializer
    permission_classes = [AllowAny]  # エリア情報は公開
    
    def get_queryset(self):
        """アクティブなエリアのみ返す"""
        queryset = super().get_queryset()
        
        # エリアコードでフィルタ
        area_code = self.request.query_params.get('area_code', None)
        if area_code:
            queryset = queryset.filter(area_code=area_code)
        
        return queryset.order_by('area_code')
    
    @action(detail=False, methods=['post'], url_path='validate')
    def validate_location(self, request):
        """
        指定された座標がサービスエリア内にあるかチェック
        
        POST /api/areas/validate/
        Body: {"latitude": 34.6675, "longitude": 135.5000}
        """
        serializer = AreaValidationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        lat = serializer.validated_data['latitude']
        lon = serializer.validated_data['longitude']
        
        # エリア検証
        is_valid, area_code = AreaValidator.is_within_service_area(lat, lon)
        
        response_data = {
            'is_valid': is_valid,
            'area_code': area_code,
            'area_name': None,
            'area_name_en': None,
            'message': ''
        }
        
        if is_valid and area_code:
            area_info = AreaValidator.get_area_info(area_code)
            if area_info:
                response_data.update({
                    'area_name': area_info.get('name'),
                    'area_name_en': area_info.get('name_en'),
                    'message': f'{area_info.get("name")}エリア内の位置です。'
                })
            else:
                response_data['message'] = 'エリア情報の取得に失敗しました。'
        else:
            response_data['message'] = 'サービス提供エリア外の位置です。'
            
            # 最寄りのエリアを提案
            try:
                nearest = AreaValidator.get_nearest_area(lat, lon)
                if nearest:
                    response_data['nearest_area'] = {
                        'area_code': nearest.get('code'),
                        'area_name': nearest.get('name'),
                        'distance_km': float(nearest.get('distance_km', 0))
                    }
                    response_data['message'] += f" 最寄りは{nearest.get('name')}（約{nearest.get('distance_km', 0):.1f}km）です。"
            except Exception as e:
                # 最寄りエリア取得エラーは無視（メッセージはそのまま）
                pass
        
        return Response(response_data)
    
    @action(detail=False, methods=['get'], url_path='boundaries')
    def get_boundaries(self, request):
        """
        全エリアの境界情報をGeoJSON形式で返す
        
        GET /api/areas/boundaries/
        """
        areas = self.get_queryset()
        features = []
        
        for area in areas:
            feature = {
                'type': 'Feature',
                'properties': {
                    'area_code': area.area_code,
                    'area_name': area.area_name,
                    'area_name_en': area.area_name_en,
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [[
                        [float(area.boundary_west), float(area.boundary_south)],
                        [float(area.boundary_east), float(area.boundary_south)],
                        [float(area.boundary_east), float(area.boundary_north)],
                        [float(area.boundary_west), float(area.boundary_north)],
                        [float(area.boundary_west), float(area.boundary_south)],
                    ]]
                }
            }
            features.append(feature)
        
        geojson = {
            'type': 'FeatureCollection',
            'features': features
        }
        
        return Response(geojson)


class NearbyStoreViewSet(viewsets.GenericViewSet):
    """
    近隣店舗検索API
    """
    serializer_class = NearbyStoreSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'], url_path='search')
    def search_nearby(self, request):
        """
        指定位置から近い店舗を検索
        
        POST /api/stores/nearby/search/
        Body: {
            "latitude": 34.6675,
            "longitude": 135.5000,
            "radius_km": 2.0,  // オプション、デフォルト5km
            "area_code": "minami",  // オプション、特定エリアのみ
            "limit": 20  // オプション、デフォルト20件
        }
        """
        lat = request.data.get('latitude')
        lon = request.data.get('longitude')
        radius_km = float(request.data.get('radius_km', 5.0))
        area_code = request.data.get('area_code')
        limit = int(request.data.get('limit', 20))
        
        if not lat or not lon:
            return Response(
                {'error': 'latitude と longitude は必須です。'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        lat = Decimal(str(lat))
        lon = Decimal(str(lon))
        
        # 店舗検索（緯度経度が設定されている店舗のみ）
        stores = Store.objects.filter(
            latitude__isnull=False,
            longitude__isnull=False,
            status='active'
        )
        
        # エリアコードでフィルタ
        if area_code:
            stores = stores.filter(area_code=area_code)
        
        # 距離計算と並べ替え
        stores_with_distance = []
        for store in stores:
            distance = self._calculate_distance(
                lat, lon,
                store.latitude, store.longitude
            )
            
            if distance <= radius_km:
                store.distance = Decimal(str(distance))
                stores_with_distance.append(store)
        
        # 距離でソート
        stores_with_distance.sort(key=lambda x: x.distance)
        
        # 件数制限
        stores_with_distance = stores_with_distance[:limit]
        
        serializer = self.get_serializer(stores_with_distance, many=True)
        
        return Response({
            'count': len(stores_with_distance),
            'radius_km': radius_km,
            'user_location': {
                'latitude': float(lat),
                'longitude': float(lon)
            },
            'stores': serializer.data
        })
    
    def _calculate_distance(self, lat1, lon1, lat2, lon2):
        """
        2点間の距離を計算（Haversine formula）
        
        Args:
            lat1, lon1: 地点1の緯度・経度（Decimal）
            lat2, lon2: 地点2の緯度・経度（float or Decimal）
        
        Returns:
            float: 距離（km）
        """
        # 地球の半径（km）
        R = 6371.0
        
        # Decimalをfloatに変換
        lat1 = float(lat1)
        lon1 = float(lon1)
        lat2 = float(lat2)
        lon2 = float(lon2)
        
        # ラジアンに変換
        lat1_rad = math.radians(lat1)
        lon1_rad = math.radians(lon1)
        lat2_rad = math.radians(lat2)
        lon2_rad = math.radians(lon2)
        
        # 差分
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad
        
        # Haversine formula
        a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c
        
        return round(distance, 2)


class StoreLocationViewSet(viewsets.GenericViewSet):
    """
    店舗位置情報管理API
    """
    queryset = Store.objects.all()
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'], url_path='update-location')
    def update_location(self, request, pk=None):
        """
        店舗の位置情報を更新し、エリアを自動判定
        
        POST /api/stores/{id}/update-location/
        Body: {
            "latitude": 34.6675,
            "longitude": 135.5000,
            "address": "大阪府大阪市中央区心斎橋筋..."  // オプション
        }
        """
        store = self.get_object()
        
        # 権限チェック（店舗管理者または管理者のみ）
        if not (request.user.is_staff or 
                (hasattr(request.user, 'store') and request.user.store == store)):
            return Response(
                {'error': '権限がありません。'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = StoreLocationUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        lat = serializer.validated_data['latitude']
        lon = serializer.validated_data['longitude']
        address = serializer.validated_data.get('address')
        
        # エリア検証
        validation_result = AreaValidator.validate_store_location(
            address=address or store.address,
            latitude=lat,
            longitude=lon
        )
        
        # 店舗情報を更新
        store.latitude = lat
        store.longitude = lon
        if address:
            store.address = address
        
        if validation_result['is_valid']:
            store.area_code = validation_result['area_code']
            store.is_area_verified = True
            if validation_result.get('service_area'):
                store.service_area_id = validation_result['service_area'].id
        else:
            store.is_area_verified = False
        
        store.save()
        
        return Response({
            'success': True,
            'message': validation_result['message'],
            'store': {
                'id': store.id,
                'name': store.name,
                'latitude': float(store.latitude),
                'longitude': float(store.longitude),
                'area_code': store.area_code,
                'is_area_verified': store.is_area_verified
            },
            'validation': validation_result
        })
