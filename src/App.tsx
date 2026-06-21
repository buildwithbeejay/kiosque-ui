import React, { useState, useEffect } from 'react';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Listing } from './pages/Listing';
import { Detail } from './pages/Detail';
import { VendorIndex, Vendor } from './pages/Vendor';
import { JournalIndex, Article } from './pages/Journal';
import { Account } from './pages/Account';
import { Checkout } from './pages/Checkout';
import { fmtNGN } from './lib/formatters';
import { CartDrawer } from './components/layout/CartDrawer';
import { OrderTrack } from './pages/Tracking';
import { Wishlist } from './pages/Wishlist';
import { Components } from './pages/Components';
import { Categories } from './pages/Categories';

import { Auth, loadUser, saveUser } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { useToast } from './lib/ToastContext';

const TWEAKS = {
  startRoute: "home",
  heroVariant: "diptych",
  mobileSim: false,
  palette: "paper"
};

const PALETTES = {
  warm:    { cream: '#FFFFFF', creamSoft: '#f8fafc', hairline: '#D4D0C8', grey: '#8A8478', black: '#000000', label: 'Warm cream' },
  sand:    { cream: '#FFFFFF', creamSoft: '#f8fafc', hairline: '#D4D0C8', grey: '#8A8478', black: '#000000', label: 'Sand'        },
  linen:   { cream: '#FFFFFF', creamSoft: '#f8fafc', hairline: '#DEDACE', grey: '#9A948A', black: '#1A1A18', label: 'Linen'       },
  paper:   { cream: '#FFFFFF', creamSoft: '#f8fafc', hairline: '#E4E0D4', grey: '#A8A398', black: '#0E0E0C', label: 'Paper'       },
  bone:    { cream: '#FFFFFF', creamSoft: '#f8fafc', hairline: '#ECE8DD', grey: '#B2ADA2', black: '#111111', label: 'Bone'        },
  chalk:   { cream: '#FFFFFF', creamSoft: '#f8fafc', hairline: '#D8D7D0', grey: '#98968E', black: '#111111', label: 'Chalk'       },
};

