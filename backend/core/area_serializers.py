"""
エリア管理用シリアライザー
"""
from rest_framework import serializers
from .models import ServiceArea, Store
from decimal import Decimal


class ServiceAreaSerializer(serializers.ModelSerializer):
    """サービスエリアのシリアライザー"""
    
    class Meta:
        model = ServiceArea
        fields = [
            'id', 'area_code', 'area_name', 'area_name_en',
            'boundary_north', 'boundary_south', 'boundary_east', 'boundary_west',
            'center_latitude', 'center_longitude', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class AreaValidationSerializer(serializers.Serializer):
    """エリア検証用シリアライザー"""
    latitude = serializers.DecimalField(max_digits=10, decimal_places=7, required=True)
    longitude = serializers.DecimalField(max_digits=10, decimal_places=7, required=True)


class AreaValidationResponseSerializer(serializers.Serializer):
    """エリア検証結果のシリアライザー"""
    is_valid = serializers.BooleanField()
    area_code = serializers.CharField(allow_null=True)
    area_name = serializers.CharField(allow_null=True)
    area_name_en = serializers.CharField(allow_null=True)
    message = serializers.CharField()
    nearest_area = serializers.DictField(allow_null=True, required=False)


class NearbyStoreSerializer(serializers.ModelSerializer):
    """近隣店舗用シリアライザー"""
    distance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    area_name = serializers.CharField(source='service_area.area_name', read_only=True, allow_null=True)
    
    class Meta:
        model = Store
        fields = [
            'id', 'name', 'address', 'latitude', 'longitude',
            'category', 'price_range', 'rating', 'hours',
            'area_code', 'area_name', 'prefecture', 'city', 'district',
            'is_area_verified', 'distance'
        ]


class StoreLocationUpdateSerializer(serializers.Serializer):
    """店舗位置情報更新用シリアライザー"""
    latitude = serializers.DecimalField(max_digits=10, decimal_places=7, required=True)
    longitude = serializers.DecimalField(max_digits=10, decimal_places=7, required=True)
    address = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, data):
        """位置情報の妥当性チェック"""
        lat = data['latitude']
        lon = data['longitude']
        
        # 緯度の範囲チェック（日本周辺）
        if not (24 <= lat <= 46):
            raise serializers.ValidationError({
                'latitude': '緯度は日本の範囲内（24-46度）で指定してください。'
            })
        
        # 経度の範囲チェック（日本周辺）
        if not (122 <= lon <= 154):
            raise serializers.ValidationError({
                'longitude': '経度は日本の範囲内（122-154度）で指定してください。'
            })
        
        return data
