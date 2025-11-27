import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { Building, Star, Camera, Upload, Save, Filter, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface Feature {
  id: string;
  category: string;
  name: string;
  description: string;
  selected: boolean;
}

export default function StoreProfile() {
  const [category, setCategory] = useState('レストラン・飲食店');
  const [priceRangeType, setPriceRangeType] = useState('preset');
  const [priceRange, setPriceRange] = useState('moderate');
  const [description, setDescription] = useState('最高品質の商品とサービスを提供する、心温まる店舗です。お客様一人一人を大切にし、満足いただけるよう努めています。');
  const [specialties, setSpecialties] = useState(['こだわりコーヒー', '手作りスイーツ', '季節限定メニュー']);
  const [newSpecialty, setNewSpecialty] = useState('');

  const [features, setFeatures] = useState<Feature[]>([
    // 設備・施設
    { id: 'wifi', category: '設備・施設', name: 'WiFi完備', description: '無料WiFiが利用可能', selected: true },
    { id: 'parking', category: '設備・施設', name: '駐車場あり', description: '専用駐車場完備', selected: true },
    { id: 'charging', category: '設備・施設', name: '充電ポート', description: 'スマートフォンや電子機器の充電可能', selected: false },
    { id: 'smoking', category: '設備・施設', name: '喫煙可', description: '喫煙席・喫煙スペース完備', selected: false },
    // サービス
    { id: 'delivery', category: 'サービス', name: 'デリバリー対応', description: '配達サービス対応', selected: false },
    { id: 'takeout', category: 'サービス', name: 'テイクアウト', description: 'お持ち帰り対応', selected: false },
    // 決済・支払い
    { id: 'cashless', category: '決済・支払い', name: 'キャッシュレス決済', description: '電子決済対応', selected: true },
    { id: 'credit', category: '決済・支払い', name: 'クレジットカード', description: '各種クレジットカード対応', selected: false },
    // アクセシビリティ
    { id: 'wheelchair', category: 'アクセシビリティ', name: '車椅子対応', description: '車椅子でのアクセス可能', selected: true },
  ]);

  const handleFeatureToggle = (id: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, selected: !f.selected } : f));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '設備・施設': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
      case 'サービス': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
      case '決済・支払い': return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' };
      case 'アクセシビリティ': return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  const categories = Array.from(new Set(features.map(f => f.category)));

  return (
    <>
      <Head>
        <title>店舗プロフィール - Melty+ 店舗管理</title>
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100"></div>
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0e7ff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        <div className="relative z-10">
          <div className="flex min-h-screen">
            <StoreSidebar currentPage="profile" />

            <main className="flex-1 md:pl-64">
              {/* Header */}
              <header className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-30">
                <div className="px-4 py-3">
                  <h1 className="text-lg font-bold text-gray-900">店舗プロフィール</h1>
                </div>
              </header>

              <div className="p-4">
                <div className="max-w-7xl mx-auto space-y-4">
                  {/* Header Card */}
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">店舗プロフィール</h1>
                          <p className="text-gray-600">お客様に向けて店舗の魅力を効果的に伝える情報を管理</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <div className="flex">
                            {[1, 2, 3, 4].map((i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                            <Star className="w-4 h-4 text-gray-300" />
                          </div>
                          <span className="text-lg font-semibold text-gray-900">4.5</span>
                        </div>
                        <p className="text-sm text-gray-500">128件のレビュー</p>
                      </div>
                    </div>
                  </div>

                  <form className="space-y-4">
                    {/* 基本情報 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="mb-4">
                        <h3 className="text-base font-semibold text-gray-900">基本情報</h3>
                      </div>

                      {/* Info Box */}
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-white text-xs">!</span>
                          </div>
                          <div>
                            <h5 className="font-medium text-blue-800 text-sm">基本情報の管理について</h5>
                            <p className="text-blue-700 text-sm mt-1">
                              店舗名、住所、連絡先、営業時間などの基本情報は「店舗設定」で管理されています。 ここでは顧客向けのマーケティング情報を編集できます。
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* カテゴリー */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">カテゴリー *</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          >
                            <option value="レストラン・飲食店">レストラン・飲食店</option>
                            <option value="小売・ショッピング">小売・ショッピング</option>
                            <option value="サービス・美容">サービス・美容</option>
                            <option value="エンターテイメント">エンターテイメント</option>
                            <option value="医療・健康">医療・健康</option>
                            <option value="教育・学習">教育・学習</option>
                          </select>
                        </div>

                        {/* 価格帯 */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">価格帯</label>
                          <div className="space-y-3">
                            <div>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="priceRangeType"
                                  value="preset"
                                  checked={priceRangeType === 'preset'}
                                  onChange={(e) => setPriceRangeType(e.target.value)}
                                  className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">プリセットから選択</span>
                              </label>
                              <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                disabled={priceRangeType !== 'preset'}
                                className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              >
                                <option value="budget">リーズナブル (～1,000円)</option>
                                <option value="moderate">普通 (1,000～3,000円)</option>
                                <option value="expensive">高価格帯 (3,000円～)</option>
                              </select>
                            </div>
                            <div>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="priceRangeType"
                                  value="custom"
                                  checked={priceRangeType === 'custom'}
                                  onChange={(e) => setPriceRangeType(e.target.value)}
                                  className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">カスタム価格帯</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 店舗紹介 */}
                      <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">店舗紹介 *</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32 resize-none"
                          placeholder="お客様に伝えたい店舗の魅力や特徴、こだわりなどを記載してください"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-2">この内容はアプリの店舗詳細ページで顧客に表示されます</p>
                      </div>
                    </div>

                    {/* 店舗の特徴・設備 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">店舗の特徴・設備</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-700 px-3 py-1 border border-gray-300 rounded-md"
                          >
                            <Filter className="w-4 h-4" />
                            <span>フィルター</span>
                          </button>
                          <button
                            type="button"
                            className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700"
                          >
                            <Plus className="w-4 h-4" />
                            <span>項目追加</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6 text-sm">
                        該当する特徴・設備を選択してください。新しい項目はシステム管理画面で追加できます。
                      </p>

                      {categories.map((cat) => {
                        const categoryFeatures = features.filter(f => f.category === cat);
                        const selectedCount = categoryFeatures.filter(f => f.selected).length;
                        const colors = getCategoryColor(cat);

                        return (
                          <div key={cat} className="mb-8">
                            <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                              <span className={`px-3 py-1 rounded-md text-sm font-medium border mr-3 ${colors.bg} ${colors.text} ${colors.border}`}>
                                {cat}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({selectedCount}/{categoryFeatures.length} 選択中)
                              </span>
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {categoryFeatures.map((feature) => (
                                <label
                                  key={feature.id}
                                  className={`relative flex items-start p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${
                                    feature.selected
                                      ? `${colors.bg} ${colors.text} ${colors.border} border-current shadow-sm`
                                      : 'bg-white border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={feature.selected}
                                    onChange={() => handleFeatureToggle(feature.id)}
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${feature.selected ? 'bg-white/50' : 'bg-gray-100'}`}>
                                        <Building className="w-4 h-4 text-gray-600" />
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="font-semibold text-sm">{feature.name}</h5>
                                      </div>
                                      {feature.selected && (
                                        <svg className="w-5 h-5 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      )}
                                    </div>
                                    <p className={`text-xs leading-relaxed ${feature.selected ? 'text-current opacity-80' : 'text-gray-600'}`}>
                                      {feature.description}
                                    </p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {/* Info Box */}
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start space-x-3">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs">!</span>
                          </div>
                          <div>
                            <h5 className="font-medium text-blue-800 mb-1 text-sm">新しい特徴・設備項目の追加</h5>
                            <p className="text-blue-700 text-sm">
                              必要な項目がない場合は、サイドバーの「設定」→「特徴・設備管理」から新しい項目を追加できます。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* おすすめ・名物 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">おすすめ・名物</h3>

                      <div className="space-y-4">
                        {/* Input */}
                        <div className="flex space-x-3">
                          <input
                            type="text"
                            value={newSpecialty}
                            onChange={(e) => setNewSpecialty(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="例：こだわりコーヒー、手作りスイーツ、季節限定メニュー"
                          />
                          <button
                            type="button"
                            onClick={addSpecialty}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span>追加</span>
                          </button>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm"
                            >
                              <span>{specialty}</span>
                              <button
                                type="button"
                                onClick={() => removeSpecialty(index)}
                                className="text-gray-500 hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 店舗画像 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <ImageIcon className="w-5 h-5 mr-2" />
                        店舗画像
                      </h3>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">店舗の魅力的な写真をアップロード</p>
                        <button
                          type="button"
                          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
                        >
                          <Upload className="w-4 h-4" />
                          <span>画像を選択</span>
                        </button>
                        <p className="text-xs text-gray-500 mt-2">JPEG, PNG形式 / 最大5MB</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors duration-200"
                      >
                        プレビュー
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center space-x-2">
                          <Save className="w-4 h-4" />
                          <span>保存</span>
                        </div>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
