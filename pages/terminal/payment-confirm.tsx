import { useState } from 'react';
import { useRouter } from 'next/router';
import TerminalHead from '@/components/terminal/TerminalHead';
import { ArrowLeft, Check, Coins, DollarSign, User, Award, Gift } from 'lucide-react';

export default function PaymentConfirm() {
  const router = useRouter();
  const { userId, amount, points, withPoints } = router.query;
  const [isProcessing, setIsProcessing] = useState(false);

  const amountNum = parseInt(amount as string) || 0;
  const pointsNum = parseInt(points as string) || 0;
  const finalAmount = amountNum - pointsNum;
  const willEarnPoints = withPoints === 'true';

  // モックデータ
  const customer = {
    name: '山田 太郎',
    memberId: 'M001234',
    currentPoints: 2100,
    rank: 'ゴールド'
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    // 処理中画面へ遷移
    setTimeout(() => {
      router.push(`/terminal/processing?userId=${userId}&amount=${amount}&points=${points}&withPoints=${willEarnPoints}`);
    }, 500);
  };

  const handleBack = () => {
    router.push(`/terminal/amount-input?userId=${userId}&withPoints=${willEarnPoints}`);
  };

  const earnedPoints = willEarnPoints ? Math.floor(finalAmount * 0.01) : 0; // 1%還元（付与ありの場合のみ）

  return (
    <>
      <TerminalHead title="決済確認 - Melty+ Terminal" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold">決済内容の確認</h1>
            <button
              onClick={handleBack}
              disabled={isProcessing}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">修正</span>
            </button>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
            
            {/* 顧客情報 */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{customer.name}</div>
                  <div className="text-sm text-gray-600">会員ID: {customer.memberId}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award size={16} className="text-yellow-600" />
                <span className="text-gray-700">{customer.rank}会員</span>
                <span className="mx-2 text-gray-400">•</span>
                <Coins size={16} className="text-green-600" />
                <span className="text-gray-700">{customer.currentPoints.toLocaleString()}pt</span>
              </div>
            </div>

            {/* 決済金額 */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
                <div className="space-y-3">
                  {/* 元の金額 */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">商品合計</span>
                    <span className="text-2xl font-bold text-gray-900">¥{amountNum.toLocaleString()}</span>
                  </div>

                  {/* ポイント使用 */}
                  {pointsNum > 0 && (
                    <>
                      <div className="border-t border-blue-200 pt-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Coins size={18} className="text-green-600" />
                            <span className="text-sm text-gray-600">ポイント使用</span>
                          </div>
                          <span className="text-lg font-bold text-green-600">-{pointsNum.toLocaleString()}pt</span>
                        </div>
                        <div className="text-xs text-gray-500 text-right mt-1">
                          残高: {(customer.currentPoints - pointsNum).toLocaleString()}pt
                        </div>
                      </div>
                    </>
                  )}

                  {/* 最終金額 */}
                  <div className="border-t-2 border-blue-300 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium text-gray-700">お支払い額</span>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          ¥{finalAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 獲得ポイント */}
            {willEarnPoints ? (
              <div className="mb-6 bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift size={20} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-700">今回の獲得ポイント</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">+{earnedPoints}pt</div>
                </div>
                <div className="text-xs text-gray-600 text-right mt-1">
                  決済後: {(customer.currentPoints - pointsNum + earnedPoints).toLocaleString()}pt
                </div>
              </div>
            ) : (
              <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Coins size={18} />
                  <span className="text-sm font-medium">この決済ではポイントは付与されません</span>
                </div>
              </div>
            )}

            {/* 支払い方法 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                支払い方法
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button className="bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-md">
                  現金
                </button>
                <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-3 rounded-lg text-sm font-medium">
                  クレジット
                </button>
                <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-3 rounded-lg text-sm font-medium">
                  電子マネー
                </button>
              </div>
            </div>

            {/* 確定ボタン */}
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>処理中...</span>
                </>
              ) : (
                <>
                  <Check size={20} />
                  <span>決済を実行する</span>
                </>
              )}
            </button>

            {/* 注意事項 */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800 text-center">
                内容をご確認の上、「決済を実行する」ボタンを押してください
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
