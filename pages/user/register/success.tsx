import { useRouter } from 'next/router';
import Image from 'next/image';
import { Trophy, Gift, CheckCircle, ArrowRight, Cherry } from 'lucide-react';

export default function RegisterSuccess() {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/user');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white">
      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-10">
          {/* 完了メッセージ */}
          <div className="text-center mb-10">
            {/* トロフィーアイコン */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-32 h-32 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Trophy className="w-16 h-16 text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
              Melty+アカウント作成完了!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Melty+へようこそ!<br />
              アカウントが正常に作成されました
            </p>

            {/* ブロンズランク獲得 */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-pink-200 mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-4xl">🥉</span>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    ブロンズランク獲得!
                  </h2>
                  <p className="text-gray-600">会員特典をお楽しみください</p>
                </div>
              </div>

              {/* ウェルカムボーナス */}
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl p-4 mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <Gift className="w-6 h-6" />
                  <span className="text-xl font-bold">ウェルカムボーナス</span>
                </div>
                <div className="text-center mt-2">
                  <span className="text-3xl font-bold">500</span>
                  <span className="text-lg ml-2">ポイント獲得!</span>
                </div>
              </div>
            </div>
          </div>

          {/* ご利用いただける機能 */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              ご利用いただける機能
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-pink-500" />
                <span className="text-gray-700 font-medium">基本ポイント機能</span>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-pink-500" />
                <span className="text-gray-700 font-medium">店舗検索</span>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-pink-500" />
                <span className="text-gray-700 font-medium">ギフト交換</span>
              </div>
            </div>
          </div>

          {/* 次のステップ */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4">次のステップ</h4>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
                <span>マイダッシュボードでポイント残高を確認</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
                <span>近くの加盟店舗を検索してポイントを獲得</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
                <span>貯まったポイントで素敵なギフトと交換</span>
              </div>
            </div>
          </div>

          {/* ダッシュボードへボタン */}
          <button
            onClick={handleGoToDashboard}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>マイダッシュボードへ</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* サポート案内 */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              ご不明な点がございましたら、カスタマーサポートまでお気軽にお問い合わせください
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
