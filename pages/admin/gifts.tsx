import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminSidebar from '../../components/admin/Sidebar';
import { 
  Search, 
  Download,
  Upload,
  Plus,
  Gift,
  Tag,
  BarChart3,
  Crown,
  CheckCircle,
  ShoppingCart,
  Target,
  Smartphone,
  Star,
  Eye,
  Pen,
  MoreVertical,
  Menu,
  Bell,
  User,
  LogOut,
  Package
} from 'lucide-react';

interface Gift {
  id: string;
  name: string;
  provider: string;
  category: string;
  type: 'digital' | 'coupon' | 'voucher' | 'physical';
  pointsRequired: number;
  price: number;
  discount?: number;
  stock: number;
  exchangeCount: number;
  status: 'active' | 'inactive' | 'sold_out' | 'discontinued';
  rating: number;
  reviewCount: number;
  imageUrl: string;
  tags: string[];
  createdAt: string;
}

export default function GiftsManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'exchangeCount' | 'name' | 'pointsRequired' | 'createdAt'>('exchangeCount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<'gifts' | 'categories' | 'analytics'>('gifts');

  // Statistics data
  const statistics = {
    totalGifts: 45,
    active: 38,
    totalExchanges: 2456,
    totalPoints: 3456789
  };

  // Demo gifts data
  const [gifts] = useState<Gift[]>([
    {
      id: 'G001',
      name: 'Amazonギフト券 1,000円',
      provider: 'Amazon Japan',
      category: 'デジタルギフト',
      type: 'digital',
      pointsRequired: 1000,
      price: 1000,
      stock: 500,
      exchangeCount: 234,
      status: 'active',
      rating: 4.8,
      reviewCount: 89,
      imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c7d7496df?w=200',
      tags: ['人気'],
      createdAt: '2024/1/1'
    },
    {
      id: 'G002',
      name: 'スターバックス ドリンクチケット',
      provider: 'スターバックス コーヒー ジャパン',
      category: 'フード・ドリンク',
      type: 'coupon',
      pointsRequired: 500,
      price: 650,
      discount: 23,
      stock: 200,
      exchangeCount: 189,
      status: 'active',
      rating: 4.7,
      reviewCount: 56,
      imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200',
      tags: ['人気'],
      createdAt: '2024/1/1'
    },
    {
      id: 'G003',
      name: 'iTunes ギフトカード 1,500円',
      provider: 'Apple Inc.',
      category: 'デジタルギフト',
      type: 'digital',
      pointsRequired: 1500,
      price: 1500,
      stock: 300,
      exchangeCount: 156,
      status: 'active',
      rating: 4.5,
      reviewCount: 34,
      imageUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=200',
      tags: [],
      createdAt: '2024/1/1'
    },
    {
      id: 'G004',
      name: 'QUOカード 1,000円',
      provider: 'QUOカード',
      category: 'プリペイドカード',
      type: 'physical',
      pointsRequired: 1000,
      price: 1000,
      stock: 50,
      exchangeCount: 123,
      status: 'active',
      rating: 4.3,
      reviewCount: 28,
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200',
      tags: [],
      createdAt: '2024/1/1'
    },
    {
      id: 'G005',
      name: 'マクドナルド バリューセット券',
      provider: '日本マクドナルド',
      category: 'フード・ドリンク',
      type: 'coupon',
      pointsRequired: 600,
      price: 800,
      discount: 25,
      stock: 0,
      exchangeCount: 98,
      status: 'sold_out',
      rating: 4.1,
      reviewCount: 19,
      imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200',
      tags: [],
      createdAt: '2024/1/1'
    }
  ]);

  const getStatusBadge = (status: Gift['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <span className="ml-1">アクティブ</span>
          </span>
        );
      case 'sold_out':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
            <span className="ml-1">売り切れ</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: Gift['type']) => {
    switch (type) {
      case 'digital':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
            <Smartphone className="h-4 w-4" />
            <span className="ml-1">デジタル</span>
          </span>
        );
      case 'coupon':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
            <Tag className="h-4 w-4" />
            <span className="ml-1">クーポン</span>
          </span>
        );
      case 'physical':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Package className="h-4 w-4" />
            <span className="ml-1">現物</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>ギフト管理 - biid Store 店舗管理システム</title>
      </Head>

      <div className="min-h-screen bg-white">
        <AdminSidebar currentPage="gifts" />

        <div className="md:pl-64 flex flex-col flex-1">
          {/* Top Bar */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-14 bg-white shadow-sm border-b border-slate-200">
            <button className="px-4 border-r border-slate-200 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500 md:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1 px-4 flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-lg font-semibold text-slate-900">ギフト管理</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-white p-1.5 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                  <Bell className="h-4 w-4" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-900">運営</p>
                    <p className="text-xs text-slate-500">admin@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="py-3">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-lg font-bold text-slate-900">ギフト管理</h1>
                      <p className="text-slate-600 text-sm">商品管理・在庫管理</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">
                        <Download className="h-4 w-4" />
                        <span>エクスポート</span>
                      </button>
                      <button className="flex items-center space-x-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">
                        <Upload className="h-4 w-4" />
                        <span>一括インポート</span>
                      </button>
                      <button className="flex items-center space-x-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">
                        <Plus className="h-4 w-4" />
                        <span>新規ギフト</span>
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="border-b border-gray-200">
                      <nav className="flex space-x-8 px-6">
                        <button
                          onClick={() => setActiveTab('gifts')}
                          className={`flex items-center space-x-2 py-3 px-2 border-b-2 font-medium text-sm ${
                            activeTab === 'gifts'
                              ? 'border-slate-600 text-slate-300'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <Gift className="h-4 w-4" />
                          <span>ギフト一覧</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('categories')}
                          className={`flex items-center space-x-2 py-3 px-2 border-b-2 font-medium text-sm ${
                            activeTab === 'categories'
                              ? 'border-slate-600 text-slate-300'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <Tag className="h-4 w-4" />
                          <span>カテゴリ管理</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('analytics')}
                          className={`flex items-center space-x-2 py-3 px-2 border-b-2 font-medium text-sm ${
                            activeTab === 'analytics'
                              ? 'border-slate-600 text-slate-300'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <BarChart3 className="h-4 w-4" />
                          <span>分析</span>
                        </button>
                      </nav>
                    </div>
                  </div>

                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-slate-700 rounded-lg">
                          <Gift className="h-5 w-5 text-slate-300" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-600">総ギフト数</p>
                          <p className="text-lg font-bold text-gray-900">{statistics.totalGifts}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-slate-700 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-slate-300" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-600">アクティブ</p>
                          <p className="text-lg font-bold text-gray-900">{statistics.active}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-slate-700 rounded-lg">
                          <ShoppingCart className="h-5 w-5 text-slate-300" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-600">総交換数</p>
                          <p className="text-lg font-bold text-gray-900">{statistics.totalExchanges.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-slate-700 rounded-lg">
                          <Target className="h-5 w-5 text-slate-300" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-600">使用ポイント</p>
                          <p className="text-lg font-bold text-gray-900">{statistics.totalPoints.toLocaleString()}pt</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="ギフト名、提供者名、タグで検索..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent w-full sm:w-80"
                            />
                          </div>
                          <div className="flex items-center space-x-3">
                            <select
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                              className="border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                            >
                              <option value="all">全ステータス</option>
                              <option value="active">アクティブ</option>
                              <option value="inactive">非アクティブ</option>
                              <option value="sold_out">売り切れ</option>
                              <option value="discontinued">販売終了</option>
                            </select>
                            <select
                              value={categoryFilter}
                              onChange={(e) => setCategoryFilter(e.target.value)}
                              className="border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                            >
                              <option value="all">全カテゴリ</option>
                              <option value="1">デジタルギフト</option>
                              <option value="2">フード・ドリンク</option>
                              <option value="3">プリペイドカード</option>
                              <option value="4">エンターテイメント</option>
                              <option value="5">ファッション・美容</option>
                            </select>
                            <select
                              value={typeFilter}
                              onChange={(e) => setTypeFilter(e.target.value)}
                              className="border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                            >
                              <option value="all">全タイプ</option>
                              <option value="digital">デジタル</option>
                              <option value="coupon">クーポン</option>
                              <option value="voucher">バウチャー</option>
                              <option value="physical">現物</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">並び順:</span>
                            <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value as any)}
                              className="border border-gray-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                            >
                              <option value="exchangeCount">交換数</option>
                              <option value="name">名前</option>
                              <option value="pointsRequired">ポイント</option>
                              <option value="createdAt">作成日</option>
                            </select>
                            <button
                              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                              className="px-2.5 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              {sortOrder === 'desc' ? '↓' : '↑'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gifts Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2.5 text-left">
                                <input type="checkbox" className="rounded" />
                              </th>
                              <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ギフト情報
                              </th>
                              <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                カテゴリ・タイプ
                              </th>
                              <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ポイント・価格
                              </th>
                              <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                在庫・交換数
                              </th>
                              <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ステータス
                              </th>
                              <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                評価
                              </th>
                              <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                作成日
                              </th>
                              <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                アクション
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {gifts.map((gift) => (
                              <tr key={gift.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <input type="checkbox" className="rounded" />
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-12 w-12">
                                      <img
                                        src={gift.imageUrl}
                                        alt={gift.name}
                                        className="h-12 w-12 rounded-lg object-cover"
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{gift.name}</div>
                                      <div className="text-sm text-gray-500">{gift.provider}</div>
                                      {gift.tags.includes('人気') && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                          <Star className="h-3 w-3 mr-1" />
                                          人気
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{gift.category}</div>
                                  {getTypeBadge(gift.type)}
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{gift.pointsRequired}pt</div>
                                  <div className="text-sm text-gray-500">
                                    ¥{gift.price.toLocaleString()}
                                    {gift.discount && (
                                      <span className="ml-1 text-green-600">(-{gift.discount}%)</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{gift.stock}個</div>
                                  <div className="text-sm text-gray-500">{gift.exchangeCount}回交換</div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  {getStatusBadge(gift.status)}
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="ml-1 text-sm text-gray-900">{gift.rating}</span>
                                    <span className="ml-1 text-sm text-gray-500">({gift.reviewCount})</span>
                                  </div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{gift.createdAt}</div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex items-center space-x-2">
                                    <button className="text-slate-300 hover:text-slate-800">
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    <button className="text-slate-300 hover:text-slate-800">
                                      <Pen className="h-4 w-4" />
                                    </button>
                                    <div className="relative">
                                      <button className="text-gray-600 hover:text-gray-900">
                                        <MoreVertical className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        5件中 1 - 5件を表示
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          disabled
                          className="px-2.5 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          前へ
                        </button>
                        <span className="px-2.5 py-1.5 text-sm text-gray-700">1 / 1</span>
                        <button
                          disabled
                          className="px-2.5 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          次へ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
