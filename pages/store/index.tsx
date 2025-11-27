import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { 
  Users, 
  Gift, 
  DollarSign, 
  Star,
  TrendingUp,
  ShoppingBag,
  Search,
  Bell,
  ChevronDown,
  CreditCard,
  Filter,
  Menu,
  User
} from 'lucide-react';

export default function StoreDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 統計データ(デモ用)
  const stats = [
    {
      icon: Users,
      label: '総会員数',
      value: '1,247',
      change: '+8.2%',
      sublabel: '今月の新規会員数'
    },
    {
      icon: Gift,
      label: '発行ポイント数',
      value: '48,500 pt',
      change: '+15.3%',
      sublabel: '今月の発行ポイント'
    },
    {
      icon: DollarSign,
      label: '総売上',
      value: '¥2,850,000',
      change: '+12.5%',
      sublabel: '今月の売上実績'
    },
    {
      icon: Star,
      label: '平均評価',
      value: '4.8',
      change: '+0.2',
      sublabel: '顧客満足度スコア'
    }
  ];

  // 最近の取引(デモ用)
  const recentTransactions = [
    {
      id: 1,
      customer: '田中太郎',
      initial: '田',
      amount: 1200,
      points: 120,
      paymentMethod: 'クレジットカード',
      status: '完了',
      time: '2024-01-15 14:30'
    },
    {
      id: 2,
      customer: '佐藤花子',
      initial: '佐',
      amount: 850,
      points: 85,
      paymentMethod: 'PayPay',
      status: '完了',
      time: '2024-01-15 14:15'
    },
    {
      id: 3,
      customer: '山田次郎',
      initial: '山',
      amount: 2100,
      points: 210,
      paymentMethod: '現金',
      status: '処理中',
      time: '2024-01-15 13:45'
    },
    {
      id: 4,
      customer: '鈴木美咲',
      initial: '鈴',
      amount: 650,
      points: 65,
      paymentMethod: 'クレジットカード',
      status: '完了',
      time: '2024-01-15 13:20'
    }
  ];

  // 今日の概要データ
  const todaySummary = [
    {
      label: '本日の取引数',
      value: '23',
      sublabel: '前日比 +5件',
      icon: TrendingUp,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      label: '今月の成長率',
      value: '+12.5%',
      sublabel: '前月比',
      icon: ShoppingBag,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-green-600'
    },
    {
      label: 'アクティブユーザー',
      value: '892',
      sublabel: '今日',
      icon: Users,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <>
      <Head>
        <title>Melty+ 店舗管理 - 店舗管理システム</title>
        <meta name="description" content="Melty+ 店舗管理 店舗管理システム" />
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* 背景グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100"></div>
        
        {/* ドットパターン */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0e7ff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        <div className="relative z-10">
          {/* サイドバー */}
          <StoreSidebar currentPage="dashboard" />

          {/* メインコンテンツ */}
          <div className="md:pl-64 flex flex-col flex-1">
            {/* ヘッダー */}
            <div className="sticky top-0 z-10 flex-shrink-0 flex h-14 bg-white/95 backdrop-blur-md shadow-sm border-b border-white/20">
              <button 
                className="px-3 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex-1 px-3 flex justify-between items-center">
                <div className="flex items-center">
                  <h1 className="text-lg font-semibold text-gray-900">ダッシュボード</h1>
                </div>

                <div className="flex items-center space-x-4">
                  {/* 検索バー */}
                  <div className="relative hidden md:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white/50 backdrop-blur-md placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                      placeholder="検索..."
                      type="search"
                    />
                  </div>

                  {/* 通知 */}
                  <button className="bg-white/50 backdrop-blur-md p-2 rounded-xl text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:bg-white/70">
                    <Bell className="h-5 w-5" />
                  </button>

                  {/* ユーザーメニュー */}
                  <div className="relative">
                    <button className="max-w-xs bg-white/50 backdrop-blur-md flex items-center text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 px-3 py-2 transition-all duration-300 hover:bg-white/70">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <span className="ml-2 text-gray-700 text-sm font-medium hidden md:block">店長</span>
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* メインコンテンツエリア */}
            <main className="flex-1">
              <div className="py-4">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
                  <div className="space-y-4">
                    {/* 統計カード */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                          <div 
                            key={index} 
                            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                                <Icon className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-green-100 text-green-700">
                                {stat.change}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                              <p className="text-xs text-gray-500">{stat.sublabel}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 取引とサマリー */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* 最近の取引 */}
                      <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                          <div className="px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <h3 className="text-base font-semibold text-gray-900">最近の取引</h3>
                              <div className="flex items-center space-x-2">
                                <select className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white">
                                  <option value="today">今日</option>
                                  <option value="week">今週</option>
                                  <option value="month">今月</option>
                                </select>
                                <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                                  <Filter className="w-3.5 h-3.5 inline mr-1" />
                                  フィルター
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    顧客
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    金額
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ポイント
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    支払方法
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    状態
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    時刻
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {recentTransactions.map((tx) => (
                                  <tr key={tx.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center">
                                          <span className="text-xs font-medium text-gray-700">
                                            {tx.initial}
                                          </span>
                                        </div>
                                        <div className="ml-2">
                                          <div className="text-sm font-medium text-gray-900">
                                            {tx.customer}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                                      ¥{tx.amount.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                      {tx.points} pt
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                      <div className="flex items-center">
                                        <CreditCard className="w-3.5 h-3.5 mr-1 text-gray-400" />
                                        {tx.paymentMethod}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                                        tx.status === '完了' 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {tx.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      {tx.time}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* 今日の概要 */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                          <h3 className="text-base font-semibold text-gray-900 mb-3">今日の概要</h3>
                          <div className="space-y-3">
                            {todaySummary.map((item, index) => {
                              const Icon = item.icon;
                              return (
                                <div key={index} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2.5">
                                    <div className={`w-9 h-9 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                                      <Icon className={`w-4 h-4 ${item.iconColor}`} />
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm text-gray-900">{item.label}</p>
                                      <p className="text-xs text-gray-500">{item.sublabel}</p>
                                    </div>
                                  </div>
                                  <span className={`text-lg font-bold ${item.valueColor || 'text-gray-900'}`}>
                                    {item.value}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
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
