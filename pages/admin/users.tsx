import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminSidebar from '../../components/admin/Sidebar';
import { 
  Search, 
  Download,
  Upload,
  Plus,
  Users,
  CheckCircle,
  AlertTriangle,
  Ban,
  Eye,
  Pen,
  MoreVertical,
  Menu,
  Bell,
  User,
  LogOut
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  username: string;
  memberId: string;
  email: string;
  status: 'active' | 'pending' | 'suspended';
  verified: boolean;
  role: string;
  points: number;
  level: number;
  transactions: number;
  totalSpent: number;
  joinDate: string;
  lastLogin: string;
  loginCount: number;
}

export default function UsersManagement() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('registrationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // デモデータ（本番HTMLより）
  const [users] = useState<User[]>([
    {
      id: '1',
      name: '山田太郎',
      username: 'yamada_taro',
      memberId: 'M001234',
      email: 'yamada@example.com',
      status: 'active',
      verified: true,
      role: 'ユーザー',
      points: 15000,
      level: 3,
      transactions: 42,
      totalSpent: 125000,
      joinDate: '2024-01-15',
      lastLogin: '2024-10-22 14:30',
      loginCount: 89
    },
    {
      id: '2',
      name: '佐藤花子',
      username: 'sato_hanako',
      memberId: 'M001567',
      email: 'sato@example.com',
      status: 'active',
      verified: true,
      role: 'ユーザー',
      points: 8500,
      level: 2,
      transactions: 28,
      totalSpent: 78000,
      joinDate: '2024-02-20',
      lastLogin: '2024-10-21 10:15',
      loginCount: 56
    },
    {
      id: '3',
      name: '鈴木一郎',
      username: 'suzuki_ichiro',
      memberId: 'M001890',
      email: 'suzuki@example.com',
      status: 'pending',
      verified: false,
      role: 'ユーザー',
      points: 0,
      level: 1,
      transactions: 0,
      totalSpent: 0,
      joinDate: '2024-10-20',
      lastLogin: '2024-10-20 09:00',
      loginCount: 1
    },
    {
      id: '4',
      name: '高橋美咲',
      username: 'takahashi_misaki',
      memberId: 'M000789',
      email: 'takahashi@example.com',
      status: 'active',
      verified: true,
      role: 'ユーザー',
      points: 23000,
      level: 4,
      transactions: 67,
      totalSpent: 234000,
      joinDate: '2024-01-05',
      lastLogin: '2024-10-23 16:45',
      loginCount: 124
    },
    {
      id: '5',
      name: '田中健太',
      username: 'tanaka_kenta',
      memberId: 'M001456',
      email: 'tanaka@example.com',
      status: 'suspended',
      verified: true,
      role: 'ユーザー',
      points: 12000,
      level: 3,
      transactions: 35,
      totalSpent: 98000,
      joinDate: '2024-03-10',
      lastLogin: '2024-10-10 13:20',
      loginCount: 67
    }
  ]);

  // フィルタリング
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesVerified = verifiedFilter === 'all' || 
                           (verifiedFilter === 'verified' && user.verified) ||
                           (verifiedFilter === 'unverified' && !user.verified);
    return matchesSearch && matchesStatus && matchesRole && matchesVerified;
  });

  // 統計計算
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    suspended: users.filter(u => u.status === 'suspended').length
  };

  // アバター色の生成（統一カラー）
  const getAvatarColor = (id: string) => {
    return 'from-slate-600 to-slate-700';
  };

  return (
    <>
      <Head>
        <title>ユーザー管理 - Melty+ 管理</title>
      </Head>

      <div className="flex min-h-screen bg-white">
        {/* サイドバー */}
        <AdminSidebar currentPage="users" />

        {/* メインコンテンツ */}
        <main className="flex-1 md:ml-64">
          {/* トップバー */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-14">
            <div className="h-full px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-1.5 hover:bg-slate-100 rounded-lg"
                >
                  <Menu size={20} />
                </button>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">ユーザー管理</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="relative p-1.5 hover:bg-slate-100 rounded-lg">
                  <Bell size={18} className="text-slate-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <User size={16} className="text-slate-600" />
                  </div>
                  <button className="hover:bg-slate-100 p-1.5 rounded-lg">
                    <LogOut size={18} className="text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="p-3 space-y-3">
            {/* ヘッダー - アクションボタン */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">ユーザー管理</h2>
                <p className="text-slate-600 text-sm mt-0.5">登録ユーザーの閲覧・管理</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  <Download size={14} />
                  <span className="hidden sm:inline">エクスポート</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  <Upload size={14} />
                  <span className="hidden sm:inline">インポート</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm">
                  <Plus size={14} />
                  <span className="hidden sm:inline">新規ユーザー</span>
                </button>
              </div>
            </div>

            {/* 統計カード */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="bg-white rounded-lg border border-slate-200 p-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 mb-0.5">総ユーザー数</p>
                    <p className="text-lg font-bold text-slate-900">{stats.total}</p>
                  </div>
                  <div className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Users size={18} className="text-slate-300" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 mb-0.5">アクティブ</p>
                    <p className="text-lg font-bold text-slate-900">{stats.active}</p>
                  </div>
                  <div className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center">
                    <CheckCircle size={18} className="text-slate-300" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 mb-0.5">承認待ち</p>
                    <p className="text-lg font-bold text-slate-900">{stats.pending}</p>
                  </div>
                  <div className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center">
                    <AlertTriangle size={18} className="text-slate-300" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 mb-0.5">停止中</p>
                    <p className="text-lg font-bold text-slate-900">{stats.suspended}</p>
                  </div>
                  <div className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Ban size={18} className="text-slate-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* 検索・フィルター */}
            <div className="bg-white rounded-lg border border-slate-200 p-2.5 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-2">
                {/* 検索 */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="ユーザー名、メール、ユーザーIDで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* フィルター */}
                <div className="flex flex-wrap gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                  >
                    <option value="all">全ステータス</option>
                    <option value="active">アクティブ</option>
                    <option value="inactive">非アクティブ</option>
                    <option value="suspended">停止中</option>
                    <option value="pending">承認待ち</option>
                  </select>

                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                  >
                    <option value="all">全ロール</option>
                    <option value="admin">管理者</option>
                    <option value="moderator">モデレーター</option>
                    <option value="user">ユーザー</option>
                  </select>

                  <select
                    value={verifiedFilter}
                    onChange={(e) => setVerifiedFilter(e.target.value)}
                    className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                  >
                    <option value="all">全認証状態</option>
                    <option value="verified">認証済み</option>
                    <option value="unverified">未認証</option>
                    <option value="pending">認証待ち</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                  >
                    <option value="registrationDate">登録日順</option>
                    <option value="lastLogin">最終ログイン順</option>
                    <option value="name">名前順</option>
                    <option value="points">ポイント順</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ユーザーテーブル */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ユーザー
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ロール
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ポイント
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        アクティビティ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        登録日
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        最終ログイン
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 bg-gradient-to-br ${getAvatarColor(user.id)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <div className="font-medium text-gray-900 text-sm">{user.name}</div>
                                {user.verified && (
                                  <CheckCircle size={13} className="text-slate-500" />
                                )}
                              </div>
                              <div className="text-xs text-gray-500">@{user.username}</div>
                              <div className="text-xs text-gray-400">{user.memberId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? 'アクティブ' :
                             user.status === 'pending' ? '承認待ち' :
                             '停止中'}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                          {user.role}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm font-semibold text-slate-600">
                            {user.points.toLocaleString()}pt
                          </div>
                          <div className="text-xs text-gray-500">
                            Lv.{user.level}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.transactions}回の取引
                          </div>
                          <div className="text-xs text-gray-500">
                            ¥{user.totalSpent.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                          {user.joinDate}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.lastLogin}</div>
                          <div className="text-xs text-gray-500">
                            {user.loginCount}回ログイン
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                              title="詳細表示"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                              title="編集"
                            >
                              <Pen size={15} />
                            </button>
                            <button
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="その他"
                            >
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ページネーション */}
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  5件中 1 - 5件を表示
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 text-sm" disabled>
                    前へ
                  </button>
                  <button className="px-2.5 py-1 bg-slate-700 text-white rounded text-sm">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50" disabled>
                    次へ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
