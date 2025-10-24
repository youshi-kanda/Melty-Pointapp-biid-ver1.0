import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { QrCode, X, AlertCircle, CheckCircle, Camera } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRScan() {
  const router = useRouter();
  const [status, setStatus] = useState<'waiting' | 'scanning' | 'success' | 'error'>('waiting');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerInitialized = useRef(false);

  useEffect(() => {
    // タイムアウトカウントダウン
    if ((status === 'waiting' || status === 'scanning') && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && status !== 'success') {
      setStatus('error');
      setErrorMessage('タイムアウトしました');
      stopScanner();
    }
  }, [countdown, status]);

  // QRスキャナーの初期化
  useEffect(() => {
    if (scannerInitialized.current) return;
    
    const initScanner = async () => {
      try {
        // カメラ権限をリクエスト
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // 権限確認後すぐに停止
        
        setCameraPermission('granted');
        scannerInitialized.current = true;

        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        // スキャン開始
        await scanner.start(
          { facingMode: 'environment' }, // リアカメラを使用
          {
            fps: 10, // フレームレート
            qrbox: { width: 250, height: 250 }, // スキャンボックスのサイズ
          },
          (decodedText) => {
            // QRコード読み取り成功
            setStatus('success');
            stopScanner();
            
            // 読み取ったデータから顧客IDを抽出
            const userId = extractUserIdFromQR(decodedText);
            
            setTimeout(() => {
              router.push(`/terminal/customer-confirm?userId=${userId}`);
            }, 1500);
          },
          (errorMessage) => {
            // スキャンエラー（継続的に発生するため、特に処理しない）
          }
        );

        setStatus('scanning');
      } catch (err: any) {
        console.error('カメラ初期化エラー:', err);
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraPermission('denied');
          setErrorMessage('カメラの使用が許可されていません。ブラウザの設定でカメラへのアクセスを許可してください。');
        } else if (err.name === 'NotFoundError') {
          setErrorMessage('カメラが見つかりません。デバイスにカメラが接続されているか確認してください。');
        } else {
          setErrorMessage('カメラの初期化に失敗しました。手動入力をご利用ください。');
        }
        
        setStatus('error');
      }
    };

    initScanner();

    return () => {
      stopScanner();
    };
  }, [router]);

  // QRコードから顧客IDを抽出
  const extractUserIdFromQR = (qrData: string): string => {
    try {
      // QRコードのデータ形式に応じて処理
      // 例: "USER:U001" または JSON形式 {"userId": "U001"}
      if (qrData.startsWith('USER:')) {
        return qrData.replace('USER:', '');
      } else if (qrData.startsWith('{')) {
        const data = JSON.parse(qrData);
        return data.userId || data.id || qrData;
      } else {
        // そのまま顧客IDとして使用
        return qrData;
      }
    } catch {
      return qrData;
    }
  };

  // スキャナーを停止
  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(err => console.error('スキャナー停止エラー:', err));
      scannerRef.current = null;
    }
  };

  const handleCancel = () => {
    stopScanner();
    router.push('/terminal-simple');
  };

  const handleManualInput = () => {
    stopScanner();
    router.push('/terminal/manual-input');
  };

  const handleRetry = () => {
    setStatus('waiting');
    setCountdown(30);
    setErrorMessage('');
    window.location.reload(); // ページをリロードしてスキャナーを再初期化
  };

  return (
    <>
      <Head>
        <title>QRスキャン - Melty+ Terminal</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold">QRコードスキャン</h1>
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
          <div className="max-w-md w-full">
            
            {/* カメラビュー */}
            <div className="bg-gray-900 rounded-xl overflow-hidden mb-4 shadow-2xl">
              <div className="aspect-square relative">
                {/* html5-qrcode のカメラプレビュー */}
                <div id="qr-reader" className="w-full h-full"></div>

                {/* ステータス表示 */}
                {status === 'success' && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold shadow-xl">
                      読み取り成功！
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <div className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold shadow-xl">
                      読み取りエラー
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 情報カード */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {(status === 'waiting' || status === 'scanning') && (
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    QRコードをスキャンしてください
                  </h2>
                  <p className="text-gray-600 mb-4">
                    ユーザーアプリのQRコードをカメラに映してください
                  </p>

                  {/* タイムアウトカウンター */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="text-xs text-gray-500 mb-1">タイムアウトまで</div>
                    <div className="text-2xl font-bold text-blue-600">{countdown}秒</div>
                  </div>

                  {/* 手動入力へのフォールバック */}
                  <button
                    onClick={handleManualInput}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    手動入力に切り替え
                  </button>
                </div>
              )}

              {status === 'success' && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    読み取り成功！
                  </h2>
                  <p className="text-gray-600">
                    顧客情報を確認しています...
                  </p>
                </div>
              )}

              {status === 'error' && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-3">
                    <AlertCircle size={32} className="text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {cameraPermission === 'denied' ? 'カメラへのアクセスが拒否されました' : '読み取りエラー'}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {errorMessage || 'QRコードの読み取りに失敗しました'}
                  </p>

                  <div className="flex flex-col gap-3">
                    {cameraPermission !== 'denied' && (
                      <button
                        onClick={handleRetry}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                      >
                        再試行
                      </button>
                    )}
                    <button
                      onClick={handleManualInput}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                    >
                      手動入力に切り替え
                    </button>
                    <button
                      onClick={handleCancel}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 rounded-lg font-medium transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* カスタムスタイル */}
        <style jsx global>{`
          /* html5-qrcode のスタイル調整 */
          #qr-reader {
            border: none !important;
          }
          
          #qr-reader video {
            border-radius: 0 !important;
            object-fit: cover !important;
          }
          
          #qr-reader__dashboard {
            display: none !important;
          }
          
          #qr-reader__scan_region {
            border: none !important;
          }
        `}</style>
      </div>
    </>
  );
}
