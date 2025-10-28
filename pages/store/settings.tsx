import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { Settings as SettingsIcon, Bell, CreditCard, Receipt, Shield, Lock, Save } from 'lucide-react';

export default function StoreSettings() {
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <>
      <Head>
        <title>設定 - Melty+ 店舗管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar currentPage="settings" />

        <main className="flex-1 lg:ml-64">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                設定
              </h1>
              <p className="text-sm text-gray-600 mt-1">システム設定を管理します</p>
            </div>
          </header>

          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* タブヘッダー */}
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {[
                    { id: 'notifications', label: '通知設定', icon: Bell },
                    { id: 'payment', label: '決済設定', icon: CreditCard },
                    { id: 'receipt', label: 'レシート設定', icon: Receipt },
                    { id: 'security', label: 'セキュリティ', icon: Shield },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Icon size={18} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* タブコンテンツ */}
              <div className="p-6">
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">通知設定</h3>
                      <div className="space-y-4">
                        {[
                          { label: '新規取引通知', description: '新しい取引が発生した時に通知' },
                          { label: '返金リクエスト通知', description: '返金リクエストがあった時に通知' },
                          { label: '日次レポート', description: '毎日の売上レポートをメールで受信' },
                          { label: 'システムアラート', description: '重要なシステム通知を受信' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'payment' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">決済設定</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            支払方法
                          </label>
                          <div className="space-y-2">
                            {['クレジットカード', 'PayPay', '現金', 'ポイント'].map((method) => (
                              <label key={method} className="flex items-center gap-3">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                                <span className="text-gray-700">{method}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            最小決済金額
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              defaultValue="100"
                              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="text-gray-600">円</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'receipt' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">レシート設定</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            レシート形式
                          </label>
                          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                            <option>標準形式</option>
                            <option>簡易形式</option>
                            <option>詳細形式</option>
                          </select>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            自動印刷
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3">
                              <input type="radio" name="print" defaultChecked className="w-4 h-4 text-purple-600" />
                              <span className="text-gray-700">常に印刷</span>
                            </label>
                            <label className="flex items-center gap-3">
                              <input type="radio" name="print" className="w-4 h-4 text-purple-600" />
                              <span className="text-gray-700">確認してから印刷</span>
                            </label>
                            <label className="flex items-center gap-3">
                              <input type="radio" name="print" className="w-4 h-4 text-purple-600" />
                              <span className="text-gray-700">印刷しない</span>
                            </label>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <label className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                            <div>
                              <p className="font-medium text-gray-900">QRコード表示</p>
                              <p className="text-sm text-gray-600">レシートにQRコードを表示</p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">セキュリティ設定</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Lock size={18} />
                            パスワード変更
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm text-gray-700 mb-1">現在のパスワード</label>
                              <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-700 mb-1">新しいパスワード</label>
                              <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-700 mb-1">新しいパスワード（確認）</label>
                              <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700">
                              パスワード変更
                            </button>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <label className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                            <div>
                              <p className="font-medium text-gray-900">2段階認証</p>
                              <p className="text-sm text-gray-600">ログイン時に追加の認証を要求</p>
                            </div>
                          </label>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <label className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                            <div>
                              <p className="font-medium text-gray-900">自動ログアウト</p>
                              <p className="text-sm text-gray-600">15分間操作がない場合に自動ログアウト</p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 保存ボタン */}
                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 shadow-lg">
                    <Save size={18} />
                    変更を保存
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
