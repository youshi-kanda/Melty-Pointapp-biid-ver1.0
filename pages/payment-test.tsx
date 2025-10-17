import { useState } from 'react'
import { PaymentAPI } from '../lib/api-config'

export default function PaymentTest() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(1000)

  const testPaymentFlow = async (action: 'success' | 'cancel') => {
    setLoading(true)
    setResult(null)
    
    try {
      // Step 1: 決済開始
      const initResult = await PaymentAPI.initiate(amount)
      console.log('Payment initiated:', initResult)
      
      // Step 2: モック決済実行
      const mockResult = await PaymentAPI.mock(action, amount)
      console.log('Mock payment result:', mockResult)
      
      // Step 3: ステータス確認
      if (initResult.transaction_id) {
        const statusResult = await PaymentAPI.checkStatus(initResult.transaction_id)
        console.log('Payment status:', statusResult)
        
        setResult({
          step1_initiate: initResult,
          step2_mock: mockResult,
          step3_status: statusResult,
          flow_status: action === 'success' ? 'completed' : 'cancelled'
        })
      }
      
    } catch (error) {
      console.error('Payment flow error:', error)
      setResult({
        error: error instanceof Error ? error.message : 'Unknown error',
        flow_status: 'failed'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>🧪 Payment Flow Test</h1>
      <p>決済フローの動作確認用テストページ</p>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          決済金額: 
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
          円
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => testPaymentFlow('success')}
          disabled={loading}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          ✅ 決済成功テスト
        </button>
        
        <button 
          onClick={() => testPaymentFlow('cancel')}
          disabled={loading}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          ❌ 決済キャンセルテスト
        </button>
      </div>

      {loading && (
        <div style={{ 
          padding: '20px',
          backgroundColor: '#f3f4f6',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          🔄 決済フローをテスト中...
        </div>
      )}

      {result && (
        <div style={{ 
          padding: '20px',
          backgroundColor: result.error ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${result.error ? '#fca5a5' : '#bbf7d0'}`,
          borderRadius: '5px'
        }}>
          <h3>テスト結果:</h3>
          <pre style={{ 
            backgroundColor: '#f9fafb',
            padding: '15px',
            borderRadius: '3px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
          
          {result.flow_status && (
            <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
              フロー状態: 
              <span style={{ 
                color: result.flow_status === 'completed' ? '#10b981' : 
                       result.flow_status === 'cancelled' ? '#ef4444' : '#f59e0b'
              }}>
                {result.flow_status === 'completed' && '✅ 完了'}
                {result.flow_status === 'cancelled' && '❌ キャンセル'}
                {result.flow_status === 'failed' && '⚠️ エラー'}
              </span>
            </div>
          )}
        </div>
      )}
      
      <div style={{ 
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#fffbeb',
        border: '1px solid #fbbf24',
        borderRadius: '5px'
      }}>
        <h4>📝 チェックポイント:</h4>
        <ul>
          <li>✅ Console エラー（Invariant エラー）が出ないか</li>
          <li>✅ Unmocked API intercepted エラーが出ないか</li>
          <li>✅ /api/core/payments/ が 200/201 レスポンスを返すか</li>
          <li>✅ 支払いフローが成功/キャンセルまで通るか</li>
          <li>✅ Unexpected token '&lt;' エラーが出ないか</li>
        </ul>
      </div>
      
      <p style={{ marginTop: '20px', color: '#6b7280', fontSize: '14px' }}>
        <a href="/">← ホームに戻る</a> | 
        <a href="/terminal-simple.html" style={{ marginLeft: '10px' }}>端末画面へ</a>
      </p>
    </div>
  )
}