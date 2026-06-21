import React, { useState as useAuthState, useEffect as useAuthEffect, useRef as useAuthRef } from 'react';
import { useToast } from '../lib/ToastContext';
import { apiSignIn, apiSignUp, apiOnboard, apiVendorApply } from '../lib/api';

// ────────────────────────────────────────────────────────────────
// User persistence
// ────────────────────────────────────────────────────────────────
const USER_KEY = 'kiosque.user';
export const loadUser = () => { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch (_) { return null; } };
export const saveUser = (u: any) => { if (u) localStorage.setItem(USER_KEY, JSON.stringify(u)); else localStorage.removeItem(USER_KEY); };

// Auth steps
export const STEPS = {
  GATE: 'gate',
  SIGN_IN: 'sign-in',
  SIGN_UP_PICK: 'sign-up-pick',
  SIGN_UP_BUYER: 'sign-up-buyer',
  APPLY_1: 'apply-1',
  APPLY_2: 'apply-2',
  APPLY_3: 'apply-3',
  APPLY_DONE: 'apply-done',
  MAGIC: 'magic',
  FORGOT: 'forgot',
  RESET: 'reset',
  VERIFY: 'verify',
  ONBOARD: 'onboard',
  ONBOARD_DONE: 'onboard-done',
  SIGNED_OUT: 'signed-out',
  EXPIRED: 'expired',
};

// ────────────────────────────────────────────────────────────────
// Tiny shared bits
// ────────────────────────────────────────────────────────────────
function AuthInput({ label, type = 'text', value, onChange, placeholder, hint, error, autoFocus }: any) {
  return (
    <label style={{ display: 'block', marginBottom: 18 }}>
      <div className="mono-label" style={{ marginBottom: 8, fontSize: 10, color: error ? 'var(--coral-deep, #C9472A)' : 'var(--ink)' }}>
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          width: '100%',
          padding: '14px 16px',
          fontFamily: 'var(--mono)',
          fontSize: 14,
          background: 'var(--cream)',
          border: '1px solid ' + (error ? '#C9472A' : 'var(--hairline-strong, var(--hairline))'),
          borderRadius: 12,
          outline: 'none',
          transition: 'border-color 200ms',
          color: 'var(--ink)',
        }}
        onFocus={(e: any) => e.target.style.borderColor = 'var(--ink)'}
        onBlur={(e: any) => e.target.style.borderColor = error ? '#C9472A' : 'var(--hairline-strong, var(--hairline))'}
      />
      {(hint || error) && (
        <div className="mono-sm" style={{ marginTop: 6, color: error ? '#C9472A' : 'var(--grey)', fontSize: 11 }}>
          {error || hint}
        </div>
      )}
    </label>
  );
}

function AuthCheckbox({ checked, onChange, children }: any) {
  return (
    <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', marginBottom: 14 }}>
      <span
        onClick={(e) => { e.preventDefault(); onChange(!checked); }}
        style={{
          width: 18, height: 18, marginTop: 1,
          flexShrink: 0,
          border: '1.5px solid ' + (checked ? 'var(--ink)' : 'var(--hairline-strong, var(--hairline))'),
          borderRadius: 4,
          background: checked ? 'var(--ink)' : 'transparent',
          color: 'var(--lime)',
          fontSize: 12,
          fontWeight: 800,
          lineHeight: '15px',
          textAlign: 'center',
          transition: 'all 180ms',
        }}
      >{checked ? '✓' : ''}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ display: 'none' }} />
      <span className="mono-sm" style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--grey-ink, var(--ink))' }}>{children}</span>
    </label>
  );
}

function PrimaryBtn({ onClick, children, disabled, loading, full = true }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="fz-pill lime"
      style={{
        width: full ? '100%' : 'auto',
        justifyContent: 'space-between',
        opacity: (disabled || loading) ? 0.55 : 1,
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
      }}
    >
      <span>{loading ? 'Working…' : children}</span>
      <span className="dot">{loading ? '⟳' : '→'}</span>
    </button>
  );
}

