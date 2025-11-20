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
  X,
  Shield
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage?: string;
}

export default function AdminSidebar({ currentPage }: SidebarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'ダッシュボード', href: '/static/admin/', id: 'dashboard' },
    { icon: Users, label: 'ユーザー管理', href: '/static/admin/users.html', id: 'users' },
    { icon: Store, label: '店舗管理', href: '/static/admin/stores.html', id: 'stores' },
    { icon: Receipt, label: '取引管理', href: '/static/admin/transactions.html', id: 'transactions' },
    { icon: Gift, label: 'ギフト管理', href: '/static/admin/gifts.html', id: 'gifts' },
    { icon: BarChart3, label: 'レポート', href: '/static/admin/reports.html', id: 'reports' },
    { icon: Settings, label: 'システム設定', href: '/static/admin/settings.html', id: 'settings' },
    { icon: ToggleLeft, label: '機能管理', href: '/static/admin/features.html', id: 'features' },
  ];

  const handleLogout = () => {
    console.log('ログアウト');
    window.location.href = '/static/admin/login.html';
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
          fixed top-0 left-0 h-full w-64 bg-slate-800 text-slate-300 shadow-2xl z-40 transform transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* ロゴ */}
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-white flex-shrink-0" strokeWidth={1.5} />
            <div>
              <h1 className="text-lg font-bold text-white whitespace-nowrap">Melty+ 管理画面</h1>
              <p className="text-slate-400 text-xs">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* メニュー */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-165px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || router.pathname === item.href;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-300 hover:bg-slate-700/50'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ユーザー情報とログアウト */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-700 bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center">
                <Users size={18} className="text-slate-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">運営</p>
                <p className="text-xs text-slate-400">admin@example.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-slate-700 rounded-lg transition-all"
              title="ログアウト"
            >
              <LogOut size={18} className="text-slate-300" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
