import React from 'react';

const ACCENTS = { orange: '#FC6815', teal: '#24C6B7', purple: '#B287FD', yellow: '#FFEA00', brand: '#FFEA00' };

export function Card({ variant = 'elevated', emphasis = 'none', accent = 'orange', ground = 'light', barTone, padding = 'var(--space-6)', interactive = false, tag, tagTone = 'accent', tagAlign = 'start', children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const faces = {
    elevated: { background: 'var(--surface-card)', boxShadow: hover && interactive ? 'var(--shadow-lg)' : 'var(--shadow-sm)' },
    outlined: { background: 'var(--surface-card)', boxShadow: 'inset 0 0 0 1px var(--border-default)' },
    filled:   { background: 'var(--oc-gray-100)', boxShadow: 'none' },
    inverse:  { background: '#3D3D3D', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.16)', color: 'var(--text-inverse)' },
  };
  // variant="bar" is the pre-2026-09-18 name for emphasis="accent"
  const mode = variant === 'bar' ? 'accent' : emphasis;
  const face = faces[variant] || faces.elevated;
  const bar = ACCENTS[barTone] || ACCENTS[accent] || ACCENTS.orange;
  const emph = mode === 'neutral'
    ? (ground === 'ink'
      ? { background: 'var(--oc-gray-100)', color: 'var(--text-primary)', boxShadow: 'none' }
      : { background: 'var(--oc-white)', boxShadow: 'inset 0 0 0 1px var(--oc-gray-300), var(--shadow-sm)' })
    : mode === 'accent'
      ? { background: 'var(--oc-gray-100)', color: 'var(--text-primary)', boxShadow: 'inset 10px 0 0 ' + bar }
      : null;
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', overflow: 'hidden', minWidth: 0,
        display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
        borderRadius: 'var(--radius-lg)', padding, fontFamily: 'var(--font-sans)',
        color: 'var(--text-primary)',
        transition: 'box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)',
        transform: hover && interactive ? 'translateY(-2px)' : 'none',
        cursor: interactive ? 'pointer' : undefined,
        ...face,
        ...emph,
        ...(mode === 'accent' ? { paddingLeft: `calc(${padding} + 10px)` } : null),
        ...style,
      }} {...rest}>
      {tag && (
        <span style={{
          alignSelf: tagAlign === 'end' ? 'flex-end' : 'flex-start', display: 'inline-flex', alignItems: 'center', height: 23, padding: '0 9px',
          background: 'transparent',
          boxShadow: tagTone === 'inverse' ? 'inset 0 0 0 1.33px var(--oc-white)' : 'inset 0 0 0 1.33px var(--oc-orange)',
          color: tagTone === 'inverse' ? 'var(--oc-white)' : 'var(--oc-orange)',
          fontSize: 'var(--fs-micro)', fontWeight: 'var(--fw-medium)', letterSpacing: '.06em', borderRadius: 'var(--radius-pill)',
        }}>{tag}</span>
      )}
      {children}
    </div>
  );
}
