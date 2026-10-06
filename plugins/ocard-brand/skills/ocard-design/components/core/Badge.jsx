import React from 'react';

// 品牌規則：輔助色標籤一律白底 + 1pt 外框 + 同色文字 — 不填滿、不加陰影。
// 文字跟外框同色（視覺張力）；青與紫用加深版，小字才讀得清。
// 實心填色只有兩種：品牌黃配墨黑字，或墨黑配白字。
const tones = {
  neutral: { background: 'var(--oc-white)', color: 'var(--text-secondary)', boxShadow: 'inset 0 0 0 1.33px var(--oc-gray-300)' },
  brand:   { background: 'var(--oc-yellow)', color: 'var(--oc-ink)' },
  solid:   { background: 'var(--oc-ink)', color: 'var(--oc-white)' },
  success: { background: 'var(--oc-white)', color: 'var(--oc-teal-deep)', boxShadow: 'inset 0 0 0 1.33px var(--oc-teal-deep)' },
  warning: { background: 'var(--oc-white)', color: 'var(--oc-orange)', boxShadow: 'inset 0 0 0 1.33px var(--oc-orange)' },
  info:    { background: 'var(--oc-white)', color: 'var(--oc-purple-deep)', boxShadow: 'inset 0 0 0 1.33px var(--oc-purple-deep)' },
  inverse: { background: 'transparent', color: 'var(--oc-white)', boxShadow: 'inset 0 0 0 1.33px rgba(255,255,255,.45)' },
};

export function Badge({ tone = 'neutral', size = 'md', dot = false, children, style, ...rest }) {
  const t = tones[tone] || tones.neutral;
  const sm = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: sm ? 26 : 32, padding: sm ? '0 12px' : '0 14px',
      fontSize: sm ? 'var(--fs-body-sm)' : 'var(--fs-body)',
      fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)', lineHeight: 1,
      borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap', ...t, ...style,
    }} {...rest}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
      {children}
    </span>
  );
}
