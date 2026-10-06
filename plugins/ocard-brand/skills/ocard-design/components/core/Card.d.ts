import * as React from 'react';
/**
 * Slide / content surface. 16px radius, hairline or soft neutral shadow — never a coloured left hairline.
 *
 * Four faces: `elevated` · `outlined` · `filled` (淺灰底 — the default face for ordinary cards on a slide)
 * · `inverse` (墨底頁的一般卡片).
 *
 * **Marking the one card that matters — two families, and the page decides which.**
 *
 * 1. `emphasis="neutral"` — 中性強調. 淺底頁：白底 + 1px `#D6D6D6` 外框 + 微陰影，旁邊的一般卡是淺灰底。
 *    墨底頁（`ground="ink"`）：淺灰底卡片 + 墨色字。**主要頁面一律用這個** —— 章節總結、方案、生命週期、
 *    對照頁：這些頁面的輔助色已經在替分類說話，重點卡再用輔助色就跟分類混在一起。
 * 2. `emphasis="accent"` — 10px 側條（`accent="orange" | "teal" | "purple" | "yellow"`）。輔助色只用在該頁真的有分類色時，
 *    顏色必須跟著該頁圖表／分類的顏色走（藍綠圖表配藍綠側條）——典型場合是圖表下方的「解讀」註解卡。
 *    該頁沒有分類色可跟時，可用 `accent="yellow"`（品牌黃側條）。
 * 3. `tag="…"` — 1pt 橘外框標籤（文字與外框同色），適合方案比較這種要說明「為什麼是它」的場合。
 *
 * 三者擇一、不疊加，一組卡片只標一張。品牌黃可作 10px 側條；除此之外，黃色在簡報上只用於標題裝飾線、
 * 螢光筆、標題裡的一個詞、編號方塊裡的字。
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Base face. @default "elevated" */
  variant?: 'elevated' | 'outlined' | 'filled' | 'inverse' | 'bar';
  /** How this card is marked as the highlight. `neutral` = 白底灰框／墨底淺灰卡；`accent` = 10px 輔助色側條. @default "none" */
  emphasis?: 'none' | 'neutral' | 'accent';
  /** Accent for `emphasis="accent"` — match the page's categorisation colour. @default "orange" */
  accent?: 'orange' | 'teal' | 'purple' | 'yellow';
  /** Ground the card sits on, so `neutral` knows which way to flip. @default "light" */
  ground?: 'light' | 'ink';
  /** @deprecated 舊名，等同 `accent`。`brand` 等同 `yellow`。 */
  barTone?: 'orange' | 'teal' | 'purple' | 'yellow' | 'brand';
  /** CSS padding value. @default "var(--space-6)" */
  padding?: string;
  /** Lift + deepen shadow on hover. @default false */
  interactive?: boolean;
  /** Short label (2–4 characters) rendered as a 1pt-outlined pill at the top of the card. */
  tag?: React.ReactNode;
  /** Pill colour. `accent` = orange ring and orange label on light cards; `inverse` = white ring and label on an ink card. @default "accent" */
  tagTone?: 'accent' | 'inverse';
  /** Which end of the card the pill sits at. @default "start" */
  tagAlign?: 'start' | 'end';
}
export function Card(props: CardProps): JSX.Element;
