import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { RotateCcw, Search, AlertTriangle, CheckCircle, X } from 'lucide-react';

export default function StoreRefund() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [refundReason, setRefundReason] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const transactions = [
    { id: 'TXN-001', customer: '田中太郎', amount: 1200, points: 120, date: '2024-01-15 14:30' },
    { id: 'TXN-002', customer: '佐藤花子', amount: 850, points: 85, date: '2024-01-15 14:15' },
    { id: 'TXN-003', customer: '山田次郎', amount: 2100, points: 210, date: '2024-01-15 13:45' },
  ];

  const handleRefund = () => {
    setShowConfirmModal(false);
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 500);
  };

  return (
    <>
      <Head>
        <title>返金処理 - Melty+ 店舗管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar currentPage="refund" />

        <main className="flex-1 lg:ml-64">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                返金処理
              </h1>
              <p className="text-sm text-gray-600 mt-1">取引の返金処理を行います</p>
            </div>
          </header>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">取引検索</h2>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="取引ID または 顧客名"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      onClick={() => setSelectedTransaction(tx)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedTransaction?.id === tx.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-mono text-sm text-gray-600">{tx.id}</p>
                          <p className="font-bold text-gray-900">{tx.customer}</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900">¥{tx.amount.toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-600 font-medium">{tx.points} pt</span>
                        <span className="text-gray-500">{tx.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">返金情報</h2>
                
                {selectedTransaction ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-gray-600 mb-3">選択された取引</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-700">取引ID</span>
                          <span className="font-mono font-semibold">{selectedTransaction.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">顧客名</span>
                          <span className="font-semibold">{selectedTransaction.customer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">返金額</span>
                          <span className="text-xl font-bold text-purple-600">¥{selectedTransaction.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">返却ポイント</span>
                          <span className="font-bold text-purple-600">{selectedTransaction.points} pt</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        返金理由 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        placeholder="返金の理由を入力してください"
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
                      <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-semibold mb-1">注意事項</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>返金処理は取り消しできません</li>
                          <li>ポイントも同時に返却されます</li>
                          <li>返金理由は記録に残ります</li>
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowConfirmModal(true)}
                      disabled={!refundReason.trim()}
                      className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      返金処理を実行
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <RotateCcw size={48} className="mb-3" />
                    <p>取引を選択してください</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 確認モーダル */}
      {showConfirmModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">返金確認</h3>
              <button onClick={() => setShowConfirmModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-semibold mb-2">この操作は取り消しできません</p>
                <p className="text-sm text-red-700">本当に返金処理を実行しますか？</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">返金額</p>
                <p className="text-2xl font-bold text-gray-900">¥{selectedTransaction.amount.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">返金理由</p>
                <p className="text-sm text-gray-900">{refundReason}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 px-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                キャンセル
              </button>
              <button onClick={handleRefund} className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 shadow-lg">
                返金実行
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 成功モーダル */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">返金完了</h3>
            <p className="text-gray-600 mb-6">返金処理が正常に完了しました</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setSelectedTransaction(null);
                setRefundReason('');
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 shadow-lg"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
}
