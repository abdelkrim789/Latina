import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Globe } from 'lucide-react';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import CustomCursor from './CustomCursor';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  // Cart count from localStorage
  useEffect(() => {
    const updateCart = () => {
      const items = JSON.parse(localStorage.getItem('latina_cart') || '[]');
      setCartCount(items.reduce((acc: number, i: any) => acc + i.quantity, 0));
    };
    updateCart();
    window.addEventListener('storage', updateCart);
    return () => window.removeEventListener('storage', updateCart);
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setLangMenuOpen(false);
  }, [location]);

  // Menu animation
  useEffect(() => {
    if (!menuRef.current) return;
    if (menuOpen) {
      gsap.fromTo(menuRef.current,
        { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
        { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 0.7, ease: 'power4.inOut' }
      );
      gsap.fromTo(menuRef.current.querySelectorAll('.menu-link'),
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out', delay: 0.3 }
      );
    } else {
      gsap.to(menuRef.current,
        { clipPath: 'inset(0 0 100% 0)', opacity: 0, duration: 0.5, ease: 'power4.inOut' }
      );
    }
  }, [menuOpen]);

  const navLinks = [
    { label: t('nav.collections'), href: '/catalog' },
    { label: t('nav.shoes'), href: '/catalog?category=shoes' },
    { label: t('nav.handbags'), href: '/catalog?category=handbags' },
    { label: t('nav.accessories'), href: '/catalog?category=accessories' },
  ];

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--latina-bg)', color: 'var(--latina-text)' }} className="min-h-screen transition-colors duration-300">
      <CustomCursor />

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'backdrop-blur-xl' : ''
        }`}
        style={{
          backgroundColor: scrolled ? 'rgba(var(--latina-bg-rgb, 10, 10, 10), 0.95)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--latina-border)' : 'none'
        }}
      >
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-serif tracking-[0.25em] uppercase italic transition-colors duration-300"
            style={{ color: 'var(--latina-text)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--latina-accent)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--latina-text)'}
          >
            LATINA
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-[10px] uppercase tracking-[0.35em] transition-colors duration-300 relative group"
                style={{ color: 'var(--latina-text-muted)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--latina-text)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--latina-text-muted)'}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300" style={{ backgroundColor: 'var(--latina-accent)' }} />
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 transition-colors duration-300 hover:opacity-70"
              aria-label="Toggle theme"
              style={{ color: 'var(--latina-text-muted)' }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] transition-colors duration-300"
                style={{ color: 'var(--latina-text-muted)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--latina-text)'}
                onMouseLeave={(e) => !langMenuOpen && (e.currentTarget.style.color = 'var(--latina-text-muted)')}
              >
                <Globe size={14} />
                {language.toUpperCase()}
              </button>
              
              {langMenuOpen && (
                <div 
                  className="absolute top-full right-0 mt-4 py-2 min-w-[160px] shadow-2xl"
                  style={{ backgroundColor: 'var(--latina-card-bg)', border: '1px solid var(--latina-border)' }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setLangMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors duration-200"
                      style={{
                        color: language === lang.code ? 'var(--latina-accent)' : 'var(--latina-text)',
                        backgroundColor: language === lang.code ? 'var(--latina-border)' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (language !== lang.code) {
                          e.currentTarget.style.backgroundColor = 'var(--latina-border)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (language !== lang.code) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="relative text-[10px] uppercase tracking-[0.35em] transition-colors duration-300"
              style={{ color: 'var(--latina-text-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--latina-text)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--latina-text-muted)'}
            >
              {t('nav.bag')}
              {cartCount > 0 && (
                <span 
                  className="absolute -top-2 -right-3 w-4 h-4 text-[8px] flex items-center justify-center rounded-full font-bold"
                  style={{ backgroundColor: 'var(--latina-accent)', color: theme === 'dark' ? '#0A0A0A' : '#FAFAF9' }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col gap-[5px] group"
              aria-label="Menu"
            >
              <span 
                className={`block h-px w-6 transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}
                style={{ backgroundColor: 'var(--latina-text)' }}
              />
              <span 
                className={`block h-px transition-all duration-300 ${menuOpen ? 'w-0 opacity-0' : 'w-4'}`}
                style={{ backgroundColor: 'var(--latina-text)' }}
              />
              <span 
                className={`block h-px w-6 transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}
                style={{ backgroundColor: 'var(--latina-text)' }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── FULLSCREEN MENU ─────────────────────────────────── */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 flex flex-col justify-center px-8 md:px-24"
        style={{ clipPath: 'inset(0 0 100% 0)', opacity: 0, backgroundColor: 'var(--latina-bg)' }}
      >
        <div className="max-w-2xl">
          {navLinks.map((link, i) => (
            <div key={link.href} className="menu-link overflow-hidden py-6" style={{ borderBottom: '1px solid var(--latina-border)' }}>
              <Link
                to={link.href}
                className="group flex items-center justify-between"
              >
                <span 
                  className="text-[clamp(2.5rem,7vw,6rem)] font-serif italic tracking-tight transition-colors duration-300"
                  style={{ color: 'var(--latina-text)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--latina-accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--latina-text)'}
                >
                  {link.label}
                </span>
                <span 
                  className="text-[10px] uppercase tracking-[0.4em] transition-colors"
                  style={{ color: 'var(--latina-text-muted)' }}
                >
                  0{i + 1}
                </span>
              </Link>
            </div>
          ))}
        </div>

        <div 
          className="absolute bottom-12 left-8 md:left-24 flex items-center gap-8 text-[10px] uppercase tracking-[0.4em]"
          style={{ color: 'var(--latina-text-muted)' }}
        >
          <span>Florence, Italy</span>
          <span>·</span>
          <span>Since 2018</span>
        </div>
      </div>

      {/* ── PAGE CONTENT ────────────────────────────────────── */}
      <main>
        <Outlet />
      </main>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--latina-border)', backgroundColor: 'var(--latina-bg)' }}>
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2">
              <div className="text-3xl font-serif italic tracking-[0.2em] mb-6" style={{ color: 'var(--latina-accent)' }}>LATINA</div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--latina-text-muted)' }}>
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.5em] mb-6" style={{ color: 'var(--latina-text-muted)' }}>{t('footer.collections')}</h4>
              <ul className="space-y-3">
                {[t('nav.shoes'), t('nav.handbags'), t('nav.accessories'), t('footer.newArrivals')].map(item => (
                  <li key={item}>
                    <Link 
                      to="/catalog" 
                      className="text-sm transition-colors duration-300"
                      style={{ color: 'var(--latina-text-muted)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--latina-text)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--latina-text-muted)'}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.5em] mb-6" style={{ color: 'var(--latina-text-muted)' }}>{t('footer.atelier')}</h4>
              <ul className="space-y-3">
                {[t('footer.ourStory'), t('footer.craftsmanship'), t('footer.sustainability'), t('footer.contact')].map(item => (
                  <li key={item}>
                    <span 
                      className="text-sm transition-colors duration-300 cursor-pointer"
                      style={{ color: 'var(--latina-text-muted)' }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--latina-text)'}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--latina-text-muted)'}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid var(--latina-border)' }}>
            <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: 'var(--latina-text-muted)' }}>
              {t('footer.copyright')}
            </p>
            <div className="flex gap-8 text-[10px] uppercase tracking-[0.4em]" style={{ color: 'var(--latina-text-muted)' }}>
              {[t('footer.privacy'), t('footer.terms'), t('footer.cookies')].map(item => (
                <span 
                  key={item}
                  className="cursor-pointer transition-colors"
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--latina-text)'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--latina-text-muted)'}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
