# Deck grounds

> 最後更新：2026-10-06

Two **grounds** for Ocard decks — 墨 / 白. They are not two visual languages: palette, typefaces, type scale, card geometry and emphasis rules are identical. The only variables are page colour, card face and how the highlight reads against them.

**Both carry the same 25 layouts.** Pick a ground, then pick layouts by what each slide has to say. Nothing is exclusive to one ground.

| Ground | Page | Card face | Template |
| --- | --- | --- | --- |
| **墨** | `#333333` | `#3D3D3D` + 1px `rgba(255,255,255,.16)` | `templates/deck-panel/slides-ink.html` |
| **白** | `#FFFFFF` | `#FAFAFA` + 1px `#E8E8E8` | `templates/deck-panel/slides-white.html` |

Emphasis is identical on both: the card bar is an accent colour that follows the page's category colour, or brand yellow when there is none to follow. Apart from that bar, yellow's job on a slide is the title rule, the marker highlight and the occasional word of a headline.

Do not mix grounds inside one deck. If a deck needs both an airy opening and a dense data section, keep the ground constant and let the dense pages simply carry more elements.

---

## The 25 layouts

| # | Layout | # | Layout |
| --- | --- | --- | --- |
| 01 | 封面 · 主視覺（六角照片／長方照片／灰色 logo mark） | 14 | 會員階梯 |
| 02 | 宣言 | 15 | 方案階梯 |
| 03 | 章節轉場 · 主視覺（六角照片／灰色 logo mark／品牌黃六角形） | 16 | 權益對照表 |
| 04 | 章節目錄 · 三卡 | 17 | 門市展示 |
| 05 | 陳述 · 螢光筆 | 18 | 操作解說 |
| 06 | 客戶見證 · 引言 | 19 | 自動化推播 |
| 07 | KPI 卡 | 20 | 圖文列表 |
| 08 | 指標橫列 · 六欄 | 21 | 深度個案 |
| 09 | 數據 + 圖表 | 22 | 信任牆 |
| 10 | 長條圖 | 23 | 資料限制 |
| 11 | 雙欄對照 | 24 | 結論清單 |
| 12 | 三大支柱 | 25 | 封底 CTA |
| 13 | 交叉統計雙卡 |  |  |

白底、墨底各有這 25 種，版面相同、配色各自微調。來源：OFB 業務簡報、兩份七頁簡報與數據分析報告格式合併而成（2026-10：原 02「封面 · 半版圖」併入 01 的「封面樣式＝長方照片」，其後頁碼各減 1，共 25 頁）。Claude Code 與 Claude Design 共用 `templates/deck-panel/`（2026-10-06 起）。

Every image position is a drag-and-drop `<image-slot>`. No imagery is supplied or generated; drop in real photography per the Imagery rules in the root `readme.md`.

---

## Shared standards

- **Type scale** — the slide scale in the root `readme.md`: 60 / 42 / 64 / 32 / 26 / 24 / 20 / 18 / 15 / 14. Nothing between those values, nothing below 14px.
- **Icons** — Lucide only (`icon-<name>` font in Design; inline SVG from `lucide-static` in offline output — 24px grid, 2px stroke, round caps, no fill). 20px inline, 24px default. Use the geometric glyph, never an illustrative one: 性別用 `venus` / `mars`, 不用人頭插圖.
- **Cards** — 16px radius (12px for callouts). One elevation cue only: a 1px hairline *or* a soft shadow, never both.
- **Marking the one thing that matters — three devices, pick ONE.** 10px left block (orange / purple / teal, or brand yellow) · 1pt outlined tag pill · the figure itself set in the accent colour. Never stacked, never more than one marked item per group. Card faces stay neutral — never a tint.
- **Marker highlight** — `background:linear-gradient(180deg,transparent 0 46%,#FFEA00 46% 94%)` + `box-decoration-break:clone`: it covers the lower half of the text like a pen, not the whole line box. Ink grounds don't use it — set the words in `#FFEA00` instead.
- **Charts** — pale base, dark accent: `#FFE8DC` / `#E7F5F4` (or light grey) for the base, `#FC6815` / `#24C6B7` for the one point being made; on ink, `rgba(255,255,255,.16)` base with the same accents. No black bars, no yellow bars. The page's card bar takes the same accent as its chart.
- **Brand yellow is a small accent, never a field.** Allowed: the 6 × 72 title rule, the marker, one word of a headline, a 32px check disc, the 10px card highlight bar. Not allowed: a filled CTA, a chart bar, a yellow or yellow-tinted card face.
- **Every page carries at least one colour.** Logo aside, no page is black-and-white only: at minimum the yellow title rule, otherwise one accent element. One accent colour per page by default; several only when the colours mark different categories (e.g. multi-type labels, chart series).
- **Page furniture** — every page carries the `ofb-horizontal` lockup bottom-left and `NN / 25` bottom-right; `#5C5C5C` on light grounds, `#ADADAD` on ink.

---

## Provenance

The layout and spacing models were adapted from `DESIGN.md` files in **VoltAgent/awesome-design-md** (MIT), which documents publicly visible CSS values from well-known websites in the [Google Stitch DESIGN.md format](https://stitch.withgoogle.com/docs/design-md/overview/).

**Kept:** spacing scales and base units, density models, layout rules, container widths, grid behaviour, elevation logic, and the do's/don'ts that describe *structure*.

**Removed:** every brand name, product name, tagline, mascot and marketing string; every borrowed colour palette; every licensed typeface; every signature brand device. As of the 2026-09-17 re-skin, **no visual attribute of any source remains** — colour, type and component chrome are all Ocard's. No visual identity is reproduced and no trademark is claimed. The per-direction `DESIGN.md` records were retired with the 2026-09-18 consolidation; this attribution is the record.
