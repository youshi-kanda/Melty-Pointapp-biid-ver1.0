import { ReactNode, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Home, MapPin, Gift, Coins, User, Bell, Settings, LogOut, ChevronDown } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
  title?: string
  showBottomNav?: boolean
}

export default function UserLayout({ 
  children, 
  title = 'Melty+ (メルティプラス)',
  showBottomNav = true 
}: LayoutProps) {
  const router = useRouter()
  const currentPath = router.pathname
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navItems = [
    { icon: Home, label: 'ホーム', path: '/user/' },
    { icon: MapPin, label: 'マップ', path: '/user/map' },
    { icon: Coins, label: 'ポイント', path: '/user/points' },
    { icon: Gift, label: 'ギフト', path: '/user/gifts' },
    { icon: User, label: 'マイページ', path: '/user/profile' },
  ]

  const isActive = (path: string) => {
    if (path === '/user/' && currentPath === '/user') return true
    if (path !== '/user/' && currentPath.startsWith(path)) return true
    return false
  }

  const handleLogout = () => {
    // ログアウト処理
    localStorage.removeItem('userToken')
    router.push('/user/login')
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="大阪ミナミ・北新地のポイント＆ギフトアプリ Melty+" />
        
        {/* PWA設定 */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#ec4899" />
        <link rel="manifest" href="/manifest-user.json" />
        
        {/* iOS Safari */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Melty+" />
        <link rel="apple-touch-icon" href="/icons/user-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/user-192x192.png" />
        
        {/* Android Chrome */}
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Nunito:wght@300;400;500;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Great+Vibes&family=Satisfy&family=Fredoka+One&family=Bungee&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white pb-20">
        {/* ヘッダー */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-pink-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* ロゴ */}
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => router.push('/user/')}
              >
                <Image
                  src="/melty-logo.jpg"
                  alt="Melty+"
                  width={120}
                  height={60}
                  className="object-contain"
                  priority
                />
              </div>

              {/* 通知アイコン & ユーザーメニュー */}
              <div className="flex items-center space-x-2">
                {/* 通知アイコン */}
                <button 
                  onClick={() => router.push('/user/social')}
                  className="relative p-2 hover:bg-pink-50 rounded-xl transition-colors"
                >
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                </button>

                {/* ユーザーメニュー */}
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-1 p-2 hover:bg-pink-50 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* ドロップダウンメニュー */}
                  {showUserMenu && (
                    <>
                      {/* 背景オーバーレイ */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      
                      {/* メニュー本体 */}
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-pink-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* ユーザー情報 */}
                        <div className="px-4 py-3 border-b border-pink-100">
                          <p className="text-sm font-bold text-gray-800">田中 花子</p>
                          <p className="text-xs text-gray-500 mt-1">hanako@example.com</p>
                          <div className="mt-2 inline-flex items-center px-2 py-1 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full">
                            <span className="text-xs font-bold text-pink-600">ゴールド会員</span>
                          </div>
                        </div>

                        {/* メニューアイテム */}
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setShowUserMenu(false)
                              router.push('/user/profile')
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-pink-50 transition-colors text-left"
                          >
                            <User className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">プロフィール</span>
                          </button>

                          <button
                            onClick={() => {
                              setShowUserMenu(false)
                              router.push('/user/profile/settings')
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-pink-50 transition-colors text-left"
                          >
                            <Settings className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">設定</span>
                          </button>
                        </div>

                        {/* ログアウト */}
                        <div className="border-t border-pink-100 pt-2">
                          <button
                            onClick={() => {
                              setShowUserMenu(false)
                              handleLogout()
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-rose-50 transition-colors text-left"
                          >
                            <LogOut className="w-5 h-5 text-rose-600" />
                            <span className="text-sm font-medium text-rose-600">ログアウト</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="max-w-7xl mx-auto">
          {children}
        </main>

        {/* 下部固定ナビゲーション */}
        {showBottomNav && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-2">
              <div className="flex items-center justify-around">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => router.push(item.path)}
                      className={`flex flex-col items-center py-3 px-4 flex-1 transition-all duration-200 ${
                        active 
                          ? 'text-pink-600' 
                          : 'text-gray-500 hover:text-pink-500'
                      }`}
                    >
                      <div className={`relative ${active ? 'transform scale-110' : ''}`}>
                        <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
                        {active && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-600 rounded-full"></div>
                        )}
                      </div>
                      <span className={`text-xs mt-1 font-medium ${
                        active ? 'text-pink-600' : 'text-gray-600'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </nav>
        )}
      </div>
    </>
  )
}
