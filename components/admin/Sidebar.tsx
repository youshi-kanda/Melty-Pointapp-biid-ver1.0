import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Receipt, 
  Gift, 
  BarChart3, 
  Settings, 
  ToggleLeft,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage?: string;
}

export default function AdminSidebar({ currentPage }: SidebarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'ダッシュボード', href: '/admin', id: 'dashboard' },
    { icon: Users, label: 'ユーザー管理', href: '/admin/users', id: 'users' },
    { icon: Store, label: '店舗管理', href: '/admin/stores', id: 'stores' },
    { icon: Receipt, label: '取引管理', href: '/admin/transactions', id: 'transactions' },
    { icon: Gift, label: 'ギフト管理', href: '/admin/gifts', id: 'gifts' },
    { icon: BarChart3, label: 'レポート', href: '/admin/reports', id: 'reports' },
    { icon: Settings, label: 'システム設定', href: '/admin/settings', id: 'settings' },
    { icon: ToggleLeft, label: '機能管理', href: '/admin/features', id: 'features' },
  ];

  const handleLogout = () => {
    console.log('ログアウト');
    router.push('/admin/login');
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
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-600 to-indigo-700 text-white shadow-2xl z-40 transform transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* ロゴ */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold">BIID 管理</h1>
          <p className="text-purple-200 text-sm mt-1">Admin Panel</p>
        </div>

        {/* メニュー */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || router.pathname === item.href;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-white text-purple-600 shadow-lg' 
                    : 'text-white hover:bg-white/10'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ログアウト */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white hover:bg-white/10 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">ログアウト</span>
          </button>
        </div>
      </aside>
    </>
  );
}
