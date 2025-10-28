import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { 
  ArrowLeft, 
  Gift, 
  Search, 
  Star, 
  Zap, 
  Package, 
  Heart,
  ShoppingCart,
  Filter,
  Home,
  Bell,
  Settings
} from 'lucide-react'

interface GiftItem {
  id: string
  name: string
  description: string
  points_required: number
  original_price: number
  provider_name: string
  gift_type: 'digital' | 'physical' | 'voucher' | 'coupon'
  category: string
  image_url?: string
  rating?: number
  reviews?: number
  stock_quantity: number
  unlimited_stock: boolean
  is_available: boolean
  featured: boolean
  popular: boolean
}

const categoryIcons = ['🎁', '🍽️', '👗', '💻', '💄', '🎬', '🏠']
const categoryColors = [
  'from-orange-400 to-red-500',
  'from-purple-400 to-pink-500',
  'from-blue-400 to-cyan-500',
  'from-pink-400 to-rose-500',
  'from-indigo-400 to-purple-500',
  'from-green-400 to-emerald-500'
]

export default function GiftsPage() {
  const router = useRouter()
  const [gifts, setGifts] = useState<GiftItem[]>([])
  const [filteredGifts, setFilteredGifts] = useState<GiftItem[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [giftType, setGiftType] = useState('all')
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [userPoints, setUserPoints] = useState(48800)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadGiftsData()
  }, [])

  useEffect(() => {
    filterAndSortGifts()
  }, [gifts, selectedCategory, searchQuery, sortBy, giftType, featuredOnly])

  const loadGiftsData = async () => {
    try {
      // TODO: API連携
      // const [categoriesRes, giftsRes] = await Promise.all([
      //   GiftsAPI.getCategories(),
      //   GiftsAPI.getGifts()
      // ])
      
      // モックデータ
      const mockCategories = [
        { id: 'food', name: '飲食', icon: '🍽️', color: 'from-orange-400 to-red-500' },
        { id: 'fashion', name: 'ファッション', icon: '👗', color: 'from-purple-400 to-pink-500' },
        { id: 'tech', name: 'テクノロジー', icon: '💻', color: 'from-blue-400 to-cyan-500' },
        { id: 'beauty', name: 'ビューティー', icon: '💄', color: 'from-pink-400 to-rose-500' },
      ]

      const mockGifts: GiftItem[] = [
        {
          id: '1',
          name: 'Amazonギフト券 1,000円分',
          description: 'オンラインショッピングに使える便利なギフト券',
          points_required: 1000,
          original_price: 1000,
          provider_name: 'Amazon',
          gift_type: 'digital',
          category: 'tech',
          rating: 4.8,
          reviews: 245,
          stock_quantity: 100,
          unlimited_stock: true,
          is_available: true,
          featured: true,
          popular: true
        },
        {
          id: '2',
          name: 'スターバックス ドリンクチケット',
          description: '全国のスターバックスで使えるドリンクチケット',
          points_required: 500,
          original_price: 500,
          provider_name: 'Starbucks',
          gift_type: 'voucher',
          category: 'food',
          rating: 4.9,
          reviews: 892,
          stock_quantity: 50,
          unlimited_stock: false,
          is_available: true,
          featured: true,
          popular: true
        },
        {
          id: '3',
          name: 'UNIQLO ギフトカード 3,000円分',
          description: 'ユニクロ全店舗で使えるギフトカード',
          points_required: 3000,
          original_price: 3000,
          provider_name: 'UNIQLO',
          gift_type: 'physical',
          category: 'fashion',
          rating: 4.7,
          reviews: 156,
          stock_quantity: 20,
          unlimited_stock: false,
          is_available: true,
          featured: false,
          popular: true
        }
      ]

      setCategories(mockCategories)
      setGifts(mockGifts)
    } catch (error) {
      console.error('Failed to load gifts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortGifts = () => {
    let filtered = [...gifts]

    // カテゴリフィルター
    if (selectedCategory) {
      filtered = filtered.filter(g => g.category === selectedCategory)
    }

    // 検索フィルター
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query) ||
        g.provider_name.toLowerCase().includes(query)
      )
    }

    // タイプフィルター
    if (giftType !== 'all') {
      filtered = filtered.filter(g => g.gift_type === giftType)
    }

    // 注目商品フィルター
    if (featuredOnly) {
      filtered = filtered.filter(g => g.featured)
    }

    // ソート
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.points_required - b.points_required)
        break
      case 'price_high':
        filtered.sort((a, b) => b.points_required - a.points_required)
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'popular':
      default:
        filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
    }

    setFilteredGifts(filtered)
  }

  const canAfford = (points: number) => userPoints >= points

  const handleExchange = async (gift: GiftItem) => {
    if (!canAfford(gift.points_required) || !gift.is_available) return

    try {
      // TODO: API連携
      // await GiftsAPI.exchangeGift(gift.id)
      console.log('Gift exchanged:', gift.name)
      alert(`${gift.name}の交換が完了しました！`)
    } catch (error) {
      console.error('Exchange failed:', error)
      alert('交換に失敗しました')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'digital': return <Zap className="w-4 h-4" />
      case 'physical': return <Package className="w-4 h-4" />
      case 'voucher': return <Gift className="w-4 h-4" />
      default: return <Gift className="w-4 h-4" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case 'digital': return 'デジタル'
      case 'physical': return '現物'
      case 'voucher': return 'バウチャー'
      case 'coupon': return 'クーポン'
      default: return type
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
        <title>Melty+ (メルティプラス) - ギフト</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Nunito:wght@300;400;500;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Great+Vibes&family=Satisfy&family=Fredoka+One&family=Bungee&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-peach-50">
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
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-base sm:text-xl md:text-2xl font-light text-pink-600" style={{fontFamily: 'Dancing Script, cursive'}}>
                      Melty+ Store
                    </span>
                    <span className="text-xs sm:text-sm text-pink-500 block -mt-1">Gifts</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-right mr-2">
                  <p className="text-xs text-pink-600">所持ポイント</p>
                  <p className="text-sm font-bold text-pink-700">{userPoints.toLocaleString()} pt</p>
                </div>
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
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
              <h3 className="text-lg font-bold text-pink-800 mb-4">カテゴリ</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`p-3 rounded-2xl text-center transition-all duration-200 ${
                    selectedCategory === null
                      ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-soft'
                      : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                  }`}
                >
                  <div className="text-2xl mb-1">🎁</div>
                  <span className="text-sm font-semibold">すべて</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-2xl text-center transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? `bg-gradient-to-r ${cat.color} text-white shadow-soft`
                        : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <span className="text-sm font-semibold">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* フィルター */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="ギフトを検索..."
                  />
                </div>

                <select
                  value={giftType}
                  onChange={(e) => setGiftType(e.target.value)}
                  className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="all">すべてのタイプ</option>
                  <option value="digital">デジタル</option>
                  <option value="physical">現物</option>
                  <option value="voucher">バウチャー</option>
                  <option value="coupon">クーポン</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="popular">人気順</option>
                  <option value="price_low">ポイント低い順</option>
                  <option value="price_high">ポイント高い順</option>
                  <option value="rating">評価順</option>
                </select>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                    className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-400"
                  />
                  <span className="text-sm text-pink-700 font-semibold">注目商品のみ</span>
                </label>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-pink-600">{filteredGifts.length} 件のギフトが見つかりました</p>
              </div>
            </div>

            {/* ギフト一覧 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGifts.map(gift => (
                <div key={gift.id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-200 overflow-hidden">
                  <div className="relative">
                    <img
                      src={gift.image_url || `https://via.placeholder.com/300x200/ec4899/ffffff?text=${encodeURIComponent(gift.name)}`}
                      alt={gift.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {gift.featured && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          注目
                        </span>
                      )}
                      {gift.popular && (
                        <span className="bg-gradient-to-r from-pink-400 to-rose-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          人気
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      {getTypeIcon(gift.gift_type)}
                      <span className="text-xs font-semibold text-pink-700">{getTypeName(gift.gift_type)}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-bold text-pink-800 text-lg line-clamp-2">{gift.name}</h3>
                      <p className="text-sm text-pink-600">{gift.provider_name}</p>
                    </div>
                    <p className="text-sm text-pink-600 line-clamp-2">{gift.description}</p>
                    {gift.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-bold ml-1 text-pink-700">{gift.rating}</span>
                          <span className="text-sm text-pink-500 ml-1">({gift.reviews}件)</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-pink-600">{gift.points_required.toLocaleString()}pt</span>
                        <span className="text-sm text-pink-500 ml-2 line-through">¥{gift.original_price.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        {gift.unlimited_stock ? (
                          <span className="text-xs text-green-600 font-semibold">在庫潤沢</span>
                        ) : (
                          <span className="text-xs text-pink-500">残り {gift.stock_quantity}個</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors">
                        <Heart className="w-4 h-4 text-pink-600" />
                      </button>
                      <button
                        onClick={() => handleExchange(gift)}
                        disabled={!canAfford(gift.points_required) || !gift.is_available}
                        className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-200 ${
                          canAfford(gift.points_required) && gift.is_available
                            ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white hover:from-pink-500 hover:to-rose-600 shadow-soft hover:shadow-lg'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4 inline mr-2" />
                        {canAfford(gift.points_required) ? (gift.is_available ? '交換する' : '交換不可') : 'ポイント不足'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredGifts.length === 0 && (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                <p className="text-pink-500">該当するギフトが見つかりませんでした</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
