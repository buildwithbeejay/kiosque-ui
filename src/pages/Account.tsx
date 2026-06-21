import React, { useState as _accUseState } from 'react';
import { fmtNGN, fmtUSD } from '../lib/formatters';
import { useAppData } from '../lib/DataProvider';
import { ProductCard } from '../components/product/ProductCard';
import { Img } from '../components/ui/Img';
import { saveUser } from './Auth';
import { useToast } from '../lib/ToastContext';
import {
  apiUpdateNotificationPrefs,
  apiAddAddress,
  apiUpdateAddress,
  apiDeleteAddress,
  apiAddPaymentMethod
} from '../lib/api';

export function Account({ setRoute, setActiveProduct, setActiveVendor, setActiveOrder, isMobile, user, logout }: any) {
  const { CURRENT_USER, ORDERS, FOLLOWING, ADDRESSES, PAYMENT_METHODS, NOTIFICATION_PREFS, SAVED, PRODUCTS, VENDORS } = useAppData();
  const [tab, setTab] = _accUseState('overview');
  
  const displayUser = user || CURRENT_USER;

  const handleSignOut = () => {
    logout();
  };

  const tabs = [
    ['overview', 'Overview'],
    ['orders', 'Orders'],
    ['saved', 'Saved'],
    ['following', 'Following'],
    ['addresses', 'Addresses'],
    ['payment', 'Payment'],
    ['notifications', 'Notifications'],
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Masthead */}
      <section style={{ padding: isMobile ? '96px 20px 40px' : '120px 32px 56px', borderBottom: '1px solid var(--hairline)' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <span className="sticker lime">Member · {CURRENT_USER.memberNumber}</span>
          <span className="sticker out">Since {CURRENT_USER.memberSince}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: 40, alignItems: 'end' }}>
          <div>
            <h1 className="fz-headline" style={{ fontSize: isMobile ? 64 : 'clamp(80px, 9vw, 156px)' }}>
              Good <span className="it">morning,</span><br />{displayUser.name.split(' ')[0]}.
            </h1>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginTop: 28 }}>
              <div className="mono-md muted">
                {ORDERS.length} orders · {FOLLOWING.length} vendors followed
              </div>
              <button className="mono-sm sign-out-btn" onClick={handleSignOut} style={{ background: 'none', border: 'none', color: 'var(--coral)', textDecoration: 'underline', cursor: 'pointer', fontSize: 13 }}>Sign out</button>
            </div>
          </div>
          <div className="fz-card tinted-lime" style={{ minWidth: 240, padding: 24 }}>
            <div className="mono-label" style={{ marginBottom: 8 }}>Store credit</div>
            <div className="tabular" style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 44, letterSpacing: '-0.04em', lineHeight: 1 }}>{fmtNGN(displayUser.storeCredit || 0)}</div>
            <div className="mono-sm tabular" style={{ marginTop: 6, opacity: 0.7 }}>{fmtUSD(displayUser.storeCredit || 0)}</div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ padding: isMobile ? '0 20px' : '0 32px', borderBottom: '1px solid var(--hairline)', overflowX: 'auto' }} className="no-scrollbar">
        <div style={{ display: 'flex', gap: 0 }}>
          {tabs.map(([id, label]) => (
            <div key={id} onClick={() => setTab(id)}
              className="mono-label account-tab"
              style={{
                padding: '20px 28px 20px 0',
                cursor: 'pointer',
                marginRight: 32,
                color: tab === id ? 'var(--black)' : 'var(--grey)',
                borderBottom: tab === id ? '1px solid var(--black)' : '1px solid transparent',
                marginBottom: -1,
                whiteSpace: 'nowrap',
              }}>{label}</div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: isMobile ? '40px 20px 80px' : '80px 32px 160px', maxWidth: 1600, margin: '0 auto' }}>
        {tab === 'overview' && <AccountOverview setRoute={setRoute} setTab={setTab} setActiveProduct={setActiveProduct} setActiveVendor={setActiveVendor} setActiveOrder={setActiveOrder} isMobile={isMobile} />}
        {tab === 'orders' && <AccountOrders isMobile={isMobile} setRoute={setRoute} setActiveOrder={setActiveOrder} />}
        {tab === 'saved' && <AccountSaved setRoute={setRoute} setActiveProduct={setActiveProduct} isMobile={isMobile} />}
        {tab === 'following' && <AccountFollowing setRoute={setRoute} setActiveVendor={setActiveVendor} isMobile={isMobile} />}
        {tab === 'addresses' && <AccountAddresses isMobile={isMobile} />}
        {tab === 'payment' && <AccountPayment isMobile={isMobile} />}
        {tab === 'notifications' && <AccountNotifications isMobile={isMobile} />}
      </div>
    </div>
  );
}

