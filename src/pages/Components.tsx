import React from 'react';
import { useAppData } from '../lib/DataProvider';
import { ProductCard } from '../components/product/ProductCard';

export function Components({ isMobile }: any) {
  const { PRODUCTS } = useAppData();
  return (
    <div className="page">
      <section style={{ padding: isMobile ? '40px 20px 60px' : '80px 32px 120px', borderBottom: '1px solid var(--hairline)' }}>
        <div className="mono-label muted" style={{ marginBottom: 24 }}>— Studio reference / v1.0</div>
        <h1 className="display-900" style={{ fontSize: isMobile ? 64 : 'clamp(80px, 11vw, 160px)' }}>
          Library.
        </h1>
        <div className="mono-md" style={{ marginTop: 24, maxWidth: 560 }}>
          The standing set of primitives used across Kiosque. Two fonts, four colours, strict left-alignment, no shadows. Anything not on this page does not exist on the site.
        </div>
      </section>

      {/* TYPE SCALE */}
      <Block label="01 — Type scale" isMobile={isMobile}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[
            { size: 160, label: "Display / 160 / 900", sample: "Kiosque." },
            { size: 96, label: "Display / 96 / 900", sample: "A marketplace for African fashion" },
            { size: 64, label: "Display / 64 / 800", sample: "Founded in Lagos, 2019" },
            { size: 40, label: "Display / 40 / 800", sample: "Indigo adire kaftan." },
            { size: 28, label: "Display / 28 / 800", sample: "More from Adìrẹ Ilọ̩rin." },
          ].map((t, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: 16, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: 16 }}>
              <div className="mono-label muted">{t.label}</div>
              <div className="display-900" style={{ fontSize: Math.min(t.size, isMobile ? 64 : t.size) }}>{t.sample}</div>
            </div>
          ))}
          <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: 16 }}>
            <div className="mono-label muted">Mono label / 12 / uppercase</div>
            <div className="mono-label">NEW ARRIVAL — VOL. 03</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: 16 }}>
            <div className="mono-label muted">Mono body / 14 / regular</div>
            <div className="mono-md" style={{ maxWidth: 540 }}>Cut from mid-weight cloth, hand-finished at the atelier. Natural-tone buttons, unlined through the body, French-seamed.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: 16 }}>
            <div className="mono-label muted">Mono small / 12 / muted</div>
            <div className="mono-sm muted">1,842 readers · 2 emails per month · unsubscribe anytime</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: 16 }}>
            <div className="mono-label muted">Mono tabular / prices, qty</div>
            <div className="mono-md tabular">₦185,000 · ₦425,000 · ₦45,000</div>
          </div>
        </div>
      </Block>

      {/* COLOR */}
      <Block label="02 — Colour" isMobile={isMobile}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(5, 1fr)', gap: 0, border: '1px solid var(--hairline)' }}>
          {[
            { name: "Cream", hex: "#F4F0E8", role: "Background", dark: false },
            { name: "Black", hex: "#000000", role: "Primary ink", dark: true },
            { name: "Warm grey", hex: "#8A8478", role: "Secondary ink", dark: true },
            { name: "Hairline", hex: "#D4D0C8", role: "Dividers", dark: false },
            { name: "Olive", hex: "#4A5D3A", role: "Accent / rare", dark: true },
          ].map((c, i) => (
            <div key={i} style={{ borderRight: i < 4 ? '1px solid var(--hairline)' : 'none', borderBottom: isMobile && i < 3 ? '1px solid var(--hairline)' : 'none' }}>
              <div style={{ background: c.hex, aspectRatio: '1 / 1', color: c.dark ? 'var(--cream)' : 'var(--black)', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <span className="mono-label">{c.role}</span>
                <span className="mono-sm tabular">{c.hex}</span>
              </div>
              <div style={{ padding: 16, borderTop: '1px solid var(--hairline)' }}>
                <div className="display" style={{ fontSize: 24, fontWeight: 800 }}>{c.name}</div>
              </div>
            </div>
          ))}
        </div>
      </Block>

      {/* BUTTONS */}
      <Block label="03 — Buttons" isMobile={isMobile}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 32 }}>
          <div>
            <div className="mono-label muted" style={{ marginBottom: 16 }}>Primary</div>
            <button className="btn-primary"><span>Add to bag</span><span>→</span></button>
          </div>
          <div>
            <div className="mono-label muted" style={{ marginBottom: 16 }}>Ghost</div>
            <button className="btn-ghost" style={{ gap: 12 }}><span>See all pieces</span><span>→</span></button>
          </div>
          <div>
            <div className="mono-label muted" style={{ marginBottom: 16 }}>Pill / size, filter</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {["XS","S","M","L"].map(s => <button key={s} className={`btn-pill ${s === 'S' ? 'active' : ''}`}>{s}</button>)}
            </div>
          </div>
        </div>
      </Block>

      {/* INPUTS */}
      <Block label="04 — Inputs" isMobile={isMobile}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 48 }}>
          <div>
            <div className="mono-label muted" style={{ marginBottom: 16 }}>Rule input / default</div>
            <div className="input-rule"><input placeholder="your@email.com" /><button className="mono-label">Subscribe →</button></div>
          </div>
          <div>
            <div className="mono-label muted" style={{ marginBottom: 16 }}>Rule input / filled</div>
            <div className="input-rule"><input defaultValue="hello@kiosque.africa" /><button className="mono-label">Subscribe →</button></div>
          </div>
        </div>
      </Block>

      {/* PRODUCT CARD */}
      <Block label="05 — Product card" isMobile={isMobile}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 64 }}>
          <ProductCard product={PRODUCTS[0]} setRoute={() => {}} setActiveProduct={() => {}} />
          <ProductCard product={PRODUCTS[3]} setRoute={() => {}} setActiveProduct={() => {}} />
          <ProductCard product={PRODUCTS[5]} setRoute={() => {}} setActiveProduct={() => {}} />
        </div>
        <div className="mono-sm muted" style={{ marginTop: 32 }}>4:5 image · 16px gap · three lines mono (vendor, name, price) · no border · no background · hover fades to alt image in 250ms.</div>
      </Block>

      {/* NAV */}
      <Block label="06 — Navigation" isMobile={isMobile}>
        <div className="fz-card tinted-soft" style={{ position: 'relative', height: 68, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 24px', background: 'var(--cream)' }}>
          <div className="display" style={{ fontSize: 22, fontWeight: 900 }}>Kiosque<span style={{fontWeight: 900}}>.</span></div>
          <div style={{ display: 'flex', gap: 24, paddingLeft: 12 }}>
            {["Index","Women","Men","Vendors","Journal"].map((l, i) => <span key={i} className="mono-label">{l}</span>)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 20 }}>
            <span className="mono-label">Search</span>
            <span className="mono-label">Account</span>
            <span className="mono-label">Bag (0)</span>
          </div>
        </div>
      </Block>

      {/* DIVIDERS */}
      <Block label="07 — Dividers" isMobile={isMobile}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div>
            <div className="mono-label muted" style={{ marginBottom: 12 }}>Hairline 1px #D4D0C8</div>
            <hr className="hairline" />
          </div>
          <div>
            <div className="mono-label muted" style={{ marginBottom: 12 }}>Section rule / black 1px</div>
            <hr style={{ border: 0, borderTop: '1px solid var(--black)' }} />
          </div>
          <div>
            <div className="mono-label muted" style={{ marginBottom: 12 }}>Rule + label (used on section starts)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, borderTop: '1px solid var(--hairline)', paddingTop: 16 }}>
              <div className="mono-label">— 003 / The edit</div>
              <div className="mono-sm muted">Section starter, always left-aligned, always numbered.</div>
            </div>
          </div>
        </div>
      </Block>

      {/* PLACEHOLDERS */}
      <Block label="08 — Image placeholders" isMobile={isMobile}>
        <div className="mono-sm muted" style={{ marginBottom: 24 }}>Warm editorial palette — model photography to be supplied. Do not use studio white backgrounds.</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16 }}>
          {[1,2,3,4,5,6,7,8].map(n => (
            <div key={n} className={`placeholder ph-warm-${n} fz-img`} style={{ aspectRatio: '4 / 5' }}>
              <div className="placeholder-label" style={{ position: 'absolute', bottom: 10, left: 12 }}>Warm / 0{n}</div>
            </div>
          ))}
        </div>
      </Block>

    </div>
  );
}

function Block({ label, isMobile, children }: any) {
  return (
    <section style={{ padding: isMobile ? '60px 20px' : '100px 32px', borderTop: '1px solid var(--hairline)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: isMobile ? 24 : 64 }}>
        <div className="mono-label">{label}</div>
        <div>{children}</div>
      </div>
    </section>
  );
}
