import { useRouter } from 'next/router'
import Head from 'next/head'
import { Crown, CheckCircle, Gift, Zap, Sparkles, ArrowRight } from 'lucide-react'

export default function MeltySuccessPage() {
  const router = useRouter()

  const handleGoToDashboard = () => {
    router.push('/user')
  }

  return (
    <>
      <Head>
        <title>meltyVIP会員登録完了 - Melty+ (メルティプラス)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Nunito:wght@300;400;500;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Great+Vibes&family=Satisfy&family=Fredoka+One&family=Bungee&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white">
        {/* ヘッダー */}
        <div className="bg-white shadow-sm border-b border-pink-100">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
                    <path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
                    <path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12" />
                    <path d="M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z" />
                  </svg>
                </div>
                <span 
                  className="text-2xl font-light bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
                  style={{ fontFamily: '"Dancing Script", "Brush Script MT", cursive', fontStyle: 'italic' }}
                >
                  Melty+
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-10">
            {/* 成功メッセージ */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Crown className="w-16 h-16 text-white" />
                </div>
              </div>

              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                🎉 meltyVIP会員登録完了!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Melty+へようこそ!<br />
                🌟 melty VIP特典が全て解除されました!
              </p>

              {/* VIPランク表示 */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border-2 border-purple-200 mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <span className="text-4xl">🥈</span>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
                      👑 VIPシルバーランク獲得!
                    </h2>
                    <p className="text-gray-600">特別待遇でbiidライフをスタートしましょう!</p>
                  </div>
                </div>

                {/* ウェルカムボーナス */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Gift className="w-6 h-6" />
                    <span className="text-xl font-bold">ウェルカムボーナス</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-3xl font-bold">1,000</span>
                    <span className="text-lg ml-2">ポイント獲得!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ご利用いただける機能 */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">ご利用いただける機能</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700 font-medium">基本ポイント機能</span>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700 font-medium">店舗検索</span>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700 font-medium">ギフト交換</span>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700 font-medium">優先サポート</span>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700 font-medium">限定キャンペーン</span>
                </div>
              </div>
            </div>

            {/* melty VIP会員限定特典 */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8 border border-purple-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-purple-800 mb-2">🎁 melty VIP会員限定特典</h4>
                  <ul className="text-purple-700 text-sm space-y-1">
                    <li className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">お仕事関連店舗で毎回ポイント2倍獲得!</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Gift className="w-4 h-4 text-purple-500" />
                      <span className="font-semibold">melty会員だけの超レアギフト交換権</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">melty×biid VIP限定イベント招待</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                      <span className="font-semibold">24時間優先カスタマーサポート</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 次のステップ */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h4 className="text-lg font-bold text-gray-900 mb-4">次のステップ</h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    1
                  </div>
                  <span>マイダッシュボードでポイント残高を確認</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    2
                  </div>
                  <span>近くの加盟店舗を検索してポイントを獲得</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    3
                  </div>
                  <span>貯まったポイントで素敵なギフトと交換</span>
                </div>
              </div>
            </div>

            {/* ダッシュボードへボタン */}
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg text-lg flex items-center justify-center space-x-2"
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
    </>
  )
}
