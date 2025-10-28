import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ArrowLeft, Search, Filter, Download, DollarSign, Gift, TrendingUp, Calendar } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'payment' | 'points' | 'refund';
  amount: number;
  points: number;
  customerName: string;
  customerId: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function TransactionHistory() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'payment' | 'points' | 'refund'>('all');
  const [selectedDate, setSelectedDate] = useState('today');

  // モックデータ
  const transactions: Transaction[] = [
    {
      id: 'TXN20241024001',
      type: 'payment',
      amount: 3500,
      points: 35,
      customerName: '山田 太郎',
      customerId: 'M001234',
      timestamp: '2024-10-24 14:32:15',
      status: 'completed'
    },
    {
      id: 'PTS20241024002',
      type: 'points',
      amount: 0,
      points: 500,
      customerName: '佐藤 花子',
      customerId: 'M001235',
      timestamp: '2024-10-24 14:28:42',
      status: 'completed'
    },
    {
      id: 'TXN20241024003',
      type: 'payment',
      amount: 1200,
      points: 12,
      customerName: '鈴木 一郎',
      customerId: 'M001236',
      timestamp: '2024-10-24 14:15:33',
      status: 'completed'
    },
    {
      id: 'TXN20241024004',
      type: 'payment',
      amount: 5800,
      points: 58,
      customerName: '田中 美咲',
      customerId: 'M001237',
      timestamp: '2024-10-24 14:05:21',
      status: 'completed'
    },
    {
      id: 'REF20241024005',
      type: 'refund',
      amount: -2000,
      points: -20,
      customerName: '高橋 健太',
      customerId: 'M001238',
      timestamp: '2024-10-24 13:52:18',
      status: 'completed'
    }
  ];

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.customerName.includes(searchQuery) ||
      tx.customerId.includes(searchQuery) ||
      tx.id.includes(searchQuery);
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalAmount = transactions
    .filter(tx => tx.type === 'payment')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalPointsGiven = transactions
    .filter(tx => tx.type === 'points')
    .reduce((sum, tx) => sum + tx.points, 0);

  const transactionCount = transactions.length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign size={18} className="text-blue-600" />;
      case 'points':
        return <Gift size={18} className="text-green-600" />;
      case 'refund':
        return <TrendingUp size={18} className="text-orange-600 rotate-180" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'payment':
        return '決済';
      case 'points':
        return 'ポイント付与';
      case 'refund':
        return '返金';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleExport = () => {
    alert('CSV出力機能は開発中です');
  };

  const handleBack = () => {
    router.push('/terminal/');
  };

  return (
    <>
      <Head>
        <title>取引履歴 - Melty+ Terminal</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 shadow-md sticky top-0 z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <h1 className="text-lg sm:text-xl font-bold">取引履歴</h1>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors text-sm"
            >
              <Download size={16} />
              <span className="hidden sm:inline">CSV出力</span>
            </button>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="max-w-6xl mx-auto p-4">
          
          {/* サマリーカード */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">本日の取引数</span>
                <Calendar size={18} className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{transactionCount}件</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">決済合計</span>
                <DollarSign size={18} className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">¥{totalAmount.toLocaleString()}</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">付与ポイント</span>
                <Gift size={18} className="text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{totalPointsGiven.toLocaleString()}pt</div>
            </div>
          </div>

          {/* フィルターエリア */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 検索 */}
              <div className="sm:col-span-2">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="顧客名、会員ID、取引IDで検索"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 期間選択 */}
              <div>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="today">今日</option>
                  <option value="yesterday">昨日</option>
                  <option value="week">今週</option>
                  <option value="month">今月</option>
                </select>
              </div>
            </div>

            {/* タイプフィルター */}
            <div className="flex gap-2 mt-4">
              <Filter size={18} className="text-gray-600 mt-1.5" />
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'all', label: 'すべて' },
                  { value: 'payment', label: '決済' },
                  { value: 'points', label: 'ポイント付与' },
                  { value: 'refund', label: '返金' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setFilterType(value as any)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filterType === value
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 取引リスト */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">取引ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">種別</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">顧客</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">金額</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">ポイント</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">日時</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase">状態</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-gray-900">{tx.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(tx.type)}
                          <span className="text-sm text-gray-700">{getTypeLabel(tx.type)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{tx.customerName}</div>
                          <div className="text-xs text-gray-500">{tx.customerId}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-medium ${tx.amount >= 0 ? 'text-gray-900' : 'text-orange-600'}`}>
                          {tx.amount >= 0 ? '¥' : '-¥'}{Math.abs(tx.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-medium ${tx.points >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                          {tx.points >= 0 ? '+' : ''}{tx.points}pt
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{tx.timestamp}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(tx.status)}`}>
                          {tx.status === 'completed' ? '完了' : tx.status === 'pending' ? '処理中' : '失敗'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">該当する取引が見つかりませんでした</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
