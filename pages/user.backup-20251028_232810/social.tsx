import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { 
  ArrowLeft, 
  Users, 
  MessageCircle,
  Heart,
  Share2,
  Camera,
  Image as ImageIcon,
  MapPin,
  Star,
  Gift,
  TrendingUp,
  QrCode,
  UserPlus,
  Search,
  MoreVertical,
  Send,
  Bell,
  X,
  Store
} from 'lucide-react'

export default function SocialPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'feed' | 'friends' | 'reviews' | 'notifications'>('feed')
  const [isLoading, setIsLoading] = useState(true)
  const [showPostModal, setShowPostModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Melty+ (メルティプラス) - ソーシャル</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
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
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-md">
                    <Users className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ソーシャル</h1>
                    <p className="text-sm text-gray-600 hidden sm:block">友達とつながる</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <button 
                  onClick={() => setShowSearchModal(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => setShowQRModal(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <QrCode className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          {/* タブ */}
          <div className="bg-white rounded-xl shadow-sm border p-2 mb-6">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg font-medium transition-all ${
                  activeTab === 'feed'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="w-5 h-5 mb-1" />
                <span className="text-xs">フィード</span>
              </button>
              <button
                onClick={() => setActiveTab('friends')}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg font-medium transition-all ${
                  activeTab === 'friends'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5 mb-1" />
                <span className="text-xs">友達</span>
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full mt-1">2</span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg font-medium transition-all ${
                  activeTab === 'reviews'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Star className="w-5 h-5 mb-1" />
                <span className="text-xs">レビュー</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg font-medium transition-all relative ${
                  activeTab === 'notifications'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bell className="w-5 h-5 mb-1" />
                <span className="text-xs">通知</span>
                <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full mt-1">2</span>
              </button>
            </div>
          </div>

          {/* フィードタブ */}
          {activeTab === 'feed' && (
            <div className="space-y-6">
              {/* 投稿作成ボタン */}
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <button
                  onClick={() => setShowPostModal(true)}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center space-x-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>今何してる？投稿しよう</span>
                </button>
              </div>

              {/* モック投稿 */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-pink-700">田</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">田中 太郎</h3>
                      <p className="text-sm text-gray-600">2時間前</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="px-4 pb-3">
                  <p className="text-gray-800 mb-3">カフェドゥ ビートで素敵なランチをしました！ポイントもたくさん貯まって嬉しい😊</p>
                  <div className="mb-3 flex items-center space-x-2 bg-gradient-to-r from-pink-50 to-rose-50 p-3 rounded-lg">
                    <MapPin className="w-5 h-5 text-pink-500" />
                    <div>
                      <p className="font-semibold text-gray-900">カフェドゥ ビート</p>
                      <p className="text-sm text-gray-600">東京都渋谷区</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1.5 rounded-full">
                    <Gift className="w-4 h-4" />
                    <span className="text-sm font-semibold">+150pt 獲得</span>
                  </div>
                </div>

                <div className="border-t px-4 py-3 flex items-center justify-around">
                  <button className="flex items-center space-x-2 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">24</span>
                  </button>
                  <button className="flex items-center space-x-2 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">5</span>
                  </button>
                  <button className="flex items-center space-x-2 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">2</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 友達タブ */}
          {activeTab === 'friends' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>友達を探す</span>
                </button>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">友達 (2人)</h2>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-pink-700">山</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">山田 次郎</h3>
                        <p className="text-sm text-gray-600">3,500pt 保有</p>
                      </div>
                    </div>
                    <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      プロフィール
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* レビュータブ */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <button
                  onClick={() => router.push('/user/stores')}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center space-x-2"
                >
                  <Star className="w-5 h-5" />
                  <span>レビューを書く</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-pink-700">田</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">田中 太郎</h3>
                      <p className="text-sm text-gray-600">1日前</p>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-3">
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-lg mb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Store className="w-5 h-5 text-pink-500" />
                        <div>
                          <h4 className="font-bold text-gray-900">レストラン バンビーノ</h4>
                          <p className="text-sm text-gray-600">イタリアン</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-800 mb-3">料理が美味しくて雰囲気も最高でした！デートにおすすめです。</p>
                  
                  <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1.5 rounded-full">
                    <Gift className="w-4 h-4" />
                    <span className="text-sm font-semibold">+200pt 獲得</span>
                  </div>
                </div>

                <div className="border-t px-4 py-3">
                  <button className="flex items-center space-x-2 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">18</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 通知タブ */}
          {activeTab === 'notifications' && (
            <div className="space-y-3">
              <div className="bg-white rounded-xl shadow-sm border p-4 border-pink-200 bg-pink-50/50">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">
                      <span className="font-bold">佐藤 花子</span>
                      があなたの投稿にいいねしました
                    </p>
                    <p className="text-sm text-gray-600 mt-1">10分前</p>
                  </div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0 mt-2"></div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4 border-pink-200 bg-pink-50/50">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">
                      <span className="font-bold">山田 次郎</span>
                      から友達リクエストが届いています
                    </p>
                    <p className="text-sm text-gray-600 mt-1">1時間前</p>
                  </div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0 mt-2"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 投稿作成モーダル */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">投稿を作成</h2>
              <button onClick={() => setShowPostModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="今何してる？"
                className="w-full min-h-32 p-4 border rounded-lg focus:ring-2 focus:ring-pink-500 resize-none"
              />
              <div className="flex items-center space-x-2 mt-4">
                <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">写真</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">位置情報</span>
                </button>
              </div>
              <button
                disabled={!postContent.trim()}
                className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>投稿する</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QRコードモーダル */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">QRコード</h2>
              <button onClick={() => setShowQRModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-xl mb-6">
              <div className="bg-white p-4 rounded-lg">
                <QrCode className="w-full h-48 text-gray-300" />
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">
                このQRコードをスキャンして<br />友達追加しよう
              </p>
            </div>

            <button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>QRコードをスキャン</span>
            </button>
          </div>
        </div>
      )}

      {/* 友達検索モーダル */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="border-b p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">友達を探す</h2>
                <button onClick={() => setShowSearchModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="名前またはIDで検索"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <p className="text-center text-gray-500 py-8">
                名前またはIDを入力して検索してください
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
