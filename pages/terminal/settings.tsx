import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  ArrowLeft, 
  Settings, 
  Monitor, 
  Volume2, 
  Bell, 
  Clock, 
  Wifi, 
  Database, 
  LogOut, 
  RefreshCw,
  Info,
  User,
  Store,
  Check,
  AlertCircle,
  History
} from 'lucide-react';

export default function TerminalSettings() {
  const router = useRouter();
  
  // 設定状態
  const [settings, setSettings] = useState({
    // 端末情報
    terminalId: 'TERM-001',
    storeName: '渋谷店',
    storeId: 'STORE-001',
    
    // 表示設定
    brightness: 80,
    fontSize: 'medium', // small, medium, large
    theme: 'light', // light, dark
    
    // 音声設定
    soundEnabled: true,
    soundVolume: 70,
    voiceGuidance: true,
    
    // 通知設定
    notifications: true,
    lowBatteryAlert: true,
    
    // タイムアウト設定
    nfcTimeout: 30,
    qrTimeout: 30,
    idleTimeout: 60,
    
    // ネットワーク
    wifiConnected: true,
    wifiSSID: 'Melty-Store-WiFi',
    
    // その他
    autoLogout: true,
    autoLogoutTime: 30,
    debugMode: false
  });

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleBack = () => {
    router.push('/terminal-simple');
  };

  const handleLogout = () => {
    // TODO: ログアウト処理
    router.push('/terminal/login');
  };

  const handleReset = () => {
    // TODO: リセット処理
    setSettings({
      ...settings,
      brightness: 80,
      fontSize: 'medium',
      theme: 'light',
      soundEnabled: true,
      soundVolume: 70,
      voiceGuidance: true,
      notifications: true,
      lowBatteryAlert: true,
      nfcTimeout: 30,
      qrTimeout: 30,
      idleTimeout: 60,
      autoLogout: true,
      autoLogoutTime: 30,
      debugMode: false
    });
    setShowResetConfirm(false);
  };

  const handleSave = () => {
    // TODO: 設定保存処理
    alert('設定を保存しました');
  };

  return (
    <>
      <Head>
        <title>設定 - Melty+ Terminal</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-3 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="text-sm">戻る</span>
              </button>
              <h1 className="text-lg sm:text-xl font-bold">設定</h1>
            </div>
            <button
              onClick={handleSave}
              className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg transition-colors text-sm font-medium"
            >
              保存
            </button>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          
          {/* 端末情報 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Monitor className="text-blue-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">端末情報</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">端末ID</span>
                <span className="font-medium text-gray-900">{settings.terminalId}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">店舗名</span>
                <span className="font-medium text-gray-900">{settings.storeName}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">店舗ID</span>
                <span className="font-medium text-gray-900">{settings.storeId}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">WiFi接続</span>
                <div className="flex items-center gap-2">
                  {settings.wifiConnected ? (
                    <>
                      <Wifi className="text-green-600" size={16} />
                      <span className="text-green-600 font-medium">{settings.wifiSSID}</span>
                    </>
                  ) : (
                    <>
                      <Wifi className="text-red-600" size={16} />
                      <span className="text-red-600 font-medium">未接続</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 表示設定 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Monitor className="text-purple-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">表示設定</h2>
            </div>
            
            <div className="space-y-4">
              {/* 明るさ */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">画面の明るさ</span>
                  <span className="text-blue-600 font-bold">{settings.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.brightness}
                  onChange={(e) => setSettings({ ...settings, brightness: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* フォントサイズ */}
              <div>
                <label className="text-gray-700 font-medium mb-2 block">フォントサイズ</label>
                <div className="grid grid-cols-3 gap-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSettings({ ...settings, fontSize: size })}
                      className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                        settings.fontSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                    </button>
                  ))}
                </div>
              </div>

              {/* テーマ */}
              <div>
                <label className="text-gray-700 font-medium mb-2 block">テーマ</label>
                <div className="grid grid-cols-2 gap-2">
                  {['light', 'dark'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSettings({ ...settings, theme })}
                      className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                        settings.theme === theme
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {theme === 'light' ? 'ライト' : 'ダーク'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 音声設定 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Volume2 className="text-green-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">音声設定</h2>
            </div>
            
            <div className="space-y-4">
              {/* サウンド有効 */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">サウンド</span>
                <button
                  onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                  className={`w-14 h-8 rounded-full transition-colors relative ${
                    settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.soundEnabled ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>

              {/* 音量 */}
              {settings.soundEnabled && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">音量</span>
                    <span className="text-blue-600 font-bold">{settings.soundVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.soundVolume}
                    onChange={(e) => setSettings({ ...settings, soundVolume: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              )}

              {/* 音声ガイダンス */}
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">音声ガイダンス</span>
                <button
                  onClick={() => setSettings({ ...settings, voiceGuidance: !settings.voiceGuidance })}
                  className={`w-14 h-8 rounded-full transition-colors relative ${
                    settings.voiceGuidance ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.voiceGuidance ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* タイムアウト設定 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="text-orange-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">タイムアウト設定</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">NFC読み取り</span>
                <select
                  value={settings.nfcTimeout}
                  onChange={(e) => setSettings({ ...settings, nfcTimeout: parseInt(e.target.value) })}
                  className="bg-gray-100 border-0 rounded-lg px-3 py-1.5 font-medium text-gray-900"
                >
                  <option value={15}>15秒</option>
                  <option value={30}>30秒</option>
                  <option value={60}>60秒</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">QRスキャン</span>
                <select
                  value={settings.qrTimeout}
                  onChange={(e) => setSettings({ ...settings, qrTimeout: parseInt(e.target.value) })}
                  className="bg-gray-100 border-0 rounded-lg px-3 py-1.5 font-medium text-gray-900"
                >
                  <option value={15}>15秒</option>
                  <option value={30}>30秒</option>
                  <option value={60}>60秒</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">アイドル時間</span>
                <select
                  value={settings.idleTimeout}
                  onChange={(e) => setSettings({ ...settings, idleTimeout: parseInt(e.target.value) })}
                  className="bg-gray-100 border-0 rounded-lg px-3 py-1.5 font-medium text-gray-900"
                >
                  <option value={30}>30秒</option>
                  <option value={60}>60秒</option>
                  <option value={120}>120秒</option>
                </select>
              </div>
            </div>
          </div>

          {/* セキュリティ設定 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <User className="text-red-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">セキュリティ</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-700 font-medium">自動ログアウト</div>
                  <div className="text-sm text-gray-500">一定時間操作がない場合に自動ログアウト</div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, autoLogout: !settings.autoLogout })}
                  className={`w-14 h-8 rounded-full transition-colors relative ${
                    settings.autoLogout ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.autoLogout ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>

              {settings.autoLogout && (
                <div className="flex items-center justify-between py-2 border-t">
                  <span className="text-gray-700">自動ログアウト時間</span>
                  <select
                    value={settings.autoLogoutTime}
                    onChange={(e) => setSettings({ ...settings, autoLogoutTime: parseInt(e.target.value) })}
                    className="bg-gray-100 border-0 rounded-lg px-3 py-1.5 font-medium text-gray-900"
                  >
                    <option value={15}>15分</option>
                    <option value={30}>30分</option>
                    <option value={60}>60分</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="space-y-3">
            {/* 取引履歴 */}
            <button
              onClick={() => router.push('/terminal/transaction-history')}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-4 px-6 rounded-xl border border-gray-200 transition-colors shadow-sm hover:shadow flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <History className="text-blue-600" size={20} />
                <span>取引履歴を見る</span>
              </div>
              <ArrowLeft className="rotate-180 text-gray-400" size={18} />
            </button>

            {/* デバッグモード */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="text-gray-400" size={20} />
                  <span className="text-gray-700 font-medium">デバッグモード</span>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, debugMode: !settings.debugMode })}
                  className={`w-14 h-8 rounded-full transition-colors relative ${
                    settings.debugMode ? 'bg-yellow-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.debugMode ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* 設定リセット */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full bg-white hover:bg-gray-50 text-orange-600 font-medium py-4 px-6 rounded-xl border-2 border-orange-600 transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              <span>設定をリセット</span>
            </button>

            {/* ログアウト */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              <span>ログアウト</span>
            </button>
          </div>

          {/* バージョン情報 */}
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Melty+ Terminal v1.0.0</p>
            <p className="text-xs text-gray-500 mt-1">© 2024 Melty+ All rights reserved.</p>
          </div>
        </div>

        {/* ログアウト確認モーダル */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <LogOut className="text-red-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">ログアウトしますか？</h2>
                <p className="text-sm text-gray-600">
                  ログアウトすると、再度ログインが必要になります。
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        )}

        {/* リセット確認モーダル */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <AlertCircle className="text-orange-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">設定をリセットしますか？</h2>
                <p className="text-sm text-gray-600">
                  すべての設定が初期値に戻ります。
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  リセット
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
