import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { Receipt, Search, Filter, Download, Printer, Eye, X, CreditCard, Coins } from 'lucide-react';

export default function StoreReceipt() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const receipts = [
    { id: 'TXN-001', customer: '田中太郎', amount: 1200, points: 120, paymentMethod: 'クレジットカード', status: '完了', date: '2024-01-15 14:30' },
    { id: 'TXN-002', customer: '佐藤花子', amount: 850, points: 85, paymentMethod: 'PayPay', status: '完了', date: '2024-01-15 14:15' },
    { id: 'TXN-003', customer: '山田次郎', amount: 2100, points: 210, paymentMethod: '現金', status: '返金済み', date: '2024-01-15 13:45' },
    { id: 'TXN-004', customer: '鈴木美咲', amount: 650, points: 65, paymentMethod: 'クレジットカード', status: '完了', date: '2024-01-15 13:20' },
    { id: 'TXN-005', customer: '高橋健太', amount: 3200, points: 320, paymentMethod: '現金', status: '完了', date: '2024-01-15 12:50' },
  ];

  return (
    <>
      <Head>
        <title>レシート管理 - Melty+ 店舗管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar currentPage="receipt" />

        <main className="flex-1 lg:ml-64">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                レシート管理
              </h1>
              <p className="text-sm text-gray-600 mt-1">取引履歴とレシートを管理します</p>
            </div>
          </header>

          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="取引ID、顧客名で検索..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                      <Filter size={18} />
                      フィルター
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center gap-2">
                      <Download size={18} />
                      エクスポート
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">取引ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">顧客</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金額</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ポイント</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">支払方法</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状態</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日時</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {receipts.map((receipt) => (
                      <tr key={receipt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm">{receipt.id}</td>
                        <td className="px-6 py-4 font-medium">{receipt.customer}</td>
                        <td className="px-6 py-4 font-semibold">¥{receipt.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 font-semibold text-purple-600">{receipt.points} pt</td>
                        <td className="px-6 py-4 text-sm">{receipt.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            receipt.status === '完了' ? 'bg-green-100 text-green-700' :
                            receipt.status === '返金済み' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {receipt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{receipt.date}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedReceipt(receipt)}
                            className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            <Eye size={18} className="text-purple-600" />
                          </button>
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

      {/* レシート詳細モーダル */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">レシート詳細</h3>
              <button onClick={() => setSelectedReceipt(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">取引ID</p>
                <p className="font-mono font-semibold">{selectedReceipt.id}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">顧客名</p>
                <p className="font-semibold">{selectedReceipt.customer}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">金額</p>
                <p className="text-2xl font-bold">¥{selectedReceipt.amount.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-600 mb-1">獲得ポイント</p>
                <p className="text-xl font-bold text-purple-600">{selectedReceipt.points} pt</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">支払方法</p>
                <p className="font-semibold flex items-center gap-2">
                  <CreditCard size={16} />
                  {selectedReceipt.paymentMethod}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">日時</p>
                <p className="font-semibold">{selectedReceipt.date}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-2 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                <Printer size={16} />
                印刷
              </button>
              <button className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2">
                <Download size={16} />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
