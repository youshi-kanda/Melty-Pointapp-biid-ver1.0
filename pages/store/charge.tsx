import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { 
  QrCode, 
  CreditCard,
  AlertCircle,
  CheckCircle,
  X,
  Camera,
  Smartphone,
  DollarSign,
  Percent,
  User,
  Calendar,
  Clock
} from 'lucide-react';

export default function StoreCharge() {
  const [amount, setAmount] = useState('');
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [scanningQR, setScanningQR] = useState(false);

  // 還元率設定（デモ用）
  const rewardRate = 10; // 10%

  // 還元ポイント計算
  const calculatePoints = (amount: number) => {
    return Math.floor(amount * (rewardRate / 100));
  };

  // QRコードスキャン（デモ用）
  const handleQRScan = () => {
    setScanningQR(true);
    // デモ用: 2秒後に顧客情報を設定
    setTimeout(() => {
      setCustomerInfo({
        id: 'USER-001',
        name: '田中太郎',
        email: 'tanaka@example.com',
        currentPoints: 2450,
        memberSince: '2023-06-15'
      });
      setScanningQR(false);
    }, 2000);
  };

  // チャージ確認
  const handleConfirm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('金額を入力してください');
      return;
    }
    setShowConfirmModal(true);
  };

  // チャージ実行
  const handleExecuteCharge = () => {
    setShowConfirmModal(false);
    // デモ用: チャージ処理
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 500);
  };

  // リセット
  const handleReset = () => {
    setAmount('');
    setCustomerInfo(null);
    setShowSuccessModal(false);
  };

  // クイック金額選択
  const quickAmounts = [1000, 2000, 3000, 5000, 10000];

  return (
    <>
      <Head>
        <title>ポイントチャージ - Melty+ 店舗管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar currentPage="charge" />

        <main className="flex-1 lg:ml-64">
          {/* ヘッダー */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ポイントチャージ
              </h1>
              <p className="text-sm text-gray-600 mt-1">顧客アカウントにポイントをチャージします</p>
            </div>
          </header>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左側: QRスキャン & 顧客情報 */}
              <div className="lg:col-span-1 space-y-6">
                {/* QRスキャンエリア */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <QrCode size={20} className="text-purple-600" />
                    顧客QRコード
                  </h2>

                  {!customerInfo ? (
                    <div className="space-y-4">
                      <div 
                        className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                          scanningQR 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
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
                            <p className="text-xs text-gray-500 mt-1">タップしてカメラを起動</p>
                          </>
                        )}
                      </div>

                      <button
                        onClick={handleQRScan}
                        disabled={scanningQR}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Smartphone size={18} />
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
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <User size={14} />
                            <span>{customerInfo.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar size={14} />
                            <span>会員登録: {customerInfo.memberSince}</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-purple-200">
                            <span className="text-gray-600">現在のポイント</span>
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

                {/* 還元率情報 */}
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-sm p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Percent size={20} />
                    <h3 className="font-bold">現在の還元率</h3>
                  </div>
                  <div className="text-4xl font-bold mb-2">{rewardRate}%</div>
                  <p className="text-sm text-purple-100">チャージ金額に対するポイント還元率</p>
                </div>
              </div>

              {/* 右側: チャージフォーム */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="text-purple-600" />
                    チャージ金額
                  </h2>

                  {/* 金額入力 */}
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

                  {/* クイック金額選択 */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      クイック選択
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {quickAmounts.map((quickAmount) => (
                        <button
                          key={quickAmount}
                          onClick={() => setAmount(quickAmount.toString())}
                          disabled={!customerInfo}
                          className="py-3 px-2 bg-gray-100 hover:bg-purple-100 border border-gray-300 hover:border-purple-400 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ¥{quickAmount.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 計算結果 */}
                  {amount && parseFloat(amount) > 0 && (
                    <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle size={18} className="text-purple-600" />
                        チャージ内容
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">チャージ金額</span>
                          <span className="text-xl font-bold text-gray-900">
                            ¥{parseFloat(amount).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">還元率</span>
                          <span className="text-lg font-semibold text-purple-600">
                            {rewardRate}%
                          </span>
                        </div>
                        <div className="pt-3 border-t-2 border-purple-300 flex justify-between items-center">
                          <span className="text-gray-900 font-semibold">付与ポイント</span>
                          <span className="text-2xl font-bold text-purple-600">
                            +{calculatePoints(parseFloat(amount)).toLocaleString()} pt
                          </span>
                        </div>
                        {customerInfo && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">チャージ後の残高</span>
                            <span className="font-semibold text-gray-900">
                              {(customerInfo.currentPoints + calculatePoints(parseFloat(amount))).toLocaleString()} pt
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* アクションボタン */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setAmount('')}
                      className="flex-1 py-3 px-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                    >
                      クリア
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={!customerInfo || !amount || parseFloat(amount) <= 0}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      チャージ確認
                    </button>
                  </div>
                </div>

                {/* 注意事項 */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
                  <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">注意事項</p>
                    <ul className="list-disc list-inside space-y-1 text-yellow-700">
                      <li>チャージは取り消しできません</li>
                      <li>ポイントの有効期限は最終利用日から1年間です</li>
                      <li>現金でのチャージのみポイント還元対象です</li>
                    </ul>
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
              <h3 className="text-xl font-bold text-gray-900">チャージ確認</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">顧客名</p>
                <p className="font-bold text-gray-900">{customerInfo?.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">チャージ金額</p>
                <p className="text-2xl font-bold text-gray-900">¥{parseFloat(amount).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                <p className="text-sm text-purple-600 mb-1">付与ポイント</p>
                <p className="text-2xl font-bold text-purple-600">
                  +{calculatePoints(parseFloat(amount)).toLocaleString()} pt
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                キャンセル
              </button>
              <button
                onClick={handleExecuteCharge}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
              >
                チャージ実行
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">チャージ完了！</h3>
            <p className="text-gray-600 mb-6">ポイントが正常にチャージされました</p>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock size={16} className="text-gray-600" />
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleString('ja-JP')}
                </p>
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-1">
                +{calculatePoints(parseFloat(amount)).toLocaleString()} pt
              </p>
              <p className="text-sm text-gray-600">
                残高: {(customerInfo?.currentPoints + calculatePoints(parseFloat(amount))).toLocaleString()} pt
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            >
              新しいチャージを開始
            </button>
          </div>
        </div>
      )}
    </>
  );
}
