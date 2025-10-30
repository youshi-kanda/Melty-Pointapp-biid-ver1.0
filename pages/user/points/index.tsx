import UserLayout from '@/components/user/Layout';
import { CreditCard, TrendingUp, Gift, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function PointsPage() {
  return (
    <UserLayout title="ポイント - Melty+">
      <div className="px-4 py-4">
        {/* Current Balance */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 border border-pink-200">
          <h2 className="text-base font-bold text-gray-800 mb-2 flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span>現在のポイント残高</span>
          </h2>
          <div className="text-center py-2">
            <p className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-1">48,800</p>
            <p className="text-xs text-gray-600">利用可能ポイント</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Monthly Earned */}
          <div className="bg-white rounded-2xl shadow-lg p-3 border border-pink-200 text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mx-auto mb-1.5">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-0.5">2,850</h3>
            <p className="text-xs text-gray-600">今月獲得</p>
          </div>

          {/* Monthly Used */}
          <div className="bg-white rounded-2xl shadow-lg p-3 border border-pink-200 text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mx-auto mb-1.5">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-0.5">1,200</h3>
            <p className="text-xs text-gray-600">今月利用</p>
          </div>

          {/* Total Earned */}
          <div className="bg-white rounded-2xl shadow-lg p-3 border border-pink-200 text-center">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mx-auto mb-1.5">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-0.5">125,450</h3>
            <p className="text-xs text-gray-600">総獲得</p>
          </div>
        </div>

        {/* Point History */}
        <div className="bg-white rounded-2xl shadow-lg border border-pink-200">
          <div className="p-4 border-b border-pink-100">
            <h2 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </div>
              <span>ポイント履歴</span>
            </h2>
          </div>
          <div className="divide-y divide-pink-100">
              {/* History Item 1 - Purchase Points */}
              <div className="p-4 flex items-center justify-between hover:bg-pink-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-pink-100 to-rose-100">
                    <ArrowUpRight className="text-pink-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">購入ポイント</p>
                    <p className="text-sm text-gray-600">カフェ ドゥ ビート</p>
                    <p className="text-xs text-gray-400">2025-01-12</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-pink-600">+500pt</p>
              </div>

              {/* History Item 2 - Gift Exchange */}
              <div className="p-4 flex items-center justify-between hover:bg-pink-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-rose-100 to-pink-100">
                    <ArrowDownRight className="text-rose-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">ギフト交換</p>
                    <p className="text-sm text-gray-600">Amazonギフト券</p>
                    <p className="text-xs text-gray-400">2025-01-11</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-rose-600">-1,200pt</p>
              </div>

              {/* History Item 3 - Bonus Points */}
              <div className="p-4 flex items-center justify-between hover:bg-pink-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-pink-100 to-rose-100">
                    <ArrowUpRight className="text-pink-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">ボーナスポイント</p>
                    <p className="text-sm text-gray-600">レストラン バンビーノ</p>
                    <p className="text-xs text-gray-400">2025-01-10</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-pink-600">+300pt</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              ギフトと交換する
            </button>
            <button className="bg-white hover:bg-pink-50 text-gray-900 font-bold py-3 px-6 rounded-2xl border-2 border-pink-200 transition-all duration-200 hover:border-pink-300">
              ポイントが貯まる店舗を探す
            </button>
          </div>
        </div>
    </UserLayout>
  );
}
