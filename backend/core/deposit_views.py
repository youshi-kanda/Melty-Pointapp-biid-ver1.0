from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
import logging

from .models import Store, DepositTransaction, DepositAutoChargeRule, DepositUsageLog
from .deposit_serializers import (
    DepositTransactionSerializer, DepositChargeSerializer, DepositConsumeSerializer,
    DepositAutoChargeRuleSerializer, AutoChargeSetupSerializer, DepositUsageLogSerializer,
    DepositBalanceSerializer
)
from .deposit_service import deposit_service

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def charge_deposit(request, store_id):
    """デポジットチャージ"""
    try:
        store = get_object_or_404(Store, id=store_id)
        
        # 権限チェック（店舗管理者のみ）
        if not hasattr(request.user, 'managed_stores') or not request.user.managed_stores.filter(id=store_id).exists():
            return Response(
                {'error': '権限がありません'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = DepositChargeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # デポジットチャージ実行
        transaction = deposit_service.charge_deposit(
            store=store,
            amount=serializer.validated_data['amount'],
            payment_method=serializer.validated_data['payment_method'],
            payment_reference=serializer.validated_data.get('payment_reference', ''),
            description=serializer.validated_data.get('description', '')
        )
        
        response_serializer = DepositTransactionSerializer(transaction)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Failed to charge deposit: {str(e)}")
        return Response(
            {'error': 'チャージに失敗しました'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def consume_deposit(request, store_id):
    """デポジット消費"""
    try:
        store = get_object_or_404(Store, id=store_id)
        
        # 権限チェック（店舗管理者のみ）
        if not hasattr(request.user, 'managed_stores') or not request.user.managed_stores.filter(id=store_id).exists():
            return Response(
                {'error': '権限がありません'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = DepositConsumeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # デポジット消費実行
        transaction = deposit_service.consume_deposit(
            store=store,
            amount=serializer.validated_data['amount'],
            used_for=serializer.validated_data['used_for'],
            description=serializer.validated_data.get('description', ''),
            user_count=serializer.validated_data.get('user_count', 0)
        )
        
        response_serializer = DepositTransactionSerializer(transaction)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Failed to consume deposit: {str(e)}")
        return Response(
            {'error': 'デポジット消費に失敗しました'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_deposit_balance(request, store_id):
    """デポジット残高取得"""
    try:
        store = get_object_or_404(Store, id=store_id)
        
        # 権限チェック（店舗管理者のみ）
        if not hasattr(request.user, 'managed_stores') or not request.user.managed_stores.filter(id=store_id).exists():
            return Response(
                {'error': '権限がありません'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        balance_info = deposit_service.get_deposit_balance(store)
        serializer = DepositBalanceSerializer(balance_info)
        return Response(serializer.data)
        
    except Exception as e:
        logger.error(f"Failed to get deposit balance: {str(e)}")
        return Response(
            {'error': '残高取得に失敗しました'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_deposit_transactions(request, store_id):
    """デポジット取引履歴取得"""
    try:
        store = get_object_or_404(Store, id=store_id)
        
        # 権限チェック（店舗管理者のみ）
        if not hasattr(request.user, 'managed_stores') or not request.user.managed_stores.filter(id=store_id).exists():
            return Response(
                {'error': '権限がありません'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # ページネーション対応
        page = int(request.GET.get('page', 1))
        limit = min(int(request.GET.get('limit', 20)), 100)  # 最大100件
        offset = (page - 1) * limit
        
        transactions = DepositTransaction.objects.filter(
            store=store
        ).order_by('-created_at')[offset:offset + limit]
        
        serializer = DepositTransactionSerializer(transactions, many=True)
        return Response({
            'transactions': serializer.data,
            'page': page,
            'limit': limit,
            'has_more': len(transactions) == limit
        })
        
    except Exception as e:
        logger.error(f"Failed to get deposit transactions: {str(e)}")
        return Response(
            {'error': '取引履歴取得に失敗しました'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST', 'GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def manage_auto_charge(request, store_id):
    """自動チャージルール管理"""
    try:
        store = get_object_or_404(Store, id=store_id)
        
        # 権限チェック（店舗管理者のみ）
        if not hasattr(request.user, 'managed_stores') or not request.user.managed_stores.filter(id=store_id).exists():
            return Response(
                {'error': '権限がありません'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if request.method == 'POST':
            # 自動チャージ設定作成
            serializer = AutoChargeSetupSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            auto_charge_rule = deposit_service.setup_auto_charge(
                store=store,
                **serializer.validated_data
            )
            
            response_serializer = DepositAutoChargeRuleSerializer(auto_charge_rule)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        elif request.method == 'GET':
            # 自動チャージ設定取得
            try:
                auto_charge_rule = store.auto_charge_rule
                serializer = DepositAutoChargeRuleSerializer(auto_charge_rule)
                return Response(serializer.data)
            except DepositAutoChargeRule.DoesNotExist:
                return Response({'error': '自動チャージ設定が見つかりません'}, status=status.HTTP_404_NOT_FOUND)
        
        elif request.method == 'PUT':
            # 自動チャージ設定更新
            try:
                auto_charge_rule = store.auto_charge_rule
            except DepositAutoChargeRule.DoesNotExist:
                return Response({'error': '自動チャージ設定が見つかりません'}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = AutoChargeSetupSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            updated_rule = deposit_service.setup_auto_charge(
                store=store,
                **serializer.validated_data
            )
            
            response_serializer = DepositAutoChargeRuleSerializer(updated_rule)
            return Response(response_serializer.data)
        
        elif request.method == 'DELETE':
            # 自動チャージ設定無効化
            try:
                auto_charge_rule = store.auto_charge_rule
                auto_charge_rule.is_enabled = False
                auto_charge_rule.save()
                return Response({'message': '自動チャージを無効にしました'})
            except DepositAutoChargeRule.DoesNotExist:
                return Response({'error': '自動チャージ設定が見つかりません'}, status=status.HTTP_404_NOT_FOUND)
        
    except ValidationError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Failed to manage auto charge: {str(e)}")
        return Response(
            {'error': '自動チャージ設定の処理に失敗しました'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_usage_logs(request, store_id):
    """デポジット使用履歴取得"""
    try:
        store = get_object_or_404(Store, id=store_id)
        
        # 権限チェック（店舗管理者のみ）
        if not hasattr(request.user, 'managed_stores') or not request.user.managed_stores.filter(id=store_id).exists():
            return Response(
                {'error': '権限がありません'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # ページネーション対応
        page = int(request.GET.get('page', 1))
        limit = min(int(request.GET.get('limit', 20)), 100)
        offset = (page - 1) * limit
        
        # フィルタリング対応
        used_for = request.GET.get('used_for')
        
        queryset = DepositUsageLog.objects.filter(store=store)
        if used_for:
            queryset = queryset.filter(used_for=used_for)
        
        usage_logs = queryset.order_by('-created_at')[offset:offset + limit]
        
        serializer = DepositUsageLogSerializer(usage_logs, many=True)
        return Response({
            'usage_logs': serializer.data,
            'page': page,
            'limit': limit,
            'has_more': len(usage_logs) == limit
        })
        
    except Exception as e:
        logger.error(f"Failed to get usage logs: {str(e)}")
        return Response(
            {'error': '使用履歴取得に失敗しました'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )