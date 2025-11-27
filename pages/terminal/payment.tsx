import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TerminalHead from '@/components/terminal/TerminalHead';
import { Store, Clock, CheckCircle, CreditCard, User, Coins, ArrowLeft } from 'lucide-react';

export default function TerminalPayment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(2);
  const [sessionTime, setSessionTime] = useState('1:45');
  const [amount, setAmount] = useState('');
  const [customerInfo] = useState({
    name: '田中太郎',
    memberId: 'USER-001',
    points: 2450
  });
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const steps = [
    { number: 1, label: '会員認証' },
    { number: 2, label: '金額入力' },
    { number: 3, label: '決済処理' },
    { number: 4, label: '完了' }
  ];

  const quickAmounts = [500, 1000, 2000, 3000, 5000, 10000];

  const calculatePoints = () => {
    return Math.floor(parseFloat(amount || '0') * 0.1);
  };

  const handlePayment = () => {
    setProcessing(true);
    setCurrentStep(3);
    
    setTimeout(() => {
      setCompleted(true);
      setCurrentStep(4);
      setProcessing(false);
    }, 2500);
  };

  const handleNewTransaction = () => {
    router.push('/terminal');
  };

  return (
    <>
      <TerminalHead title="決済処理 - Melty+ Terminal" />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* プログレスバー */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold border-2 transition-all ${
                      currentStep >= step.number
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {currentStep > step.number ? <CheckCircle size={16} className="sm:w-5 sm:h-5" /> : step.number}
                    </div>
                    <span className={`text-xs sm:text-sm mt-1 sm:mt-2 font-medium hidden sm:block ${
                      currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 sm:mx-2 transition-all ${
                      currentStep > step.number ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 上部バナー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 sm:py-4 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Store size={24} className="sm:w-7 sm:h-7" />
              <div>
                <h1 className="text-base sm:text-xl font-bold">Melty+ Terminal</h1>
                <p className="text-xs sm:text-sm text-blue-100">
                  {completed ? '決済完了' : processing ? '決済処理中' : '金額入力'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="text-right">
                <div className="text-xl sm:text-3xl font-bold">¥{amount || '0'}</div>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">ON</span>
                <Clock size={16} />
                <span className="text-sm font-mono">{sessionTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
          {!completed ? (
            <div className="max-w-6xl w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* 左側: 顧客情報 */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <User size={18} className="sm:w-5 sm:h-5 text-blue-600" />
                    顧客情報
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg sm:text-2xl font-bold">
                        {customerInfo.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-bold text-gray-900">{customerInfo.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{customerInfo.memberId}</p>
                      </div>
                    </div>
                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm text-gray-600">保有ポイント</span>
                        <div className="flex items-center gap-1">
                          <Coins size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                          <span className="text-base sm:text-lg font-bold text-blue-600">{customerInfo.points}</span>
                        </div>
                      </div>
                      {amount && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-gray-600">獲得予定</span>
                          <span className="text-base sm:text-lg font-bold text-green-600">+{calculatePoints()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 右側: 金額入力 */}
                <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-200">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="sm:w-6 sm:h-6 text-blue-600" />
                    決済金額
                  </h3>

                  {/* 金額表示 */}
                  <div className="mb-4 sm:mb-6">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 text-center py-6 sm:py-8 bg-gray-50 rounded-xl border-2 border-gray-300">
                      ¥{amount || '0'}
                    </div>
                  </div>

                  {/* クイック金額 */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        onClick={() => setAmount(quickAmount.toString())}
                        disabled={processing}
                        className="py-3 sm:py-4 text-sm sm:text-base bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border-2 border-blue-200 hover:border-blue-400 rounded-lg sm:rounded-xl font-bold text-blue-600 transition-all disabled:opacity-50 min-h-[44px]"
                      >
                        ¥{quickAmount.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  {/* カスタム金額入力 */}
                  <div className="mb-4 sm:mb-6">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="金額を入力"
                      disabled={processing}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center disabled:opacity-50"
                    />
                  </div>

                  {/* アクションボタン */}
                  <div className="flex gap-3 sm:gap-4">
                    <button
                      onClick={() => router.back()}
                      disabled={processing}
                      className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center gap-2 min-h-[48px]"
                    >
                      <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">戻る</span>
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={!amount || parseFloat(amount) <= 0 || processing}
                      className="flex-1 py-3 sm:py-4 text-base sm:text-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 min-h-[48px]"
                    >
                      {processing ? '処理中...' : '決済実行'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 完了画面 */
            <div className="max-w-2xl w-full">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 border border-gray-200 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <CheckCircle size={40} className="sm:w-12 sm:h-12 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">決済完了</h2>
                <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8">ありがとうございました</p>

                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 text-left">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">決済金額</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">¥{amount}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">獲得ポイント</p>
                      <p className="text-2xl sm:text-3xl font-bold text-green-600">+{calculatePoints()} pt</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNewTransaction}
                  className="w-full py-3.5 sm:py-4 text-base sm:text-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl active:scale-95 min-h-[48px]"
                >
                  新しい取引を開始
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
