import React, { useState } from 'react';
import { fmtNGN, fmtUSD } from '../lib/formatters';
import { useAppData } from '../lib/DataProvider';
import { useToast } from '../lib/ToastContext';
import { apiToggleSave } from '../lib/api';

export function Wishlist({ setRoute, setActiveProduct, isMobile, owner }: any) {
  const { PRODUCTS, SAVED } = useAppData();
  const { showToast } = useToast();
  const o = owner || { name: 'Adaeze', handle: 'adaeze', avatar: null, joined: 'Nov 2024' };
  const items = PRODUCTS.filter(p => SAVED.includes(p.id));
  const [copied, setCopied] = useState(false);
  const [grouped, setGrouped] = useState(false);

  const copyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`https://kiosque.shop/wishlist/${o.handle}`).catch(()=>{});
      showToast({
        title: 'Share Link Copied',
        description: `Link for @${o.handle}'s archive copied to clipboard.`,
        variant: 'success'
      });
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const totalValue = items.reduce((s, p) => s + p.price, 0);

  // Group by vendor
  const byVendor = items.reduce((acc: any, p: any) => {
    if (!acc[p.vendor]) acc[p.vendor] = [];
    acc[p.vendor].push(p);
    return acc;
  }, {});

  return (
    <div className="page" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <section style={{ padding: 'clamp(88px, 12vw, 120px) clamp(16px, 3vw, 32px) clamp(28px, 3vw, 48px)', borderBottom: '1px solid var(--hairline)' }}>
        <div style={{ maxWidth: 1680, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            <span className="sticker out">Wishlist</span>
            <span className="sticker lime">kiosque.shop/wishlist/{o.handle}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: 24, alignItems: 'end' }}>
            <div>
              <h1 className="fz-headline" style={{ fontSize: 'clamp(48px, 8vw, 120px)' }}>
                {o.name}<span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400 }}>'s</span><br/>
                <span className="it">archive</span>.
              </h1>
              <div className="mono-sm muted" style={{ marginTop: 16, fontSize: 12 }}>
                {items.length} pieces · saved over {o.joined} → today · across {Object.keys(byVendor).length} ateliers
              </div>
            </div>

            {/* Owner card */}
            <div className="fz-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 14, minWidth: 240 }}>
              <div style={{ width: 48, height: 48, borderRadius: 999, background: 'var(--coral)', color: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 900, fontSize: 18, letterSpacing: '-0.03em' }}>
                {o.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="mono-label muted" style={{ fontSize: 9, marginBottom: 2 }}>Curator</div>
                <div className="mono-md" style={{ fontSize: 14, fontWeight: 600 }}>@{o.handle}</div>
              </div>
              <button className="fz-pill ghost" style={{ padding: '8px 12px', fontSize: 10 }}>
                <span>Follow</span><span className="dot" style={{ width: 18, height: 18, fontSize: 10 }}>+</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section style={{ padding: 'clamp(20px, 2.4vw, 32px) clamp(16px, 3vw, 32px)', borderBottom: '1px solid var(--hairline)' }}>
        <div style={{ maxWidth: 1680, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className={`btn-pill ${!grouped ? 'active' : ''}`} onClick={() => setGrouped(false)}>All pieces</button>
            <button className={`btn-pill ${grouped ? 'active' : ''}`} onClick={() => setGrouped(true)}>By vendor</button>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="mono-sm muted tabular" style={{ fontSize: 11 }}>Total value · {fmtNGN(totalValue)}</span>
            <button onClick={copyLink} className="fz-pill ghost" style={{ padding: '10px 16px', fontSize: 11 }}>
              <span>{copied ? '✓ Copied' : 'Share link'}</span><span className="dot" style={{ width: 20, height: 20, fontSize: 10 }}>{copied ? '✓' : '⎘'}</span>
            </button>
            <button className="fz-pill lime" style={{ padding: '10px 16px', fontSize: 11, justifyContent: 'space-between' }}>
              <span>Add to bag · all</span><span className="dot" style={{ width: 20, height: 20, fontSize: 10 }}>+</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid / Vendor groups */}
      <section style={{ padding: 'clamp(32px, 4vw, 64px) clamp(16px, 3vw, 32px) clamp(48px, 6vw, 96px)' }}>
        <div style={{ maxWidth: 1680, margin: '0 auto' }}>
          {items.length === 0 ? (
            <div className="fz-card" style={{ padding: 'clamp(48px, 8vw, 96px)', textAlign: 'center' }}>
              <span className="sticker out" style={{ marginBottom: 20, display: 'inline-block' }}>Empty</span>
              <h2 className="fz-headline" style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: 14 }}>
                Nothing saved <span className="it">yet</span>.
              </h2>
              <p className="mono-sm muted" style={{ marginBottom: 28, maxWidth: 380, margin: '0 auto 28px', fontSize: 12 }}>
                Tap the heart on any piece to start an archive. You can share the link with anyone — even people without an account.
              </p>
              <button className="fz-pill lime" onClick={() => setRoute('listing')} style={{ justifyContent: 'space-between' }}>
                <span>Browse the edit</span><span className="dot">→</span>
              </button>
            </div>
          ) : grouped ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
              {Object.entries(byVendor).map(([vendor, vps]: any) => (
                <div key={vendor}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div className="mono-label muted" style={{ fontSize: 10, marginBottom: 6 }}>— Atelier</div>
                      <h3 className="fz-headline" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>{vendor}<span className="it">.</span></h3>
                    </div>
                    <div className="mono-sm muted tabular" style={{ fontSize: 11 }}>
                      {vps.length} {vps.length === 1 ? 'piece' : 'pieces'} · {fmtNGN(vps.reduce((s: number, p: any) => s + p.price, 0))}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'clamp(16px, 2.4vw, 28px)' }}>
                    {vps.map((p: any) => <WishCard key={p.id} p={p} setRoute={setRoute} setActiveProduct={setActiveProduct} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'clamp(16px, 2.4vw, 32px)' }}>
              {items.map((p: any) => <WishCard key={p.id} p={p} setRoute={setRoute} setActiveProduct={setActiveProduct} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function WishCard({ p, setRoute, setActiveProduct }: any) {
  const [hover, setHover] = useState(false);
  const open = () => { setActiveProduct(p); setRoute('detail'); window.scrollTo(0, 0); };
  const { setSaved: setGlobalSaved } = useAppData();
  const { showToast } = useToast();

  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div onClick={open} style={{
        aspectRatio: '4 / 5', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--cream-soft)', cursor: 'pointer', position: 'relative',
      }}>
        {p.img && <img src={p.img} alt={p.name} loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hover ? 'scale(1.04)' : 'scale(1)', transition: 'transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1)' }} />}

        {/* Hover overlay quick-add */}
        <div style={{
          position: 'absolute', left: 12, right: 12, bottom: 12,
          opacity: hover ? 1 : 0,
          transform: hover ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 240ms',
          display: 'flex', gap: 8,
        }}>
          <button className="fz-pill lime" style={{ flex: 1, padding: '10px 14px', fontSize: 10, justifyContent: 'space-between' }} onClick={(e) => { e.stopPropagation(); /* Add to bag could go here */ }}>
            <span>Add to bag</span><span className="dot" style={{ width: 18, height: 18, fontSize: 10 }}>+</span>
          </button>
        </div>

        {/* Heart (saved) */}
        <button onClick={async (e) => {
          e.stopPropagation();
          try {
            const updated = await apiToggleSave(p.id);
            if (setGlobalSaved) setGlobalSaved(updated);
            showToast({
              title: 'Removed from Archive',
              description: `"${p.name}" has been unsaved from your local archives.`,
              variant: 'info'
            });
          } catch (err) {
            showToast({
              title: 'Server Error',
              description: 'Failed to synchronize listing with the backend.',
              variant: 'error'
            });
          }
        }}
          style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 999, background: 'rgba(253,252,248,0.92)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ♥
        </button>

        {/* Saved date */}
        <div className="mono-label" style={{ position: 'absolute', top: 12, left: 12, color: 'var(--cream)', fontSize: 9, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
          Saved · Mar 14
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="mono-label muted" style={{ fontSize: 10, marginBottom: 4 }}>{p.vendor}</div>
        <div className="mono-md" style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3, cursor: 'pointer' }} onClick={open}>{p.name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 }}>
          <span className="mono-sm tabular" style={{ fontSize: 12, fontWeight: 600 }}>{fmtNGN(p.price)}</span>
          <span className="mono-sm muted tabular" style={{ fontSize: 10 }}>{fmtUSD(p.price)}</span>
        </div>
      </div>
    </div>
  );
}
