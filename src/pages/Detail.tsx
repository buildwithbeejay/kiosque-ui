import React, { useState, useEffect, useRef } from 'react';
import { ProductCard } from '../components/product/ProductCard';
import { fmtNGN, fmtUSD } from '../lib/formatters';
import { useAppData } from '../lib/DataProvider';
import { useToast } from '../lib/ToastContext';
import { apiToggleSave } from '../lib/api';

// ────────────────────────────────────────────────────────────────
// Zoomable image — drag to pan, scroll to zoom, click to reset
// ────────────────────────────────────────────────────────────────
function ZoomImage({ src, alt, onClose, idx, total, onPrev, onNext }: any) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<any>(null);
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  useEffect(() => { setScale(1); setPan({ x: 0, y: 0 }); }, [src]);

  useEffect(() => {
    const onKey = (e: any) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === '+' || e.key === '=') setScale((s) => Math.min(4, s + 0.4));
      if (e.key === '-') setScale((s) => Math.max(1, s - 0.4));
      if (e.key === '0') { setScale(1); setPan({ x: 0, y: 0 }); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  const onWheel = (e: any) => {
    e.preventDefault();
    const dir = e.deltaY > 0 ? -0.18 : 0.18;
    setScale((s) => Math.max(1, Math.min(4, s + dir)));
  };

  const onDown = (e: any) => {
    if (scale <= 1) return;
    dragging.current = true;
    const pt = e.touches ? e.touches[0] : e;
    start.current = { x: pt.clientX, y: pt.clientY, panX: pan.x, panY: pan.y };
  };
  const onMove = (e: any) => {
    if (!dragging.current) return;
    const pt = e.touches ? e.touches[0] : e;
    setPan({ x: start.current.panX + (pt.clientX - start.current.x), y: start.current.panY + (pt.clientY - start.current.y) });
  };
  const onUp = () => { dragging.current = false; };

  const reset = () => { setScale(1); setPan({ x: 0, y: 0 }); };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(14,14,12,0.96)',
      display: 'flex', flexDirection: 'column',
      animation: 'fadeIn 240ms ease',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: 'clamp(14px, 2.4vw, 22px) clamp(16px, 3vw, 28px)',
        color: 'var(--cream)',
        borderBottom: '1px solid rgba(253,252,248,0.1)',
        flexShrink: 0,
      }}>
        <div className="mono-label" style={{ fontSize: 11, opacity: 0.85 }}>
          <span className="tabular">{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <span style={{ margin: '0 12px', opacity: 0.5 }}>·</span>
          <span style={{ fontSize: 10, opacity: 0.6 }} className="tabular">{Math.round(scale * 100)}%</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setScale((s) => Math.max(1, s - 0.4))}
            style={{ width: 38, height: 38, borderRadius: 999, background: 'rgba(253,252,248,0.08)', border: '1px solid rgba(253,252,248,0.15)', color: 'var(--cream)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>−</button>
          <button onClick={reset}
            style={{ padding: '0 16px', height: 38, borderRadius: 999, background: 'rgba(253,252,248,0.08)', border: '1px solid rgba(253,252,248,0.15)', color: 'var(--cream)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Reset</button>
          <button onClick={() => setScale((s) => Math.min(4, s + 0.4))}
            style={{ width: 38, height: 38, borderRadius: 999, background: 'rgba(253,252,248,0.08)', border: '1px solid rgba(253,252,248,0.15)', color: 'var(--cream)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>+</button>
          <button onClick={onClose}
            style={{ padding: '0 18px', height: 38, borderRadius: 999, background: 'var(--cream)', border: 'none', color: 'var(--ink)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Close ×</button>
        </div>
      </div>

      {/* Image area */}
      <div ref={dragRef}
        onWheel={onWheel}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
        style={{
          flex: 1, overflow: 'hidden', position: 'relative',
          cursor: scale > 1 ? (dragging.current ? 'grabbing' : 'grab') : 'zoom-in',
          touchAction: 'none',
        }}
        onClick={() => scale === 1 && setScale(2)}
      >
        <img src={src} alt={alt}
          draggable={false}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            maxWidth: '90vw', maxHeight: '80vh',
            transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center',
            transition: dragging.current ? 'none' : 'transform 260ms cubic-bezier(0.22, 0.61, 0.36, 1)',
            userSelect: 'none', pointerEvents: 'none',
          }}
        />

        {/* Side arrows */}
        {total > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); onPrev(); }}
              style={{ position: 'absolute', left: 'clamp(10px, 2vw, 24px)', top: '50%', transform: 'translateY(-50%)', width: 'clamp(40px, 5vw, 52px)', height: 'clamp(40px, 5vw, 52px)', borderRadius: 999, background: 'rgba(253,252,248,0.1)', border: '1px solid rgba(253,252,248,0.2)', color: 'var(--cream)', cursor: 'pointer', fontSize: 20, lineHeight: 1, backdropFilter: 'blur(8px)' }}>←</button>
            <button onClick={(e) => { e.stopPropagation(); onNext(); }}
              style={{ position: 'absolute', right: 'clamp(10px, 2vw, 24px)', top: '50%', transform: 'translateY(-50%)', width: 'clamp(40px, 5vw, 52px)', height: 'clamp(40px, 5vw, 52px)', borderRadius: 999, background: 'rgba(253,252,248,0.1)', border: '1px solid rgba(253,252,248,0.2)', color: 'var(--cream)', cursor: 'pointer', fontSize: 20, lineHeight: 1, backdropFilter: 'blur(8px)' }}>→</button>
          </>
        )}
      </div>

      {/* Hint */}
      <div style={{ padding: '14px 20px', textAlign: 'center', color: 'rgba(253,252,248,0.5)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}>
        Scroll · pinch · drag · arrow keys
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Main detail page
// ────────────────────────────────────────────────────────────────
export function Detail({ product, setRoute, setActiveVendor, addToCart, openCart, isMobile, isTablet, setActiveProduct }: any) {
  const { PRODUCTS, SIZES, VENDORS, SAVED, setSaved: setGlobalSaved } = useAppData();
  const { showToast } = useToast();
  const p = product || PRODUCTS[0];
  const [size, setSize] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>("details");
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(() => SAVED ? SAVED.includes(p.id) : false);
  const [activeImg, setActiveImg] = useState(0);
  const [zoom, setZoom] = useState(false);

  // Gallery images — 4 angles per product (alternating for variety)
  const gallery = [p.img, p.alt || p.img, p.img, p.alt || p.img];

  const vendor = VENDORS.find((v) => v.name === p.vendor);
  const related = PRODUCTS.filter((x) => x.vendor === p.vendor && x.id !== p.id).slice(0, 3);

  const rows = [
    { id: "details", label: "Details", content: "Cut from mid-weight cloth, hand-finished at the atelier. Natural-tone buttons, unlined through the body, French-seamed. Produced in a run of 180." },
    { id: "composition", label: "Composition", content: "Outer: 100% cotton, woven and dyed in-country. Trim: horn buttons. Thread: cotton. Unlined. Hand-wash cold, line dry in shade." },
    { id: "sizing", label: "Sizing", content: "Model is 178cm / 5'10\" wearing size S. Runs true to size; size down if between sizes. Full measurements in the size guide." },
    { id: "shipping", label: "Shipping & returns", content: "Dispatched within 2 business days from the atelier in Lagos. Free delivery across Nigeria on orders over ₦150,000. Ships to the US, UK and EU for the diaspora — rates calculated at checkout. Returns accepted within 14 days, in original condition." },
    { id: "vendor", label: "About the vendor", content: `${p.vendor} is an independent atelier based in ${vendor?.city || 'Lagos'}. Founded to produce objects that outlast their owners, using materials sourced and finished within the continent.` },
  ];

  const onAdd = () => {
    if (!size) { setSize('S'); return; }
    addToCart({ ...p, size, qty });
    openCart();
  };

  return (
    <div className="page" style={{ background: 'var(--cream)' }}>
      {/* Breadcrumb */}
      <div style={{ padding: 'clamp(14px, 2.2vw, 24px) clamp(16px, 3vw, 32px)', borderBottom: '1px solid var(--hairline)' }}>
        <div className="mono-label muted" style={{ fontSize: 10, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <span onClick={() => setRoute('home')} style={{ cursor: 'pointer' }}>Home</span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span onClick={() => setRoute('listing')} style={{ cursor: 'pointer' }}>Shop</span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span>{p.cat}</span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: 'var(--ink)' }}>{p.name}</span>
        </div>
      </div>

      {/* Split layout — gallery + info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: (isMobile || isTablet) ? '1fr' : 'minmax(0, 1.1fr) minmax(0, 1fr)',
        gap: 0,
        alignItems: 'start',
        maxWidth: 1680, margin: '0 auto',
      }}>
        {/* GALLERY column */}
        <div style={{
          padding: 'clamp(16px, 2vw, 24px)',
          position: (isMobile || isTablet) ? 'static' : 'sticky',
          top: 'clamp(64px, 9vh, 80px)',
          alignSelf: 'start',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Main image + zoom button */}
            <div>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                background: 'var(--cream-soft)',
                aspectRatio: '4 / 5',
                cursor: 'zoom-in',
              }} onClick={() => setZoom(true)}>
                <img src={gallery[activeImg]} alt={p.name} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 320ms' }} />

                {/* Zoom badge */}
                <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 6 }}>
                  <span className="sticker out" style={{ background: 'rgba(253,252,248,0.85)', backdropFilter: 'blur(8px)', borderColor: 'transparent', fontSize: 10 }}>
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" className="responsive-icon" style={{ '--size': 'var(--icon-xs)', marginRight: 4, verticalAlign: '-1px' } as any}><circle cx="6" cy="6" r="4.5"/><path d="M9.5 9.5 12.5 12.5M6 4v4M4 6h4"/></svg>
                    Zoom
                  </span>
                </div>

                {/* Save heart */}
                <button onClick={(e) => { e.stopPropagation(); setSaved(s => !s); }}
                  style={{
                    position: 'absolute', top: 14, left: 14, width: 38, height: 38,
                    borderRadius: 999, background: 'rgba(253,252,248,0.85)', backdropFilter: 'blur(8px)',
                    border: 'none', cursor: 'pointer', fontSize: 16, color: saved ? 'var(--coral)' : 'var(--ink)',
                    transition: 'transform 180ms, color 180ms',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >{saved ? '♥' : '♡'}</button>

                {/* Counter */}
                <div className="mono-label" style={{ position: 'absolute', bottom: 14, left: 14, color: 'var(--cream)', fontSize: 10, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                  {String(activeImg + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
                </div>

                {/* Arrow nav over image */}
                <button onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i - 1 + gallery.length) % gallery.length); }}
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: 999, background: 'rgba(253,252,248,0.85)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', fontSize: 16, opacity: isMobile ? 1 : 0, transition: 'opacity 200ms' }}
                  onMouseEnter={(e) => !isMobile && (e.currentTarget.style.opacity = '1')}
                >←</button>
                <button onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i + 1) % gallery.length); }}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: 999, background: 'rgba(253,252,248,0.85)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', fontSize: 16, opacity: isMobile ? 1 : 0, transition: 'opacity 200ms' }}
                  onMouseEnter={(e) => !isMobile && (e.currentTarget.style.opacity = '1')}
                >→</button>
              </div>

              {/* Thumb strip — always below the main image */}
              <div className="no-scrollbar" style={{ display: 'grid', gridTemplateColumns: `repeat(${gallery.length}, 1fr)`, gap: 8, marginTop: 10 }}>
                {gallery.map((src, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{
                      width: '100%', aspectRatio: '4 / 5', padding: 0, border: 'none', cursor: 'pointer',
                      borderRadius: 'var(--r-md)', overflow: 'hidden',
                      outline: activeImg === i ? '2px solid var(--ink)' : '1px solid var(--hairline)',
                      outlineOffset: activeImg === i ? -2 : -1,
                      opacity: activeImg === i ? 1 : 0.65,
                      transition: 'opacity 200ms, outline 200ms',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = activeImg === i ? '1' : '0.65'}
                  >
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', bottom: 4, left: 6, color: 'var(--cream)', fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>0{i + 1}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* INFO column */}
        <div style={{ padding: 'clamp(28px, 5vw, 64px) clamp(20px, 4vw, 56px)' }}>
          {/* Vendor link */}
          <div className="mono-label" style={{ marginBottom: 20, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11 }}
            onClick={() => { if (vendor) { setActiveVendor(vendor); setRoute('vendor-detail'); } }}>
            → {p.vendor.toUpperCase()}
          </div>

          {/* Title */}
          <h1 className="fz-headline" style={{ fontSize: 'clamp(34px, 5vw, 56px)', marginBottom: 16, lineHeight: 1.02 }}>
            {p.name}<span className="it">.</span>
          </h1>

          {/* Price */}
          <div style={{ marginBottom: 36, display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span className="tabular" style={{ fontFamily: 'var(--display)', fontSize: 'clamp(20px, 2.6vw, 26px)', fontWeight: 700, letterSpacing: '-0.02em' }}>{fmtNGN(p.price)}</span>
            <span className="mono-sm muted tabular">≈ {fmtUSD(p.price)}</span>
            <span className="sticker out" style={{ marginLeft: 'auto', fontSize: 9 }}>In stock</span>
          </div>

          {/* Size */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, alignItems: 'baseline' }}>
              <span className="mono-label" style={{ fontSize: 11 }}>Size</span>
              <span className="mono-label muted" style={{ cursor: 'pointer', fontSize: 10 }}>Size guide →</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SIZES.map((s) => (
                <button key={s} className={`fz-pill ${size === s ? 'lime' : 'ghost'}`}
                  style={{ minWidth: 56, justifyContent: 'center' }}
                  onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
            <div className="mono-sm muted" style={{ marginTop: 12, fontSize: 11 }}>
              {size ? `${size} — in stock · ships within 2 days` : 'Select a size to continue'}
            </div>
          </div>

          {/* Qty + Add to bag row — responsive */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 10, marginBottom: 12, alignItems: 'stretch' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--hairline)', borderRadius: 999, overflow: 'hidden', height: 52 }}>
              <button style={{ padding: '0 16px', border: 'none', background: 'transparent', cursor: 'pointer', height: '100%', fontSize: 16 }} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="mono-md tabular" style={{ padding: '0 14px', minWidth: 30, textAlign: 'center', fontSize: 14 }}>{qty}</span>
              <button style={{ padding: '0 16px', border: 'none', background: 'transparent', cursor: 'pointer', height: '100%', fontSize: 16 }} onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="fz-pill lime" onClick={onAdd}
              style={{ width: '100%', height: 52, justifyContent: 'space-between', padding: '0 20px' }}>
              <span style={{ fontSize: 'clamp(10px, 1.4vw, 11px)' }}>Add to bag · {fmtNGN(p.price * qty)}</span>
              <span className="dot">→</span>
            </button>
          </div>
          <button className="fz-pill ghost" onClick={async () => {
            const nextSaved = !saved;
            setSaved(nextSaved);
            try {
              const updatedSaved = await apiToggleSave(p.id);
              if (setGlobalSaved) setGlobalSaved(updatedSaved);
              showToast({
                title: nextSaved ? 'Saved to Archive' : 'Removed from Archive',
                description: nextSaved ? `"${p.name}" has been pinned to your archive.` : `"${p.name}" has been removed from your archive.`,
                variant: nextSaved ? 'wishlist' : 'info'
              });
            } catch (err) {
              setSaved(!nextSaved); // rollback
              showToast({
                title: 'Sync Failed',
                description: 'Failed to synchronize listing with the backend archive records.',
                variant: 'error'
              });
            }
          }}
            style={{ width: '100%', justifyContent: 'center', marginBottom: 36 }}>
            {saved ? '♥ Saved to archive' : '♡ Save to archive'}
          </button>

          {/* Trust strip */}
          <div className="fz-card tinted-soft" style={{ padding: 16, marginBottom: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              ['🚚', 'Ships in 2 days', 'From Lagos'],
              ['↺', '14-day returns', 'In original condition'],
              ['⊙', 'Hand-finished', `at ${vendor?.city || 'the atelier'}`],
            ].map(([icon, t, sub], i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--icon-md)', marginBottom: 4 }}>{icon}</div>
                <div className="mono-sm" style={{ fontSize: 10.5, fontWeight: 600, marginBottom: 2 }}>{t}</div>
                <div className="mono-sm muted" style={{ fontSize: 9.5, lineHeight: 1.4 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Accordion */}
          <div>
            {rows.map((r, i) => (
              <div key={r.id} style={{ borderTop: i === 0 ? '1px solid var(--hairline)' : 'none', borderBottom: '1px solid var(--hairline)' }}>
                <div
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, padding: '20px 0', cursor: 'pointer', alignItems: 'center' }}>
                  <span className="mono-label" style={{ fontSize: 11 }}>{r.label}</span>
                  <span style={{ width: 28, height: 28, borderRadius: 999, border: '1px solid var(--hairline)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, lineHeight: 1, transition: 'transform 200ms', transform: expanded === r.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>{expanded === r.id ? '−' : '+'}</span>
                </div>
                {expanded === r.id && (
                  <div className="mono-md fade-in" style={{ paddingBottom: 24, fontSize: 13, lineHeight: 1.6, color: 'var(--ink)' }}>
                    {r.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Meta */}
          <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }} className="mono-sm">
            <div>
              <div className="mono-label muted" style={{ marginBottom: 4, fontSize: 9 }}>SKU</div>
              <div className="tabular" style={{ fontSize: 11 }}>KQ-{String(p.id).padStart(4, '0')}-{p.vendorId.toUpperCase().slice(0, 3)}</div>
            </div>
            <div>
              <div className="mono-label muted" style={{ marginBottom: 4, fontSize: 9 }}>Origin</div>
              <div style={{ fontSize: 11 }}>{vendor?.city}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      <section style={{ padding: 'clamp(56px, 9vw, 128px) clamp(16px, 3vw, 32px)', borderTop: '1px solid var(--hairline)' }}>
        <div style={{ maxWidth: 1680, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="mono-label muted" style={{ marginBottom: 8, fontSize: 11 }}>— More from</div>
              <h2 className="fz-headline" style={{ fontSize: 'clamp(40px, 6vw, 84px)' }}>{p.vendor}<span className="it">.</span></h2>
            </div>
            <button className="fz-pill ghost" onClick={() => { if (vendor) { setActiveVendor(vendor); setRoute('vendor-detail'); window.scrollTo(0, 0); } }}>
              <span>View atelier</span><span className="dot">→</span>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 'clamp(16px, 2.4vw, 32px)' }}>
            {related.map((r) => (
              <ProductCard key={r.id} product={r} setRoute={setRoute}
                setActiveProduct={() => { setActiveProduct(r); window.scrollTo(0, 0); setRoute('detail'); }} />
            ))}
          </div>
        </div>
      </section>

      {/* Zoom lightbox */}
      {zoom && (
        <ZoomImage
          src={gallery[activeImg]}
          alt={p.name}
          idx={activeImg}
          total={gallery.length}
          onClose={() => setZoom(false)}
          onPrev={() => setActiveImg((i: any) => (i - 1 + gallery.length) % gallery.length)}
          onNext={() => setActiveImg((i: any) => (i + 1) % gallery.length)}
        />
      )}
    </div>
  );
}
