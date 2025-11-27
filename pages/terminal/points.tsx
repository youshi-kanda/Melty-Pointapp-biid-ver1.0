import { useState } from 'react';
import { useRouter } from 'next/router';
import TerminalHead from '@/components/terminal/TerminalHead';
import { Store, Clock, Coins, User, Gift, CheckCircle, ArrowLeft } from 'lucide-react';

export default function TerminalPoints() {
  const router = useRouter();
  const [points, setPoints] = useState('');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [customerInfo] = useState({
    name: '田中太郎',
    memberId: 'USER-001',
    currentPoints: 2450
  });

  const quickPoints = [100, 300, 500, 1000, 2000, 5000];

  const handleGrant = () => {
    setProcessing(true);
    setTimeout(() => {
      setCompleted(true);
      setProcessing(false);
    }, 2000);
  };

  return (
    <>
      <TerminalHead title="ポイント付与 - Melty+ Terminal" />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* 上部バナー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 sm:py-4 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Store size={24} className="sm:w-7 sm:h-7" />
              <div>
                <h1 className="text-base sm:text-xl font-bold">Melty+ Terminal</h1>
                <p className="text-xs sm:text-sm text-blue-100">ポイント付与</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="text-right">
                <div className="text-xl sm:text-3xl font-bold">{points || '0'} pt</div>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">ON</span>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
          {!completed ? (
            <div className="max-w-6xl w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* 左側: 顧客情報 */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <User size={18} className="sm:w-5 sm:h-5 text-blue-600" />
                    顧客情報
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg sm:text-2xl font-bold">
                        {customerInfo.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-bold text-gray-900">{customerInfo.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{customerInfo.memberId}</p>
                      </div>
                    </div>
                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm text-gray-600">現在のポイント</span>
                        <span className="text-base sm:text-lg font-bold text-blue-600">{customerInfo.currentPoints}</span>
                      </div>
                      {points && (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs sm:text-sm text-gray-600">付与ポイント</span>
                            <span className="text-base sm:text-lg font-bold text-green-600">+{points}</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span className="text-xs sm:text-sm font-semibold text-gray-900">付与後</span>
                            <span className="text-lg sm:text-xl font-bold text-blue-600">
                              {customerInfo.currentPoints + parseInt(points)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 右側: ポイント入力 */}
                <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <Gift size={20} className="sm:w-6 sm:h-6 text-blue-600" />
                    付与ポイント数
                  </h3>

                  {/* ポイント表示 */}
                  <div className="mb-4 sm:mb-6">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600 text-center py-6 sm:py-8 bg-blue-50 rounded-xl border-2 border-blue-200 flex items-center justify-center gap-2 sm:gap-3">
                      <Coins size={40} className="sm:w-14 sm:h-14" />
                      {points || '0'}
                    </div>
                  </div>

                  {/* クイックポイント */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {quickPoints.map((quickPoint) => (
                      <button
                        key={quickPoint}
                        onClick={() => setPoints(quickPoint.toString())}
                        disabled={processing}
                        className="py-3 sm:py-4 text-sm sm:text-base bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border-2 border-blue-200 hover:border-blue-400 rounded-lg sm:rounded-xl font-bold text-blue-600 transition-all disabled:opacity-50 min-h-[44px]"
                      >
                        {quickPoint} pt
                      </button>
                    ))}
                  </div>

                  {/* カスタムポイント入力 */}
                  <div className="mb-4 sm:mb-6">
                    <input
                      type="number"
                      value={points}
                      onChange={(e) => setPoints(e.target.value)}
                      placeholder="ポイント数を入力"
                      disabled={processing}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center disabled:opacity-50"
                    />
                  </div>

                  {/* アクションボタン */}
                  <div className="flex gap-3 sm:gap-4">
                    <button
                      onClick={() => router.push('/terminal')}
                      disabled={processing}
                      className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center gap-2 min-h-[48px]"
                    >
                      <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">戻る</span>
                    </button>
                    <button
                      onClick={handleGrant}
                      disabled={!points || parseInt(points) <= 0 || processing}
                      className="flex-1 py-3 sm:py-4 text-base sm:text-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl disabled:opacity-50 active:scale-95 min-h-[48px]"
                    >
                      {processing ? '処理中...' : 'ポイント付与'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 完了画面 */
            <div className="max-w-2xl w-full">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 border border-gray-200 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <CheckCircle size={40} className="sm:w-12 sm:h-12 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">付与完了</h2>
                <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8">ポイントを付与しました</p>

                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 border-2 border-blue-200">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <Coins size={24} className="sm:w-8 sm:h-8 text-blue-600" />
                    <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600">+{points} pt</p>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">
                    残高: {customerInfo.currentPoints + parseInt(points)} pt
                  </p>
                </div>

                <button
                  onClick={() => router.push('/terminal')}
                  className="w-full py-3.5 sm:py-4 text-base sm:text-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl active:scale-95 min-h-[48px]"
                >
                  メイン画面に戻る
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
