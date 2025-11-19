import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminSidebar from '../../components/admin/Sidebar';
import { 
  Search, 
  Download,
  Activity,
  AlertTriangle,
  CreditCard,
  DollarSign,
  TrendingUp,
  Menu,
  Bell,
  User,
  LogOut
} from 'lucide-react';

interface Transaction {
  id: string;
  timestamp: string;
  userName: string;
  userId: string;
  storeName: string;
  storeId: string;
  type: 'point_grant' | 'point_redemption' | 'gift_exchange' | 'charge' | 'refund';
  amount: number;
  points: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded' | 'suspicious';
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
}

export default function TransactionsManagement() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // デモデータ（本番HTMLには表示なし）
  const [transactions] = useState<Transaction[]>([]);

  // 統計データ
  const stats = {
    totalTransactions: 15847,
    totalAmount: 47856320,
    successRate: 98.7,
    suspicious: 23
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesRisk = riskFilter === 'all' || tx.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesType && matchesRisk;
  });

  return (
    <>
      <Head>
        <title>取引管理 - Melty+ 管理</title>
      </Head>

      <div className="flex min-h-screen bg-white">
        {/* サイドバー */}
        <AdminSidebar currentPage="transactions" />

        {/* メインコンテンツ */}
        <main className="flex-1 md:ml-64">
          {/* トップバー */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-14 shadow-sm">
            <div className="h-full px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-1.5 hover:bg-slate-100 rounded-lg"
                >
                  <Menu size={20} />
                </button>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">取引管理</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="bg-white p-1.5 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                  <Bell size={18} />
                </button>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <User size={16} className="text-slate-600" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-900">運営</p>
                    <p className="text-xs text-slate-500">admin@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="space-y-3">
                {/* ヘッダー - アクションボタン */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-lg font-bold text-slate-900">取引管理</h1>
                    <p className="text-slate-600 text-sm">決済取引の監視・異常検知</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm">
                      <Activity size={14} />
                      <span className="hidden sm:inline">リアルタイム監視</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">
                      <Download size={14} />
                      <span className="hidden sm:inline">レポート</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                      <AlertTriangle size={14} />
                      <span className="hidden sm:inline">アラート</span>
                    </button>
                  </div>
                </div>

                {/* 統計カード */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="p-2 bg-slate-700 rounded-lg">
                        <CreditCard size={18} className="text-slate-300" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">総取引数</p>
                        <p className="text-lg font-bold text-gray-900">{stats.totalTransactions.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="p-2 bg-slate-700 rounded-lg">
                        <DollarSign size={18} className="text-slate-300" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">総取引額</p>
                        <p className="text-lg font-bold text-gray-900">¥{stats.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="p-2 bg-slate-700 rounded-lg">
                        <TrendingUp size={18} className="text-slate-300" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">成功率</p>
                        <p className="text-lg font-bold text-gray-900">{stats.successRate}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle size={18} className="text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600">要確認取引</p>
                        <p className="text-lg font-bold text-gray-900">{stats.suspicious}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 検索・フィルター */}
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="取引ID、ユーザー名、店舗名で検索..."
                          className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent w-full sm:w-80"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <select 
                          className="border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="all">全ステータス</option>
                          <option value="completed">完了</option>
                          <option value="pending">処理中</option>
                          <option value="failed">失敗</option>
                          <option value="refunded">返金済み</option>
                          <option value="suspicious">要確認</option>
                        </select>

                        <select 
                          className="border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                        >
                          <option value="all">全タイプ</option>
                          <option value="point_grant">ポイント付与</option>
                          <option value="point_redemption">ポイント使用</option>
                          <option value="gift_exchange">ギフト交換</option>
                          <option value="charge">チャージ</option>
                          <option value="refund">返金</option>
                        </select>

                        <select 
                          className="border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          value={riskFilter}
                          onChange={(e) => setRiskFilter(e.target.value)}
                        >
                          <option value="all">全リスク</option>
                          <option value="low">低リスク</option>
                          <option value="medium">中リスク</option>
                          <option value="high">高リスク</option>
                        </select>

                        <select 
                          className="border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                        >
                          <option value="today">今日</option>
                          <option value="week">過去7日</option>
                          <option value="month">過去30日</option>
                          <option value="all">全期間</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">並び順:</span>
                        <select 
                          className="border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <option value="timestamp">時刻</option>
                          <option value="amount">金額</option>
                          <option value="riskScore">リスクスコア</option>
                        </select>
                        <button 
                          className="px-2.5 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        >
                          {sortOrder === 'desc' ? '↓' : '↑'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 取引テーブル */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            取引ID
                          </th>
                          <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ユーザー
                          </th>
                          <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            店舗
                          </th>
                          <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            タイプ
                          </th>
                          <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            金額/ポイント
                          </th>
                          <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ステータス
                          </th>
                          <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            リスク
                          </th>
                          <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            日時
                          </th>
                          <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            アクション
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* データなし（本番HTMLと同じ） */}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ページネーション */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    0件中 0 - 0件を表示
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      disabled 
                      className="px-2.5 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      前へ
                    </button>
                    <span className="px-2.5 py-1.5 text-sm text-gray-700">
                      1 / 0
                    </span>
                    <button className="px-2.5 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      次へ
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
