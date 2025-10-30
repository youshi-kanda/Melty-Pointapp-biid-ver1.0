import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Mail, Lock, Eye, EyeOff, Cherry } from 'lucide-react'
import { getApiUrl } from '@/lib/api-config'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('user@example.com')
  const [password, setPassword] = useState('userpass123')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${getApiUrl()}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.access) {
        // JWTトークンを保存
        localStorage.setItem('auth_token', data.access)
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh)
        }

        // ユーザー情報を保存
        if (data.user) {
          localStorage.setItem('user_info', JSON.stringify(data.user))
        }

        // ダッシュボードへリダイレクト
        router.push('/user')
      } else {
        setError(data.error || 'ログインに失敗しました。メールアドレスとパスワードを確認してください。')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('ログイン中にエラーが発生しました。もう一度お試しください。')
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Melty+ (メルティプラス) - ログイン</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Nunito:wght@300;400;500;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Great+Vibes&family=Satisfy&family=Fredoka+One&family=Bungee&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white">
        {/* アニメーション背景 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-4 md:top-20 md:left-20 w-16 h-16 md:w-20 md:h-20 bg-pink-200 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-48 right-4 md:top-40 md:right-20 w-12 h-12 md:w-16 md:h-16 bg-rose-200 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-32 left-8 md:bottom-20 md:left-20 w-20 h-20 md:w-24 md:h-24 bg-pink-100 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute bottom-48 right-6 md:bottom-40 md:right-10 w-10 h-10 md:w-12 md:h-12 bg-rose-300 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full opacity-10 animate-bounce"></div>
        </div>

        {/* メインコンテンツ */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">
            <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-10 w-full max-w-lg backdrop-blur-sm">
              {/* ロゴ・タイトル */}
              <div className="text-center mb-10">
                <div className="flex items-center justify-center mb-8">
                  <Image
                    src="/melty-logo.jpg"
                    alt="Melty+"
                    width={200}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                  ユーザーログイン
                </h1>
                <p className="text-gray-600 text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>Melty+アプリへようこそ</p>
              </div>

              {/* ログインフォーム */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* エラーメッセージ */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* メールアドレス */}
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    メールアドレス
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      className="w-full pl-12 pr-4 py-4 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300 bg-pink-50/30 text-base"
                      placeholder="your@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* パスワード */}
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    パスワード
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="w-full pl-12 pr-14 py-4 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300 bg-pink-50/30 text-base"
                      placeholder="パスワードを入力"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors"
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
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-4 rounded-2xl hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg text-lg"
                >
                  {isLoading ? 'ログイン中...' : 'ログイン'}
                </button>
              </form>

              {/* フッターリンク */}
              <div className="mt-8 text-center">
                <span className="text-base text-gray-600">新規登録は </span>
                <Link
                  className="text-base text-rose-600 hover:text-rose-800 font-semibold transition-colors"
                  href="/user/register"
                >
                  こちら
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
