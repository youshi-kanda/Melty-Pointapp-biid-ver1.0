import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/Sidebar';
import { 
  Settings as SettingsIcon,
  Shield,
  CreditCard,
  Bell,
  Code,
  Save,
  Menu,
  User,
  LogOut,
  Zap,
  Users
} from 'lucide-react';

type SettingsTab = 'general' | 'payment' | 'notification' | 'points' | 'rank';

export default function SystemSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  return (
    <>
      <Head>
        <title>システム設定 - BIID Admin</title>
      </Head>

      <div className="flex min-h-screen bg-white">
        <AdminSidebar currentPage="settings" />

        <main className="flex-1 md:ml-64">
          {/* トップバー */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 h-14 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center justify-between">
              <button className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg">
                <Menu size={20} />
              </button>
              
              <h1 className="text-lg font-semibold text-slate-900">システム設定</h1>
              
              <div className="flex items-center gap-3">
                <button className="p-1.5 hover:bg-slate-100 rounded-lg relative">
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                      <User size={16} className="text-slate-600" />
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-slate-900">運営</div>
                      <div className="text-xs text-slate-500">admin@example.com</div>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                      <button 
                        onClick={() => router.push('/admin/login')}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        ログアウト
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ヘッダー */}
          <div className="bg-white border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-slate-900">システム設定</h1>
                <p className="text-sm text-slate-600 mt-0.5">基本設定・セキュリティ・API管理</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  disabled={!hasChanges}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <Save size={16} />
                  <span className="text-sm font-medium">設定を保存</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* サイドバーナビゲーション */}
              <div className="lg:col-span-1">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-colors text-sm ${
                      activeTab === 'general'
                        ? 'bg-slate-600 text-white border-r-4 border-slate-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <SettingsIcon size={18} className={activeTab === 'general' ? 'text-slate-300' : 'text-gray-400'} />
                    <span className="font-medium">一般設定</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-colors text-sm ${
                      activeTab === 'payment'
                        ? 'bg-slate-600 text-white border-r-4 border-slate-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <CreditCard size={18} className={activeTab === 'payment' ? 'text-slate-300' : 'text-gray-400'} />
                    <span className="font-medium">決済設定</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('notification')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-colors text-sm ${
                      activeTab === 'notification'
                        ? 'bg-slate-600 text-white border-r-4 border-slate-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Bell size={18} className={activeTab === 'notification' ? 'text-slate-300' : 'text-gray-400'} />
                    <span className="font-medium">通知設定</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('points')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-colors text-sm ${
                      activeTab === 'points'
                        ? 'bg-slate-600 text-white border-r-4 border-slate-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Zap size={18} className={activeTab === 'points' ? 'text-slate-300' : 'text-gray-400'} />
                    <span className="font-medium">運営設定</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('rank')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-colors text-sm ${
                      activeTab === 'rank'
                        ? 'bg-slate-600 text-white border-r-4 border-slate-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Users size={18} className={activeTab === 'rank' ? 'text-slate-300' : 'text-gray-400'} />
                    <span className="font-medium">会員ランク</span>
                  </button>
                </nav>
              </div>

              {/* メインコンテンツ */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  {/* 一般設定 */}
                  {activeTab === 'general' && (
                    <div className="space-y-4">
                      <h2 className="text-base font-semibold text-gray-900">一般設定</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            サイト名
                          </label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                            defaultValue="biid Point Management"
                            onChange={() => setHasChanges(true)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            サポートメール
                          </label>
                          <input
                            type="email"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                            defaultValue="support@biid.com"
                            onChange={() => setHasChanges(true)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            サポート電話
                          </label>
                          <input
                            type="tel"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                            defaultValue="03-1234-5678"
                            onChange={() => setHasChanges(true)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            タイムゾーン
                          </label>
                          <select 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                            onChange={() => setHasChanges(true)}
                          >
                            <option value="Asia/Tokyo">Asia/Tokyo</option>
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">America/New_York</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            運営エリア
                          </label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                            placeholder="運営対象エリアを入力"
                            defaultValue="大阪（北新地・ミナミエリア）"
                            onChange={() => setHasChanges(true)}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            サイト説明
                          </label>
                          <textarea
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                            defaultValue="革新的なポイント管理システム"
                            onChange={() => setHasChanges(true)}
                          />
                        </div>

                        <div className="md:col-span-2 flex items-center gap-6">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              className="mr-2"
                              onChange={() => setHasChanges(true)}
                            />
                            メンテナンスモード
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              className="mr-2"
                              onChange={() => setHasChanges(true)}
                            />
                            デバッグモード
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 決済設定 */}
                  {activeTab === 'payment' && (
                    <div className="space-y-4">
                      <h2 className="text-base font-semibold text-gray-900">決済設定</h2>
                      <p className="text-sm text-gray-600">決済関連の設定を管理します</p>
                    </div>
                  )}

                  {/* 通知設定 */}
                  {activeTab === 'notification' && (
                    <div className="space-y-4">
                      <h2 className="text-base font-semibold text-gray-900">通知設定</h2>
                      <p className="text-sm text-gray-600">システム通知の設定を管理します</p>
                    </div>
                  )}

                  {/* 運営設定 */}
                  {activeTab === 'points' && (
                    <div className="space-y-4">
                      <h2 className="text-base font-semibold text-gray-900">運営設定</h2>
                      <p className="text-sm text-gray-600">ポイント運営に関する設定を管理します</p>
                    </div>
                  )}

                  {/* 会員ランク */}
                  {activeTab === 'rank' && (
                    <div className="space-y-4">
                      <h2 className="text-base font-semibold text-gray-900">会員ランク設定</h2>
                      <p className="text-sm text-gray-600">会員ランクシステムの設定を管理します</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
