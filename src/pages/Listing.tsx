import React, { useState } from 'react';
import { useAppData } from '../lib/DataProvider';
import { ProductCard } from '../components/product/ProductCard';

export function Listing({ setRoute, setActiveProduct, isMobile, isTablet }: any) {
  const { FILTERS, PRODUCTS } = useAppData();
  const [activeFilters, setActiveFilters] = useState(() => {
    const savedCat = sessionStorage.getItem('kiosque.filterCategory') || 'All';
    sessionStorage.removeItem('kiosque.filterCategory');
    return {
      Category: savedCat,
      Vendor: "All",
      Price: "All",
      Size: "All",
    };
  });
  const [sort, setSort] = useState("Featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [view, setView] = useState("grid"); // grid | dense

  const sortOptions = ["Featured", "Newest", "Price — low", "Price — high", "Alphabetical"];

  let filtered = PRODUCTS;
  if (activeFilters.Category !== "All") filtered = filtered.filter((p: any) => p.cat === activeFilters.Category);
  if (activeFilters.Vendor !== "All") filtered = filtered.filter((p: any) => p.vendor === activeFilters.Vendor);
  if (activeFilters.Price !== "All") {
    if (activeFilters.Price === "Under 300") filtered = filtered.filter((p: any) => p.price < 300);
    if (activeFilters.Price === "300 — 500") filtered = filtered.filter((p: any) => p.price >= 300 && p.price <= 500);
    if (activeFilters.Price === "500 — 800") filtered = filtered.filter((p: any) => p.price > 500 && p.price <= 800);
    if (activeFilters.Price === "800+") filtered = filtered.filter((p: any) => p.price > 800);
  }

  if (sort === "Price — low") filtered = [...filtered].sort((a: any, b: any) => a.price - b.price);
  if (sort === "Price — high") filtered = [...filtered].sort((a: any, b: any) => b.price - a.price);
  if (sort === "Alphabetical") filtered = [...filtered].sort((a: any, b: any) => a.name.localeCompare(b.name));

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const isStackedWidth = isMobile || isTablet;

  return (
    <div className="page">
      {/* Top bar */}
      <section style={{ padding: isStackedWidth ? '96px 20px 40px' : '120px 32px 56px', borderBottom: '1px solid var(--hairline)' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          <span className="sticker out" onClick={() => setRoute('home')} style={{ cursor: 'pointer' }}>Home</span>
          <span className="sticker lime">Shop · all pieces</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <h1 className="fz-headline" style={{ fontSize: isStackedWidth ? 72 : 'clamp(88px, 11vw, 168px)' }}>
            The <span className="it">edit</span>.
          </h1>
          <div className="mono-sm muted tabular" style={{ textAlign: 'right' }}>
            {filtered.length} of {PRODUCTS.length} pieces<br/>
            across {new Set(filtered.map((p: any) => p.vendor)).size} ateliers
          </div>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: isStackedWidth ? '1fr' : '240px 1fr', minHeight: '80vh' }}>
        {/* Left rail — filters */}
        {!isStackedWidth && (
          <aside style={{ padding: '48px 32px', borderRight: '1px solid var(--hairline)', position: 'sticky', top: 68, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 68px)', overflowY: 'auto' }}>
            {Object.keys(FILTERS).map((group: any) => (
              <div key={group} style={{ marginBottom: 40 }}>
                <div className="mono-label muted" style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--hairline)' }}>— {group}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(FILTERS as any)[group].map((opt: any) => {
                    const active = (activeFilters as any)[group] === opt;
                    return (
                      <span
                        key={opt}
                        className="mono-sm"
                        style={{ cursor: 'pointer', fontWeight: active ? 700 : 400, color: active ? 'var(--black)' : 'var(--grey)', transition: 'color 250ms ease-out' }}
                        onClick={() => setActiveFilters(f => ({ ...f, [group]: opt }))}
                      >
                        {active && '→ '}{opt}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 24, marginTop: 24 }}>
              <button className="mono-label" style={{ color: 'var(--grey)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setActiveFilters({ Category: "All", Vendor: "All", Price: "All", Size: "All" })}>× Clear all filters</button>
            </div>
          </aside>
        )}

        {/* Grid area */}
        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isStackedWidth ? '20px' : '24px 32px', borderBottom: '1px solid var(--hairline)' }}>
            {isStackedWidth ? (
              <button className="fz-pill ghost" onClick={() => setMobileFiltersOpen(true)}>Filters</button>
            ) : (
              <div className="mono-sm muted">
                Displaying {filtered.length} pieces
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <button
                className="mono-label"
                onClick={() => setSortOpen(!sortOpen)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Sort: {sort} <span style={{ fontSize: 8 }}>▼</span>
              </button>
              {sortOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, background: 'var(--cream)', border: '1px solid var(--black)', padding: 16, minWidth: 200, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sortOptions.map(o => (
                    <span key={o} className="mono-sm" style={{ cursor: 'pointer', fontWeight: sort === o ? 700 : 400 }} onClick={() => { setSort(o); setSortOpen(false); }}>
                      {sort === o ? '→ ' : '  '}{o}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grid */}
          <div 
            className="responsive-grid" 
            style={{ 
              '--cols-mobile': 2, 
              '--cols-sm': 2, 
              '--cols-lg': 3, 
              '--cols-xl': 4,
              '--gap': '0px'
            } as any}
          >
            {filtered.map((p: any) => (
              <div key={p.id} style={{ borderBottom: '1px solid var(--hairline)', borderRight: '1px solid var(--hairline)', padding: 'clamp(16px, 3vw, 32px)' }}>
                <ProductCard product={p} setRoute={setRoute} setActiveProduct={setActiveProduct} />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: 120, textAlign: 'center' }}>
              <div className="display" style={{ fontSize: 48, fontWeight: 800 }}>Nothing matches.</div>
              <div className="mono-sm muted" style={{ marginTop: 16 }}>Try loosening a filter.</div>
            </div>
          )}

          <div style={{ padding: '80px 32px', display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--hairline)' }}>
            <button className="fz-pill ghost">Load 12 more →</button>
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {isStackedWidth && mobileFiltersOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--cream)', zIndex: 150, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid var(--hairline)' }}>
            <div className="mono-label">Filters</div>
            <span className="mono-label" style={{ cursor: 'pointer' }} onClick={() => setMobileFiltersOpen(false)}>× Close</span>
          </div>
          <div style={{ padding: 20 }}>
            {Object.keys(FILTERS).map((group: any) => (
              <div key={group} style={{ marginBottom: 32 }}>
                <div className="mono-label muted" style={{ marginBottom: 12 }}>— {group}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {(FILTERS as any)[group].map((opt: any) => {
                    const active = (activeFilters as any)[group] === opt;
                    return (
                      <button key={opt} className={`fz-pill ${active ? 'active' : 'ghost'}`} onClick={() => setActiveFilters(f => ({ ...f, [group]: opt }))}>{opt}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: 20 }}>
            <button className="fz-pill lime" style={{ width: '100%', justifyContent: 'space-between' }} onClick={() => setMobileFiltersOpen(false)}>
              <span>Show {filtered.length} pieces</span><span>→</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
