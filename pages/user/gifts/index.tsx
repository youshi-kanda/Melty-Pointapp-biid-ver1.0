import { useState } from 'react';
import Image from 'next/image';
import UserLayout from '@/components/user/Layout';
import { Heart, Gift, Send, Search, Filter, Zap, Clock, Users } from 'lucide-react';

export default function GiftsPage() {
  const [activeTab, setActiveTab] = useState<'gifts' | 'present'>('gifts');

  return (
    <UserLayout title="ギフト交換 - Melty+">
      <div className="px-4 py-6">
          <div className="space-y-6">
            {/* Page Title Card */}
            <div className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-pink-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      ギフト交換
                    </h1>
                    <p className="text-gray-600">貯めたポイントで素敵なギフトと交換しよう！</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-lg p-5 border border-pink-200 mb-6">
              <div className="flex space-x-1 bg-pink-50 rounded-2xl p-1">
                <button 
                  onClick={() => setActiveTab('gifts')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'gifts' 
                      ? 'bg-white text-pink-600 shadow-md' 
                      : 'text-gray-600 hover:text-pink-600'
                  }`}
                >
                  <Gift className="w-5 h-5" />
                  <span>ギフト交換</span>
                </button>
                <button 
                  onClick={() => setActiveTab('present')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'present' 
                      ? 'bg-white text-pink-600 shadow-md' 
                      : 'text-gray-600 hover:text-pink-600'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span>ポイントプレゼント</span>
                </button>
              </div>
            </div>

            {/* Gifts Tab Content */}
            {activeTab === 'gifts' && (
              <>
                {/* Search and Filter */}
                <div className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-pink-200">
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-pink-50/30"
                      placeholder="ギフトを検索..."
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select className="border border-pink-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-pink-50/30 min-w-[150px]">
                    <option value="">すべてのカテゴリ</option>
                    <option value="1">デジタルギフト</option>
                    <option value="2">商品券・クーポン</option>
                    <option value="3">現物商品</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Gift Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Gift Card 1 - Amazon */}
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-pink-200 hover:shadow-xl hover:bg-pink-50 transition-all duration-200">
                <div className="aspect-w-16 aspect-h-9 mb-4 relative h-48">
                  <Image
                    src="https://picsum.photos/300/200?random=1"
                    alt="Amazonギフト券 500円分"
                    width={300}
                    height={200}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 line-clamp-2">Amazonギフト券 500円分</h3>
                      <p className="text-sm text-gray-600">Amazon</p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                      <Zap className="w-4 h-4" />
                      <span>デジタル</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">Amazon.co.jpで使用できるギフト券です</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-purple-600">500pt</span>
                      <span className="text-sm text-gray-500">(¥500)</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>245回交換</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <span className="text-green-600">在庫潤沢</span>
                    </div>
                    <button className="btn-primary text-sm py-2 px-4">交換する</button>
                  </div>
                </div>
              </div>

              {/* Gift Card 2 - Starbucks */}
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-pink-200 hover:shadow-xl hover:bg-pink-50 transition-all duration-200">
                <div className="aspect-w-16 aspect-h-9 mb-4 relative h-48">
                  <Image
                    src="https://picsum.photos/300/200?random=2"
                    alt="スターバックス ドリンクチケット"
                    width={300}
                    height={200}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 line-clamp-2">スターバックス ドリンクチケット</h3>
                      <p className="text-sm text-gray-600">スターバックス</p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                      <Gift className="w-4 h-4" />
                      <span>バウチャー</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">スターバックスで使えるドリンクチケット</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-purple-600">600pt</span>
                      <span className="text-sm text-gray-500">(¥600)</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>156回交換</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <span>残り 50個</span>
                    </div>
                    <button className="btn-primary text-sm py-2 px-4">交換する</button>
                  </div>
                </div>
              </div>
            </div>
              </>
            )}

            {/* Point Present Tab Content */}
            {activeTab === 'present' && (
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-pink-200 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                  <span>ポイントプレゼント</span>
                </h2>
                <p className="text-sm text-gray-600 mb-6">友達にポイントをプレゼントしよう</p>

                {/* Friends Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-pink-50/30"
                      placeholder="友達を検索..."
                    />
                  </div>
                </div>

                {/* Friends List */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-200 border-gray-200 hover:border-pink-300 hover:bg-pink-50/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                        雪
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">雪 田中</p>
                        <p className="text-sm text-gray-500">@yuki_tanaka</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-600">オンライン</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-200 border-gray-200 hover:border-pink-300 hover:bg-pink-50/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                        正
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">正 佐藤</p>
                        <p className="text-sm text-gray-500">@masa_sato</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <span className="text-xs text-gray-500">オフライン</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all duration-200 border-gray-200 hover:border-pink-300 hover:bg-pink-50/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                        愛
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">愛 山田</p>
                        <p className="text-sm text-gray-500">@ai_yamada</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-600">オンライン</span>
                    </div>
                  </div>
                </div>

                {/* Present Button */}
                <div className="text-center">
                  <button 
                    disabled
                    className="px-6 py-3 rounded-2xl font-medium transition-all duration-200 bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    ポイントをプレゼントする
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
    </UserLayout>
  );
}
