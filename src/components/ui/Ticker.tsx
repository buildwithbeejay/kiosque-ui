import React from 'react';

export function Ticker() {
  const items = [
    "Free shipping across Nigeria on orders over ₦150,000",
    "Spring / 2026 — now shipping",
    "42 independent ateliers across Africa",
    "Editorial vol. 03 — live",
    "Ships to US / UK / EU for the diaspora",
  ];
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 48 }}>
            {t}
            <span style={{ opacity: 0.4 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
