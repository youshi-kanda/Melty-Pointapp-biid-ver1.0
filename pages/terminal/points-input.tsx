import { useState } from 'react';
import { useRouter } from 'next/router';
import TerminalHead from '@/components/terminal/TerminalHead';
import { X, Coins, Gift } from 'lucide-react';

export default function PointsInput() {
  const router = useRouter();
  const { userId } = router.query;
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('purchase'); // purchase, gift, bonus, other
  
  const quickPoints = [100, 300, 500, 1000, 3000, 5000];
  
  const reasonLabels: Record<string, string> = {
    purchase: '購入特典',
    gift: 'ギフト',
    bonus: 'ボーナス',
    other: 'その他'
  };

  const handleNumberClick = (num: string) => {
    if (points.length < 6) {
      const newPoints = points + num;
      setPoints(newPoints);
    }
  };

  const handleQuickPoints = (value: number) => {
    setPoints(value.toString());
  };

  const handleBackspace = () => {
    setPoints(points.slice(0, -1));
  };

  const handleClear = () => {
    setPoints('');
  };

  const handleConfirm = () => {
    if (!points || parseInt(points) === 0) {
      return;
    }
    router.push(`/terminal/points-complete?userId=${userId}&points=${points}&reason=${reason}`);
  };

  const handleCancel = () => {
    router.push(`/terminal/customer-confirm?userId=${userId}`);
  };

  return (
    <>
      <TerminalHead title="ポイント付与 - Melty+ Terminal" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift size={22} />
              <h1 className="text-lg sm:text-xl font-bold">ポイント付与</h1>
            </div>
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
            
            {/* ポイントディスプレイ */}
            <div className="mb-6">
              <div className="text-center mb-2">
                <span className="text-sm text-gray-600">付与ポイント</span>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-200">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <Coins size={40} className="text-green-600" />
                    {points || '0'}
                    <span className="text-2xl text-gray-600">pt</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 付与理由選択 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                付与理由
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(reasonLabels).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setReason(value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      reason === value
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* クイックポイントボタン */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {quickPoints.map((value) => (
                <button
                  key={value}
                  onClick={() => handleQuickPoints(value)}
                  className="bg-green-50 hover:bg-green-100 active:scale-95 text-sm font-medium text-green-600 rounded-lg py-2 transition-all flex items-center justify-center gap-1"
                >
                  <Coins size={14} />
                  {value.toLocaleString()}pt
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
              disabled={!points || parseInt(points) === 0}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
            >
              <Gift size={20} />
              <span>ポイント付与を実行</span>
            </button>

            {/* 注意事項 */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                ※ 付与したポイントは即座に顧客アカウントに反映されます
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
