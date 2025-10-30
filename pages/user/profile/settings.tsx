import { useState } from 'react';
import UserLayout from '@/components/user/Layout';
import { 
  Settings, 
  Lock, 
  Key, 
  Mail, 
  Phone, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff,
  Trash2,
  ChevronRight,
  Save,
  X,
  AlertCircle,
  Check
} from 'lucide-react';

export default function SettingsPage() {
  // アカウント設定
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [showPhoneChange, setShowPhoneChange] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [emailData, setEmailData] = useState({
    currentEmail: 'user@example.com',
    newEmail: '',
    password: ''
  });

  const [phoneData, setPhoneData] = useState({
    currentPhone: '090-1234-5678',
    newPhone: '',
    verificationCode: ''
  });

  // セキュリティ設定
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // 通知設定
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    giftReceived: true,
    pointsEarned: true,
    pointsUsed: false,
    friendRequests: true
  });

  // プライバシー設定（デフォルト非公開）
  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    searchable: false,
    activityPublic: false,
    locationEnabled: false
  });

  const handlePasswordChange = () => {
    // TODO: API連携でパスワード変更
    console.log('パスワード変更:', passwordData);
    setShowPasswordChange(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleEmailChange = () => {
    // TODO: API連携でメールアドレス変更
    console.log('メールアドレス変更:', emailData);
    setShowEmailChange(false);
    setEmailData({ currentEmail: emailData.newEmail, newEmail: '', password: '' });
  };

  const handlePhoneChange = () => {
    // TODO: API連携で電話番号変更
    console.log('電話番号変更:', phoneData);
    setShowPhoneChange(false);
    setPhoneData({ currentPhone: phoneData.newPhone, newPhone: '', verificationCode: '' });
  };

  const handleDeleteAccount = () => {
    if (confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) {
      // TODO: API連携でアカウント削除
      console.log('アカウント削除');
    }
  };

  return (
    <UserLayout title="設定 - Melty+">
      <div className="px-4 py-4">
        {/* ヘッダー */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-pink-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">設定</h1>
              <p className="text-xs text-gray-500">アカウントとプライバシーの管理</p>
            </div>
          </div>
        </div>

        {/* アカウント設定 */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-pink-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-7 h-7 bg-pink-100 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-pink-600" />
            </div>
            <h2 className="text-base font-bold text-gray-800">アカウント設定</h2>
          </div>

          <div className="space-y-2">
            {/* パスワード変更 */}
            <div className="border border-gray-200 rounded-lg p-3">
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-gray-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">パスワード変更</p>
                    <p className="text-xs text-gray-500">定期的に変更してください</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showPasswordChange ? 'rotate-90' : ''}`} />
              </button>

              {showPasswordChange && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">現在のパスワード</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="現在のパスワード"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">新しいパスワード</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="新しいパスワード"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">パスワード確認</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="パスワード再入力"
                    />
                  </div>
                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={handlePasswordChange}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90"
                    >
                      <Save size={14} />
                      <span>変更</span>
                    </button>
                    <button
                      onClick={() => setShowPasswordChange(false)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      <X size={14} />
                      <span>キャンセル</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* メールアドレス変更 */}
            <div className="border border-gray-200 rounded-lg p-3">
              <button
                onClick={() => setShowEmailChange(!showEmailChange)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">メールアドレス変更</p>
                    <p className="text-xs text-gray-500">{emailData.currentEmail}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showEmailChange ? 'rotate-90' : ''}`} />
              </button>

              {showEmailChange && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">新しいメールアドレス</label>
                    <input
                      type="email"
                      value={emailData.newEmail}
                      onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="新しいメールアドレス"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">パスワード確認</label>
                    <input
                      type="password"
                      value={emailData.password}
                      onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="現在のパスワード"
                    />
                  </div>
                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={handleEmailChange}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90"
                    >
                      <Save size={14} />
                      <span>変更</span>
                    </button>
                    <button
                      onClick={() => setShowEmailChange(false)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      <X size={14} />
                      <span>キャンセル</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 電話番号変更 */}
            <div className="border border-gray-200 rounded-lg p-3">
              <button
                onClick={() => setShowPhoneChange(!showPhoneChange)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">電話番号変更</p>
                    <p className="text-xs text-gray-500">{phoneData.currentPhone}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showPhoneChange ? 'rotate-90' : ''}`} />
              </button>

              {showPhoneChange && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">新しい電話番号</label>
                    <input
                      type="tel"
                      value={phoneData.newPhone}
                      onChange={(e) => setPhoneData({ ...phoneData, newPhone: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="090-1234-5678"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">SMS認証コード</label>
                    <input
                      type="text"
                      value={phoneData.verificationCode}
                      onChange={(e) => setPhoneData({ ...phoneData, verificationCode: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="6桁の認証コード"
                    />
                    <p className="text-xs text-gray-500 mt-1">新しい電話番号にSMSが送信されます</p>
                  </div>
                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={handlePhoneChange}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90"
                    >
                      <Save size={14} />
                      <span>変更</span>
                    </button>
                    <button
                      onClick={() => setShowPhoneChange(false)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      <X size={14} />
                      <span>キャンセル</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* セキュリティ設定 */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-pink-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-7 h-7 bg-pink-100 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-pink-600" />
            </div>
            <h2 className="text-base font-bold text-gray-800">セキュリティ</h2>
          </div>

          <div className="space-y-2">
            {/* 2段階認証 */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">2段階認証</p>
                  <p className="text-xs text-gray-500">SMS認証</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* 生体認証 */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">生体認証</p>
                  <p className="text-xs text-gray-500">Face ID / Touch ID</p>
                </div>
              </div>
              <button
                onClick={() => setBiometricEnabled(!biometricEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  biometricEnabled ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    biometricEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* ログイン履歴 */}
            <button className="w-full border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:bg-pink-50 transition-colors">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-gray-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">ログイン履歴</p>
                  <p className="text-xs text-gray-500">最終: 2時間前</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* 通知設定 */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-pink-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-7 h-7 bg-pink-100 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-pink-600" />
            </div>
            <h2 className="text-base font-bold text-gray-800">通知設定</h2>
          </div>

          <div className="space-y-2">
            {/* プッシュ通知 */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-800">プッシュ通知</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.push ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.push ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* メール通知 */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-800">メール通知</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.email ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.email ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* ギフト受取通知 */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-800">ギフト受取時</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, giftReceived: !notifications.giftReceived })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.giftReceived ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.giftReceived ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* ポイント獲得通知 */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-800">ポイント獲得時</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, pointsEarned: !notifications.pointsEarned })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.pointsEarned ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.pointsEarned ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* ポイント使用通知 */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-800">ポイント使用時</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, pointsUsed: !notifications.pointsUsed })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.pointsUsed ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.pointsUsed ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* 友達リクエスト通知 */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-800">友達リクエスト</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, friendRequests: !notifications.friendRequests })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.friendRequests ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications.friendRequests ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* プライバシー設定 */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-pink-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-7 h-7 bg-pink-100 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-pink-600" />
            </div>
            <h2 className="text-base font-bold text-gray-800">プライバシー設定</h2>
          </div>

          <div className="space-y-2">
            {/* プロフィール公開 */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                {privacy.profilePublic ? <Eye className="w-4 h-4 text-gray-600" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
                <div>
                  <p className="text-sm font-medium text-gray-800">プロフィール公開</p>
                  <p className="text-xs text-gray-500">他のユーザーに表示</p>
                </div>
              </div>
              <button
                onClick={() => setPrivacy({ ...privacy, profilePublic: !privacy.profilePublic })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  privacy.profilePublic ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    privacy.profilePublic ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* 検索表示 */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">検索での表示</p>
                  <p className="text-xs text-gray-500">検索結果に表示</p>
                </div>
              </div>
              <button
                onClick={() => setPrivacy({ ...privacy, searchable: !privacy.searchable })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  privacy.searchable ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    privacy.searchable ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* アクティビティ公開 */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">アクティビティ公開</p>
                  <p className="text-xs text-gray-500">履歴を公開</p>
                </div>
              </div>
              <button
                onClick={() => setPrivacy({ ...privacy, activityPublic: !privacy.activityPublic })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  privacy.activityPublic ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    privacy.activityPublic ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* 位置情報 */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">位置情報の使用</p>
                  <p className="text-xs text-gray-500">近くの店舗表示</p>
                </div>
              </div>
              <button
                onClick={() => setPrivacy({ ...privacy, locationEnabled: !privacy.locationEnabled })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  privacy.locationEnabled ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    privacy.locationEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* その他 */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-pink-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-7 h-7 bg-pink-100 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-pink-600" />
            </div>
            <h2 className="text-base font-bold text-gray-800">その他</h2>
          </div>

          <div className="space-y-2">
            {/* アプリバージョン */}
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-800">アプリバージョン</p>
                <p className="text-xs text-gray-500">v1.0.0</p>
              </div>
            </div>

            {/* 利用規約 */}
            <button className="w-full border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:bg-pink-50 transition-colors">
              <p className="text-sm font-medium text-gray-800">利用規約</p>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* プライバシーポリシー */}
            <button className="w-full border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:bg-pink-50 transition-colors">
              <p className="text-sm font-medium text-gray-800">プライバシーポリシー</p>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* お問い合わせ */}
            <button className="w-full border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:bg-pink-50 transition-colors">
              <p className="text-sm font-medium text-gray-800">お問い合わせ</p>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* ヘルプ */}
            <button className="w-full border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:bg-pink-50 transition-colors">
              <p className="text-sm font-medium text-gray-800">ヘルプ / FAQ</p>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* アカウント削除 */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-rose-200">
          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">アカウントを削除</span>
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            削除したアカウントは復元できません
          </p>
        </div>
      </div>
    </UserLayout>
  );
}
