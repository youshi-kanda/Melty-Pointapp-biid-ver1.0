import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Shield, Mail, Lock, Eye, EyeOff, AlertTriangle, Users, BarChart3, Database, Activity, Sparkles } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('adminpass123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      setIsLoading(false);
      return;
    }

    // 開発時はダッシュボードに直接遷移
    console.log('ログイン試行:', { email, password });
    
    // 実際のAPI認証処理はここに追加
    // const response = await fetch('/api/auth/login/admin/', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    
    // シミュレート遅延
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 開発環境では認証成功としてダッシュボードに遷移
    if (email && password) {
      router.push('/admin');
    } else {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>管理者ログイン - Melty+ 管理画面</title>
        <meta name="description" content="Melty+ 管理画面 - システム管理者ログイン" />
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* 背景 */}
        <div className="absolute inset-0 bg-white"></div>

        {/* メインコンテンツ */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* 左側: 説明セクション */}
              <div className="text-center lg:text-left">
                {/* ロゴアイコン */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700 rounded-2xl shadow-lg mb-6 transform hover:scale-105 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-white" />
                </div>

                {/* タイトル */}
                <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                  <span className="text-slate-800">Melty+ 管理画面</span>
                  <br />
                  <span className="text-slate-600">Admin Dashboard</span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  システム全体を統括し、<br />
                  効率的な運営管理を実現します
                </p>

                {/* 機能一覧 */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-slate-700 font-medium">ユーザー・店舗管理</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-slate-700 font-medium">詳細分析・レポート</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Database className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="text-slate-700 font-medium">システム監視・制御</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-slate-700 font-medium">リアルタイム監視</span>
                  </div>
                </div>
              </div>

              {/* 右側: ログインフォーム */}
              <div className="w-full max-w-md mx-auto lg:mx-0">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                  
                  {/* 警告バナー */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                    <div className="flex items-center space-x-2 text-blue-700 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>管理者専用エリア - 認証が必要です</span>
                    </div>
                  </div>

                  {/* エラーメッセージ */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* ログインフォーム */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* メールアドレス */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        管理者メールアドレス
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-slate-900 placeholder-slate-500"
                          placeholder="admin@example.com"
                          required
                        />
                      </div>
                    </div>

                    {/* パスワード */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        管理者パスワード
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-slate-900 placeholder-slate-500"
                          placeholder="管理者パスワードを入力"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* ログインボタン */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <span>{isLoading ? 'ログイン中...' : '管理パネルにアクセス'}</span>
                      </div>
                    </button>
                  </form>

                  {/* パスワードリセットリンク */}
                  <div className="mt-6 space-y-3">
                    <div className="text-center">
                      <a 
                        className="text-sm text-indigo-600 hover:text-indigo-800" 
                        href="/auth/password-reset"
                      >
                        パスワードを忘れた方
                      </a>
                    </div>
                  </div>

                  {/* デモアカウント情報 */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-1 text-slate-500" />
                      デモアカウント
                    </h3>
                    <div className="text-xs text-slate-600 space-y-1">
                      <p><strong>メール:</strong> admin@example.com</p>
                      <p><strong>パスワード:</strong> adminpass123</p>
                      <p><strong>権限:</strong> 全システム管理者</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
