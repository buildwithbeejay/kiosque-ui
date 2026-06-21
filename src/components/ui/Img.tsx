import React from 'react';

export function Img({ src, alt, label, className = '', style = {} }: any) {
  return (
    <div className={`placeholder ${src ? 'has-img' : ''} ${className}`} style={style}>
      {src ? <img src={src} alt={alt || ''} loading="lazy" /> : null}
      {label && !src ? <div className="placeholder-label">{label}</div> : null}
    </div>
  );
}
