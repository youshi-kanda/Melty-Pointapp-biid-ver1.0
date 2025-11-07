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
    router.push('/store/login');
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
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-600 via-pink-600 to-purple-700 text-white shadow-2xl z-40 transform transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* ロゴ */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Gift size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Biid Point</h1>
              <p className="text-xs text-purple-200">Management</p>
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
                    ? 'bg-white/20 backdrop-blur-sm shadow-lg border border-white/20' 
                    : 'hover:bg-white/10'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={isActive ? 'text-white' : 'text-white/80 group-hover:text-white'} />
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${isActive ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">{item.sublabel}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* 店舗情報 & ログアウト */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/10">
          {/* 店舗情報 */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">店長</div>
                <div className="text-xs text-purple-200 truncate">store@example.com</div>
              </div>
            </div>
          </div>

          {/* ログアウト */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-white hover:bg-white/10 transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">ログアウト</span>
            </button>
          </div>

          {/* 今日の状況 */}
          <div className="px-4 pb-4">
            <div className="text-xs text-purple-200 mb-2">今日の状況</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-white/80">
                <span>売上</span>
                <span className="font-semibold text-white">¥45,000</span>
              </div>
              <div className="flex items-center justify-between text-white/80">
                <span>取引数</span>
                <span className="font-semibold text-white">23</span>
              </div>
              <div className="flex items-center justify-between text-white/80">
                <span>ポイント発行</span>
                <span className="font-semibold text-emerald-300">2,340pt</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