export default function App() {
  const { showToast } = useToast();
  const [route, _setRoute] = useState(() => localStorage.getItem('kiosque.route') || TWEAKS.startRoute || 'home');
  const setRoute = (r: string) => { _setRoute(r); localStorage.setItem('kiosque.route', r); };

  const [activeProduct, setActiveProduct] = useState(null);
  const [activeVendor, setActiveVendor] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [user, setUser] = useState<any>(() => loadUser());
  const [authStep, setAuthStep] = useState<string | null>(null);

  const logout = () => {
    saveUser(null);
    setUser(null);
    setAuthStep('signed-out');
    setRoute('auth');
    showToast({
      title: 'Signed Out',
      description: 'You have been logged out of your session.',
      variant: 'info'
    });
  };
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [viewport, setViewport] = useState(() => {
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  });
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [heroVariant, setHeroVariant] = useState(TWEAKS.heroVariant || 'diptych');
  const [mobileSim, setMobileSim] = useState(!!TWEAKS.mobileSim);
  const [palette, setPalette] = useState(TWEAKS.palette || 'chalk');

  useEffect(() => {
    const p = PALETTES[palette as keyof typeof PALETTES] || PALETTES.paper;
    const root = document.documentElement;
    root.style.setProperty('--cream', p.cream);
    root.style.setProperty('--cream-soft', p.creamSoft);
    root.style.setProperty('--hairline', p.hairline);
    root.style.setProperty('--grey', p.grey);
    root.style.setProperty('--black', p.black);
  }, [palette]);

  const isMobile = mobileSim || viewport === 'mobile';
  const isTablet = !mobileSim && viewport === 'tablet';

  useEffect(() => {
    document.body.classList.toggle('mobile-sim', mobileSim);
    return () => document.body.classList.remove('mobile-sim');
  }, [mobileSim]);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      if (w < 768) setViewport('mobile');
      else if (w < 1024) setViewport('tablet');
      else setViewport('desktop');
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    // For local dev without iframe, we can toggle via some shortcut, but for now we'll just show it if edit_mode is triggered
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const addToCart = (product: any) => {
    setCart([...cart, { ...product, qty: 1 }]);
    setCartOpen(true);
    showToast({
      title: 'Added to Cart',
      description: `"${product.name}" has been added to your order.`,
      variant: 'cart'
    });
  };
  
  const removeFromCart = (idx: number) => {
    const item = cart[idx];
    setCart(c => c.filter((_, i) => i !== idx));
    if (item) {
      showToast({
        title: 'Removed from Cart',
        description: `"${item.name}" has been removed from your bag.`,
        variant: 'info'
      });
    }
  };
  
  const updateQty = (idx: number, qty: number) => {
    setCart(c => c.map((it, i) => i === idx ? { ...it, qty } : it));
  };

  useEffect(() => { window.scrollTo(0, 0); }, [route]);

  const renderRoute = () => {
    switch (route) {
      case 'home':
        return <Home setRoute={setRoute} setActiveProduct={setActiveProduct} setActiveVendor={setActiveVendor} setActiveArticle={setActiveArticle} isMobile={isMobile} isTablet={isTablet} heroVariant={heroVariant} />;
      case 'listing':
        return <Listing setRoute={setRoute} setActiveProduct={setActiveProduct} isMobile={isMobile} isTablet={isTablet} />;
      case 'detail':
        return <Detail product={activeProduct} setRoute={setRoute} setActiveProduct={setActiveProduct} setActiveVendor={setActiveVendor} isMobile={isMobile} isTablet={isTablet} addToCart={addToCart} openCart={() => setCartOpen(true)} />;
      case 'vendor':
        return <VendorIndex setRoute={setRoute} setActiveVendor={setActiveVendor} isMobile={isMobile} isTablet={isTablet} />;
      case 'vendor-detail':
        return <Vendor vendor={activeVendor} setRoute={setRoute} setActiveProduct={setActiveProduct} isMobile={isMobile} isTablet={isTablet} />;
      case 'journal':
        return <JournalIndex setRoute={setRoute} setActiveArticle={setActiveArticle} isMobile={isMobile} isTablet={isTablet} />;
      case 'article':
        return <Article article={activeArticle} setRoute={setRoute} setActiveArticle={setActiveArticle} isMobile={isMobile} isTablet={isTablet} />;
      case 'account':
        return <Account isMobile={isMobile} setRoute={setRoute} setActiveProduct={setActiveProduct} setActiveVendor={setActiveVendor} setActiveOrder={setActiveOrder} user={user} logout={logout} />;
      case 'checkout':
        return <Checkout cart={cart} removeFromCart={removeFromCart} updateQty={updateQty} isMobile={isMobile} isTablet={isTablet} user={user} setRoute={setRoute} clearCart={() => setCart([])} />;
      case 'track':
        return <OrderTrack setRoute={setRoute} setActiveProduct={setActiveProduct} isMobile={isMobile} order={activeOrder} />;
      case 'wishlist':
        return <Wishlist setRoute={setRoute} setActiveProduct={setActiveProduct} isMobile={isMobile} owner={{ name: user?.name?.split(' ')[0] || 'Member', handle: user?.email?.split('@')[0] || 'member', joined: 'Nov 14 ' }} />;
      case 'dashboard':
        return <Dashboard isMobile={isMobile} setRoute={setRoute} />;
      case 'categories':
        return <Categories setRoute={setRoute} isMobile={isMobile} isTablet={isTablet} />;
      case 'auth':
        return <Auth isMobile={isMobile} setRoute={setRoute} setUser={setUser} initialStep={authStep} />;
      case 'components':
        return <Components isMobile={isMobile} />;
      default:
        return <div className="page"><div style={{padding: 100, textAlign: 'center'}} className="fz-headline">Coming soon: {route}</div></div>;
    }
  };

  return (
    <div className="app-root" key={viewport}>
      <Nav route={route} setRoute={(r: string) => { if (r === 'vendor') setActiveVendor(null); setRoute(r); }} cartCount={cart.length} openCart={() => setCartOpen(true)} isMobile={isMobile} user={user} />
      {renderRoute()}
      {route === 'home' && <Footer setRoute={setRoute} />}
      <CartDrawer open={cartOpen} close={() => setCartOpen(false)} cart={cart} removeFromCart={removeFromCart} updateQty={updateQty} setRoute={setRoute} />
      {tweaksOpen && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: 'var(--cream)', border: '1px solid var(--black)', padding: 20, width: 280, zIndex: 1000, fontFamily: 'var(--mono)', fontSize: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, borderBottom: '1px solid var(--hairline)', paddingBottom: 10 }}>
            <b>Tweaks</b>
            <span style={{ cursor: 'pointer' }} onClick={() => { setTweaksOpen(false); window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); }}>×</span>
          </div>
          <div style={{ marginBottom: 12 }}>Hero variant</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {['diptych','oversized','rolodex','gridded','shelf','fullbleed'].map(v => (
              <button key={v} onClick={() => setHeroVariant(v)} style={{ padding: '8px 10px', border: '1px solid var(--black)', background: heroVariant === v ? 'var(--black)' : 'transparent', color: heroVariant === v ? 'var(--cream)' : 'var(--black)', fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase', cursor: 'pointer' }}>{v}</button>
            ))}
          </div>
          <div style={{ marginTop: 16, marginBottom: 8 }}>Palette</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {Object.entries(PALETTES).map(([k, p]) => (
              <button key={k} onClick={() => setPalette(k)} style={{ padding: '8px 10px', border: '1px solid var(--black)', background: palette === k ? 'var(--black)' : p.cream, color: palette === k ? p.cream : 'var(--black)', fontFamily: 'var(--mono)', fontSize: 10, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{p.label}</span>
                <span style={{ width: 10, height: 10, background: p.cream, border: `1px solid ${palette === k ? p.cream : 'var(--hairline)'}`, display: 'inline-block' }} />
              </button>
            ))}
          </div>
          <div style={{ marginTop: 16, marginBottom: 8 }}>Start route</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {['home','listing','detail','vendor','journal','account','dashboard','auth','checkout','track','wishlist','components'].map(r => (
              <button key={r} onClick={() => setRoute(r)} style={{ padding: '8px 10px', border: '1px solid var(--black)', background: route === r ? 'var(--black)' : 'transparent', color: route === r ? 'var(--cream)' : 'var(--black)', fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase', cursor: 'pointer' }}>{r}</button>
            ))}
          </div>
          <div style={{ marginTop: 16, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Mobile sim</span>
            <button onClick={() => setMobileSim(v => !v)} style={{ padding: '6px 12px', border: '1px solid var(--black)', background: mobileSim ? 'var(--black)' : 'transparent', color: mobileSim ? 'var(--cream)' : 'var(--black)', fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase', cursor: 'pointer' }}>{mobileSim ? 'ON' : 'OFF'}</button>
          </div>
          <div style={{ fontSize: 10, color: 'var(--grey)', marginTop: 6 }}>Renders the app inside a 390px phone frame.</div>
        </div>
      )}
    </div>
  );
}
