import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { 
  Users, 
  Coins, 
  DollarSign, 
  Star,
  TrendingUp,
  TrendingDown,
  Search,
  Bell,
  ChevronDown,
  CreditCard,
  CheckCircle
} from 'lucide-react';

export default function StoreDashboard() {
  // 統計データ（デモ用）
  const stats = [
    {
      icon: Users,
      label: '総会員数',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      sublabel: '今月の新規会員数',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Coins,
      label: '発行ポイント数',
      value: '48,500 pt',
      change: '+15.3%',
      trend: 'up',
      sublabel: '今月の発行ポイント',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: DollarSign,
      label: '総売上',
      value: '¥2,850,000',
      change: '+12.5%',
      trend: 'up',
      sublabel: '今月の売上実績',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Star,
      label: '平均評価',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      sublabel: '顧客満足度スコア',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  // 最近の取引（デモ用）
  const recentTransactions = [
    {
      id: 1,
      customer: '田中太郎',
      amount: 1200,
      points: 120,
      paymentMethod: 'クレジットカード',
      status: '完了',
      time: '2024-01-15 14:30'
    },
    {
      id: 2,
      customer: '佐藤花子',
      amount: 850,
      points: 85,
      paymentMethod: 'PayPay',
      status: '完了',
      time: '2024-01-15 14:15'
    },
    {
      id: 3,
      customer: '山田次郎',
      amount: 2100,
      points: 210,
      paymentMethod: '現金',
      status: '処理中',
      time: '2024-01-15 13:45'
    },
    {
      id: 4,
      customer: '鈴木美咲',
      amount: 650,
      points: 65,
      paymentMethod: 'クレジットカード',
      status: '完了',
      time: '2024-01-15 13:20'
    }
  ];

  // 今日の概要データ
  const todaySummary = [
    { label: '本日の取引数', value: '23', sublabel: '前日比 +5件' },
    { label: '今日の成長率', value: '+12.5%', sublabel: '前日比' },
    { label: 'アクティブユーザー', value: '892', sublabel: '今日' }
  ];

  return (
    <>
      <Head>
        <title>ダッシュボード - Melty+ 店舗管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        {/* サイドバー */}
        <StoreSidebar currentPage="dashboard" />

        {/* メインコンテンツ */}
        <main className="flex-1 lg:ml-64">
          {/* ヘッダー */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ダッシュボード
              </h1>
              
              <div className="flex items-center gap-4">
                {/* 検索バー */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="検索..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                  />
                </div>

                {/* 通知アイコン */}
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* ユーザーメニュー */}
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                    店
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:block">店長</span>
                  <ChevronDown size={16} className="text-gray-600" />
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
                
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <span className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                        stat.trend === 'up' 
                          ? 'text-green-700 bg-green-50' 
                          : 'text-red-700 bg-red-50'
                      }`}>
                        <TrendIcon size={14} />
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.sublabel}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* 最近の取引 */}
              <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">最近の取引</h2>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      今日
                    </button>
                    <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1">
                      フィルター
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">顧客</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金額</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ポイント</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">支払方法</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状態</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">時刻</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                                {tx.customer.charAt(0)}
                              </div>
                              <span className="font-medium text-gray-900">{tx.customer}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900">¥{tx.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 font-semibold text-purple-600">{tx.points} pt</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-700">
                              <CreditCard size={16} />
                              <span className="text-sm">{tx.paymentMethod}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              tx.status === '完了' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{tx.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 今日の概要 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">今日の概要</h2>
                
                <div className="space-y-4">
                  {todaySummary.map((item, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle size={16} className="text-purple-600" />
                        <p className="text-sm text-gray-600">{item.label}</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{item.value}</p>
                      <p className="text-xs text-gray-500">{item.sublabel}</p>
                    </div>
                  ))}

                  {/* アクションボタン */}
                  <div className="pt-4 space-y-2">
                    <button className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl">
                      新規チャージ
                    </button>
                    <button className="w-full py-2.5 px-4 bg-white border-2 border-purple-200 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all">
                      レポート確認
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
