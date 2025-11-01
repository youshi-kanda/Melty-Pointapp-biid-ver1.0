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
  Settings,
  AlertCircle
} from 'lucide-react'
import { getApiUrl } from '@/lib/api-config'

interface GiftCategory {
  id: number
  name: string
  description: string
  icon: string
  is_active: boolean
}

interface GiftItem {
  id: number
  name: string
  description: string
  points_required: number
  original_price: number
  provider_name: string
  gift_type: 'digital' | 'physical' | 'voucher' | 'coupon'
  category: number
  image_url?: string
  thumbnail_url?: string
  stock_quantity: number
  unlimited_stock: boolean
  is_available: boolean
  status: string
  exchange_count: number
  // デジタルギフト関連
  is_external_gift?: boolean
  external_brand?: number
  external_brand_name?: string
  external_brand_code?: string
  external_price?: number
  commission_info?: {
    price: number
    commission: number
    commission_tax: number
    total: number
    currency: string
  }
}

const categoryIcons: { [key: string]: string } = {
  '1': '🎁',
  '2': '🍽️',
  '3': '👗',
  '4': '💻',
  '5': '💄',
  '6': '🎬',
  '7': '🏠',
}

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
  const [categories, setCategories] = useState<GiftCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [giftType, setGiftType] = useState('all')
  const [inStock, setInStock] = useState(false)
  const [userPoints, setUserPoints] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 交換モーダル用ステート
  const [showExchangeModal, setShowExchangeModal] = useState(false)
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const [deliveryMethod, setDeliveryMethod] = useState<'app' | 'convenience' | 'email'>('app')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [isExchanging, setIsExchanging] = useState(false)

  useEffect(() => {
    loadGiftsData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    filterAndSortGifts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gifts, selectedCategory, searchQuery, sortBy, giftType, inStock])

  const loadGiftsData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // JWTトークンを取得
      const token = localStorage.getItem('auth_token')
      if (!token) {
        router.push('/user/login')
        return
      }

      // ユーザーのポイント残高を取得
      const profileResponse = await fetch(`${getApiUrl()}/user/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setUserPoints(profileData.point_balance || 0)
      }

      // カテゴリ一覧を取得
      const categoriesResponse = await fetch(`${getApiUrl()}/gifts/categories/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData || [])
      }

      // ギフト一覧を取得
      const giftsResponse = await fetch(`${getApiUrl()}/gifts/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (giftsResponse.ok) {
        const giftsData = await giftsResponse.json()
        setGifts(giftsData.gifts || [])
        setFilteredGifts(giftsData.gifts || [])
      } else {
        setError('ギフトデータの取得に失敗しました')
      }
    } catch (error) {
      console.error('Failed to load gifts data:', error)
      setError('ギフトデータの読み込みに失敗しました')
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

    // 在庫ありフィルター
    if (inStock) {
      filtered = filtered.filter(g => g.is_available)
    }

    // ソート
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.points_required - b.points_required)
        break
      case 'price_high':
        filtered.sort((a, b) => b.points_required - a.points_required)
        break
      case 'exchange_count':
        filtered.sort((a, b) => b.exchange_count - a.exchange_count)
        break
      case 'popular':
      default:
        filtered.sort((a, b) => b.exchange_count - a.exchange_count)
    }

    setFilteredGifts(filtered)
  }

  const canAfford = (points: number) => userPoints >= points

  const handleExchangeClick = (gift: GiftItem) => {
    if (!canAfford(gift.points_required) || !gift.is_available) {
      alert('ポイント不足、または在庫切れです')
      return
    }
    setSelectedGift(gift)
    setShowExchangeModal(true)
    // デフォルトの受取方法を設定
    if (gift.gift_type === 'digital') {
      setDeliveryMethod('app')
    }
  }

  const handleExchange = async () => {
    if (!selectedGift) return

    setIsExchanging(true)
    
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        router.push('/user/login')
        return
      }

      const requestBody: any = {
        gift_id: selectedGift.id
      }

      // 受取方法に応じて追加情報を設定
      if (deliveryMethod === 'convenience') {
        requestBody.delivery_method = 'convenience_store'
      } else if (deliveryMethod === 'email' && recipientEmail) {
        requestBody.delivery_method = 'email'
        requestBody.recipient_email = recipientEmail
      } else {
        requestBody.delivery_method = 'digital'
      }

      const response = await fetch(`${getApiUrl()}/api/gifts/exchange/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Exchange success:', data)
        alert(`${selectedGift.name}の交換が完了しました！\n\n${
          data.exchange?.digital_code ? `ギフトコード: ${data.exchange.digital_code}` : '詳細はマイギフトからご確認ください'
        }`)
        setShowExchangeModal(false)
        setSelectedGift(null)
        setRecipientEmail('')
        // データを再読み込み
        loadGiftsData()
      } else {
        const errorData = await response.json()
        console.error('Exchange error response:', errorData)
        alert(errorData.error || errorData.message || '交換に失敗しました')
      }
    } catch (error) {
      console.error('Exchange failed:', error)
      alert(`交換に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
    } finally {
      setIsExchanging(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'digital': return <Zap className="w-4 h-4" />
      case 'physical': return <Package className="w-4 h-4" />
      case 'voucher': return <Gift className="w-4 h-4" />
      case 'coupon': return <Heart className="w-4 h-4" />
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
            {/* エラー表示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">エラーが発生しました</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

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
                {categories.map((cat, index) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-2xl text-center transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? `bg-gradient-to-r ${categoryColors[index % categoryColors.length]} text-white shadow-soft`
                        : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                    }`}
                  >
                    <div className="text-2xl mb-1">{categoryIcons[cat.id] || cat.icon || '🎁'}</div>
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
                  <option value="exchange_count">交換数順</option>
                </select>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-400"
                  />
                  <span className="text-sm text-pink-700 font-semibold">在庫ありのみ</span>
                </label>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-pink-600">{filteredGifts.length} 件のギフトが見つかりました</p>
              </div>
            </div>

            {/* ギフト一覧 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGifts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">ギフトが見つかりませんでした</p>
                </div>
              ) : (
                filteredGifts.map(gift => (
                  <div key={gift.id} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-200 overflow-hidden">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={gift.thumbnail_url || gift.image_url || `https://via.placeholder.com/300x200/ec4899/ffffff?text=${encodeURIComponent(gift.name)}`}
                        alt={gift.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {!gift.is_available && (
                          <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            売切
                          </span>
                        )}
                        {gift.exchange_count > 50 && (
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
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-pink-800 text-lg line-clamp-2 flex-1">{gift.name}</h3>
                          {gift.is_external_gift && gift.external_brand_name && (
                            <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full font-semibold whitespace-nowrap">
                              {gift.external_brand_name}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-pink-600">{gift.provider_name}</p>
                      </div>
                      <p className="text-sm text-pink-600 line-clamp-2">{gift.description}</p>
                      {gift.exchange_count > 0 && (
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-pink-400" />
                          <span className="text-sm text-pink-600">{gift.exchange_count}人が交換</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-pink-600">{gift.points_required.toLocaleString()}pt</span>
                          {gift.original_price > 0 && (
                            <span className="text-sm text-pink-500 ml-2 line-through">¥{gift.original_price.toLocaleString()}</span>
                          )}
                        </div>
                        <div className="text-right">
                          {gift.unlimited_stock ? (
                            <span className="text-xs text-green-600 font-semibold">在庫潤沢</span>
                          ) : gift.stock_quantity > 0 ? (
                            <span className="text-xs text-pink-500">残り {gift.stock_quantity}個</span>
                          ) : (
                            <span className="text-xs text-red-500 font-semibold">在庫切れ</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors">
                          <Heart className="w-4 h-4 text-pink-600" />
                        </button>
                        <button
                          onClick={() => handleExchangeClick(gift)}
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
                ))
              )}
            </div>
          </div>
        </main>

        {/* 交換確認モーダル */}
        {showExchangeModal && selectedGift && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowExchangeModal(false)}>
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-pink-800">ギフト交換確認</h3>
              
              {/* ギフト情報 */}
              <div className="bg-pink-50 rounded-xl p-4">
                <h4 className="font-bold text-pink-900 mb-2">{selectedGift.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-pink-600">必要ポイント</span>
                    <span className="font-bold text-pink-800">{selectedGift.points_required.toLocaleString()} pt</span>
                  </div>
                  
                  {/* 外部ギフトの場合は手数料を表示 */}
                  {selectedGift.is_external_gift && selectedGift.commission_info && (
                    <>
                      <div className="border-t border-pink-200 pt-2 mt-2">
                        <p className="text-xs text-pink-600 mb-1">手数料詳細 ({selectedGift.external_brand_name})</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-pink-600">ギフト金額</span>
                            <span className="text-pink-700">¥{selectedGift.commission_info.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-600">手数料</span>
                            <span className="text-pink-700">¥{selectedGift.commission_info.commission.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-600">消費税</span>
                            <span className="text-pink-700">¥{selectedGift.commission_info.commission_tax.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-bold border-t border-pink-200 pt-1">
                            <span className="text-pink-800">総額</span>
                            <span className="text-pink-800">¥{selectedGift.commission_info.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between border-t border-pink-200 pt-2">
                    <span className="text-pink-600">所持ポイント</span>
                    <span className="text-pink-700">{userPoints.toLocaleString()} pt</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-pink-800">交換後ポイント</span>
                    <span className="text-pink-800">{(userPoints - selectedGift.points_required).toLocaleString()} pt</span>
                  </div>
                </div>
              </div>

              {/* 受取方法選択（デジタルギフトの場合のみ） */}
              {selectedGift.gift_type === 'digital' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-pink-900 text-sm">受取方法</h4>
                  
                  <label className={`flex items-start p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'app' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
                  }`}>
                    <input
                      type="radio"
                      name="delivery"
                      value="app"
                      checked={deliveryMethod === 'app'}
                      onChange={(e) => setDeliveryMethod(e.target.value as any)}
                      className="mt-1 text-pink-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-semibold text-pink-900">アプリで即時受取</div>
                      <div className="text-xs text-pink-600">交換後すぐにギフトコードを確認できます</div>
                    </div>
                  </label>

                  <label className={`flex items-start p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'convenience' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
                  }`}>
                    <input
                      type="radio"
                      name="delivery"
                      value="convenience"
                      checked={deliveryMethod === 'convenience'}
                      onChange={(e) => setDeliveryMethod(e.target.value as any)}
                      className="mt-1 text-pink-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-semibold text-pink-900">コンビニで発券</div>
                      <div className="text-xs text-pink-600">セブン・ファミマ・ローソンで受取可能</div>
                    </div>
                  </label>

                  <label className={`flex items-start p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'email' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
                  }`}>
                    <input
                      type="radio"
                      name="delivery"
                      value="email"
                      checked={deliveryMethod === 'email'}
                      onChange={(e) => setDeliveryMethod(e.target.value as any)}
                      className="mt-1 text-pink-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-semibold text-pink-900">メールで送信</div>
                      <div className="text-xs text-pink-600">ギフトとして誰かに贈る</div>
                    </div>
                  </label>

                  {deliveryMethod === 'email' && (
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="送信先メールアドレス"
                      className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  )}
                </div>
              )}

              {/* ボタン */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowExchangeModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  disabled={isExchanging}
                >
                  キャンセル
                </button>
                <button
                  onClick={handleExchange}
                  disabled={isExchanging || (deliveryMethod === 'email' && !recipientEmail)}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl font-semibold hover:from-pink-500 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExchanging ? '交換中...' : '交換確定'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
