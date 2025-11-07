import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import StoreSidebar from '@/components/store/StoreSidebar'
import { 
  FileText, Clock, CheckCircle, XCircle, 
  Eye, MessageCircle, Send, Image as ImageIcon,
  Loader, Search, Filter, AlertTriangle, Check, X
} from 'lucide-react'
import { getApiUrl } from '@/lib/api-config'

interface ECRequest {
  id: number
  user_name: string
  store_name: string
  purchase_amount: string
  order_id: string
  purchase_date: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  points_to_award: number
  receipt_image?: string
  receipt_description?: string
  created_at: string
  messages?: ECMessage[]
}

interface ECMessage {
  id: number
  sender_name: string
  message: string
  is_from_store: boolean
  created_at: string
}

export default function StoreECRequestsPage() {
  const [requests, setRequests] = useState<ECRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<ECRequest | null>(null)
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [message, setMessage] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth_token')
      const url = statusFilter === 'all' 
        ? `${getApiUrl()}/api/ec/store/all-requests/`
        : `${getApiUrl()}/api/ec/store/pending-requests/`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        let filteredRequests = data.requests || []
        
        // ステータスフィルター
        if (statusFilter !== 'all' && statusFilter !== 'pending') {
          filteredRequests = filteredRequests.filter((r: ECRequest) => r.status === statusFilter)
        }
        
        setRequests(filteredRequests)
      }
    } catch (err) {
      console.error('申請一覧の取得に失敗:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [statusFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (requestId: number) => {
    if (!confirm('この申請を承認しますか？\nクレジット決済でポイントが付与されます。')) {
      return
    }

    try {
      setProcessing(true)
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${getApiUrl()}/api/ec/store/requests/${requestId}/approve/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payment_method: 'card_payment'  // クレジット決済のみ
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        alert('承認しました。ポイントが付与されました。')
        setSelectedRequest(null)
        fetchRequests()
      } else {
        alert(data.error || '承認に失敗しました')
      }
    } catch (err) {
      console.error('承認エラー:', err)
      alert('承認処理中にエラーが発生しました')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('拒否理由を入力してください')
      return
    }

    if (!selectedRequest) return

    try {
      setProcessing(true)
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${getApiUrl()}/api/ec/store/requests/${selectedRequest.id}/approve/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'reject',
          rejection_reason: rejectionReason
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        alert('申請を拒否しました')
        setShowRejectModal(false)
        setRejectionReason('')
        setSelectedRequest(null)
        fetchRequests()
      } else {
        alert(data.error || '拒否処理に失敗しました')
      }
    } catch (err) {
      console.error('拒否エラー:', err)
      alert('拒否処理中にエラーが発生しました')
    } finally {
      setProcessing(false)
    }
  }

  const handleSendMessage = async (requestId: number) => {
    if (!message.trim()) return

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${getApiUrl()}/api/ec/requests/${requestId}/messages/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      })

      if (response.ok) {
        setMessage('')
        // メッセージ更新
        const updatedRequest = await fetch(`${getApiUrl()}/api/ec/store/requests/${requestId}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json())
        setSelectedRequest(updatedRequest.request)
      }
    } catch (err) {
      console.error('メッセージ送信エラー:', err)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: '承認待ち' },
      approved: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle, label: '承認済み' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: '拒否' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: '完了' }
    }
    const badge = badges[status as keyof typeof badges]
    const Icon = badge.icon
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span>{badge.label}</span>
      </span>
    )
  }

  const filteredRequests = requests.filter(req => 
    searchQuery === '' || 
    req.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.order_id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Head>
        <title>EC購入申請管理 - Melty+</title>
      </Head>
      <div className="flex h-screen bg-gray-50">
        <StoreSidebar currentPage="ec-requests" />
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* ヘッダー */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">EC購入申請管理</h1>
              <p className="text-gray-600">ユーザーからのポイント付与申請を管理</p>
            </div>

            {/* フィルターと検索 */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ステータスフィルター */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Filter className="w-4 h-4 inline mr-1" />
                    ステータス
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none"
                  >
                    <option value="pending">承認待ち</option>
                    <option value="all">すべて</option>
                    <option value="approved">承認済み</option>
                    <option value="rejected">拒否</option>
                  </select>
                </div>

                {/* 検索 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Search className="w-4 h-4 inline mr-1" />
                    検索
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ユーザー名、注文ID..."
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 申請一覧 */}
            {loading ? (
              <div className="text-center py-12">
                <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
                <p className="text-gray-600 mt-4">読み込み中...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">申請がありません</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredRequests.map(request => (
                  <div key={request.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              {request.user_name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">{request.user_name}</h3>
                              <p className="text-sm text-gray-600">注文ID: {request.order_id}</p>
                            </div>
                            {getStatusBadge(request.status)}
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-600 mb-1">購入金額</p>
                              <p className="text-lg font-bold text-gray-800">¥{Number(request.purchase_amount).toLocaleString()}</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3">
                              <p className="text-xs text-gray-600 mb-1">付与ポイント</p>
                              <p className="text-lg font-bold text-blue-600">{request.points_to_award} pt</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-600 mb-1">申請日</p>
                              <p className="text-sm font-bold text-gray-800">
                                {new Date(request.created_at).toLocaleDateString('ja-JP')}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4 flex flex-col space-y-2">
                          <button
                            onClick={() => setSelectedRequest(selectedRequest?.id === request.id ? null : request)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold transition-colors flex items-center space-x-2"
                          >
                            <Eye className="w-4 h-4" />
                            <span>{selectedRequest?.id === request.id ? '閉じる' : '詳細'}</span>
                          </button>

                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(request.id)}
                                disabled={processing}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold transition-colors flex items-center space-x-2 disabled:opacity-50"
                              >
                                <Check className="w-4 h-4" />
                                <span>承認</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRequest(request)
                                  setShowRejectModal(true)
                                }}
                                disabled={processing}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors flex items-center space-x-2 disabled:opacity-50"
                              >
                                <X className="w-4 h-4" />
                                <span>拒否</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 詳細表示 */}
                      {selectedRequest?.id === request.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* レシート画像 */}
                            <div>
                              <h4 className="font-bold text-gray-700 mb-3 flex items-center space-x-2">
                                <ImageIcon className="w-5 h-5" />
                                <span>レシート画像</span>
                              </h4>
                              {request.receipt_image ? (
                                <div className="border-2 border-gray-200 rounded-lg p-2 relative w-full" style={{ height: '384px' }}>
                                  <Image 
                                    src={request.receipt_image} 
                                    alt="レシート" 
                                    fill
                                    className="object-contain rounded"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <p className="text-gray-500 text-sm">画像なし</p>
                              )}

                              {request.receipt_description && (
                                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                                  <p className="text-sm font-bold text-gray-700 mb-1">備考</p>
                                  <p className="text-sm text-gray-600">{request.receipt_description}</p>
                                </div>
                              )}
                            </div>

                            {/* メッセージ */}
                            <div>
                              <h4 className="font-bold text-gray-700 mb-3 flex items-center space-x-2">
                                <MessageCircle className="w-5 h-5" />
                                <span>メッセージ</span>
                              </h4>

                              <div className="border-2 border-gray-200 rounded-lg p-4">
                                {/* メッセージ履歴 */}
                                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                  {request.messages && request.messages.length > 0 ? (
                                    request.messages.map(msg => (
                                      <div
                                        key={msg.id}
                                        className={`p-3 rounded-lg ${
                                          msg.is_from_store
                                            ? 'bg-blue-100 ml-8'
                                            : 'bg-gray-100 mr-8'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-xs font-bold text-gray-700">
                                            {msg.is_from_store ? '🏪 店舗（あなた）' : '👤 ' + request.user_name}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {new Date(msg.created_at).toLocaleString('ja-JP')}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-800">{msg.message}</p>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">メッセージはありません</p>
                                  )}
                                </div>

                                {/* メッセージ送信 */}
                                {request.status === 'pending' && (
                                  <div className="flex space-x-2">
                                    <input
                                      type="text"
                                      value={message}
                                      onChange={(e) => setMessage(e.target.value)}
                                      placeholder="メッセージを入力..."
                                      className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-sm"
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleSendMessage(request.id)
                                        }
                                      }}
                                    />
                                    <button
                                      onClick={() => handleSendMessage(request.id)}
                                      disabled={!message.trim()}
                                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Send className="w-5 h-5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 拒否モーダル */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">申請を拒否</h3>
            </div>

            <p className="text-gray-600 mb-4">拒否理由を入力してください</p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-red-400 focus:outline-none mb-4"
              rows={4}
              placeholder="例: レシート画像が不鮮明です&#10;例: 購入日時が異なります"
            />

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                }}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? '処理中...' : '拒否する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
