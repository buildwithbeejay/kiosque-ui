import React, { useState as useCkState } from 'react';
import { fmtNGN, fmtUSD } from '../lib/formatters';
import { useToast } from '../lib/ToastContext';
import { useAppData } from '../lib/DataProvider';
import { apiCreateOrder } from '../lib/api';

const CK_STEPS = ['bag', 'address', 'shipping', 'payment', 'done'];

const SHIPPING_OPTIONS_NG = [
  { id: 'gig-std',   name: 'GIG Standard',   eta: '3 — 5 days',  price: 4500, hint: 'Lagos & major cities' },
  { id: 'gig-exp',   name: 'GIG Express',    eta: '1 — 2 days',  price: 9500, hint: 'Same-day pickup, next-day metro' },
  { id: 'pickup',    name: 'Studio pickup',  eta: 'Same day',    price: 0,    hint: 'Yaba, Lagos · M–F 10–6' },
];
const SHIPPING_OPTIONS_INTL = [
  { id: 'dhl-exp',   name: 'DHL Express',    eta: '4 — 7 days',  price: 18500, hint: 'Tracked, with duties paid' },
  { id: 'dhl-std',   name: 'DHL Standard',   eta: '8 — 12 days', price: 9500,  hint: 'Tracked, duties on delivery' },
];

