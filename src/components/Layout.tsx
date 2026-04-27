import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';

const Layout = () => {
  const { user, userProfile, isAdmin, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-luxury-deep text-luxury-ivory font-sans">
      {/* Global Navigation */}
      <nav className="sticky top-0 z-50 bg-luxury-deep/90 backdrop-blur-xl border-b border-luxury-border">
        <div className="max-w-[1440px] mx-auto px-12 py-6 flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="text-3xl font-serif tracking-[0.2em] uppercase italic hover:text-luxury-gold transition-colors">
            VÉRO
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-12 items-center text-[10px] uppercase tracking-[0.3em] font-medium text-luxury-ivory/60">
            <Link to="/catalog" className="hover:text-white transition-colors">Collections</Link>
            <Link to="/catalog?category=shoes" className="hover:text-white transition-colors">Atelier</Link>
            <Link to="/catalog?category=bags" className="hover:text-white transition-colors">Archives</Link>
          </div>

          {/* Icons */}
          <div className="flex gap-8 items-center text-[10px] uppercase tracking-[0.3em] font-medium">
            <Link to="/cart" className="relative group cursor-pointer hover:text-white transition-colors">
              <span>Cart</span>
              <span className="absolute -top-2 -right-3 w-4 h-4 bg-luxury-gold text-black text-[8px] flex items-center justify-center rounded-full font-bold">2</span>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-[10px] bg-white/5 cursor-pointer hover:bg-white/10 transition-all overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      user.displayName?.substring(0, 2).toUpperCase() || 'AD'
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 bg-luxury-obsidian border-white/10 text-white">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium">{user.displayName}</p>
                    <p className="text-xs text-white/40 truncate">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer focus:bg-white/5 focus:text-luxury-gold">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Atelier</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-400 focus:bg-red-500/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span 
                className="hover:text-white transition-colors cursor-pointer" 
                onClick={signInWithGoogle}
              >
                Sign In
              </span>
            )}
            
            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger>
                  <Menu size={20} className="text-luxury-ivory cursor-pointer" />
                </SheetTrigger>
                <SheetContent side="right" className="bg-luxury-deep border-luxury-border text-luxury-ivory">
                   <div className="flex flex-col space-y-12 mt-20 px-8">
                      <Link to="/catalog" className="text-4xl font-serif italic tracking-tight">Collections</Link>
                      <Link to="/catalog?category=shoes" className="text-4xl font-serif italic tracking-tight">Atelier</Link>
                      <Link to="/catalog?category=bags" className="text-4xl font-serif italic tracking-tight">Archives</Link>
                      <div className="pt-12 border-t border-white/10">
                        {user ? (
                          <div className="text-xs uppercase tracking-widest text-red-400" onClick={() => logout()}>Leave Session</div>
                        ) : (
                          <div className="text-xs uppercase tracking-widest text-luxury-gold" onClick={signInWithGoogle}>Start Session</div>
                        )}
                      </div>
                   </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex flex-col">
        <Outlet />
      </main>

      {/* Bottom Gallery Style Footer */}
      <footer className="h-48 border-t border-luxury-border flex">
        <div className="w-[33.33%] border-r border-luxury-border p-8 flex flex-col justify-between group cursor-pointer hover:bg-white/5 transition-colors">
          <div className="text-[9px] uppercase tracking-[0.3em] text-white/40 group-hover:text-luxury-gold transition-colors">01. Accessories</div>
          <div className="text-lg tracking-widest font-serif opacity-80 italic">Sculpted Eyewear</div>
        </div>
        <div className="w-[33.33%] border-r border-luxury-border p-8 flex flex-col justify-between bg-white/5 group cursor-pointer hover:bg-white/10 transition-colors">
          <div className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold">02. Footwear</div>
          <div className="text-lg tracking-widest font-serif italic">Monolith Chelsea Boot</div>
        </div>
        <div className="w-[33.33%] p-8 flex flex-col justify-between group cursor-pointer hover:bg-white/5 transition-colors">
          <div className="text-[9px] uppercase tracking-[0.3em] text-white/40 group-hover:text-luxury-gold transition-colors">03. Handpacks</div>
          <div className="text-lg tracking-widest font-serif opacity-80 italic">Modular Briefcase</div>
        </div>
      </footer>
      
      <div className="bg-luxury-deep border-t border-luxury-border py-8 px-12 flex justify-between items-center text-[8px] uppercase tracking-[0.4em] text-white/20">
        <div>© 2026 VÉRO Atelier Europe</div>
        <div className="flex gap-12">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Legal</span>
          <span className="hover:text-white cursor-pointer transition-colors">Traceability</span>
        </div>
      </div>
    </div>
  );
};

export default Layout;
