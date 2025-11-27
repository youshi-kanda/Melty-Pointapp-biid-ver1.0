import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // ローカルストレージから解除状態を確認
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedDate = dismissed ? new Date(dismissed) : null;
    const now = new Date();
    
    // 7日間は再表示しない
    if (dismissedDate && (now.getTime() - dismissedDate.getTime()) < 7 * 24 * 60 * 60 * 1000) {
      return;
    }

    // すでにPWAとしてインストール済みの場合は表示しない
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // beforeinstallpromptイベントをキャプチャ
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // ページ訪問から3秒後に表示
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // インストールプロンプトを表示
    deferredPrompt.prompt();

    // ユーザーの選択を待つ
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installation accepted');
    } else {
      console.log('PWA installation dismissed');
    }

    // プロンプトをクリア
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    // 解除日時を保存（7日間は再表示しない）
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    setShowPrompt(false);
  };

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <>
      {/* オーバーレイ */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
        onClick={handleDismiss}
      />

      {/* プロンプト本体 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="bg-white rounded-t-3xl shadow-2xl max-w-lg mx-auto">
          {/* ヘッダー */}
          <div className="relative p-6 pb-4 border-b border-gray-100">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              {/* アイコン */}
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>

              {/* テキスト */}
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Melty+をホーム画面に追加
                </h3>
                <p className="text-sm text-gray-600">
                  アプリのように素早くアクセスできます
                </p>
              </div>
            </div>
          </div>

          {/* 機能リスト */}
          <div className="px-6 py-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-pink-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-pink-500">⚡</span>
              </div>
              <span className="text-gray-700">起動が速い</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-pink-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-pink-500">📱</span>
              </div>
              <span className="text-gray-700">フルスクリーン表示</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-pink-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-pink-500">💾</span>
              </div>
              <span className="text-gray-700">オフラインでも一部機能が利用可能</span>
            </div>
          </div>

          {/* ボタン */}
          <div className="p-6 pt-2 space-y-3">
            <button
              onClick={handleInstall}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              インストール
            </button>
            <button
              onClick={handleDismiss}
              className="w-full text-gray-600 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors"
            >
              後で
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}
