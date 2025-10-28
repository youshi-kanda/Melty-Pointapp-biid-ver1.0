import { useState } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/Sidebar';
import { 
  Download,
  TrendingUp,
  Users,
  Store,
  Gift,
  BarChart3
} from 'lucide-react';

export default function ReportsManagement() {
  const [dateRange, setDateRange] = useState('30days');

  return (
    <>
      <Head>
        <title>レポート - Melty+ 管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar currentPage="reports" />

        <main className="flex-1 lg:ml-64">
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">レポート</h1>
                <p className="text-gray-600 text-sm mt-1">統計データとレポート</p>
              </div>
              <div className="flex gap-2">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="7days">直近7日間</option>
                  <option value="30days">直近30日間</option>
                  <option value="90days">直近90日間</option>
                  <option value="1year">直近1年間</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Download size={20} />
                  PDFエクスポート
                </button>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* 統計サマリー */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: Users, label: 'ユーザー成長', value: '+12.5%', color: 'from-blue-500 to-blue-600' },
                { icon: Store, label: '店舗登録', value: '+8.2%', color: 'from-green-500 to-green-600' },
                { icon: TrendingUp, label: '取引増加', value: '+15.3%', color: 'from-purple-500 to-purple-600' },
                { icon: Gift, label: 'ギフト交換', value: '+9.1%', color: 'from-pink-500 to-pink-600' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} inline-block mb-4`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* グラフエリア */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ユーザー成長グラフ */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} />
                  ユーザー成長推移
                </h2>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400">グラフプレースホルダー</p>
                </div>
              </div>

              {/* 取引推移グラフ */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} />
                  取引額推移
                </h2>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-400">グラフプレースホルダー</p>
                </div>
              </div>

              {/* 人気ギフトランキング */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Gift size={20} />
                  人気ギフトランキング
                </h2>
                <div className="space-y-3">
                  {[
                    { name: 'スターバックスギフト券', count: 245 },
                    { name: 'Amazonギフト券', count: 198 },
                    { name: 'ファミマ商品券', count: 156 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-purple-600">#{index + 1}</span>
                        <span className="text-gray-900">{item.name}</span>
                      </div>
                      <span className="font-semibold text-gray-600">{item.count}回</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* エリア別統計 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Store size={20} />
                  エリア別統計
                </h2>
                <div className="space-y-3">
                  {[
                    { area: '大阪', percentage: 45 },
                    { area: '東京', percentage: 35 },
                    { area: '名古屋', percentage: 20 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900 font-medium">{item.area}</span>
                        <span className="text-purple-600 font-semibold">{item.percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