function GhostBtn({ onClick, children, full = true, icon }: any) {
  return (
    <button
      onClick={onClick}
      className="fz-pill ghost"
      style={{ width: full ? '100%' : 'auto', justifyContent: 'space-between' }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        {icon && <span style={{ display: 'inline-flex', width: 18 }}>{icon}</span>}
        <span>{children}</span>
      </span>
      <span className="dot">→</span>
    </button>
  );
}

// Social provider glyphs (inline SVG)
const GoogleG = (
  <svg viewBox="0 0 18 18" className="responsive-icon" style={{ '--size': 'var(--icon-sm)' } as any}>
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.91c1.7-1.57 2.68-3.88 2.68-6.61z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.46-.81 5.96-2.18l-2.91-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H.95v2.33A9 9 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.95A9 9 0 0 0 0 9c0 1.45.35 2.82.95 4.04l3.02-2.33z"/>
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.96L3.97 7.3C4.68 5.16 6.66 3.58 9 3.58z"/>
  </svg>
);
const AppleA = (
  <svg viewBox="0 0 18 18" fill="currentColor" className="responsive-icon" style={{ '--size': 'var(--icon-sm)' } as any}>
    <path d="M14.94 13.6c-.36.83-.5 1.2-.96 1.94-.65 1.04-1.56 2.34-2.69 2.35-1 .01-1.26-.65-2.62-.65-1.36.01-1.65.66-2.65.65-1.13-.01-1.99-1.18-2.64-2.22-1.82-2.92-2.01-6.36-.89-8.18.8-1.3 2.06-2.06 3.24-2.06 1.21 0 1.97.66 2.97.66.97 0 1.56-.66 2.96-.66 1.06 0 2.18.58 2.98 1.58-2.62 1.43-2.19 5.17.3 6.59zM10.92 3.05A3.18 3.18 0 0 0 11.7.42 3.49 3.49 0 0 0 9.43 1.6c-.4.5-.78 1.27-.65 2.04 1 .03 2.04-.51 2.6-1.18z"/>
  </svg>
);

// ────────────────────────────────────────────────────────────────
// Bento (right side of split layout)
// ────────────────────────────────────────────────────────────────
function AuthBento({ variant = 'shop' }) {
  const heroImg = variant === 'sell'
    ? "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=1600&q=80&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1618375531912-867984bdfd87?w=1600&q=80&auto=format&fit=crop";

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(6, 1fr)',
      gap: 14, height: '100%', minHeight: 640,
    }}>
      <div style={{
        gridColumn: '1 / 5', gridRow: '1 / 5',
        borderRadius: 'var(--r-lg)', overflow: 'hidden', background: '#000', position: 'relative',
      }}>
        <img src={heroImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 6 }}>
          <span className="sticker out" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', color: 'var(--cream)', borderColor: 'rgba(255,255,255,0.3)' }}>
            {variant === 'sell' ? 'For Sellers' : 'Spring · 2026'}
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, color: 'var(--cream)' }}>
          <div className="mono-sm" style={{ opacity: 0.85, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>
            — {variant === 'sell' ? 'Apply to sell' : 'Vol. 03'}
          </div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.02 }}>
            {variant === 'sell'
              ? <>Studios that <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400 }}>make</span>.</>
              : <>The new <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400 }}>edit</span>.</>}
          </div>
        </div>
      </div>
      <div className="fz-card tinted-lime" style={{ gridColumn: '5 / 7', gridRow: '1 / 3', padding: 18, containerType: 'inline-size' }}>
        <div className="mono-label" style={{ fontSize: 10, marginBottom: 10 }}>{variant === 'sell' ? 'Avg. payout' : 'Members'}</div>
        <div style={{ fontFamily: 'var(--display)', fontSize: 'clamp(20px, 20cqw, 44px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>{variant === 'sell' ? '₦2.4m' : '12,400'}</div>
        <div className="mono-sm" style={{ marginTop: 10, fontSize: 11, opacity: 0.75 }}>{variant === 'sell' ? 'per partner brand · 2026 Q1' : 'across 38 countries'}</div>
      </div>
      <div className="fz-card tinted-butter" style={{ gridColumn: '5 / 7', gridRow: '3 / 5', padding: 18 }}>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, lineHeight: 1.3, marginBottom: 14 }}>
          {variant === 'sell' ? '"Kiosque sent us our first international order in week two."' : '"Pieces I couldn\'t find anywhere else. Shipped to Brooklyn in four days."'}
        </div>
        <div className="mono-sm" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>— {variant === 'sell' ? 'Adìrẹ Ilọrin · Lagos' : 'Adaeze, member since ’24'}</div>
      </div>
      <div className="fz-card" style={{ gridColumn: '1 / 5', gridRow: '5 / 7', padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--cream)' }}>
        <div className="mono-label" style={{ fontSize: 10 }}>— As covered in</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          {['VOGUE BUSINESS', 'BUSINESSDAY', 'TECHCABAL', 'GUARDIAN', 'I-D'].map(p => <span key={p} className="mono-sm" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', opacity: 0.55 }}>{p}</span>)}
        </div>
      </div>
      <div className="fz-card tinted-ink" style={{ gridColumn: '5 / 7', gridRow: '5 / 7', padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', containerType: 'inline-size' }}>
        <div className="mono-label" style={{ fontSize: 10, color: 'var(--cream)', opacity: 0.7 }}>{variant === 'sell' ? 'Live applications' : 'Live now'}</div>
        <div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 'clamp(20px, 15cqw, 32px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--lime)' }}>{variant === 'sell' ? '47' : '218'}</div>
          <div className="mono-sm" style={{ marginTop: 8, fontSize: 11, opacity: 0.7, color: 'var(--cream)' }}>
            <span className="blink-dot" style={{ marginRight: 6 }} />
            {variant === 'sell' ? 'reviewing this week' : 'shopping right now'}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthShell({ children, bentoVariant, setRoute, isMobile, hideBento, narrow }: any) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ padding: isMobile ? '20px 20px' : '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--hairline)' }}>
        <div onClick={() => setRoute('home')} style={{ cursor: 'pointer', fontFamily: 'var(--display)', fontSize: 22, fontWeight: 900, letterSpacing: '-0.04em' }}>Kiosque<span style={{ color: 'var(--coral)' }}>.</span></div>
        <button onClick={() => setRoute('home')} className="fz-pill ghost" style={{ padding: '8px 14px', fontSize: 11 }}><span>← Back to shop</span></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: (isMobile || hideBento) ? '1fr' : '1fr 1fr', minHeight: 'calc(100vh - 84px)' }}>
        <div style={{ padding: isMobile ? '40px 20px 80px' : '64px clamp(48px, 6vw, 96px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: narrow ? 460 : 540 }}>{children}</div>
        </div>
        {!isMobile && !hideBento && <div style={{ padding: '32px 32px 32px 0' }}><AuthBento variant={bentoVariant} /></div>}
      </div>
    </div>
  );
}

