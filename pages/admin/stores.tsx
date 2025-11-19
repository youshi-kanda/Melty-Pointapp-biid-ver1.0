import { useState } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/Sidebar';
import { 
  Search, 
  Filter, 
  X,
  Eye,
  Edit,
  Plus,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Clock,
  TrendingUp
} from 'lucide-react';

interface Store {
  id: number;
  name: string;
  area: string;
  address: string;
  phone: string;
  status: 'active' | 'pending' | 'rejected';
  pointRate: number;
  registeredDate: string;
  monthlyTransactions: number;
  totalRevenue: number;
}

export default function StoresManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // デモデータ
  const [stores] = useState<Store[]>([
    {
      id: 1,
      name: 'カフェ・ド・パリ 梅田店',
      area: '大阪',
      address: '大阪市北区梅田1-1-1',
      phone: '06-1234-5678',
      status: 'active',
      pointRate: 5,
      registeredDate: '2024-01-10',
      monthlyTransactions: 156,
      totalRevenue: 1250000
    },
    {
      id: 2,
      name: 'レストラン銀座',
      area: '東京',
      address: '東京都中央区銀座2-2-2',
      phone: '03-2345-6789',
      status: 'active',
      pointRate: 3,
      registeredDate: '2024-02-15',
      monthlyTransactions: 203,
      totalRevenue: 2150000
    },
    {
      id: 3,
      name: 'スイーツハウス',
      area: '大阪',
      address: '大阪市中央区心斎橋3-3-3',
      phone: '06-3456-7890',
      status: 'pending',
      pointRate: 0,
      registeredDate: '2024-10-20',
      monthlyTransactions: 0,
      totalRevenue: 0
    },
    {
      id: 4,
      name: 'イタリアンキッチン',
      area: '名古屋',
      address: '名古屋市中区栄4-4-4',
      phone: '052-4567-8901',
      status: 'active',
      pointRate: 4,
      registeredDate: '2024-03-01',
      monthlyTransactions: 98,
      totalRevenue: 890000
    },
    {
      id: 5,
      name: 'ラーメン横丁',
      area: '福岡',
      address: '福岡市博多区5-5-5',
      phone: '092-5678-9012',
      status: 'rejected',
      pointRate: 0,
      registeredDate: '2024-09-15',
      monthlyTransactions: 0,
      totalRevenue: 0
    }
  ]);

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         store.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = areaFilter === 'all' || store.area === areaFilter;
    const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
    return matchesSearch && matchesArea && matchesStatus;
  });

  const areas = ['all', ...Array.from(new Set(stores.map(s => s.area)))];

  const handleViewDetail = (store: Store) => {
    setSelectedStore(store);
    setShowDetailModal(true);
  };

  const handleEdit = (store: Store) => {
    setSelectedStore(store);
    setShowEditModal(true);
  };

  const handleApprove = (store: Store) => {
    console.log('店舗承認:', store);
    // 実際のAPI呼び出しはここに追加
  };

  const handleReject = (store: Store) => {
    console.log('店舗拒否:', store);
    // 実際のAPI呼び出しはここに追加
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'アクティブ';
      case 'pending': return '承認待ち';
      case 'rejected': return '拒否';
      default: return '不明';
    }
  };

  return (
    <>
      <Head>
        <title>店舗管理 - Melty+ 管理</title>
      </Head>

      <div className="flex min-h-screen bg-white">
        <AdminSidebar currentPage="stores" />

        <main className="flex-1 lg:ml-64">
          {/* ヘッダー */}
          <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30 h-14">
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-slate-900">店舗管理</h1>
                <p className="text-slate-600 text-xs mt-0.5">加盟店の承認・管理</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm">
                <Plus size={14} />
                新規店舗登録
              </button>
            </div>
          </header>

          <div className="p-3">
            {/* 検索・フィルター */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-2.5 mb-3">
              <div className="flex flex-col md:flex-row gap-2">
                {/* 検索 */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="店舗名、住所で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* エリアフィルター */}
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-slate-400" />
                  <select
                    value={areaFilter}
                    onChange={(e) => setAreaFilter(e.target.value)}
                    className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                  >
                    {areas.map(area => (
                      <option key={area} value={area}>
                        {area === 'all' ? '全エリア' : area}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ステータスフィルター */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                >
                  <option value="all">全ステータス</option>
                  <option value="active">アクティブ</option>
                  <option value="pending">承認待ち</option>
                  <option value="rejected">拒否</option>
                </select>
              </div>
            </div>

            {/* 店舗一覧テーブル */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        店舗情報
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        エリア
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ポイント還元率
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        月間取引数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStores.map((store) => (
                      <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{store.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin size={12} />
                              {store.address}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Phone size={12} />
                              {store.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 bg-slate-600 text-slate-200 rounded-full text-xs font-medium">
                            {store.area}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {store.status === 'active' ? (
                            <span className="text-slate-600 font-semibold text-sm">{store.pointRate}%</span>
                          ) : (
                            <span className="text-gray-400 text-sm">未設定</span>
                          )}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-gray-900 text-sm">
                          {store.status === 'active' ? `${store.monthlyTransactions}回` : '-'}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(store.status)}`}>
                            {getStatusLabel(store.status)}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleViewDetail(store)}
                              className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                              title="詳細表示"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(store)}
                              className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="編集"
                            >
                              <Edit size={16} />
                            </button>
                            {store.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(store)}
                                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="承認"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleReject(store)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="拒否"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
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

      {/* 店舗詳細モーダル */}
      {showDetailModal && selectedStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">店舗詳細</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* 基本情報 */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">基本情報</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">店舗名</p>
                    <p className="font-medium text-gray-900">{selectedStore.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">エリア</p>
                    <p className="font-medium text-gray-900">{selectedStore.area}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 mb-1">住所</p>
                    <p className="font-medium text-gray-900">{selectedStore.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">電話番号</p>
                    <p className="font-medium text-gray-900">{selectedStore.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">登録日</p>
                    <p className="font-medium text-gray-900">{selectedStore.registeredDate}</p>
                  </div>
                </div>
              </div>

              {/* 統計情報 */}
              {selectedStore.status === 'active' && (
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">統計情報</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-700 rounded-lg">
                      <p className="text-xs text-slate-300 mb-0.5">ポイント還元率</p>
                      <p className="text-xl font-bold text-white">{selectedStore.pointRate}%</p>
                    </div>
                    <div className="p-3 bg-slate-700 rounded-lg">
                      <p className="text-xs text-slate-300 mb-0.5">月間取引数</p>
                      <p className="text-xl font-bold text-white">{selectedStore.monthlyTransactions}回</p>
                    </div>
                    <div className="p-3 bg-slate-700 rounded-lg">
                      <p className="text-xs text-slate-300 mb-0.5">総売上</p>
                      <p className="text-lg font-bold text-white">¥{selectedStore.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ステータス */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ステータス</h3>
                <div className={`p-4 rounded-lg ${
                  selectedStore.status === 'active' ? 'bg-green-50' :
                  selectedStore.status === 'pending' ? 'bg-yellow-50' :
                  'bg-red-50'
                }`}>
                  <p className={`text-sm font-medium ${
                    selectedStore.status === 'active' ? 'text-green-700' :
                    selectedStore.status === 'pending' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {getStatusLabel(selectedStore.status)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 編集モーダル（簡易版） */}
      {showEditModal && selectedStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">店舗編集</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ポイント還元率（%）
                </label>
                <input
                  type="number"
                  defaultValue={selectedStore.pointRate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
