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
      case 'high': return 'text-white bg-slate-700';
      case 'medium': return 'text-slate-300 bg-slate-600';
      case 'low': return 'text-slate-400 bg-slate-600';
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
        <title>機能管理 - Melty+ 管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar currentPage="features" />

        <main className="flex-1 md:ml-64">
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 py-3">
              <h1 className="text-lg font-bold text-gray-900">機能管理</h1>
              <p className="text-gray-600 text-sm mt-0.5">システム機能のON/OFF切替</p>
            </div>
          </header>

          <div className="p-4">
            {/* 警告メッセージ */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 flex items-start gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <h3 className="text-yellow-900 font-semibold mb-1 text-sm">注意</h3>
                <p className="text-yellow-800 text-sm">
                  機能を無効化すると、すべてのユーザーに影響が及びます。重要な機能を無効化する場合は、事前にユーザーへの通知を行ってください。
                </p>
              </div>
            </div>

            {/* 機能一覧 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
                      feature.enabled
                        ? 'border-slate-200 shadow-slate-100'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="p-4">
                      {/* ヘッダー */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            feature.enabled
                              ? 'bg-slate-700 text-slate-300'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-gray-900">{feature.name}</h3>
                            <p className="text-sm text-gray-600 mt-0.5">{feature.description}</p>
                          </div>
                        </div>
                      </div>

                      {/* 影響レベル */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(feature.impact)}`}>
                          {getImpactLabel(feature.impact)}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          feature.enabled
                            ? 'bg-slate-700 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {feature.enabled ? '有効' : '無効'}
                        </span>
                      </div>

                      {/* トグルスイッチ */}
                      <button
                        onClick={() => toggleFeature(feature.id)}
                        className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-medium transition-all text-sm ${
                          feature.enabled
                            ? 'bg-slate-700 hover:bg-slate-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {feature.enabled ? (
                          <>
                            <ToggleRight size={20} />
                            <span>機能を無効化</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={20} />
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
            <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-base font-bold text-gray-900 mb-3">機能状態サマリー</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-slate-600 rounded-lg">
                  <p className="text-sm text-slate-300 mb-1">有効な機能</p>
                  <p className="text-2xl font-bold text-white">
                    {features.filter(f => f.enabled).length}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">無効な機能</p>
                  <p className="text-2xl font-bold text-gray-700">
                    {features.filter(f => !f.enabled).length}
                  </p>
                </div>
                <div className="text-center p-3 bg-slate-700 rounded-lg">
                  <p className="text-sm text-white mb-1">影響大</p>
                  <p className="text-2xl font-bold text-slate-200">
                    {features.filter(f => f.impact === 'high').length}
                  </p>
                </div>
                <div className="text-center p-3 bg-slate-600 rounded-lg">
                  <p className="text-sm text-slate-300 mb-1">影響中</p>
                  <p className="text-2xl font-bold text-white">
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
