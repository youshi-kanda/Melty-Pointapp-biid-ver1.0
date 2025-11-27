import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TerminalHead from '@/components/terminal/TerminalHead';
import { CheckCircle2, Gift, Home, Sparkles } from 'lucide-react';

export default function PointsComplete() {
  const router = useRouter();
  const { userId, points, reason } = router.query;
  const [countdown, setCountdown] = useState(8);

  const pointsNum = parseInt(points as string) || 0;

  // モックデータ
  const customer = {
    name: '山田 太郎',
    memberId: 'M001234',
    previousPoints: 2100,
    newPoints: 2100 + pointsNum
  };

  const reasonLabels: Record<string, string> = {
    purchase: '購入特典',
    gift: 'ギフト',
    bonus: 'ボーナス',
    other: 'その他'
  };

  const transactionId = 'PTS' + Date.now().toString().slice(-8);
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

  const handleBackToHome = () => {
    router.push('/terminal/');
  };

  return (
    <>
      <TerminalHead title="ポイント付与完了 - Melty+ Terminal" />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift size={22} />
              <h1 className="text-lg sm:text-xl font-bold">ポイント付与完了</h1>
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
                  <Gift size={56} className="text-white" />
                </div>
                {/* キラキラエフェクト */}
                <div className="absolute -top-2 -left-2">
                  <Sparkles size={24} className="text-yellow-400 animate-pulse" />
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <Sparkles size={20} className="text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">ポイント付与完了！</h2>
              <p className="text-gray-600">ありがとうございました</p>
            </div>

            {/* 付与情報 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 mb-6 border-2 border-green-200">
              <div className="space-y-4">
                {/* 付与ポイント */}
                <div className="text-center pb-4 border-b border-green-200">
                  <div className="text-sm text-gray-600 mb-1">付与ポイント</div>
                  <div className="text-5xl font-bold text-green-600 flex items-center justify-center gap-2">
                    <span>+{pointsNum.toLocaleString()}</span>
                    <span className="text-2xl">pt</span>
                  </div>
                </div>

                {/* 付与理由 */}
                <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">付与理由</span>
                  <span className="text-sm font-medium text-gray-900">
                    {reasonLabels[reason as string] || '未設定'}
                  </span>
                </div>

                {/* ポイント推移 */}
                <div className="bg-white rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">付与前</span>
                      <span className="font-medium">{customer.previousPoints.toLocaleString()}pt</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex-1 border-t border-gray-300"></div>
                      <span className="px-3 text-green-600 font-medium">+{pointsNum.toLocaleString()}</span>
                      <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">付与後</span>
                      <span className="text-2xl font-bold text-green-600">{customer.newPoints.toLocaleString()}pt</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 顧客情報 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">お客様名</span>
                <span className="font-medium">{customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">会員ID</span>
                <span className="font-mono font-medium">{customer.memberId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">取引ID</span>
                <span className="font-mono font-medium">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">日時</span>
                <span className="font-medium">{timestamp}</span>
              </div>
            </div>

            {/* ホームボタン */}
            <button
              onClick={handleBackToHome}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
            >
              <Home size={20} />
              <span>ホームに戻る</span>
            </button>

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
