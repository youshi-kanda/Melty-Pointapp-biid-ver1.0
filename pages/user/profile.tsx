import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit2, 
  Camera, 
  Bell, 
  Settings,
  Star,
  Gift,
  CreditCard,
  TrendingUp
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPoints: 48800,
    monthlyEarned: 2850,
    totalGifts: 12,
    favoriteStores: 5
  })

  useEffect(() => {
    // TODO: API連携
    // if (!AuthService.isAuthenticated()) {
    //   router.push('/login')
    //   return
    // }
    loadUserProfile()
  }, [router])

  const loadUserProfile = async () => {
    try {
      // TODO: API呼び出し
      // const data = await UserAPI.getProfile()
      setUser({
        id: 'USER001',
        firstName: 'ユーザー',
        lastName: 'さん',
        email: 'user@example.com',
        phone: '090-1234-5678',
        address: '東京都渋谷区',
        birthday: '1990-01-01',
        memberSince: '2024-01-01',
        avatar: null
      })
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    // TODO: API連携
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Melty+ (メルティプラス) - プロフィール</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Nunito:wght@300;400;500;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Great+Vibes&family=Satisfy&family=Fredoka+One&family=Bungee&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        {/* ヘッダー */}
        <div className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => router.push('/user')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">プロフィール</h1>
                    <p className="text-sm sm:text-base text-gray-600 hidden sm:block">アカウント情報と設定</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          {/* プロフィールカード */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {/* アバター */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* ユーザー情報 */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {user?.lastName} {user?.firstName}
                    </h2>
                    <p className="text-sm text-gray-600">会員ID: {user?.id}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="mt-2 sm:mt-0 inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>{isEditing ? '保存' : '編集'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{user?.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{user?.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">登録: {user?.memberSince}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 統計カード */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPoints.toLocaleString()}</p>
              <p className="text-xs text-gray-600">保有ポイント</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.monthlyEarned.toLocaleString()}</p>
              <p className="text-xs text-gray-600">今月獲得</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalGifts}</p>
              <p className="text-xs text-gray-600">交換したギフト</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.favoriteStores}</p>
              <p className="text-xs text-gray-600">お気に入り店舗</p>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/user/points')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              ポイント履歴を見る
            </button>
            <button
              onClick={() => router.push('/user/gifts')}
              className="bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border border-gray-200 transition-colors duration-200 shadow-sm hover:shadow"
            >
              ギフトを交換する
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
