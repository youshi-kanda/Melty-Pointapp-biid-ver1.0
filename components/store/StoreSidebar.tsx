import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Store, 
  CreditCard, 
  Receipt, 
  Megaphone,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Gift,
  FileText
} from 'lucide-react';
import { useState } from 'react';

interface StoreSidebarProps {
  currentPage?: string;
}

export default function StoreSidebar({ currentPage }: StoreSidebarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'ダッシュボード', sublabel: '売上・顧客情報', href: '/store', id: 'dashboard' },
    { icon: Store, label: '店舗情報', sublabel: 'プロフィール・基本情報', href: '/store/profile', id: 'profile' },
    { icon: CreditCard, label: 'チャージ', sublabel: 'アカウントチャージ', href: '/store/charge', id: 'charge' },
    { icon: Receipt, label: 'レシート', sublabel: '取引履歴・レシート', href: '/store/receipt', id: 'receipt' },
    { icon: FileText, label: 'EC購入申請', sublabel: 'ポイント付与申請', href: '/store/ec-requests', id: 'ec-requests' },
    { icon: BarChart3, label: '月次レポート', sublabel: '売上・統計レポート', href: '/store/reports', id: 'reports' },
    { icon: Megaphone, label: 'プロモーション', sublabel: 'キャンペーン管理', href: '/store/promotions', id: 'promotions' },
    { icon: Settings, label: '設定', sublabel: 'システム設定', href: '/store/settings', id: 'settings' },
  ];

  const handleLogout = () => {
    console.log('ログアウト');
    window.location.href = '/static/store/login.html';
  };

  return (
    <>
      {/* モバイルメニューボタン */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* オーバーレイ（モバイル） */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* サイドバー */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* ロゴ */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-md">
              <Gift size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">Melty+</h1>
              <p className="text-xs text-gray-500">店舗管理システム</p>
            </div>
          </div>
        </div>

        {/* メニュー */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-280px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || router.pathname === item.href;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  block px-4 py-3 rounded-lg transition-all group
                  ${isActive 
                    ? 'bg-indigo-50 border-l-4 border-indigo-500' 
                    : 'hover:bg-gray-50'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'} />
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${isActive ? 'text-indigo-700' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {item.label}
                    </div>
                    <div className={`text-xs mt-0.5 ${isActive ? 'text-indigo-500' : 'text-gray-400'}`}>{item.sublabel}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* 店舗情報 & ログアウト */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white">
          {/* 今日の状況 */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100">
            <div className="text-xs text-gray-500 mb-2">今日の状況</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">売上</span>
                <span className="font-semibold text-green-600">¥45,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">取引数</span>
                <span className="font-semibold text-indigo-600">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">ポイント発行</span>
                <span className="font-semibold text-indigo-600">2,340pt</span>
              </div>
            </div>
          </div>

          {/* 店舗情報 */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-sm">
                <User size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">店長</div>
                <div className="text-xs text-gray-500 truncate">store@example.com</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
