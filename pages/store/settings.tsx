import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { 
  Settings, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Menu,
  Save,
  Store,
  Users,
  Smartphone,
  CreditCard,
  DollarSign,
  MapPin,
  Mail,
  Clock,
  Plus,
  Trash2,
  Shield,
  ArrowRight
} from 'lucide-react';

interface BusinessHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  permissions: string[];
}

export default function StoreSettings() {
  const [activeTab, setActiveTab] = useState('store');
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [storeName, setStoreName] = useState('Melty+ 店舗管理 サンプル店舗');
  const [phone, setPhone] = useState('03-1234-5678');
  const [description, setDescription] = useState('ポイントシステム対応店舗');
  const [address, setAddress] = useState('東京都渋谷区...');
  const [email, setEmail] = useState('store@example.com');
  const [website, setWebsite] = useState('https://store.example.com');
  const [pointRate, setPointRate] = useState(1);
  const [maxDailyPoints, setMaxDailyPoints] = useState(5000);

  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([
    { day: '月曜日', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: '火曜日', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: '水曜日', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: '木曜日', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: '金曜日', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: '土曜日', isOpen: true, openTime: '10:00', closeTime: '20:00' },
    { day: '日曜日', isOpen: true, openTime: '10:00', closeTime: '20:00' }
  ]);

  const [staffList] = useState<Staff[]>([
    {
      id: '1',
      name: '店長 太郎',
      role: '店長',
      email: 'manager@example.com',
      status: 'active',
      lastLogin: '2025-01-12 09:30',
      permissions: ['ダッシュボード', 'チャージ', 'ポイント管理', 'ユーザー管理', 'レポート']
    },
    {
      id: '2',
      name: 'スタッフ 花子',
      role: 'スタッフ',
      email: 'staff@example.com',
      status: 'active',
      lastLogin: '2025-01-11 18:45',
      permissions: ['ポイント管理', 'NFC操作']
    }
  ]);

  const updateBusinessHours = (index: number, field: keyof BusinessHours, value: any) => {
    const updatedHours = [...businessHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setBusinessHours(updatedHours);
  };

  return (
    <>
      <Head>
        <title>設定 - Melty+ 店舗管理</title>
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
        <StoreSidebar currentPage="settings" />

        <div className="md:pl-64 flex flex-col flex-1">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/95 backdrop-blur-md shadow-sm border-b border-white/20">
            <button className="px-4 border-r border-white/20 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 px-4 flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">店舗設定</h1>
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
                        <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                          <Settings className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">店舗設定</h1>
                          <p className="text-gray-600">店舗の基本情報とシステム設定を管理</p>
                        </div>
                      </div>
                      <button className="bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Save className="w-4 h-4" />
                        <span>設定を保存</span>
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <nav className="flex border-b border-gray-200">
                      <button
                        onClick={() => setActiveTab('store')}
                        className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                          activeTab === 'store'
                            ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Store className="w-4 h-4" />
                        <span>店舗情報</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('staff')}
                        className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                          activeTab === 'staff'
                            ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        <span>スタッフ管理</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('notification')}
                        className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                          activeTab === 'notification'
                            ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Bell className="w-4 h-4" />
                        <span>通知設定</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('terminal')}
                        className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                          activeTab === 'terminal'
                            ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>端末設定</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('payment')}
                        className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                          activeTab === 'payment'
                            ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>決済管理</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('refund')}
                        className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                          activeTab === 'refund'
                            ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>ポイント払戻管理</span>
                      </button>
                    </nav>
                  </div>

                  {/* Store info tab content */}
                  {activeTab === 'store' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Store className="w-4 h-4 text-gray-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">店舗基本情報</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              店舗名 *
                            </label>
                            <input
                              type="text"
                              value={storeName}
                              onChange={(e) => setStoreName(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="店舗名を入力"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              電話番号
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="03-1234-5678"
                            />
                          </div>
                          <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              店舗説明
                            </label>
                            <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              rows={3}
                              placeholder="店舗の説明を入力"
                            />
                          </div>
                          <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              住所
                            </label>
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="住所を入力"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              メールアドレス
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="store@example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ウェブサイト
                            </label>
                            <input
                              type="url"
                              value={website}
                              onChange={(e) => setWebsite(e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>

                        {/* Business Hours */}
                        <div className="mt-8">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Clock className="w-5 h-5 mr-2" />
                            営業時間
                          </h4>
                          <div className="space-y-3">
                            {businessHours.map((hours, index) => (
                              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-20">
                                  <span className="font-medium text-gray-700">{hours.day}</span>
                                </div>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={hours.isOpen}
                                    onChange={(e) => updateBusinessHours(index, 'isOpen', e.target.checked)}
                                    className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span className="text-sm text-gray-600">営業</span>
                                </label>
                                <input
                                  type="time"
                                  value={hours.openTime}
                                  onChange={(e) => updateBusinessHours(index, 'openTime', e.target.value)}
                                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <span className="text-gray-500">〜</span>
                                <input
                                  type="time"
                                  value={hours.closeTime}
                                  onChange={(e) => updateBusinessHours(index, 'closeTime', e.target.value)}
                                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Point Settings */}
                        <div className="mt-8">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <CreditCard className="w-5 h-5 mr-2" />
                            ポイント設定
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                ポイント付与レート（%）
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                value={pointRate}
                                onChange={(e) => setPointRate(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="1.0"
                              />
                              <p className="text-xs text-gray-500 mt-1">100円につき1ポイント付与</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                1日の最大付与ポイント
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={maxDailyPoints}
                                onChange={(e) => setMaxDailyPoints(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="5000"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Staff management tab content */}
                  {activeTab === 'staff' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Users className="w-4 h-4 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">スタッフ管理</h3>
                          </div>
                          <button className="bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>スタッフ追加</span>
                          </button>
                        </div>

                        <div className="space-y-4">
                          {staffList.map((staff) => (
                            <div key={staff.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <span className="text-indigo-700 font-semibold">
                                      {staff.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h4 className="font-semibold text-gray-900">{staff.name}</h4>
                                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        staff.role === '店長' 
                                          ? 'bg-blue-100 text-blue-700' 
                                          : 'bg-gray-100 text-gray-700'
                                      }`}>
                                        {staff.role}
                                      </span>
                                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        staff.status === 'active'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-red-100 text-red-700'
                                      }`}>
                                        {staff.status === 'active' ? 'アクティブ' : '無効'}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{staff.email}</p>
                                    <p className="text-xs text-gray-500 mb-2">
                                      最終ログイン: {staff.lastLogin}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      {staff.permissions.map((permission, index) => (
                                        <span
                                          key={index}
                                          className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                                        >
                                          {permission}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button className="px-3 py-1 rounded-md text-sm font-medium transition-colors bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                                    無効化
                                  </button>
                                  <button className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications tab content */}
                  {activeTab === 'notifications' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Bell className="w-4 h-4 text-gray-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">通知設定</h3>
                        </div>

                        <div className="space-y-6">
                          {/* General Notifications */}
                          <div>
                            <h4 className="text-base font-semibold text-gray-900 mb-4">一般通知</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <h5 className="font-medium text-gray-900">メール通知</h5>
                                  <p className="text-sm text-gray-600">重要な情報をメールで受信</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                </label>
                              </div>

                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <h5 className="font-medium text-gray-900">SMS通知</h5>
                                  <p className="text-sm text-gray-600">緊急時にSMSで通知</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Report Notifications */}
                          <div>
                            <h4 className="text-base font-semibold text-gray-900 mb-4">レポート通知</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <h5 className="font-medium text-gray-900">日次レポート</h5>
                                  <p className="text-sm text-gray-600">毎日の売上・取引レポート</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                </label>
                              </div>

                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <h5 className="font-medium text-gray-900">週次レポート</h5>
                                  <p className="text-sm text-gray-600">週間の総合レポート</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terminal settings tab content */}
                  {activeTab === 'terminal' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-4 h-4 text-gray-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">端末設定</h3>
                        </div>

                        <div className="space-y-6">
                          {/* Hardware Settings */}
                          <div>
                            <h4 className="text-base font-semibold text-gray-900 mb-4">ハードウェア設定</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <h5 className="font-medium text-gray-900">NFC機能</h5>
                                  <p className="text-sm text-gray-600">NFCカード・タグの読み取り機能</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                </label>
                              </div>

                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <h5 className="font-medium text-gray-900">QRコード機能</h5>
                                  <p className="text-sm text-gray-600">QRコードスキャン機能</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                </label>
                              </div>

                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <h5 className="font-medium text-gray-900">プリンター連携</h5>
                                  <p className="text-sm text-gray-600">レシート印刷機能</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* System Settings */}
                          <div>
                            <h4 className="text-base font-semibold text-gray-900 mb-4">システム設定</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <h5 className="font-medium text-gray-900">オフラインモード</h5>
                                  <p className="text-sm text-gray-600">ネットワーク断絶時の動作</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                </label>
                              </div>

                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <h5 className="font-medium text-gray-900">自動バックアップ</h5>
                                  <p className="text-sm text-gray-600">取引データの自動バックアップ</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" className="sr-only peer" defaultChecked />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                </label>
                              </div>

                              <div className="p-4 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-900 mb-2">セッションタイムアウト</h5>
                                <p className="text-sm text-gray-600 mb-3">無操作時の自動ログアウト時間(分)</p>
                                <div className="flex items-center">
                                  <input
                                    type="number"
                                    min="5"
                                    max="120"
                                    value={sessionTimeout}
                                    onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-600">分</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Security Info */}
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Shield className="w-5 h-5 text-blue-600" />
                              <div>
                                <h5 className="font-medium text-blue-800">セキュリティ情報</h5>
                                <p className="text-sm text-blue-600">
                                  端末設定の変更は全ての接続端末に即座に反映されます。
                                  セキュリティを考慮して適切な設定を行ってください。
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment tab content */}
                  {activeTab === 'payment' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-gray-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">決済管理</h3>
                        </div>

                        <div className="space-y-6">
                          {/* Payment Description */}
                          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <h4 className="font-medium text-purple-800 mb-2">決済設定</h4>
                            <p className="text-purple-700 text-sm">
                              店舗貸出用のタブレット端末で使用する決済方法の設定を管理します。
                            </p>
                          </div>

                          {/* Payment Methods */}
                          <div className="space-y-4">
                            {/* Cashless Payment */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h5 className="font-medium text-gray-900">キャッシュレス決済</h5>
                                <p className="text-sm text-gray-600">電子決済(PayPay、楽天Pay等)</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                              </label>
                            </div>

                            {/* Credit Card Payment */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h5 className="font-medium text-gray-900">クレジットカード決済</h5>
                                <p className="text-sm text-gray-600">各種クレジットカード対応</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                              </label>
                            </div>

                            {/* Cash Payment */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h5 className="font-medium text-gray-900">現金決済</h5>
                                <p className="text-sm text-gray-600">現金での支払い受付</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                              </label>
                            </div>

                            {/* Point Payment */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h5 className="font-medium text-gray-900">ポイント決済</h5>
                                <p className="text-sm text-gray-600">biidポイントでの支払い</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Refund tab content */}
                  {activeTab === 'refund' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-gray-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">ポイント払戻管理</h3>
                        </div>

                        <div className="space-y-6">
                          {/* Refund Description */}
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-medium text-green-800 mb-2">払戻機能について</h4>
                            <p className="text-green-700 text-sm">
                              貯まったポイントを現金で払戻申請できます。運営による確認後、指定の銀行口座に振込処理を行います。
                            </p>
                          </div>

                          {/* Refund Management Button */}
                          <div className="flex items-center justify-center p-8">
                            <button className="flex items-center space-x-3 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md">
                              <DollarSign className="w-5 h-5" />
                              <span className="font-medium">払戻管理画面へ</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Refund Information Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Refund Conditions */}
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <h5 className="font-medium text-blue-800 mb-2">払戻条件</h5>
                              <ul className="text-blue-700 text-sm space-y-1">
                                <li>• 最小申請額: 20,000円以上</li>
                                <li>• 還元率: 90%</li>
                                <li>• システム手数料: 3%</li>
                                <li>• 振込手数料: 220円</li>
                                <li>• 月末締め翌月末払い</li>
                              </ul>
                            </div>

                            {/* Important Notes */}
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <h5 className="font-medium text-yellow-800 mb-2">注意事項</h5>
                              <ul className="text-yellow-700 text-sm space-y-1">
                                <li>• 申請後のキャンセル不可</li>
                                <li>• 運営による確認が必要</li>
                                <li>• 振込は翌月末までに実行</li>
                                <li>• 銀行口座情報要事前登録</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Other tabs - placeholder content */}
                  {activeTab !== 'store' && activeTab !== 'staff' && activeTab !== 'notifications' && activeTab !== 'terminal' && activeTab !== 'payment' && activeTab !== 'refund' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="text-center py-12">
                        <p className="text-gray-500">このタブの設定内容は準備中です</p>
                      </div>
                    </div>
                  )}
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
