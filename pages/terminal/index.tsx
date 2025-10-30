import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Wifi, QrCode, Edit3, Settings, Store, Clock } from 'lucide-react';

export default function TerminalSimple() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionTime, setSessionTime] = useState('0:25');

  const steps = [
    { number: 1, label: '会員認証' },
    { number: 2, label: '金額入力' },
    { number: 3, label: '決済処理' },
    { number: 4, label: '完了' }
  ];

  const handleAuthMethod = (method: string) => {
    console.log(`認証方法: ${method}`);
    // 静的エクスポートではwindow.location.hrefを使用
    if (method === 'nfc') {
      window.location.href = '/terminal/nfc/';
    } else if (method === 'qr') {
      window.location.href = '/terminal/qr-scan/';
    } else if (method === 'manual') {
      window.location.href = '/terminal/manual-input/';
    } else if (method === 'settings') {
      window.location.href = '/terminal/settings/';
    }
  };

  return (
    <>
      <Head>
        <title>決済端末 - Melty+ Terminal</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        {/* プログレスバー */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-2.5 sm:py-3.5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm sm:text-base font-bold border-2 transition-all ${
                      currentStep >= step.number
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {step.number}
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Store size={24} className="sm:w-7 sm:h-7" />
              <div>
                <h1 className="text-base sm:text-xl font-bold">Melty+ 決済端末</h1>
                <p className="text-xs sm:text-sm text-blue-100">会員認証</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="text-right">
                <div className="text-lg sm:text-2xl font-bold">¥0</div>
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
          <div className="max-w-3xl w-full">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-5 sm:p-6 border border-gray-200">
              {/* タイトル */}
              <div className="text-center mb-4 sm:mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5">顧客認証</h2>
                <p className="text-sm text-gray-600">認証方法を選択してください</p>
              </div>

              {/* 認証ボタン */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                {/* NFC読み取り */}
                <button
                  onClick={() => handleAuthMethod('nfc')}
                  className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg p-4 sm:p-5 transition-all shadow-md hover:shadow-lg active:scale-95 sm:hover:scale-105 min-h-[100px] sm:min-h-[110px]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Wifi size={32} className="sm:w-9 sm:h-9 text-white" />
                    <div>
                      <div className="text-base sm:text-lg font-bold mb-0.5">NFC読み取り</div>
                      <div className="text-xs text-blue-100">カードをタッチ</div>
                    </div>
                  </div>
                </button>

                {/* QRスキャン */}
                <button
                  onClick={() => handleAuthMethod('qr')}
                  className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg p-4 sm:p-5 transition-all shadow-md hover:shadow-lg active:scale-95 sm:hover:scale-105 min-h-[100px] sm:min-h-[110px]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <QrCode size={32} className="sm:w-9 sm:h-9 text-white" />
                    <div>
                      <div className="text-base sm:text-lg font-bold mb-0.5">QRスキャン</div>
                      <div className="text-xs text-blue-100">コードをスキャン</div>
                    </div>
                  </div>
                </button>

                {/* 手動入力 */}
                <button
                  onClick={() => handleAuthMethod('manual')}
                  className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg p-4 sm:p-5 transition-all shadow-md hover:shadow-lg active:scale-95 sm:hover:scale-105 min-h-[100px] sm:min-h-[110px]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Edit3 size={32} className="sm:w-9 sm:h-9 text-white" />
                    <div>
                      <div className="text-base sm:text-lg font-bold mb-0.5">手動入力</div>
                      <div className="text-xs text-blue-100">会員IDを入力</div>
                    </div>
                  </div>
                </button>

                {/* 設定 */}
                <button
                  onClick={() => handleAuthMethod('settings')}
                  className="group bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg p-4 sm:p-5 transition-all shadow-md hover:shadow-lg active:scale-95 sm:hover:scale-105 min-h-[100px] sm:min-h-[110px]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Settings size={32} className="sm:w-9 sm:h-9 text-white" />
                    <div>
                      <div className="text-base sm:text-lg font-bold mb-0.5">設定</div>
                      <div className="text-xs text-gray-100">端末設定・履歴</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* 説明文 */}
              <div className="text-center text-gray-500 text-xs sm:text-sm">
                顧客情報の読み取りを行います
              </div>
            </div>
          </div>
        </div>


      </div>
    </>
  );
}
