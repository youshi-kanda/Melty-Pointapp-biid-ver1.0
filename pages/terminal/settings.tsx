import { useState } from 'react';
import { useRouter } from 'next/router';
import TerminalHead from '@/components/terminal/TerminalHead';
import { 
  ArrowLeft, 
  Monitor, 
  LogOut, 
  Info,
  Store,
  AlertCircle,
  History,
  HelpCircle
} from 'lucide-react';

export default function TerminalSettings() {
  const router = useRouter();
  
  // 端末情報
  const terminalInfo = {
    terminalId: 'TERM-001',
    storeName: '渋谷店',
    storeId: 'STORE-001',
    version: 'v1.0.0',
    lastSync: '2024/10/24 14:30'
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleBack = () => {
    router.push('/terminal/');
  };

  const handleLogout = () => {
    // TODO: ログアウト処理
    router.push('/terminal/login');
  };

  return (
    <>
      <TerminalHead title="端末情報 - Melty+ Terminal" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="text-sm">戻る</span>
              </button>
              <h1 className="text-lg sm:text-xl font-bold">端末情報・設定</h1>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          
          {/* 端末情報 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Monitor className="text-blue-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">端末情報</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">端末ID</span>
                <span className="font-mono font-bold text-gray-900">{terminalInfo.terminalId}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">店舗名</span>
                <span className="font-medium text-gray-900">{terminalInfo.storeName}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">店舗ID</span>
                <span className="font-mono font-medium text-gray-900">{terminalInfo.storeId}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">バージョン</span>
                <span className="font-medium text-gray-900">{terminalInfo.version}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">最終同期</span>
                <span className="text-sm text-gray-500">{terminalInfo.lastSync}</span>
              </div>
            </div>
          </div>

          {/* クイックアクション */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <History className="text-purple-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">クイックアクション</h2>
            </div>
            
            <div className="space-y-3">
              {/* 取引履歴 */}
              <button
                onClick={() => router.push('/terminal/transaction-history')}
                className="w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-gray-900 font-medium py-4 px-6 rounded-xl border border-blue-200 transition-all shadow-sm hover:shadow flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <History className="text-blue-600" size={20} />
                  <span>取引履歴を見る</span>
                </div>
                <ArrowLeft className="rotate-180 text-gray-400" size={18} />
              </button>

              {/* ヘルプ・サポート */}
              <button
                onClick={() => alert('サポートセンター: 0120-XXX-XXX\n営業時間: 9:00-18:00')}
                className="w-full bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-gray-900 font-medium py-4 px-6 rounded-xl border border-green-200 transition-all shadow-sm hover:shadow flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="text-green-600" size={20} />
                  <span>ヘルプ・サポート</span>
                </div>
                <ArrowLeft className="rotate-180 text-gray-400" size={18} />
              </button>
            </div>
          </div>

          {/* システム情報 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Info className="text-gray-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">システム情報</h2>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">稼働状態</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">正常</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">接続状態</span>
                <span className="text-green-600 font-medium">オンライン</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">自動ログアウト</span>
                <span className="text-gray-900 font-medium">30分後</span>
              </div>
            </div>
          </div>

          {/* ログアウト */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            <span>ログアウト</span>
          </button>

          {/* バージョン情報 */}
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 font-medium">Melty+ Terminal {terminalInfo.version}</p>
            <p className="text-xs text-gray-500 mt-1">© 2024 Melty+ All rights reserved.</p>
          </div>
        </div>

        {/* ログアウト確認モーダル */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <LogOut className="text-red-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">ログアウトしますか？</h2>
                <p className="text-sm text-gray-600">
                  ログアウトすると、再度ログインが必要になります。
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
