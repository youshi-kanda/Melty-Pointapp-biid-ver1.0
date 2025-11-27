import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import {
  Receipt,
  Search,
  Filter,
  Download,
  Eye,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle,
  Clock,
  Bell,
  User,
  ChevronDown,
  Menu
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  paymentMethod: string;
  paymentIcon: 'credit' | 'mobile' | 'bank';
  amount: number;
  fee: number;
  total: number;
  status: 'completed' | 'pending';
}

export default function StoreReceipt() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  // サンプルデータ
  const transactions: Transaction[] = [
    {
      id: 'TXN-20250106-001',
      date: '2025/01/06 19:30',
      paymentMethod: 'クレジットカード',
      paymentIcon: 'credit',
      amount: 10000,
      fee: 360,
      total: 10360,
      status: 'completed',
    },
    {
      id: 'TXN-20250105-002',
      date: '2025/01/05 23:20',
      paymentMethod: 'モバイル決済',
      paymentIcon: 'mobile',
      amount: 5000,
      fee: 180,
      total: 5180,
      status: 'completed',
    },
    {
      id: 'TXN-20250104-003',
      date: '2025/01/04 18:15',
      paymentMethod: '銀行振込',
      paymentIcon: 'bank',
      amount: 20000,
      fee: 0,
      total: 20000,
      status: 'completed',
    },
    {
      id: 'TXN-20250103-004',
      date: '2025/01/04 01:45',
      paymentMethod: 'クレジットカード',
      paymentIcon: 'credit',
      amount: 3000,
      fee: 108,
      total: 3108,
      status: 'pending',
    },
  ];

  // 統計計算
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter((t) => t.status === 'completed').length;
  const totalAmount = transactions.reduce((sum, t) => sum + t.total, 0);

  // アイコン取得
  const getPaymentIcon = (type: 'credit' | 'mobile' | 'bank') => {
    switch (type) {
      case 'credit':
        return <CreditCard className="w-5 h-5 text-gray-600" />;
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-gray-600" />;
      case 'bank':
        return <Building className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <>
      <Head>
        <title>レシート管理 - Melty+ 店舗管理</title>
      </Head>

      {/* 背景 */}
      <div className="min-h-screen relative overflow-hidden">
        {/* グラデーション背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100"></div>

        {/* ドットパターンオーバーレイ */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0e7ff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative z-10">
          <StoreSidebar currentPage="receipt" />

          {/* メインコンテンツエリア */}
          <div className="md:pl-64 flex flex-col flex-1">
            {/* トップバー */}
            <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/95 backdrop-blur-md shadow-sm border-b border-white/20">
              <button className="px-4 border-r border-white/20 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex-1 px-4 flex justify-between items-center">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">レシート管理</h1>
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
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <span className="ml-2 text-gray-700 text-sm font-medium hidden md:block">
                        店長
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* メインコンテンツ */}
            <main className="flex-1">
              <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                  <div className="space-y-6">
                    {/* ヘッダーカード */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                            <Receipt className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h1 className="text-2xl font-bold text-gray-900">レシート管理</h1>
                            <p className="text-gray-600">取引履歴の確認とレシート出力</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div>
                            <p className="text-sm text-gray-600">総取引数</p>
                            <p className="text-xl font-bold text-gray-900">{totalTransactions}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">完了済み</p>
                            <p className="text-xl font-bold text-green-600">{completedTransactions}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">総金額</p>
                            <p className="text-xl font-bold text-gray-900">¥{totalAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* フィルターカード */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* 検索 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">検索</label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="取引ID、決済方法で検索"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* ステータス */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
                          <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="all">すべて</option>
                            <option value="completed">完了</option>
                            <option value="pending">処理中</option>
                            <option value="failed">失敗</option>
                          </select>
                        </div>

                        {/* 期間 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">期間</label>
                          <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={periodFilter}
                            onChange={(e) => setPeriodFilter(e.target.value)}
                          >
                            <option value="all">すべて</option>
                            <option value="today">今日</option>
                            <option value="week">過去1週間</option>
                            <option value="month">過去1ヶ月</option>
                          </select>
                        </div>

                        {/* リセットボタン */}
                        <div className="flex items-end">
                          <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                            <Filter className="w-4 h-4" />
                            <span>リセット</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 取引履歴テーブル */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">取引履歴</h3>
                        <p className="text-sm text-gray-500">{totalTransactions}件の取引</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                取引情報
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                決済方法
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                金額
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                合計
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
                            {transactions.map((transaction) => (
                              <tr key={transaction.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                      {getPaymentIcon(transaction.paymentIcon)}
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                                      <div className="text-sm text-gray-500">{transaction.date}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{transaction.paymentMethod}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <div className="text-sm font-medium text-gray-900">
                                    ¥{transaction.amount.toLocaleString()}
                                  </div>
                                  {transaction.fee > 0 && (
                                    <div className="text-sm text-gray-500">手数料: ¥{transaction.fee}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <div className="text-sm font-semibold text-gray-900">
                                    ¥{transaction.total.toLocaleString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {transaction.status === 'completed' ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-100">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      完了
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-yellow-600 bg-yellow-100">
                                      <Clock className="w-3 h-3 mr-1" />
                                      処理中
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex items-center space-x-2">
                                    <button className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1">
                                      <Eye className="w-4 h-4" />
                                      <span>詳細</span>
                                    </button>
                                    <button className="text-green-600 hover:text-green-900 flex items-center space-x-1">
                                      <Download className="w-4 h-4" />
                                      <span>DL</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
