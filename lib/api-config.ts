// API設定 - 環境に応じた設定切り替え
export const API_CONFIG = {
  // ベースURL(環境に応じて切り替え)
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.biid-point.com'  // 本番環境 (ドメインはそのまま維持)
    : 'http://localhost:8000',      // 開発環境
  
  // APIエンドポイント
  ENDPOINTS: {
    // 認証関連
    LOGIN: '/api/auth/login/',
    REFRESH: '/api/auth/refresh/',
    LOGOUT: '/api/auth/logout/',
    
    // 決済関連
    PAYMENTS: '/api/core/payments/',
    PAYMENT_STATUS: '/api/core/payments/status/',
    MOCK_PAYMENT: '/api/core/payments/mock/',
    
    // GMO決済
    GMOPG_INITIATE: '/api/gmopg/payment/initiate/',
    GMOPG_STATUS: '/api/gmopg/payment/status/',
    
    // ポイント関連
    POINTS_GRANT: '/api/core/points/grant/',
    POINTS_HISTORY: '/api/core/points/history/',
    
    // ユーザー関連
    USER_ME: '/api/core/user/me/',
    
    // ヘルスチェック
    HEALTH: '/api/health/',
    STATUS: '/api/status/',
  },
  
  // リクエスト設定
  TIMEOUT: 30000, // 30秒
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

// APIベースURLを取得するヘルパー関数
export function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    // クライアントサイドの場合
    const hostname = window.location.hostname
    if (hostname === 'biid-user.pages.dev' || hostname.includes('biid-user')) {
      return 'https://biid-user.fly.dev/api'
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000'
    }
  }
  // サーバーサイド or デフォルト
  return process.env.NODE_ENV === 'production' 
    ? 'https://biid-user.fly.dev/api'
    : 'http://localhost:8000'
}

// APIクライアント関数（エラーハンドリング強化版）
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
      // タイムアウト設定
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })
    
    // Content-Type チェック（Unexpected token '<' エラー対策）
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      const text = await response.text()
      console.warn('Non-JSON response from API:', {
        url,
        status: response.status,
        contentType,
        preview: text.substring(0, 200)
      })
      
      // HTMLエラーページが返された場合
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        throw new Error(`Server returned HTML error page (${response.status})`)
      }
    }
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    // Unexpected token エラーの詳細ログ
    if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
      console.error('JSON Parse Error - received invalid response:', {
        url,
        error: error.message,
        suggestion: 'Check if server is returning HTML instead of JSON'
      })
    }
    
    console.error('API Call failed:', error)
    throw error
  }
}

// 決済API専用関数
export const PaymentAPI = {
  // 決済開始
  initiate: (amount: number, paymentMethod: string = 'qr') => 
    apiCall(API_CONFIG.ENDPOINTS.PAYMENTS, {
      method: 'POST',
      body: JSON.stringify({ amount, payment_method: paymentMethod }),
    }),
  
  // 決済ステータス確認
  checkStatus: (transactionId: string) =>
    apiCall(`${API_CONFIG.ENDPOINTS.PAYMENT_STATUS}?transaction_id=${transactionId}`),
  
  // モック決済
  mock: (action: 'success' | 'cancel' = 'success', amount: number = 1000) =>
    apiCall(API_CONFIG.ENDPOINTS.MOCK_PAYMENT, {
      method: 'POST',
      body: JSON.stringify({ action, amount }),
    }),
}