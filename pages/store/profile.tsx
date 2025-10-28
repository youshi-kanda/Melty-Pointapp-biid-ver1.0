import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { Store, Upload, MapPin, Clock, Phone, Mail, Percent, Save } from 'lucide-react';

export default function StoreProfile() {
  const [storeName, setStoreName] = useState('Melty+ 加盟店 大阪店');
  const [address, setAddress] = useState('大阪府大阪市中央区');
  const [phone, setPhone] = useState('06-1234-5678');
  const [email, setEmail] = useState('store@example.com');
  const [rewardRate, setRewardRate] = useState('10');

  return (
    <>
      <Head>
        <title>店舗プロフィール - Melty+ 店舗管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar currentPage="profile" />

        <main className="flex-1 lg:ml-64">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                店舗プロフィール
              </h1>
              <p className="text-sm text-gray-600 mt-1">店舗情報を管理します</p>
            </div>
          </header>

          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* 店舗画像 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">店舗画像</h2>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Store size={48} className="text-white" />
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 mb-2">
                      <Upload size={18} />
                      画像をアップロード
                    </button>
                    <p className="text-sm text-gray-600">推奨: 500x500px、最大2MB</p>
                  </div>
                </div>
              </div>

              {/* 基本情報 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">基本情報</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Store size={16} />
                      店舗名
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin size={16} />
                      住所
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Phone size={16} />
                        電話番号
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Mail size={16} />
                        メールアドレス
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 営業時間 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  営業時間
                </h2>
                <div className="space-y-3">
                  {['月', '火', '水', '木', '金', '土', '日'].map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <span className="w-8 font-medium text-gray-700">{day}</span>
                      <input type="time" defaultValue="10:00" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                      <span className="text-gray-600">〜</span>
                      <input type="time" defaultValue="20:00" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                      <label className="flex items-center gap-2 ml-4">
                        <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" />
                        <span className="text-sm text-gray-600">定休日</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* ポイント還元率 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Percent size={20} />
                  ポイント還元率
                </h2>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={rewardRate}
                    onChange={(e) => setRewardRate(e.target.value)}
                    min="0"
                    max="100"
                    className="w-32 px-4 py-3 text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center"
                  />
                  <span className="text-2xl font-bold text-gray-600">%</span>
                  <div className="ml-4 flex-1">
                    <p className="text-sm text-gray-600">例: 1,000円の購入で {parseInt(rewardRate) * 10}ポイント付与</p>
                    <p className="text-xs text-gray-500 mt-1">※ 1% = 10ポイント / 1,000円</p>
                  </div>
                </div>
              </div>

              {/* 保存ボタン */}
              <div className="flex justify-end">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 shadow-lg">
                  <Save size={18} />
                  変更を保存
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
