import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // 安全なリダイレクト処理（Invariant エラーを防ぐ）
    const redirectToTerminal = () => {
      try {
        router.replace('/terminal/login')
      } catch (error) {
        console.warn('Navigation error:', error)
        // フォールバック: 直接 window.location を使用
        if (typeof window !== 'undefined') {
          window.location.href = '/terminal/login'
        }
      }
    }

    // 少し遅延させて React の初期化を待つ
    const timeoutId = setTimeout(redirectToTerminal, 100)
    
    return () => clearTimeout(timeoutId)
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Melty+ (メルティプラス)</h1>
        <p>Loading terminal interface...</p>
        <p><Link href="/terminal/login">Click here if not redirected</Link></p>
      </div>
    </div>
  )
}