import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TerminalHead from '@/components/terminal/TerminalHead';
import { CheckCircle2, Gift, Printer, Home, Receipt } from 'lucide-react';

export default function PaymentComplete() {
  const router = useRouter();
  const { userId, amount, points, withPoints } = router.query;
  const [countdown, setCountdown] = useState(10);

  const amountNum = parseInt(amount as string) || 0;
  const pointsNum = parseInt(points as string) || 0;
  const finalAmount = amountNum - pointsNum;
  const willEarnPoints = withPoints === 'true';
  const earnedPoints = willEarnPoints ? Math.floor(finalAmount * 0.01) : 0; // 1%還元（付与ありの場合のみ）

  // モックデータ
  const customer = {
    name: '山田 太郎',
    memberId: 'M001234',
    newPoints: 2100 - pointsNum + earnedPoints
  };

  const transactionId = 'TXN' + Date.now().toString().slice(-8);
  const timestamp = new Date().toLocaleString('ja-JP');

  useEffect(() => {
    // カウントダウンタイマー
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/terminal/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handlePrintReceipt = () => {
    alert('レシート印刷機能は開発中です');
  };

  const handleBackToHome = () => {
    router.push('/terminal/');
  };

  return (
    <>
      <TerminalHead title="決済完了 - Melty+ Terminal" />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={22} />
              <h1 className="text-lg sm:text-xl font-bold">決済完了</h1>
            </div>
            <div className="text-sm bg-white/20 px-3 py-1 rounded-lg">
              {countdown}秒後に自動で戻ります
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
            
            {/* 成功アイコン */}
            <div className="text-center mb-6">
              <div className="inline-block relative">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <CheckCircle2 size={56} className="text-white" />
                </div>
                {/* 祝福エフェクト */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">お会計完了！</h2>
              <p className="text-gray-600">ありがとうございました</p>
            </div>

            {/* 取引情報 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 mb-6 border-2 border-green-200">
              <div className="space-y-4">
                {/* 決済金額 */}
                <div className="text-center pb-4 border-b border-green-200">
                  <div className="text-sm text-gray-600 mb-1">お支払い金額</div>
                  <div className="text-4xl font-bold text-green-600">
                    ¥{finalAmount.toLocaleString()}
                  </div>
                </div>

                {/* 内訳 */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">商品合計</span>
                    <span className="font-medium">¥{amountNum.toLocaleString()}</span>
                  </div>
                  {pointsNum > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>ポイント使用</span>
                      <span className="font-medium">-{pointsNum.toLocaleString()}pt</span>
                    </div>
                  )}
                </div>

                {/* 獲得ポイント */}
                {willEarnPoints ? (
                  <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift size={20} className="text-green-600" />
                      <span className="text-sm font-medium text-gray-700">獲得ポイント</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">+{earnedPoints}pt</span>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-600">ポイント付与なし</span>
                  </div>
                )}

                {/* 現在のポイント */}
                <div className="text-center pt-2">
                  <div className="text-xs text-gray-600">現在のポイント</div>
                  <div className="text-2xl font-bold text-gray-900">{customer.newPoints.toLocaleString()}pt</div>
                </div>
              </div>
            </div>

            {/* 取引詳細 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">取引ID</span>
                <span className="font-mono font-medium">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">会員ID</span>
                <span className="font-medium">{customer.memberId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">日時</span>
                <span className="font-medium">{timestamp}</span>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="space-y-3">
              <button
                onClick={handlePrintReceipt}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
              >
                <Printer size={20} />
                <span>レシートを印刷</span>
              </button>
              
              <button
                onClick={handleBackToHome}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Home size={18} />
                <span>ホームに戻る</span>
              </button>
            </div>

            {/* 注意事項 */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 text-center">
                ポイントは即座にお客様のアカウントに反映されました
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
