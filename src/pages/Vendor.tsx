import React, { useState } from 'react';
import { useAppData } from '../lib/DataProvider';
import { ProductCard } from '../components/product/ProductCard';

export function Vendor({ vendor, setRoute, setActiveProduct, isMobile, isTablet }: any) {
  const { VENDORS, PRODUCTS } = useAppData();
  const v = vendor || VENDORS[0];
  const products = PRODUCTS.filter((p: any) => p.vendor === v.name);
  const [following, setFollowing] = useState(false);

  const isStackedWidth = isMobile || isTablet;

  return (
    <div className="page" style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{ padding: isStackedWidth ? '40px 20px 60px' : '80px 32px 120px', borderBottom: '1px solid var(--hairline)' }}>
        <div className="mono-label muted" style={{ marginBottom: 32 }}>
          <span onClick={() => setRoute('home')} style={{cursor: 'pointer'}}>Home</span> / <span onClick={() => { setRoute('vendor'); }} style={{cursor: 'pointer'}}>Vendors</span> / <span style={{ color: 'var(--black)' }}>{v.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isStackedWidth ? '1fr' : '1fr auto', gap: 24, alignItems: 'end' }}>
          <div>
            <div className="mono-label" style={{ marginBottom: 24 }}>— Atelier №{String(VENDORS.indexOf(v) + 1).padStart(2, '0')}</div>
            <h1 className="fz-headline" style={{ fontSize: isStackedWidth ? 64 : 'clamp(120px, 16vw, 240px)' }}>
              {v.name}<span className="it">.</span>
            </h1>
            <div className="mono-md" style={{ marginTop: 24, maxWidth: 520 }}>{v.tagline} — {products.length} pieces in the permanent catalogue.</div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexDirection: isStackedWidth ? 'row' : 'column', alignItems: 'flex-start' }}>
            <button className={`fz-pill ghost ${following ? 'active' : ''}`} style={following ? { background: 'var(--black)', color: 'var(--cream)' } : {}} onClick={() => setFollowing(!following)}>
              {following ? '✓ Following' : '+ Follow'}
            </button>
            <button className="fz-pill ghost">Share</button>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ borderBottom: '1px solid var(--hairline)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isStackedWidth ? '1fr 1fr' : 'repeat(4, 1fr)' }}>
          {[
            ["Founded", v.tagline.match(/\d{4}/)?.[0] || '2019'],
            ["Studio", v.city],
            ["Team", "4 — 8 people"],
            ["On Kiosque since", "Aug 2023"],
          ].map(([k, val], i) => (
            <div key={i} style={{ padding: isStackedWidth ? '24px 20px' : '32px', borderBottom: isStackedWidth && i < 2 ? '1px solid var(--hairline)' : 'none', borderRight: isStackedWidth && i % 2 === 0 ? '1px solid var(--hairline)' : (!isStackedWidth && i < 3 ? '1px solid var(--hairline)' : 'none') }}>
              <div className="mono-label muted" style={{ marginBottom: 12 }}>— {k}</div>
              <div className="display" style={{ fontSize: 40, fontWeight: 800 }}>{val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured image + About */}
      <section style={{ padding: isStackedWidth ? '60px 20px' : '120px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isStackedWidth ? '1fr' : '1fr 1fr', gap: isStackedWidth ? 40 : 80 }}>
          <div className="placeholder has-img" style={{ aspectRatio: '4 / 5' }}>
            <img src={v.hero} alt={v.name} loading="lazy" />
          </div>
          <div>
            <div className="mono-label muted" style={{ marginBottom: 24 }}>— About the atelier</div>
            <h2 className="fz-headline" style={{ fontSize: isStackedWidth ? 48 : 96, marginBottom: 40 }}>
              Founded <span className="it">in</span><br/>{v.city}, {v.tagline.match(/\d{4}/)?.[0] || '2019'}.
            </h2>
            <div className="mono-md" style={{ maxWidth: 520, marginBottom: 24 }}>
              {v.name} was started by makers who trained in traditional craft and reinterpreted it for a contemporary wardrobe. Every object in the catalogue is produced within the atelier, in runs of fewer than 200.
            </div>
            <div className="mono-md" style={{ maxWidth: 520, marginBottom: 40 }}>
              The studio works in natural fibres and dyes sourced across West Africa, with a preference for construction techniques that can be taught rather than machined. They release two capsules per year — one in March, one in October.
            </div>
            <button className="fz-pill ghost">Read the full profile →</button>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section style={{ padding: isStackedWidth ? '40px 0' : '80px 0', borderTop: '1px solid var(--hairline)' }}>
        <div style={{ padding: isStackedWidth ? '0 20px 32px' : '0 32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <div className="mono-label muted">— The catalogue</div>
            <h2 className="fz-headline" style={{ fontSize: isStackedWidth ? 44 : 76, marginTop: 12 }}>The <span className="it">catalogue</span>.</h2>
          </div>
          <div className="mono-sm muted tabular">{products.length} / {products.length}</div>
        </div>
        <div 
          className="responsive-grid" 
          style={{ 
            '--cols-mobile': 2, 
            '--cols-sm': 2, 
            '--cols-lg': 3, 
            '--gap': '0px'
          } as any}
        >
          {products.map((p: any) => (
            <div key={p.id} style={{ borderBottom: '1px solid var(--hairline)', borderRight: '1px solid var(--hairline)', padding: 'clamp(16px, 3vw, 40px)' }}>
              <ProductCard product={p} setRoute={setRoute} setActiveProduct={setActiveProduct} />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

// Vendor index page
export function VendorIndex({ setRoute, setActiveVendor, isMobile, isTablet }: any) {
  const { VENDORS, PRODUCTS } = useAppData();
  const isStackedWidth = isMobile || isTablet;
  return (
    <div className="page" style={{ background: 'var(--cream)' }}>
      <section style={{ padding: isStackedWidth ? '40px 20px 60px' : '80px 32px 120px', borderBottom: '1px solid var(--hairline)' }}>
        <div className="mono-label muted" style={{ marginBottom: 32 }}>— 42 ateliers across Africa</div>
        <h1 className="fz-headline" style={{ fontSize: isStackedWidth ? 64 : 'clamp(120px, 14vw, 220px)' }}>Vendors<span className="it">.</span></h1>
        <div className="mono-md" style={{ marginTop: 24, maxWidth: 560 }}>
          Every piece on Kiosque comes directly from an independent atelier — rooted in Lagos, Abuja, Ibadan, Port Harcourt, Accra, Dakar. We visit each one. We don't drop-ship. We pay them the day an order is placed.
        </div>
      </section>

      <section style={{ borderBottom: '1px solid var(--hairline)' }}>
        {VENDORS.map((v, i) => (
          <div
            key={v.id}
            style={{ display: 'grid', gridTemplateColumns: isStackedWidth ? '1fr' : '80px 2fr 1fr 1fr auto', gap: 24, alignItems: 'center', padding: isStackedWidth ? '32px 20px' : '40px 32px', borderTop: '1px solid var(--hairline)', cursor: 'pointer', transition: 'background 250ms ease-out' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--cream-soft)'}
            onMouseLeave={e => e.currentTarget.style.background = ''}
            onClick={() => { setActiveVendor(v); setRoute('vendor-detail'); window.scrollTo(0,0); }}
          >
            <div className="mono-label muted tabular">№{String(i + 1).padStart(2, '0')}</div>
            <div className="display-900" style={{ fontSize: isStackedWidth ? 32 : 64 }}>{v.name}</div>
            <div className="mono-sm muted">{v.city}</div>
            <div className="mono-sm muted tabular">{PRODUCTS.filter(p => p.vendor === v.name).length} pieces</div>
            <div className="mono-label">→</div>
          </div>
        ))}
      </section>

    </div>
  );
}