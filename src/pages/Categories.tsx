import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useAppData } from '../lib/DataProvider';

const CATEGORY_METADATA: Record<string, { img: string; count: string; desc: string }> = {
  "Shoes": {
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80",
    count: "84 Pairs",
    desc: "Lasted, hand-stitched leather from Lagos, Accra, Marrakech."
  },
  "Perfumes": {
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80",
    count: "24 Scents",
    desc: "Oud, amber, and sandalwood artisanal mixtures."
  },
  "Wristwatches": {
    img: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1000&q=80",
    count: "12 Timepieces",
    desc: "Precision crafted timepieces and dials."
  },
  "Clothes": {
    img: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=1000&q=80",
    count: "312 Pieces",
    desc: "Agbada, kaftans, aṣọ òkè separates, tailoring, dresses."
  },
  "Accessories": {
    img: "https://images.unsplash.com/photo-1598532187856-32724afef25b?auto=format&fit=crop&w=1000&q=80",
    count: "95 Items",
    desc: "Leather goods, silver, silk scarves, and beaded jewellery."
  }
};

export function Categories({ setRoute, isMobile, isTablet }: any) {
  const { CATEGORIES } = useAppData();
  
  const gotoCategory = (cat: string) => {
    // Store selected category in sessionStorage for pre-filtering when entering Listing
    sessionStorage.setItem('kiosque.filterCategory', cat);
    setRoute('listing');
  };

  return (
    <div className="page pb fade-in" id="categories-page">
      {/* Header section with generous spacing and alignment */}
      <div 
        style={{ 
          padding: isMobile ? '120px 20px 48px' : '150px 32px 64px', 
          borderBottom: '1px solid var(--hairline)',
          background: 'var(--cream-soft)'
        }}
      >
        <div className="fz-wrap">
          <h1 className="fz-headline" style={{ fontSize: isMobile ? '48px' : 'clamp(64px, 8vw, 96px)', margin: 0, lineHeight: 0.9 }}>
            Atelier <span className="it">departments</span>
          </h1>
          <p className="mono-md muted" style={{ marginTop: 24, maxWidth: '600px', fontSize: isMobile ? '15px' : '17px' }}>
            A curated ecosystem of independent ateliers — organized by category for easy selection.
          </p>
        </div>
      </div>

      {/* Categories Grid Container */}
      <div style={{ padding: isMobile ? '32px 20px' : '64px 32px' }}>
        <div className="fz-wrap">
          <div 
            className="responsive-grid" 
            style={{ 
              '--cols-mobile': 1, 
              '--cols-sm': 2, 
              '--cols-lg': 2, 
              '--cols-xl': 3,
              '--gap': '24px'
            } as any}
          >
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_METADATA[cat] || {
                img: `https://picsum.photos/seed/${cat}/1000/800`,
                count: "Available",
                desc: "Curated collections from independent designers."
              };

              return (
                <div
                  key={cat}
                  onClick={() => gotoCategory(cat)}
                  className="category-card"
                  style={{
                    position: 'relative',
                    height: isMobile ? '280px' : '360px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'var(--ink)',
                    border: '1px solid var(--hairline)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Category Cover Image with low opacity & sepia color for elegant look */}
                  <img
                    src={meta.img}
                    alt={cat}
                    referrerPolicy="no-referrer"
                    className="category-card-img"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.55,
                      mixBlendMode: 'luminosity'
                    }}
                  />
                  
                  {/* Absolute gradient overlay to keep text hyper-legible */}
                  <div
                    className="category-card-overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to bottom, rgba(33,37,41,0.1) 0%, rgba(33,37,41,0.85) 90%)',
                      zIndex: 1
                    }}
                  />

                  {/* Absolute positioning container for text elements */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      zIndex: 2,
                      color: 'var(--cream)'
                    }}
                  >
                    {/* Top row: piece/pair count and custom visual indicator */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span 
                        className="sticker" 
                        style={{ 
                          fontSize: '10px', 
                          background: 'rgba(255, 255, 255, 0.1)', 
                          backdropFilter: 'blur(10px)', 
                          color: 'var(--cream)', 
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          padding: '4px 10px',
                          borderRadius: '100px',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {meta.count}
                      </span>
                      <div 
                        className="category-arrow-circle"
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: 'var(--cream)'
                        }}
                      >
                        <ArrowUpRight size={18} />
                      </div>
                    </div>

                    {/* Bottom row: name and description */}
                    <div>
                      <h2 
                        className="fz-headline" 
                        style={{ 
                          fontSize: isMobile ? '30px' : '38px', 
                          margin: '0 0 6px 0', 
                          color: 'var(--cream)', 
                          lineHeight: 1.1,
                          fontWeight: 600
                        }}
                      >
                        {cat}
                      </h2>
                      <p 
                        className="mono-sm" 
                        style={{ 
                          opacity: 0.85, 
                          color: 'var(--cream)', 
                          margin: 0, 
                          fontSize: '13.5px', 
                          lineHeight: 1.5,
                          maxWidth: '280px'
                        }}
                      >
                        {meta.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
