import { useRouter } from 'next/router';
import Head from 'next/head';
import { AlertCircle, Home, RotateCcw, XCircle } from 'lucide-react';

export default function TerminalError() {
  const router = useRouter();
  const { type, message } = router.query;

  const errorTypes: Record<string, { title: string; description: string; color: string }> = {
    'network': {
      title: 'ネットワークエラー',
      description: 'ネットワーク接続を確認してください',
      color: 'orange'
    },
    'payment': {
      title: '決済エラー',
      description: '決済処理に失敗しました',
      color: 'red'
    },
    'card': {
      title: 'カード読み取りエラー',
      description: 'カードを再度かざしてください',
      color: 'amber'
    },
    'timeout': {
      title: 'タイムアウト',
      description: '処理時間を超過しました',
      color: 'orange'
    },
    'system': {
      title: 'システムエラー',
      description: 'システムエラーが発生しました',
      color: 'red'
    },
    'auth': {
      title: '認証エラー',
      description: '認証に失敗しました',
      color: 'red'
    }
  };

  const currentError = errorTypes[type as string] || {
    title: 'エラー',
    description: 'エラーが発生しました',
    color: 'red'
  };

  const handleRetry = () => {
    router.push('/terminal/');
  };

  const handleHome = () => {
    router.push('/terminal/');
  };

  const handleContactSupport = () => {
    // サポート連絡機能（実装予定）
    alert('サポートへの連絡機能は開発中です');
  };

  return (
    <>
      <Head>
        <title>{currentError.title} - Melty+ Terminal</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={22} />
              <h1 className="text-lg sm:text-xl font-bold">エラー</h1>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            
            {/* エラーアイコン */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className={`w-24 h-24 bg-${currentError.color}-100 rounded-full flex items-center justify-center mx-auto`}>
                  <XCircle size={56} className={`text-${currentError.color}-600`} />
                </div>
                {/* 警告マーク */}
                <div className={`absolute -top-2 -right-2 w-10 h-10 bg-${currentError.color}-500 rounded-full flex items-center justify-center`}>
                  <AlertCircle size={24} className="text-white" />
                </div>
              </div>
            </div>

            {/* エラー情報 */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentError.title}</h2>
              <p className="text-gray-600 mb-4">{currentError.description}</p>
              
              {message && (
                <div className={`bg-${currentError.color}-50 border border-${currentError.color}-200 rounded-lg p-4 text-sm text-${currentError.color}-800`}>
                  {message}
                </div>
              )}
            </div>

            {/* エラーコード */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-xs text-gray-500 text-center space-y-1">
                <div>エラーコード: ERR_{(type as string || 'UNKNOWN').toUpperCase()}</div>
                <div>日時: {new Date().toLocaleString('ja-JP')}</div>
              </div>
            </div>

            {/* 対処方法 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-bold text-blue-900 mb-2">対処方法</h3>
              <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                <li>もう一度お試しください</li>
                <li>問題が続く場合は端末を再起動してください</li>
                <li>それでも解決しない場合はサポートにご連絡ください</li>
              </ul>
            </div>

            {/* アクションボタン */}
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                <span>再試行</span>
              </button>
              
              <button
                onClick={handleHome}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Home size={18} />
                <span>ホームに戻る</span>
              </button>

              <button
                onClick={handleContactSupport}
                className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 text-sm transition-colors"
              >
                サポートに連絡
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
