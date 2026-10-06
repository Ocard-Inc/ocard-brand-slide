import * as React from 'react';
/**
 * The official Ocard / Ocard for Business artwork (vector SVG in /assets/logos). Never redraw the mark.
 */
export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Which brand face. @default "ocard" */
  brand?: 'ocard' | 'ofb';
  /** Full lockup, the hexagon mark alone, or the wordmark alone (Ocard only). @default "lockup" */
  variant?: 'lockup' | 'mark' | 'logotype';
  /** @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  /** Use the reversed artwork (white type) for dark backgrounds. @default false */
  onDark?: boolean;
  /** Rendered height in px. @default 32 */
  height?: number;
  /** Path prefix to the assets folder. @default "/assets" */
  assetBase?: string;
}
export function Logo(props: LogoProps): JSX.Element;
