import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { 
  ArrowLeft, 
  Heart, 
  Store, 
  Gift, 
  Star, 
  MapPin, 
  Trash2,
  ExternalLink,
  Bell,
  Settings
} from 'lucide-react'

interface FavoriteStore {
  id: string
  name: string
  category: string
  address: string
  rating: number
  distance: number
  pointRate: number
}

interface FavoriteGift {
  id: string
  name: string
  provider: string
  points: number
  originalPrice: number
  category: string
  rating: number
}

export default function FavoritesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'stores' | 'gifts'>('stores')
  const [favoriteStores, setFavoriteStores] = useState<FavoriteStore[]>([])
  const [favoriteGifts, setFavoriteGifts] = useState<FavoriteGift[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      // TODO: API連携
      // const [storesRes, giftsRes] = await Promise.all([
      //   FavoritesAPI.getStores(),
      //   FavoritesAPI.getGifts()
      // ])
      
      // モックデータ
      setFavoriteStores([
        {
          id: '1',
          name: 'カフェドゥ ビート',
          category: 'カフェ',
          address: '東京都渋谷区神南1-2-3',
          rating: 4.8,
          distance: 0.3,
          pointRate: 5
        },
        {
          id: '2',
          name: 'レストラン バンビーノ',
          category: 'レストラン',
          address: '東京都渋谷区道玄坂2-3-4',
          rating: 4.6,
          distance: 0.5,
          pointRate: 10
        }
      ])

      setFavoriteGifts([
        {
          id: '1',
          name: 'Amazonギフト券 1,000円分',
          provider: 'Amazon',
          points: 1000,
          originalPrice: 1000,
          category: 'デジタル',
          rating: 4.8
        },
        {
          id: '2',
          name: 'スターバックス ドリンクチケット',
          provider: 'Starbucks',
          points: 500,
          originalPrice: 500,
          category: 'バウチャー',
          rating: 4.9
        }
      ])
    } catch (error) {
      console.error('Failed to load favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFavoriteStore = async (storeId: string) => {
    try {
      // TODO: API連携
      // await FavoritesAPI.removeStore(storeId)
      setFavoriteStores(prev => prev.filter(s => s.id !== storeId))
    } catch (error) {
      console.error('Failed to remove favorite store:', error)
    }
  }

  const removeFavoriteGift = async (giftId: string) => {
    try {
      // TODO: API連携
      // await FavoritesAPI.removeGift(giftId)
      setFavoriteGifts(prev => prev.filter(g => g.id !== giftId))
    } catch (error) {
      console.error('Failed to remove favorite gift:', error)
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
        <title>Melty+ (メルティプラス) - お気に入り</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Nunito:wght@300;400;500;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Great+Vibes&family=Satisfy&family=Fredoka+One&family=Bungee&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
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
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-white fill-current" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">お気に入り</h1>
                    <p className="text-sm sm:text-base text-gray-600 hidden sm:block">保存した店舗とギフト</p>
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
          {/* タブ */}
          <div className="bg-white rounded-xl shadow-sm border p-2 mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('stores')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === 'stores'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Store className="w-5 h-5" />
                <span>店舗</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{favoriteStores.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('gifts')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === 'gifts'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Gift className="w-5 h-5" />
                <span>ギフト</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{favoriteGifts.length}</span>
              </button>
            </div>
          </div>

          {/* 店舗一覧 */}
          {activeTab === 'stores' && (
            <div className="space-y-4">
              {favoriteStores.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                  <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">お気に入りの店舗がありません</p>
                  <button
                    onClick={() => router.push('/user/stores')}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all"
                  >
                    店舗を探す
                  </button>
                </div>
              ) : (
                favoriteStores.map(store => (
                  <div key={store.id} className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Store className="w-8 h-8 text-rose-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{store.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{store.category}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-semibold">{store.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{store.distance}km</span>
                              </div>
                              <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                {store.pointRate}%還元
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{store.address}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => router.push(`/user/stores/${store.id}`)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="詳細を見る"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => removeFavoriteStore(store.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="削除"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ギフト一覧 */}
          {activeTab === 'gifts' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteGifts.length === 0 ? (
                <div className="col-span-full bg-white rounded-xl shadow-sm border p-12 text-center">
                  <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">お気に入りのギフトがありません</p>
                  <button
                    onClick={() => router.push('/user/gifts')}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all"
                  >
                    ギフトを探す
                  </button>
                </div>
              ) : (
                favoriteGifts.map(gift => (
                  <div key={gift.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all">
                    <div className="h-40 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                      <Gift className="w-16 h-16 text-rose-400" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{gift.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{gift.provider}</p>
                      <div className="flex items-center space-x-1 mb-3">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-semibold text-gray-700">{gift.rating}</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-lg font-bold text-rose-600">{gift.points.toLocaleString()}pt</span>
                          <span className="text-xs text-gray-500 ml-1 line-through">¥{gift.originalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/user/gifts`)}
                          className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-2 px-3 rounded-lg text-sm hover:from-rose-600 hover:to-pink-600 transition-all"
                        >
                          交換する
                        </button>
                        <button
                          onClick={() => removeFavoriteGift(gift.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
