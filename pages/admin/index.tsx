import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminSidebar from '../../components/admin/Sidebar';
import { 
  Users, 
  Store, 
  Activity,
  Shield,
  Home,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  RefreshCw,
  Zap,
  CreditCard,
  ArrowUp,
  DollarSign,
  ChevronRight,
  Crown,
  BarChart3,
  Settings
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState('24h');

  // アラートデータ
  const alerts = [
    {
      id: 1,
      title: '不審なアクセス検知',
      description: 'IP: 192.168.1.100 から異常なアクセスパターンを検知しました',
      severity: 'high',
      time: '30分前',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-200'
    },
    {
      id: 2,
      title: 'データベース接続警告',
      description: '接続プールの使用率が80%を超えています',
      severity: 'medium',
      time: '1時間前',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200'
    }
  ];

  // クイックアクション
  const quickActions = [
    {
      title: '払戻申請管理',
      description: '店舗からの申請確認',
      icon: CreditCard,
      color: 'slate',
      bgColor: 'bg-slate-700',
      iconColor: 'text-slate-300',
      hoverColor: 'hover:border-slate-600 hover:bg-slate-600'
    },
    {
      title: '店舗管理',
      description: '店舗情報・承認',
      icon: Store,
      color: 'slate',
      bgColor: 'bg-slate-700',
      iconColor: 'text-slate-300',
      hoverColor: 'hover:border-slate-600 hover:bg-slate-600'
    },
    {
      title: 'ユーザー管理',
      description: '会員情報・ランク',
      icon: Users,
      color: 'slate',
      bgColor: 'bg-slate-700',
      iconColor: 'text-slate-300',
      hoverColor: 'hover:border-slate-600 hover:bg-slate-600'
    },
    {
      title: 'システム設定',
      description: '運営・手数料設定',
      icon: Zap,
      color: 'slate',
      bgColor: 'bg-slate-700',
      iconColor: 'text-slate-300',
      hoverColor: 'hover:border-slate-600 hover:bg-slate-600'
    }
  ];

  // 統計データ
  const stats = [
    {
      title: '総ユーザー数',
      value: '15,420',
      change: '+12.5%',
      icon: Users,
      bgColor: 'bg-slate-700',
      iconColor: 'text-slate-300'
    },
    {
      title: '総売上',
      value: '12,450,000',
      change: '+8.3%',
      icon: null,
      bgColor: 'bg-slate-700',
      iconColor: 'text-slate-300',
      customIcon: '¥'
    },
    {
      title: '取引数',
      value: '45,789',
      change: '+15.2%',
      icon: Activity,
      bgColor: 'bg-slate-700',
      iconColor: 'text-slate-300'
    },
    {
      title: '加盟店数',
      value: '284',
      change: '+3.8%',
      icon: Store,
      bgColor: 'bg-slate-700',
      iconColor: 'text-slate-300'
    }
  ];

  // 最近のアクティビティ
  const recentActivities = [
    {
      id: 1,
      title: '新規ユーザー登録',
      description: 'user_12345 が新規登録しました',
      time: '2分前',
      icon: Users,
      bgColor: 'bg-slate-700',
      iconColor: 'text-slate-300'
    },
    {
      id: 2,
      title: '決済完了',
      description: 'オーガニック カフェ リーフで5,000円の決済',
      time: '5分前',
      amount: '¥5,000',
      icon: DollarSign,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      title: '店舗承認',
      description: '新規店舗「グリーンカフェ渋谷店」が承認されました',
      time: '12分前',
      icon: Store,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 4,
      title: 'システムアラート',
      description: 'API応答時間が一時的に増加しています',
      time: '18分前',
      icon: AlertTriangle,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ];

  // システム状態
  const systemStatus = [
    {
      name: 'API サーバー',
      status: '正常稼働中',
      color: 'bg-green-500'
    },
    {
      name: 'データベース',
      status: '正常稼働中',
      color: 'bg-green-500'
    },
    {
      name: '決済システム',
      status: '軽微な遅延',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <>
      <Head>
        <title>ダッシュボード - Melty+ 管理画面</title>
        <meta name="description" content="Melty+ Admin Dashboard" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* サイドバー */}
        <AdminSidebar currentPage="dashboard" />

        {/* メインコンテンツ */}
        <div className="md:pl-64 flex flex-col flex-1">
          {/* トップバー */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-14 bg-white shadow-sm border-b border-slate-200">
            <button
              className="px-4 border-r border-slate-200 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 px-4 flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-lg font-semibold text-slate-900">ダッシュボード</h1>
              </div>

              <div className="flex items-center space-x-3">
                <button className="bg-white p-1.5 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                  <Bell className="h-5 w-5" />
                </button>

                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-900">運営</p>
                    <p className="text-xs text-slate-500">admin@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* メインコンテンツエリア */}
          <main className="flex-1">
            <div className="py-3">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="space-y-3">
                  {/* ヘッダーセクション */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h1 className="text-xl font-bold text-slate-900">ダッシュボード</h1>
                      <p className="text-slate-600 text-sm mt-0.5">システム全体の状況を確認できます</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <select
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white shadow-sm text-sm min-w-[140px]"
                      >
                        <option value="24h">過去24時間</option>
                        <option value="7d">過去7日間</option>
                        <option value="30d">過去30日間</option>
                        <option value="90d">過去90日間</option>
                      </select>

                      <button className="flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors shadow-sm text-sm">
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>更新</span>
                      </button>
                    </div>
                  </div>

                  {/* アクティブアラート */}
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900 flex items-center">
                          <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
                          アクティブなアラート
                        </h2>
                        <button className="text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors">
                          すべて表示
                        </button>
                      </div>
                    </div>

                    <div className="p-3 space-y-2.5">
                      {alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-lg border ${alert.bgColor} ${alert.textColor} ${alert.borderColor} transition-all duration-200 hover:shadow-sm`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold text-sm">{alert.title}</span>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${alert.bgColor} ${alert.textColor} ${alert.borderColor}`}>
                                  {alert.severity}
                                </span>
                              </div>
                              <p className="text-sm text-slate-700 mb-1 leading-relaxed">
                                {alert.description}
                              </p>
                              <p className="text-xs text-slate-500">{alert.time}</p>
                            </div>
                            <button className="ml-3 px-2.5 py-1 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-medium transition-all duration-200 rounded-lg">
                              対応
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* クイックアクション */}
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-200">
                      <h2 className="text-base font-semibold text-slate-900 flex items-center">
                        <Zap className="w-4 h-4 text-slate-600 mr-2" />
                        クイックアクション
                      </h2>
                    </div>

                    <div className="p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        {quickActions.map((action, index) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={index}
                              className="flex items-center space-x-2 p-2.5 rounded-lg border border-slate-200 hover:border-slate-600 hover:bg-slate-50 transition-all duration-200"
                            >
                              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                                <Icon className="w-4 h-4 text-slate-300" />
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-slate-900 text-sm">{action.title}</p>
                                <p className="text-xs text-slate-500">{action.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 統計カード */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={index}
                          className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 transition-all duration-200 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-2">
                              <p className="text-xs font-medium text-slate-600 mb-1">{stat.title}</p>
                              <p className="text-lg font-bold text-slate-900 mb-1.5 break-words">
                                {stat.value}
                              </p>
                              <div className="flex items-center">
                                <ArrowUp className="w-3 h-3 text-green-500 mr-0.5 flex-shrink-0" />
                                <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                                <span className="text-xs text-slate-500 ml-1">前期比</span>
                              </div>
                            </div>
                            <div className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                              {stat.customIcon ? (
                                <span className="text-slate-300 font-bold text-base">
                                  {stat.customIcon}
                                </span>
                              ) : Icon ? (
                                <Icon className="w-4 h-4 text-slate-300" />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 最近のアクティビティ */}
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900">最近のアクティビティ</h2>
                        <button className="text-sm text-slate-600 hover:text-slate-800 flex items-center font-medium transition-colors">
                          すべて表示
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 space-y-2">
                      {recentActivities.map((activity) => {
                        const Icon = activity.icon;
                        return (
                          <div
                            key={activity.id}
                            className="flex items-start space-x-2.5 p-2.5 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-700 text-slate-300">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 mb-0.5">{activity.title}</p>
                              <p className="text-xs text-slate-600 leading-relaxed mb-0.5">
                                {activity.description}
                              </p>
                              <p className="text-xs text-slate-500">{activity.time}</p>
                            </div>
                            {activity.amount && (
                              <div className="text-sm font-semibold text-slate-900 flex-shrink-0">
                                {activity.amount}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* システム状態 */}
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-200">
                      <h2 className="text-base font-semibold text-slate-900">システム状態</h2>
                    </div>

                    <div className="p-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {systemStatus.map((system, index) => (
                          <div key={index} className={`flex items-center space-x-2.5 p-2.5 ${system.color === 'bg-green-500' ? 'bg-green-50' : 'bg-yellow-50'} rounded-lg`}>
                            <div className={`w-3 h-3 ${system.color} rounded-full flex-shrink-0`}></div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">{system.name}</p>
                              <p className="text-xs text-slate-600">{system.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
