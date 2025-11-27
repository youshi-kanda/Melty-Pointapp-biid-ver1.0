import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import {
  Wallet,
  CreditCard,
  CheckCircle,
  Settings,
  TrendingUp,
  AlertTriangle,
  Shield,
  Search,
  Bell,
  User,
  ChevronDown,
  Menu
} from 'lucide-react';

export default function StoreCharge() {
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  // クイック選択金額
  const quickAmounts = [5000, 10000, 25000, 50000, 100000, 200000];

  // 手数料計算（3.6%）
  const calculateFee = (amount: number) => {
    return Math.ceil(amount * 0.036);
  };

  // 総額計算
  const calculateTotal = (amount: number) => {
    return amount + calculateFee(amount);
  };

  // 金額選択ハンドラー
  const handleQuickSelect = (value: number) => {
    setSelectedAmount(value);
    setAmount(value.toString());
  };

  // チャージボタンの有効/無効判定
  const isChargeDisabled = !amount || parseInt(amount) < 1000 || parseInt(amount) > 500000;

  const currentAmount = amount ? parseInt(amount) : 0;
  const fee = currentAmount > 0 ? calculateFee(currentAmount) : 0;
  const total = currentAmount > 0 ? calculateTotal(currentAmount) : 0;

  return (
    <>
      <Head>
        <title>チャージ管理 - Melty+ 店舗管理</title>
      </Head>

      {/* 背景 */}
      <div className="min-h-screen relative overflow-hidden">
        {/* グラデーション背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100"></div>

        {/* ドットパターンオーバーレイ */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0e7ff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative z-10">
          <StoreSidebar currentPage="charge" />

          {/* メインコンテンツエリア */}
          <div className="md:pl-64 flex flex-col flex-1">
            {/* トップバー */}
            <div className="sticky top-0 z-10 flex-shrink-0 flex h-14 bg-white/95 backdrop-blur-md shadow-sm border-b border-white/20">
              <button className="px-3 border-r border-white/20 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex-1 px-3 flex justify-between items-center">
                <div className="flex items-center">
                  <h1 className="text-lg font-semibold text-gray-900">チャージ管理</h1>
                </div>
                <div className="flex items-center space-x-4">
                  {/* 検索バー */}
                  <div className="relative hidden md:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white/50 backdrop-blur-md placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                      placeholder="検索..."
                      type="search"
                    />
                  </div>
                  {/* 通知 */}
                  <button className="bg-white/50 backdrop-blur-md p-2 rounded-xl text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:bg-white/70">
                    <Bell className="h-5 w-5" />
                  </button>
                  {/* ユーザーメニュー */}
                  <div className="relative">
                    <button className="max-w-xs bg-white/50 backdrop-blur-md flex items-center text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 px-3 py-2 transition-all duration-300 hover:bg-white/70">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <span className="ml-2 text-gray-700 text-sm font-medium hidden md:block">
                        店長
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* メインコンテンツ */}
            <main className="flex-1">
              <div className="py-4">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
                  <div className="max-w-4xl mx-auto space-y-4">
                    {/* ヘッダーカード */}
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-50">
                            <Wallet className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h1 className="text-lg font-bold text-gray-900">デポジット管理</h1>
                            <p className="text-sm text-gray-600">従量課金システム用のデポジット残高管理</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">サービス正常</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* メインコンテンツグリッド */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* 左カラム - チャージフォーム */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* クイック選択 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">クイック選択</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {quickAmounts.map((value) => (
                              <button
                                key={value}
                                onClick={() => handleQuickSelect(value)}
                                className={`p-4 rounded-lg border transition-all duration-200 ${
                                  selectedAmount === value
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                                }`}
                              >
                                <span className="font-semibold text-lg">¥{value.toLocaleString()}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* チャージフォーム */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-6">デポジットチャージフォーム</h3>
                          <form className="space-y-6">
                            {/* チャージ金額 */}
                            <div>
                              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                チャージ金額 *
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                                  ¥
                                </span>
                                <input
                                  type="number"
                                  id="amount"
                                  name="amount"
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 pl-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  placeholder="例: 50000"
                                  min="1000"
                                  max="500000"
                                  required
                                  value={amount}
                                  onChange={(e) => {
                                    setAmount(e.target.value);
                                    setSelectedAmount(null);
                                  }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                最小: 1,000円 / 最大: 500,000円 (従量課金用デポジット)
                              </p>
                            </div>

                            {/* 決済方法 */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-4">決済方法 *</label>
                              <div className="space-y-3">
                                <label
                                  className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                                    paymentMethod === 'credit_card'
                                      ? 'border-indigo-500 bg-indigo-50'
                                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="paymentMethod"
                                    className="sr-only"
                                    value="credit_card"
                                    checked={paymentMethod === 'credit_card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                  />
                                  <div className="flex items-center space-x-4 flex-1">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100">
                                      <CreditCard className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">クレジットカード</p>
                                      <p className="text-sm text-gray-600">Visa, MasterCard, JCB対応</p>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-sm font-medium text-gray-600">手数料: 3.6%</span>
                                    </div>
                                  </div>
                                </label>
                              </div>
                            </div>

                            {/* チャージボタン */}
                            <button
                              type="button"
                              disabled={isChargeDisabled}
                              className="w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                              ¥{currentAmount.toLocaleString()}をデポジットにチャージ (手数料込み: ¥
                              {total.toLocaleString()})
                            </button>
                          </form>
                        </div>
                      </div>

                      {/* 右カラム - 残高・情報 */}
                      <div className="space-y-6">
                        {/* デポジット残高 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">デポジット残高</h3>
                            <Settings className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="text-center py-6">
                            <div className="text-3xl font-bold mb-2 text-gray-900">¥42,500</div>
                            <div className="text-sm text-gray-500">従量課金用残高</div>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">今月の使用:</span>
                              <span className="font-medium text-red-600">¥7,500</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">初回デポジット:</span>
                              <span className="font-medium text-blue-600">¥50,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">利用可能日数(概算):</span>
                              <span className="font-medium text-gray-900">170日</span>
                            </div>
                          </div>
                        </div>

                        {/* 従量課金システム情報 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">従量課金システム</h3>
                          </div>
                          <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>ユーザーへのポイント付与時に自動課金</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>クレジット決済エラー時はデポジットから支払い</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span>デポジット残高0円でサービス停止</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>初回登録時に¥50,000デポジット</span>
                            </div>
                          </div>
                        </div>

                        {/* セキュリティ情報 */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Shield className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">安全なお取引</h4>
                              <p className="text-sm text-gray-600">
                                すべての決済情報は暗号化され、GMO決済システムで安全に処理されます。
                              </p>
                            </div>
                          </div>
                        </div>
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
