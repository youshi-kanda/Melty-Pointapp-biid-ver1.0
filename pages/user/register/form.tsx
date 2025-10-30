import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, ArrowRight, Phone, Calendar, MapPin, Briefcase, Users } from 'lucide-react'

export default function RegisterFormPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    birthday: '',
    gender: '',
    phone: '',
    email: '',
    workRegion: '',
    industry: '',
    employmentType: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 必須項目チェック
    if (!formData.lastName || !formData.firstName) {
      alert('姓名を入力してください')
      return
    }
    
    if (!formData.birthday) {
      alert('生年月日を入力してください')
      return
    }
    
    if (!formData.gender) {
      alert('性別を選択してください')
      return
    }
    
    // 電話番号バリデーション
    if (!formData.phone) {
      alert('電話番号を入力してください')
      return
    }
    
    const phoneRegex = /^0[789]0-?\d{4}-?\d{4}$/
    if (!phoneRegex.test(formData.phone)) {
      alert('正しい電話番号を入力してください（例: 090-1234-5678）')
      return
    }
    
    if (!formData.email) {
      alert('メールアドレスを入力してください')
      return
    }
    
    if (!formData.workRegion) {
      alert('勤務地域を選択してください')
      return
    }
    
    if (!formData.industry) {
      alert('業種を選択してください')
      return
    }
    
    if (!formData.employmentType) {
      alert('働き方を選択してください')
      return
    }
    
        // パスワード確認
    if (formData.password !== formData.confirmPassword) {
      alert('パスワードが一致しません')
      return
    }

    if (formData.password.length < 8) {
      alert('パスワードは8文字以上で入力してください')
      return
    }

    if (!formData.agreeToTerms) {
      alert('利用規約およびプライバシーポリシーに同意してください')
      return
    }

    setIsLoading(true)
    
    // TODO: API連携
    console.log('Registration data:', formData)
    
    // 登録完了後はユーザーホーム画面へ
    setTimeout(() => {
      router.push('/user/')
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <>
      <Head>
        <title>新規会員登録 - Melty+ (メルティプラス)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Nunito:wght@300;400;500;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Great+Vibes&family=Satisfy&family=Fredoka+One&family=Bungee&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white">
        {/* メインコンテンツ */}
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-10">
            {/* ヘッダー情報 */}
            <div className="text-center mb-10">
              {/* 戻るボタン */}
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>戻る</span>
              </button>

              {/* ロゴ */}
              <div className="flex items-center justify-center mb-6">
                <Image
                  src="/melty-logo.jpg"
                  alt="Melty+"
                  width={200}
                  height={100}
                  className="object-contain"
                />
              </div>

              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
                新規会員登録
              </h1>
              <p className="text-gray-600 text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>Melty+へようこそ</p>
              <div className="mt-4 px-4 py-2 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">ブロンズランク • 500ptウェルカムボーナス</p>
              </div>
            </div>

            {/* 登録フォーム */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 姓名 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    姓 *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300 bg-pink-50/30 text-base"
                    placeholder="田中"
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    名 *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300 bg-pink-50/30 text-base"
                    placeholder="太郎"
                    required
                  />
                </div>
              </div>

              {/* 生年月日 */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  生年月日 *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300 bg-pink-50/30 text-base"
                    required
                  />
                </div>
              </div>

              {/* 性別 */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  性別 *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300 bg-pink-50/30 text-base"
                  required
                >
                  <option value="">選択してください</option>
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                  <option value="other">その他</option>
                  <option value="prefer_not_to_say">回答しない</option>
                </select>
              </div>

              {/* 電話番号 */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  電話番号 *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300 bg-pink-50/30 text-base"
                    placeholder="090-1234-5678"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">SMS認証に使用します</p>
              </div>

              {/* メールアドレス */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  メールアドレス *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300 bg-pink-50/30 text-base"
                    placeholder="your@example.com"
                    required
                  />
                </div>
              </div>

              {/* パスワード */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  パスワード *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-14 py-4 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300 bg-pink-50/30 text-base"
                    placeholder="8文字以上のパスワード"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* パスワード確認 */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  パスワード確認 *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-14 py-4 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300 bg-pink-50/30 text-base"
                    placeholder="パスワードを再入力"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 勤務地域 */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  勤務地域 *
                </label>
                <select
                  name="workRegion"
                  value={formData.workRegion}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300 bg-pink-50/30 text-base"
                  required
                >
                  <option value="">選択してください</option>
                  <option value="北海道">北海道</option>
                  <option value="青森県">青森県</option>
                  <option value="岩手県">岩手県</option>
                  <option value="宮城県">宮城県</option>
                  <option value="秋田県">秋田県</option>
                  <option value="山形県">山形県</option>
                  <option value="福島県">福島県</option>
                  <option value="茨城県">茨城県</option>
                  <option value="栃木県">栃木県</option>
                  <option value="群馬県">群馬県</option>
                  <option value="埼玉県">埼玉県</option>
                  <option value="千葉県">千葉県</option>
                  <option value="東京都">東京都</option>
                  <option value="神奈川県">神奈川県</option>
                  <option value="新潟県">新潟県</option>
                  <option value="富山県">富山県</option>
                  <option value="石川県">石川県</option>
                  <option value="福井県">福井県</option>
                  <option value="山梨県">山梨県</option>
                  <option value="長野県">長野県</option>
                  <option value="岐阜県">岐阜県</option>
                  <option value="静岡県">静岡県</option>
                  <option value="愛知県">愛知県</option>
                  <option value="三重県">三重県</option>
                  <option value="滋賀県">滋賀県</option>
                  <option value="京都府">京都府</option>
                  <option value="大阪府">大阪府</option>
                  <option value="兵庫県">兵庫県</option>
                  <option value="奈良県">奈良県</option>
                  <option value="和歌山県">和歌山県</option>
                  <option value="鳥取県">鳥取県</option>
                  <option value="島根県">島根県</option>
                  <option value="岡山県">岡山県</option>
                  <option value="広島県">広島県</option>
                  <option value="山口県">山口県</option>
                  <option value="徳島県">徳島県</option>
                  <option value="香川県">香川県</option>
                  <option value="愛媛県">愛媛県</option>
                  <option value="高知県">高知県</option>
                  <option value="福岡県">福岡県</option>
                  <option value="佐賀県">佐賀県</option>
                  <option value="長崎県">長崎県</option>
                  <option value="熊本県">熊本県</option>
                  <option value="大分県">大分県</option>
                  <option value="宮崎県">宮崎県</option>
                  <option value="鹿児島県">鹿児島県</option>
                  <option value="沖縄県">沖縄県</option>
                </select>
              </div>

              {/* 業種 */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  業種 *
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 hover:border-pink-300 bg-pink-50/30 text-base"
                  required
                >
                  <option value="">選択してください</option>
                  <option value="ナイトワーク(キャバクラ・クラブ等)">ナイトワーク(キャバクラ・クラブ等)</option>
                  <option value="ナイトワーク(ガールズバー・スナック等)">ナイトワーク(ガールズバー・スナック等)</option>
                  <option value="ナイトワーク(ホスト・ボーイズバー等)">ナイトワーク(ホスト・ボーイズバー等)</option>
                  <option value="ナイトワーク(その他)">ナイトワーク(その他)</option>
                  <option value="美容・エステ・ネイル">美容・エステ・ネイル</option>
                  <option value="アパレル・ファッション">アパレル・ファッション</option>
                  <option value="飲食・サービス">飲食・サービス</option>
                  <option value="会社員・OL">会社員・OL</option>
                  <option value="自営業・フリーランス">自営業・フリーランス</option>
                  <option value="学生・アルバイト">学生・アルバイト</option>
                  <option value="その他">その他</option>
                </select>
              </div>

              {/* 専業or副業 */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  働き方 *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="employmentType"
                      value="専業"
                      checked={formData.employmentType === '専業'}
                      onChange={handleChange}
                      className="peer sr-only"
                      required
                    />
                    <div className="px-6 py-4 border-2 border-pink-200 rounded-2xl text-center transition-all duration-200 peer-checked:border-pink-500 peer-checked:bg-pink-50 hover:border-pink-300">
                      <span className="text-base font-semibold text-gray-700 peer-checked:text-pink-600">専業</span>
                    </div>
                  </label>
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="employmentType"
                      value="副業"
                      checked={formData.employmentType === '副業'}
                      onChange={handleChange}
                      className="peer sr-only"
                      required
                    />
                    <div className="px-6 py-4 border-2 border-pink-200 rounded-2xl text-center transition-all duration-200 peer-checked:border-pink-500 peer-checked:bg-pink-50 hover:border-pink-300">
                      <span className="text-base font-semibold text-gray-700 peer-checked:text-pink-600">副業</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* チェックボックス */}
              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    <a href="/terms" className="text-pink-600 hover:text-pink-800 underline">利用規約</a>
                    および
                    <a href="/privacy" className="text-pink-600 hover:text-pink-800 underline">プライバシーポリシー</a>
                    に同意します *
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">
                    キャンペーンやお得情報のメール配信を希望します(任意)
                  </span>
                </label>
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-4 rounded-2xl hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg text-lg flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? '登録中...' : 'アカウント作成'}</span>
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            {/* ログインリンク */}
            <div className="mt-8 text-center">
              <span className="text-base text-gray-600">すでにアカウントをお持ちの方は </span>
              <Link 
                href="/user/login" 
                className="text-base text-rose-600 hover:text-rose-800 font-semibold transition-colors"
              >
                ログイン
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
