import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/Sidebar';
import { 
  Download,
  TrendingUp,
  Users,
  Store,
  Gift,
  BarChart3,
  Menu,
  Bell,
  User,
  LogOut,
  RefreshCw,
  ArrowUp,
  PieChart,
  MapPin,
  CreditCard,
  CheckCircle,
  FileSpreadsheet,
  FileText
} from 'lucide-react';

export default function ReportsManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'stores' | 'users' | 'gifts' | 'payments'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [dateRange, setDateRange] = useState('30days');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 統計データ
  const statistics = {
    totalRevenue: 47856320,
    revenueChange: 12.3,
    totalTransactions: 89234,
    averageTransaction: 3021,
    activeUsers: 12456,
    totalUsers: 15847,
    activeStores: 198,
    totalStores: 234,
    pointsIssued: 15234567,
    pointsUsed: 8456789,
    pointsUsageRate: 55.5,
    retentionRate: 78.5,
    conversionRate: 12.8,
    growthRate: 15.3,
    uptime: 99.8,
    paymentSuccess: 98.7,
    apiResponseTime: 245
  };

  return (
    <>
      <Head>
        <title>レポート・分析 - BIID Admin</title>
      </Head>

      <div className="flex min-h-screen bg-white">
        <AdminSidebar currentPage="reports" />

        <main className="flex-1 md:ml-64">
          {/* トップバー */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 h-14 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center justify-between">
              <button className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg">
                <Menu size={20} />
              </button>
              
              <div className="flex-1" />
              
              <div className="flex items-center gap-3">
                <button className="p-1.5 hover:bg-slate-100 rounded-lg relative">
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                      <User size={16} className="text-slate-600" />
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-slate-900">管理者</div>
                      <div className="text-xs text-slate-500">admin@biid.jp</div>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                      <button 
                        onClick={() => router.push('/admin/login')}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        ログアウト
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ヘッダー */}
          <div className="bg-white border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-lg font-bold text-slate-900">レポート・分析</h1>
                <p className="text-sm text-slate-600 mt-0.5">システム全体の統計データとパフォーマンス指標</p>
              </div>
              
              <div className="flex items-center gap-2">
                {/* 自動更新トグル */}
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm ${
                    autoRefresh 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <RefreshCw size={14} className={autoRefresh ? 'animate-spin' : ''} />
                  <span className="text-sm font-medium">自動更新</span>
                </button>

                {/* 期間選択 */}
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="7days">過去7日間</option>
                  <option value="30days">過去30日間</option>
                  <option value="90days">過去90日間</option>
                  <option value="1year">過去1年</option>
                </select>

                {/* エクスポートボタン */}
                <button className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm">
                  <Download size={14} />
                  <span className="text-sm font-medium">CSV</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm">
                  <FileSpreadsheet size={14} />
                  <span className="text-sm font-medium">Excel</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                  <FileText size={14} />
                  <span className="text-sm font-medium">PDF</span>
                </button>
              </div>
            </div>

            {/* タブナビゲーション */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { id: 'overview', label: '概要', icon: BarChart3 },
                { id: 'stores', label: '店舗分析', icon: Store },
                { id: 'users', label: 'ユーザー分析', icon: Users },
                { id: 'gifts', label: 'ギフト分析', icon: Gift },
                { id: 'payments', label: '決済分析', icon: CreditCard }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
                      activeTab === tab.id
                        ? 'bg-slate-600 text-white border-b-2 border-slate-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4">
            {/* タブコンテンツ */}
            {activeTab !== 'overview' ? (
              // 準備中表示
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <BarChart3 size={48} className="text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">データ分析準備中</h3>
                <p className="text-slate-600 text-center max-w-md mb-2">
                  {activeTab === 'stores' && '店舗別の詳細な分析データを準備しています。'}
                  {activeTab === 'users' && 'ユーザー行動分析データを準備しています。'}
                  {activeTab === 'gifts' && 'ギフト利用状況の分析データを準備しています。'}
                  {activeTab === 'payments' && '決済方法別の統計データを準備しています。'}
                </p>
                <p className="text-slate-500 text-sm">
                  運用データが蓄積され次第、詳細な分析情報を表示します
                </p>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="mt-6 px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  概要に戻る
                </button>
              </div>
            ) : (
              <>
                {/* メイン統計カード */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {/* 総売上 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">総売上</p>
                        <p className="text-lg font-bold text-gray-900">
                          ¥{statistics.totalRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2 bg-slate-600 rounded-lg">
                        <TrendingUp size={18} className="text-slate-300" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <ArrowUp size={14} className="text-green-600" />
                      <span className="text-green-600 font-medium">+{statistics.revenueChange}%</span>
                      <span className="text-gray-500">前期比</span>
                    </div>
                  </div>

                  {/* 総取引数 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">総取引数</p>
                        <p className="text-lg font-bold text-gray-900">
                          {statistics.totalTransactions.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2 bg-slate-600 rounded-lg">
                        <CreditCard size={18} className="text-slate-300" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      平均: ¥{statistics.averageTransaction.toLocaleString()}
                    </div>
                  </div>

                  {/* アクティブユーザー */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">アクティブユーザー</p>
                        <p className="text-lg font-bold text-gray-900">
                          {statistics.activeUsers.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2 bg-slate-600 rounded-lg">
                        <Users size={18} className="text-slate-300" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      総: {statistics.totalUsers.toLocaleString()}
                    </div>
                  </div>

                  {/* アクティブ店舗 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">アクティブ店舗</p>
                        <p className="text-lg font-bold text-gray-900">
                          {statistics.activeStores}
                        </p>
                      </div>
                      <div className="p-2 bg-slate-600 rounded-lg">
                        <Store size={18} className="text-slate-300" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      総: {statistics.totalStores}
                    </div>
                  </div>
                </div>

                {/* 詳細統計 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
                  {/* ポイント統計 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Gift size={18} className="text-slate-300" />
                  ポイント統計
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">発行済みポイント</span>
                      <span className="text-base font-bold text-gray-900">
                        {statistics.pointsIssued.toLocaleString()}pt
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-6000 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">使用済みポイント</span>
                      <span className="text-base font-bold text-gray-900">
                        {statistics.pointsUsed.toLocaleString()}pt
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${statistics.pointsUsageRate}%` }} />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">使用率</span>
                      <span className="text-lg font-bold text-slate-300">
                        {statistics.pointsUsageRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

                  {/* パフォーマンス指標 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 size={18} className="text-slate-300" />
                  パフォーマンス指標
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 bg-slate-600 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">継続率</span>
                    <span className="text-base font-bold text-slate-300">
                      {statistics.retentionRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">コンバージョン率</span>
                    <span className="text-base font-bold text-green-600">
                      {statistics.conversionRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-600 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">成長率</span>
                    <div className="flex items-center gap-1">
                      <ArrowUp size={14} className="text-slate-300" />
                      <span className="text-base font-bold text-slate-300">
                        {statistics.growthRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

                  {/* システム健全性 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  システム健全性
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">稼働率</span>
                      <span className="text-base font-bold text-green-600">
                        {statistics.uptime}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${statistics.uptime}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">決済成功率</span>
                      <span className="text-base font-bold text-slate-300">
                        {statistics.paymentSuccess}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-6000 rounded-full" style={{ width: `${statistics.paymentSuccess}%` }} />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">API応答時間</span>
                      <span className="text-lg font-bold text-gray-900">
                        {statistics.apiResponseTime}ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* グラフエリア */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="text-base font-bold text-gray-900 mb-3">売上推移</h3>
                <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                  <TrendingUp size={32} className="text-slate-400 mb-3" />
                  <p className="text-slate-600 font-medium mb-1">グラフ機能は準備中です</p>
                  <p className="text-slate-500 text-sm">データ蓄積後に表示されます</p>
                </div>
              </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="text-base font-bold text-gray-900 mb-3">ユーザー成長</h3>
                <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                  <Users size={32} className="text-slate-400 mb-3" />
                  <p className="text-slate-600 font-medium mb-1">グラフ機能は準備中です</p>
                  <p className="text-slate-500 text-sm">データ蓄積後に表示されます</p>
                </div>
              </div>
            </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
