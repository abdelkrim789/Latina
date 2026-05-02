import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Home,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentLabel = navItems.find(i => i.path === location.pathname)?.label || 'Administration';

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-zinc-200 flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-serif tracking-tight font-medium uppercase">Latina</span>
            <span className="text-[8px] bg-zinc-900 text-white px-1.5 py-0.5 uppercase tracking-tighter">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-400 hover:text-zinc-900">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-900'}`} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="ml-auto w-3 h-3 text-zinc-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-zinc-100">
          <div className="px-4 py-3 bg-zinc-50 rounded-lg">
            <p className="text-xs font-semibold text-zinc-700">Admin Panel</p>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">Latina Atelier</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-zinc-400 hover:text-zinc-900"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xs font-medium uppercase tracking-widest text-zinc-400">
              {currentLabel}
            </h1>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-900 transition-colors border border-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-50"
          >
            <Home size={14} />
            View Store
          </Link>
        </header>

        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
