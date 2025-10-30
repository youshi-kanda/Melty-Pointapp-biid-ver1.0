import { useState } from 'react'
import UserLayout from '@/components/user/Layout'
import { 
  Heart, Zap, MapPin, Users, Gift, 
  CreditCard, TrendingUp, Sparkles, Clock, Activity, Star,
  MessageCircle, ArrowRight, User
} from 'lucide-react'

export default function HomePage() {
  const [userName] = useState('ユーザーさん')
  const [userId] = useState('USER001')
  const [userLocation] = useState('東京都')
  const [points] = useState('48,800')

  const handleQuickAction = (action: string) => {
    window.location.href = `/user/${action}`
  }

  return (
    <UserLayout title="ホーム - Melty+">
      <div className="px-4 py-4">
        {/* クイックアクション */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 border border-pink-200 relative overflow-hidden">
          <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span>クイックアクション</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <button 
              onClick={() => handleQuickAction('map')}
              className="flex items-center space-x-3 p-3 rounded-2xl border border-pink-100 hover:border-pink-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-200 text-left group relative hover:shadow-lg transform hover:scale-[1.01] bg-gradient-to-br from-white to-pink-50"
            >
              <div className="bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl p-2.5 text-white group-hover:scale-105 transition-all duration-200 shadow-md">
                <MapPin className="w-[16px] h-[16px]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-0.5">
                  <h3 className="font-bold text-gray-800 text-sm group-hover:text-gray-900 truncate">店舗を探す</h3>
                </div>
                <p className="text-xs text-gray-600 font-medium line-clamp-1">近くの加盟店を地図で検索</p>
              </div>
              <ArrowRight className="w-[14px] h-[14px] text-pink-400 group-hover:text-pink-600 flex-shrink-0" />
            </button>

            <button 
              onClick={() => handleQuickAction('points')}
              className="flex items-center space-x-3 p-3 rounded-2xl border border-pink-100 hover:border-pink-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-200 text-left group relative hover:shadow-lg transform hover:scale-[1.01] bg-gradient-to-br from-white to-pink-50"
            >
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-2.5 text-white group-hover:scale-105 transition-all duration-200 shadow-md">
                <TrendingUp className="w-[16px] h-[16px]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-0.5">
                  <h3 className="font-bold text-gray-800 text-sm group-hover:text-gray-900 truncate">ポイント管理</h3>
                </div>
                <p className="text-xs text-gray-600 font-medium line-clamp-1">獲得・使用履歴を確認</p>
              </div>
              <ArrowRight className="w-[14px] h-[14px] text-pink-400 group-hover:text-pink-600 flex-shrink-0" />
            </button>

            <button 
              onClick={() => handleQuickAction('gifts')}
              className="flex items-center space-x-3 p-3 rounded-2xl border border-pink-100 hover:border-pink-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-200 text-left group relative hover:shadow-lg transform hover:scale-[1.01] bg-gradient-to-br from-white to-pink-50"
            >
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-2.5 text-white group-hover:scale-105 transition-all duration-200 shadow-md">
                <Gift className="w-[16px] h-[16px]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-0.5">
                  <h3 className="font-bold text-gray-800 text-sm group-hover:text-gray-900 truncate">ギフト交換</h3>
                </div>
                <p className="text-xs text-gray-600 font-medium line-clamp-1">素敵なギフトに交換</p>
              </div>
              <ArrowRight className="w-[14px] h-[14px] text-pink-400 group-hover:text-pink-600 flex-shrink-0" />
            </button>

            <button 
              onClick={() => handleQuickAction('profile')}
              className="flex items-center space-x-3 p-3 rounded-2xl border border-pink-100 hover:border-pink-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-200 text-left group relative hover:shadow-lg transform hover:scale-[1.01] bg-gradient-to-br from-white to-pink-50"
            >
              <div className="bg-gradient-to-r from-pink-400 to-rose-500 rounded-xl p-2.5 text-white group-hover:scale-105 transition-all duration-200 shadow-md">
                <User className="w-[16px] h-[16px]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-0.5">
                  <h3 className="font-bold text-gray-800 text-sm group-hover:text-gray-900 truncate">プロフィール</h3>
                </div>
                <p className="text-xs text-gray-600 font-medium line-clamp-1">アカウント情報を管理</p>
              </div>
              <ArrowRight className="w-[14px] h-[14px] text-pink-400 group-hover:text-pink-600 flex-shrink-0" />
            </button>

            <button 
              onClick={() => handleQuickAction('social')}
              className="flex items-center space-x-3 p-3 rounded-2xl border border-pink-100 hover:border-pink-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-200 text-left group relative hover:shadow-lg transform hover:scale-[1.01] bg-gradient-to-br from-white to-pink-50"
            >
              <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-xl p-2.5 text-white group-hover:scale-105 transition-all duration-200 shadow-md">
                <Users className="w-[16px] h-[16px]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-0.5">
                  <h3 className="font-bold text-gray-800 text-sm group-hover:text-gray-900 truncate">ソーシャル</h3>
                </div>
                <p className="text-xs text-gray-600 font-medium line-clamp-1">友達とつながろう</p>
              </div>
              <ArrowRight className="w-[14px] h-[14px] text-pink-400 group-hover:text-pink-600 flex-shrink-0" />
            </button>

            <button 
              onClick={() => window.location.href = '/user/favorites'}
              className="flex items-center space-x-3 p-3 rounded-2xl border border-pink-100 hover:border-pink-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-200 text-left group relative hover:shadow-lg transform hover:scale-[1.01] bg-gradient-to-br from-white to-pink-50"
            >
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl p-2.5 text-white group-hover:scale-105 transition-all duration-200 shadow-md">
                <Heart className="w-[16px] h-[16px]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-0.5">
                  <h3 className="font-bold text-gray-800 text-sm group-hover:text-gray-900 truncate">お気に入り</h3>
                </div>
                <p className="text-xs text-gray-600 font-medium line-clamp-1">保存した店舗を表示</p>
              </div>
              <ArrowRight className="w-[14px] h-[14px] text-pink-400 group-hover:text-pink-600 flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-3 border border-pink-200 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md mb-2">
                <Users className="w-5 h-5 text-pink-600" />
              </div>
              <div className="text-2xl font-black text-pink-600 leading-none mb-1">42</div>
              <p className="text-xs text-gray-600 font-medium">フレンド</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-2xl p-3 border border-pink-200 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md mb-2">
                <MessageCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-rose-600 leading-none mb-1">18</div>
              <p className="text-xs text-gray-600 font-medium">レビュー</p>
            </div>
          </div>
        </div>

        {/* 今日のアクティビティ */}
        <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-lg p-4 mb-4 border border-pink-200">
          <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span>今日のアクティビティ</span>
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white rounded-xl border border-pink-100 shadow-sm">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-5 h-5 text-pink-600" />
              </div>
              <div className="text-xl font-bold text-pink-600 mb-0.5">3</div>
              <p className="text-xs text-gray-600 font-medium">店舗訪問</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-pink-100 shadow-sm">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-rose-600" />
              </div>
              <div className="text-xl font-bold text-rose-600 mb-0.5">+850</div>
              <p className="text-xs text-gray-600 font-medium">獲得pt</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-pink-100 shadow-sm">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift className="w-5 h-5 text-pink-600" />
              </div>
              <div className="text-xl font-bold text-pink-600 mb-0.5">1</div>
              <p className="text-xs text-gray-600 font-medium">ギフト交換</p>
            </div>
          </div>
        </div>

        {/* 最近のアクティビティ */}
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-pink-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800 flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span>最近のアクティビティ</span>
            </h2>
            <button className="text-sm text-pink-600 hover:text-pink-800 font-semibold flex items-center space-x-1">
              <span>すべて見る</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-start space-x-2.5 p-2.5 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100">
              <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                🎁
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 mb-1.5 text-sm">コスメギフト券を交換しました</h3>
                <p className="text-gray-600 text-xs leading-relaxed mb-1.5">5,000ptを使用して人気のコスメギフト券と交換</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">2時間前</p>
                  <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">-5,000pt</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-2.5 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100">
              <div className="w-7 h-7 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                🏪
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 mb-1.5 text-sm">渋谷カフェ&バーでポイント獲得</h3>
                <p className="text-gray-600 text-xs leading-relaxed mb-1.5">お支払い3,500円で350ptを獲得しました</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">4時間前</p>
                  <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">+350pt</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-2.5 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-pink-100">
              <div className="w-7 h-7 bg-gradient-to-r from-rose-400 to-pink-400 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                ⭐
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 mb-1.5 text-sm">レビューを投稿してボーナスポイント</h3>
                <p className="text-gray-600 text-xs leading-relaxed mb-1.5">「銀座ラウンジ」に5つ星レビューを投稿</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">1日前</p>
                  <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">+100pt</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-2.5 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100">
              <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                ⚡
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 mb-1.5 text-sm">ポイント2倍キャンペーン開催中</h3>
                <p className="text-gray-600 text-xs leading-relaxed mb-1.5">対象店舗でのお買い物でポイント2倍獲得</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">2025年1月10日</p>
                  <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">開催中</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
