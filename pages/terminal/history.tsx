import { useState } from 'react';
import { useRouter } from 'next/router';
import TerminalHead from '@/components/terminal/TerminalHead';
import { Store, History, Search, Filter, ArrowLeft } from 'lucide-react';

export default function TerminalHistory() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const transactions = [
    { id: 'TXN-2024-001', customer: '田中太郎', type: '決済', amount: 1200, points: 120, date: '2024-01-15 14:30', status: '完了' },
    { id: 'TXN-2024-002', customer: '佐藤花子', type: '決済', amount: 850, points: 85, date: '2024-01-15 14:15', status: '完了' },
    { id: 'TXN-2024-003', customer: '山田次郎', type: 'ポイント付与', amount: 0, points: 500, date: '2024-01-15 13:45', status: '完了' },
    { id: 'TXN-2024-004', customer: '鈴木美咲', type: '決済', amount: 2100, points: 210, date: '2024-01-15 13:20', status: '完了' },
    { id: 'TXN-2024-005', customer: '高橋健太', type: '決済', amount: 650, points: 65, date: '2024-01-15 12:50', status: '完了' },
  ];

  return (
    <>
      <TerminalHead title="取引履歴 - Melty+ Terminal" />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* 上部バナー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 sm:py-4 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Store size={24} className="sm:w-7 sm:h-7" />
              <div>
                <h1 className="text-base sm:text-xl font-bold">Melty+ Terminal</h1>
                <p className="text-xs sm:text-sm text-blue-100">取引履歴</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/terminal')}
              className="px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-lg text-sm sm:text-base font-medium transition-all flex items-center gap-2 min-h-[36px]"
            >
              <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">戻る</span>
            </button>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200">
              {/* 検索バー */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="取引ID、顧客名で検索..."
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border-2 border-blue-200 hover:border-blue-400 text-blue-600 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 min-h-[44px]">
                    <Filter size={18} className="sm:w-5 sm:h-5" />
                    <span>フィルター</span>
                  </button>
                </div>
              </div>

              {/* テーブル - デスクトップ表示 */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">取引ID</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">顧客名</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">種別</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">金額</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">ポイント</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">日時</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">状態</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm text-gray-600">{tx.id}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{tx.customer}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tx.type === '決済' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {tx.amount > 0 ? `¥${tx.amount.toLocaleString()}` : '-'}
                        </td>
                        <td className="px-6 py-4 font-bold text-blue-600">{tx.points} pt</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* カードリスト - モバイル/タブレット表示 */}
              <div className="lg:hidden divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 hover:bg-blue-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-mono text-xs sm:text-sm text-gray-600 mb-1">{tx.id}</p>
                        <p className="font-semibold text-sm sm:text-base text-gray-900">{tx.customer}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        tx.type === '決済' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {tx.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">金額</p>
                        <p className="font-bold text-gray-900">
                          {tx.amount > 0 ? `¥${tx.amount.toLocaleString()}` : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">ポイント</p>
                        <p className="font-bold text-blue-600">{tx.points} pt</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">日時</p>
                        <p className="text-xs text-gray-600">{tx.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ページネーション */}
              <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-gray-600">全 {transactions.length} 件の取引</p>
                <div className="flex gap-2">
                  <button className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed min-h-[36px]">
                    前へ
                  </button>
                  <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium min-h-[36px]">
                    1
                  </button>
                  <button className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-all min-h-[36px]">
                    2
                  </button>
                  <button className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-all min-h-[36px]">
                    次へ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
