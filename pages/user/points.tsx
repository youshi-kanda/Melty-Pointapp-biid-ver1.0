import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { 
  ArrowLeft, 
  Star, 
  Bell, 
  Settings, 
  CreditCard, 
  TrendingUp, 
  Gift, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react'

export default function PointsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [currentPoints, setCurrentPoints] = useState(0)
  const [pointsHistory, setPointsHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: 認証チェック
    // if (!AuthService.isAuthenticated()) {
    //   router.push('/login')
    //   return
    // }
    // setUser(AuthService.getUser())
    loadPointsData()
  }, [router])

  const loadPointsData = async () => {
    try {
      // TODO: API連携
      // const data = await PointsAPI.getPointsHistory()
      // setPointsHistory(data.results || [])
      setCurrentPoints(48800)
    } catch (error) {
      console.error('Failed to load points data:', error)
    } finally {
      setIsLoading(false)
    }
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
        <title>Melty+ (メルティプラス) - ポイント</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Nunito:wght@300;400;500;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Great+Vibes&family=Satisfy&family=Fredoka+One&family=Bungee&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-pink-50">
        {/* ヘッダー */}
        <div className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              {/* 左側: 戻るボタン + タイトル */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => router.push('/user')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
                    <Star className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ポイント</h1>
                    <p className="text-sm sm:text-base text-gray-600 hidden sm:block">ポイント残高と履歴を管理</p>
                  </div>
                </div>
              </div>

              {/* 右側: 通知 + 設定 */}
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
          {/* ポイント残高カード */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">現在のポイント残高</h2>
                <div className="flex items-center space-x-2 text-gray-600">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm sm:text-base">利用可能ポイント</span>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-3xl sm:text-4xl font-bold text-pink-600">{currentPoints.toLocaleString()}</p>
                <p className="text-sm text-gray-500">ポイント</p>
              </div>
            </div>
          </div>

          {/* 統計カード */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">2,850</h3>
              <p className="text-sm sm:text-base text-gray-600">今月獲得</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">1,200</h3>
              <p className="text-sm sm:text-base text-gray-600">今月利用</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">125,450</h3>
              <p className="text-sm sm:text-base text-gray-600">総獲得</p>
            </div>
          </div>

          {/* ポイント履歴 */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">ポイント履歴</h2>
            </div>
            <div className="divide-y">
              {[
                { id: '1', type: 'earn', amount: 500, description: '購入ポイント', date: '2025-01-12', store: 'カフェドゥ ビート' },
                { id: '2', type: 'spend', amount: -1200, description: 'ギフト交換', date: '2025-01-11', store: 'Amazonギフト券' },
                { id: '3', type: 'earn', amount: 300, description: 'ボーナスポイント', date: '2025-01-10', store: 'レストラン バンビーノ' },
              ].map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className={`p-2 rounded-lg ${transaction.type === 'earn' ? 'bg-pink-100' : 'bg-rose-100'}`}>
                      {transaction.type === 'earn' ? (
                        <ArrowUpRight className="text-pink-600 w-5 h-5" />
                      ) : (
                        <ArrowDownRight className="text-rose-600 w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{transaction.description}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{transaction.store}</p>
                      <p className="text-xs text-gray-400">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className={`text-base sm:text-lg font-semibold ${transaction.type === 'earn' ? 'text-pink-600' : 'text-rose-600'}`}>
                      {transaction.type === 'earn' ? '+' : ''}{transaction.amount.toLocaleString()}pt
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/user/gifts/exchange')}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              ギフトと交換する
            </button>
            <button
              onClick={() => router.push('/user/map')}
              className="bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border border-gray-200 transition-colors duration-200 shadow-sm hover:shadow"
            >
              ポイントが貯まる店舗を探す
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
