import { useState } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/Sidebar';
import { 
  Search, 
  Filter, 
  Plus,
  Edit,
  Eye,
  ToggleLeft,
  ToggleRight,
  Package
} from 'lucide-react';

interface Gift {
  id: number;
  name: string;
  category: string;
  points: number;
  stock: number;
  status: 'available' | 'unavailable';
  imageUrl: string;
}

export default function GiftsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [gifts] = useState<Gift[]>([
    {
      id: 1,
      name: 'スターバックスギフト券 ¥500',
      category: 'カフェ',
      points: 500,
      stock: 120,
      status: 'available',
      imageUrl: '/gifts/starbucks.jpg'
    },
    {
      id: 2,
      name: 'Amazonギフト券 ¥1000',
      category: 'オンライン',
      points: 1000,
      stock: 200,
      status: 'available',
      imageUrl: '/gifts/amazon.jpg'
    },
    {
      id: 3,
      name: 'ファミリーマート商品券 ¥500',
      category: 'コンビニ',
      points: 500,
      stock: 0,
      status: 'unavailable',
      imageUrl: '/gifts/familymart.jpg'
    }
  ]);

  const categories = ['all', ...Array.from(new Set(gifts.map(g => g.category)))];

  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = gift.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || gift.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Head>
        <title>ギフト管理 - BIID 管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar currentPage="gifts" />

        <main className="flex-1 lg:ml-64">
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ギフト管理</h1>
                <p className="text-gray-600 text-sm mt-1">交換可能ギフトの管理</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Plus size={20} />
                新規ギフト追加
              </button>
            </div>
          </header>

          <div className="p-6">
            {/* 検索・フィルター */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="ギフト名で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? '全カテゴリ' : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ギフト一覧グリッド */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGifts.map((gift) => (
                <div key={gift.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* ギフト画像 */}
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <Package size={64} className="text-purple-400" />
                  </div>

                  {/* ギフト情報 */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{gift.name}</h3>
                      {gift.status === 'available' ? (
                        <ToggleRight size={24} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <ToggleLeft size={24} className="text-gray-300 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {gift.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        gift.status === 'available'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {gift.status === 'available' ? '公開中' : '非公開'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">必要ポイント</p>
                        <p className="text-xl font-bold text-purple-600">{gift.points}P</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">在庫</p>
                        <p className={`text-xl font-bold ${gift.stock > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                          {gift.stock}個
                        </p>
                      </div>
                    </div>

                    {/* アクション */}
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        <Eye size={16} />
                        <span className="text-sm font-medium">詳細</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors">
                        <Edit size={16} />
                        <span className="text-sm font-medium">編集</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
