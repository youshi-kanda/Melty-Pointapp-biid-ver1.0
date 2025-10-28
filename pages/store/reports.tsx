import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { BarChart3, Download, Calendar, TrendingUp, Users, Coins, DollarSign } from 'lucide-react';

export default function StoreReports() {
  const [period, setPeriod] = useState('month');

  return (
    <>
      <Head>
        <title>レポート - Melty+ 店舗管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar currentPage="reports" />

        <main className="flex-1 lg:ml-64">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  レポート
                </h1>
                <p className="text-sm text-gray-600 mt-1">売上とポイント発行の統計を確認します</p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 shadow-lg">
                <Download size={18} />
                エクスポート
              </button>
            </div>
          </header>

          <div className="p-6">
            {/* 期間選択 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center gap-4">
                <Calendar size={20} className="text-purple-600" />
                <span className="font-medium text-gray-700">期間:</span>
                <div className="flex gap-2">
                  {['week', 'month', 'year'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        period === p
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {p === 'week' ? '週' : p === 'month' ? '月' : '年'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 統計サマリー */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <DollarSign size={24} className="text-white" />
                  </div>
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <h3 className="text-sm text-gray-600 font-medium mb-1">総売上</h3>
                <p className="text-2xl font-bold text-gray-900">¥2,850,000</p>
                <p className="text-sm text-green-600 font-medium mt-1">+12.5% 前月比</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                    <Coins size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 font-medium mb-1">発行ポイント</h3>
                <p className="text-2xl font-bold text-gray-900">48,500 pt</p>
                <p className="text-sm text-green-600 font-medium mt-1">+15.3% 前月比</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg">
                    <Users size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 font-medium mb-1">取引数</h3>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-sm text-green-600 font-medium mt-1">+8.2% 前月比</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                    <BarChart3 size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 font-medium mb-1">平均単価</h3>
                <p className="text-2xl font-bold text-gray-900">¥2,285</p>
                <p className="text-sm text-green-600 font-medium mt-1">+4.1% 前月比</p>
              </div>
            </div>

            {/* グラフエリア */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">売上推移</h2>
                <div className="h-64 flex items-end justify-around gap-2">
                  {[45, 52, 48, 61, 55, 68, 72].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg hover:from-purple-700 hover:to-pink-700 transition-all" style={{ height: `${height}%` }}></div>
                      <span className="text-xs text-gray-600">{i + 1}日</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">ポイント発行推移</h2>
                <div className="h-64 flex items-end justify-around gap-2">
                  {[38, 45, 42, 55, 48, 62, 68].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg hover:from-blue-600 hover:to-purple-600 transition-all" style={{ height: `${height}%` }}></div>
                      <span className="text-xs text-gray-600">{i + 1}日</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 顧客分析 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">顧客分析</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-600 mb-2">新規顧客</p>
                  <p className="text-3xl font-bold text-purple-600 mb-1">102人</p>
                  <p className="text-xs text-gray-600">今月の新規会員登録</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">リピート率</p>
                  <p className="text-3xl font-bold text-blue-600 mb-1">68.5%</p>
                  <p className="text-xs text-gray-600">2回以上利用した顧客</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-2">アクティブ率</p>
                  <p className="text-3xl font-bold text-green-600 mb-1">71.6%</p>
                  <p className="text-xs text-gray-600">過去30日以内に利用</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