function GateScreen({ goto }: any) {
  return (
    <>
      <span className="sticker lime" style={{ marginBottom: 24, display: 'inline-block' }}>Welcome</span>
      <h1 className="fz-headline" style={{ fontSize: 'clamp(48px, 5vw, 76px)', marginBottom: 20 }}>Step <span className="it">inside</span>.</h1>
      <div className="mono-md" style={{ marginBottom: 40, color: 'var(--grey-ink, var(--ink))', maxWidth: 420, lineHeight: 1.55 }}>A members' marketplace for African fashion. Original items from independent designers and partner brands, shipped worldwide.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        <PrimaryBtn onClick={() => goto(STEPS.SIGN_IN)}>Sign in</PrimaryBtn>
        <GhostBtn onClick={() => goto(STEPS.SIGN_UP_PICK)}>Create an account</GhostBtn>
      </div>
      <div style={{ height: 1, background: 'var(--hairline)', margin: '24px 0' }} />
      <div className="mono-sm" style={{ color: 'var(--grey)', fontSize: 11 }}>Are you a designer or studio? <span onClick={() => goto(STEPS.APPLY_1)} style={{ color: 'var(--ink)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>Apply to sell →</span></div>
    </>
  );
}

function SignInScreen({ goto, onSignIn }: any) {
  const [email, setEmail] = useAuthState('');
  const [password, setPassword] = useAuthState('');
  const [show, setShow] = useAuthState(false);
  const [loading, setLoading] = useAuthState(false);
  const [err, setErr] = useAuthState<string | null>(null);

  const submit = () => {
    setErr(null);
    if (!email.includes('@')) { setErr('Enter a valid email address'); return; }
    if (password.length < 4) { setErr('Password is too short'); return; }
    setLoading(true);
    setTimeout(() => onSignIn({ email, name: email.split('@')[0].replace(/\W/g, ' ') }), 900);
  };

  return (
    <>
      <span className="sticker out" style={{ marginBottom: 20, display: 'inline-block' }}>Sign in</span>
      <h1 className="fz-headline" style={{ fontSize: 'clamp(40px, 4vw, 60px)', marginBottom: 14 }}>Welcome <span className="it">back</span>.</h1>
      <div className="mono-sm" style={{ marginBottom: 36, color: 'var(--grey)' }}>New here? <span onClick={() => goto(STEPS.SIGN_UP_PICK)} style={{ color: 'var(--ink)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>Create an account</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <GhostBtn full icon={GoogleG} onClick={() => onSignIn({ email: 'guest@google.com', name: 'Guest', via: 'google' })}>Google</GhostBtn>
        <GhostBtn full icon={AppleA} onClick={() => onSignIn({ email: 'guest@privaterelay.appleid.com', name: 'Guest', via: 'apple' })}>Apple</GhostBtn>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ flex: 1, height: 1, background: 'var(--hairline)' }} />
        <span className="mono-sm" style={{ color: 'var(--grey)', fontSize: 10, letterSpacing: '0.16em' }}>OR</span>
        <span style={{ flex: 1, height: 1, background: 'var(--hairline)' }} />
      </div>
      <AuthInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoFocus />
      <div style={{ position: 'relative' }}>
        <AuthInput label="Password" type={show ? 'text' : 'password'} value={password} onChange={setPassword} placeholder="••••••••" />
        <span onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 14, top: 38, cursor: 'pointer', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--grey)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{show ? 'Hide' : 'Show'}</span>
      </div>
      {err && <div className="mono-sm" style={{ color: '#C9472A', fontSize: 11, marginTop: -6, marginBottom: 14 }}>{err}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <span className="mono-sm" onClick={() => goto(STEPS.MAGIC)} style={{ cursor: 'pointer', color: 'var(--ink)', fontSize: 11, textDecoration: 'underline', textUnderlineOffset: 3 }}>Email me a magic link instead</span>
        <span className="mono-sm" onClick={() => goto(STEPS.FORGOT)} style={{ cursor: 'pointer', color: 'var(--grey)', fontSize: 11 }}>Forgot password?</span>
      </div>
      <PrimaryBtn onClick={submit} loading={loading}>Continue</PrimaryBtn>
      <div style={{ marginTop: 32, padding: 14, background: 'var(--cream-soft)', borderRadius: 12 }}>
        <div className="mono-sm" style={{ fontSize: 11, color: 'var(--grey)', lineHeight: 1.5 }}>
          Are you a designer? <span onClick={() => goto(STEPS.APPLY_1)} style={{ color: 'var(--ink)', cursor: 'pointer', fontWeight: 600 }}>Apply to sell on Kiosque →</span>
        </div>
      </div>
    </>
  );
}

function SignUpPickScreen({ goto }: any) {
  const cards = [
    { key: 'buyer', sticker: 'For shopping', stickerClass: 'lime', title: 'Become a member', title2: 'shop the marketplace', copy: 'Buy from independent partner brands across Africa. Free returns, local and international billing, direct shipping.', bullets: ['Save items and follow brand partners', 'Naira primary, USD diaspora options', 'Early access to drops'], cta: 'Continue as member', onClick: () => goto(STEPS.SIGN_UP_BUYER), tint: 'tinted-lime' },
    { key: 'vendor', sticker: 'For sellers', stickerClass: 'out', title: 'Apply to sell', title2: 'list your brand', copy: 'Independent designers, makers, and boutiques. We curate, list, ship, and pay you the day after fulfilment.', bullets: ['90% revenue share', 'We handle logistics + global shipping', 'Editorial coverage in Vol. 03'], cta: 'Apply to sell', onClick: () => goto(STEPS.APPLY_1), tint: 'tinted-butter' },
  ];
  return (
    <>
      <span className="sticker out" style={{ marginBottom: 20, display: 'inline-block' }}>Sign up</span>
      <h1 className="fz-headline" style={{ fontSize: 'clamp(40px, 4vw, 60px)', marginBottom: 14 }}>Shopping or <span className="it">selling</span>?</h1>
      <div className="mono-sm" style={{ marginBottom: 36, color: 'var(--grey)' }}>Two doors. You can change your mind later.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {cards.map(c => (
          <div key={c.key} className={`fz-card ${c.tint}`} onClick={c.onClick} style={{ cursor: 'pointer', padding: 22 }}>
            <span className={`sticker ${c.stickerClass}`} style={{ marginBottom: 14, display: 'inline-block' }}>{c.sticker}</span>
            <div className="fz-headline" style={{ fontSize: 32, lineHeight: 1.05, marginBottom: 12 }}>{c.title} · <span className="it">{c.title2}</span></div>
            <div className="mono-sm" style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 14, opacity: 0.85 }}>{c.copy}</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
              {c.bullets.map(b => (
                <li key={b} className="mono-sm" style={{ fontSize: 11, opacity: 0.85, display: 'flex', gap: 8 }}>
                  <span style={{ opacity: 0.5 }}>—</span><span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mono-label" style={{ fontSize: 10, fontWeight: 600 }}>{c.cta} →</div>
          </div>
        ))}
      </div>
      <div className="mono-sm" style={{ marginTop: 28, color: 'var(--grey)', fontSize: 11, textAlign: 'center' }}>Already a member? <span onClick={() => goto(STEPS.SIGN_IN)} style={{ color: 'var(--ink)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>Sign in</span></div>
    </>
  );
}

function SignUpBuyerScreen({ goto, onSignUp }: any) {
  const [first, setFirst] = useAuthState('');
  const [last, setLast] = useAuthState('');
  const [email, setEmail] = useAuthState('');
  const [password, setPassword] = useAuthState('');
  const [country, setCountry] = useAuthState('Nigeria');
  const [tos, setTos] = useAuthState(false);
  const [news, setNews] = useAuthState(true);
  const [loading, setLoading] = useAuthState(false);
  const [errs, setErrs] = useAuthState<any>({});

  const submit = () => {
    const e: any = {};
    if (!first.trim()) e.first = 'Required';
    if (!last.trim()) e.last = 'Required';
    if (!email.includes('@')) e.email = 'Enter a valid email';
    if (password.length < 8) e.password = 'At least 8 characters';
    if (!tos) e.tos = 'You must agree';
    setErrs(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => onSignUp({ email, name: `${first} ${last}`.trim(), country, role: 'buyer', news }), 800);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span onClick={() => goto(STEPS.SIGN_UP_PICK)} style={{ cursor: 'pointer', fontSize: 11, color: 'var(--grey)' }}>← Back</span>
        <span className="sticker lime">Member · 1 of 1</span>
      </div>
      <h1 className="fz-headline" style={{ fontSize: 'clamp(36px, 3.6vw, 52px)', marginBottom: 12 }}>Make an <span className="it">account</span>.</h1>
      <div className="mono-sm" style={{ marginBottom: 32, color: 'var(--grey)' }}>About a minute. We'll never spam you.</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <AuthInput label="First name" value={first} onChange={setFirst} placeholder="Adaeze" autoFocus error={errs.first} />
        <AuthInput label="Last name" value={last} onChange={setLast} placeholder="Onyemechi" error={errs.last} />
      </div>
      <AuthInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" error={errs.email} />
      <AuthInput label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 8 characters" hint="8+ chars · 1 number recommended" error={errs.password} />
      <label style={{ display: 'block', marginBottom: 18 }}>
        <div className="mono-label" style={{ marginBottom: 8, fontSize: 10 }}>Shipping country</div>
        <select value={country} onChange={(e) => setCountry(e.target.value)} style={{ width: '100%', padding: '14px 16px', fontFamily: 'var(--mono)', fontSize: 14, background: 'var(--cream)', border: '1px solid var(--hairline-strong, var(--hairline))', borderRadius: 12, outline: 'none' }}>
          {['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United Kingdom', 'United States', 'Canada', 'Germany', 'France', 'Other'].map(c => <option key={c}>{c}</option>)}
        </select>
      </label>
      <div style={{ marginTop: 8 }}>
        <AuthCheckbox checked={tos} onChange={setTos}>I agree to the <span style={{ color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Terms</span> and <span style={{ color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Privacy Policy</span>.</AuthCheckbox>
        {errs.tos && <div className="mono-sm" style={{ color: '#C9472A', fontSize: 11, marginTop: -10, marginBottom: 10 }}>{errs.tos}</div>}
        <AuthCheckbox checked={news} onChange={setNews}>Send me Vol. 03 of the Journal and occasional drops. Unsubscribe anytime.</AuthCheckbox>
      </div>
      <div style={{ marginTop: 20 }}><PrimaryBtn onClick={submit} loading={loading}>Create account</PrimaryBtn></div>
    </>
  );
}

function VendorApplyScreen({ step, goto, onApply }: any) {
  const [data, setData] = useAuthState<any>(() => { try { return JSON.parse(sessionStorage.getItem('kiosque.apply') || '{}'); } catch (_) { return {}; } });
  useAuthEffect(() => { sessionStorage.setItem('kiosque.apply', JSON.stringify(data)); }, [data]);
  const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

  const idx = { [STEPS.APPLY_1]: 0, [STEPS.APPLY_2]: 1, [STEPS.APPLY_3]: 2 }[step] ?? 0;
  const labels = ['Studio', 'Practice', 'Banking'];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span onClick={() => idx > 0 ? goto([STEPS.APPLY_1, STEPS.APPLY_2, STEPS.APPLY_3][idx - 1]) : goto(STEPS.SIGN_UP_PICK)} style={{ cursor: 'pointer', fontSize: 11, color: 'var(--grey)' }}>← Back</span>
        <span className="sticker out">Apply · {idx + 1} of 3 · {labels[idx]}</span>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ flex: 1, height: 4, background: i <= idx ? 'var(--ink)' : 'var(--hairline)', borderRadius: 2, transition: 'background 300ms' }} />)}
      </div>

      {step === STEPS.APPLY_1 && (
        <>
          <h1 className="fz-headline" style={{ fontSize: 'clamp(36px, 3.6vw, 52px)', marginBottom: 12 }}>Tell us about <span className="it">the studio</span>.</h1>
          <div className="mono-sm" style={{ marginBottom: 32, color: 'var(--grey)' }}>Real, in-house production only. We visit before listing.</div>
          <AuthInput label="Atelier name" value={data.brand || ''} onChange={(v: any) => set('brand', v)} placeholder="e.g. Adìrẹ Ilọrin" autoFocus />
          <AuthInput label="Founder name" value={data.founder || ''} onChange={(v: any) => set('founder', v)} placeholder="Your name" />
          <AuthInput label="Email" type="email" value={data.email || ''} onChange={(v: any) => set('email', v)} placeholder="hello@yourstudio.com" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <AuthInput label="City" value={data.city || ''} onChange={(v: any) => set('city', v)} placeholder="Lagos" />
            <label style={{ display: 'block', marginBottom: 18 }}>
              <div className="mono-label" style={{ marginBottom: 8, fontSize: 10 }}>Country</div>
              <select value={data.country || 'Nigeria'} onChange={(e) => set('country', e.target.value)} style={{ width: '100%', padding: '14px 16px', fontFamily: 'var(--mono)', fontSize: 14, background: 'var(--cream)', border: '1px solid var(--hairline-strong, var(--hairline))', borderRadius: 12, outline: 'none' }}>
                {['Nigeria', 'Ghana', 'Senegal', 'Kenya', 'Côte d\'Ivoire', 'South Africa', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <AuthInput label="Founded" value={data.founded || ''} onChange={(v: any) => set('founded', v)} placeholder="2018" hint="The year you started taking orders" />
          <PrimaryBtn onClick={() => goto(STEPS.APPLY_2)}>Continue</PrimaryBtn>
        </>
      )}

      {step === STEPS.APPLY_2 && (
        <>
          <h1 className="fz-headline" style={{ fontSize: 'clamp(36px, 3.6vw, 52px)', marginBottom: 12 }}>What do you <span className="it">make</span>?</h1>
          <div className="mono-sm" style={{ marginBottom: 32, color: 'var(--grey)' }}>We curate. Tell us about the practice, not the catalogue.</div>
          <div style={{ marginBottom: 18 }}>
            <div className="mono-label" style={{ marginBottom: 10, fontSize: 10 }}>Categories — pick all that apply</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Womenswear', 'Menswear', 'Tailoring', 'Adire / dyed', 'Knitwear', 'Leather', 'Accessories', 'Bags', 'Footwear', 'Jewelry'].map(c => {
                const on = (data.categories || []).includes(c);
                return (
                  <span key={c} onClick={() => set('categories', on ? data.categories.filter((x: any) => x !== c) : [...(data.categories || []), c])}
                    className="sticker" style={{ cursor: 'pointer', background: on ? 'var(--ink)' : 'transparent', color: on ? 'var(--cream)' : 'var(--ink)', borderColor: 'var(--hairline-strong, var(--hairline))' }}>{c}</span>
                );
              })}
            </div>
          </div>
          <label style={{ display: 'block', marginBottom: 18 }}>
            <div className="mono-label" style={{ marginBottom: 8, fontSize: 10 }}>Tell us about the studio</div>
            <textarea value={data.about || ''} onChange={(e) => set('about', e.target.value)} placeholder="What do you make, who makes it, what materials, how long has it taken to get here…" rows={5}
              style={{ width: '100%', padding: '14px 16px', fontFamily: 'var(--mono)', fontSize: 13, lineHeight: 1.55, background: 'var(--cream)', border: '1px solid var(--hairline-strong, var(--hairline))', borderRadius: 12, outline: 'none', resize: 'vertical' }} />
          </label>
          <AuthInput label="Instagram or website" value={data.web || ''} onChange={(v: any) => set('web', v)} placeholder="@yourstudio  ·  yourstudio.com" hint="So we can see the work" />
          <div style={{ marginBottom: 18 }}>
            <div className="mono-label" style={{ marginBottom: 8, fontSize: 10 }}>Portfolio — upload 5+ images</div>
            <div className="fz-card" style={{ padding: 24, textAlign: 'center', borderStyle: 'dashed', cursor: 'pointer' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>↑</div>
              <div className="mono-sm" style={{ fontSize: 11 }}>Drop images here or <span style={{ textDecoration: 'underline' }}>browse</span></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <GhostBtn onClick={() => goto(STEPS.APPLY_1)}>Back</GhostBtn>
            <PrimaryBtn onClick={() => goto(STEPS.APPLY_3)}>Continue</PrimaryBtn>
          </div>
        </>
      )}

      {step === STEPS.APPLY_3 && (
        <>
          <h1 className="fz-headline" style={{ fontSize: 'clamp(36px, 3.6vw, 52px)', marginBottom: 12 }}>How we <span className="it">pay you</span>.</h1>
          <div className="mono-sm" style={{ marginBottom: 32, color: 'var(--grey)' }}>We pay weekly via bank transfer. Naira to Nigerian banks; international to Wise/USD account.</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {['Nigeria (Naira)', 'International (USD)'].map(p => <span key={p} onClick={() => set('payout', p)} className="sticker" style={{ cursor: 'pointer', background: (data.payout || 'Nigeria (Naira)') === p ? 'var(--ink)' : 'transparent', color: (data.payout || 'Nigeria (Naira)') === p ? 'var(--cream)' : 'var(--ink)', borderColor: 'var(--hairline-strong, var(--hairline))' }}>{p}</span>)}
          </div>
          <AuthInput label="Bank name" value={data.bank || ''} onChange={(v: any) => set('bank', v)} placeholder="e.g. GTBank" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <AuthInput label="Account number" value={data.account || ''} onChange={(v: any) => set('account', v)} placeholder="0123456789" />
            <AuthInput label="Account name" value={data.accountName || ''} onChange={(v: any) => set('accountName', v)} placeholder="Atelier Ltd." />
          </div>
          <AuthInput label="CAC / business reg number" value={data.reg || ''} onChange={(v: any) => set('reg', v)} placeholder="RC1234567" hint="Optional · we'll request later if needed" />
          <AuthCheckbox checked={!!data.tos} onChange={(v: any) => set('tos', v)}>I agree to the <span style={{ color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Vendor Terms</span> — 90/10 split, weekly payout, free returns within 14 days.</AuthCheckbox>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
            <GhostBtn onClick={() => goto(STEPS.APPLY_2)}>Back</GhostBtn>
            <PrimaryBtn onClick={() => { onApply(data); goto(STEPS.APPLY_DONE); }} disabled={!data.tos}>Submit application</PrimaryBtn>
          </div>
        </>
      )}
    </>
  );
}

function ApplyDoneScreen({ goto }: any) {
  return (
    <>
      <span className="sticker lime" style={{ marginBottom: 24, display: 'inline-block' }}>Received · #2026-047</span>
      <h1 className="fz-headline" style={{ fontSize: 'clamp(40px, 4.2vw, 64px)', marginBottom: 14 }}>Sit <span className="it">tight</span>.</h1>
      <div className="mono-md" style={{ marginBottom: 32, color: 'var(--grey-ink, var(--ink))', maxWidth: 460, lineHeight: 1.55 }}>We review every application by hand — typically within five working days. We'll email you either way. If it's a yes, we'll book a studio visit.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
        {[
          ['01', 'You hear from us — within 5 working days'],
          ['02', 'Studio visit — 1 hour, in person if you\'re in NG'],
          ['03', 'Your storefront goes live — first listing within 14 days'],
        ].map(([n, t]) => (
          <div key={n} className="fz-card" style={{ padding: 16, display: 'grid', gridTemplateColumns: '32px 1fr', gap: 16, alignItems: 'center' }}>
            <span className="tabular" style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: 24, letterSpacing: '-0.02em' }}>{n}</span>
            <span className="mono-sm" style={{ fontSize: 12, lineHeight: 1.4 }}>{t}</span>
          </div>
        ))}
      </div>
      <PrimaryBtn onClick={() => goto(STEPS.GATE)}>Back to start</PrimaryBtn>
    </>
  );
}

function MagicScreen({ goto }: any) {
  const [email, setEmail] = useAuthState('');
  const [sent, setSent] = useAuthState(false);
  if (sent) {
    return (
      <>
        <span className="sticker lime" style={{ marginBottom: 24, display: 'inline-block' }}>Sent</span>
        <h1 className="fz-headline" style={{ fontSize: 'clamp(40px, 4vw, 60px)', marginBottom: 14 }}>Check your <span className="it">inbox</span>.</h1>
        <div className="mono-md" style={{ marginBottom: 28, color: 'var(--grey-ink, var(--ink))', lineHeight: 1.55 }}>We sent a sign-in link to <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{email}</span>. It expires in 15 minutes.</div>
        <div className="fz-card tinted-soft" style={{ padding: 16, marginBottom: 24 }}>
          <div className="mono-sm" style={{ fontSize: 11, color: 'var(--grey-ink, var(--ink))' }}>Didn't get it? Check spam, or <span onClick={() => setSent(false)} style={{ color: 'var(--ink)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>send another</span>.</div>
        </div>
        <GhostBtn onClick={() => goto(STEPS.SIGN_IN)}>Sign in another way</GhostBtn>
      </>
    );
  }
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span onClick={() => goto(STEPS.SIGN_IN)} style={{ cursor: 'pointer', fontSize: 11, color: 'var(--grey)' }}>← Back to sign in</span>
        <span className="sticker out">Passwordless</span>
      </div>
      <h1 className="fz-headline" style={{ fontSize: 'clamp(40px, 4vw, 60px)', marginBottom: 14 }}>A <span className="it">link</span> in your inbox.</h1>
      <div className="mono-sm" style={{ marginBottom: 36, color: 'var(--grey)' }}>Easier than passwords. We'll email you a one-tap sign-in.</div>
      <AuthInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoFocus />
      <PrimaryBtn onClick={() => email.includes('@') && setSent(true)}>Send the link</PrimaryBtn>
    </>
  );
}

function ForgotScreen({ goto }: any) {
  const [email, setEmail] = useAuthState('');
  const [sent, setSent] = useAuthState(false);
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span onClick={() => goto(STEPS.SIGN_IN)} style={{ cursor: 'pointer', fontSize: 11, color: 'var(--grey)' }}>← Back to sign in</span>
        <span className="sticker out">Reset</span>
      </div>
      <h1 className="fz-headline" style={{ fontSize: 'clamp(40px, 4vw, 60px)', marginBottom: 14 }}>Forgot your <span className="it">password</span>?</h1>
      {!sent ? (
        <>
          <AuthInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoFocus />
          <PrimaryBtn onClick={() => email.includes('@') && setSent(true)}>Send reset code</PrimaryBtn>
        </>
      ) : (
        <>
          <div className="fz-card tinted-lime" style={{ padding: 18, marginBottom: 24 }}><div className="mono-sm" style={{ fontSize: 12, lineHeight: 1.5 }}>A 6-digit code is on its way to <span style={{ fontWeight: 600 }}>{email}</span>.</div></div>
          <PrimaryBtn onClick={() => goto(STEPS.RESET)}>Enter the code</PrimaryBtn>
        </>
      )}
    </>
  );
}

function ResetScreen({ goto }: any) {
  const [code, setCode] = useAuthState(['', '', '', '', '', '']);
  const [pw, setPw] = useAuthState('');
  const [pw2, setPw2] = useAuthState('');
  const [done, setDone] = useAuthState(false);
  const refs = useAuthRef<any>([]);
  const setDigit = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const nc = [...code]; nc[i] = v; setCode(nc);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  if (done) return (
    <>
      <span className="sticker lime" style={{ marginBottom: 24, display: 'inline-block' }}>Updated</span>
      <h1 className="fz-headline" style={{ fontSize: 'clamp(40px, 4vw, 60px)', marginBottom: 14 }}>New <span className="it">password</span> set.</h1>
      <PrimaryBtn onClick={() => goto(STEPS.SIGN_IN)}>Sign in</PrimaryBtn>
    </>
  );
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span onClick={() => goto(STEPS.FORGOT)} style={{ cursor: 'pointer', fontSize: 11, color: 'var(--grey)' }}>← Back</span>
        <span className="sticker out">Reset</span>
      </div>
      <h1 className="fz-headline" style={{ fontSize: 'clamp(36px, 3.6vw, 52px)', marginBottom: 14 }}>Set a new <span className="it">password</span>.</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 22, maxWidth: 380 }}>
        {code.map((d, i) => <input key={i} ref={el => refs.current[i] = el} value={d} onChange={e => setDigit(i, e.target.value)} maxLength={1} inputMode="numeric" style={{ width: '100%', aspectRatio: '1/1', textAlign: 'center', fontSize: 22, fontWeight: 900, background: 'var(--cream)', border: '1px solid var(--hairline-strong)', borderRadius: 12, outline: 'none' }} />)}
      </div>
      <AuthInput label="New password" type="password" value={pw} onChange={setPw} placeholder="At least 8 characters" />
      <AuthInput label="Confirm" type="password" value={pw2} onChange={setPw2} placeholder="Same again" error={pw && pw2 && pw !== pw2 ? 'Passwords don\'t match' : null} />
      <PrimaryBtn onClick={() => { if (pw.length >= 8 && pw === pw2) setDone(true); }} disabled={!(pw.length >= 8 && pw === pw2 && code.every(d => d))}>Update password</PrimaryBtn>
    </>
  );
}

