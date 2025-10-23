import { useState } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/Sidebar';
import { 
  Settings as SettingsIcon,
  Shield,
  CreditCard,
  Bell,
  Code,
  Save
} from 'lucide-react';

type SettingsTab = 'basic' | 'security' | 'payment' | 'notification' | 'api';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('basic');

  const tabs = [
    { id: 'basic' as SettingsTab, label: '基本設定', icon: SettingsIcon },
    { id: 'security' as SettingsTab, label: 'セキュリティ', icon: Shield },
    { id: 'payment' as SettingsTab, label: '支払い', icon: CreditCard },
    { id: 'notification' as SettingsTab, label: '通知', icon: Bell },
    { id: 'api' as SettingsTab, label: 'API', icon: Code }
  ];

  return (
    <>
      <Head>
        <title>システム設定 - BIID 管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar currentPage="settings" />

        <main className="flex-1 lg:ml-64">
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">システム設定</h1>
              <p className="text-gray-600 text-sm mt-1">システム全体の設定管理</p>
            </div>
          </header>

          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* タブナビゲーション */}
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-purple-600 text-purple-600 bg-purple-50'
                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* タブコンテンツ */}
              <div className="p-6">
                {/* 基本設定 */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        システム名
                      </label>
                      <input
                        type="text"
                        defaultValue="BIID"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        サービスURL
                      </label>
                      <input
                        type="text"
                        defaultValue="https://biid.example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        メンテナンスモード
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" />
                        <span className="text-gray-700">メンテナンスモードを有効にする</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* セキュリティ */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        パスワード最小文字数
                      </label>
                      <input
                        type="number"
                        defaultValue="8"
                        min="6"
                        max="20"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        セッションタイムアウト（分）
                      </label>
                      <input
                        type="number"
                        defaultValue="30"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-600 rounded" />
                        <span className="text-gray-700">二段階認証を必須にする</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-600 rounded" />
                        <span className="text-gray-700">ログイン試行回数制限</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" />
                        <span className="text-gray-700">IP制限を有効にする</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 支払い設定 */}
                {activeTab === 'payment' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        デフォルトポイント還元率（%）
                      </label>
                      <input
                        type="number"
                        defaultValue="5"
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最小取引金額（円）
                      </label>
                      <input
                        type="number"
                        defaultValue="100"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        返金可能期間（日）
                      </label>
                      <input
                        type="number"
                        defaultValue="7"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* 通知設定 */}
                {activeTab === 'notification' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-600 rounded" />
                        <span className="text-gray-700">新規ユーザー登録通知</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-600 rounded" />
                        <span className="text-gray-700">店舗承認リクエスト通知</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-600 rounded" />
                        <span className="text-gray-700">返金リクエスト通知</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" />
                        <span className="text-gray-700">システムエラー通知</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        通知先メールアドレス
                      </label>
                      <input
                        type="email"
                        defaultValue="admin@biid.example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* API設定 */}
                {activeTab === 'api' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        APIキー
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value="sk_live_••••••••••••••••"
                          readOnly
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                          再生成
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API呼び出し制限（回/分）
                      </label>
                      <input
                        type="number"
                        defaultValue="100"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-600 rounded" />
                        <span className="text-gray-700">API ログを記録する</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-600 rounded" />
                        <span className="text-gray-700">CORS を有効にする</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 保存ボタン */}
                <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
                  <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    <Save size={20} />
                    設定を保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
