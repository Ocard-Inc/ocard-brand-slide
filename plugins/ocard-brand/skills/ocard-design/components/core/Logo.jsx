import React from 'react';

function file({ brand, variant, orientation, onDark }) {
  const tone = onDark ? 'light' : 'dark';
  if (variant === 'mark') return brand + '-mark.svg';
  if (variant === 'logotype') return 'ocard-logotype-' + tone + '.svg';
  return brand + '-' + orientation + '-' + tone + '.svg';
}

export function Logo({ brand = 'ocard', variant = 'lockup', orientation = 'horizontal', onDark = false, height = 32, assetBase = '/assets', style, ...rest }) {
  return (
    <img src={assetBase + '/logos/' + file({ brand, variant, orientation, onDark })}
      alt={brand === 'ofb' ? 'Ocard for Business' : 'Ocard'}
      style={{ height, width: 'auto', display: 'block', ...style }} {...rest} />
  );
}