function VerifyScreen({ goto, onVerified, email }: any) {
  const [code, setCode] = useAuthState(['', '', '', '', '', '']);
  const [resent, setResent] = useAuthState(false);
  const refs = useAuthRef<any>([]);
  const setDigit = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const nc = [...code]; nc[i] = v; setCode(nc);
    if (v && i < 5) refs.current[i + 1]?.focus();
    if (i === 5 && v) setTimeout(onVerified, 600);
  };
  return (
    <>
      <span className="sticker out" style={{ marginBottom: 16, display: 'inline-block' }}>Verify</span>
      <h1 className="fz-headline" style={{ fontSize: 'clamp(40px, 4vw, 60px)', marginBottom: 14 }}>Confirm <span className="it">it's you</span>.</h1>
      <div className="mono-md" style={{ marginBottom: 32, color: 'var(--grey-ink)' }}>We sent a 6-digit code to <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{email || 'your email'}</span>.</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 22, maxWidth: 420 }}>
        {code.map((d, i) => <input key={i} ref={el => refs.current[i] = el} value={d} onChange={e => setDigit(i, e.target.value)} maxLength={1} inputMode="numeric" autoFocus={i === 0} style={{ width: '100%', aspectRatio: '1/1', textAlign: 'center', fontSize: 28, fontWeight: 900, background: 'var(--cream)', border: '1px solid var(--hairline-strong)', borderRadius: 14, outline: 'none' }} />)}
      </div>
      <div className="mono-sm" style={{ color: 'var(--grey)', fontSize: 11, marginBottom: 24 }}>Didn't get it? <span onClick={() => setResent(true)} style={{ color: 'var(--ink)', cursor: 'pointer', textDecoration: 'underline' }}>Resend</span>{resent && <span style={{ marginLeft: 12, color: 'var(--lime-deep)' }}>· sent again</span>}</div>
      <PrimaryBtn onClick={onVerified} disabled={!code.every(d => d)}>Continue</PrimaryBtn>
    </>
  );
}

