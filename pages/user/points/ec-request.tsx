import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { 
  Upload, Send, FileText, Clock, CheckCircle, XCircle, 
  ImageIcon, Trash2, Store, Calendar, DollarSign, MessageCircle,
  Loader, Info, AlertCircle, X, Camera
} from 'lucide-react'
import { getApiUrl } from '@/lib/api-config'

interface ECRequest {
  id: number
  store_name: string
  purchase_amount: string
  order_id: string
  purchase_date: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  points_to_award: number
  receipt_image?: string
  receipt_description?: string
  created_at: string
  rejection_reason?: string
  messages?: ECMessage[]
}

interface ECMessage {
  id: number
  sender_name: string
  message: string
  is_from_store: boolean
  created_at: string
}

interface Store {
  id: number
  name: string
}

export default function ECRequestPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new')
  const [stores, setStores] = useState<Store[]>([])
  const [requests, setRequests] = useState<ECRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<ECRequest | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // フォーム入力
  const [storeId, setStoreId] = useState('')
  const [purchaseAmount, setPurchaseAmount] = useState('')
  const [orderId, setOrderId] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [receiptImage, setReceiptImage] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string>('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  // エラー・成功メッセージ
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchStores()
    fetchRequests()
  }, [])

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${getApiUrl()}/api/stores/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setStores(data)
      }
    } catch (err) {
      console.error('店舗一覧の取得に失敗:', err)
    }
  }

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${getApiUrl()}/api/ec/user/requests/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests || [])
      }
    } catch (err) {
      console.error('申請履歴の取得に失敗:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!storeId || !purchaseAmount || !orderId || !purchaseDate || !receiptImage) {
      setError('全ての必須項目を入力してください')
      return
    }

    try {
      setSubmitting(true)
      const token = localStorage.getItem('auth_token')
      const formData = new FormData()
      formData.append('store_id', storeId)
      formData.append('purchase_amount', purchaseAmount)
      formData.append('order_id', orderId)
      formData.append('purchase_date', purchaseDate)
      formData.append('receipt_image', receiptImage)
      formData.append('receipt_description', description)

      const response = await fetch(`${getApiUrl()}/api/ec/receipt/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess('申請を送信しました。店舗の承認をお待ちください。')
        // フォームリセット
        setStoreId('')
        setPurchaseAmount('')
        setOrderId('')
        setPurchaseDate('')
        setReceiptImage(null)
        setReceiptPreview('')
        setDescription('')
        // 履歴を再取得
        fetchRequests()
        // 3秒後に履歴タブに切り替え
        setTimeout(() => {
          setActiveTab('history')
          setSuccess('')
        }, 3000)
      } else {
        setError(data.error || '申請の送信に失敗しました')
      }
    } catch (err) {
      console.error('申請エラー:', err)
      setError('申請の送信中にエラーが発生しました')
    } finally {
      setSubmitting(false)
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
        const updatedRequest = await fetch(`${getApiUrl()}/api/ec/user/requests/${requestId}/`, {
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
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span>{badge.label}</span>
      </span>
    )
  }

  return (
    <>
      <Head>
        <title>EC購入ポイント申請 - Melty+</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
        <div className="px-4 py-6 max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">EC購入ポイント申請</h1>
            <p className="text-gray-600">レシートをアップロードしてポイントを申請</p>
          </div>
          {/* タブ */}
          <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex space-x-2">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                activeTab === 'new'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Upload className="w-5 h-5 inline mr-2" />
              新規申請
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              申請履歴
            </button>
          </div>

          {/* 新規申請フォーム */}
          {activeTab === 'new' && (
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <span>EC購入ポイント申請</span>
              </h2>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-bold mb-1">申請の流れ</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>レシート画像と購入情報を入力して申請</li>
                      <li>店舗が内容を確認</li>
                      <li>承認されるとポイントが付与されます</li>
                    </ol>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-4">
                  <p className="text-green-700 text-sm font-bold">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* レシート画像 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Camera className="w-4 h-4 inline mr-1" />
                    レシート画像 <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-pink-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="receipt-upload"
                    />
                    <label htmlFor="receipt-upload" className="cursor-pointer">
                      {receiptPreview ? (
                        <div className="relative mx-auto" style={{ maxWidth: '400px', height: '256px' }}>
                          <Image 
                            src={receiptPreview} 
                            alt="レシート" 
                            fill
                            className="object-contain rounded-xl"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              setReceiptImage(null)
                              setReceiptPreview('')
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 z-10"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-600">クリックして画像を選択</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG形式</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* 店舗選択 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Store className="w-4 h-4 inline mr-1" />
                    店舗 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none"
                    required
                  >
                    <option value="">店舗を選択</option>
                    {stores.map(store => (
                      <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                  </select>
                </div>

                {/* 購入金額 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    購入金額 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none"
                    placeholder="5000"
                    required
                  />
                  {purchaseAmount && (
                    <p className="text-sm text-gray-600 mt-1">
                      付与予定ポイント: <span className="font-bold text-pink-600">{Math.floor(Number(purchaseAmount) / 100)} pt</span>
                    </p>
                  )}
                </div>

                {/* 注文ID */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    注文ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none"
                    placeholder="EC-12345"
                    required
                  />
                </div>

                {/* 購入日 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    購入日 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none"
                    required
                  />
                </div>

                {/* 備考 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    備考（任意）
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none"
                    rows={3}
                    placeholder="購入商品の詳細など"
                  />
                </div>

                {/* 送信ボタン */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>送信中...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>申請を送信</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* 申請履歴 */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <Loader className="w-12 h-12 animate-spin text-pink-500 mx-auto" />
                  <p className="text-gray-600 mt-4">読み込み中...</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">申請履歴がありません</p>
                </div>
              ) : (
                requests.map(request => (
                  <div key={request.id} className="bg-white rounded-3xl shadow-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">{request.store_name}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">購入金額:</span>
                            <span className="font-bold text-gray-800 ml-2">¥{Number(request.purchase_amount).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">付与ポイント:</span>
                            <span className="font-bold text-pink-600 ml-2">{request.points_to_award} pt</span>
                          </div>
                          <div>
                            <span className="text-gray-600">注文ID:</span>
                            <span className="font-mono text-gray-800 ml-2">{request.order_id}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">申請日:</span>
                            <span className="text-gray-800 ml-2">{new Date(request.created_at).toLocaleDateString('ja-JP')}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedRequest(selectedRequest?.id === request.id ? null : request)}
                        className="ml-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold transition-colors"
                      >
                        {selectedRequest?.id === request.id ? '閉じる' : '詳細'}
                      </button>
                    </div>

                    {/* 詳細表示 */}
                    {selectedRequest?.id === request.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        {/* レシート画像 */}
                        {request.receipt_image && (
                          <div className="mb-4">
                            <h4 className="font-bold text-gray-700 mb-2">レシート画像</h4>
                            <div className="relative mx-auto border-2 border-gray-200 rounded-xl" style={{ maxWidth: '400px', height: '256px' }}>
                              <Image 
                                src={request.receipt_image} 
                                alt="レシート" 
                                fill
                                className="object-contain rounded-xl"
                                unoptimized
                              />
                            </div>
                          </div>
                        )}

                        {/* 拒否理由 */}
                        {request.status === 'rejected' && request.rejection_reason && (
                          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
                            <h4 className="font-bold text-red-700 mb-1">拒否理由</h4>
                            <p className="text-sm text-red-600">{request.rejection_reason}</p>
                          </div>
                        )}

                        {/* メッセージ機能 */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-bold text-gray-700 mb-3 flex items-center space-x-2">
                            <MessageCircle className="w-5 h-5" />
                            <span>メッセージ</span>
                          </h4>

                          {/* メッセージ履歴 */}
                          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                            {request.messages && request.messages.length > 0 ? (
                              request.messages.map(msg => (
                                <div
                                  key={msg.id}
                                  className={`p-3 rounded-xl ${
                                    msg.is_from_store
                                      ? 'bg-blue-100 ml-8'
                                      : 'bg-white mr-8'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-gray-700">
                                      {msg.is_from_store ? '🏪 店舗' : '👤 あなた'}
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
                                className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none text-sm"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSendMessage(request.id)
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleSendMessage(request.id)}
                                disabled={!message.trim()}
                                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Send className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
