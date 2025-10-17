// エラーハンドリング - Unexpected token '<' エラー対策

export class APIError extends Error {
  constructor(message: string, public status?: number, public response?: any) {
    super(message)
    this.name = 'APIError'
  }
}

export async function safeApiCall(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    // レスポンスのContent-Typeをチェック
    const contentType = response.headers.get('content-type')
    
    if (!contentType?.includes('application/json')) {
      // HTMLが返された場合（通常はエラーページ）
      const text = await response.text()
      console.warn('Non-JSON response received:', {
        url,
        status: response.status,
        contentType,
        textPreview: text.substring(0, 200)
      })
      
      throw new APIError(
        `Server returned HTML instead of JSON (${response.status})`,
        response.status,
        { contentType, textPreview: text.substring(0, 200) }
      )
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Parse error' }))
      throw new APIError(
        `API Error: ${response.status}`,
        response.status,
        errorData
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    
    // SyntaxError: Unexpected token '<' の場合
    if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
      console.error('JSON Parse Error - likely received HTML instead of JSON:', {
        url,
        error: error.message
      })
      
      throw new APIError(
        'Received invalid JSON response (possibly HTML error page)',
        500,
        { originalError: error.message }
      )
    }
    
    throw error
  }
}

// フロントエンド用のグローバルエラーハンドラー
export function setupGlobalErrorHandling() {
  if (typeof window === 'undefined') return

  // Promise rejection エラーをキャッチ
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason
    
    // API関連のエラーをログに記録
    if (error instanceof APIError) {
      console.warn('🚨 API Error caught:', {
        message: error.message,
        status: error.status,
        response: error.response
      })
      event.preventDefault() // デフォルトのエラー表示を防ぐ
    }
    
    // Unexpected token エラーの場合
    if (error?.message?.includes('Unexpected token')) {
      console.warn('🚨 JSON Parse Error caught:', error.message)
      event.preventDefault()
    }
  })

  // 一般的なJavaScriptエラーもキャッチ
  window.addEventListener('error', (event) => {
    if (event.error?.message?.includes('Unexpected token')) {
      console.warn('🚨 Script Error caught:', event.error.message)
    }
  })
}

// APIレスポンスの安全なパース
export function safeJsonParse(text: string, fallback: any = null) {
  try {
    return JSON.parse(text)
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn('JSON Parse failed, returning fallback:', {
        error: error.message,
        textPreview: text.substring(0, 100)
      })
    }
    return fallback
  }
}