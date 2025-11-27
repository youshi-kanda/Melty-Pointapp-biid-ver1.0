import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TerminalHead from '@/components/terminal/TerminalHead';
import { Wifi, X, AlertCircle, CheckCircle } from 'lucide-react';

export default function NFCReader() {
  const router = useRouter();
  const [status, setStatus] = useState<'waiting' | 'reading' | 'success' | 'error'>('waiting');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    // タイムアウトカウントダウン
    if (status === 'waiting' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setStatus('error');
      setErrorMessage('タイムアウトしました');
    }
  }, [countdown, status]);

  // シミュレーション: 3秒後に自動的にカード読み取り成功
  useEffect(() => {
    if (status === 'waiting') {
      const timer = setTimeout(() => {
        setStatus('reading');
        setTimeout(() => {
          setStatus('success');
          // 成功後、顧客情報確認画面へ遷移
          setTimeout(() => {
            router.push('/terminal/customer-confirm?userId=U001');
          }, 1500);
        }, 1000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  const handleCancel = () => {
    router.push('/terminal/');
  };

  return (
    <>
      <TerminalHead title="NFC読み取り - Melty+ Terminal" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold">NFC読み取り</h1>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              <X size={18} />
              <span className="text-sm">キャンセル</span>
            </button>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8">
            
            {/* ステータス別表示 */}
            {status === 'waiting' && (
              <div className="text-center">
                {/* アニメーションアイコン */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Wifi size={48} className="text-white animate-pulse" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  カードをタッチしてください
                </h2>
                <p className="text-gray-600 mb-6">
                  NFCカードをリーダーにかざしてください
                </p>

                {/* タイムアウトカウンター */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-2">タイムアウトまで</div>
                  <div className="text-3xl font-bold text-blue-600">{countdown}秒</div>
                </div>
              </div>
            )}

            {status === 'reading' && (
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-spin border-8 border-t-transparent border-blue-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wifi size={48} className="text-blue-600" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  読み取り中...
                </h2>
                <p className="text-gray-600">
                  カードをそのまま動かさないでください
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={64} className="text-green-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  読み取り成功！
                </h2>
                <p className="text-gray-600">
                  顧客情報を確認しています...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle size={64} className="text-red-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  読み取りエラー
                </h2>
                <p className="text-gray-600 mb-6">
                  {errorMessage || 'カードの読み取りに失敗しました'}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setStatus('waiting');
                      setCountdown(30);
                      setErrorMessage('');
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    再試行
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 説明 */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto text-center text-sm text-gray-600">
            <p>会員カードをリーダーにかざすと自動的に読み取ります</p>
          </div>
        </div>
      </div>
    </>
  );
}
