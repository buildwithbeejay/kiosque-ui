import React, { useState } from 'react';
import { useAppData } from '../../lib/DataProvider';

export function Nav({ route, setRoute, cartCount, openCart, isMobile, user }: any) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { syncStatus } = useAppData() || { syncStatus: 'Synced' };

  const links = [
    { id: "listing", label: "Shop" },
    { id: "vendor",  label: "Vendors" },
    { id: "journal", label: "Journal" },
    { id: "dashboard", label: "Seller Portal" },
    { id: "track", label: "Tracking" },
    { id: "wishlist", label: "Wishlist" },
  ];

  const handleNav = (r: string) => {
    setRoute(r);
    setMenuOpen(false);
  };

  const renderSyncIndicator = () => {
    let dotColor = '#12B76A'; // success green
    let textColor = 'var(--grey-ink)';
    let bg = 'rgba(18, 183, 106, 0.08)';

    if (syncStatus === 'Syncing...') {
      dotColor = '#F79009'; // warm amber
      bg = 'rgba(247, 144, 9, 0.08)';
    } else if (syncStatus === 'Offline') {
      dotColor = '#F04438'; // ruby red
      bg = 'rgba(240, 68, 56, 0.08)';
    }

    return (
      <div 
        id="sync-status-indicator"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 8px',
          borderRadius: '999px',
          background: bg,
          fontSize: '10px',
          fontWeight: 650,
          fontFamily: 'var(--mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: textColor,
          transition: 'all 0.3s ease',
          margin: '0 4px',
          height: '24px',
          alignSelf: 'center',
          userSelect: 'none'
        }}
        title={`Backend status: ${syncStatus}`}
      >
        <span 
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: dotColor,
            display: 'inline-block',
            animation: syncStatus === 'Syncing...' ? 'blinker 1.5s linear infinite' : 'none'
          }}
        />
        <span className="hidden-xs" style={{ fontSize: '9px' }}>{syncStatus}</span>
      </div>
    );
  };

  if (isMobile) {
    return (
      <>
        <nav className="fz-nav" style={{ top: 12, padding: 4, gap: 2, alignItems: 'center' }}>
          <span className="fz-nav-wordmark" style={{ fontSize: 16, padding: '0 10px 0 12px', height: 36, display: 'flex', alignItems: 'center' }} onClick={() => handleNav('home')}>Kiosque.</span>
          {renderSyncIndicator()}
          <span className="fz-nav-item" style={{ padding: '8px 12px' }} onClick={() => setRoute(user ? 'account' : 'auth')}>{user ? 'Account' : 'Auth'}</span>
          <span className="fz-nav-item" style={{ padding: '8px 12px' }} onClick={() => setMenuOpen(true)}>Menu</span>
          <span className="fz-nav-cart" style={{ padding: '8px 12px' }} onClick={openCart}>Bag {cartCount}</span>
        </nav>

        {menuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <span className="fz-nav-wordmark" style={{ borderRight: 'none', fontSize: 24 }} onClick={() => handleNav('home')}>Kiosque.</span>
              <button onClick={() => setMenuOpen(false)} className="mono-label" style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                Close <span style={{ fontSize: 'var(--icon-sm)' }}>×</span>
              </button>
            </div>
            <div className="mobile-menu-links">
              {links.map(l => (
                <div key={l.id} className="mobile-menu-link" onClick={() => handleNav(l.id)} style={{ color: route === l.id ? 'var(--coral)' : 'var(--ink)' }}>
                  {l.label}
                </div>
              ))}
              <div className="mobile-menu-link" onClick={() => handleNav(user ? 'account' : 'auth')} style={{ marginTop: 24, fontSize: 28, opacity: 0.8 }}>
                {user ? 'Account' : 'Auth'}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <nav className="fz-nav" style={{ alignItems: 'center' }}>
      <span className="fz-nav-wordmark" onClick={() => setRoute('home')}>Kiosque.</span>
      {renderSyncIndicator()}
      {links.map((l, i) => (
        <span key={i} className={`fz-nav-item ${route === l.id ? 'active' : ''}`} onClick={() => setRoute(l.id)}>{l.label}</span>
      ))}
      <span className="fz-nav-item" onClick={() => setRoute(user ? 'account' : 'auth')}>{user ? 'Account' : 'Auth'}</span>
      <span className="fz-nav-cart" onClick={openCart}>Bag ({cartCount})</span>
    </nav>
  );
}
