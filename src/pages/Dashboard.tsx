import React, { useState } from 'react';
import { fmtNGN, fmtUSD } from '../lib/formatters';
import { useAppData } from '../lib/DataProvider';

export function Dashboard({ setRoute, isMobile }: any) {
  const { VENDOR_SESSION, VENDOR_SALES, VENDOR_ORDERS, VENDOR_CATALOG, VENDOR_PAYOUTS, VENDOR_ANALYTICS, VENDOR_MESSAGES, VENDOR_REVIEWS, VENDORS } = useAppData();
  const [section, setSection] = useState('overview');

  const nav = [
    ['overview', 'Overview'],
    ['orders', 'Orders'],
    ['catalog', 'Catalog'],
    ['inventory', 'Inventory'],
    ['payouts', 'Payouts'],
    ['analytics', 'Analytics'],
    ['messages', 'Messages'],
    ['reviews', 'Reviews'],
    ['settings', 'Storefront'],
  ];

  const unreadMsgs = VENDOR_MESSAGES.filter((m: any) => m.unread).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Dashboard topbar */}
      <div style={{ borderBottom: '1px solid var(--hairline)', padding: isMobile ? '14px 16px' : '16px 24px', display: 'grid', gridTemplateColumns: isMobile ? '1fr auto' : '1fr auto auto', gap: 16, alignItems: 'center', background: 'var(--cream)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="fz-nav-wordmark" style={{ borderRight: 'none', padding: 0, height: 'auto' }}>Kiosque<span style={{ color: 'var(--coral)' }}>.</span></div>
          <span className="sticker lime">Vendor</span>
          <span className="mono-sm" style={{ marginLeft: 4 }}>{VENDOR_SESSION.vendorName}</span>
        </div>
        {!isMobile && (
          <div className="fz-card tinted-soft" style={{ padding: '8px 14px', borderRadius: 'var(--r-pill)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span className="blink-dot" />
            <span className="mono-sm tabular">Payout {fmtNGN(VENDOR_PAYOUTS.balance)} · {VENDOR_PAYOUTS.nextDate}</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className="mono-sm muted">{VENDOR_SESSION.contactName}</span>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--lime)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>FO</div>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr', minHeight: 'calc(100vh - 54px)' }}>
        {/* Sidebar */}
        <div style={{ borderRight: isMobile ? 'none' : '1px solid var(--hairline)', borderBottom: isMobile ? '1px solid var(--hairline)' : 'none', padding: isMobile ? '8px 16px' : '24px 0' }}>
          <div style={{ display: isMobile ? 'flex' : 'block', gap: 0, overflowX: isMobile ? 'auto' : 'visible' }} className={isMobile ? 'no-scrollbar' : ''}>
            {nav.map(([id, label]) => {
              const active = section === id;
              const unread = id === 'messages' && unreadMsgs > 0;
              return (
                <div key={id} onClick={() => setSection(id)} style={{
                  padding: isMobile ? '10px 14px' : '10px 18px',
                  margin: isMobile ? 0 : '2px 12px',
                  cursor: 'pointer',
                  background: active ? 'var(--ink)' : 'transparent',
                  color: active ? 'var(--cream)' : 'var(--ink)',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  borderRadius: 'var(--r-pill)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  whiteSpace: 'nowrap',
                  transition: 'background 240ms ease, color 240ms ease',
                }}>
                  <span>{label}</span>
                  {unread ? <span style={{ background: active ? 'var(--lime)' : 'var(--coral)', color: active ? 'var(--ink)' : 'var(--cream)', padding: '2px 7px', fontSize: 10, marginLeft: 8, borderRadius: 999, fontWeight: 600 }}>{unreadMsgs}</span> : null}
                </div>
              );
            })}
            {!isMobile && (
              <>
                <div style={{ borderTop: '1px solid var(--hairline)', margin: '16px 0' }} />
                <div onClick={() => setRoute('home')} style={{ padding: '10px 24px', cursor: 'pointer', color: 'var(--grey)', fontSize: 12 }}>← Public site</div>
              </>
            )}
          </div>
        </div>

        {/* Main */}
        <div style={{ padding: isMobile ? 16 : 32 }}>
          {section === 'overview' && <VDOverview setSection={setSection} isMobile={isMobile} />}
          {section === 'orders' && <VDOrders isMobile={isMobile} />}
          {section === 'catalog' && <VDCatalog isMobile={isMobile} />}
          {section === 'inventory' && <VDInventory isMobile={isMobile} />}
          {section === 'payouts' && <VDPayouts isMobile={isMobile} />}
          {section === 'analytics' && <VDAnalytics isMobile={isMobile} />}
          {section === 'messages' && <VDMessages isMobile={isMobile} />}
          {section === 'reviews' && <VDReviews isMobile={isMobile} />}
          {section === 'settings' && <VDSettings isMobile={isMobile} />}
        </div>
      </div>
    </div>
  );
}

// ---- KPI pill ----
function KPI({ label, value, sub, delta, tint }: any) {
  const up = delta && delta > 0;
  const tintClass = tint ? `tinted-${tint}` : '';
  return (
    <div className={`fz-card ${tintClass}`} style={{ padding: 22 }}>
      <div className="mono-label" style={{ fontSize: 10, marginBottom: 12, opacity: 0.75 }}>{label}</div>
      <div style={{ fontFamily: 'var(--display)', fontSize: 36, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
        <span className="mono-sm" style={{ opacity: 0.7 }}>{sub}</span>
        {delta !== undefined && delta !== null && (
          <span className="mono-sm tabular" style={{ fontWeight: 600 }}>
            {up ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

function VDOverview({ setSection, isMobile }: any) {
  const { VENDOR_SALES, VENDOR_ORDERS, VENDOR_MESSAGES } = useAppData();
  const s = VENDOR_SALES;
  const revDelta = ((s.revenueMonth - s.revenuePrev) / s.revenuePrev) * 100;
  const ordDelta = ((s.ordersMonth - s.ordersPrev) / s.ordersPrev) * 100;
  const aovDelta = ((s.aov - s.aovPrev) / s.aovPrev) * 100;
  const max = Math.max(...s.daily);
  const toFulfill = VENDOR_ORDERS.filter((o: any) => o.status === 'To fulfill').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: isMobile ? 28 : 36, letterSpacing: '-0.02em' }}>Overview</h2>
        <div className="mono-sm muted tabular">March 2026 · Day 20 of 31</div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <KPI label="Revenue, month" value={fmtNGN(s.revenueMonth)} sub={fmtUSD(s.revenueMonth)} delta={revDelta} tint="lime" />
        <KPI label="Orders" value={s.ordersMonth} sub={`vs ${s.ordersPrev} last month`} delta={ordDelta} />
        <KPI label="Avg order value" value={fmtNGN(s.aov)} sub={fmtUSD(s.aov)} delta={aovDelta} tint="butter" />
        <KPI label="Units sold" value={s.unitsMonth} sub={`${toFulfill} awaiting fulfilment`} tint="sky" />
      </div>

      {/* Revenue chart */}
      <div style={{ border: '1px solid var(--hairline)', padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="mono-label">Daily revenue · 30 days</div>
          <div className="mono-sm muted tabular">Peak {fmtNGN(max)}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 120, borderBottom: '1px solid var(--hairline)', paddingBottom: 2 }}>
          {s.daily.map((v: any, i: any) => (
            <div key={i} style={{
              flex: 1,
              height: max === 0 ? 0 : `${(v / max) * 100}%`,
              background: v === 0 ? 'var(--cream-soft)' : 'var(--black)',
              minHeight: 2,
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span className="mono-sm muted">Feb 19</span>
          <span className="mono-sm muted">Mar 05</span>
          <span className="mono-sm muted">Mar 20</span>
        </div>
      </div>

      {/* Two-up: action items + recent orders */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        <div style={{ border: '1px solid var(--hairline)', padding: 20 }}>
          <div className="mono-label" style={{ marginBottom: 16 }}>To do today</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              [`${toFulfill} orders to fulfil`, 'Process by 17:00 for today\'s DHL pickup', () => setSection('orders')],
              ['2 pieces low on stock', 'Olókun tunic: 2 left · restock or pause', () => setSection('inventory')],
              [`${VENDOR_MESSAGES.filter((m: any) => m.unread).length} unread messages`, '1 from a customer · 1 from Kiosque studio', () => setSection('messages')],
            ].map(([title, sub, fn]: any, i: any) => (
              <div key={i} onClick={fn} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--hairline)' : 'none', cursor: 'pointer', alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, background: 'var(--black)' }} />
                <div>
                  <div style={{ fontSize: 13 }}>{title}</div>
                  <div className="mono-sm muted" style={{ marginTop: 2 }}>{sub}</div>
                </div>
                <span className="mono-sm muted">→</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: '1px solid var(--hairline)', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="mono-label">Recent orders</div>
            <div className="mono-sm muted" style={{ cursor: 'pointer' }} onClick={() => setSection('orders')}>All →</div>
          </div>
          {VENDOR_ORDERS.slice(0, 5).map((o: any, i: any) => (
            <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, padding: '10px 0', borderBottom: i < Math.min(VENDOR_ORDERS.length - 1, 4) ? '1px solid var(--hairline)' : 'none' }}>
              <div>
                <div style={{ fontSize: 12 }} className="tabular">{o.id} · {o.buyer}</div>
                <div className="mono-sm muted">{o.product} · {o.dest}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12 }} className="tabular">{fmtNGN(o.total)}</div>
                <StatusDot status={o.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: any) {
  const map: any = {
    'To fulfill': ['#C94F2A', 'To fulfil'],
    'Packed': ['#B59000', 'Packed'],
    'Shipped': ['#4A5D3A', 'Shipped'],
    'Delivered': ['#8A8478', 'Delivered'],
  };
  const [color, label] = map[status] || ['var(--grey)', status];
  return (
    <div className="mono-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color, fontSize: 11 }}>
      <div style={{ width: 6, height: 6, background: color, borderRadius: '50%' }} />
      {label}
    </div>
  );
}

function VDOrders({ isMobile }: any) {
  const { VENDOR_ORDERS } = useAppData();
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'To fulfill', 'Packed', 'Shipped', 'Delivered'];
  const filtered = filter === 'All' ? VENDOR_ORDERS : VENDOR_ORDERS.filter((o: any) => o.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: isMobile ? 28 : 36, letterSpacing: '-0.02em' }}>Orders</h2>
        <div style={{ display: 'flex', gap: 0, border: '1px solid var(--hairline)' }}>
          {filters.map(f => (
            <div key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 14px',
              fontSize: 11, cursor: 'pointer',
              background: filter === f ? 'var(--black)' : 'transparent',
              color: filter === f ? 'var(--cream)' : 'var(--black)',
              borderLeft: f === filters[0] ? 'none' : '1px solid var(--hairline)',
            }}>{f} <span className="muted tabular" style={{ marginLeft: 4 }}>{f === 'All' ? VENDOR_ORDERS.length : VENDOR_ORDERS.filter((o: any) => o.status === f).length}</span></div>
          ))}
        </div>
      </div>

      <div style={{ border: '1px solid var(--hairline)', overflow: 'hidden' }}>
        {/* Table head */}
        {!isMobile && (
          <div style={{ display: 'grid', gridTemplateColumns: '110px 120px 1fr 100px 1fr 120px 80px 110px', gap: 16, padding: '10px 16px', background: 'var(--cream-soft)', borderBottom: '1px solid var(--hairline)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--grey)' }}>
            <div>Order</div><div>Placed</div><div>Buyer / Dest</div><div>Qty</div><div>Product</div><div>Total</div><div>Status</div><div></div>
          </div>
        )}
        {filtered.map((o: any) => (
          <div key={o.id} style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr auto' : '110px 120px 1fr 100px 1fr 120px 80px 110px',
            gap: isMobile ? 8 : 16,
            padding: '14px 16px',
            borderBottom: '1px solid var(--hairline)',
            alignItems: 'center',
            fontSize: 12,
          }}>
            {isMobile ? (
              <>
                <div>
                  <div className="tabular" style={{ fontWeight: 600 }}>{o.id} · {fmtNGN(o.total)}</div>
                  <div className="mono-sm muted">{o.buyer} · {o.dest}</div>
                  <div className="mono-sm muted">{o.product} · qty {o.qty}</div>
                  <div style={{ marginTop: 4 }}><StatusDot status={o.status} /></div>
                </div>
                <button className="fz-pill ghost" style={{ padding: '6px 10px', fontSize: 10 }}>Open</button>
              </>
            ) : (
              <>
                <div className="tabular">{o.id}</div>
                <div className="mono-sm tabular">{o.placed}</div>
                <div>
                  <div>{o.buyer}</div>
                  <div className="mono-sm muted">{o.dest}</div>
                </div>
                <div className="tabular">{o.qty}</div>
                <div className="mono-sm">{o.product}</div>
                <div className="tabular">{fmtNGN(o.total)}</div>
                <div><StatusDot status={o.status} /></div>
                <button className="fz-pill ghost" style={{ padding: '6px 10px', fontSize: 10, justifySelf: 'end' }}>Open →</button>
              </>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', fontSize: 13 }} className="mono-sm muted">No orders found.</div>
        )}
      </div>
    </div>
  );
}

function VDCatalog({ isMobile }: any) {
  const { VENDOR_CATALOG } = useAppData();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: isMobile ? 28 : 36, letterSpacing: '-0.02em' }}>Catalog</h2>
        <button className="fz-pill lime" style={{ padding: '8px 14px', fontSize: 11 }}><span>+ Add piece</span></button>
      </div>
      <div style={{ border: '1px solid var(--hairline)' }}>
        {!isMobile && (
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 100px 110px 100px 110px', gap: 16, padding: '10px 16px', background: 'var(--cream-soft)', borderBottom: '1px solid var(--hairline)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--grey)' }}>
            <div></div><div>Piece</div><div>Price</div><div>Stock</div><div>Status</div><div>Views</div><div>Sold</div><div></div>
          </div>
        )}
        {VENDOR_CATALOG.map((p: any) => (
          <div key={p.id} style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '48px 1fr auto' : '60px 1fr 120px 100px 100px 110px 100px 110px',
            gap: isMobile ? 12 : 16,
            padding: '14px 16px',
            borderBottom: '1px solid var(--hairline)',
            alignItems: 'center',
            fontSize: 12,
          }}>
            <div style={{ width: isMobile ? 48 : 44, height: isMobile ? 56 : 52, background: 'var(--cream-soft)', overflow: 'hidden' }}>
              <img src={p.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {isMobile ? (
              <>
                <div>
                  <div style={{ fontSize: 12 }}>{p.name}</div>
                  <div className="mono-sm muted tabular">{fmtNGN(p.price)} · stock {p.stock} · {p.status}</div>
                  <div className="mono-sm muted tabular">{p.views} views · {p.sold} sold</div>
                </div>
                <button className="fz-pill ghost" style={{ padding: '6px 10px', fontSize: 10 }}>Edit</button>
              </>
            ) : (
              <>
                <div>{p.name}</div>
                <div className="tabular">{fmtNGN(p.price)}</div>
                <div className="tabular" style={{ color: p.stock === 0 ? '#C94F2A' : p.stock <= 2 ? '#B59000' : 'var(--black)' }}>{p.stock}</div>
                <div><StatusDot status={p.status === 'Live' ? 'Shipped' : p.status === 'Out of stock' ? 'To fulfill' : p.status === 'Low stock' ? 'Packed' : 'Delivered'} /></div>
                <div className="tabular muted">{p.views.toLocaleString()}</div>
                <div className="tabular">{p.sold}</div>
                <button className="fz-pill ghost" style={{ padding: '6px 10px', fontSize: 10, justifySelf: 'end' }}>Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function VDInventory({ isMobile }: any) {
  const { VENDOR_CATALOG } = useAppData();
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: isMobile ? 28 : 36, letterSpacing: '-0.02em', marginBottom: 20 }}>Inventory</h2>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <KPI label="Total units" value={VENDOR_CATALOG.reduce((a: any, p: any) => a + p.stock, 0)} sub="across 6 SKUs" tint="sky" />
        <KPI label="Low stock" value={VENDOR_CATALOG.filter((p: any) => p.stock > 0 && p.stock <= 2).length} sub="≤ 2 units" tint="butter" />
        <KPI label="Out of stock" value={VENDOR_CATALOG.filter((p: any) => p.stock === 0).length} sub="needs restock" tint="coral" />
        <KPI label="In draft" value={VENDOR_CATALOG.filter((p: any) => p.status === 'Draft').length} sub="ready to publish" tint="lilac" />
      </div>

      <div style={{ border: '1px solid var(--hairline)' }}>
        {!isMobile && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 1fr 120px', gap: 16, padding: '10px 16px', background: 'var(--cream-soft)', borderBottom: '1px solid var(--hairline)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--grey)' }}>
            <div>Piece</div><div>Stock</div><div>Sold</div><div>Velocity (units/week)</div><div></div>
          </div>
        )}
        {VENDOR_CATALOG.map((p: any) => {
          const velocity = (p.sold / 12).toFixed(1);
          return (
            <div key={p.id} style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr auto' : '1fr 80px 80px 1fr 120px',
              gap: 16, padding: '14px 16px', borderBottom: '1px solid var(--hairline)', alignItems: 'center', fontSize: 12,
            }}>
              <div>
                <div>{p.name}</div>
                {isMobile && <div className="mono-sm muted tabular">stock {p.stock} · {velocity}/wk</div>}
              </div>
              {!isMobile && (
                <>
                  <div className="tabular" style={{ color: p.stock === 0 ? '#C94F2A' : p.stock <= 2 ? '#B59000' : 'var(--black)' }}>{p.stock}</div>
                  <div className="tabular">{p.sold}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: 'var(--cream-soft)', maxWidth: 120 }}>
                      <div style={{ height: '100%', width: `${Math.min(100, (parseFloat(velocity) / 3) * 100)}%`, background: 'var(--black)' }} />
                    </div>
                    <span className="mono-sm tabular">{velocity}</span>
                  </div>
                </>
              )}
              <div style={{ display: 'flex', gap: 6, justifySelf: 'end' }}>
                <button className="fz-pill ghost" style={{ padding: '6px 10px', fontSize: 10 }}>+ Restock</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VDPayouts({ isMobile }: any) {
  const { VENDOR_PAYOUTS } = useAppData();
  const p = VENDOR_PAYOUTS;
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: isMobile ? 28 : 36, letterSpacing: '-0.02em', marginBottom: 20 }}>Payouts</h2>

      <div style={{ border: '1px solid var(--black)', background: 'var(--black)', color: 'var(--cream)', padding: 28, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr auto', gap: 24, alignItems: 'center' }}>
          <div>
            <div className="mono-label" style={{ opacity: 0.6, marginBottom: 10 }}>Current balance</div>
            <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }} className="tabular">{fmtNGN(p.balance)}</div>
            <div className="mono-sm" style={{ opacity: 0.6, marginTop: 8 }} >{fmtUSD(p.balance)}</div>
          </div>
          <div>
            <div className="mono-label" style={{ opacity: 0.6, marginBottom: 10 }}>Next payout</div>
            <div style={{ fontSize: 24, fontWeight: 700 }} className="tabular">{p.nextDate}</div>
            <div className="mono-sm" style={{ opacity: 0.6, marginTop: 8 }}>Bank transfer · Access Bank</div>
          </div>
          <button className="fz-pill ghost" style={{ borderColor: 'var(--cream)', color: 'var(--cream)' }}>Request early</button>
        </div>
      </div>

      <div className="mono-label" style={{ marginBottom: 12 }}>Payout history</div>
      <div style={{ border: '1px solid var(--hairline)' }}>
        {!isMobile && (
          <div style={{ display: 'grid', gridTemplateColumns: '120px 140px 1fr 140px 100px', gap: 16, padding: '10px 16px', background: 'var(--cream-soft)', borderBottom: '1px solid var(--hairline)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--grey)' }}>
            <div>ID</div><div>Date</div><div>Method</div><div>Amount</div><div>Status</div>
          </div>
        )}
        {p.history.map((h: any) => (
          <div key={h.id} style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr auto' : '120px 140px 1fr 140px 100px',
            gap: 16, padding: '14px 16px', borderBottom: '1px solid var(--hairline)', alignItems: 'center', fontSize: 12,
          }}>
            {isMobile ? (
              <>
                <div>
                  <div className="tabular">{h.id} · {h.date}</div>
                  <div className="mono-sm muted">{h.method}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="tabular">{fmtNGN(h.amount)}</div>
                  <div className="mono-sm muted">{h.status}</div>
                </div>
              </>
            ) : (
              <>
                <div className="tabular">{h.id}</div>
                <div className="tabular">{h.date}</div>
                <div className="mono-sm muted">{h.method}</div>
                <div className="tabular">{fmtNGN(h.amount)}</div>
                <div className="mono-sm">{h.status}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function VDAnalytics({ isMobile }: any) {
  const { VENDOR_ANALYTICS } = useAppData();
  const a = VENDOR_ANALYTICS;
  const viewsDelta = ((a.views - a.viewsPrev) / a.viewsPrev) * 100;
  const convDelta = ((a.conversion - a.conversionPrev) / a.conversionPrev) * 100;
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: isMobile ? 28 : 36, letterSpacing: '-0.02em', marginBottom: 20 }}>Analytics</h2>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <KPI label="Storefront views" value={a.views.toLocaleString()} sub="last 30 days" delta={viewsDelta} tint="lime" />
        <KPI label="Conversion rate" value={a.conversion + '%'} sub="views → orders" delta={convDelta} tint="sky" />
        <KPI label="Avg time on store" value={a.avgTime} sub="across all sessions" tint="butter" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        {/* Top pieces */}
        <div style={{ border: '1px solid var(--hairline)', padding: 20 }}>
          <div className="mono-label" style={{ marginBottom: 16 }}>Top pieces by views</div>
          {a.topPieces.map((t: any, i: any) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 60px', gap: 12, padding: '12px 0', borderBottom: i < a.topPieces.length - 1 ? '1px solid var(--hairline)' : 'none', fontSize: 12 }}>
              <div>{t.name}</div>
              <div className="tabular">{t.views.toLocaleString()}</div>
              <div className="tabular muted" style={{ textAlign: 'right' }}>{t.conv}%</div>
            </div>
          ))}
        </div>

        {/* Referrers */}
        <div style={{ border: '1px solid var(--hairline)', padding: 20 }}>
          <div className="mono-label" style={{ marginBottom: 16 }}>Referrers</div>
          {a.referrers.map((r: any, i: any) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                <span>{r.source}</span>
                <span className="tabular muted">{r.pct}%</span>
              </div>
              <div style={{ height: 4, background: 'var(--cream-soft)' }}>
                <div style={{ height: '100%', width: `${r.pct}%`, background: 'var(--black)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VDMessages({ isMobile }: any) {
  const { VENDOR_MESSAGES } = useAppData();
  const [selected, setSelected] = useState(VENDOR_MESSAGES[0].id);
  const msg = VENDOR_MESSAGES.find((m: any) => m.id === selected);
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: isMobile ? 28 : 36, letterSpacing: '-0.02em', marginBottom: 20 }}>Messages</h2>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '360px 1fr', border: '1px solid var(--hairline)', minHeight: 520 }}>
        {/* List */}
        <div style={{ borderRight: isMobile ? 'none' : '1px solid var(--hairline)', borderBottom: isMobile ? '1px solid var(--hairline)' : 'none' }}>
          {VENDOR_MESSAGES.map((m: any) => (
            <div key={m.id} onClick={() => setSelected(m.id)} style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--hairline)',
              cursor: 'pointer',
              background: selected === m.id ? 'var(--cream-soft)' : 'transparent',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: m.unread ? 600 : 400 }}>{m.from}</span>
                <span className="mono-sm muted">{m.time}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: m.unread ? 600 : 500, marginBottom: 4 }}>
                {m.unread && <span style={{ width: 6, height: 6, background: 'var(--black)', borderRadius: '50%', display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }} />}
                {m.subject}
              </div>
              <div className="mono-sm muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.preview}</div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div style={{ padding: 24 }}>
          {msg && (
            <>
              <div style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{msg.subject}</div>
                    <div className="mono-sm muted" style={{ marginTop: 4 }}>From {msg.from} · {msg.time}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="fz-pill ghost" style={{ padding: '6px 10px', fontSize: 10 }}>Archive</button>
                    <button className="fz-pill ghost" style={{ padding: '6px 10px', fontSize: 10 }}>Mark unread</button>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                {msg.preview} This is the body of the message — placeholder for now. In production this would pull the full thread from the messaging service, including attachments and delivery timestamps.
              </div>
              <div style={{ border: '1px solid var(--hairline)', padding: 16 }}>
                <textarea placeholder="Write a reply…" style={{ width: '100%', minHeight: 100, border: 'none', outline: 'none', fontFamily: 'var(--mono)', fontSize: 13, background: 'transparent' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
                  <span className="mono-sm muted">Shift + Enter for new line</span>
                  <button className="fz-pill lime" style={{ padding: '8px 14px', fontSize: 11 }}><span>Send</span><span>→</span></button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function VDReviews({ isMobile }: any) {
  const { VENDOR_REVIEWS } = useAppData();
  const avg: any = VENDOR_REVIEWS.length > 0 ? (VENDOR_REVIEWS.reduce((a: any, r: any) => a + r.rating, 0) / VENDOR_REVIEWS.length).toFixed(1) : '0';
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: isMobile ? 28 : 36, letterSpacing: '-0.02em', marginBottom: 20 }}>Reviews</h2>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <KPI label="Avg rating" value={avg + ' / 5'} sub={`from ${VENDOR_REVIEWS.length} reviews`} tint="lime" />
        <KPI label="5-star" value={VENDOR_REVIEWS.filter((r: any) => r.rating === 5).length} sub={`${VENDOR_REVIEWS.length ? Math.round((VENDOR_REVIEWS.filter((r: any) => r.rating === 5).length / VENDOR_REVIEWS.length) * 100) : 0}% of total`} tint="butter" />
        <KPI label="Response rate" value="100%" sub="reply within 24h" tint="sky" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {VENDOR_REVIEWS.map((r: any) => (
          <div key={r.id} style={{ border: '1px solid var(--hairline)', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{r.buyer}</div>
                <div className="mono-sm muted tabular">{r.product} · {r.date}</div>
              </div>
              <div style={{ fontSize: 18, letterSpacing: 2 }}>{'★'.repeat(r.rating)}<span style={{ color: 'var(--hairline)' }}>{'★'.repeat(5 - r.rating)}</span></div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, fontFamily: 'var(--display)', fontWeight: 500 }}>{r.text}</div>
            <div style={{ marginTop: 12 }}>
              <button className="fz-pill ghost" style={{ padding: '6px 10px', fontSize: 10 }}>Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VDSettings({ isMobile }: any) {
  const { VENDOR_SESSION, VENDORS } = useAppData();
  const s = VENDOR_SESSION;
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: isMobile ? 28 : 36, letterSpacing: '-0.02em', marginBottom: 20 }}>Storefront settings</h2>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ border: '1px solid var(--hairline)', padding: 20 }}>
          <div className="mono-label" style={{ marginBottom: 16 }}>Studio profile</div>
          <Field label="Studio name" value={s.vendorName} />
          <Field label="Contact" value={s.contactName} />
          <Field label="Email" value={s.email} />
          <Field label="Phone" value={s.phone} />
          <Field label="City" value={s.city} />
        </div>
        <div style={{ border: '1px solid var(--hairline)', padding: 20 }}>
          <div className="mono-label" style={{ marginBottom: 16 }}>Bio · public</div>
          <textarea defaultValue={s.bio} style={{ width: '100%', minHeight: 140, border: '1px solid var(--hairline)', padding: 12, fontFamily: 'var(--mono)', fontSize: 12, background: 'var(--cream)', outline: 'none', resize: 'vertical' }} />
          <div className="mono-sm muted" style={{ marginTop: 8 }}>Shown on your public vendor page.</div>
        </div>
      </div>

      <div style={{ border: '1px solid var(--hairline)', padding: 20, marginBottom: 24 }}>
        <div className="mono-label" style={{ marginBottom: 16 }}>Hero image</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: 20, alignItems: 'center' }}>
          <div style={{ aspectRatio: '4 / 5', background: 'var(--cream-soft)', overflow: 'hidden' }}>
            <img src={VENDORS.find((v: any) => v.id === s.vendorId)?.hero} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div className="mono-sm muted" style={{ marginBottom: 12 }}>Replace the hero image shown at the top of your public storefront. 4:5 aspect, min 1200px wide, under 3MB.</div>
            <button className="fz-pill ghost" style={{ padding: '8px 12px', fontSize: 11 }}>Upload new</button>
          </div>
        </div>
      </div>

      <div style={{ border: '1px solid var(--hairline)', padding: 20 }}>
        <div className="mono-label" style={{ marginBottom: 16 }}>Shipping zones</div>
        <div>
          {[
            ['Nigeria — GIG Logistics', 'Lagos 2 days · Upcountry 4 days', '₦8,500 flat · free over ₦150k'],
            ['USA / Canada — DHL Express', '7 working days door-to-door', '$35 under $500 · $50 above'],
            ['UK — DHL Express', '6 working days door-to-door', '£28 under £400 · £42 above'],
            ['EU — DHL Express', '7 working days door-to-door', '€32 under €450 · €48 above'],
          ].map((z, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr auto', gap: 16, padding: '14px 0', borderTop: i > 0 ? '1px solid var(--hairline)' : 'none', fontSize: 12, alignItems: 'center' }}>
              <div style={{ fontWeight: 500 }}>{z[0]}</div>
              <div className="mono-sm muted">{z[1]}</div>
              <div className="mono-sm muted tabular">{z[2]}</div>
              <button className="fz-pill ghost" style={{ padding: '6px 10px', fontSize: 10 }}>Edit</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: any) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--hairline)', alignItems: 'center', fontSize: 12 }}>
      <div className="mono-sm muted">{label}</div>
      <input defaultValue={value} style={{ fontFamily: 'var(--mono)', fontSize: 12, border: 'none', background: 'transparent', outline: 'none', width: '100%' }} />
    </div>
  );
}
