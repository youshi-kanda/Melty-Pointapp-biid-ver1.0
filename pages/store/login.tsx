import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Store, Eye, EyeOff } from 'lucide-react';

export default function StoreLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    // 開発時はダッシュボードに直接遷移
    console.log('店舗ログイン試行:', { email, password });
    
    // 実際のAPI認証処理はここに追加
    if (email && password) {
      router.push('/store');
    }
  };

  return (
    <>
      <Head>
        <title>店舗管理者ログイン - Melty+</title>
      </Head>

      <div className="min-h-screen flex bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        {/* 左側 - ブランディングエリア */}
        <div className="hidden lg:flex lg:w-1/2 p-12 items-center justify-center">
          <div className="max-w-md">
            {/* アイコン */}
            <div className="mb-8 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-xl">
                <Store size={48} className="text-white" />
              </div>
            </div>

            {/* タイトル */}
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Melty+
              </span>
              {' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                店舗管理
              </span>
            </h1>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Management
            </h2>

            {/* 特徴リスト */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
                <span className="text-lg">革新的なポイント管理システムで、</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500"></div>
                <span className="text-lg">高速決済処理</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
                <span className="text-lg">セキュアな認証システム</span>
              </div>
            </div>

            <p className="text-gray-600 mt-8 text-sm leading-relaxed">
              お客様との絆を深める体験を提供します
            </p>
          </div>
        </div>

        {/* 右側 - ログインフォーム */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              {/* モバイル用アイコン */}
              <div className="lg:hidden mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 flex items-center justify-center">
                  <Store size={32} className="text-white" />
                </div>
              </div>

              {/* ヘッダー */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">店舗管理者ログイン</h2>
                <p className="text-gray-600 text-sm">アカウント情報を入力してください</p>
              </div>

              {/* エラーメッセージ */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* ログインフォーム */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    店舗管理者メールアドレス
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="store@example.com"
                      required
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    パスワード
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pl-10 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl"
                >
                  店舗管理システムにログイン
                </button>
              </form>

              {/* フッターリンク */}
              <div className="mt-6 text-center space-y-2">
                <button className="text-sm text-purple-600 hover:text-purple-700 transition-colors">
                  パスワードを忘れた場合
                </button>
                <div className="text-sm text-gray-600">
                  新規店舗登録は{' '}
                  <button className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                    こちら
                  </button>
                </div>
              </div>

              {/* デモアカウント */}
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 font-medium mb-1">⚡ デモアカウント</p>
                <p className="text-xs text-gray-600">メール: store@example.com</p>
                <p className="text-xs text-gray-600">パスワード: storepass123</p>
                <p className="text-xs text-gray-500 mt-1">店舗: Melty+ 店舗管理 サンプル店舗</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
