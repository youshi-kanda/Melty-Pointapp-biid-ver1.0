import { useState, useEffect } from 'react';
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
  Users,
  CheckCircle,
  AlertTriangle,
  Lock
} from 'lucide-react';

type SettingsTab = 'general' | 'security' | 'payment' | 'notification' | 'points' | 'rank';

export default function SystemSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Security / 2FA State
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [passwordForDisable, setPasswordForDisable] = useState('');
  const [securityMessage, setSecurityMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Check 2FA status on load
    check2FAStatus();
  }, []);

  const check2FAStatus = async () => {
    try {
      const res = await fetch('/api/auth/two-factor/status/');
      const data = await res.json();
      if (data.success) {
        setIs2FAEnabled(data.data.is_enabled);
      }
    } catch (e) {
      console.error('Failed to check 2FA status', e);
    }
  };

  const handleStart2FASetup = async () => {
    try {
      const res = await fetch('/api/auth/two-factor/email-setup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setShow2FASetup(true);
        setSecurityMessage({ type: 'success', text: '認証コードをメールで送信しました' });
      } else {
        setSecurityMessage({ type: 'error', text: data.error || '送信に失敗しました' });
      }
    } catch (e) {
      setSecurityMessage({ type: 'error', text: '通信エラーが発生しました' });
    }
  };

  const handleVerify2FASetup = async () => {
    try {
      const res = await fetch('/api/auth/two-factor/email-setup/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode })
      });
      const data = await res.json();
      if (data.success) {
        setIs2FAEnabled(true);
        setShow2FASetup(false);
        setVerificationCode('');
        setSecurityMessage({ type: 'success', text: '2FAが有効化されました' });
      } else {
        setSecurityMessage({ type: 'error', text: data.error || '認証に失敗しました' });
      }
    } catch (e) {
      setSecurityMessage({ type: 'error', text: '通信エラーが発生しました' });
    }
  };

  const handleDisable2FA = async () => {
    if (!passwordForDisable) {
      setSecurityMessage({ type: 'error', text: 'パスワードを入力してください' });
      return;
    }

    try {
      const res = await fetch('/api/auth/two-factor/disable/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordForDisable })
      });
      const data = await res.json();
      if (data.success) {
        setIs2FAEnabled(false);
        setPasswordForDisable('');
        setSecurityMessage({ type: 'success', text: '2FAが無効化されました' });
      } else {
        setSecurityMessage({ type: 'error', text: data.error || '無効化に失敗しました' });
      }
    } catch (e) {
      setSecurityMessage({ type: 'error', text: '通信エラーが発生しました' });
    }
  };

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
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-colors text-sm ${activeTab === 'general'
                        ? 'bg-slate-600 text-white border-r-4 border-slate-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <SettingsIcon size={18} className={activeTab === 'general' ? 'text-slate-300' : 'text-gray-400'} />
                    <span className="font-medium">一般設定</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-colors text-sm ${activeTab === 'security'
                        ? 'bg-slate-600 text-white border-r-4 border-slate-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Shield size={18} className={activeTab === 'security' ? 'text-slate-300' : 'text-gray-400'} />
                    <span className="font-medium">セキュリティ</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-colors text-sm ${activeTab === 'payment'
                        ? 'bg-slate-600 text-white border-r-4 border-slate-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <CreditCard size={18} className={activeTab === 'payment' ? 'text-slate-300' : 'text-gray-400'} />
                    <span className="font-medium">決済設定</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('notification')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-colors text-sm ${activeTab === 'notification'
                        ? 'bg-slate-600 text-white border-r-4 border-slate-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Bell size={18} className={activeTab === 'notification' ? 'text-slate-300' : 'text-gray-400'} />
                    <span className="font-medium">通知設定</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('points')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-colors text-sm ${activeTab === 'points'
                        ? 'bg-slate-600 text-white border-r-4 border-slate-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Zap size={18} className={activeTab === 'points' ? 'text-slate-300' : 'text-gray-400'} />
                    <span className="font-medium">運営設定</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('rank')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-colors text-sm ${activeTab === 'rank'
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

                  {/* セキュリティ設定 */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <h2 className="text-base font-semibold text-gray-900 border-b pb-2">セキュリティ設定</h2>

                      {securityMessage && (
                        <div className={`p-3 rounded-lg flex items-center text-sm ${securityMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                          {securityMessage.type === 'success' ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertTriangle className="w-4 h-4 mr-2" />}
                          {securityMessage.text}
                        </div>
                      )}

                      {/* 2FA Section */}
                      <div className="border border-slate-200 rounded-lg p-5 bg-slate-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
                              <Shield size={20} className="text-indigo-600" />
                              二要素認証 (2FA)
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              ログイン時にメールに送信される認証コードの入力を必須にします。
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${is2FAEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                              {is2FAEnabled ? '有効' : '無効'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6">
                          {is2FAEnabled ? (
                            <div className="space-y-4">
                              <div className="bg-white p-4 rounded-md border border-gray-200">
                                <p className="text-sm text-gray-700 mb-3">2FAを無効化するにはパスワードを入力してください:</p>
                                <div className="flex gap-2">
                                  <input
                                    type="password"
                                    placeholder="パスワード"
                                    value={passwordForDisable}
                                    onChange={(e) => setPasswordForDisable(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  />
                                  <button
                                    onClick={handleDisable2FA}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
                                  >
                                    無効にする
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              {!show2FASetup ? (
                                <button
                                  onClick={handleStart2FASetup}
                                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                  <Shield size={16} />
                                  2FAを有効にする
                                </button>
                              ) : (
                                <div className="bg-white p-4 rounded-md border border-gray-200 space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      認証コードを入力
                                    </label>
                                    <p className="text-xs text-gray-500 mb-2">
                                      登録メールアドレスに送信された6桁のコードを入力してください。
                                    </p>
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        maxLength={6}
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-center tracking-widest font-mono"
                                        placeholder="000000"
                                      />
                                      <button
                                        onClick={handleVerify2FASetup}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                                      >
                                        認証して有効化
                                      </button>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => setShow2FASetup(false)}
                                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                                  >
                                    キャンセル
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Password Change placeholder */}
                      <div className="border border-slate-200 rounded-lg p-5 bg-white">
                        <h3 className="text-base font-medium text-gray-900 flex items-center gap-2 mb-4">
                          <Lock size={20} className="text-gray-500" />
                          パスワード変更
                        </h3>
                        <div className="grid gap-3 max-w-md">
                          <input type="password" placeholder="現在のパスワード" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                          <input type="password" placeholder="新しいパスワード" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                          <input type="password" placeholder="新しいパスワード（確認）" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                          <button className="bg-slate-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-600 w-fit">
                            パスワード更新
                          </button>
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
