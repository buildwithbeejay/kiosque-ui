import React, { useState, useEffect } from 'react';
import { fmtNGN, fmtUSD } from '../lib/formatters';
import { useAppData } from '../lib/DataProvider';
import { useToast } from '../lib/ToastContext';
import { apiTrackOrder } from '../lib/api';

const TRACK_STEPS = [
  { key: 'placed',     label: 'Placed',     detail: 'Order received, payment cleared' },
  { key: 'fulfilling', label: 'Fulfilling', detail: 'Atelier preparing your piece' },
  { key: 'shipped',    label: 'Shipped',    detail: 'On its way to you' },
  { key: 'delivered',  label: 'Delivered',  detail: 'Hand-delivered. Enjoy.' },
];

function statusToStep(status: string) {
  if (!status) return 0;
  const s = status.toLowerCase();
  if (s.includes('deliver')) return 3;
  if (s.includes('transit') || s.includes('ship')) return 2;
  if (s.includes('fulfill') || s.includes('pack') || s.includes('prep')) return 1;
  return 0;
}

function buildEvents(order: any) {
  const step = statusToStep(order.status);
  const events = [
    { step: 0, ts: order.date || 'Mar 18 / 2026, 14:32', loc: 'Lagos, Nigeria',     title: 'Order placed',           body: `Payment confirmed · ${order.id}` },
    { step: 1, ts: 'Mar 19 / 2026, 09:10',                 loc: order.atelier || 'Adìrẹ Ilọrin · Lagos',                 title: 'Atelier fulfilling',     body: 'Your piece is being prepared by hand' },
    { step: 1, ts: 'Mar 19 / 2026, 16:48',                 loc: 'Kiosque studio · Yaba',                                  title: 'Quality check',           body: 'Photographed, tagged, and folded with tissue' },
    { step: 2, ts: 'Mar 20 / 2026, 08:15',                 loc: 'DHL Lagos · MMA Cargo',                                  title: 'Picked up by carrier',    body: 'Tracking number 7894 5523 1188' },
    { step: 2, ts: 'Mar 21 / 2026, 03:42',                 loc: 'Leipzig, DE · transit hub',                              title: 'Cleared customs',         body: 'Duties prepaid, no action required' },
    { step: 2, ts: 'Mar 21 / 2026, 18:20',                 loc: 'JFK · New York',                                          title: 'Arrived in destination',  body: 'On the truck for last-mile delivery' },
    { step: 3, ts: 'Mar 22 / 2026, 11:04',                 loc: order.dest || 'Brooklyn, NY',                              title: 'Delivered',                body: 'Signed for by recipient' },
  ];
  return events.filter(e => e.step <= step);
}

