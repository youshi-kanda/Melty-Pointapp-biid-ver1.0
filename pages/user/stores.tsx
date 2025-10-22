import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  Navigation,
  Heart,
  Share2,
  Filter,
  Search,
  Home,
  Bell,
  Settings
} from 'lucide-react'

interface Store {
  id: string
  name: string
  description: string
  category: string
  address: string
  phone: string
  hours: string
  rating: number
  reviews: number
  distance: number
  point_rate: number
  image_url?: string
  is_favorite: boolean
  is_open: boolean
}

export default function StoresPage() {
  const router = useRouter()
  const [stores, setStores] = useState<Store[]>([])
  const [filteredStores, setFilteredStores] = useState<Store[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('distance')
  const [openOnly, setOpenOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: 'restaurant', name: 'レストラン', icon: '🍽️' },
    { id: 'cafe', name: 'カフェ', icon: '☕' },
    { id: 'retail', name: '小売店', icon: '🏪' },
    { id: 'beauty', name: 'ビューティー', icon: '💇' },
  ]

  useEffect(() => {
    loadStoresData()
  }, [])

  useEffect(() => {
    filterAndSortStores()
  }, [stores, searchQuery, selectedCategory, sortBy, openOnly])

  const loadStoresData = async () => {
    try {
      // TODO: API連携
      // const data = await StoresAPI.getStores()
      
      // モックデータ
      const mockStores: Store[] = [
        {
          id: '1',
          name: 'カフェドゥ ビート',
          description: '自家焙煎コーヒーと手作りスイーツが人気のカフェ',
          category: 'cafe',
          address: '東京都渋谷区神南1-2-3',
          phone: '03-1234-5678',
          hours: '9:00-20:00',
          rating: 4.8,
          reviews: 245,
          distance: 0.3,
          point_rate: 5,
          is_favorite: true,
          is_open: true
        },
        {
          id: '2',
          name: 'レストラン バンビーノ',
          description: '本格イタリアンが楽しめるカジュアルダイニング',
          category: 'restaurant',
          address: '東京都渋谷区道玄坂2-3-4',
          phone: '03-2345-6789',
          hours: '11:00-22:00',
          rating: 4.6,
          reviews: 189,
          distance: 0.5,
          point_rate: 10,
          is_favorite: false,
          is_open: true
        },
        {
          id: '3',
          name: 'ビューティサロン エレガンス',
          description: '最新トリートメントで美しさをサポート',
          category: 'beauty',
          address: '東京都渋谷区宇田川町5-6-7',
          phone: '03-3456-7890',
          hours: '10:00-19:00',
          rating: 4.9,
          reviews: 312,
          distance: 0.8,
          point_rate: 3,
          is_favorite: true,
          is_open: false
        }
      ]

      setStores(mockStores)
    } catch (error) {
      console.error('Failed to load stores:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortStores = () => {
    let filtered = [...stores]

    // カテゴリフィルター
    if (selectedCategory) {
      filtered = filtered.filter(s => s.category === selectedCategory)
    }

    // 検索フィルター
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query)
      )
    }

    // 営業中フィルター
    if (openOnly) {
      filtered = filtered.filter(s => s.is_open)
    }

    // ソート
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'point_rate':
        filtered.sort((a, b) => b.point_rate - a.point_rate)
        break
      case 'distance':
      default:
        filtered.sort((a, b) => a.distance - b.distance)
    }

    setFilteredStores(filtered)
  }

  const toggleFavorite = async (storeId: string) => {
    // TODO: API連携
    setStores(stores.map(s => 
      s.id === storeId ? { ...s, is_favorite: !s.is_favorite } : s
    ))
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
        <title>Melty+ (メルティプラス) - 店舗検索</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Nunito:wght@300;400;500;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Great+Vibes&family=Satisfy&family=Fredoka+One&family=Bungee&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* ヘッダー */}
        <header className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => router.push('/user')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Home className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <MapPin className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">店舗検索</h1>
                    <p className="text-sm sm:text-base text-gray-600 hidden sm:block">近くのポイント加盟店を探す</p>
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
        </header>

        {/* メインコンテンツ */}
        <main className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* カテゴリ */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">カテゴリ</h3>
                <button
                  onClick={() => router.push('/user/map')}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <MapPin className="w-4 h-4" />
                  <span>地図で見る</span>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    selectedCategory === null
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">🏪</div>
                  <span className="text-sm font-semibold">すべて</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <span className="text-sm font-semibold">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 検索・フィルター */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="店舗名・住所で検索..."
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="distance">距離順</option>
                  <option value="rating">評価順</option>
                  <option value="point_rate">ポイント還元率順</option>
                </select>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={openOnly}
                    onChange={(e) => setOpenOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                  />
                  <span className="text-sm text-gray-700 font-semibold">営業中のみ</span>
                </label>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">{filteredStores.length} 件の店舗が見つかりました</p>
              </div>
            </div>

            {/* 店舗一覧 */}
            <div className="space-y-4">
              {filteredStores.map(store => (
                <div key={store.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {/* 店舗画像 */}
                    <div className="sm:w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      {store.image_url ? (
                        <img src={store.image_url} alt={store.name} className="w-full h-full object-cover" />
                      ) : (
                        <MapPin className="w-16 h-16 text-blue-300" />
                      )}
                    </div>

                    {/* 店舗情報 */}
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                            {store.is_open ? (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">営業中</span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-semibold">営業時間外</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{store.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-semibold">{store.rating}</span>
                              <span>({store.reviews}件)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Navigation className="w-4 h-4" />
                              <span>{store.distance}km</span>
                            </div>
                            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              {store.point_rate}%還元
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleFavorite(store.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Heart className={`w-5 h-5 ${store.is_favorite ? 'text-pink-500 fill-current' : 'text-gray-400'}`} />
                        </button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{store.address}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{store.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{store.hours}</span>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => router.push(`/user/stores/${store.id}`)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md"
                        >
                          詳細を見る
                        </button>
                        <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                          <Share2 className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredStores.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">該当する店舗が見つかりませんでした</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