function OnboardScreen({ onDone, name }: any) {
  const [step, setStep] = useAuthState(0);
  const [data, setData] = useAuthState({ sizes: [], styles: [], cats: [], price: 'mid' });
  const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));
  const toggle = (k: string, v: any) => set(k, data[k as keyof typeof data].includes(v as never) ? (data[k as keyof typeof data] as any[]).filter(x => x !== v) : [...(data[k as keyof typeof data] as any[]), v]);

  const screens = [
    {
      t: 'sizes',
      title: <>Tell us your <span className="it">sizes</span>.</>,
      sub: 'We\'ll only show you what fits.',
      sticker: 'Style profile · 1 of 3',
      body: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['XS', 'S', 'M', 'L', 'XL', '2XL', 'EU 36', 'EU 38', 'EU 40', 'EU 42', 'EU 44', 'EU 46'].map(s => {
            const on = data.sizes.includes(s as never);
            return <span key={s} onClick={() => toggle('sizes', s)} className="sticker" style={{ cursor: 'pointer', background: on ? 'var(--ink)' : 'transparent', color: on ? 'var(--cream)' : 'var(--ink)', borderColor: 'var(--hairline-strong)' }}>{s}</span>;
          })}
        </div>
      ),
    },
    {
      t: 'styles',
      title: <>What's the <span className="it">vibe</span>?</>,
      sub: 'Three or four. We\'ll do the rest.',
      sticker: 'Style profile · 2 of 3',
      body: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Tailored', 'Soft & flowing', 'Streetwear', 'Heritage / craft', 'Workwear', 'Knit', 'Statement', 'Quiet', 'Tropical-weight', 'Layered'].map(s => {
            const on = data.styles.includes(s as never);
            return <span key={s} onClick={() => toggle('styles', s)} className="sticker" style={{ cursor: 'pointer', background: on ? 'var(--ink)' : 'transparent', color: on ? 'var(--cream)' : 'var(--ink)', borderColor: 'var(--hairline-strong)' }}>{s}</span>;
          })}
        </div>
      ),
    },
    {
      t: 'price',
      title: <>And <span className="it">budget</span>?</>,
      sub: 'Honest answers. We won\'t share.',
      sticker: 'Style profile · 3 of 3',
      body: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['under', 'Under ₦80k', '$50'],
            ['mid', '₦80k – ₦300k', '$50 – $200'],
            ['high', '₦300k – ₦800k', '$200 – $500'],
            ['top', 'Above ₦800k', '$500+'],
          ].map(([k, n, u]) => (
            <div key={k} onClick={() => set('price', k)} className="fz-card" style={{ padding: 16, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: data.price === k ? 'var(--lime)' : 'var(--cream)', borderColor: data.price === k ? 'var(--lime-deep)' : 'var(--hairline)' }}>
              <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 18 }}>{n}</span>
              <span className="mono-sm tabular" style={{ fontSize: 11, opacity: 0.7 }}>≈ {u}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const s = screens[step];
  return (
    <>
      <span className="sticker lime" style={{ marginBottom: 16, display: 'inline-block' }}>{s.sticker}</span>
      <h1 className="fz-headline" style={{ fontSize: 'clamp(36px, 3.6vw, 52px)', marginBottom: 12 }}>{step === 0 && name ? <>Welcome, <span className="it">{name.split(' ')[0]}</span>.</> : s.title}</h1>
      <div className="mono-md" style={{ marginBottom: 28, color: 'var(--grey-ink)' }}>{step === 0 && name ? s.title : s.sub}</div>
      <div style={{ marginBottom: 28 }}>{s.body}</div>
      <div style={{ display: 'grid', gridTemplateColumns: step > 0 ? '1fr 1fr' : '1fr', gap: 10 }}>
        {step > 0 && <GhostBtn onClick={() => setStep(s => s - 1)}>Back</GhostBtn>}
        {step < 2 ? <PrimaryBtn onClick={() => setStep(s => s + 1)}>Continue</PrimaryBtn> : <PrimaryBtn onClick={() => onDone(data)}>Finish</PrimaryBtn>}
      </div>
      <div className="mono-sm" style={{ marginTop: 20, color: 'var(--grey)', fontSize: 11, textAlign: 'center', cursor: 'pointer' }} onClick={() => onDone(data)}>Skip for now</div>
    </>
  );
}