export function OrderTrack({ setRoute, setActiveProduct, isMobile, order }: any) {
  const { ORDERS, PRODUCTS, SAVED } = useAppData();
  const { showToast, updateToast } = useToast();
  // Default to latest order if none passed
  const initialOrder = order || (ORDERS && ORDERS[0]) || {
    id: 'KQ-28104', date: 'Mar 18 / 2026', status: 'In transit', dest: 'Brooklyn, NY',
    ship: 'DHL • Expected Mar 22', total: 430000,
    items: PRODUCTS.slice(0, 2).map((p: any) => ({ ...p, size: 'S', qty: 1, productId: p.id })),
  };

  const [o, setActiveOrder] = useState<any>(initialOrder);
  const [lookupId, setLookupId] = useState(o.id);
  const [lookupEmail, setLookupEmail] = useState('');
  const step = statusToStep(o.status);
  const events = buildEvents(o);

  const handleLookup = async () => {
    if (!lookupId) {
      showToast({
        title: 'Missing Reference',
        description: 'Please enter an Order ID starting with KQ-',
        variant: 'warning'
      });
      return;
    }
    
    // Simulate lookup with energetic pending loading spinner
    const toastId = showToast({
      title: 'Searching Archives',
      description: `Locating route events for ${lookupId}...`,
      variant: 'pending',
      duration: 0
    });
    
    try {
      const match = await apiTrackOrder(lookupId);
      setTimeout(() => {
        setActiveOrder(match);
        updateToast(toastId, {
          title: 'Status Synchronized',
          description: `Loaded latest active route for ${lookupId}.`,
          variant: 'success',
          duration: 4000
        });
      }, 700);
    } catch (err) {
      updateToast(toastId, {
        title: 'Order Not Found',
        description: `Order tracking reference ${lookupId} does not exist in databases.`,
        variant: 'error',
        duration: 4000
      });
    }
  };

  const handleCopyTracking = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('789455231188').catch(()=>{});
      showToast({
        title: 'Tracking Code Copied',
        description: 'DHL Express track ID (7894 5523 1188) saved to clipboard.',
        variant: 'success'
      });
    }
  };

  // Auto-scroll events to bottom when mounted
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const subtotal = (o.items || []).reduce((s: number, i: any) => s + (i.price || 0) * (i.qty || 1), 0);
  const shippingFee = o.shipping || 0;

  return (
    <div className="page" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <section style={{ padding: 'clamp(88px, 12vw, 120px) clamp(16px, 3vw, 32px) clamp(32px, 4vw, 56px)', borderBottom: '1px solid var(--hairline)' }}>
        <div style={{ maxWidth: 1680, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            <span className="sticker" style={{ borderColor: 'var(--hairline-strong)', color: 'var(--grey-ink)' }}>Track an order</span>
            <span className="sticker" style={{ backgroundColor: 'var(--cream-soft)', borderColor: 'var(--coral)', color: 'var(--ink)', fontWeight: 600 }}>{o.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
            <h1 className="fz-headline" style={{ fontSize: 'clamp(48px, 8vw, 112px)', margin: 0, lineHeight: 0.9 }}>
              Where is <span className="it">it</span>?
            </h1>
            <div className="mono-sm tabular" style={{ textAlign: 'right', lineHeight: 1.4 }}>
              <span className="sticker" style={{ backgroundColor: 'var(--ink)', borderColor: 'var(--ink)', color: 'var(--cream)', fontSize: 11, padding: '4px 10px', display: 'inline-flex', alignItems: 'center' }}>
                <span className="blink-dot" style={{ width: 6, height: 6, marginRight: 6, backgroundColor: 'var(--coral)' }} />
                {o.status}
              </span>
              <div style={{ marginTop: 8, color: 'var(--grey-ink)', fontSize: 12, letterSpacing: '0.01em' }}>{o.ship}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Lookup strip — for non-logged-in users */}
      <section style={{ padding: 'clamp(24px, 3vw, 36px) clamp(16px, 3vw, 32px)', borderBottom: '1px solid var(--hairline)', background: 'var(--cream-soft)' }}>
        <div style={{ maxWidth: 1680, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
          <div className="fz-headline" style={{ fontSize: 22, letterSpacing: '-0.02em', marginBottom: isMobile ? 8 : 4 }}>
            Lookup <span className="it" style={{ fontStyle: 'italic', color: 'var(--coral)' }}>another</span>
          </div>
          <label style={{ display: 'block' }}>
            <div className="mono-label" style={{ fontSize: 10, letterSpacing: '0.05em', marginBottom: 6, color: 'var(--grey-ink)' }}>Order ID</div>
            <input value={lookupId} onChange={(e) => setLookupId(e.target.value)} placeholder="KQ-XXXXX"
              style={{ width: '100%', padding: '14px 16px', fontFamily: 'var(--mono)', fontSize: 13, background: 'var(--cream)', border: '1px solid var(--hairline-strong, var(--hairline))', borderRadius: 12, outline: 'none' }} />
          </label>
          <label style={{ display: 'block' }}>
            <div className="mono-label" style={{ fontSize: 10, letterSpacing: '0.05em', marginBottom: 6, color: 'var(--grey-ink)' }}>Email on the order</div>
            <input value={lookupEmail} onChange={(e) => setLookupEmail(e.target.value)} placeholder="you@email.com"
              style={{ width: '100%', padding: '14px 16px', fontFamily: 'var(--mono)', fontSize: 13, background: 'var(--cream)', border: '1px solid var(--hairline-strong, var(--hairline))', borderRadius: 12, outline: 'none' }} />
          </label>
          <button onClick={handleLookup} className="fz-pill" style={{ justifyContent: 'space-between', padding: '14px 24px', minWidth: 120 }}>
            <span style={{ fontWeight: 600 }}>Track</span><span className="dot">→</span>
          </button>
        </div>
      </section>

      {/* Main */}
      <section style={{ padding: 'clamp(40px, 5vw, 72px) clamp(16px, 3vw, 32px)' }}>
        <div style={{ maxWidth: 1680, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: 'clamp(24px, 4vw, 56px)', alignItems: 'start' }}>
          {/* Left — timeline + events */}
          <div>
            {/* Timeline (horizontal milestones) */}
            <div className="fz-card" style={{ padding: 'clamp(24px, 3vw, 36px)', marginBottom: 24, border: '1px solid var(--hairline)' }}>
              <div className="fz-headline" style={{ fontSize: 26, letterSpacing: '-0.02em', marginBottom: 28 }}>
                Current <span className="it">progress</span>
              </div>
              <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(12px, 2.5vw, 24px)' }}>
                {TRACK_STEPS.map((s, i) => {
                  const reached = i <= step;
                  const current = i === step;
                  return (
                    <div key={s.key} style={{ position: 'relative' }}>
                      {/* Dot */}
                      <div style={{
                        width: 'clamp(24px, 3.5vw, 32px)',
                        height: 'clamp(24px, 3.5vw, 32px)',
                        borderRadius: 999,
                        background: reached ? 'var(--ink)' : 'var(--cream)',
                        border: '2px solid ' + (reached ? 'var(--ink)' : 'var(--hairline-strong, var(--hairline))'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: reached ? 'var(--coral)' : 'var(--grey)', fontSize: 11, fontWeight: 800,
                        position: 'relative', zIndex: 2,
                        transition: 'all 320ms',
                      }}>
                        {reached ? '✓' : i + 1}
                      </div>
                      {/* Line to next */}
                      {i < TRACK_STEPS.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          left: 'clamp(24px, 3.5vw, 32px)',
                          right: 'calc(-100% + 0px)',
                          top: 'clamp(11px, 1.7vw, 15px)',
                          height: 2,
                          background: i < step ? 'var(--ink)' : 'var(--hairline)',
                          zIndex: 1,
                          transition: 'background 320ms',
                        }} />
                      )}
                      
                      <div className="mono-label" style={{ fontSize: 11, marginTop: 16, fontWeight: 600, letterSpacing: '0.02em', color: reached ? 'var(--ink)' : 'var(--grey)' }}>
                        {s.label}
                      </div>
                      
                      <div className="mono-sm" style={{ fontSize: 11, lineHeight: 1.4, marginTop: 6, color: reached ? 'var(--grey-ink)' : 'var(--grey)', opacity: reached ? 1 : 0.85 }}>
                        {s.detail}
                      </div>

                      {current && (
                        <div style={{ marginTop: 10 }}>
                          <span className="sticker" style={{ backgroundColor: 'var(--coral)', borderColor: 'var(--coral)', color: 'var(--cream)', fontSize: 9, padding: '3px 8px', fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
                            <span className="blink-dot" style={{ width: 5, height: 5, marginRight: 5, backgroundColor: 'var(--cream)' }} />
                            ACTIVE
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ETA pill */}
            <div className="fz-card" style={{ padding: 'clamp(24px, 3vw, 32px)', marginBottom: 24, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: 24, border: '1px solid var(--hairline)', backgroundColor: 'var(--cream-soft)' }}>
              <div>
                <div className="mono-label" style={{ fontSize: 10, letterSpacing: '0.07em', marginBottom: 10, color: 'var(--grey-ink)' }}>Estimated delivery</div>
                <div style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 'clamp(32px, 4vw, 44px)', letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--ink)' }}>
                  Mar 22 — <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--coral)' }}>by 6 PM</span>
                </div>
                <div className="mono-sm" style={{ marginTop: 10, fontSize: 11, color: 'var(--grey-ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>Brooklyn, NY</span>
                  <span style={{ opacity: 0.5 }}>·</span>
                  <span style={{ fontWeight: 600 }}>DHL Express</span>
                </div>
              </div>
              <div style={{ borderLeft: isMobile ? 'none' : '1px solid var(--hairline)', paddingLeft: isMobile ? 0 : 24, paddingTop: isMobile ? 12 : 0 }}>
                <div className="mono-label" style={{ fontSize: 10, letterSpacing: '0.07em', marginBottom: 10, color: 'var(--grey-ink)' }}>Carrier tracking</div>
                <div className="mono-md tabular" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--ink)' }}>7894 5523 1188</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                  <button onClick={handleCopyTracking} className="fz-pill ghost" style={{ padding: '8px 14px', fontSize: 11, backgroundColor: 'var(--cream)' }}>
                    <span>Copy</span><span className="dot" style={{ width: 16, height: 16, fontSize: 10 }}>⎘</span>
                  </button>
                  <button className="fz-pill ghost" style={{ padding: '8px 14px', fontSize: 11, backgroundColor: 'var(--cream)' }}>
                    <span>DHL site</span><span className="dot" style={{ width: 16, height: 16, fontSize: 10 }}>↗</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Event log */}
            <div className="fz-card" style={{ padding: 'clamp(24px, 3vw, 36px)', border: '1px solid var(--hairline)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, borderBottom: '1px solid var(--hairline)', paddingBottom: 16 }}>
                <div className="fz-headline" style={{ fontSize: 26, letterSpacing: '-0.02em' }}>
                  Activity <span className="it">log</span>
                </div>
                <span className="mono-sm tabular" style={{ fontSize: 11, color: 'var(--grey-ink)', fontWeight: 500 }}>{events.length} updates</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {events.slice().reverse().map((e, i, arr) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 16, position: 'relative' }}>
                    {/* Rail dot */}
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                      <div style={{ 
                        width: 10, 
                        height: 10, 
                        borderRadius: 999, 
                        background: i === 0 ? 'var(--coral)' : 'var(--ink)', 
                        marginTop: 6, 
                        zIndex: 2,
                        boxShadow: i === 0 ? '0 0 0 4px rgba(255,107,74,0.15)' : 'none'
                      }} />
                      {i < arr.length - 1 && <div style={{ position: 'absolute', top: 14, bottom: -16, left: '50%', width: 1, background: 'var(--hairline)', transform: 'translateX(-50%)' }} />}
                    </div>
                    {/* Content */}
                    <div style={{ paddingBottom: i < arr.length - 1 ? 26 : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                        <span className="mono-md" style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{e.title}</span>
                        <span className="mono-sm tabular" style={{ fontSize: 11, color: 'var(--grey-ink)' }}>{e.ts}</span>
                      </div>
                      <div className="mono-sm" style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5, color: 'var(--grey-ink)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{e.loc}</span> · {e.body}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — sticky order summary */}
          <div style={{ position: isMobile ? 'static' : 'sticky', top: 'clamp(80px, 10vh, 120px)' }}>
            <div className="fz-card" style={{ padding: 'clamp(24px, 2.6vw, 32px)', border: '1px solid var(--hairline)' }}>
              <div className="fz-headline" style={{ fontSize: 24, letterSpacing: '-0.02em', marginBottom: 24, borderBottom: '1px solid var(--hairline)', paddingBottom: 16 }}>
                Order <span className="it">summary</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                {(o.items || []).map((it: any, idx: number) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 14, alignItems: 'center' }}>
                    <div style={{ aspectRatio: '4 / 5', borderRadius: 'var(--r-sm)', overflow: 'hidden', background: 'var(--cream-soft)', border: '1px solid var(--hairline)' }}>
                      {it.img && <img src={it.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="mono-label" style={{ fontSize: 9, letterSpacing: '0.05em', color: 'var(--grey-ink)', marginBottom: 2 }}>{it.vendor}</div>
                      <div className="mono-sm" style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ink)' }}>{it.name}</div>
                      <div className="mono-sm" style={{ fontSize: 11, marginTop: 2, color: 'var(--grey-ink)' }}>Size {it.size || 'M'} · Qty {it.qty || 1}</div>
                    </div>
                    <div className="mono-sm tabular" style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{fmtNGN(it.price * (it.qty || 1))}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span className="mono-sm" style={{ color: 'var(--grey-ink)' }}>Subtotal</span>
                  <span className="mono-sm tabular" style={{ fontWeight: 500, color: 'var(--ink)' }}>{fmtNGN(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span className="mono-sm" style={{ color: 'var(--grey-ink)' }}>Shipping</span>
                  <span className="mono-sm tabular" style={{ fontWeight: 500, color: 'var(--ink)' }}>{shippingFee ? fmtNGN(shippingFee) : 'Complimentary'}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 16, marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="mono-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--grey-ink)' }}>Total</span>
                  <span className="tabular" style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 26, letterSpacing: '-0.04em', color: 'var(--ink)' }}>{fmtNGN(o.total || subtotal)}</span>
                </div>
              </div>

              {/* Delivery address */}
              <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 20, marginTop: 20 }}>
                <div className="mono-label" style={{ fontSize: 10, letterSpacing: '0.07em', marginBottom: 10, color: 'var(--grey-ink)' }}>Delivering to</div>
                <div className="mono-sm" style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--grey-ink)' }}>
                  <strong style={{ color: 'var(--ink)' }}>Adaeze Onyemechi</strong><br/>
                  218 Bedford Ave, Apt 4B<br/>
                  {o.dest || 'Brooklyn, NY 11211'}<br/>
                  United States
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
                <button className="fz-pill ghost" style={{ flex: 1, justifyContent: 'space-between', padding: '12px 18px', fontSize: 12 }}>
                  <span>Contact us</span><span className="dot">→</span>
                </button>
                <button className="fz-pill ghost" style={{ flex: 1, justifyContent: 'space-between', padding: '12px 18px', fontSize: 12 }}>
                  <span>Start return</span><span className="dot">↩</span>
                </button>
              </div>
            </div>

            {/* Trust */}
            <div className="mono-sm" style={{ marginTop: 20, fontSize: 10, textAlign: 'center', lineHeight: 1.6, color: 'var(--grey-ink)' }}>
              Free 14-day returns from delivery<br/>
              Questions? hello@kiosque.shop
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
