import React from 'react';
import { fmtNGN, fmtUSD } from '../../lib/formatters';

export function CartDrawer({ open, close, cart, removeFromCart, updateQty, setRoute }: any) {
  const subtotal = cart.reduce((s: number, i: any) => s + i.price * (i.qty || 1), 0);
  const shipping = subtotal > 150000 ? 0 : 8500;
  const total = subtotal + shipping;

  return (
    <>
      <div className={`drawer-backdrop ${open ? 'open' : ''}`} onClick={close} />
      <div className={`drawer ${open ? 'open' : ''}`}>
        {/* Header */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="sticker lime">Bag · {cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
          <span className="mono-label" onClick={close} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 'var(--icon-sm)', marginTop: -2 }}>×</span> Close
          </span>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {cart.length === 0 && (
            <div style={{ padding: '80px 24px', textAlign: 'left' }}>
              <div className="fz-headline" style={{ fontSize: 44, marginBottom: 16 }}>Your bag is <span className="it">empty</span>.</div>
              <div className="mono-sm muted" style={{ marginBottom: 32 }}>
                Nothing has been added yet. The edit is waiting.
              </div>
              <button className="fz-pill ghost" onClick={() => { close(); setRoute('listing'); }}><span>Browse the edit</span><span className="dot">→</span></button>
            </div>
          )}
          {cart.map((item: any, idx: number) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 20, padding: '24px', borderBottom: '1px solid var(--hairline)' }}>
              <div className="placeholder has-img" style={{ aspectRatio: '4 / 5', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
                <img src={item.img} alt={item.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
                <div className="mono-label muted" style={{ fontSize: 10 }}>{item.vendor}</div>
                <div className="mono-sm" style={{ fontWeight: 500 }}>{item.name}</div>
                <div className="mono-sm muted">Size {item.size || 'M'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                  <div style={{ display: 'inline-flex', border: '1px solid var(--hairline)', borderRadius: 999, overflow: 'hidden', flexShrink: 0, height: 28, alignItems: 'center' }}>
                    <button style={{ padding: '0 10px', height: '100%', fontSize: 'var(--icon-sm)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => updateQty(idx, Math.max(1, (item.qty || 1) - 1))}>−</button>
                    <span className="mono-sm tabular" style={{ padding: '0 8px', minWidth: '24px', textAlign: 'center' }}>{item.qty || 1}</span>
                    <button style={{ padding: '0 10px', height: '100%', fontSize: 'var(--icon-sm)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => updateQty(idx, (item.qty || 1) + 1)}>+</button>
                  </div>
                  <span className="mono-sm muted" style={{ cursor: 'pointer', textDecoration: 'underline', fontSize: 12 }} onClick={() => removeFromCart(idx)}>Remove</span>
                </div>
              </div>
              <div className="mono-sm tabular">{fmtNGN(item.price * (item.qty || 1))}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--hairline)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="mono-sm muted">Subtotal</span>
              <span className="mono-sm tabular">{fmtNGN(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="mono-sm muted">Shipping — Nigeria</span>
              <span className="mono-sm tabular">{shipping === 0 ? 'Complimentary' : fmtNGN(shipping)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 16, borderTop: '1px solid var(--hairline)', marginBottom: 4 }}>
              <span className="mono-label">Total</span>
              <span className="tabular" style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 44, letterSpacing: '-0.04em' }}>{fmtNGN(total)}</span>
            </div>
            <div className="mono-sm muted tabular" style={{ textAlign: 'right', marginBottom: 20 }}>≈ {fmtUSD(total)} for diaspora orders</div>
            <button className="fz-pill lime" style={{ width: '100%', justifyContent: 'space-between' }} onClick={() => { close(); setRoute('checkout'); }}>
              <span>Checkout</span>
              <span className="dot">→</span>
            </button>
            <div className="mono-sm muted" style={{ marginTop: 12, textAlign: 'center' }}>
              Paystack / Flutterwave / card · Free returns within 14 days
            </div>
          </div>
        )}
      </div>
    </>
  );
}

