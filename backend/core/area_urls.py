"""
エリア管理用URLルーティング
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .area_views import ServiceAreaViewSet, NearbyStoreViewSet, StoreLocationViewSet

# ルーター設定
router = DefaultRouter()
router.register(r'areas', ServiceAreaViewSet, basename='servicearea')
router.register(r'stores/nearby', NearbyStoreViewSet, basename='nearby-stores')
router.register(r'stores', StoreLocationViewSet, basename='store-location')

urlpatterns = [
    path('', include(router.urls)),
]
