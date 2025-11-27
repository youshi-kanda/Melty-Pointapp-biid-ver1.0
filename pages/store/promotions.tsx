import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { 
  Megaphone, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Menu,
  Plus,
  Filter,
  Percent,
  TrendingUp,
  Calendar,
  Tag,
  Eye,
  PenLine,
  Trash2
} from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: 'sale' | 'event' | 'product' | 'service';
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'inactive';
  startDate: string;
  endDate: string;
  discount: string;
  views: number;
  clicks: number;
  notes?: string;
}

export default function Promotions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // プロモーションデータ
  const promotions: Promotion[] = [
    {
      id: '1',
      title: '春の大セール開催中！',
      description: '全商品30%OFF！さらに会員様限定で追加10%OFF！この機会をお見逃しなく。',
      type: 'sale',
      priority: 'high',
      status: 'active',
      startDate: '2025-07-10',
      endDate: '2025-07-31',
      discount: '30% OFF',
      views: 1250,
      clicks: 89,
      notes: '※ 他の割引との併用不可。一部商品除く。'
    },
    {
      id: '2',
      title: '新商品「プレミアムコーヒー」登場',
      description: '厳選された豆を使用した特別なコーヒーが新登場！今なら初回限定価格でお試しいただけます。',
      type: 'product',
      priority: 'medium',
      status: 'active',
      startDate: '2025-07-12',
      endDate: '2025-07-25',
      discount: '20% OFF',
      views: 680,
      clicks: 45,
      notes: '※ 数量限定。なくなり次第終了。'
    }
  ];

  const stats = {
    total: promotions.length,
    active: promotions.filter(p => p.status === 'active').length,
    totalViews: promotions.reduce((sum, p) => sum + p.views, 0)
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <Percent className="w-4 h-4" />;
      case 'product':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'text-red-600 bg-red-100';
      case 'product':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '-';
    }
  };

  return (
    <>
      <Head>
        <title>プロモーション - Melty+ 店舗管理</title>
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100"></div>
        
        {/* Dot pattern overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0e7ff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        <div className="relative z-10">
        <StoreSidebar currentPage="promotions" />

        <div className="md:pl-64 flex flex-col flex-1">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/95 backdrop-blur-md shadow-sm border-b border-white/20">
            <button className="px-4 border-r border-white/20 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 px-4 flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">プロモーション管理</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white/50 backdrop-blur-md placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                    placeholder="検索..."
                  />
                </div>
                <button className="bg-white/50 backdrop-blur-md p-2 rounded-xl text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:bg-white/70">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="relative">
                  <button className="max-w-xs bg-white/50 backdrop-blur-md flex items-center text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 px-3 py-2 transition-all duration-300 hover:bg-white/70">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="ml-2 text-gray-700 text-sm font-medium hidden md:block">店長</span>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="space-y-6">
                  {/* Header card */}
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                          <Megaphone className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">プロモーション管理</h1>
                          <p className="text-gray-600">セールやイベント情報の作成・管理</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="grid grid-cols-3 gap-6 text-center mr-6">
                          <div>
                            <p className="text-sm text-gray-600">総数</p>
                            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">公開中</p>
                            <p className="text-xl font-bold text-green-600">{stats.active}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">総表示回数</p>
                            <p className="text-xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
                          </div>
                        </div>
                        <button className="bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>新規作成</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Filter section */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">検索</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="タイトル、説明で検索"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">種別</label>
                        <select
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="all">すべて</option>
                          <option value="sale">セール・割引</option>
                          <option value="event">イベント</option>
                          <option value="product">新商品・おすすめ</option>
                          <option value="service">サービス</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="all">すべて</option>
                          <option value="active">公開中</option>
                          <option value="inactive">非公開</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                          <Filter className="w-4 h-4" />
                          <span>リセット</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Promotions list */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">プロモーション一覧</h3>
                      <p className="text-sm text-gray-500">{promotions.length}件のプロモーション</p>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {promotions.map((promo) => (
                        <div key={promo.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className={`p-2 rounded-lg ${getTypeColor(promo.type)}`}>
                                  {getTypeIcon(promo.type)}
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900">{promo.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(promo.priority)}`}>
                                  {getPriorityLabel(promo.priority)}
                                </span>
                                <button className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors bg-green-100 text-green-700 hover:bg-green-200">
                                  <Eye className="w-3 h-3" />
                                  <span>公開中</span>
                                </button>
                              </div>
                              <p className="text-gray-600 mb-3 text-sm leading-relaxed">{promo.description}</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-2">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{promo.startDate} 〜 {promo.endDate}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Tag className="w-4 h-4" />
                                  <span>{promo.discount}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{promo.views.toLocaleString()} 表示</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <TrendingUp className="w-4 h-4" />
                                  <span>{promo.clicks} クリック</span>
                                </div>
                              </div>
                              {promo.notes && (
                                <p className="text-xs text-gray-400 mt-2 italic">{promo.notes}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button 
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" 
                                title="編集"
                              >
                                <PenLine className="w-4 h-4" />
                              </button>
                              <button 
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                                title="削除"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        </div>
      </div>
    </>
  );
}
