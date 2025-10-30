import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Cherry, Crown, User, CheckCircle, Star, Sparkles, ExternalLink, Wrench } from 'lucide-react'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleMeltyRegister = () => {
    // 開発中のため無効化
    alert('🚧 Melty連携登録は現在開発中です。もうしばらくお待ちください。\n\n今すぐご利用の場合は「Melty+アプリのみで登録」をお選びください。')
    // setIsLoading(true)
    // window.location.href = 'https://melty.app/register?source=biid'
  }

  const handleDirectRegister = () => {
    setIsLoading(true)
    window.location.href = '/user/register/form'
  }

  return (
    <>
      <Head>
        <title>新規会員登録 - Melty+ (メルティプラス)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Nunito:wght@300;400;500;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Great+Vibes&family=Satisfy&family=Fredoka+One&family=Bungee&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-10">
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Crown className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                Melty+ Appへようこそ！
              </h1>
              <p className="text-xl text-gray-600 mb-8" style={{ fontFamily: 'Nunito, sans-serif' }}>
                新規会員登録の方法をお選びください<br />
                <span className="font-bold text-purple-600 animate-pulse">meltyアプリ経由なら超お得！</span>
                <span className="font-bold text-pink-600">今だけ限定特典満載！</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700">Melty+直接登録</h3>
                  <p className="text-sm text-gray-500">ブロンズランクスタート</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                    基本ポイント機能
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                    店舗検索
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                    ギフト交換
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="font-medium">500pt ウェルカムボーナス</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 relative overflow-hidden opacity-75">
                <div className="absolute inset-0 bg-gray-900 bg-opacity-10 backdrop-blur-[1px] flex items-center justify-center z-10">
                  <div className="bg-white px-6 py-3 rounded-full shadow-lg border-2 border-yellow-400">
                    <div className="flex items-center space-x-2">
                      <Wrench className="w-5 h-5 text-yellow-600 animate-pulse" />
                      <span className="font-bold text-yellow-700">開発中 Coming Soon</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    おすすめ
                  </div>
                </div>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-700">melty経由登録</h3>
                  <p className="text-sm text-purple-600 font-semibold">シルバーランクスタート</p>
                </div>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                    <span className="font-medium">基本ポイント機能</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                    <span className="font-medium">店舗検索</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                    <span className="font-medium">ギフト交換</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="font-bold text-purple-800">🎁 1000pt 超豪華ボーナス！</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="font-bold text-purple-800">👑 VIP優先サポート</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="font-bold text-purple-800">✨ 限定キャンペーン招待</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="font-bold text-purple-800">💰 お仕事関連店舗でポイント2倍</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8 border border-purple-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-purple-800 mb-2">meltyアプリについて</h4>
                  <p className="text-purple-700 text-sm leading-relaxed">
                    <span className="font-bold text-purple-800">もうmeltyを使ってる？</span>それなら絶対こっちがお得！🌟<br />
                    Melty（メルティ）は、ナイトワークや接客業で働く女性の強い味方。<br />
                    顧客管理・スケジュール・収入管理が一つになった専用アプリです。<br />
                    <span className="font-bold text-purple-800">melty×melty+連携で、毎日の頑張りが2倍のポイントに！💎</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleMeltyRegister}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Crown className="w-6 h-6" />
                <span>🎯 meltyでVIPスタート（今だけ限定）</span>
                <ExternalLink className="w-5 h-5" />
              </button>

              <button
                onClick={handleDirectRegister}
                disabled={isLoading}
                className="w-full bg-gray-100 text-gray-700 font-semibold py-4 rounded-2xl hover:bg-gray-200 transition-all duration-200 text-lg border border-gray-300"
              >
                Melty+アプリのみで登録（通常スタート）
              </button>
            </div>

            <div className="mt-8 text-center">
              <span className="text-base text-gray-600">すでにアカウントをお持ちの方は </span>
              <Link 
                href="/user/login" 
                className="text-base text-rose-600 hover:text-rose-800 font-semibold transition-colors"
              >
                ログイン
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