function CkStepBar({ active }: { active: string }) {
  const labels = ['Bag', 'Address', 'Shipping', 'Payment'];
  const i = CK_STEPS.indexOf(active);
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
      {labels.map((l, idx) => {
        const reached = idx <= i;
        return (
          <div key={l} style={{ flex: 1 }}>
            <div style={{ height: 4, borderRadius: 999, background: reached ? 'var(--ink)' : 'var(--hairline)', transition: 'background 320ms' }} />
            <div className="mono-label" style={{ fontSize: 10, marginTop: 8, color: reached ? 'var(--ink)' : 'var(--grey)' }}>
              {String(idx + 1).padStart(2, '0')} · {l}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CkSummary({ cart, ship, isMobile }: any) {
  const subtotal = cart.reduce((s: number, i: any) => s + i.price * (i.qty || 1), 0);
  const shippingCost = ship ? ship.price : 0;
  const total = subtotal + shippingCost;
  return (
    <div className={`fz-card tinted-soft`} style={{ padding: 'clamp(20px, 2.4vw, 28px)' }}>
      <div className="mono-label" style={{ marginBottom: 16, fontSize: 11 }}>Order summary</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
        {cart.map((it: any, idx: number) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 12, alignItems: 'center' }}>
            <div style={{ aspectRatio: '4 / 5', borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--cream)' }}>
              {it.img && <img src={it.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="mono-label muted" style={{ fontSize: 9 }}>{it.vendor}</div>
              <div className="mono-sm" style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
              <div className="mono-sm muted" style={{ fontSize: 10 }}>Size {it.size || 'M'} · Qty {it.qty || 1}</div>
            </div>
            <div className="mono-sm tabular" style={{ fontSize: 12 }}>{fmtNGN(it.price * (it.qty || 1))}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Row k="Subtotal" v={fmtNGN(subtotal)} />
        <Row k={ship ? `Shipping · ${ship.name}` : 'Shipping'} v={ship ? (shippingCost === 0 ? 'Complimentary' : fmtNGN(shippingCost)) : '—'} />
        <Row k="Duties & taxes" v="Calculated at delivery" small />
        <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="mono-label">Total</span>
          <span className="tabular" style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 28, letterSpacing: '-0.03em' }}>{fmtNGN(total)}</span>
        </div>
        <div className="mono-sm muted tabular" style={{ textAlign: 'right', fontSize: 10 }}>≈ {fmtUSD(total)}</div>
      </div>
    </div>
  );
}

function Row({ k, v, small }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span className="mono-sm muted" style={{ fontSize: small ? 10 : 12 }}>{k}</span>
      <span className={`mono-sm ${small ? 'muted' : 'tabular'}`} style={{ fontSize: small ? 10 : 12 }}>{v}</span>
    </div>
  );
}

function CkInput({ label, value, onChange, type = 'text', placeholder, full }: any) {
  return (
    <label style={{ display: 'block', gridColumn: full ? '1 / -1' : 'auto' }}>
      <div className="mono-label" style={{ fontSize: 10, marginBottom: 6 }}>{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} type={type} placeholder={placeholder}
        style={{
          width: '100%', padding: '12px 14px', fontFamily: 'var(--mono)', fontSize: 13,
          background: 'var(--cream)', border: '1px solid var(--hairline-strong)',
          borderRadius: 12, outline: 'none', transition: 'border-color 200ms',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--ink)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--hairline-strong)')}
      />
    </label>
  );
}

function CkBag({ cart, removeFromCart, updateQty, onContinue }: any) {
  if (cart.length === 0) {
    return (
      <div style={{ padding: 'clamp(48px, 8vw, 96px) 0', textAlign: 'center' }}>
        <span className="sticker out" style={{ marginBottom: 20, display: 'inline-block' }}>Empty</span>
        <h2 className="fz-headline" style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: 14 }}>
          Your bag is <span className="it">light</span>.
        </h2>
        <p className="mono-sm muted" style={{ marginBottom: 32 }}>Start with the edit — twelve hand-picked pieces this week.</p>
      </div>
    );
  }
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {cart.map((it: any, idx: number) => (
          <div key={idx} className="fz-card" style={{ padding: 'clamp(14px, 2vw, 20px)', display: 'grid', gridTemplateColumns: 'clamp(80px, 12vw, 120px) 1fr', gap: 'clamp(14px, 2vw, 20px)', alignItems: 'center' }}>
            <div style={{ aspectRatio: '4 / 5', borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--cream-soft)' }}>
              {it.img && <img src={it.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="mono-label muted" style={{ fontSize: 10 }}>{it.vendor}</div>
              <div className="mono-md" style={{ fontWeight: 500, marginTop: 4 }}>{it.name}</div>
              <div className="mono-sm muted" style={{ marginTop: 4, fontSize: 11 }}>Size {it.size || 'M'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--hairline-strong)', borderRadius: 999, overflow: 'hidden', height: 36 }}>
                  <button style={{ padding: '0 12px', height: '100%' }} onClick={() => updateQty(idx, Math.max(1, (it.qty || 1) - 1))}>−</button>
                  <span className="mono-sm tabular" style={{ padding: '0 12px', minWidth: 24, textAlign: 'center' }}>{it.qty || 1}</span>
                  <button style={{ padding: '0 12px', height: '100%' }} onClick={() => updateQty(idx, (it.qty || 1) + 1)}>+</button>
                </div>
                <span onClick={() => removeFromCart(idx)} className="mono-sm" style={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3, fontSize: 11 }}>Remove</span>
                <span className="mono-md tabular" style={{ marginLeft: 'auto', fontWeight: 600 }}>{fmtNGN(it.price * (it.qty || 1))}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 28 }}>
        <button className="fz-pill lime" onClick={onContinue} style={{ width: '100%', justifyContent: 'space-between' }}>
          <span>Continue to address</span><span className="dot">→</span>
        </button>
      </div>
    </div>
  );
}

function CkAddress({ addr, setAddr, isMobile, onContinue, onBack }: any) {
  const set = (k: string, v: string) => setAddr({ ...addr, [k]: v });
  const isIntl = addr.country && addr.country !== 'Nigeria';
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 16 }}>
        <CkInput label="First name" value={addr.first || ''} onChange={(v: string) => set('first', v)} placeholder="Adaeze" />
        <CkInput label="Last name" value={addr.last || ''} onChange={(v: string) => set('last', v)} placeholder="Onyemechi" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginBottom: 16 }}>
        <CkInput label="Email" value={addr.email || ''} onChange={(v: string) => set('email', v)} type="email" placeholder="you@email.com" />
        <CkInput label="Phone" value={addr.phone || ''} onChange={(v: string) => set('phone', v)} placeholder="+234 ..." />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginBottom: 16 }}>
        <CkInput label="Address line 1" value={addr.line1 || ''} onChange={(v: string) => set('line1', v)} placeholder="Street + number" />
        <CkInput label="Address line 2 (optional)" value={addr.line2 || ''} onChange={(v: string) => set('line2', v)} placeholder="Apt, suite, area" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
        <CkInput label="City" value={addr.city || ''} onChange={(v: string) => set('city', v)} placeholder="Lagos" />
        <CkInput label="State / region" value={addr.region || ''} onChange={(v: string) => set('region', v)} placeholder="Lagos" />
        <CkInput label="Postal code" value={addr.zip || ''} onChange={(v: string) => set('zip', v)} placeholder="100001" />
        <label>
          <div className="mono-label" style={{ fontSize: 10, marginBottom: 6 }}>Country</div>
          <select value={addr.country || 'Nigeria'} onChange={(e) => set('country', e.target.value)}
            style={{ width: '100%', padding: '12px 14px', fontFamily: 'var(--mono)', fontSize: 13, background: 'var(--cream)', border: '1px solid var(--hairline-strong)', borderRadius: 12, outline: 'none' }}>
            {['Nigeria','Ghana','Kenya','South Africa','United Kingdom','United States','Canada','Germany','France','Other'].map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 10, marginTop: 20 }}>
        <button className="fz-pill ghost" onClick={onBack} style={{ justifyContent: 'space-between' }}>
          <span><span className="dot" style={{ background: 'transparent', color: 'var(--ink)' }}>←</span> Back to bag</span>
        </button>
        <button className="fz-pill lime" onClick={onContinue} style={{ flex: 1, justifyContent: 'space-between' }}>
          <span>Continue to shipping {isIntl && '· international'}</span><span className="dot">→</span>
        </button>
      </div>
    </div>
  );
}

