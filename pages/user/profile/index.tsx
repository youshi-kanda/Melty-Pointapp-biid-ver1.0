import { useState, useEffect } from 'react';
import UserLayout from '@/components/user/Layout';
import { User, Mail, Phone, MapPin, Calendar, PenLine, Shield, X, Save, Briefcase, Building2, CheckCircle2 } from 'lucide-react';
import { getUserProfile, updateUserProfile, getIndustries, type UserProfile, type Industry } from '@/lib/api/profile';
import { PREFECTURES, EMPLOYMENT_TYPES } from '@/lib/constants/regions';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [industries, setIndustries] = useState<Industry[]>([]);
  
  const [formData, setFormData] = useState({
    lastName: '太郎',
    firstName: 'ユーザー',
    email: 'user@example.com',
    phone: '090-1234-5678',
    address: '東京都渋谷区...',
    birthday: '1990-01-01',
    // Melty連携項目
    work_region: '',
    industry: '',
    employment_type: '',
    phone_verified: false,
  });

  // 初回データ読み込み
  useEffect(() => {
    loadProfileData();
    loadIndustries();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await getUserProfile();
      
      setFormData(prev => ({
        ...prev,
        email: profile.email,
        phone: profile.phone || '',
        work_region: profile.work_region || '',
        industry: profile.industry || '',
        employment_type: profile.employment_type || '',
        phone_verified: profile.phone_verified,
      }));
    } catch (err) {
      console.error('プロフィール読み込みエラー:', err);
      setError('プロフィールの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const loadIndustries = async () => {
    try {
      const data = await getIndustries();
      setIndustries(data);
    } catch (err) {
      console.error('業種データ読み込みエラー:', err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Melty連携項目のみを送信
      await updateUserProfile({
        phone: formData.phone || undefined,
        work_region: formData.work_region || undefined,
        industry: formData.industry || undefined,
        employment_type: formData.employment_type || undefined,
      });
      
      setIsEditing(false);
      // データを再読み込みして最新状態に同期
      await loadProfileData();
    } catch (err: any) {
      console.error('保存エラー:', err);
      setError(err.message || 'プロフィールの保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // 編集をキャンセルして元の値に戻す
    loadProfileData();
    setIsEditing(false);
    setError(null);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <UserLayout title="マイページ - Melty+">
      <div className="px-4 py-6">
          {/* エラーメッセージ */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600">
              {error}
            </div>
          )}

          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-pink-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">プロフィール</h1>
                  <p className="text-gray-600">アカウント情報の管理</p>
                </div>
              </div>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-2xl shadow-lg transition-all duration-200 bg-gradient-to-r from-pink-500 to-rose-500 text-white transform hover:scale-105"
                  disabled={loading}
                >
                  <PenLine size={16} />
                  <span>{loading ? '読み込み中...' : '編集'}</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 rounded-2xl shadow-lg transition-all duration-200 bg-gradient-to-r from-pink-500 to-rose-500 text-white transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={saving}
                  >
                    <Save size={16} />
                    <span>{saving ? '保存中...' : '保存'}</span>
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 rounded-2xl shadow-lg transition-all duration-200 bg-gray-200 text-gray-700 transform hover:scale-105"
                    disabled={saving}
                  >
                    <X size={16} />
                    <span>キャンセル</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-pink-200">
                <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span>基本情報</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline mr-2" size={16} />
                      姓
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{formData.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline mr-2" size={16} />
                      名
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{formData.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline mr-2" size={16} />
                      メールアドレス
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{formData.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline mr-2" size={16} />
                      電話番号
                      {formData.phone_verified && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                          <CheckCircle2 size={12} className="mr-1" />
                          認証済み
                        </span>
                      )}
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="090-1234-5678"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{formData.phone || '未設定'}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline mr-2" size={16} />
                      住所
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{formData.address}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline mr-2" size={16} />
                      生年月日
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={formData.birthday}
                        onChange={(e) => handleChange('birthday', e.target.value)}
                        className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{formData.birthday}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Melty連携情報セクション */}
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-pink-200 mt-6">
                <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <span>お仕事情報（Melty連携用）</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline mr-2" size={16} />
                      勤務地（都道府県）
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.work_region}
                        onChange={(e) => handleChange('work_region', e.target.value)}
                        className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="">選択してください</option>
                        {PREFECTURES.map((pref) => (
                          <option key={pref} value={pref}>
                            {pref}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{formData.work_region || '未設定'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building2 className="inline mr-2" size={16} />
                      業種
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.industry}
                        onChange={(e) => handleChange('industry', e.target.value)}
                        className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="">選択してください</option>
                        {industries.map((ind) => (
                          <option key={ind.code} value={ind.code}>
                            {ind.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">
                        {formData.industry 
                          ? industries.find(i => i.code === formData.industry)?.name || formData.industry
                          : '未設定'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="inline mr-2" size={16} />
                      雇用形態
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.employment_type}
                        onChange={(e) => handleChange('employment_type', e.target.value)}
                        className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="">選択してください</option>
                        {EMPLOYMENT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{formData.employment_type || '未設定'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Account Info & Security */}
            <div className="space-y-6">
              {/* Account Information */}
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-pink-200">
                <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span>アカウント情報</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">会員ID</p>
                    <p className="font-mono text-sm">TEST001</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">登録日</p>
                    <p className="text-sm">2024年12月15日</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ランク</p>
                    <p className="text-sm">ゴールド会員</p>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-pink-200">
                <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span>セキュリティ</span>
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border border-pink-200 rounded-2xl hover:bg-pink-50 transition-all duration-200">
                    <p className="font-medium text-gray-900">パスワード変更</p>
                    <p className="text-sm text-gray-600">セキュリティ強化のため定期的に変更</p>
                  </button>
                  <button className="w-full text-left p-3 border border-pink-200 rounded-2xl hover:bg-pink-50 transition-all duration-200">
                    <p className="font-medium text-gray-900">2段階認証</p>
                    <p className="text-sm text-gray-600">現在: 無効</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </UserLayout>
  );
}
