import { useState } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/Sidebar';
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  RefreshCcw,
  Calendar
} from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  userName: string;
  storeName: string;
  amount: number;
  points: number;
  status: 'completed' | 'refunded' | 'pending';
}

export default function TransactionsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [transactions] = useState<Transaction[]>([
    {
      id: 1,
      date: '2024-10-23 14:30',
      userName: '田中太郎',
      storeName: 'カフェ・ド・パリ 梅田店',
      amount: 5000,
      points: 250,
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-10-23 12:15',
      userName: '佐藤花子',
      storeName: 'レストラン銀座',
      amount: 8000,
      points: 240,
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-10-22 18:45',
      userName: '高橋美咲',
      storeName: 'イタリアンキッチン',
      amount: 12000,
      points: 480,
      status: 'refunded'
    }
  ]);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '完了';
      case 'refunded': return '返金済み';
      case 'pending': return '保留中';
      default: return '不明';
    }
  };

  return (
    <>
      <Head>
        <title>取引管理 - Melty+ 管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar currentPage="transactions" />

        <main className="flex-1 lg:ml-64">
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">取引管理</h1>
              <p className="text-gray-600 text-sm mt-1">取引履歴の閲覧・管理</p>
            </div>
          </header>

          <div className="p-6">
            {/* 検索・フィルター */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="ユーザー名、店舗名で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">全ステータス</option>
                  <option value="completed">完了</option>
                  <option value="refunded">返金済み</option>
                  <option value="pending">保留中</option>
                </select>

                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Download size={20} />
                  CSVエクスポート
                </button>
              </div>
            </div>

            {/* 取引一覧テーブル */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        取引ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        日時
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ユーザー
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        店舗
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        金額
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ポイント
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-600">
                          #{tx.id.toString().padStart(6, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tx.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {tx.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {tx.storeName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900">
                          ¥{tx.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-purple-600">
                          {tx.points}P
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                            {getStatusLabel(tx.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="詳細">
                              <Eye size={18} />
                            </button>
                            {tx.status === 'completed' && (
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="返金">
                                <RefreshCcw size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
