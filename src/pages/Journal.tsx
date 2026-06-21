import React, { useState, useEffect, useRef } from 'react';
import { useAppData } from '../lib/DataProvider';
import { Img } from '../components/ui/Img';

export function JournalIndex({ setRoute, setActiveArticle, isMobile, isTablet }: any) {
  const { JOURNAL } = useAppData();
  const [hero, ...rest] = JOURNAL;

  const open = (a: any) => { setActiveArticle(a); setRoute('article'); window.scrollTo(0, 0); };
  const isStackedWidth = isMobile || isTablet;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Masthead */}
      <section style={{ padding: isStackedWidth ? '60px 20px 40px' : '120px 32px 80px', borderBottom: '1px solid var(--hairline)' }}>
        <div className="mono-label muted" style={{ marginBottom: 20 }}>— The Kiosque Journal / Vol. 03</div>
        <h1 className="fz-headline" style={{ fontSize: isStackedWidth ? 64 : 'clamp(96px, 12vw, 200px)' }}>
          Field <span className="it">notes</span>.
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: isStackedWidth ? '1fr' : '1fr 1fr', gap: isStackedWidth ? 24 : 48, marginTop: 48, alignItems: 'end' }}>
          <div className="mono-md" style={{ maxWidth: 540 }}>
            Dispatches from our studio in Yaba and the workshops we visit — weavers, dyers, tailors, leatherworkers. Long-form, slow, usually with too many commas.
          </div>
          <div style={{ display: 'flex', justifyContent: isStackedWidth ? 'flex-start' : 'flex-end', gap: 32 }} className="mono-sm muted tabular">
            <span>{JOURNAL.length} dispatches</span>
            <span>Updated monthly</span>
          </div>
        </div>
      </section>

      {/* Hero feature */}
      <section
        style={{ padding: isStackedWidth ? '40px 20px' : '80px 32px', cursor: 'pointer', borderBottom: '1px solid var(--hairline)' }}
        onClick={() => open(hero)}
      >
        <div style={{ display: 'grid', gridTemplateColumns: isStackedWidth ? '1fr' : '7fr 5fr', gap: isStackedWidth ? 32 : 64, alignItems: 'center' }}>
          <Img src={hero.hero} alt={hero.title} style={{ aspectRatio: '4 / 5', background: 'var(--cream-soft)' }} />
          <div>
            <div className="mono-label muted" style={{ marginBottom: 16 }}>— {hero.n} / {hero.tag} · {hero.readTime}</div>
            <h2 className="display-900" style={{ fontSize: isStackedWidth ? 36 : 'clamp(44px, 4.8vw, 76px)', lineHeight: 1, marginBottom: 24 }}>
              {hero.title}
            </h2>
            <div className="mono-md" style={{ maxWidth: 520, marginBottom: 32, color: 'var(--grey)' }}>{hero.dek}</div>
            <div className="mono-sm muted tabular">{hero.author} · {hero.location} · {hero.date}</div>
            <button className="fz-pill ghost" style={{ marginTop: 32 }} onClick={(e: any) => { e.stopPropagation(); open(hero); }}>Read dispatch →</button>
          </div>
        </div>
      </section>

      {/* Grid of rest */}
      <section style={{ padding: isStackedWidth ? '40px 20px 80px' : '80px 32px 160px' }}>
        <div 
          className="responsive-grid" 
          style={{ 
            '--cols-mobile': 1, 
            '--cols-sm': 2, 
            '--cols-lg': 3, 
            '--gap': isStackedWidth ? '48px' : '64px'
          } as any}
        >
          {rest.map((a: any) => (
            <div key={a.id} style={{ cursor: 'pointer' }} onClick={() => open(a)}>
              <Img src={a.hero} alt={a.title} style={{ aspectRatio: '4 / 5', background: 'var(--cream-soft)', marginBottom: 20 }} />
              <div className="mono-label muted" style={{ marginBottom: 8 }}>— {a.n} / {a.tag} · {a.readTime}</div>
              <div className="display" style={{ fontSize: isStackedWidth ? 26 : 32, fontWeight: 800, lineHeight: 1.02, marginBottom: 12 }}>{a.title}</div>
              <div className="mono-sm muted" style={{ marginBottom: 12 }}>{a.dek}</div>
              <div className="mono-sm muted tabular">{a.author} · {a.date}</div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}

export function Article({ article, setRoute, setActiveArticle, isMobile, isTablet }: any) {
  const { JOURNAL } = useAppData();
  if (!article) return null;

  const idx = JOURNAL.findIndex((a: any) => a.id === article.id);
  const next = JOURNAL[(idx + 1) % JOURNAL.length];
  const isStackedWidth = isMobile || isTablet;

  return (
    <article style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Breadcrumb + meta header */}
      <header style={{ padding: isStackedWidth ? '40px 20px 32px' : '80px 32px 48px', borderBottom: '1px solid var(--hairline)' }}>
        <div className="mono-sm muted" style={{ marginBottom: 32, cursor: 'pointer' }} onClick={() => { setRoute('journal'); setActiveArticle(null); }}>
          ← The Journal
        </div>
        <div className="mono-label muted" style={{ marginBottom: 24 }}>— {article.n} / {article.tag}</div>
        <h1 className="display-900" style={{ fontSize: isStackedWidth ? 36 : 'clamp(56px, 6.2vw, 112px)', lineHeight: 0.96, maxWidth: 1400 }}>
          {article.title}
        </h1>
        <div className="display" style={{ fontSize: isStackedWidth ? 18 : 28, fontWeight: 500, lineHeight: 1.3, maxWidth: 900, marginTop: 32, color: 'var(--grey)' }}>
          {article.dek}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isStackedWidth ? '1fr 1fr' : 'repeat(4, auto)', gap: isStackedWidth ? 20 : 64, marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--hairline)' }}>
          <div>
            <div className="mono-label muted" style={{ marginBottom: 6 }}>Writer</div>
            <div className="mono-md">{article.author}</div>
          </div>
          <div>
            <div className="mono-label muted" style={{ marginBottom: 6 }}>Dateline</div>
            <div className="mono-md">{article.location}</div>
          </div>
          <div>
            <div className="mono-label muted" style={{ marginBottom: 6 }}>Published</div>
            <div className="mono-md tabular">{article.date}</div>
          </div>
          <div>
            <div className="mono-label muted" style={{ marginBottom: 6 }}>Read time</div>
            <div className="mono-md tabular">{article.readTime}</div>
          </div>
        </div>
      </header>

      {/* Hero image — full bleed */}
      <div style={{ padding: isStackedWidth ? '0' : '0 32px', marginTop: isStackedWidth ? 0 : 48 }}>
        <Img src={article.hero} alt={article.title} style={{ aspectRatio: isStackedWidth ? '1 / 1' : '16 / 9', background: 'var(--cream-soft)' }} />
      </div>

      {/* Body — drop cap on first paragraph */}
      <div style={{ padding: isStackedWidth ? '48px 20px' : '96px 32px', maxWidth: 820, margin: '0 auto' }}>
        {article.paragraphs.map((p: any, i: any) => (
          <p key={i} style={{
            fontFamily: 'var(--display)',
            fontSize: isStackedWidth ? 17 : 21,
            lineHeight: 1.55,
            fontWeight: 500,
            letterSpacing: '-0.005em',
            marginBottom: 28,
            textWrap: 'pretty',
          }}>
            {i === 0 ? (
              <>
                <span style={{
                  float: 'left',
                  fontSize: isStackedWidth ? 64 : 96,
                  lineHeight: 0.85,
                  fontWeight: 900,
                  marginRight: 12,
                  marginTop: 6,
                  fontFamily: 'var(--display)',
                  letterSpacing: '-0.04em',
                }}>{p.charAt(0)}</span>
                {p.slice(1)}
              </>
            ) : p}
          </p>
        ))}

        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid var(--hairline)' }}>
          <div className="mono-label muted" style={{ marginBottom: 12 }}>— End / {article.n}</div>
          <div className="mono-sm muted">
            Kiosque. is a marketplace for African fashion, built for the world. We write these from our studio in Yaba, Lagos. If you have thoughts, reach us at <span style={{ color: 'var(--black)' }}>hello@kiosque.ng</span>.
          </div>
        </div>
      </div>

      {/* Next up */}
      <section style={{ padding: isStackedWidth ? '40px 20px 80px' : '80px 32px 160px', background: 'var(--cream-soft)', cursor: 'pointer' }} onClick={() => { setActiveArticle(next); window.scrollTo(0, 0); }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="mono-label muted" style={{ marginBottom: 24 }}>— Next dispatch</div>
          <div style={{ display: 'grid', gridTemplateColumns: isStackedWidth ? '1fr' : '1fr 2fr', gap: isStackedWidth ? 24 : 64, alignItems: 'center' }}>
            <Img src={next.hero} alt={next.title} style={{ aspectRatio: '4 / 5', background: 'var(--cream)' }} />
            <div>
              <div className="mono-label muted" style={{ marginBottom: 12 }}>— {next.n} / {next.tag}</div>
              <h2 className="display-900" style={{ fontSize: isStackedWidth ? 32 : 'clamp(44px, 5vw, 80px)', lineHeight: 0.98, marginBottom: 20 }}>
                {next.title}
              </h2>
              <div className="mono-sm muted" style={{ maxWidth: 520 }}>{next.dek}</div>
              <button className="fz-pill lime" style={{ marginTop: 32 }}><span>Read dispatch</span><span className="dot">→</span></button>
            </div>
          </div>
        </div>
      </section>
      
    </article>
  );
}

