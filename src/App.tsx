import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import IntroExperience from './components/IntroExperience';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Landing from './pages/Landing';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Check if user has seen intro before (skip on admin routes)
    const hasSeenIntro = sessionStorage.getItem('latina_intro_seen');
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    
    if (hasSeenIntro || isAdminRoute) {
      setShowIntro(false);
      setIntroComplete(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('latina_intro_seen', 'true');
    setIntroComplete(true);
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        {showIntro && !introComplete && <IntroExperience onComplete={handleIntroComplete} />}
        
        <Router>
          <Routes>
            {/* Store */}
            <Route element={<Layout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
          </Routes>

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--latina-card-bg)',
                border: '1px solid var(--latina-border)',
                color: 'var(--latina-text)',
                borderRadius: '0',
                fontSize: '11px',
                letterSpacing: '0.05em',
              },
            }}
          />
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}
