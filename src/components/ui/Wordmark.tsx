import React from 'react';

export function Wordmark({ onClick }: any) {
  return (
    <div className="nav-wordmark" onClick={onClick}>Kiosque<span style={{fontWeight: 900}}>.</span></div>
  );
}
