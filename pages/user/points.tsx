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
  ArrowDownRight,
  AlertCircle
} from 'lucide-react'
import { getApiUrl } from '@/lib/api-config'

interface PointTransaction {
  id: number
  points: number
  transaction_type: string
  description: string
  created_at: string
  store?: {
    name: string
  }
  balance_after: number
}

interface PointStats {
  current_points: number
  monthly_earned: number
  monthly_spent: number
  total_earned: number
}

export default function PointsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [currentPoints, setCurrentPoints] = useState(0)
  const [pointsHistory, setPointsHistory] = useState<PointTransaction[]>([])
  const [stats, setStats] = useState<PointStats>({
    current_points: 0,
    monthly_earned: 0,
    monthly_spent: 0,
    total_earned: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPointsData()
  }, [router])

  const loadPointsData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // JWTトークンを取得
      const token = localStorage.getItem('auth_token')
      if (!token) {
        router.push('/user/login')
        return
      }

      let userPointBalance = 0

      // プロフィールAPIから現在のポイント残高を取得
      const profileResponse = await fetch(`${getApiUrl()}/user/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        userPointBalance = profileData.point_balance || 0
        setCurrentPoints(userPointBalance)
        setUser(profileData)
      }

      // ポイント履歴を取得
      const historyResponse = await fetch(`${getApiUrl()}/points/history/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (historyResponse.ok) {
        const historyData = await historyResponse.json()
        const transactions = historyData.transactions || []
        setPointsHistory(transactions.slice(0, 10)) // 最新10件

        // 統計を計算
        calculateStats(transactions, userPointBalance)
      }
    } catch (error) {
      console.error('Failed to load points data:', error)
      setError('ポイントデータの読み込みに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (transactions: PointTransaction[], currentBalance: number) => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let monthlyEarned = 0
    let monthlySpent = 0
    let totalEarned = 0

    transactions.forEach((tx) => {
      const txDate = new Date(tx.created_at)
      const isCurrentMonth = txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear

      if (tx.points > 0) {
        totalEarned += tx.points
        if (isCurrentMonth) {
          monthlyEarned += tx.points
        }
      } else if (tx.points < 0) {
        if (isCurrentMonth) {
          monthlySpent += Math.abs(tx.points)
        }
      }
    })

    setStats({
      current_points: currentBalance,
      monthly_earned: monthlyEarned,
      monthly_spent: monthlySpent,
      total_earned: totalEarned
    })
  }

  const getTransactionIcon = (type: string) => {
    const isPositive = ['grant', 'bonus', 'transfer_in', 'refund'].includes(type)
    return isPositive ? ArrowUpRight : ArrowDownRight
  }

  const getTransactionColor = (type: string) => {
    const isPositive = ['grant', 'bonus', 'transfer_in', 'refund'].includes(type)
    return isPositive ? 'pink' : 'rose'
  }

  const getTransactionLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'grant': 'ポイント付与',
      'payment': 'ポイント決済',
      'refund': 'ポイント返金',
      'transfer_in': 'ポイント受取',
      'transfer_out': 'ポイント送付',
      'expire': 'ポイント失効',
      'bonus': 'ボーナスポイント',
      'correction': '調整',
    }
    return labels[type] || type
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
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
          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">エラーが発生しました</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

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
                <p className="text-3xl sm:text-4xl font-bold text-pink-600">{stats.current_points.toLocaleString()}</p>
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
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.monthly_earned.toLocaleString()}</h3>
              <p className="text-sm sm:text-base text-gray-600">今月獲得</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.monthly_spent.toLocaleString()}</h3>
              <p className="text-sm sm:text-base text-gray-600">今月利用</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total_earned.toLocaleString()}</h3>
              <p className="text-sm sm:text-base text-gray-600">総獲得</p>
            </div>
          </div>

          {/* ポイント履歴 */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">ポイント履歴</h2>
            </div>
            {pointsHistory.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>ポイント履歴がありません</p>
              </div>
            ) : (
              <div className="divide-y">
                {pointsHistory.map((transaction) => {
                  const Icon = getTransactionIcon(transaction.transaction_type)
                  const color = getTransactionColor(transaction.transaction_type)
                  const isPositive = transaction.points > 0

                  return (
                    <div
                      key={transaction.id}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className={`p-2 rounded-lg ${isPositive ? 'bg-pink-100' : 'bg-rose-100'}`}>
                          <Icon className={`${isPositive ? 'text-pink-600' : 'text-rose-600'} w-5 h-5`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">
                            {getTransactionLabel(transaction.transaction_type)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">{transaction.description}</p>
                          {transaction.store && (
                            <p className="text-xs text-gray-500 mt-0.5">{transaction.store.name}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(transaction.created_at).toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className={`text-base sm:text-lg font-semibold ${isPositive ? 'text-pink-600' : 'text-rose-600'}`}>
                          {isPositive ? '+' : ''}{transaction.points.toLocaleString()}pt
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          残高: {transaction.balance_after.toLocaleString()}pt
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
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
