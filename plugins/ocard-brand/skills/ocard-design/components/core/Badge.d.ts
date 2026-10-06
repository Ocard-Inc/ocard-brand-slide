import * as React from 'react';
/**
 * Status / count pill.
 *
 * Accent tones (`success` / `warning` / `info`) render as white fill + 1pt accent
 * ring + **same-colour label** — never filled, never shadowed. Teal and purple use the
 * deep variants so 14px type stays legible (標準青、紫在白底只有 ~2.1:1)。Solid fills exist only for
 * brand yellow (`brand`) and ink (`solid`).
 *
 * **標籤放分類資訊，不放數字編號。** 產業別、狀態、管道、時間序、方案、地區……不限於這幾種，判準是「這個字能不能幫讀者歸類或定位這頁內容」；
 * 純序號（CASE 01、項次）改用淺灰字 `#ADADAD`（Neutral 400，全簡報唯一的淺灰），有順序的列點用 `#333333` 底 + 品牌黃字 `#FFEA00` 的 40×40 圓角方塊。
 * 一頁只用一種輔助色，除非顏色本身就是分類（例如一排產業別標籤）。顏色要從該頁原本就有的資訊長出來，不要為了湊顏色硬補標籤；
 * 只有「連續三顆以上、緊湊排列的小重點資訊」才用橘→青→紫輪替幫助辨識；同一個系列（顧客分類、指標名稱）一律同一個橘。
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** neutral = grey outline · brand = yellow block · solid = ink block · success/warning/info = 1pt accent outline */
  /** Visual tone. Accent tones are white + 1pt accent ring + same-colour label; `inverse` is for ink grounds. @default "neutral" */
  tone?: 'neutral' | 'brand' | 'solid' | 'success' | 'warning' | 'info' | 'inverse';
  /** md = 32px tall / 15px text · sm = 26px / 13px. @default 'md' */
  size?: 'sm' | 'md';
  /** Leading status dot. @default false */
  dot?: boolean;
}
export function Badge(props: BadgeProps): JSX.Element;
