import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: API連携
      console.log('Login attempt:', { email })
      
      // 開発環境: ログイン成功後にマップ画面へ遷移
      setTimeout(() => {
        router.push('/user/map')
      }, 500)
    } catch (err) {
      setError('ログインに失敗しました')
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

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* ロゴ */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-cutie font-bold bg-gradient-to-r from-primary-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Melty+
            </h1>
            <p className="text-gray-600 font-soft text-sm">メルティプラス</p>
          </div>

          {/* ログインカード */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-soft p-8 border border-primary-200/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              ログイン
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* メールアドレス */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="example@email.com"
                />
              </div>

              {/* パスワード */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              {/* ログインボタン */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-primary-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-pop"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    ログイン中...
                  </span>
                ) : (
                  'ログイン'
                )}
              </button>
            </form>

            {/* フッターリンク */}
            <div className="mt-6 text-center space-y-2">
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700 block">
                パスワードを忘れた方
              </a>
              <div className="text-sm text-gray-600">
                アカウントをお持ちでない方は{' '}
                <Link href="/user/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  新規登録
                </Link>
              </div>
            </div>
          </div>

          {/* バージョン情報 */}
          <div className="mt-6 text-center text-xs text-gray-500">
            © 2025 Melty+ All rights reserved.
          </div>
        </div>
      </div>
    </>
  )
}
