import { useState } from 'react'
import { useRouter } from 'next/router'
import UserLayout from '@/components/user/Layout'
import { 
  Plus,
  QrCode,
  User,
  MessageCircle,
  Users,
  UserPlus,
  Search,
  PenLine,
  Heart,
  Share2,
  MapPin
} from 'lucide-react'

type TabType = 'my-posts' | 'feed' | 'friends' | 'requests' | 'search'

export default function SocialPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('my-posts')

  const userInfo = {
    name: 'test_user',
    email: 'test@example.com',
    avatar: '😊',
    posts: 0,
    friends: 0,
    points: '12.5K'
  }

  return (
    <UserLayout title="ソーシャル - Melty+">
      <div className="px-3 sm:px-4 py-4">
        <div className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-30 -mx-3 sm:-mx-4 px-3 sm:px-4">
            <nav className="flex justify-between sm:justify-start sm:space-x-6">
              <button
                onClick={() => setActiveTab('my-posts')}
                className={`flex flex-col sm:flex-row items-center justify-center sm:space-x-2 py-3 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 min-w-0 flex-1 sm:flex-none ${
                  activeTab === 'my-posts'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 active:text-pink-500'
                }`}
              >
                <div className="relative">
                  <User className="h-4 w-4 sm:h-4 sm:w-4" />
                </div>
                <span className="mt-1 sm:mt-0 text-center leading-tight">マイ投稿</span>
              </button>

              <button
                onClick={() => setActiveTab('feed')}
                className={`flex flex-col sm:flex-row items-center justify-center sm:space-x-2 py-3 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 min-w-0 flex-1 sm:flex-none ${
                  activeTab === 'feed'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 active:text-pink-500'
                }`}
              >
                <div className="relative">
                  <MessageCircle className="h-4 w-4 sm:h-4 sm:w-4" />
                </div>
                <span className="mt-1 sm:mt-0 text-center leading-tight">フィード</span>
              </button>

              <button
                onClick={() => setActiveTab('friends')}
                className={`flex flex-col sm:flex-row items-center justify-center sm:space-x-2 py-3 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 min-w-0 flex-1 sm:flex-none ${
                  activeTab === 'friends'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 active:text-pink-500'
                }`}
              >
                <div className="relative">
                  <Users className="h-4 w-4 sm:h-4 sm:w-4" />
                </div>
                <span className="mt-1 sm:mt-0 text-center leading-tight">友達</span>
              </button>

              <button
                onClick={() => setActiveTab('requests')}
                className={`flex flex-col sm:flex-row items-center justify-center sm:space-x-2 py-3 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 min-w-0 flex-1 sm:flex-none ${
                  activeTab === 'requests'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 active:text-pink-500'
                }`}
              >
                <div className="relative">
                  <UserPlus className="h-4 w-4 sm:h-4 sm:w-4" />
                </div>
                <span className="mt-1 sm:mt-0 text-center leading-tight">申請</span>
              </button>

              <button
                onClick={() => setActiveTab('search')}
                className={`flex flex-col sm:flex-row items-center justify-center sm:space-x-2 py-3 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 min-w-0 flex-1 sm:flex-none ${
                  activeTab === 'search'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 active:text-pink-500'
                }`}
              >
                <div className="relative">
                  <Search className="h-4 w-4 sm:h-4 sm:w-4" />
                </div>
                <span className="mt-1 sm:mt-0 text-center leading-tight">検索</span>
              </button>
            </nav>
          </div>
        </div>

        <div className="px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-6">
          <div className="space-y-4 sm:space-y-6">
            {activeTab === 'my-posts' && (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-5 border border-pink-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl">
                      {userInfo.avatar}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{userInfo.name}</h2>
                      <p className="text-sm sm:text-base text-gray-600">{userInfo.email}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-bold text-pink-600">{userInfo.posts}</div>
                          <div className="text-xs sm:text-sm text-gray-500">投稿</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-bold text-pink-600">{userInfo.friends}</div>
                          <div className="text-xs sm:text-sm text-gray-500">友達</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-bold text-pink-600">{userInfo.points}</div>
                          <div className="text-xs sm:text-sm text-gray-500">ポイント</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">マイ投稿 ({userInfo.posts})</h3>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm sm:text-base">新規投稿</span>
                    </button>
                  </div>

                  <div className="text-center py-12">
                    <PenLine className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">まだ投稿がありません</p>
                    <p className="text-gray-400 text-sm mb-4">「新規投稿」ボタンから最初の投稿をしてみましょう!</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 shadow-md active:scale-95 transition-all duration-200">
                      投稿を作成
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'feed' && (
              <div className="space-y-4 sm:space-y-6">
                {/* 検索バー */}
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="投稿を検索..."
                      className="w-full pl-10 pr-4 py-2 sm:py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* 投稿カード */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 border border-pink-100">
                  {/* ユーザー情報 */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-lg sm:text-xl">
                      🌸
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-gray-800 text-sm sm:text-base">yuki_tanako</h4>
                        <span className="text-xs text-gray-500">2時間前</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs sm:text-sm text-pink-600">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>オーガニック カフェ リーフ - 東京都渋谷区</span>
                      </div>
                    </div>
                  </div>

                  {/* 評価 */}
                  <div className="flex items-center space-x-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400 text-lg sm:text-xl">⭐</span>
                    ))}
                    <span className="text-pink-600 font-bold ml-2 text-sm sm:text-base">5</span>
                  </div>

                  {/* 投稿内容 */}
                  <p className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">
                    オーガニック カフェ リーフで素敵なランチを楽しみました！野菜たっぷりのサラダが美味しくて、とても健康的でした。店員さんも親切で、居心地の良い空間でした ✨
                  </p>

                  {/* 投稿画像 */}
                  <div className="mb-4 rounded-xl sm:rounded-2xl overflow-hidden">
                    <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-green-200 via-blue-200 to-cyan-300 flex items-center justify-center">
                      <span className="text-4xl sm:text-6xl">🥗🌿</span>
                    </div>
                  </div>

                  {/* ハッシュタグ */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs sm:text-sm">#カフェ</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs sm:text-sm">#オーガニック</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs sm:text-sm">#ヘルシー</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs sm:text-sm">#ランチ</span>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                    <button className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-pink-600 transition-colors">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">15</span>
                    </button>
                    <button className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-pink-600 transition-colors">
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">3</span>
                    </button>
                    <button className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-pink-600 transition-colors">
                      <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">シェア</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'friends' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">友達 (3)</h3>
                
                {/* 友達リスト */}
                <div className="space-y-3">
                  {/* 友達カード1 */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 border border-pink-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                          🌸
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base">yuki_tanako</h4>
                          <p className="text-xs sm:text-sm text-gray-500">15件の投稿</p>
                        </div>
                      </div>
                      <button className="px-3 sm:px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors text-xs sm:text-sm">
                        プロフィール
                      </button>
                    </div>
                  </div>

                  {/* 友達カード2 */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 border border-pink-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                          🎨
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base">sakura_chan</h4>
                          <p className="text-xs sm:text-sm text-gray-500">23件の投稿</p>
                        </div>
                      </div>
                      <button className="px-3 sm:px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors text-xs sm:text-sm">
                        プロフィール
                      </button>
                    </div>
                  </div>

                  {/* 友達カード3 */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 border border-pink-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                          🍀
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base">mikan_lover</h4>
                          <p className="text-xs sm:text-sm text-gray-500">8件の投稿</p>
                        </div>
                      </div>
                      <button className="px-3 sm:px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors text-xs sm:text-sm">
                        プロフィール
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">友達申請 (2)</h3>
                
                {/* 申請リスト */}
                <div className="space-y-3">
                  {/* 申請カード1 */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 border border-pink-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                          🎭
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base">hana_smile</h4>
                          <p className="text-xs sm:text-sm text-gray-500">共通の友達: 2人</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors text-xs sm:text-sm">
                          承認
                        </button>
                        <button className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm">
                          拒否
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 申請カード2 */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 border border-pink-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                          🌙
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base">night_walker</h4>
                          <p className="text-xs sm:text-sm text-gray-500">共通の友達: 5人</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors text-xs sm:text-sm">
                          承認
                        </button>
                        <button className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm">
                          拒否
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">ユーザー検索</h3>
                
                {/* 検索バー */}
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="ユーザー名やメールアドレスで検索..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* 検索結果 */}
                <div className="space-y-3">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-700">検索結果 (4)</h4>
                  
                  {/* 検索結果カード1 */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 border border-pink-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                          ☀️
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base">sunny_day</h4>
                          <p className="text-xs sm:text-sm text-gray-500">sunny@example.com</p>
                        </div>
                      </div>
                      <button className="px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors text-xs sm:text-sm">
                        友達申請
                      </button>
                    </div>
                  </div>

                  {/* 検索結果カード2 */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 border border-pink-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                          🌊
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base">ocean_breeze</h4>
                          <p className="text-xs sm:text-sm text-gray-500">ocean@example.com</p>
                        </div>
                      </div>
                      <button className="px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors text-xs sm:text-sm">
                        友達申請
                      </button>
                    </div>
                  </div>

                  {/* 検索結果カード3 */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 border border-pink-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                          🦋
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base">butterfly_soul</h4>
                          <p className="text-xs sm:text-sm text-gray-500">butterfly@example.com</p>
                        </div>
                      </div>
                      <button className="px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors text-xs sm:text-sm">
                        友達申請
                      </button>
                    </div>
                  </div>

                  {/* 検索結果カード4 */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 border border-pink-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                          🌹
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base">rose_garden</h4>
                          <p className="text-xs sm:text-sm text-gray-500">rose@example.com</p>
                        </div>
                      </div>
                      <button className="px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors text-xs sm:text-sm">
                        友達申請
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
    </UserLayout>
  )
}
