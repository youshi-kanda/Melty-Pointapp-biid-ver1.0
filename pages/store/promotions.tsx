import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { Megaphone, Plus, Edit, Trash2, ToggleLeft, ToggleRight, Calendar, Percent, Users, X } from 'lucide-react';

export default function StorePromotions() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const promotions = [
    { id: 1, name: '新春キャンペーン', type: 'ポイント2倍', period: '2024/01/01 - 2024/01/31', target: '全商品', participants: 245, active: true },
    { id: 2, name: 'ランチタイム特典', type: '10%還元', period: '2024/01/15 - 2024/02/15', target: 'ランチメニュー', participants: 432, active: true },
    { id: 3, name: '誕生月キャンペーン', type: '500pt付与', period: '常時開催', target: '会員限定', participants: 89, active: true },
    { id: 4, name: '年末セール', type: '15%還元', period: '2023/12/20 - 2023/12/31', target: '全商品', participants: 678, active: false },
  ];

  return (
    <>
      <Head>
        <title>プロモーション管理 - Melty+ 店舗管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar currentPage="promotions" />

        <main className="flex-1 lg:ml-64">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  プロモーション管理
                </h1>
                <p className="text-sm text-gray-600 mt-1">キャンペーンとプロモーションを管理します</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 shadow-lg"
              >
                <Plus size={18} />
                新規作成
              </button>
            </div>
          </header>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {promotions.map((promo) => (
                <div key={promo.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                        <Megaphone size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{promo.name}</h3>
                        <p className="text-sm text-purple-600 font-medium">{promo.type}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      {promo.active ? (
                        <ToggleRight size={32} className="text-green-500" />
                      ) : (
                        <ToggleLeft size={32} className="text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>{promo.period}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Percent size={16} />
                      <span>対象: {promo.target}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} />
                      <span>参加者: {promo.participants}人</span>
                    </div>
                  </div>

                  <div className={`px-3 py-2 rounded-lg text-center text-sm font-medium mb-4 ${
                    promo.active 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {promo.active ? '実施中' : '終了'}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                      <Edit size={16} />
                      編集
                    </button>
                    <button className="flex-1 py-2 px-3 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 text-sm">
                      <Trash2 size={16} />
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* 作成モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">新規プロモーション</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">キャンペーン名</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="例: 新春キャンペーン" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">開始日</label>
                  <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">終了日</label>
                  <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">特典内容</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option>ポイント2倍</option>
                  <option>ポイント3倍</option>
                  <option>10%還元</option>
                  <option>15%還元</option>
                  <option>固定ポイント付与</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">対象</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="例: 全商品、ランチメニュー" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">説明</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="キャンペーンの詳細説明"></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 px-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                キャンセル
              </button>
              <button className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 shadow-lg">
                作成
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
