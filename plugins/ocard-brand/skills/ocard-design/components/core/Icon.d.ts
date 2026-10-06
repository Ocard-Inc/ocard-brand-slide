import * as React from 'react';
/**
 * Lucide glyph — the brand icon library (open source, ISC; free for commercial use, no attribution).
 * Design 用 Lucide 字型（`icon-<name>`）；Claude Code／離線單檔用 lucide-static 的 SVG 原檔，名稱相同。
 *
 * Ocard icon spec: 24×24 grid · 2px stroke · round caps and joins · no fill.
 * Lucide's native stroke (24px grid, 2px, round caps/joins) matches this spec — never restyle it.
 *
 * **圖磚是灰底，不是色塊** — `--oc-gray-100` 底（墨底頁 `rgba(255,255,255,.08)`）+ `#5C5C5C` 圖示，48px、8px 圓角，
 * 字形框拉滿整個圖磚讓圖示上下左右置中（不會偏左上）。**不可以出現品牌黃底（`#FFEA00`）或淺黃底（`#FFF8C8`）的 icon 圖磚**；
 * 表格裡的 32px 黃色勾選圓點是唯一例外，它是勾選記號而不是圖磚。
 *
 * 裸圖示（不加圖磚）仍是卡片、列點裡的預設用法 — 20px 行內、24px 預設、引導圖示 32–40px。
 *
 * Load once per page:
 * `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lucide-static@0.544.0/font/lucide.css">`
 */
export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  /** Lucide name, kebab-case — e.g. "user", "credit-card", "chart-column" (see lucide.dev/icons). */
  name: string;
  /** Rendered size in px (ignored when `tile` is set — the glyph is then 46% of the tile). @default 24 */
  size?: number;
  /** Glyph colour. Defaults to `currentColor`, or `--oc-gray-700` inside a tile. */
  color?: string;
  /** Wrap the glyph in an 8px-radius grey tile (neutral fill only — never yellow). @default false */
  tile?: boolean;
  /** Tile edge length in px. @default 48 */
  tileSize?: number;
  /** `light` = 淺灰底（淺底頁）· `inverse` = 白色半透明底（墨底頁）. @default "light" */
  tileTone?: 'light' | 'inverse';
}
export function Icon(props: IconProps): JSX.Element;