function CkShipping({ addr, ship, setShip, isMobile, onContinue, onBack }: any) {
  const opts = (addr.country && addr.country !== 'Nigeria') ? SHIPPING_OPTIONS_INTL : SHIPPING_OPTIONS_NG;
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {opts.map(o => {
          const active = ship && ship.id === o.id;
          return (
            <div key={o.id} onClick={() => setShip(o)} className={`fz-card ${active ? 'tinted-soft' : ''}`}
              style={{ padding: 'clamp(14px, 2vw, 20px)', cursor: 'pointer', display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 16, alignItems: 'center', borderColor: active ? 'var(--ink)' : undefined }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid ' + (active ? 'var(--ink)' : 'var(--hairline-strong)'), display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {active && <span style={{ width: 9, height: 9, background: 'var(--ink)', borderRadius: '50%' }} />}
              </span>
              <div>
                <div className="mono-md" style={{ fontWeight: 600 }}>{o.name}</div>
                <div className="mono-sm muted" style={{ marginTop: 2, fontSize: 11 }}>{o.eta} · {o.hint}</div>
              </div>
              <div className="mono-md tabular" style={{ fontWeight: 600 }}>{o.price === 0 ? 'Free' : fmtNGN(o.price)}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 10, marginTop: 20 }}>
        <button className="fz-pill ghost" onClick={onBack}><span><span className="dot" style={{ background: 'transparent' }}>←</span> Back</span></button>
        <button className="fz-pill lime" onClick={onContinue} disabled={!ship} style={{ flex: 1, justifyContent: 'space-between', opacity: ship ? 1 : 0.55 }}>
          <span>Continue to payment</span><span className="dot">→</span>
        </button>
      </div>
    </div>
  );
}

function CkPayment({ payment, setPayment, isMobile, onPlace, onBack, placing }: any) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 22 }}>
        {[
          { id: 'paystack', label: 'Paystack', sub: 'Cards · transfer · USSD' },
          { id: 'flutter',  label: 'Flutterwave', sub: 'Cards · bank · mobile money' },
          { id: 'card',     label: 'Direct card', sub: 'Visa · Mastercard · Verve' },
        ].map(m => {
          const active = payment.method === m.id;
          return (
            <div key={m.id} onClick={() => setPayment({ ...payment, method: m.id })} className="fz-card"
              style={{ padding: 16, cursor: 'pointer', borderColor: active ? 'var(--ink)' : undefined, background: active ? 'var(--cream-soft)' : undefined, textAlign: 'center' }}>
              <div className="mono-label" style={{ fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{m.label}</div>
              <div className="mono-sm muted" style={{ fontSize: 10 }}>{m.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="fz-card" style={{ padding: 'clamp(18px, 2.4vw, 24px)' }}>
        <CkInput label="Cardholder name" value={payment.name || ''} onChange={(v: string) => setPayment({ ...payment, name: v })} placeholder="As shown on card" full />
        <div style={{ marginTop: 14 }}>
          <CkInput label="Card number" value={payment.card || ''} onChange={(v: string) => setPayment({ ...payment, card: v })} placeholder="4242 4242 4242 4242" full />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr', gap: 14, marginTop: 14 }}>
          <CkInput label="Expiry" value={payment.exp || ''} onChange={(v: string) => setPayment({ ...payment, exp: v })} placeholder="MM / YY" />
          <CkInput label="CVC" value={payment.cvc || ''} onChange={(v: string) => setPayment({ ...payment, cvc: v })} placeholder="123" />
          <CkInput label="ZIP / Postal" value={payment.zip || ''} onChange={(v: string) => setPayment({ ...payment, zip: v })} placeholder="100001" />
        </div>
      </div>

      <div style={{ marginTop: 18, padding: 14, background: 'var(--cream-soft)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 14 }}>🔒</span>
        <span className="mono-sm muted" style={{ fontSize: 11, lineHeight: 1.4 }}>Encrypted end-to-end. We never store your card details on our servers.</span>
      </div>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 10, marginTop: 20 }}>
        <button className="fz-pill ghost" onClick={onBack}><span><span className="dot" style={{ background: 'transparent' }}>←</span> Back</span></button>
        <button className="fz-pill lime" onClick={onPlace} disabled={!payment.method || placing} style={{ flex: 1, justifyContent: 'space-between', opacity: (payment.method && !placing) ? 1 : 0.55 }}>
          <span>{placing ? 'Placing order…' : 'Place order'}</span><span className="dot">{placing ? '⟳' : '→'}</span>
        </button>
      </div>
    </div>
  );
}

function CkDone({ order, setRoute }: any) {
  return (
    <div style={{ textAlign: 'left' }}>
      <span className="sticker lime" style={{ marginBottom: 24, display: 'inline-block' }}>Confirmed · {order.id}</span>
      <h2 className="fz-headline" style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: 14 }}>
        Thank you, <span className="it">{order.addr.first || 'friend'}</span>.
      </h2>
      <p className="mono-md muted" style={{ marginBottom: 32, maxWidth: 460 }}>
        We're packing your order in Yaba. You'll get an email with tracking once it ships.
      </p>

      <div className="fz-card" style={{ padding: 'clamp(20px, 2.6vw, 28px)', marginBottom: 24 }}>
        <div className="mono-label" style={{ fontSize: 11, marginBottom: 14 }}>What's next</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['01', 'You\'ll get a confirmation email at ' + (order.addr.email || 'your address')],
            ['02', `We pack and dispatch via ${order.ship.name}`],
            ['03', `Tracking link goes live · ETA ${order.ship.eta}`],
            ['04', 'Free 14-day returns from delivery'],
          ].map(([n, t]) => (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 12, alignItems: 'baseline' }}>
              <span className="mono-sm tabular muted">{n}</span>
              <span className="mono-sm" style={{ fontSize: 12, lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <button className="fz-pill" onClick={() => setRoute('account')}><span>View order</span><span className="dot">→</span></button>
        <button className="fz-pill ghost" onClick={() => setRoute('listing')}><span>Keep browsing</span><span className="dot">◆</span></button>
      </div>
    </div>
  );
}

export function Checkout({ setRoute, cart, removeFromCart, updateQty, isMobile, user, clearCart }: any) {
  const { showToast, updateToast } = useToast();
  const { setOrders: setGlobalOrders } = useAppData();
  const [step, setStep] = useCkState('bag');
  const [addr, setAddr] = useCkState({
    first: user?.name?.split(' ')[0] || '',
    last:  user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    country: 'Nigeria',
  });
  const [ship, setShip] = useCkState<any>(null);
  const [payment, setPayment] = useCkState<any>({ method: 'paystack' });
  const [placing, setPlacing] = useCkState(false);
  const [order, setOrder] = useCkState<any>(null);

  const place = () => {
    setPlacing(true);
    const toastId = showToast({
      title: 'Securing Gateway Connection',
      description: `Authorizing amount with ${payment?.method?.toUpperCase() || 'PAYSTACK'}...`,
      variant: 'pending',
      duration: 0
    });
    
    setTimeout(async () => {
      const o = {
        id: 'KQ-' + String(Math.floor(100000 + Math.random() * 900000)),
        addr, ship, items: cart,
        total: cart.reduce((s: number, i: any) => s + i.price * (i.qty || 1), 0) + (ship?.price || 0),
        placedAt: Date.now(),
      };

      try {
        const updatedOrders = await apiCreateOrder(o);
        if (setGlobalOrders) setGlobalOrders(updatedOrders);
        
        setOrder(o);
        if (clearCart) clearCart();
        setStep('done');
        setPlacing(false);
        window.scrollTo(0, 0);
        
        updateToast(toastId, {
          title: 'Payment Confirmed',
          description: `Order ${o.id} created. Your curated pieces are now in production.`,
          variant: 'success',
          duration: 5000
        });
      } catch (err) {
        setPlacing(false);
        updateToast(toastId, {
          title: 'Authorization Refused',
          description: 'The transaction gateway rejected the handshake. Please try again.',
          variant: 'error',
          duration: 4000
        });
      }
    }, 1800);
  };

  return (
    <div className="page" style={{ background: 'var(--cream)' }}>
      {/* Top bar */}
      <div style={{ padding: 'clamp(14px, 2.4vw, 24px) clamp(16px, 3vw, 32px)', borderBottom: '1px solid var(--hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div onClick={() => setRoute('home')} style={{ cursor: 'pointer', fontFamily: 'var(--display)', fontWeight: 900, fontSize: 22, letterSpacing: '-0.04em' }}>
          Kiosque<span style={{ color: 'var(--coral)' }}>.</span>
        </div>
        <span className="mono-label muted" style={{ fontSize: 10 }}>Checkout · {step === 'done' ? 'complete' : `${CK_STEPS.indexOf(step) + 1} of 4`}</span>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(24px, 5vw, 64px) clamp(16px, 3vw, 32px)' }}>
        {step === 'done' ? (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: 'clamp(24px, 4vw, 56px)', alignItems: 'start' }}>
            <CkDone order={order} setRoute={setRoute} />
            <CkSummary cart={order.items} ship={order.ship} isMobile={isMobile} />
          </div>
        ) : (
          <>
            <div style={{ maxWidth: 720, margin: '0 auto 28px' }}>
              <CkStepBar active={step} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: 'clamp(24px, 4vw, 56px)', alignItems: 'start' }}>
              {/* Form column */}
              <div>
                <h1 className="fz-headline" style={{ fontSize: 'clamp(36px, 4vw, 56px)', marginBottom: 8 }}>
                  {step === 'bag'      && <>Your <span className="it">bag</span>.</>}
                  {step === 'address'  && <>Where <span className="it">to</span>?</>}
                  {step === 'shipping' && <>How <span className="it">fast</span>?</>}
                  {step === 'payment'  && <>Final <span className="it">step</span>.</>}
                </h1>
                <p className="mono-sm muted" style={{ marginBottom: 28, fontSize: 12 }}>
                  {step === 'bag'      && 'Review what you\'re taking home.'}
                  {step === 'address'  && 'We ship from Lagos. Tell us where it\'s going.'}
                  {step === 'shipping' && 'Pick a speed. Free options are available for studio pickup and orders over ₦150k.'}
                  {step === 'payment'  && 'Encrypted card payment. Naira pricing, all major cards accepted.'}
                </p>

                {step === 'bag'      && <CkBag cart={cart} removeFromCart={removeFromCart} updateQty={updateQty} isMobile={isMobile} onContinue={() => setStep('address')} />}
                {step === 'address'  && <CkAddress addr={addr} setAddr={setAddr} isMobile={isMobile} onContinue={() => setStep('shipping')} onBack={() => setStep('bag')} />}
                {step === 'shipping' && <CkShipping addr={addr} ship={ship} setShip={setShip} isMobile={isMobile} onContinue={() => setStep('payment')} onBack={() => setStep('address')} />}
                {step === 'payment'  && <CkPayment payment={payment} setPayment={setPayment} isMobile={isMobile} onPlace={place} onBack={() => setStep('shipping')} placing={placing} />}
              </div>

              {/* Summary column */}
              <div style={{ position: isMobile ? 'static' : 'sticky', top: 'clamp(80px, 10vh, 120px)' }}>
                <CkSummary cart={cart} ship={ship} isMobile={isMobile} />
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
