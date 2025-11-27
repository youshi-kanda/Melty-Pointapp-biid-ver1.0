import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import TerminalHead from '@/components/terminal/TerminalHead';
import { QrCode, X, AlertCircle, CheckCircle, Camera, Smartphone } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { QRCodeSVG } from 'qrcode.react';

export default function QRScan() {
  const router = useRouter();
  const [mode, setMode] = useState<'scan' | 'display'>('scan'); // スキャンモード or 表示モード
  const [status, setStatus] = useState<'waiting' | 'scanning' | 'success' | 'error'>('waiting');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerInitialized = useRef(false);
  
  // 端末固有のQRコードデータ（実際は端末IDやセッションIDなど）
  const [terminalQRData, setTerminalQRData] = useState('');
  const [authenticatedUserId, setAuthenticatedUserId] = useState<string | null>(null);

  // 端末QRコードデータの生成
  useEffect(() => {
    // 端末固有のセッションIDを生成（実際はバックエンドから取得）
    const sessionId = `TERMINAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const qrData = JSON.stringify({
      type: 'terminal_auth',
      sessionId: sessionId,
      timestamp: Date.now(),
    });
    setTerminalQRData(qrData);
  }, []);

  // 認証ポーリング（表示モード時）
  useEffect(() => {
    if (mode === 'display' && !authenticatedUserId) {
      // 3秒ごとにバックエンドに認証状態を問い合わせ（実装時はAPI呼び出し）
      const pollInterval = setInterval(() => {
        // TODO: バックエンドAPIで認証状態を確認
        // const response = await fetch(`/api/terminal/check-auth?session=${terminalQRData}`);
        // if (response.ok) {
        //   const data = await response.json();
        //   if (data.authenticated) {
        //     setAuthenticatedUserId(data.userId);
        //     clearInterval(pollInterval);
        //   }
        // }
      }, 3000);

      return () => clearInterval(pollInterval);
    }
  }, [mode, authenticatedUserId, terminalQRData]);

  // 認証成功時の処理
  useEffect(() => {
    if (authenticatedUserId) {
      setStatus('success');
      setTimeout(() => {
        router.push(`/terminal/customer-confirm?userId=${authenticatedUserId}`);
      }, 1500);
    }
  }, [authenticatedUserId, router]);

  useEffect(() => {
    // タイムアウトカウントダウン（スキャンモード時のみ）
    if (mode === 'scan' && (status === 'waiting' || status === 'scanning') && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (mode === 'scan' && countdown === 0 && status !== 'success') {
      setStatus('error');
      setErrorMessage('タイムアウトしました');
      stopScanner();
    }
  }, [countdown, status, mode]);

  // QRスキャナーの初期化（スキャンモード時のみ）
  useEffect(() => {
    if (mode !== 'scan' || scannerInitialized.current) return;
    
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
  }, [router, mode]);

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
    router.push('/terminal/');
  };  const handleManualInput = () => {
    stopScanner();
    router.push('/terminal/manual-input');
  };

  const handleRetry = () => {
    setStatus('waiting');
    setCountdown(30);
    setErrorMessage('');
    window.location.reload(); // ページをリロードしてスキャナーを再初期化
  };

  const handleModeSwitch = (newMode: 'scan' | 'display') => {
    if (newMode === mode) return;
    
    // スキャンモードから切り替える場合はスキャナーを停止
    if (mode === 'scan') {
      stopScanner();
      scannerInitialized.current = false;
    }
    
    setMode(newMode);
    setStatus('waiting');
    setCountdown(30);
    setErrorMessage('');
    setAuthenticatedUserId(null);
  };

  return (
    <>
      <TerminalHead title="QRスキャン - Melty+ Terminal" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold">ユーザー認証</h1>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              <X size={18} />
              <span className="text-sm">キャンセル</span>
            </button>
          </div>
        </div>

        {/* モード切り替えタブ */}
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="max-w-4xl mx-auto flex gap-2">
            <button
              onClick={() => handleModeSwitch('scan')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                mode === 'scan'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Camera size={20} />
              <span>QRスキャン</span>
            </button>
            <button
              onClick={() => handleModeSwitch('display')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                mode === 'display'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Smartphone size={20} />
              <span>QR表示</span>
            </button>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            
            {mode === 'scan' ? (
              /* カメラビュー（スキャンモード） */
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
            ) : (
              /* QRコード表示（表示モード） */
              <div className="bg-white rounded-xl overflow-hidden mb-4 shadow-2xl">
                <div className="p-8 flex flex-col items-center">
                  <div className="bg-white p-6 rounded-2xl shadow-inner border-4 border-blue-100">
                    {terminalQRData && (
                      <QRCodeSVG
                        value={terminalQRData}
                        size={280}
                        level="H"
                        includeMargin={false}
                      />
                    )}
                  </div>
                  
                  {!authenticatedUserId ? (
                    <div className="mt-6 text-center">
                      <div className="inline-flex items-center gap-2 text-blue-600 mb-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        <span className="font-medium">認証待機中...</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        ユーザーアプリでこのQRコードを読み取ってください
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
                        <CheckCircle size={24} className="text-green-600" />
                      </div>
                      <p className="font-medium text-green-600">認証成功！</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 情報カード */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {mode === 'scan' ? (
                // スキャンモードの情報
                <>
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
                </>
              ) : (
                // 表示モードの情報
                <div className="text-center">
                  {!authenticatedUserId ? (
                    <>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        ユーザー認証待ち
                      </h2>
                      <p className="text-gray-600 mb-4">
                        ユーザーがスマートフォンでQRコードを読み取るまでお待ちください
                      </p>

                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <div className="text-sm font-medium text-blue-900 mb-2">
                          📱 ユーザーへの案内
                        </div>
                        <ol className="text-xs text-left text-blue-800 space-y-1">
                          <li>1. スマホでアプリを開く</li>
                          <li>2. QRスキャン機能を起動</li>
                          <li>3. 画面のQRコードを読み取る</li>
                        </ol>
                      </div>

                      <button
                        onClick={handleCancel}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 rounded-lg font-medium transition-colors"
                      >
                        キャンセル
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                        <CheckCircle size={32} className="text-green-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        認証成功！
                      </h2>
                      <p className="text-gray-600">
                        顧客情報を確認しています...
                      </p>
                    </>
                  )}
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
