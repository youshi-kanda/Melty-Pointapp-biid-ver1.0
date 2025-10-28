import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { 
  QrCode, 
  CreditCard,
  CheckCircle,
  X,
  Camera,
  DollarSign,
  Coins,
  User,
  Receipt,
  Printer,
  Download
} from 'lucide-react';

export default function StorePayment() {
  const [amount, setAmount] = useState('');
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [scanningQR, setScanningQR] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const handleQRScan = () => {
    setScanningQR(true);
    setTimeout(() => {
      setCustomerInfo({
        id: 'USER-001',
        name: '田中太郎',
        email: 'tanaka@example.com',
        currentPoints: 2450
      });
      setScanningQR(false);
    }, 2000);
  };

  const calculateFinalAmount = () => {
    const baseAmount = parseFloat(amount) || 0;
    const points = usePoints ? parseFloat(pointsToUse) || 0 : 0;
    return Math.max(0, baseAmount - points);
  };

  const handleConfirm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('金額を入力してください');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleExecutePayment = () => {
    setShowConfirmModal(false);
    const result = {
      transactionId: `TXN-${Date.now()}`,
      amount: parseFloat(amount),
      pointsUsed: usePoints ? parseFloat(pointsToUse) || 0 : 0,
      finalAmount: calculateFinalAmount(),
      timestamp: new Date().toLocaleString('ja-JP')
    };
    setPaymentResult(result);
    setShowReceiptModal(true);
  };

  const handleReset = () => {
    setAmount('');
    setCustomerInfo(null);
    setUsePoints(false);
    setPointsToUse('');
    setShowReceiptModal(false);
    setPaymentResult(null);
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <>
      <Head>
        <title>決済処理 - Melty+ 店舗管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar currentPage="payment" />

        <main className="flex-1 lg:ml-64">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                決済処理
              </h1>
              <p className="text-sm text-gray-600 mt-1">ポイント決済を処理します</p>
            </div>
          </header>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <QrCode size={20} className="text-purple-600" />
                    顧客QRコード
                  </h2>

                  {!customerInfo ? (
                    <div className="space-y-4">
                      <div 
                        className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                          scanningQR ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                        }`}
                        onClick={handleQRScan}
                      >
                        {scanningQR ? (
                          <>
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
                            <p className="mt-4 text-sm text-purple-600 font-medium">スキャン中...</p>
                          </>
                        ) : (
                          <>
                            <Camera size={48} className="text-gray-400 mb-3" />
                            <p className="text-sm font-medium text-gray-700">QRコードをスキャン</p>
                          </>
                        )}
                      </div>
                      <button
                        onClick={handleQRScan}
                        disabled={scanningQR}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50"
                      >
                        {scanningQR ? 'スキャン中...' : 'スキャン開始'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg">
                            {customerInfo.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{customerInfo.name}</p>
                            <p className="text-xs text-gray-600">{customerInfo.id}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-purple-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">利用可能ポイント</span>
                            <span className="text-lg font-bold text-purple-600">
                              {customerInfo.currentPoints.toLocaleString()} pt
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setCustomerInfo(null)}
                        className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                      >
                        別の顧客をスキャン
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="text-purple-600" />
                    決済金額
                  </h2>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      金額を入力してください
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="w-full pl-12 pr-16 py-4 text-3xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={!customerInfo}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">円</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      クイック選択
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {quickAmounts.map((quickAmount) => (
                        <button
                          key={quickAmount}
                          onClick={() => setAmount(quickAmount.toString())}
                          disabled={!customerInfo}
                          className="py-3 px-2 bg-gray-100 hover:bg-purple-100 border border-gray-300 hover:border-purple-400 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
                        >
                          ¥{quickAmount.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {customerInfo && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={usePoints}
                          onChange={(e) => setUsePoints(e.target.checked)}
                          className="w-5 h-5 text-purple-600 rounded"
                        />
                        <span className="font-medium text-gray-900">ポイントを使用する</span>
                      </label>
                      
                      {usePoints && (
                        <div className="mt-3">
                          <label className="block text-sm text-gray-600 mb-2">使用ポイント数</label>
                          <div className="relative">
                            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="number"
                              value={pointsToUse}
                              onChange={(e) => setPointsToUse(e.target.value)}
                              max={customerInfo.currentPoints}
                              placeholder="0"
                              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">pt</span>
                          </div>
                          <button
                            onClick={() => setPointsToUse(Math.min(customerInfo.currentPoints, parseFloat(amount) || 0).toString())}
                            className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                          >
                            全額ポイント使用
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {amount && parseFloat(amount) > 0 && (
                    <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                      <h3 className="font-bold text-gray-900 mb-4">決済内容</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">商品金額</span>
                          <span className="text-xl font-bold text-gray-900">¥{parseFloat(amount).toLocaleString()}</span>
                        </div>
                        {usePoints && pointsToUse && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">ポイント使用</span>
                            <span className="text-lg font-semibold text-purple-600">-{parseFloat(pointsToUse).toLocaleString()} pt</span>
                          </div>
                        )}
                        <div className="pt-3 border-t-2 border-purple-300 flex justify-between items-center">
                          <span className="text-gray-900 font-semibold">お支払い金額</span>
                          <span className="text-2xl font-bold text-purple-600">¥{calculateFinalAmount().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => { setAmount(''); setUsePoints(false); setPointsToUse(''); }}
                      className="flex-1 py-3 px-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                    >
                      クリア
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={!customerInfo || !amount || parseFloat(amount) <= 0}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50"
                    >
                      決済実行
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 確認モーダル */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">決済確認</h3>
              <button onClick={() => setShowConfirmModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">顧客名</p>
                <p className="font-bold text-gray-900">{customerInfo?.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">商品金額</p>
                <p className="text-2xl font-bold text-gray-900">¥{parseFloat(amount).toLocaleString()}</p>
              </div>
              {usePoints && pointsToUse && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 mb-1">ポイント使用</p>
                  <p className="text-xl font-bold text-purple-600">{parseFloat(pointsToUse).toLocaleString()} pt</p>
                </div>
              )}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                <p className="text-sm text-purple-600 mb-1">お支払い金額</p>
                <p className="text-2xl font-bold text-purple-600">¥{calculateFinalAmount().toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 px-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                キャンセル
              </button>
              <button onClick={handleExecutePayment} className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 shadow-lg">
                確定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* レシートモーダル */}
      {showReceiptModal && paymentResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">決済完了！</h3>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">取引ID</span>
                <span className="text-sm font-mono text-gray-900">{paymentResult.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">日時</span>
                <span className="text-sm text-gray-900">{paymentResult.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">商品金額</span>
                <span className="text-sm font-bold">¥{paymentResult.amount.toLocaleString()}</span>
              </div>
              {paymentResult.pointsUsed > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ポイント使用</span>
                  <span className="text-sm font-bold text-purple-600">-{paymentResult.pointsUsed.toLocaleString()} pt</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">支払額</span>
                <span className="text-xl font-bold text-purple-600">¥{paymentResult.finalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <button className="flex-1 py-2 px-4 bg-white border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                <Printer size={16} />
                印刷
              </button>
              <button className="flex-1 py-2 px-4 bg-white border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                <Download size={16} />
                保存
              </button>
            </div>

            <button onClick={handleReset} className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 shadow-lg">
              新しい決済を開始
            </button>
          </div>
        </div>
      )}
    </>
  );
}
