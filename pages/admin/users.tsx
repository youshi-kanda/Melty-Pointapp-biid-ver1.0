import { useState } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/Sidebar';
import { 
  Search, 
  Filter, 
  X,
  Eye,
  Ban,
  CheckCircle,
  Edit,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Coins
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  points: number;
  status: 'active' | 'suspended';
  joinDate: string;
  lastActive: string;
  area: string;
  totalTransactions: number;
}

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPointAdjustModal, setShowPointAdjustModal] = useState(false);
  const [pointAdjustment, setPointAdjustment] = useState({ amount: 0, reason: '' });

  // デモデータ
  const [users] = useState<User[]>([
    {
      id: 1,
      name: '田中太郎',
      email: 'tanaka@example.com',
      phone: '090-1234-5678',
      points: 15000,
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-10-22',
      area: '大阪',
      totalTransactions: 42
    },
    {
      id: 2,
      name: '佐藤花子',
      email: 'sato@example.com',
      phone: '090-2345-6789',
      points: 8500,
      status: 'active',
      joinDate: '2024-02-20',
      lastActive: '2024-10-21',
      area: '東京',
      totalTransactions: 28
    },
    {
      id: 3,
      name: '鈴木一郎',
      email: 'suzuki@example.com',
      phone: '090-3456-7890',
      points: 0,
      status: 'suspended',
      joinDate: '2024-03-10',
      lastActive: '2024-10-10',
      area: '名古屋',
      totalTransactions: 5
    },
    {
      id: 4,
      name: '高橋美咲',
      email: 'takahashi@example.com',
      phone: '090-4567-8901',
      points: 23000,
      status: 'active',
      joinDate: '2024-01-05',
      lastActive: '2024-10-23',
      area: '大阪',
      totalTransactions: 67
    },
    {
      id: 5,
      name: '伊藤健太',
      email: 'ito@example.com',
      phone: '090-5678-9012',
      points: 12000,
      status: 'active',
      joinDate: '2024-04-12',
      lastActive: '2024-10-20',
      area: '福岡',
      totalTransactions: 35
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handlePointAdjust = (user: User) => {
    setSelectedUser(user);
    setShowPointAdjustModal(true);
  };

  const handleToggleStatus = (user: User) => {
    console.log('ステータス変更:', user);
    // 実際のAPI呼び出しはここに追加
  };

  const submitPointAdjustment = () => {
    console.log('ポイント調整:', selectedUser, pointAdjustment);
    setShowPointAdjustModal(false);
    setPointAdjustment({ amount: 0, reason: '' });
  };

  return (
    <>
      <Head>
        <title>ユーザー管理 - BIID 管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar currentPage="users" />

        <main className="flex-1 lg:ml-64">
          {/* ヘッダー */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
              <p className="text-gray-600 text-sm mt-1">登録ユーザーの閲覧・管理</p>
            </div>
          </header>

          <div className="p-6">
            {/* 検索・フィルター */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* 検索 */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="ユーザー名、メールアドレスで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* ステータスフィルター */}
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">全ステータス</option>
                    <option value="active">アクティブ</option>
                    <option value="suspended">停止中</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ユーザー一覧テーブル */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ユーザー
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        連絡先
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ポイント
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        取引数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        最終アクティブ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.area}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-purple-600 font-semibold">
                            <Coins size={16} />
                            {user.points.toLocaleString()}P
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {user.totalTransactions}回
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? 'アクティブ' : '停止中'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastActive}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetail(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="詳細表示"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handlePointAdjust(user)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="ポイント調整"
                            >
                              <Coins size={18} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className={`p-2 rounded-lg transition-colors ${
                                user.status === 'active'
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={user.status === 'active' ? 'アカウント停止' : 'アカウント有効化'}
                            >
                              {user.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ユーザー詳細モーダル */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">ユーザー詳細</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 基本情報 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ユーザー名</p>
                    <p className="font-medium text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">エリア</p>
                    <p className="font-medium text-gray-900">{selectedUser.area}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">メールアドレス</p>
                    <p className="font-medium text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">電話番号</p>
                    <p className="font-medium text-gray-900">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">登録日</p>
                    <p className="font-medium text-gray-900">{selectedUser.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">最終アクティブ</p>
                    <p className="font-medium text-gray-900">{selectedUser.lastActive}</p>
                  </div>
                </div>
              </div>

              {/* 統計情報 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">統計情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600 mb-1">保有ポイント</p>
                    <p className="text-2xl font-bold text-purple-700">{selectedUser.points.toLocaleString()}P</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">総取引数</p>
                    <p className="text-2xl font-bold text-blue-700">{selectedUser.totalTransactions}回</p>
                  </div>
                </div>
              </div>

              {/* ステータス */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">アカウントステータス</h3>
                <div className={`p-4 rounded-lg ${
                  selectedUser.status === 'active' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <p className={`text-sm font-medium ${
                    selectedUser.status === 'active' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {selectedUser.status === 'active' ? 'アクティブ（正常に利用可能）' : 'アカウント停止中'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ポイント調整モーダル */}
      {showPointAdjustModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">ポイント調整</h2>
              <button
                onClick={() => setShowPointAdjustModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">対象ユーザー</p>
                <p className="font-medium text-gray-900">{selectedUser.name}</p>
                <p className="text-sm text-gray-600">現在のポイント: {selectedUser.points.toLocaleString()}P</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  調整額（正の数で加算、負の数で減算）
                </label>
                <input
                  type="number"
                  value={pointAdjustment.amount}
                  onChange={(e) => setPointAdjustment({ ...pointAdjustment, amount: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="例: 1000 または -500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  調整理由
                </label>
                <textarea
                  value={pointAdjustment.reason}
                  onChange={(e) => setPointAdjustment({ ...pointAdjustment, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="調整の理由を入力してください"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPointAdjustModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={submitPointAdjustment}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  調整を実行
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
