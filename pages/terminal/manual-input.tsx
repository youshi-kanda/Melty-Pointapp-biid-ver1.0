import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { X, Delete, Search } from 'lucide-react';

export default function ManualInput() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleNumberClick = (num: string) => {
    if (userId.length < 12) {
      setUserId(userId + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setUserId(userId.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setUserId('');
    setError('');
  };

  const handleSearch = async () => {
    if (userId.length < 4) {
      setError('会員IDは4桁以上入力してください');
      return;
    }

    setIsSearching(true);
    setError('');

    // シミュレーション: 1秒後に結果を返す
    setTimeout(() => {
      setIsSearching(false);
      // 成功時は顧客情報確認画面へ
      router.push(`/terminal/customer-confirm?userId=${userId}`);
    }, 1000);
  };

  const handleCancel = () => {
    router.push('/terminal-simple');
  };

  return (
    <>
      <Head>
        <title>会員ID入力 - Melty+ Terminal</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold">会員ID入力</h1>
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
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
            
            {/* タイトル */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                会員IDを入力してください
              </h2>
              <p className="text-sm text-gray-600">
                数字で会員IDを入力してください
              </p>
            </div>

            {/* 入力ディスプレイ */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 mb-6 border-2 border-gray-200">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-gray-900 tracking-wider min-h-[3rem] flex items-center justify-center">
                  {userId || '─────────'}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {userId.length}/12文字
                </div>
              </div>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* テンキー */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 active:scale-95 text-2xl font-bold text-gray-900 rounded-lg h-16 transition-all shadow-sm hover:shadow-md"
                >
                  {num}
                </button>
              ))}
              
              {/* クリアボタン */}
              <button
                onClick={handleClear}
                className="bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 active:scale-95 text-sm font-medium text-red-600 rounded-lg h-16 transition-all shadow-sm hover:shadow-md"
              >
                クリア
              </button>
              
              {/* 0ボタン */}
              <button
                onClick={() => handleNumberClick('0')}
                className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 active:scale-95 text-2xl font-bold text-gray-900 rounded-lg h-16 transition-all shadow-sm hover:shadow-md"
              >
                0
              </button>
              
              {/* バックスペース */}
              <button
                onClick={handleBackspace}
                disabled={userId.length === 0}
                className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 rounded-lg h-16 transition-all shadow-sm hover:shadow-md flex items-center justify-center"
              >
                <Delete size={24} />
              </button>
            </div>

            {/* 検索ボタン */}
            <button
              onClick={handleSearch}
              disabled={userId.length < 4 || isSearching}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>検索中...</span>
                </>
              ) : (
                <>
                  <Search size={20} />
                  <span>会員検索</span>
                </>
              )}
            </button>

            {/* 説明 */}
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>会員カードまたはアプリに記載されているIDを入力してください</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
