import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { QRCodeSVG } from 'qrcode.react'
import { QrCode, X } from 'lucide-react'

export default function WelcomePage() {
  const router = useRouter()
  const [userName, setUserName] = useState('ユーザー')
  const [userId, setUserId] = useState('USER001')
  const [showQRCode, setShowQRCode] = useState(false)

  const menuItems = [
    {
      title: 'ポイント残高',
      icon: '💎',
      value: '1,234',
      unit: 'pt',
      color: 'from-purple-500 to-pink-500',
      link: '/user/points'
    },
    {
      title: 'お気に入り店舗',
      icon: '⭐',
      value: '8',
      unit: '店舗',
      color: 'from-amber-500 to-orange-500',
      link: '/user/favorites'
    },
    {
      title: 'ギフト',
      icon: '🎁',
      value: '3',
      unit: '個',
      color: 'from-green-500 to-emerald-500',
      link: '/user/gifts'
    },
    {
      title: '店舗マップ',
      icon: '🗺️',
      value: '',
      unit: '',
      color: 'from-blue-500 to-indigo-500',
      link: '/user/map'
    }
  ]

  const quickActions = [
    { title: 'プロフィール', icon: '👤', link: '/user/profile' },
    { title: '取引履歴', icon: '📊', link: '/user/transactions' },
    { title: '設定', icon: '⚙️', link: '/user/settings' },
    { title: 'サポート', icon: '💬', link: '/user/support' }
  ]

  return (
    <>
      <Head>
        <title>Melty+ (メルティプラス) - ホーム</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {/* ヘッダー */}
        <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-primary-200/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-2xl font-cutie font-bold bg-gradient-to-r from-primary-500 to-pink-500 bg-clip-text text-transparent">
                Melty+
              </h1>
              <button
                onClick={() => router.push('/user/profile')}
                className="flex items-center space-x-2 hover:bg-gray-100 rounded-full px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {userName.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700">{userName}</span>
              </button>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ウェルカムメッセージ */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              おかえりなさい、{userName}さん 👋
            </h2>
            <p className="text-gray-600">今日も素敵な一日を！</p>
          </div>

          {/* QRコード表示ボタン */}
          <div className="mb-6">
            <button
              onClick={() => setShowQRCode(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <QrCode className="w-6 h-6" />
              <span>会員QRコードを表示</span>
            </button>
          </div>

          {/* メインメニューカード */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => router.push(item.link)}
                className="bg-white rounded-3xl shadow-soft hover:shadow-xl transition-all p-6 cursor-pointer transform hover:scale-[1.02] border border-primary-200/30"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-md`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">{item.title}</h3>
                {item.value && (
                  <p className="text-2xl font-bold text-gray-800">
                    {item.value}
                    <span className="text-sm font-normal text-gray-500 ml-1">{item.unit}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* お知らせ */}
          <div className="bg-white rounded-3xl shadow-soft p-6 mb-8 border border-primary-200/30">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📢</span>
              お知らせ
            </h3>
            <div className="space-y-3">
              {[
                { title: '新規キャンペーン開始！', date: '2025/10/20', badge: 'NEW' },
                { title: 'メンテナンスのお知らせ', date: '2025/10/18', badge: '' },
                { title: '新規加盟店追加', date: '2025/10/15', badge: '' }
              ].map((notice, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    {notice.badge && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                        {notice.badge}
                      </span>
                    )}
                    <span className="text-gray-800 font-medium">{notice.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">{notice.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* クイックアクション */}
          <div className="bg-white rounded-3xl shadow-soft p-6 border border-primary-200/30">
            <h3 className="text-xl font-bold text-gray-800 mb-4">クイックアクション</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => router.push(action.link)}
                  className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 rounded-2xl transition-all transform hover:scale-105"
                >
                  <span className="text-3xl mb-2">{action.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </main>

        {/* QRコードモーダル */}
        {showQRCode && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-fade-in">
              {/* 閉じるボタン */}
              <button
                onClick={() => setShowQRCode(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">会員QRコード</h2>
                <p className="text-sm text-gray-600">
                  決済端末でこのQRコードをスキャンしてください
                </p>
              </div>

              {/* QRコード表示 */}
              <div className="bg-white p-6 rounded-2xl border-4 border-blue-100 mb-6 flex items-center justify-center shadow-inner">
                <QRCodeSVG
                  value={`USER:${userId}`}
                  size={240}
                  level="H"
                  includeMargin={true}
                  fgColor="#2563eb"
                />
              </div>

              {/* ユーザー情報 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">会員ID</span>
                  <span className="text-lg font-bold text-gray-900">{userId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">会員名</span>
                  <span className="text-lg font-bold text-gray-900">{userName}</span>
                </div>
              </div>

              {/* 説明 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <p className="text-xs text-yellow-800">
                  💡 このQRコードは決済時に店舗の端末で読み取ります。他の人には見せないでください。
                </p>
              </div>

              {/* 閉じるボタン */}
              <button
                onClick={() => setShowQRCode(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
