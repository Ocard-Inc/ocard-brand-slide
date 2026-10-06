import React from 'react';

/** Lucide glyph (icon font, lucide-static). Requires the Lucide stylesheet on the page.
 *  `tile` wraps the glyph in a neutral grey tile — never brand yellow. */
export function Icon({ name, size = 24, color, tile = false, tileSize = 48, tileTone = 'light', ...rest }) {
  const inverse = tileTone === 'inverse';
  const glyphColor = color || (tile ? (inverse ? 'rgba(255,255,255,.58)' : 'var(--oc-gray-700)') : 'currentColor');
  const glyphSize = tile ? Math.round(tileSize * 0.46) : size;
  const glyph = (
    <i className={'icon-' + name} aria-hidden="true"
      style={{ fontSize: glyphSize, lineHeight: 1, color: glyphColor, display: 'flex', alignItems: 'center', justifyContent: 'center', width: tile ? '100%' : glyphSize, height: tile ? '100%' : glyphSize, flex: '0 0 auto', fontStyle: 'normal' }}
      {...(tile ? {} : rest)} />
  );
  if (!tile) return glyph;
  return (
    <span style={{ width: tileSize, height: tileSize, flex: '0 0 auto', borderRadius: 'var(--radius-icon-tile)', background: inverse ? 'rgba(255,255,255,.08)' : 'var(--oc-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }} {...rest}>
      {glyph}
    </span>
  );
}