function AccountOverview({ setRoute, setTab, setActiveProduct, setActiveVendor, setActiveOrder, isMobile }: any) {
  const { ORDERS, SAVED, FOLLOWING, ADDRESSES, PAYMENT_METHODS, CURRENT_USER } = useAppData();
  const lastOrder = ORDERS[0];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 64 }}>
      {/* Last order — feature */}
      <div>
        <div className="mono-label muted" style={{ marginBottom: 16 }}>— Most recent / in transit</div>
        <div style={{ border: '1px solid var(--hairline)', padding: isMobile ? 24 : 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="mono-label">Order {lastOrder.id}</div>
              <div className="mono-sm muted tabular" style={{ marginTop: 6 }}>Placed {lastOrder.date}</div>
            </div>
            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <div className="mono-label">{lastOrder.status}</div>
              <div className="mono-sm muted" style={{ marginTop: 6 }}>{lastOrder.ship}</div>
            </div>
          </div>

          {/* Tracking */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginBottom: 40 }}>
            {['Placed', 'Packed', 'In transit', 'Delivered'].map((step, i) => {
              const current = 2;
              const done = i <= current;
              return (
                <div key={step} style={{ borderTop: `2px solid ${done ? 'var(--black)' : 'var(--hairline)'}`, paddingTop: 12 }}>
                  <div className="mono-sm tabular" style={{ color: done ? 'var(--black)' : 'var(--grey)' }}>0{i + 1}</div>
                  <div className="mono-label" style={{ color: done ? 'var(--black)' : 'var(--grey)', marginTop: 4 }}>{step}</div>
                </div>
              );
            })}
          </div>

          {/* Items */}
          <div>
            {lastOrder.items.map((it: any) => (
              <div key={it.productId} style={{ display: 'grid', gridTemplateColumns: '88px 1fr auto', gap: 20, padding: '20px 0', borderTop: '1px solid var(--hairline)', alignItems: 'center' }}>
                <Img src={it.img} style={{ aspectRatio: '1 / 1', background: 'var(--cream-soft)' }} />
                <div>
                  <div className="mono-label muted">{it.vendor}</div>
                  <div className="mono-md" style={{ marginTop: 4 }}>{it.name}</div>
                  <div className="mono-sm muted tabular" style={{ marginTop: 4 }}>Size {it.size} · Qty {it.qty}</div>
                </div>
                <div className="mono-md tabular">{fmtNGN(it.price)}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
            <button className="fz-pill lime" onClick={() => { setActiveOrder(lastOrder); setRoute('track'); }}><span>Track package</span><span>→</span></button>
            <button className="fz-pill ghost" onClick={() => setTab('orders')}>All orders</button>
          </div>
        </div>
      </div>

      {/* Sidebar — quick links */}
      <div>
        <div className="mono-label muted" style={{ marginBottom: 16 }}>— Shortcuts</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            ['Saved pieces', SAVED.length + ' pieces', () => setTab('saved')],
            ['Archive', 'Public wishlist', () => setRoute('wishlist')],
            ['Following', FOLLOWING.length + ' vendors', () => setTab('following')],
            ['Addresses', ADDRESSES.length + ' on file', () => setTab('addresses')],
            ['Payment', PAYMENT_METHODS.length + ' methods', () => setTab('payment')],
            ['Store credit', fmtNGN(CURRENT_USER.storeCredit), () => setTab('overview')],
          ].map(([label, meta, fn]: any, i: number) => (
            <div key={i} onClick={fn} className="account-shortcut" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--hairline)', cursor: 'pointer' }}>
              <div className="mono-md">{label}</div>
              <div className="mono-sm muted tabular">{meta} →</div>
            </div>
          ))}
        </div>

        <div className="mono-label muted" style={{ marginTop: 48, marginBottom: 16 }}>— Fit profile</div>
        <div style={{ border: '1px solid var(--hairline)', padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 20 }}>
            <div><div className="mono-label muted" style={{ marginBottom: 4 }}>Top</div><div className="display" style={{ fontSize: 32, fontWeight: 800 }}>{CURRENT_USER.sizeProfile.top}</div></div>
            <div><div className="mono-label muted" style={{ marginBottom: 4 }}>Bottom</div><div className="display" style={{ fontSize: 32, fontWeight: 800 }}>{CURRENT_USER.sizeProfile.bottom}</div></div>
            <div><div className="mono-label muted" style={{ marginBottom: 4 }}>Shoe</div><div className="display" style={{ fontSize: 32, fontWeight: 800 }}>{CURRENT_USER.sizeProfile.shoe}</div></div>
          </div>
          <div className="mono-sm muted" style={{ borderTop: '1px solid var(--hairline)', paddingTop: 16 }}>
            {CURRENT_USER.sizeProfile.notes}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountOrders({ isMobile, setRoute, setActiveOrder }: any) {
  const { ORDERS } = useAppData();
  const [viewingOrder, setViewingOrder] = React.useState<any>(null);

  if (viewingOrder) {
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <button className="fz-pill ghost" onClick={() => setViewingOrder(null)} style={{ padding: '8px 14px', fontSize: 11 }}>
            ← Back to orders
          </button>
        </div>
        <div className="mono-label muted" style={{ marginBottom: 24 }}>— Order Details</div>
        <div style={{ border: '1px solid var(--hairline)', padding: isMobile ? 24 : 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="mono-label">Order {viewingOrder.id}</div>
              <div className="mono-sm muted tabular" style={{ marginTop: 6 }}>Placed {viewingOrder.date}</div>
            </div>
            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <div className="mono-label">{viewingOrder.status}</div>
              <div className="mono-sm muted" style={{ marginTop: 6 }}>{viewingOrder.ship}</div>
            </div>
          </div>

          <div style={{ marginBottom: 40 }}>
            {viewingOrder.items.map((it: any) => (
              <div key={it.productId} style={{ display: 'grid', gridTemplateColumns: '88px 1fr auto', gap: 20, padding: '20px 0', borderTop: '1px solid var(--hairline)', alignItems: 'center' }}>
                <img src={it.img} alt="" style={{ aspectRatio: '1 / 1', background: 'var(--cream-soft)', width: '100%', objectFit: 'cover' }} />
                <div>
                  <div className="mono-label muted">{it.vendor}</div>
                  <div className="mono-md" style={{ marginTop: 4 }}>{it.name}</div>
                  <div className="mono-sm muted tabular" style={{ marginTop: 4 }}>Size {it.size} · Qty {it.qty}</div>
                </div>
                <div className="mono-md tabular">{fmtNGN(it.price * (it.qty || 1))}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="fz-pill lime" onClick={() => { setActiveOrder(viewingOrder); setRoute('track'); }}><span>Track package</span><span>→</span></button>
            <button className="fz-pill ghost">Receipt</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mono-label muted" style={{ marginBottom: 24 }}>— {ORDERS.length} orders</div>
      <div>
        {ORDERS.map((o: any) => (
          <div key={o.id} style={{ padding: '32px 0', borderTop: '1px solid var(--hairline)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr 1fr 1fr auto', gap: 20, alignItems: 'start' }}>
              <div>
                <div className="mono-label">{o.id}</div>
                <div className="mono-sm muted tabular" style={{ marginTop: 4 }}>{o.date}</div>
              </div>
              <div>
                <div className="mono-label muted">Status</div>
                <div className="mono-md" style={{ marginTop: 4 }}>{o.status}</div>
                <div className="mono-sm muted" style={{ marginTop: 2 }}>{o.ship}</div>
              </div>
              <div>
                <div className="mono-label muted">Destination</div>
                <div className="mono-md" style={{ marginTop: 4 }}>{o.dest}</div>
              </div>
              <div>
                <div className="mono-label muted">Total</div>
                <div className="mono-md tabular" style={{ marginTop: 4 }}>{fmtNGN(o.total)}</div>
                <div className="mono-sm muted tabular" style={{ marginTop: 2 }}>{fmtUSD(o.total)}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="fz-pill ghost" style={{ padding: '10px 14px', fontSize: 11 }} onClick={() => setViewingOrder(o)}>View</button>
                <button className="fz-pill ghost" style={{ padding: '10px 14px', fontSize: 11 }}>Reorder</button>
              </div>
            </div>
            {/* Items row */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
              {o.items.map((it: any) => (
                <div key={it.productId} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 14px', background: 'var(--cream-soft)', flex: isMobile ? '1 1 100%' : '0 1 auto' }}>
                  <div style={{ width: 40, height: 48, background: 'var(--cream)', overflow: 'hidden' }}>
                    <img src={it.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div className="mono-sm">{it.name}</div>
                    <div className="mono-sm muted tabular">Size {it.size} · Qty {it.qty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountSaved({ setRoute, setActiveProduct, isMobile }: any) {
  const { PRODUCTS, SAVED } = useAppData();
  const savedProducts = PRODUCTS.filter((p: any) => SAVED.includes(p.id));
  return (
    <div>
      <div className="mono-label muted" style={{ marginBottom: 24 }}>— {savedProducts.length} saved pieces</div>
      <div 
        className="responsive-grid" 
        style={{ 
          '--cols-mobile': 2, 
          '--cols-sm': 2, 
          '--cols-lg': 3, 
          '--cols-xl': 4,
          '--gap': isMobile ? '20px' : '32px'
        } as any}
      >
        {savedProducts.map((p: any) => (
          <ProductCard key={p.id} product={p} setRoute={setRoute} setActiveProduct={setActiveProduct} />
        ))}
      </div>
    </div>
  );
}

function AccountFollowing({ setRoute, setActiveVendor, isMobile }: any) {
  const { VENDORS, FOLLOWING } = useAppData();
  const followed = VENDORS.filter((v: any) => FOLLOWING.includes(v.id));
  return (
    <div>
      <div className="mono-label muted" style={{ marginBottom: 24 }}>— Following {followed.length} vendors</div>
      <div 
        className="responsive-grid" 
        style={{ 
          '--cols-mobile': 1, 
          '--cols-sm': 2, 
          '--cols-lg': 3, 
          '--gap': isMobile ? '32px' : '48px'
        } as any}
      >
        {followed.map((v: any) => (
          <div key={v.id} style={{ cursor: 'pointer' }} onClick={() => { setActiveVendor(v); setRoute('vendor-detail'); window.scrollTo(0, 0); }}>
            <Img src={v.hero} alt={v.name} style={{ aspectRatio: '4 / 5', marginBottom: 20 }} />
            <div className="display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{v.name}</div>
            <div className="mono-sm muted">{v.tagline}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button className="fz-pill ghost" style={{ padding: '10px 14px', fontSize: 11 }}>Visit</button>
              <button className="fz-pill ghost" style={{ padding: '10px 14px', fontSize: 11 }} onClick={(e: any) => e.stopPropagation()}>Unfollow</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountAddresses({ isMobile }: any) {
  const { ADDRESSES, setAddresses } = useAppData();
  const { showToast, updateToast } = useToast();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'baseline' }}>
        <div className="mono-label muted">— {ADDRESSES.length} addresses on file</div>
        <button onClick={() => {
          const suffix = String(Math.floor(10 + Math.random() * 90));
          const sample = {
            id: 'addr-' + suffix,
            label: 'Office #' + suffix,
            name: 'Adaeze Obi',
            line1: suffix + ', Isaac John Street',
            line2: 'Ikeja Gra',
            city: 'Lagos',
            region: 'Lagos State',
            postal: '100001',
            country: 'Nigeria',
            phone: '+234 803 111 22' + suffix,
            isDefault: false
          };
          const performAdd = async () => {
            const toastId = showToast({
              title: 'Committing Registry',
              description: 'Submitting secure shipping registry payload...',
              variant: 'pending',
              duration: 0
            });
            try {
              const updated = await apiAddAddress(sample);
              if (setAddresses) setAddresses(updated);
              updateToast(toastId, {
                title: 'Registry Saved',
                description: `New transit coordinate "${sample.label}" registered.`,
                variant: 'success',
                duration: 4000
              });
            } catch (err) {
              updateToast(toastId, {
                title: 'Registry Refused',
                description: 'Profile sync database error.',
                variant: 'error',
                duration: 6000,
                onRetry: performAdd
              });
            }
          };
          performAdd();
        }} className="fz-pill ghost" style={{ padding: '10px 14px', fontSize: 11 }}>+ Add new</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24 }}>
        {ADDRESSES.map((a: any) => (
          <div key={a.id} style={{ border: '1px solid var(--hairline)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div className="mono-label">{a.label}</div>
              {a.isDefault && <div className="mono-sm" style={{ background: 'var(--black)', color: 'var(--cream)', padding: '2px 8px', fontSize: 10 }}>DEFAULT</div>}
            </div>
            <div className="mono-md" style={{ lineHeight: 1.7 }}>
              {a.name}<br/>
              {a.line1}<br/>
              {a.line2 && <>{a.line2}<br/></>}
              {a.city}, {a.region} {a.postal}<br/>
              <span style={{ color: 'var(--grey)' }}>{a.country}</span><br/>
              <span style={{ color: 'var(--grey)' }} className="tabular">{a.phone}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--hairline)' }}>
              <button onClick={() => showToast({ title: 'Preview Mode', description: 'Address text editing is locked. You can add new or delete existing ones.', variant: 'info' })} className="fz-pill ghost" style={{ padding: '8px 12px', fontSize: 11 }}>Edit</button>
              
              {!a.isDefault && <button onClick={() => {
                const performSetDefault = async () => {
                  const toastId = showToast({
                    title: 'Updating Coordinate Priority',
                    description: `Promoting "${a.label}" to primary...`,
                    variant: 'pending',
                    duration: 0
                  });
                  try {
                    const updated = await apiUpdateAddress(a.label, { isDefault: true });
                    if (setAddresses) setAddresses(updated);
                    updateToast(toastId, {
                      title: 'Primary Coordinate Enabled',
                      description: `Transit routes will default to "${a.label}".`,
                      variant: 'success',
                      duration: 4000
                    });
                  } catch (err) {
                    updateToast(toastId, {
                      title: 'Handshake Refused',
                      description: 'Could not sync priority route preferences.',
                      variant: 'error',
                      duration: 6000,
                      onRetry: performSetDefault
                    });
                  }
                };
                performSetDefault();
              }} className="fz-pill ghost" style={{ padding: '8px 12px', fontSize: 11 }}>Set default</button>}

              <button onClick={() => {
                const performDelete = async () => {
                  const toastId = showToast({
                    title: 'Pruning Registry',
                    description: `Deleting shipping point "${a.label}"...`,
                    variant: 'pending',
                    duration: 0
                  });
                  try {
                    const updated = await apiDeleteAddress(a.label);
                    if (setAddresses) setAddresses(updated);
                    updateToast(toastId, {
                      title: 'Record Removed',
                      description: `Successfully wiped shipping coordinates for "${a.label}".`,
                      variant: 'success',
                      duration: 4000
                    });
                  } catch (err) {
                    updateToast(toastId, {
                      title: 'Wipe Blocked',
                      description: 'The server refused to wipe this database value.',
                      variant: 'error',
                      duration: 6000,
                      onRetry: performDelete
                    });
                  }
                };
                performDelete();
              }} className="fz-pill ghost" style={{ padding: '8px 12px', fontSize: 11, color: 'var(--grey)' }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountPayment({ isMobile }: any) {
  const { PAYMENT_METHODS, setPaymentMethods } = useAppData();
  const { showToast, updateToast } = useToast();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'baseline' }}>
        <div className="mono-label muted">— {PAYMENT_METHODS.length} payment methods</div>
        <button onClick={() => {
          const suffix = String(Math.floor(1000 + Math.random() * 9000));
          const sample = {
            id: 'pay-' + suffix,
            type: 'VISA',
            label: 'Diaspora Travel Credit',
            last4: suffix,
            expiry: '10/29',
            isDefault: false
          };
          const performAddPayment = async () => {
            const toastId = showToast({
              title: 'Validating Method',
              description: 'Exchanging Paystack secure token signatures...',
              variant: 'pending',
              duration: 0
            });
            try {
              const updated = await apiAddPaymentMethod(sample);
              if (setPaymentMethods) setPaymentMethods(updated);
              updateToast(toastId, {
                title: 'Merchant Wallet Added',
                description: `Registered card ending in •••• ${suffix}.`,
                variant: 'success',
                duration: 4000
              });
            } catch (err) {
              updateToast(toastId, {
                title: 'Wallet Verification Error',
                description: 'Failed to securely exchange transaction authorization token.',
                variant: 'error',
                duration: 6000,
                onRetry: performAddPayment
              });
            }
          };
          performAddPayment();
        }} className="fz-pill ghost" style={{ padding: '10px 14px', fontSize: 11 }}>+ Add method</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {PAYMENT_METHODS.map((p: any) => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr 1fr auto', gap: 24, padding: '28px 0', borderTop: '1px solid var(--hairline)', alignItems: 'center' }}>
            <div className="mono-label">{p.type}</div>
            <div>
              <div className="mono-md">{p.label}</div>
              <div className="mono-sm muted tabular" style={{ marginTop: 2 }}>•••• {p.last4}</div>
            </div>
            <div className="mono-sm muted tabular">Expires {p.expiry}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {p.isDefault && <span className="mono-sm" style={{ background: 'var(--black)', color: 'var(--cream)', padding: '4px 10px', fontSize: 10 }}>DEFAULT</span>}
              <button onClick={() => showToast({ title: 'Stripe Sandbox', description: 'Interactive card field editing is locked in preview mode.', variant: 'info' })} className="fz-pill ghost" style={{ padding: '8px 12px', fontSize: 11 }}>Edit</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mono-sm muted" style={{ marginTop: 32, padding: 20, background: 'var(--cream-soft)', maxWidth: 640 }}>
        We process Nigerian cards through Paystack and Flutterwave. International cards go through Stripe. We never store your card details on our servers.
      </div>
    </div>
  );
}

function AccountNotifications({ isMobile }: any) {
  const { NOTIFICATION_PREFS, setNotificationPrefs } = useAppData();
  const { showToast } = useToast();
  const [prefs, setPrefs] = _accUseState(NOTIFICATION_PREFS);

  const toggle = async (id: any, channel: any) => {
    const original = prefs;
    const nextPrefs = prefs.map((pref: any) => {
      if (pref.id === id) {
        return { ...pref, [channel]: !pref[channel] };
      }
      return pref;
    });
    setPrefs(nextPrefs);
    
    const performToggleSync = async () => {
      try {
        const updated = await apiUpdateNotificationPrefs(nextPrefs);
        if (setNotificationPrefs) setNotificationPrefs(updated);
        showToast({
          title: 'Preferences Updated',
          description: `Your notification channels have been synchronized.`,
          variant: 'success'
        });
      } catch (err) {
        setPrefs(original); // rollback
        showToast({
          title: 'Sync Exception',
          description: 'Failed to synchronize alerts preference with the database.',
          variant: 'error',
          duration: 6000,
          onRetry: performToggleSync
        });
      }
    };
    performToggleSync();
  };
  return (
    <div>
      <div className="mono-label muted" style={{ marginBottom: 24 }}>— Notification preferences</div>
      <div style={{ maxWidth: 800 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 32, padding: '12px 0', borderBottom: '1px solid var(--hairline)' }}>
          <div className="mono-label muted">Topic</div>
          <div className="mono-label muted" style={{ width: 60, textAlign: 'center' }}>Email</div>
          <div className="mono-label muted" style={{ width: 60, textAlign: 'center' }}>SMS</div>
        </div>
        {prefs.map((p: any) => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 32, padding: '24px 0', borderBottom: '1px solid var(--hairline)', alignItems: 'center' }}>
            <div className="mono-md">{p.label}</div>
            <div style={{ width: 60, textAlign: 'center', cursor: 'pointer' }} onClick={() => toggle(p.id, 'email')}>
              <Checkbox checked={p.email} />
            </div>
            <div style={{ width: 60, textAlign: 'center', cursor: 'pointer' }} onClick={() => toggle(p.id, 'sms')}>
              <Checkbox checked={p.sms} />
            </div>
          </div>
        ))}
      </div>
      <div className="mono-sm muted" style={{ marginTop: 32, padding: 20, background: 'var(--cream-soft)', maxWidth: 800 }}>
        We send Nigerian SMS via Termii. International SMS charges carry standard rates — we try not to send more than one a week.
      </div>
    </div>
  );
}

function Checkbox({ checked }: any) {
  return (
    <div style={{
      width: 24, height: 24,
      border: '1px solid var(--black)',
      background: checked ? 'var(--black)' : 'transparent',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--cream)',
      fontSize: 14,
    }}>{checked ? '✓' : ''}</div>
  );
}
