import { useState } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/Sidebar';
import { 
  Users, 
  Store, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  ShoppingBag,
  Gift,
  Bell
} from 'lucide-react';

export default function AdminDashboard() {
  // 統計データ（デモ用）
  const stats = [
    {
      title: '総ユーザー数',
      value: '12,543',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'アクティブ店舗',
      value: '284',
      change: '+8.2%',
      trend: 'up',
      icon: Store,
      color: 'from-green-500 to-green-600'
    },
    {
      title: '今月の取引額',
      value: '¥8,429,000',
      change: '+15.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: '保留中の返金',
      value: '23',
      change: '-5.1%',
      trend: 'down',
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  // 最近のアクティビティ（デモ用）
  const recentActivities = [
    {
      id: 1,
      type: 'user',
      message: '新規ユーザー登録: 田中太郎さん',
      time: '5分前',
      icon: Users
    },
    {
      id: 2,
      type: 'store',
      message: '店舗承認待ち: カフェ・ド・パリ',
      time: '12分前',
      icon: Store
    },
    {
      id: 3,
      type: 'transaction',
      message: '取引完了: ¥5,000 - 梅田店',
      time: '25分前',
      icon: ShoppingBag
    },
    {
      id: 4,
      type: 'gift',
      message: 'ギフト交換: スターバックスギフト券',
      time: '1時間前',
      icon: Gift
    },
    {
      id: 5,
      type: 'alert',
      message: 'システムアラート: データベースバックアップ完了',
      time: '2時間前',
      icon: Bell
    }
  ];

  // クイックアクション
  const quickActions = [
    { 
      title: 'ユーザー管理', 
      description: 'ユーザーの閲覧・編集',
      href: '/admin/users',
      icon: Users,
      color: 'bg-blue-500'
    },
    { 
      title: '店舗管理', 
      description: '店舗の承認・管理',
      href: '/admin/stores',
      icon: Store,
      color: 'bg-green-500'
    },
    { 
      title: 'レポート', 
      description: '統計データの確認',
      href: '/admin/reports',
      icon: Activity,
      color: 'bg-purple-500'
    }
  ];

  return (
    <>
      <Head>
        <title>ダッシュボード - BIID 管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        {/* サイドバー */}
        <AdminSidebar currentPage="dashboard" />

        {/* メインコンテンツ */}
        <main className="flex-1 lg:ml-64">
          {/* ヘッダー */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
              <p className="text-gray-600 text-sm mt-1">システム全体の概要と最新情報</p>
            </div>
          </header>

          <div className="p-6">
            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
                
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <span className={`flex items-center gap-1 text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendIcon size={16} />
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 最近のアクティビティ */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">最近のアクティビティ</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Icon size={20} className="text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{activity.message}</p>
                          <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* クイックアクション */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">クイックアクション</h2>
                <div className="space-y-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <a
                        key={index}
                        href={action.href}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 ${action.color} rounded-lg group-hover:scale-110 transition-transform`}>
                            <Icon size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
