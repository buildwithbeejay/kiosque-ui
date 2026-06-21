import React from 'react';
import { fmtNGN, fmtUSD } from '../../lib/formatters';

export function ProductCard({ product, setRoute, setActiveProduct }: any) {
  const onClick = () => {
    setActiveProduct(product);
    setRoute('detail');
    window.scrollTo(0, 0);
  };
  const isUrl = (s: any) => typeof s === 'string' && s.startsWith('http');
  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-img placeholder has-img" style={{ background: 'var(--cream-soft)' }}>
        {isUrl(product.img) ? <img src={product.img} alt={product.name} loading="lazy" /> : null}
        {isUrl(product.alt) ? (
          <div className="alt placeholder has-img"><img src={product.alt} alt="" loading="lazy" /></div>
        ) : null}
        <div className="quick">Quick add →</div>
      </div>
      <div className="meta">
        <div className="mono-label dim">{product.vendor}</div>
        <div className="mono-md name">{product.name}</div>
        <div className="mono-md tabular" style={{ marginTop: 2 }}>{fmtNGN(product.price)} <span className="dim" style={{ fontSize: 11 }}>· {fmtUSD(product.price)}</span></div>
      </div>
    </div>
  );
}
