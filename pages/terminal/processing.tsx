import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TerminalHead from '@/components/terminal/TerminalHead';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function Processing() {
  const router = useRouter();
  const { userId, amount, points, withPoints } = router.query;
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // プログレスバーのアニメーション
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    // 決済処理シミュレーション（3秒）
    const timer = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      // ランダムで成功/失敗を決定（95%成功）
      const isSuccess = Math.random() > 0.05;
      
      if (isSuccess) {
        setStatus('success');
        // 成功画面へ遷移
        setTimeout(() => {
          router.push(`/terminal/payment-complete?userId=${userId}&amount=${amount}&points=${points}&withPoints=${withPoints || 'false'}`);
        }, 1500);
      } else {
        setStatus('error');
      }
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [router, userId, amount, points, withPoints]);

  const handleRetry = () => {
    setStatus('processing');
    setProgress(0);
    // 再試行処理
    router.push(`/terminal/payment-confirm?userId=${userId}&amount=${amount}&points=${points}`);
  };

  const handleCancel = () => {
    router.push('/terminal/');
  };

  const pageTitle = `${
    status === 'processing' ? '決済処理中' : 
    status === 'success' ? '決済成功' : '決済エラー'
  } - Melty+ Terminal`;

  return (
    <>
      <TerminalHead title={pageTitle} />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          
          {/* 処理中 */}
          {status === 'processing' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                    <Loader2 size={48} className="text-blue-600 animate-spin" />
                  </div>
                  {/* 回転する外周 */}
                  <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">決済処理中</h2>
              <p className="text-gray-600 mb-6">しばらくお待ちください...</p>
              
              {/* プログレスバー */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-2">{progress}%</div>
              </div>

              {/* 決済情報 */}
              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <div className="text-sm text-gray-600 mb-1">決済金額</div>
                <div className="text-3xl font-bold text-blue-600">
                  ¥{(parseInt(amount as string) - parseInt(points as string || '0')).toLocaleString()}
                </div>
                {parseInt(points as string || '0') > 0 && (
                  <div className="text-xs text-gray-500 mt-2">
                    ポイント使用: {parseInt(points as string).toLocaleString()}pt
                  </div>
                )}
              </div>

              <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                  ※ 処理が完了するまでお待ちください
                </p>
              </div>
            </div>
          )}

          {/* 成功 */}
          {status === 'success' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">決済成功！</h2>
              <p className="text-gray-600 mb-6">完了画面へ移動します...</p>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">決済金額</div>
                <div className="text-3xl font-bold text-green-600">
                  ¥{(parseInt(amount as string) - parseInt(points as string || '0')).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* エラー */}
          {status === 'error' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <XCircle size={48} className="text-red-600" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">決済エラー</h2>
              <p className="text-gray-600 mb-6">決済処理に失敗しました</p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  通信エラーまたはシステムエラーが発生しました。<br />
                  もう一度お試しいただくか、スタッフにお声がけください。
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-98"
                >
                  再試行
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
