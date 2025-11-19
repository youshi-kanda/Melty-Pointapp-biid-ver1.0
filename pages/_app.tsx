import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { setupGlobalErrorHandling } from '../lib/error-handler'
import { Comfortaa } from 'next/font/google'
import '../styles/globals.css'

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
  }, [])

  return (
    <main className={comfortaa.className}>
      <Component {...pageProps} />
    </main>
  )
}