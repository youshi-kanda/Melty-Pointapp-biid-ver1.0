import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { setupGlobalErrorHandling } from '../lib/error-handler'
import { Comfortaa } from 'next/font/google'
import '../styles/globals.css'
import '../styles/mobile-optimizations.css'

const comfortaa = Comfortaa({ 
  subsets: ['latin'],
  display: 'swap',
})

// Console エラーを防ぐためのグローバル設定
if (typeof window !== 'undefined') {
  // Invariant エラーを防ぐための設定
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('Invariant')) {
      console.warn('Invariant error caught and handled:', event.reason.message)
      event.preventDefault()
    }
    
    // Unexpected token エラーも処理
    if (event.reason?.message?.includes('Unexpected token')) {
      console.warn('JSON Parse error caught and handled:', event.reason.message)
      event.preventDefault()
    }
  })
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // グローバルエラーハンドリングを設定
    setupGlobalErrorHandling()
    
    // React Strict Mode での重複実行を防ぐ
    const isDev = process.env.NODE_ENV === 'development'
    if (isDev) {
      console.log('Melty+ (メルティプラス) - Development Mode')
    }
    
    // PWA Service Worker登録（ユーザーアプリと決済端末のみ）
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const path = window.location.pathname
      const isPWAPath = path.startsWith('/user/') || path.startsWith('/terminal/')
      
      if (isPWAPath) {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration.scope)
            
            // 更新チェック
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // 新しいバージョンが利用可能
                    console.log('🆕 New version available!')
                    if (confirm('新しいバージョンが利用可能です。更新しますか？')) {
                      window.location.reload()
                    }
                  }
                })
              }
            })
          })
          .catch((error) => {
            console.error('❌ Service Worker registration failed:', error)
          })
      }
    }
  }, [])

  return (
    <main className={comfortaa.className}>
      <Component {...pageProps} />
    </main>
  )
}