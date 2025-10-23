import { useState } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/Sidebar';
import { 
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Users,
  Coins,
  Gift,
  MapPin,
  Link as LinkIcon,
  Shield
} from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  impact: 'high' | 'medium' | 'low';
}

export default function FeaturesManagement() {
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: 'social',
      name: 'ソーシャル機能',
      description: 'ユーザー間の交流、投稿、レビュー機能を提供します',
      icon: Users,
      enabled: true,
      impact: 'high'
    },
    {
      id: 'points',
      name: 'ポイント管理',
      description: 'ポイントの獲得、使用、履歴管理機能を提供します',
      icon: Coins,
      enabled: true,
      impact: 'high'
    },
    {
      id: 'gifts',
      name: 'ギフト交換',
      description: 'ポイントをギフトに交換する機能を提供します',
      icon: Gift,
      enabled: true,
      impact: 'medium'
    },
    {
      id: 'storeLocator',
      name: '店舗ロケーター',
      description: '地図上で周辺店舗を検索・表示する機能を提供します',
      icon: MapPin,
      enabled: true,
      impact: 'medium'
    },
    {
      id: 'meltyIntegration',
      name: 'Melty連携',
      description: 'Meltyサービスとの連携機能を提供します',
      icon: LinkIcon,
      enabled: false,
      impact: 'low'
    },
    {
      id: 'twoFactor',
      name: '二段階認証',
      description: 'セキュリティを強化する二段階認証機能を提供します',
      icon: Shield,
      enabled: true,
      impact: 'high'
    }
  ]);

  const toggleFeature = (id: string) => {
    setFeatures(features.map(feature =>
      feature.id === id ? { ...feature, enabled: !feature.enabled } : feature
    ));
    console.log(`機能切替: ${id}`);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'high': return '影響大';
      case 'medium': return '影響中';
      case 'low': return '影響小';
      default: return '不明';
    }
  };

  return (
    <>
      <Head>
        <title>機能管理 - BIID 管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar currentPage="features" />

        <main className="flex-1 lg:ml-64">
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">機能管理</h1>
              <p className="text-gray-600 text-sm mt-1">システム機能のON/OFF切替</p>
            </div>
          </header>

          <div className="p-6">
            {/* 警告メッセージ */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-yellow-900 font-semibold mb-1">注意</h3>
                <p className="text-yellow-800 text-sm">
                  機能を無効化すると、すべてのユーザーに影響が及びます。重要な機能を無効化する場合は、事前にユーザーへの通知を行ってください。
                </p>
              </div>
            </div>

            {/* 機能一覧 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
                      feature.enabled
                        ? 'border-purple-200 shadow-purple-100'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="p-6">
                      {/* ヘッダー */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-3 rounded-lg ${
                            feature.enabled
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Icon size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{feature.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                          </div>
                        </div>
                      </div>

                      {/* 影響レベル */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getImpactColor(feature.impact)}`}>
                          {getImpactLabel(feature.impact)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          feature.enabled
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {feature.enabled ? '有効' : '無効'}
                        </span>
                      </div>

                      {/* トグルスイッチ */}
                      <button
                        onClick={() => toggleFeature(feature.id)}
                        className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                          feature.enabled
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {feature.enabled ? (
                          <>
                            <ToggleRight size={24} />
                            <span>機能を無効化</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={24} />
                            <span>機能を有効化</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* サマリー */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">機能状態サマリー</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">有効な機能</p>
                  <p className="text-3xl font-bold text-green-700">
                    {features.filter(f => f.enabled).length}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">無効な機能</p>
                  <p className="text-3xl font-bold text-gray-700">
                    {features.filter(f => !f.enabled).length}
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600 mb-1">影響大</p>
                  <p className="text-3xl font-bold text-red-700">
                    {features.filter(f => f.impact === 'high').length}
                  </p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-600 mb-1">影響中</p>
                  <p className="text-3xl font-bold text-yellow-700">
                    {features.filter(f => f.impact === 'medium').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
