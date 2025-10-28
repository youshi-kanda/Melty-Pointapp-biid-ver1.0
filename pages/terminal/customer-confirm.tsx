import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { User, Coins, Award, Gift, ArrowRight, X, DollarSign, Plus } from 'lucide-react';

export default function CustomerConfirm() {
  const router = useRouter();
  const { userId } = router.query;
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // シミュレーション: 顧客情報を取得
    setTimeout(() => {
      setCustomer({
        id: userId || 'U001',
        name: '山田 太郎',
        points: 2100,
        rank: 'ゴールド',
        coupons: 3,
        memberSince: '2024年1月',
        lastVisit: '2025年10月20日'
      });
      setLoading(false);
    }, 800);
  }, [userId]);

  const handlePaymentOnly = () => {
    // 決済のみ（ポイント付与なし）
    router.push(`/terminal/amount-input?userId=${userId}&withPoints=false`);
  };

  const handlePaymentWithPoints = () => {
    // 決済+ポイント付与
    router.push(`/terminal/amount-input?userId=${userId}&withPoints=true`);
  };

  const handlePointsOnly = () => {
    router.push(`/terminal/points-input?userId=${userId}`);
  };

  const handleCancel = () => {
    router.push('/terminal-simple');
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>顧客情報確認 - Melty+ Terminal</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">顧客情報を読み込んでいます...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>顧客情報確認 - Melty+ Terminal</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold">顧客情報確認</h1>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              <X size={18} />
              <span className="text-sm">キャンセル</span>
            </button>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-4">
            
            {/* 顧客情報カード */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* ヘッダー */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                  <p className="text-sm text-gray-600">会員ID: {customer.id}</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                    <Award size={16} />
                    {customer.rank}
                  </div>
                </div>
              </div>

              {/* 情報グリッド */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* ポイント残高 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Coins size={20} />
                    <span className="text-sm font-medium">ポイント残高</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {customer.points.toLocaleString()}
                    <span className="text-lg text-gray-600 ml-1">pt</span>
                  </div>
                </div>

                {/* クーポン */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <Gift size={20} />
                    <span className="text-sm font-medium">利用可能クーポン</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {customer.coupons}
                    <span className="text-lg text-gray-600 ml-1">枚</span>
                  </div>
                </div>

                {/* 会員情報 */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="text-sm font-medium text-purple-600 mb-2">会員情報</div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600">
                      入会: {customer.memberSince}
                    </div>
                    <div className="text-xs text-gray-600">
                      最終来店: {customer.lastVisit}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">次の操作を選択してください</h3>
              
              <div className="space-y-3">
                {/* 決済のみ */}
                <button
                  onClick={handlePaymentOnly}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 text-white rounded-lg p-4 transition-all shadow-md hover:shadow-lg active:scale-98 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <DollarSign size={24} />
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold">決済のみ</div>
                        <div className="text-sm text-gray-100">ポイント付与なしで決済</div>
                      </div>
                    </div>
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* 決済+ポイント付与 */}
                <button
                  onClick={handlePaymentWithPoints}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg p-4 transition-all shadow-md hover:shadow-lg active:scale-98 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center relative">
                        <DollarSign size={20} className="absolute -left-1" />
                        <Plus size={12} className="absolute" />
                        <Coins size={20} className="absolute -right-1" />
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold">決済+ポイント付与</div>
                        <div className="text-sm text-blue-100">通常の決済（ポイント付与あり）</div>
                      </div>
                    </div>
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* ポイント付与のみ */}
                <button
                  onClick={handlePointsOnly}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg p-4 transition-all shadow-md hover:shadow-lg active:scale-98 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <Gift size={24} />
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold">ポイント付与のみ</div>
                        <div className="text-sm text-green-100">決済なしでポイントを付与</div>
                      </div>
                    </div>
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* キャンセル */}
                <button
                  onClick={handleCancel}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg p-3 transition-colors font-medium"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
