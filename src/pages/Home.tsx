import React, { useEffect as useFzEffect, useRef as useFzRef, useState as useFzState } from 'react';
import { fmtNGN, fmtUSD } from '../lib/formatters';
import { useAppData } from '../lib/DataProvider';
import { ProductCard } from '../components/product/ProductCard';
import { Footer } from '../components/layout/Footer';

function useScrollReveal() {
  useFzEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {if (e.isIntersecting) {e.target.classList.add('in');io.unobserve(e.target);}});
    }, { threshold: 0.14 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function Home({ setRoute, setActiveProduct, setActiveVendor, setActiveArticle, isMobile, isTablet, heroVariant }: any) {
  const { PRODUCTS, VENDORS, JOURNAL } = useAppData();
  useScrollReveal();

  const gotoCategory = (cat: string) => {
    sessionStorage.setItem('kiosque.filterCategory', cat);
    setRoute('listing');
  };

  const [mouseX, setMouseX] = useFzState(50);
  useFzEffect(() => {
    const onMove = (e: any) => setMouseX(e.clientX / window.innerWidth * 100);
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const featuredProducts = PRODUCTS.slice(0, 8);
  const heroImg1 = PRODUCTS[0]?.img;
  const heroImg2 = PRODUCTS[2]?.img;
  const heroImg3 = PRODUCTS[4]?.img;

  const scrollRef = useFzRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useFzState(false);
  const [startX, setStartX] = useFzState(0);
  const [scrollLeft, setScrollLeft] = useFzState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="page" style={{ paddingTop: 0, background: 'var(--cream)' }}>
      {/* ══════════════════════════════════════════ HERO */}
      <section style={{ padding: isMobile ? '80px 0 48px' : '100px 0 64px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        {/* Background orbs in greyscale */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 80, right: -120, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, var(--ink) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(12px)', transform: `translate(${(mouseX - 50) * 0.3}px, 0)`, transition: 'transform 600ms ease-out' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 420, left: -100, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, var(--ink) 0%, transparent 70%)', opacity: 0.08, filter: 'blur(20px)' }} />

        <div className="fz-wrap" style={{ position: 'relative', zIndex: 1, padding: '0 24px' }}>
          {/* Headline */}
          <div className="reveal in" style={{ display: 'flex', justifyContent: 'center', marginBottom: isMobile ? 32 : 40 }} />
          <h1 className="fz-mega reveal in" style={{ fontSize: isMobile ? 64 : 'clamp(80px, 11vw, 180px)', marginBottom: isMobile ? 24 : 32, lineHeight: 0.9 }}>
            African fashion, for the world.
          </h1>

          {/* Supporting row */}
          <div className="reveal d2 in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, marginTop: isMobile ? 40 : 48 }}>
            <p className="mono-lg" style={{ maxWidth: 540, lineHeight: 1.6, fontSize: isMobile ? 15 : 18, color: 'var(--ink)', fontWeight: 500, opacity: 0.9 }}>
              A curated marketplace of independent ateliers — shipping everywhere, hand-finished nowhere else.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: "center" }}>
              <button className="fz-pill lime" onClick={() => setRoute('listing')} style={{ backgroundColor: "var(--ink)", padding: '16px 28px' }}>
                <span style={{ color: "var(--cream)", fontSize: 14 }}>Shop the edit</span>
                <span className="dot">→</span>
              </button>
              <button className="fz-pill ghost" onClick={() => setRoute('vendor')} style={{ padding: '16px 28px' }}>
                <span style={{ fontSize: 14 }}>Meet vendors</span>
                <span className="dot">◆</span>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Attires */}
        <div className="reveal d3 in" style={{ marginTop: isMobile ? 32 : 48, width: '100%', overflow: 'hidden' }}>
          <div 
            ref={scrollRef}
            className="hide-scrollbar"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ 
              display: 'flex', 
              gap: isMobile ? 12 : 20, 
              overflowX: 'auto', 
              padding: '0 24px 20px 24px', 
              scrollSnapType: isDown ? 'none' : 'x mandatory',
              cursor: isDown ? 'grabbing' : 'grab'
            }}
          >
            {PRODUCTS.slice(0, 10).map((p: any, i: number) => (
              <div 
                key={p.id} 
                className="fz-img fz-hover-card" 
                style={{ 
                  flex: '0 0 auto', 
                  width: isMobile ? 240 : 320, 
                  aspectRatio: '3 / 4', 
                  scrollSnapAlign: 'center', 
                  cursor: 'pointer',
                  border: '1px solid var(--hairline)'
                }}
                onClick={() => { setActiveProduct(p); setRoute('detail'); window.scrollTo(0, 0); }}
              >
                {p.img && <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />}
                <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div className="sticker" style={{ background: 'var(--cream)', color: 'var(--ink)', padding: '6px 10px' }}>{p.vendor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ BENTO: what we do */}
      <section className="fz-section">
        <div className="fz-wrap">
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 className="fz-headline" style={{ fontSize: isMobile ? 44 : 'clamp(56px, 7vw, 112px)', maxWidth: 1200 }}>
                Three <span className="it">things</span><br />we do well.
              </h2>
            </div>
            <button className="fz-pill ghost" onClick={() => setRoute('listing')}>
              <span>Browse all</span><span className="dot">→</span>
            </button>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)'), 
            gridAutoRows: isMobile ? 'auto' : (isTablet ? 'auto' : '220px'), 
            gap: 16, 
            marginTop: 40 
          }}>
            {/* Clothes - span 3, row span 2 */}
            <div 
              className="home-bento-card bento reveal d1" 
              onClick={() => gotoCategory('Clothes')}
              style={{ 
                gridColumn: isMobile ? 'auto' : (isTablet ? 'span 2' : 'span 3'), 
                gridRow: isMobile ? 'auto' : (isTablet ? 'auto' : 'span 2'), 
                padding: 28, 
                minHeight: isMobile ? 280 : (isTablet ? 260 : 'auto')
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=1000&q=80" 
                alt="Clothes" 
                referrerPolicy="no-referrer"
                className="home-bento-img" 
              />
              <div className="home-bento-overlay" />
              
              <div className="home-bento-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <span className="sticker" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', color: 'var(--cream)', border: '1px solid rgba(255, 255, 255, 0.25)' }}>01</span>
                  <span className="mono-label-sm" style={{ color: 'var(--cream)', opacity: 0.85 }}>312 pieces</span>
                </div>
                <div>
                  <div className="fz-headline" style={{ fontSize: isMobile ? 40 : 64, marginBottom: 10, color: 'var(--cream)' }}>Clothes.</div>
                  <p className="mono-sm" style={{ maxWidth: 480, color: 'var(--cream)', opacity: 0.85 }}>
                    Agbada, kaftans, aṣọ òkè separates, tailoring, dresses — made by hand and carefully crafted.
                  </p>
                </div>
              </div>
            </div>

            {/* Shoes - span 3, row span 1 */}
            <div 
              className="home-bento-card bento reveal d2" 
              onClick={() => gotoCategory('Shoes')}
              style={{ 
                gridColumn: isMobile ? 'auto' : (isTablet ? 'span 1' : 'span 3'), 
                gridRow: isMobile ? 'auto' : (isTablet ? 'auto' : 'span 1'), 
                padding: 24, 
                minHeight: isMobile ? 220 : (isTablet ? 220 : 'auto')
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80" 
                alt="Shoes" 
                referrerPolicy="no-referrer"
                className="home-bento-img" 
              />
              <div className="home-bento-overlay" />
              
              <div className="home-bento-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <span className="sticker" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', color: 'var(--cream)', border: '1px solid rgba(255, 255, 255, 0.25)' }}>02</span>
                  <span className="mono-label-sm" style={{ color: 'var(--cream)', opacity: 0.85 }}>84 pairs</span>
                </div>
                <div>
                  <div className="fz-headline" style={{ fontSize: isMobile ? 36 : 42, marginBottom: 8, color: 'var(--cream)' }}>Shoes.</div>
                  <p className="mono-sm" style={{ color: 'var(--cream)', opacity: 0.85 }}>
                    Lasted, hand-stitched leather from Lagos, Accra, Marrakech.
                  </p>
                </div>
              </div>
            </div>

            {/* Perfumes - span 3, row span 1 */}
            <div 
              className="home-bento-card bento reveal d3" 
              onClick={() => gotoCategory('Perfumes')}
              style={{ 
                gridColumn: isMobile ? 'auto' : (isTablet ? 'span 1' : 'span 3'), 
                gridRow: isMobile ? 'auto' : (isTablet ? 'auto' : 'span 1'), 
                padding: 24, 
                minHeight: isMobile ? 220 : (isTablet ? 220 : 'auto')
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80" 
                alt="Perfumes" 
                referrerPolicy="no-referrer"
                className="home-bento-img" 
              />
              <div className="home-bento-overlay" />
              
              <div className="home-bento-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <span className="sticker" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', color: 'var(--cream)', border: '1px solid rgba(255, 255, 255, 0.25)' }}>03</span>
                  <span className="mono-label-sm" style={{ color: 'var(--cream)', opacity: 0.85 }}>24 scents</span>
                </div>
                <div>
                  <div className="fz-headline" style={{ fontSize: isMobile ? 36 : 42, marginBottom: 8, color: 'var(--cream)' }}>Perfumes.</div>
                  <p className="mono-sm" style={{ color: 'var(--cream)', opacity: 0.85 }}>
                    Oud, amber, and sandalwood artisanal mixtures.
                  </p>
                </div>
              </div>
            </div>

            {/* Watches - span 2, row span 1 */}
            <div 
              className="home-bento-card bento reveal d4" 
              onClick={() => gotoCategory('Wristwatches')}
              style={{ 
                gridColumn: isMobile ? 'auto' : (isTablet ? 'span 1' : 'span 2'), 
                padding: 24, 
                minHeight: isMobile ? 180 : (isTablet ? 200 : 'auto')
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1000&q=80" 
                alt="Watches" 
                referrerPolicy="no-referrer"
                className="home-bento-img" 
              />
              <div className="home-bento-overlay" />
              
              <div className="home-bento-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <span className="sticker" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', color: 'var(--cream)', border: '1px solid rgba(255, 255, 255, 0.25)' }}>04</span>
                  <span className="mono-label-sm" style={{ color: 'var(--cream)', opacity: 0.85 }}>12 items</span>
                </div>
                <div>
                  <div className="fz-headline" style={{ fontSize: isMobile ? 24 : 32, marginBottom: 6, color: 'var(--cream)' }}>Watches.</div>
                  <p className="mono-sm" style={{ color: 'var(--cream)', opacity: 0.85 }}>
                    Precision crafted timepieces.
                  </p>
                </div>
              </div>
            </div>

            {/* Accessories - span 2, row span 1 */}
            <div 
              className="home-bento-card bento reveal d5" 
              onClick={() => gotoCategory('Accessories')}
              style={{ 
                gridColumn: isMobile ? 'auto' : (isTablet ? 'span 1' : 'span 2'), 
                padding: 24, 
                minHeight: isMobile ? 180 : (isTablet ? 200 : 'auto')
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1598532187856-32724afef25b?auto=format&fit=crop&w=1000&q=80" 
                alt="Accessories" 
                referrerPolicy="no-referrer"
                className="home-bento-img" 
              />
              <div className="home-bento-overlay" />
              
              <div className="home-bento-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <span className="sticker" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', color: 'var(--cream)', border: '1px solid rgba(255, 255, 255, 0.25)' }}>05</span>
                  <span className="mono-label-sm" style={{ color: 'var(--cream)', opacity: 0.85 }}>95 items</span>
                </div>
                <div>
                  <div className="fz-headline" style={{ fontSize: isMobile ? 24 : 32, marginBottom: 6, color: 'var(--cream)' }}>Accessories.</div>
                  <p className="mono-sm" style={{ color: 'var(--cream)', opacity: 0.85 }}>
                    Leather goods, silver, silk scarves, beaded jewellery.
                  </p>
                </div>
              </div>
            </div>

            {/* View All - span 2, row span 1 */}
            <div 
              className="home-bento-card bento reveal d6" 
              onClick={() => setRoute('categories')} 
              style={{ 
                gridColumn: isMobile ? 'auto' : (isTablet ? 'span 2' : 'span 2'), 
                padding: 24, 
                minHeight: isMobile ? 180 : (isTablet ? 180 : 'auto')
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80" 
                alt="All Categories" 
                referrerPolicy="no-referrer"
                className="home-bento-img" 
              />
              <div className="home-bento-overlay" style={{ background: 'linear-gradient(to bottom, rgba(33, 37, 41, 0.35) 0%, rgba(33, 37, 41, 0.85) 90%)' }} />
              
              <div className="home-bento-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="fz-headline" style={{ fontSize: isMobile ? 24 : 32, textAlign: 'center', color: 'var(--cream)', fontWeight: 600 }}>View All.</div>
                <p className="mono-sm" style={{ marginTop: 8, textAlign: 'center', color: 'var(--cream)', opacity: 0.85 }}>
                  Explore all categories <span className="dot" style={{ backgroundColor: 'var(--cream)', color: 'var(--ink)' }}>→</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ FEATURED PRODUCTS */}
      <section className="fz-section" style={{ background: 'var(--cream-soft)' }}>
        <div className="fz-wrap">
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 className="fz-headline" style={{ fontSize: isMobile ? 40 : 'clamp(48px, 6vw, 96px)' }}>
                What's <span className="it">moving</span> right now.
              </h2>
            </div>
            <button className="fz-pill ghost" onClick={() => setRoute('listing')}>
              <span>See all 312</span><span className="dot">→</span>
            </button>
          </div>

          <div 
            className="responsive-grid" 
            style={{ 
              '--cols-mobile': 2, 
              '--cols-sm': 2, 
              '--cols-lg': 3, 
              '--cols-xl': 4,
              '--gap': isMobile ? '16px' : '20px'
            } as any}
          >
            {featuredProducts.map((p, i) =>
            <div key={p.id} className={`reveal d${i % 4 + 1} fz-hover-card`} style={{ cursor: 'pointer' }} onClick={() => {setActiveProduct(p);setRoute('detail');window.scrollTo(0, 0);}}>
                <div className="fz-img" style={{ aspectRatio: '4 / 5', marginBottom: 12 }}>
                  {p.img ? <img src={p.img} alt={p.name} loading="lazy" /> : null}
                  {i === 0 && <span className="sticker out" style={{ position: 'absolute', top: 12, left: 12, background: 'var(--cream)', borderColor: 'var(--cream)' }}>Top seller</span>}
                  {i === 2 && <span className="sticker out" style={{ position: 'absolute', top: 12, left: 12, background: 'var(--cream)', borderColor: 'var(--cream)' }}>New</span>}
                </div>
                <div className="mono-label-sm dim" style={{ marginBottom: 2 }}>{p.vendor}</div>
                <div className="mono-md" style={{ marginBottom: 2 }}>{p.name}</div>
                <div className="mono-sm tabular">{fmtNGN(p.price)} <span className="dim">· {fmtUSD(p.price)}</span></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ VENDOR SPOTLIGHT */}
      <section className="fz-section" style={{ paddingBottom: isMobile ? '40px' : '48px' }}>
        <div className="fz-wrap">
          <div className="reveal" style={{ marginBottom: 32 }}>
            <h2 className="fz-headline" style={{ fontSize: isMobile ? 44 : 'clamp(56px, 7vw, 112px)' }}>
              42 ateliers.<br /><span className="it">Each one, by name.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'), gap: 20, marginTop: 40 }}>
            {VENDORS.slice(0, 3).map((v, i) =>
            <div key={v.id} className={`bento reveal d${i + 1}`} style={{ padding: 20, cursor: 'pointer' }} onClick={() => {if(setActiveVendor){setActiveVendor(v);} setRoute('vendor-detail');window.scrollTo(0, 0);}}>
                <div className="fz-img" style={{ aspectRatio: '5 / 6', marginBottom: 16 }}>
                  {v.hero ? <img src={v.hero} alt={v.name} loading="lazy" /> : null}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <div>
                    <div className="fz-headline" style={{ fontSize: 26 }}>{v.name}</div>
                    <div className="mono-label-sm dim" style={{ marginTop: 4 }}>{v.tagline}</div>
                  </div>
                  <span className="sticker out" style={{ padding: '6px 10px' }}>{String(i + 1).padStart(2, '0')}</span>
                </div>
              </div>
            )}
          </div>

          <div className="reveal" style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
            <button className="fz-pill" onClick={() => setRoute('vendor')}>
              <span>All 42 vendors</span><span className="dot">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ STATS STRIP */}
      <section style={{ padding: isMobile ? '24px 16px' : '32px 24px', textAlign: "center" }}>
        <div className="fz-wrap">
          <div className="reveal" style={{ padding: (isMobile || isTablet) ? 32 : 56, display: 'grid', gridTemplateColumns: (isMobile || isTablet) ? '1fr 1fr' : 'repeat(4, 1fr)', gap: (isMobile || isTablet) ? 24 : 40, textAlign: "left", background: 'var(--cream-soft)', borderRadius: 'var(--r-lg)' }}>
            {[
            { k: '42', l: 'Partner Brands & Boutiques' },
            { k: '312', l: 'Unique Products' },
            { k: '18', l: 'Countries Shipped To' },
            { k: '₦150k+', l: 'Free Shipping (NG)' }].
            map((s, i) =>
            <div key={i}>
                <div className="fz-headline" style={{ fontSize: isMobile ? 40 : 72 }}>{s.k}</div>
                <div className="mono-sm" style={{ opacity: 0.75, marginTop: 8 }}>{s.l}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ JOURNAL */}
      <section className="fz-section" style={{ paddingTop: isMobile ? '40px' : '48px' }}>
        <div className="fz-wrap">
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 className="fz-headline" style={{ fontSize: isMobile ? 40 : 'clamp(48px, 6vw, 96px)' }}>
                Words from<br /><span className="it">the studios.</span>
              </h2>
            </div>
            <button className="fz-pill ghost" onClick={() => setRoute('journal')}>
              <span>All dispatches</span><span className="dot">→</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr' : '2fr 1fr 1fr'), gap: 20, marginTop: 32 }}>
            {(JOURNAL || []).slice(0, 3).map((article: any, i: number) => (
              <div 
                key={article.id} 
                className={`home-journal-card bento reveal d${i + 1}`} 
                style={{ 
                  padding: 24, 
                  minHeight: isMobile ? 240 : 360 
                }} 
                onClick={() => {
                  setActiveArticle?.(article);
                  setRoute('article');
                  window.scrollTo(0, 0);
                }}
              >
                {/* Colored Cover Image from article hero */}
                <img 
                  src={article.hero} 
                  alt={article.title} 
                  referrerPolicy="no-referrer"
                  className="home-journal-img" 
                />
                
                {/* Gradient overlay for contrast & readability */}
                <div className="home-journal-overlay" />

                {/* Card Content wrapper */}
                <div className="home-journal-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span 
                      className="sticker" 
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.15)', 
                        backdropFilter: 'blur(8px)', 
                        color: 'var(--cream)', 
                        border: '1px solid rgba(255, 255, 255, 0.25)' 
                      }}
                    >
                      {article.tag}
                    </span>
                    <span className="mono-label-sm" style={{ color: 'var(--cream)', opacity: 0.85 }}>
                      {article.n}
                    </span>
                  </div>

                  <div>
                    <h3 
                      className="fz-headline" 
                      style={{ 
                        fontSize: i === 0 ? (isMobile ? 26 : 38) : (isMobile ? 20 : 24), 
                        marginBottom: 8, 
                        color: 'var(--cream)',
                        lineHeight: 1.25,
                        fontWeight: 600
                      }}
                    >
                      {article.title}
                    </h3>
                    <p 
                      className="mono-sm" 
                      style={{ 
                        color: 'var(--cream)', 
                        opacity: 0.8, 
                        fontSize: '13px', 
                        lineHeight: 1.5,
                        margin: 0
                      }}
                    >
                      {article.dek}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ BECOME A VENDOR CTA */}
      <section style={{ padding: isMobile ? '48px 16px 96px' : '64px 24px 128px' }}>
        <div className="fz-wrap">
          <div className="bento tinted-ink reveal" style={{ padding: isMobile ? 40 : 80, textAlign: 'center' }}>
            <div className="sticker" style={{ background: 'var(--coral)', color: 'var(--cream)', marginBottom: 24 }}>For ateliers</div>
            <h3 className="fz-mega" style={{ fontSize: isMobile ? 48 : 'clamp(72px, 9vw, 156px)', marginBottom: 20, color: "var(--cream)" }}>
              Sell with us.
            </h3>
            <p className="mono-md" style={{ maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.5, color: "var(--cream)" }}>
              We onboard 6 studios each quarter. Lagos-based ops, pan-African logistics, diaspora-first marketing. No setup fees.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="fz-pill" onClick={() => setRoute('dashboard')}>
                <span>See the dashboard</span><span className="dot">→</span>
              </button>
              <button className="fz-pill ghost" style={{ background: 'transparent', borderColor: 'rgba(250,249,246,0.3)' }}>
                <span style={{ color: "var(--cream)" }}>APPLY</span><span className="dot" style={{ backgroundColor: "var(--cream)", color: "var(--ink)" }}>◆</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

