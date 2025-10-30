import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Store, Eye, EyeOff } from 'lucide-react';

export default function TerminalLogin() {
  const router = useRouter();
  const [terminalId, setTerminalId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // デモ用: 認証後にメイン画面へ
    // 静的エクスポートでは直接リダイレクト
    console.log('ログインボタンがクリックされました'); // デバッグ用
    window.location.href = '/terminal/';
  };

  return (
    <>
      <Head>
        <title>決済端末ログイン - Melty+ Terminal</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8">
          {/* ロゴ */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full mb-3 sm:mb-4">
              <Store size={32} className="sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Melty+ Terminal</h1>
            <p className="text-sm sm:text-base text-gray-600">決済端末システム</p>
          </div>

          {/* ログインフォーム */}
          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                端末ID
              </label>
              <input
                type="text"
                value={terminalId}
                onChange={(e) => setTerminalId(e.target.value)}
                placeholder="TERMINAL-001"
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 -m-2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 sm:py-4 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold text-base sm:text-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl active:scale-95 min-h-[48px]"
            >
              ログイン
            </button>
          </form>

          {/* デモ情報 */}
          <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">デモアカウント</p>
            <p className="text-xs text-blue-700">端末ID: TERMINAL-001</p>
            <p className="text-xs text-blue-700">パスワード: terminal123</p>
          </div>
        </div>
      </div>
    </>
  );
}