function WelcomeScreen({ name, setRoute }: any) {
  return (
    <>
      <span className="sticker lime" style={{ marginBottom: 24, display: 'inline-block' }}>You're in</span>
      <h1 className="fz-headline" style={{ fontSize: 'clamp(48px, 5vw, 76px)', marginBottom: 14 }}>Welcome, <span className="it">{name?.split(' ')[0] || 'friend'}</span>.</h1>
      <div className="mono-md" style={{ marginBottom: 32, color: 'var(--grey-ink)', maxWidth: 460, lineHeight: 1.55 }}>Your edit is ready. We've already saved a few pieces we think you'll like.</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <PrimaryBtn onClick={() => setRoute('listing')}>Browse the edit</PrimaryBtn>
        <GhostBtn onClick={() => setRoute('account')}>Go to account</GhostBtn>
      </div>
    </>
  );
}

function SignedOutScreen({ goto, setRoute }: any) {
  return (
    <>
      <span className="sticker out" style={{ marginBottom: 24, display: 'inline-block' }}>Signed out</span>
      <h1 className="fz-headline" style={{ fontSize: 'clamp(40px, 4vw, 60px)', marginBottom: 14 }}>Until <span className="it">next time</span>.</h1>
      <div className="mono-md" style={{ marginBottom: 32, color: 'var(--grey-ink)', maxWidth: 420, lineHeight: 1.55 }}>Your saved pieces and addresses are still here when you come back.</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <PrimaryBtn onClick={() => goto(STEPS.SIGN_IN)}>Sign in again</PrimaryBtn>
        <GhostBtn onClick={() => setRoute('home')}>Keep browsing</GhostBtn>
      </div>
    </>
  );
}

