import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Home,
  Menu,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const AdminLayout = () => {
    const { logout, userProfile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Package, label: 'Products', path: '/admin/products' },
        { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
        { icon: Users, label: 'Customers', path: '/admin/customers' },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col hidden lg:flex">
                <div className="p-8 border-b border-zinc-100">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-xl font-serif tracking-tight font-medium uppercase">Velure</span>
                        <span className="text-[8px] bg-zinc-900 text-white px-1.5 py-0.5 rounded ml-1 uppercase tracking-tighter">Admin</span>
                    </Link>
                </div>
                
                <nav className="flex-1 p-6 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={cn(
                                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 group",
                                    isActive 
                                        ? "bg-zinc-900 text-white" 
                                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-900")} />
                                <span>{item.label}</span>
                                {isActive && <ChevronRight className="ml-auto w-3 h-3 text-zinc-400" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-zinc-100">
                    <div className="flex items-center space-x-3 mb-6 px-4">
                        <img src={userProfile?.photoURL} alt="Admin" className="w-8 h-8 rounded-full" />
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold truncate">{userProfile?.displayName}</span>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Administrator</span>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => logout()}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span className="text-xs">Sign Out</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="lg:hidden">
                            <Menu className="w-5 h-5" />
                        </Button>
                        <h1 className="text-sm font-medium uppercase tracking-widest text-zinc-400">
                            {navItems.find(i => i.path === location.pathname)?.label || 'Administration'}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/">
                            <Button variant="outline" size="sm" className="text-xs">
                                <Home className="mr-2 w-3 h-3" />
                                View Store
                            </Button>
                        </Link>
                    </div>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
