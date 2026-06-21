import React from 'react';

export function Footer({ setRoute }: any) {
  return (
    <footer style={{ borderTop: '1px solid var(--hairline)', background: 'var(--cream)', width: '100%' }}>
      {/* Top ribbon */}
      <div style={{ borderBottom: '1px solid var(--hairline)' }}>
        <div className="fz-wrap" style={{ padding: 'clamp(16px, 2.4vw, 24px) 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div className="mono-label-sm dim">Lagos — Nigeria</div>
          <div className="mono-label-sm dim" style={{ textAlign: 'center' }}>
            <span className="serif-it" style={{ fontSize: 15, verticalAlign: '-2px', marginRight: 8, textTransform: 'none', letterSpacing: 0 }}>édition</span> 
            vol. 03 · spring 2026
          </div>
          <div className="mono-label-sm dim" style={{ textAlign: 'right' }}>Shipping globally</div>
        </div>
      </div>

      {/* Main content */}
      <div className="fz-wrap" style={{ padding: 'clamp(48px, 8vw, 100px) 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'clamp(40px, 6vw, 80px)' }}>
          {/* Brand block */}
          <div style={{ gridColumn: 'span min(2, 1)', minWidth: 280 }}>
            <div className="fz-display" style={{ fontSize: 'clamp(48px, 6vw, 96px)', marginBottom: 24, lineHeight: 0.85 }}>
              Kiosque<span style={{ color: 'var(--coral)' }}>.</span>
            </div>
            <p className="mono-sm muted" style={{ maxWidth: 360, marginBottom: 32, fontSize: 14 }}>
              A marketplace for <span className="serif-it" style={{ fontSize: 18, verticalAlign: '-1px' }}>African fashion</span>, built for the world. Lagos-based, delivering across Nigeria and to the diaspora.
            </p>
            <div style={{ maxWidth: 360 }}>
              <div className="mono-label-sm dim" style={{ marginBottom: 12 }}>— Join the dispatch</div>
              <div className="input-rule" style={{ borderColor: 'var(--ink)' }}>
                <input placeholder="your@email.com" />
                <button className="btn-link" style={{ padding: 0 }}>Subscribe <span className="arr">→</span></button>
              </div>
            </div>
          </div>

          {/* Links grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 40, flex: 1, gridColumn: 'span min(3, 1)' }}>
            <div>
              <div className="mono-label-sm dim" style={{ marginBottom: 20 }}>— Shop</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="mono-sm">
                <a className="link-u" onClick={() => setRoute('listing')}>Women</a>
                <a className="link-u" onClick={() => setRoute('listing')}>Men</a>
                <a className="link-u" onClick={() => setRoute('listing')}>Objects</a>
                <a className="link-u" onClick={() => setRoute('wishlist')}>Archive</a>
                <a className="link-u" onClick={() => setRoute('listing')}>New in</a>
              </div>
            </div>
            <div>
              <div className="mono-label-sm dim" style={{ marginBottom: 20 }}>— Studio</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="mono-sm">
                <a className="link-u" onClick={() => setRoute('vendor')}>Vendors</a>
                <a className="link-u" onClick={() => setRoute('journal')}>Journal</a>
                <a className="link-u">Stockists</a>
                <a className="link-u">Contact</a>
                <a className="link-u">Press</a>
              </div>
            </div>
            <div>
              <div className="mono-label-sm dim" style={{ marginBottom: 20 }}>— Help</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="mono-sm">
                <a className="link-u">Shipping</a>
                <a className="link-u">Returns</a>
                <a className="link-u">Size guide</a>
                <a className="link-u">FAQ</a>
                <a className="link-u">Care</a>
              </div>
            </div>
            <div>
              <div className="mono-label-sm dim" style={{ marginBottom: 20 }}>— Index</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="mono-sm">
                <a className="link-u">Instagram</a>
                <a className="link-u">Are.na</a>
                <a className="link-u">Substack</a>
                <a className="link-u">RSS</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--hairline)', marginTop: 'clamp(48px, 8vw, 100px)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }} className="mono-sm dim">
          <div style={{ flex: 1, minWidth: 300 }}>© 2026 Kiosque. Prices in <span className="tabular">₦</span> Naira · USD shown for reference.</div>
          <div style={{ textAlign: 'center', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: 10 }}>Paystack · Flutterwave · Visa · Mastercard</div>
          <div style={{ flex: 1, textAlign: 'right', minWidth: 200 }}>Terms · Privacy · Cookies</div>
        </div>
      </div>
    </footer>
  );
}
