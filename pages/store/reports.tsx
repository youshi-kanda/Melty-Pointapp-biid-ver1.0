import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { 
  BarChart3, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Menu,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Star,
  Award
} from 'lucide-react';

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  // 統計データ
  const stats = {
    totalSales: 450000,
    salesGrowth: 12.5,
    totalTransactions: 234,
    transactionsGrowth: 8.3,
    totalCustomers: 189,
    customersGrowth: 15.2,
    averagePrice: 1923,
    priceGrowth: -2.1
  };

  // 月次推移データ
  const monthlyData = [
    { month: '2024-01', transactions: 198, customers: 156, sales: 380000, average: 1919 },
    { month: '2024-02', transactions: 216, customers: 172, sales: 420000, average: 1944 },
    { month: '2024-03', transactions: 234, customers: 189, sales: 450000, average: 1923 }
  ];

  // 人気商品ランキング
  const topProducts = [
    { rank: 1, name: 'ブレンドコーヒー', orders: 340, sales: 85000, percentage: 18.9 },
    { rank: 2, name: 'チーズケーキ', orders: 260, sales: 52000, percentage: 11.6 },
    { rank: 3, name: 'サンドイッチセット', orders: 160, sales: 48000, percentage: 10.7 },
    { rank: 4, name: 'アイスラテ', orders: 240, sales: 36000, percentage: 8.0 },
    { rank: 5, name: 'パスタランチ', orders: 80, sales: 32000, percentage: 7.1 }
  ];

  // ポイント分析
  const pointsData = {
    issued: 45000,
    used: 32000,
    usageRate: 71.1
  };

  // 顧客行動分析
  const customerBehavior = {
    newCustomers: { count: 28, percentage: 14.8 },
    repeatCustomers: { count: 161, percentage: 85.2 },
    averageVisits: 1.24,
    customerPrice: 2381
  };

  // 時間帯別分析
  const hourlyData = [
    { time: '9-11時', sales: 45000, percentage: 10 },
    { time: '11-13時', sales: 125000, percentage: 28 },
    { time: '13-15時', sales: 98000, percentage: 22 },
    { time: '15-17時', sales: 67000, percentage: 15 },
    { time: '17-19時', sales: 78000, percentage: 17 },
    { time: '19-21時', sales: 37000, percentage: 8 }
  ];

  const handleExport = () => {
    // エクスポート処理
    console.log('Exporting report...');
  };

  return (
    <>
      <Head>
        <title>月次レポート - Melty+ 店舗管理</title>
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100"></div>
        
        {/* Dot pattern overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0e7ff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        <div className="relative z-10">
        <StoreSidebar currentPage="reports" />

        <div className="md:pl-64 flex flex-col flex-1">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/95 backdrop-blur-md shadow-sm border-b border-white/20">
            <button className="px-4 border-r border-white/20 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 px-4 flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">月次レポート</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white/50 backdrop-blur-md placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                    placeholder="検索..."
                  />
                </div>
                <button className="bg-white/50 backdrop-blur-md p-2 rounded-xl text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:bg-white/70">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="relative">
                  <button className="max-w-xs bg-white/50 backdrop-blur-md flex items-center text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 px-3 py-2 transition-all duration-300 hover:bg-white/70">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="ml-2 text-gray-700 text-sm font-medium hidden md:block">店長</span>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="space-y-6">
                  {/* Header card */}
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">月次レポート</h1>
                          <p className="text-gray-600">売上・統計データの詳細分析</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <select
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="current">今月 (2024年3月)</option>
                          <option value="last">先月 (2024年2月)</option>
                          <option value="quarter">四半期</option>
                        </select>
                        <button
                          onClick={handleExport}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          <Download className="w-4 h-4" />
                          <span>エクスポート</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* 売上合計 */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">売上合計</p>
                          <p className="text-2xl font-bold text-gray-900">¥{stats.totalSales.toLocaleString()}</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">+{stats.salesGrowth}%</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </div>

                    {/* 取引数 */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">取引数</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">+{stats.transactionsGrowth}%</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    {/* 顧客数 */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">顧客数</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">+{stats.customersGrowth}%</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    {/* 平均単価 */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">平均単価</p>
                          <p className="text-2xl font-bold text-gray-900">¥{stats.averagePrice.toLocaleString()}</p>
                          <div className="flex items-center mt-1">
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                            <span className="text-sm text-red-600">{stats.priceGrowth}%</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 月次推移 & 人気商品ランキング */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 月次推移 */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">月次推移</h3>
                      <div className="space-y-4">
                        {monthlyData.map((data) => (
                          <div key={data.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{data.month}</p>
                              <p className="text-sm text-gray-600">{data.transactions}件 / {data.customers}人</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">¥{data.sales.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">平均: ¥{data.average.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 人気商品ランキング */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">人気商品ランキング</h3>
                      <div className="space-y-4">
                        {topProducts.map((product) => (
                          <div key={product.rank} className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                              <span className="text-sm font-semibold text-gray-700">{product.rank}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.orders}回注文</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">¥{product.sales.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">{product.percentage}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ポイント分析 & 顧客行動分析 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* ポイント分析 */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">ポイント分析</h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                          <div>
                            <p className="text-sm text-green-700">発行ポイント</p>
                            <p className="text-xl font-bold text-green-900">{pointsData.issued.toLocaleString()}pt</p>
                          </div>
                          <Star className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div>
                            <p className="text-sm text-blue-700">使用ポイント</p>
                            <p className="text-xl font-bold text-blue-900">{pointsData.used.toLocaleString()}pt</p>
                          </div>
                          <Award className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-2">ポイント利用率</p>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-blue-600 h-3 rounded-full" 
                              style={{ width: `${pointsData.usageRate}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{Math.round(pointsData.usageRate)}%</p>
                        </div>
                      </div>
                    </div>

                    {/* 顧客行動分析 */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">顧客行動分析</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">新規顧客</span>
                          <span className="font-semibold text-gray-900">
                            {customerBehavior.newCustomers.count}人 ({customerBehavior.newCustomers.percentage}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">リピート顧客</span>
                          <span className="font-semibold text-gray-900">
                            {customerBehavior.repeatCustomers.count}人 ({customerBehavior.repeatCustomers.percentage}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">平均来店回数</span>
                          <span className="font-semibold text-gray-900">{customerBehavior.averageVisits}回/人</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">顧客単価</span>
                          <span className="font-semibold text-gray-900">¥{customerBehavior.customerPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 時間帯別分析 */}
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">時間帯別分析</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {hourlyData.map((hour) => (
                        <div key={hour.time} className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-2">{hour.time}</p>
                          <p className="font-semibold text-gray-900">¥{hour.sales.toLocaleString()}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(hour.percentage / 28) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{hour.percentage}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        </div>
      </div>
    </>
  );
}
