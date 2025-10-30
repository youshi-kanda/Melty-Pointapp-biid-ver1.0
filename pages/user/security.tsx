import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Lock, Eye, EyeOff, User, Heart, CheckCircle, Info, Home, Cherry, MapPin } from 'lucide-react'

export default function SecurityPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: パスワード変更API連携
    console.log('パスワード変更')
  }

  return (
    <>
      <Head>
        <title>Melty+ (メルティプラス) - セキュリティ設定</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Nunito:wght@300;400;500;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Great+Vibes&family=Satisfy&family=Fredoka+One&family=Bungee&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <div className="min-h-screen bg-white">
        {/* ヘッダー */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* デスクトップヘッダー */}
            <div className="hidden md:flex items-center justify-between py-4">
              {/* 左側: ユーザー情報 */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold">
                    U
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">ユーザー太郎</div>
                    <div className="text-xs text-gray-500">ID: U12345</div>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">大阪府</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-xl shadow-sm">
                  <Heart className="w-4 h-4" fill="currentColor" />
                  <span className="font-bold text-sm">48,800</span>
                  <span className="text-xs">pt</span>
                </div>
              </div>

              {/* 中央: ホームボタン + ロゴ */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/user')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <Home className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Home</span>
                </button>
                <div className="text-center">
                  <div className="flex items-center space-x-2">
                    <Cherry className="w-8 h-8 text-pink-500" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                      biid Store
                    </h1>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Security</p>
                </div>
              </div>

              {/* 右側: アイコンボタン */}
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Heart className="w-5 h-5 text-pink-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <User className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* モバイルヘッダー */}
            <div className="flex md:hidden items-center justify-between py-3">
              {/* 左側: ユーザー情報（簡略版） */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-sm font-bold">
                    U
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">ユーザー太郎</div>
                    <div className="text-xs text-gray-500">ID: U12345</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1.5 rounded-lg shadow-sm">
                  <Heart className="w-3 h-3" fill="currentColor" />
                  <span className="font-bold text-xs">48,800pt</span>
                </div>
              </div>

              {/* 右側: ホームボタン + ロゴ */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push('/user')}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Home className="w-4 h-4 text-gray-600" />
                </button>
                <div className="flex items-center space-x-1">
                  <Cherry className="w-6 h-6 text-pink-500" />
                  <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                    biid
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          {/* パスワード変更カード */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">パスワード変更</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* 現在のパスワード */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  現在のパスワード
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="現在のパスワードを入力"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 新しいパスワード */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新しいパスワード
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="新しいパスワードを入力"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* パスワード確認 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード確認
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="新しいパスワードを再入力"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm"
              >
                パスワードを変更
              </button>
            </form>
          </div>

          {/* アカウント情報カード */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">アカウント情報</h2>
            </div>

            <div className="space-y-3">
              {/* ユーザー名 */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-0.5">ユーザー名</div>
                  <div className="font-medium text-gray-900">ユーザー太郎</div>
                </div>
              </div>

              {/* メールアドレス */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-0.5">メールアドレス</div>
                  <div className="font-medium text-gray-900">user@example.com</div>
                </div>
              </div>

              {/* アカウントステータス */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-0.5">ステータス</div>
                  <div className="font-medium text-green-600">アクティブ</div>
                </div>
              </div>
            </div>
          </div>

          {/* セキュリティのヒントカード */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-blue-900">セキュリティのヒント</h2>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-900">強力なパスワードを使用し、定期的に変更してください</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-900">不審なアクティビティがあれば、すぐにパスワードを変更してください</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-900">公共のWi-Fiでは機密情報にアクセスしないでください</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-900">信頼できるデバイスのみでログインしてください</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-900">ログイン後は必ずログアウトしてください</span>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </>
  )
}