function ExpiredScreen({ goto }: any) {
  return (
    <>
      <span className="sticker" style={{ marginBottom: 24, display: 'inline-block', background: 'var(--coral)', color: 'var(--cream)' }}>Session expired</span>
      <h1 className="fz-headline" style={{ fontSize: 'clamp(40px, 4vw, 60px)', marginBottom: 14 }}>That took a <span className="it">while</span>.</h1>
      <PrimaryBtn onClick={() => goto(STEPS.SIGN_IN)}>Sign in</PrimaryBtn>
    </>
  );
}

export function Auth({ setRoute, isMobile, initialStep, setUser }: any) {
  const { showToast } = useToast();
  const [step, setStep] = useAuthState(initialStep || STEPS.GATE);
  const [pendingEmail, setPendingEmail] = useAuthState('');
  const [pendingName, setPendingName] = useAuthState('');

  const goto = (s: string) => { setStep(s); window.scrollTo(0, 0); };
  const sellSteps = [STEPS.APPLY_1, STEPS.APPLY_2, STEPS.APPLY_3, STEPS.APPLY_DONE];
  const bentoVariant = sellSteps.includes(step) ? 'sell' : 'shop';

  const onSignIn = async (u: any) => {
    try {
      const email = u.email || 'guest@google.com';
      const user = await apiSignIn(email);
      saveUser(user);
      if (setUser) setUser(user);
      setRoute('home');
      showToast({
        title: 'Welcome Back',
        description: `Successfully signed into active member session as ${user.name}.`,
        variant: 'success'
      });
    } catch (err) {
      showToast({
        title: 'Authentication Denied',
        description: 'Server credentials check rejected email sign-in.',
        variant: 'error'
      });
    }
  };

  const onSignUp = async (u: any) => {
    try {
      await apiSignUp(u.email, u.name);
      setPendingEmail(u.email);
      setPendingName(u.name);
      goto(STEPS.VERIFY);
      showToast({
        title: 'Verification Code Sent',
        description: `A 6-digit confirmation key has been dispatched to ${u.email}.`,
        variant: 'info'
      });
    } catch (err) {
      showToast({
        title: 'Failed Registration',
        description: 'Database rejected account creation. The email may already be in use.',
        variant: 'error'
      });
    }
  };
  const onVerified = () => {
    goto(STEPS.ONBOARD);
    showToast({
      title: 'Email Verified',
      description: 'Your email address was successfully handshake-validated.',
      variant: 'success'
    });
  };
  const onOnboardDone = async (profile: any) => {
    try {
      const user = await apiOnboard(pendingEmail, pendingName, profile);
      saveUser(user);
      if (setUser) setUser(user);
      goto(STEPS.ONBOARD_DONE);
      showToast({
        title: 'Onboarding Complete',
        description: `Premium curated feed prepared for @${pendingName.toLowerCase().replace(/\s/g, '')}.`,
        variant: 'success'
      });
    } catch (err) {
      showToast({
        title: 'Onboard Handshake Error',
        description: 'Failed to finalize profile registry save in databases.',
        variant: 'error'
      });
    }
  };

  const onApply = async (data: any) => {
    try {
      await apiVendorApply(data);
      sessionStorage.removeItem('kiosque.apply');
      showToast({
        title: 'Application Received',
        description: 'Our creative directors will review your atelier profile within 48h.',
        variant: 'success',
        duration: 5000
      });
    } catch (err) {
      showToast({
        title: 'Application Error',
        description: 'Failed to upload studio listings portfolio to review server.',
        variant: 'error'
      });
    }
  };

  return (
    <AuthShell setRoute={setRoute} isMobile={isMobile} bentoVariant={bentoVariant}>
      {step === STEPS.GATE && <GateScreen goto={goto} />}
      {step === STEPS.SIGN_IN && <SignInScreen goto={goto} onSignIn={onSignIn} />}
      {step === STEPS.SIGN_UP_PICK && <SignUpPickScreen goto={goto} />}
      {step === STEPS.SIGN_UP_BUYER && <SignUpBuyerScreen goto={goto} onSignUp={onSignUp} />}
      {[STEPS.APPLY_1, STEPS.APPLY_2, STEPS.APPLY_3].includes(step) && <VendorApplyScreen step={step} goto={goto} onApply={onApply} />}
      {step === STEPS.APPLY_DONE && <ApplyDoneScreen goto={goto} />}
      {step === STEPS.MAGIC && <MagicScreen goto={goto} />}
      {step === STEPS.FORGOT && <ForgotScreen goto={goto} />}
      {step === STEPS.RESET && <ResetScreen goto={goto} />}
      {step === STEPS.VERIFY && <VerifyScreen goto={goto} onVerified={onVerified} email={pendingEmail} />}
      {step === STEPS.ONBOARD && <OnboardScreen name={pendingName} onDone={onOnboardDone} />}
      {step === STEPS.ONBOARD_DONE && <WelcomeScreen name={pendingName} setRoute={setRoute} />}
      {step === STEPS.SIGNED_OUT && <SignedOutScreen goto={goto} setRoute={setRoute} />}
      {step === STEPS.EXPIRED && <ExpiredScreen goto={goto} />}
    </AuthShell>
  );
}
