import { useState } from 'react';
import { useRouter } from 'next/router';
import TerminalHead from '@/components/terminal/TerminalHead';
import { X, Delete, DollarSign, Coins } from 'lucide-react';

export default function AmountInput() {
  const router = useRouter();
  const { userId, withPoints } = router.query;
  const [amount, setAmount] = useState('');
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  
  // withPoints パラメータで決済時のポイント付与の有無を判定
  const willEarnPoints = withPoints === 'true';
  const customerPoints = 2100; // 顧客の保有ポイント
  const quickAmounts = [100, 500, 1000, 3000, 5000, 10000];

  const handleNumberClick = (num: string) => {
    if (amount.length < 8) {
      const newAmount = amount + num;
      setAmount(newAmount);
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleBackspace = () => {
    setAmount(amount.slice(0, -1));
  };

  const handleClear = () => {
    setAmount('');
    setUsePoints(false);
    setPointsToUse(0);
  };

  const handleTogglePoints = () => {
    setUsePoints(!usePoints);
    if (!usePoints) {
      // ポイント使用をONにした場合、使用可能な最大ポイントを自動設定
      const amountNum = parseInt(amount) || 0;
      setPointsToUse(Math.min(customerPoints, amountNum));
    } else {
      setPointsToUse(0);
    }
  };

  const handleConfirm = () => {
    if (!amount || parseInt(amount) === 0) {
      return;
    }
    router.push(`/terminal/payment-confirm?userId=${userId}&amount=${amount}&points=${pointsToUse}&withPoints=${willEarnPoints}`);
  };

  const handleCancel = () => {
    router.push(`/terminal/customer-confirm?userId=${userId}`);
  };

  const amountNum = parseInt(amount) || 0;
  const finalAmount = Math.max(0, amountNum - pointsToUse);

  return (
    <>
      <TerminalHead title="金額入力 - Melty+ Terminal" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold">金額入力</h1>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              <X size={18} />
              <span className="text-sm">戻る</span>
            </button>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
            
            {/* 金額ディスプレイ */}
            <div className="mb-6">
              <div className="text-center mb-2 flex items-center justify-center gap-2">
                <span className="text-sm text-gray-600">決済金額</span>
                {willEarnPoints ? (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    <Coins size={12} />
                    ポイント付与あり
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    ポイント付与なし
                  </span>
                )}
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <span className="text-3xl text-gray-600">¥</span>
                    {amount || '0'}
                  </div>
                </div>
              </div>
            </div>

            {/* ポイント使用オプション */}
            {amountNum > 0 && customerPoints > 0 && (
              <div className="mb-6 bg-green-50 rounded-lg p-4 border border-green-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Coins size={20} className="text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">ポイントを使用</div>
                      <div className="text-xs text-gray-600">保有: {customerPoints.toLocaleString()}pt</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={usePoints}
                    onChange={handleTogglePoints}
                    className="w-5 h-5 text-green-600 rounded"
                  />
                </label>
                {usePoints && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="text-sm text-gray-700">
                      <div className="flex justify-between mb-1">
                        <span>使用ポイント:</span>
                        <span className="font-bold text-green-600">{pointsToUse.toLocaleString()}pt</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>お支払い額:</span>
                        <span className="text-blue-600">¥{finalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* クイック金額ボタン */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  onClick={() => handleQuickAmount(value)}
                  className="bg-blue-50 hover:bg-blue-100 active:scale-95 text-sm font-medium text-blue-600 rounded-lg py-2 transition-all"
                >
                  ¥{value.toLocaleString()}
                </button>
              ))}
            </div>

            {/* テンキー */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 active:scale-95 text-2xl font-bold text-gray-900 rounded-lg h-14 transition-all shadow-sm hover:shadow-md"
                >
                  {num}
                </button>
              ))}
              
              <button
                onClick={handleClear}
                className="bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 active:scale-95 text-xs font-medium text-red-600 rounded-lg h-14 transition-all shadow-sm hover:shadow-md"
              >
                クリア
              </button>
              
              <button
                onClick={() => handleNumberClick('0')}
                className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 active:scale-95 text-2xl font-bold text-gray-900 rounded-lg h-14 transition-all shadow-sm hover:shadow-md"
              >
                0
              </button>
              
              <button
                onClick={() => handleNumberClick('00')}
                className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 active:scale-95 text-2xl font-bold text-gray-900 rounded-lg h-14 transition-all shadow-sm hover:shadow-md"
              >
                00
              </button>
            </div>

            {/* 確定ボタン */}
            <button
              onClick={handleConfirm}
              disabled={!amount || parseInt(amount) === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
            >
              <DollarSign size={20} />
              <span>決済確認へ進む</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
