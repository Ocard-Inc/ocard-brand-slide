# Ocard Design System

> 最後更新：2026-10-06 · 更新紀錄（含 2026-09 各次修正）見 `CHANGELOG.md`

The design system for **Ocard 奧理科技** — a Taiwanese customer-relationship / loyalty platform. Ocard lets brands with physical stores (restaurants, retail, hospitality, beauty) run membership, points, coupons, surveys and automated marketing without building their own app, most often riding on top of a LINE Official Account.

Two brand faces exist in the supplied material:

| Brand | Audience | Lockup |
| --- | --- | --- |
| **Ocard** | Consumers — the digital membership card, points balance, reward redemption | Hexagon mark + "Ocard" wordmark |
| **Ocard for Business** | Merchants — the CRM console, sales decks, partner and enterprise communication | Same hexagon + "Ocard" over "for Business" |

**Which lockup to use — the single most common mistake.** Files are prefixed by brand: `ocard-*` is consumer-facing (B2C), `ofb-*` is merchant-facing (B2B).

- **No "for Business" wording → consumer.** Membership cards, points and coupons, the consumer app, in-store activation material, anything a member sees.
- **"for Business" wording → merchant.** The merchant console, sales and product decks, partner proposals, recruitment and enterprise documents.
- Never mix the two lockups in one document, never show "for Business" to a consumer, and never present to a merchant using only the consumer mark.

## 使用流程規範（Workflow Guardrails）

**⛔ 強制：建立 Ocard 簡報時，拿到原始文本後先請使用者選資訊密度（Step 1a，附示意），再交出條列式頁面大綱（Step 1b）；大綱確認後才能問 Step 2 的風格問題（2a 先選簡報風格：白底標準／墨底標準／六角幾何拼貼，2b 只問該版型的題目）；不得合併、不得提前、不得自行假設已確認。Claude Design 的表單送出即視為確認；Claude Code 等環境選完要再出一題確認。** 規範全文在 `SKILL.md`，視覺版在 `guidelines/workflow.card.html`（設計系統頁籤 Workflow 分類）。其他產出（單頁、報表、產品介面）不受四步約束，但下面的品牌規範一律適用。

1. **資訊密度與文本梳理**（零簡報程式碼）— 先選密度，再梳理原始文本為條列式的頁面結構，只講使用者看得懂的資訊層級，**不暴露 Card / Grid / component 這類模組名稱**，不輸出任何程式碼。確認後才進下一步。
2. **風格確認與 Design Token 映射** — 固定資產（七色、兩款字、logo、輔助色用量）不隨風格改變；字級表跟著版型走，各版型獨立。先選簡報風格（版型），再只問該版型的題目；圓角固定標準 16px。
3. **生成與微調（Delta Edit 鐵律）** — 單頁或區域變更只改該處；全域 token 變更才更新全份。圖片一律用可拖放佔位框，不用動態圖床、不生成圖像。
4. **交付與字型安全檢查** — 提醒安裝 Noto Sans TC 與 Montserrat，說明降級備援；匯出前確認字型就位。

---

## Sources used

- `uploads/Ocard-Guideline_250910.jpg` and `uploads/Ocard-for-Business-Guideline_250910.jpg` — the one-page brand visual guideline (colours, type, logo, logo mark). Both files are identical in content. Copied to `assets/guideline-ocard.jpg`.
- `uploads/Ocard - {Horizontal,Vertical} on {light,dark}.png` — the original raster lockups. Superseded by the SVGs below and removed.
- **SVG lockups** (both brands) supplied by the user on 2026-09-14 and re-exported the same day with presentation attributes, now in `assets/logos/`. All twelve files are unmodified originals — fills sit on the paths, no `<style>` block, no artboard rectangles.
  - The OFB cube is **not** three flat colours: it is white at `opacity` 1 / .5 / .75 composited over the `#FFEA00` hexagon. Preserve the opacities rather than flattening them.
  - Known nit: `ofb-vertical-light.svg` has a viewBox 1.63px wider than `ofb-vertical-dark.svg` (486.63 vs 485). Invisible in use; flagged for a future artboard cleanup.
- `uploads/Ocard Logos - RGB.ai` — vector master, not readable in this environment.
- `uploads/Montserrat-VariableFont_wght.ttf`, `uploads/NotoSansTC-VariableFont_wght.ttf` — the two brand typefaces, copied to `assets/fonts/`.
- Public product copy from `ocard.co` and `blog.ocard.co` (feature naming, tone-of-voice samples).

**No codebase, Figma file or product screenshots were provided.** Everything below the brand foundations — the component inventory and both UI kits — is a *brand-faithful application* of the guideline, not a recreation of shipping product UI. Attach the product repo or Figma and these can be corrected to match exactly.

---

## CONTENT FUNDAMENTALS

**Language.** Traditional Chinese (繁體中文) is primary; English is the secondary/international register, used for product names (`Ocard CRM`, `Oboss`, `OmniApp`, `OMO`) and for the `.co/en` site. Mixed-script sentences are normal and should be set in one font stack, not two blocks.

**Person.** Merchant-facing copy addresses the reader as **你/你的品牌** — direct, second person, never 貴公司 or other formal registers. Consumer-facing copy speaks about *you the member* in the same casual second person. Ocard refers to itself in third person by name ("Ocard 幫你…"), rarely as 我們.

**Sentence shape.** Outcome first, mechanism second. Headlines are short benefit claims, often ending in a verb phrase:
- 「讓顧客自動回流、主動分享」
- 「LINE 就是品牌會員卡，不必額外下載 APP」
- 「從會員招募到顧客回流一路精準經營」
- English: "Tired of paper membership cards?", "We build a Point-based lifestyle."

**Proof.** Numbers carry the argument — 超過 7,000 家品牌、回流率提升 77%、一年內累積 60,000 名會員. Use real figures with the unit attached; never a bare percentage without its subject.

**Feature naming.** Nouns compounded in Chinese, no Anglicised marketing nouns: 會員分級、電子集點卡、遊戲化行銷、自動化劇本、數據儀表板、電子問卷. Reuse these exact terms rather than inventing synonyms.

**Casing.** English follows sentence case in body and UI, Title Case only for product names. The wordmark is always "Ocard" — never OCARD, never oCard. "for Business" stays lowercase-f in the lockup.

**Punctuation.** Full-width Chinese punctuation （，。、「」） in Chinese runs. A half-width space sits between Latin/numerals and Chinese — **including across `，。、`**, so a numeral or Latin word touching one of those marks takes a space on that side too（「回訪率 +38% 。」「9.8% 點餐份數、 10.6% 營收」）. `NT$` prefixes currency, thousands separated with commas.

**Emoji.** Not used in product UI or in the design system. Marketing channels (LINE broadcasts, the LINE marketplace listing) occasionally use ⭐ as a bullet — treat that as a channel convention, not a brand element. **Do not use emoji in anything you build from this system.**

**Vibe.** Practical, confident, warm-but-businesslike. It is a tool that saves a shop owner work — so the copy sounds like a capable colleague, not a startup pitch. No exclamation stacking, no hype adjectives ("revolutionary", "顛覆"), no jargon the shop owner wouldn't say out loud.

---

## VISUAL FOUNDATIONS

### Colour

The guideline defines exactly seven brand colours and nothing more.

**品牌標準色 (standard):** three colours only — `#FFEA00` brand yellow, `#333333` ink, `#FFFFFF` white.
**輔助色 (accent):** `#FFF8C8` yellow tint; `#FC6815` orange / `#FFE8DC`; `#24C6B7` teal / `#E7F5F4`; `#B287FD` purple / `#EEE5FF`.
**墨底輔助色（僅限墨色版使用）:** `--oc-ink-orange` `#FF7A2E` · `--oc-ink-purple` `#CDAEFF` · `--oc-ink-teal` `#6ED6CA`。標準輔助色是為白底設計的，放在 `#333333` 上明度差不足、顯得暗，淺色 tint 又近乎白色、分不出色相；墨底版的標籤、編號／圖示、列點、側條、圖表強調一律改用這三色（黃 `#FFEA00` 不變）。**白底、灰底不得使用**；墨底版內的淺灰重點卡屬淺色面，裡面的元素仍用標準輔助色與加深版。
**Deep accents for type:** `--oc-teal-deep` `#1AA89B` and `--oc-purple-deep` `#8B5CF6` — **text and 1pt outlines only**. Standard teal and purple sit at ~2.1:1 on white and fail as type; fills, bars, charts and card bars keep the standard values, and on ink grounds type takes the tint instead.
**Outlined pills set label and ring in the same colour** — that match is what gives the pill its tension. Teal and purple use the deep variants as the pair (`#1AA89B` 2.95:1, `#8B5CF6` 4.23:1) so the 14px label stays legible; on ink grounds the pair is the tint.

The yellow tint sits in the accent group, not the standard group — the standard trio is what the brand *is*; the tint is a supporting surface derived from it. **It is not a card face.** In slides and reports the tint is limited to focus rings and inline marks; a highlighted card keeps the neutral face and takes a 10px yellow left block instead (see the pass below).

Each saturated hue is paired with a pale tint — that pairing is the system's core colour mechanic: **saturated for the mark/indicator, tint for the surface behind it.** Never a mid-tone of the same hue.

**Accent colour rules.** The three accents are *signal, not decoration*. Four hard limits:

1. **Area ≤ 10%** of any one page — labels, 1pt outlines and chart highlight bars combined.
2. **One accent per page as the default.** The single exception is **categorisation**: chart series or multi-type labels where the colour carries the distinction. Decoration never justifies a second accent.
3. **Outlines are 1pt.** Status labels are white fill + 1pt accent outline + accent text — never filled, never shadowed.
4. **Never a CTA, never a headline, never a large background fill.**

Accent text is capped at the 11–20px label tier; body copy and numbers are always `#333333`. Charts run pale-first: `#E6E6E6` default fill, `#BFBFBF` for icons and thin rules, one highlighted item in `#333333` — or brand yellow when that single bar *is* the conclusion. An accent-coloured chart uses its pale tint for the series and the saturated value for the one item being discussed; never two accents in one chart.

On ink grounds, secondary text uses translucent white at **`.58` or higher** — `rgba(255,255,255,.58)` is 5.40:1 against `#333333` and is the floor for any text, label or caption. **`rgba(255,255,255,.45)` is 3.90:1 and is not a text colour**; restrict it to non-text decoration (an oversized quote glyph, a divider). On light grounds do not invert the trick at all: translucent ink at those alphas measures 3.5:1 and 2.5:1, so light-ground secondary text uses `--text-secondary` `#5C5C5C` (7.0:1). Hairlines stay translucent either way (`rgba(51,51,51,.16)` / `rgba(255,255,255,.16)`), since a 1px rule is decoration, not information.

Yellow is a *highlight*, not a background. In practice it appears on: the logo hexagon, the single primary button on a view, the active tab underline, a selected chip, the loyalty card itself, and one emphasised data bar. A full-bleed yellow panel is legitimate only as a brand moment (hero band, loyalty card, cover slide) — never as a page background behind body copy.

Ink `#333333` (not pure black) is every piece of body text, the dark surface, and the sidebar. Greys between `#333333` and `#FFFFFF` are derived, not from the guideline — see `tokens/colors.css`.

Where a status needs colour, reach for an accent tint directly rather than a semantic alias — teal for positive, orange for caution, purple for informational, yellow for highlighted. **There is no red in this brand**; anything destructive uses the accent orange. No separate semantic token layer exists: the accent palette is small enough to use by name, and an alias layer on top of six colours was indirection without benefit.

### Typography

Two families, both variable-weight, both supplied:
- **Montserrat** — Latin, numerals, product names (confirmed by the brand owner, 2026-09-14). Geometric, wide, high-contrast-free — it echoes the round `O` of the wordmark. Headlines at 700–800 with `-0.02em` tracking; body at 400–500.
- **Noto Sans TC** — 繁體中文 (confirmed by the brand owner, 2026-09-14). Headings 700, body 400.

In mixed-script settings set one stack (`--font-sans`) with Montserrat first so it takes Latin and Noto Sans TC takes CJK. Chinese body needs more leading than Latin at the same size: `1.75` vs `1.6` (`--lh-body-tc`). Never letterspace Chinese text.

Scale: 56 / 44 / 34 / 26 / 20 / 17 / 15 / 13 / 12 / 11 px. Body default 15px.

### Shape & spacing

4px base step. Radii: 4 (checkbox, tooltip), 8 (buttons, inputs), 12 (toasts, small tiles), 16 (cards, the loyalty card), 24 (large panels), pill (chips, marketing CTAs, switches, badges). The hexagon mark's softened corners set the tone — **nothing in this system is a hard 0px corner.**

Layout: 24px card padding, 16px between cards, 32px page gutters in the console, 18px on mobile. Content containers cap at 1200px.

### Surfaces, borders, shadow

Cards are white, 16px radius, and lifted by a soft neutral shadow (`0 1px 3px rgba(51,51,51,.08)`) — *or* flat with a 1px `#E8E8E8` hairline. Never both heavy shadow and a strong border. Shadows are always tinted with the ink, never pure black, and **there are no coloured shadows at all** — a yellow glow under a button reads as an effect, not as the brand.

**Card faces** — five, and no sixth: `elevated`, `outlined`, `filled`, `inverse` (for dark slides), and `bar`. All sit at 16px radius with an ink-tinted shadow or a hairline, never both.

**Marking one card as the highlight** — three sanctioned treatments, never combined, never more than one highlighted card per slide:

| | Treatment | Best for |
| --- | --- | --- |
| `emphasis="neutral"` | Light ground: white fill + 1px `#D6D6D6` + `--shadow-sm`, with the ordinary cards beside it on `#F2F2F2`. Ink ground (`ground="ink"`): the highlighted card becomes a **light-grey card** (`#F2F2F2`, ink text) among `#3D3D3D` ones | **The default, and the only correct one on a main page** — section summaries, plans, lifecycle, before/after. Those pages already spend their accent on categorisation, so an accent-marked card collides with the category colour |
| `emphasis="accent"` | 10px `orange` / `teal` / `purple` left block, matched to the colour the page's chart or category already uses | Data pages — the 「解讀」 note under a chart, where the bar ties the note to the series it explains |
| `tag="…"` | Transparent pill with a 1pt orange outline at the top of the card; `tagTone="inverse"` switches it to a white outline for ink cards | Pricing and plan comparisons — the tag states *why* it is highlighted |

The left edge in `accent` is a **10px solid block used as a visual anchor**, not the 1px coloured hairline trope — that thin decorative left border remains forbidden. **Brand yellow is no longer a bar tone on any ground.** Three treatments were trialled and dropped: a pale-yellow card fill (competes with the primary button), a full orange outline around the card (loud, breaks the ≤10% accent-area rule), and the bright-yellow left block on ink grounds (the light-grey card face says the same thing without spending yellow).

**Yellow is a block, orange is a line.** Brand yellow `#FFEA00` sits at ~1.2:1 against white, so it cannot carry a thin line — as a 1–2px border or rule it disappears. It works as a *block*: a fill with ink on top (primary button, the loyalty card) or a solid bar 8px or wider (a list bullet block, the active tab underline). Accent orange `#FC6815` is 2.95:1 on white — enough to read as a line at **2px or thicker**, which is why the highlight-card tag border is 2px. Never draw a 1px line in either colour on white; use an ink-family grey.

**Palette discipline.** Only the seven guideline colours, the derived neutral ramp and the three ink-only accents (墨底輔助色，僅限墨色版) appear in this system — no darkened or lightened variants are invented to solve a contrast problem.

That discipline has a price, and it is recorded here rather than hidden: **`#FC6815` as small text on white measures 2.95:1**, below the 4.5:1 body-text threshold — and teal (2.1) and purple (2.7) are lower still. This is why accent text is confined to the 11–20px label tier and why the accent rules above cap it at outlines and labels: at that role and size the brand accepts the deviation in exchange for staying inside the palette. It is not a licence to set paragraphs, links or interface labels in an accent. Everywhere else, text is ink and the accent carries the signal through a 1pt outline or a bar.

Dividers are `#E8E8E8` hairlines. Inner shadows are not used anywhere.

### Imagery

The guideline supplies no photography of its own. Ocard's material is clean product / food / storefront photography — warm, naturally lit, no heavy grading, no grain, no duotone. Images sit flush or in 16px-radius containers. There are no illustrations, patterns, textures or gradients in this brand; a gradient of any kind is off-brand.

**Approved stock sources** (in order of preference):

| Source | Licence | Notes |
| --- | --- | --- |
| [Magnific](https://www.magnific.com/photos) | **Paid — Ocard holds a subscription** | First stop. Best quality and the only source with a commercial licence already cleared. |
| [Unsplash](https://unsplash.com) | Free | Credit the photographer where the layout allows ("Photo by {name} on Unsplash"). |
| [Pexels](https://www.pexels.com/zh-tw/) | Free | Good for Asian retail / F&B scenes, which Unsplash is thin on. |

**Selection rules** — a photo that fails any of these is the wrong photo:
- **Warm and naturally lit.** Daylight or warm interior light. No cold blue casts, no hard studio flash, no heavy filter.
- **Real settings, not stock clichés.** A shop counter, a hand holding a phone, a real queue — never handshakes, never people pointing at a laptop, never a whiteboard of sticky notes.
- **Asian context where people appear.** Ocard's customers are Taiwanese brands; a Western-café stock shot reads as off-brand instantly.
- **Room for type.** If copy sits over the image, pick a frame with a quiet area — do not add a dark gradient scrim to force it.
- **Never place brand yellow over a photo.** Yellow on photography muddies; keep the yellow to the type or a separate block.

**Never generate imagery.** If no suitable photo exists, use the `<image-slot>` placeholder (see `slides/09-image.html`) — a labelled drop target the user fills in. An honest empty slot beats a wrong picture.

### Transparency & blur

Used in exactly two places: the modal scrim (`rgba(26,26,26,.55)` + `blur(12px)`), and low-alpha white panels on the ink sidebar (`rgba(255,255,255,.06)`). Text is never set at reduced opacity — use a lighter grey token instead.

### Motion

Short and unfussy: 120ms for control feedback, 180ms default, 280ms for panels. Easing `cubic-bezier(.2,0,0,1)` — quick out, gentle settle. Fades and small translates (2–4px) only; **no bounce, no spring, no scale-in entrances.** Charts do not animate on load.

### Interaction states

- **Hover** — filled controls darken (`#FFEA00 → #F0DC00`, ink `#333 → #4A4A4A`); ghost/outline controls pick up a `#F2F2F2`/`#FAFAFA` wash; cards marked `interactive` lift 2px and deepen their shadow.
- **Press** — `scale(.97)` plus a further darkening step (`#DCCA00`). No ripple.
- **Focus** — 1px ink border plus a 3px `#FFF8C8` ring. Never a browser-blue outline.
- **Selected** — yellow fill (chips, checkboxes, switch track) or a yellow 2px underline (tabs). Radios are the exception: ink, so a radio list doesn't read as a wall of yellow.
- **Disabled** — 40% opacity, no colour change.

---

## ICONOGRAPHY

[**Lucide**](https://lucide.dev/icons) is the house icon library — open source (ISC), free for commercial use, no attribution. One library everywhere: Claude Design loads it as an icon font (`icon-<name>`); Claude Code and offline single-file decks (`deck-panel`) inline the SVG from `lucide-static/icons/<name>.svg`. Same names, same stroke, so a deck looks identical in both.

**Ocard icon spec**

| | |
| --- | --- |
| Grid | 24 × 24 px |
| Stroke | 2px, constant at every rendered size |
| Corner radius | Lucide's native (~2px on rects) — never redraw |
| Caps / joins | round |
| Fill | none — `currentColor` stroke only |
| Source | Lucide `lucide-static@0.544.0` — its native stroke is this spec |

Do not mix in another icon set, change the stroke width, or fill a glyph; a single consistent stroke is the whole point.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lucide-static@0.544.0/font/lucide.css">
<i class="icon-user"></i>
```

In React: `<Icon name="credit-card" />` — or `<Icon name="star" tile />` / `<Icon name="star" tile tileTone="inverse" />` for the grey tile.

**Icon tiles.** A glyph on a **neutral grey** square: **8px radius** (`--radius-icon-tile`), edge 48px, fill `--oc-gray-100` (`rgba(255,255,255,.08)` on ink), glyph `--oc-gray-700` at ~46% of the tile, optically centred (the glyph's own box fills the tile, so it never sits top-left). **A brand-yellow or pale-yellow tile behind an icon is forbidden**, as is any other saturated fill — the 32px yellow check disc in a comparison table is the one exception, and it is a check mark, not a tile. Most icons take no tile at all: a bare glyph at 20 / 24 / 32–40px is the default.

- Bare glyph sizes: 20px inline, 24px default, 32px for a lead icon.
- Icons inherit `currentColor`; `--oc-gray-700` is the lightest permitted on white.
- **Emoji are never used as icons.** Unicode symbols appear only where a glyph would be overkill: the select chevron (`▼`) and the dismiss affordance (`×`).

> Licence: Lucide is ISC — no attribution required anywhere. (2026-10: replaced Flaticon UIcons, whose icon font could not be inlined into offline Claude Code output.)

The only true brand glyphs are the two **logo marks**, both a yellow hexagon with a different interior: **Ocard** holds a tilted ink membership card (the product's central metaphor); **Ocard for Business** holds a pale cube — building blocks rather than a card. The cube is one white shape at `opacity` 1 (top) / .75 (right) / .5 (left) composited over the `#FFEA00` hexagon; never flatten it to opaque fills, or it breaks the moment the mark sits on a non-yellow ground. Both are vector SVG in `assets/logos/`. Never redraw, recolour, outline or rotate either; never use one as a generic icon inside a UI.

---

## Index

**Root**
- `styles.css` — the single entry point consumers link; `@import`s everything below.
- `thumbnail.html` — homepage tile.
- `SKILL.md` — Agent-Skills wrapper，內含四步驟簡報生成流程規範。
- `readme.md` — this file.

**`tokens/`** — `fonts.css` (@font-face), `colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `motion.css`.

**`assets/logos/`** — vector artwork for both brands:

| | Ocard | Ocard for Business |
| --- | --- | --- |
| Horizontal | `ocard-horizontal-{dark,light}.svg` | `ofb-horizontal-{dark,light}.svg` |
| Vertical | `ocard-vertical-{dark,light}.svg` | `ofb-vertical-{dark,light}.svg` |
| Mark only | `ocard-mark.svg` | `ofb-mark.svg` |
| Wordmark only | `ocard-logotype-{dark,light}.svg` | — |

`dark` = dark artwork for light backgrounds; `light` = reversed artwork for dark backgrounds.

**`assets/`** — `guideline-ocard.jpg`, `fonts/Montserrat-Variable.ttf`, `fonts/NotoSansTC-Variable.ttf`.

**`guidelines/`** — specimen cards across Colors, Type, Spacing, Brand, **Icons** (規格), **Slides** (字級) and **Workflow** (四步驟流程、風格選擇) groups, plus `style-hexgeo.board.html` (六角幾何拼貼風格板) and the picker pages `density-picker`／`template-picker`／`style-picker`／`hexgeo-picker`（`.artifact.html`，由 `style-picker.build.py` 產生）, including 「該用哪一個標誌？」 for the B2C / B2B split.

**Components** — each with `.jsx`, `.d.ts`, `.prompt.md`, and one card HTML per directory.

| Group | Components |
| --- | --- |
| `components/core/` | **Card**, **Badge**, **Icon**, **Logo** |

Product-UI primitives (Button, Input, Select, Checkbox, Radio, Switch, Tabs, Dialog, Toast, Tooltip, IconButton, Tag) were **removed on 2026-09-14**: this system is scoped to presentation production, so a form control in it is a component nobody will use and everybody will mis-trust. Re-add them only if the scope changes back.

*Intentional additions* (no counterpart in the guideline, added because the system is otherwise unusable): **Logo** — wraps the supplied SVG lockups so nobody redraws the mark, and enforces the B2C / B2B choice via `brand="ocard" | "ofb"`; **Icon** — wraps Lucide behind one component so the stroke style can never drift.

### Slide type scale (1280 × 720 canvas)

| Role | Size | Weight | Tracking | Leading |
| --- | --- | --- | --- | --- |
| Cover title | 60px | 800 | −0.025em | 1.1 |
| Slide title | 42px | 800 | −0.02em | 1.18 |
| Big number | 64px | 800 | −0.035em | 1.0 |
| Emphasis number | 32px | 800 | −0.02em | 1.0 |
| Sub-head | 24–26px | 700 | 0 | 1.35 |
| Body | 18–20px | 400 | 0 | 1.75 |
| Eyebrow | 15px | 700 | 0.14em | 1.4 |
| Caption / source | 14px | 400 | 0 | 1.5 |

The Emphasis tier is **numbers only** — a Chinese phrase at that size belongs in Sub-head. Every `font-size` in a deck must land on one of these seven values; no intermediate sizes.

Floor is 14px on the 1280 canvas (≈21px at 1920). Multiply every value by 1.5 for a 1920 × 1080 deck. Chinese leading always runs 0.15 higher than Latin at the same size; never letterspace Chinese body copy.

### Slide cards

Four card faces, and no fifth:

| Face | Fill | Edge | Use |
| --- | --- | --- | --- |
| Ordinary | `#F7F7F7` | none | 一組卡片權重相同時才用 — 三大支柱、圖文列表、資料限制 |
| Highlight · neutral | `--oc-white` | 1px `--oc-gray-300` + `0 3px 12px rgba(51,51,51,.10)` | The one card that matters — the others on that page stop being cards |
| Ink ordinary | `#3D3D3D` | 1px `rgba(255,255,255,.16)` | Cards on an ink slide |
| Ink highlight | `--oc-gray-100` + ink text | none | The one card that matters on an ink slide |

Geometry: 16px radius (12px for the 解讀 note), 32px padding, 24px between cards, and **body copy inside a card sets at 1.6** — the page-level 1.75 reads loose in a narrow column. **A page with one highlighted item does not put the rest in grey cards** — the others become open columns separated by a hairline, so the single card carries the emphasis on its own. An accent 10px left block is added only on data pages, matched to the page's chart colour. **Never a coloured 1px left border, never a yellow bar, never a yellow or tinted card face.**

**`templates/deck-panel/`** — **白底標準／墨底標準：one layout set, two grounds, one source for Claude Code and Claude Design**（2026-10-06 起）. 25 layouts at 1280 × 720 — 白 `#FFFFFF`（`slides-white.html`）、墨 `#333333`（`slides-ink.html`，配色逐頁微調過，所以分開兩份）：封面 · 宣言 · 章節轉場 · 章節目錄 · 陳述 · 客戶見證 · KPI 卡 · 指標橫列 · 數據＋圖表 · 長條圖 · 雙欄對照 · 三大支柱 · 交叉統計 · 會員階梯 · 方案階梯 · 權益對照表 · 門市展示 · 操作解說 · 自動化推播 · 圖文列表 · 深度個案 · 信任牆 · 資料限制 · 結論清單 · 封底 CTA. `python3 build.py white|ink 檔名.html` builds one self-contained HTML with the in-page adjust panel（照六角幾何拼貼的做法）. Pick a ground first, then pick layouts by what each slide has to say — do not run the same frame on every page. The signature device is the **hexagon photo mask** (the logo mark's silhouette as a `clip-path`, allowed to bleed off-canvas). Photos are drop slots — see the imagery caveat below. 封面與章節頁右側主視覺在面板「封面樣式／章節頁樣式」切換：封面＝六角照片（預設）／長方照片／灰色 logo mark；章節＝六角照片（預設）／灰色 logo mark／品牌黃六角形。規則、元件標記與面板項目見該資料夾的 `README.md`；版型總覽見 `slide-deck-design-system/README.md`。

**`templates/deck-white/`、`templates/deck-ink/`** — Claude Design 的預覽入口（`WhiteDeck.dc.html`／`InkDeck.dc.html`），用 iframe 嵌入 `deck-panel` build 好的 `ocard-deck-white.html`／`ocard-deck-ink.html`，不再各自維護版面與面板（2026-10-06）。

**`templates/deck-hexgeo/`** — 第三種簡報風格「六角幾何拼貼」，獨立版型：白色品牌側欄＋logo mark 六角形拼貼，14 種版型、內建調整面板與照片上傳，Claude Design 與 Claude Code 共用；有自己的字級表與配色規則，見該資料夾的 `README.md` 與 `guidelines/style-hexgeo.board.html`。圖示同樣用 Lucide（`lucide_pick.py`）。

**Deck rules**
- Ground colours: 墨 `#333333` / 白 `#FFFFFF`, one per deck（灰底版已於 2026-09-21 刪除）. Yellow is never a field — see the yellow budget below.
- **Brand yellow is a small accent.** Allowed: the 6 × 72 title rule, the marker highlight, one word of a headline, the **brand-yellow numeral** in an ink numbering block, the 32px check disc in a comparison table, **the 10px card highlight bar（重點側條，可選品牌黃）**. Not allowed: a filled CTA, a chart's highlighted bar, a yellow or yellow-tinted card face, **a yellow icon tile**, a yellow list bullet (those are accent orange). A CTA is ink-filled on light grounds and white-filled on ink; a chart's one highlighted bar is the page's dark accent.
- **Colour comes from the page's own information, not from a tag quota.** Prefer colouring what the slide already says — the three KPI names, the three lifecycle stages, the three capabilities — over adding a pill to satisfy a rule. Where a slide genuinely has nothing categorising on it (cover, pull-quote, logo wall), leaving it achromatic beats inventing a meaningless label. **A slide carrying a photograph is exempt** — the image already supplies colour.
- **A tight run of three or more *small notes* alternates two colours.** Six stacked metric captions in one row read as a block when they share a colour; alternate **orange and deep purple** so each is separable — three colours in one row is busier than the problem it solves. This applies only to that case — a genuine series (the three lifecycle stages, the three KPI names) stays in **one** orange, because there the repetition *is* the point.
- **Accent priority is orange → purple → teal.** One accent on a page means orange; a second brings in purple; teal only when a third is genuinely needed.
- **One light grey, used everywhere light grey appears.** `#ADADAD` (Neutral 400; `rgba(255,255,255,.38)` on ink) for the **top-left eyebrow, page numbers, bare ordinals and de-emphasised icons**. `#5C5C5C` is secondary body copy — a mid grey, not this one; never mix the two for the same job. The eyebrow takes an accent colour only when the eyebrow itself *is* a category (industry, channel and the like).
- **No URL-style CTA on the closing slide.** The audience cannot tap it. Email, phone and the **OFB site QR code** (96px, in the footer contact block) — a URL only when the user explicitly asks.
- **Marking the one thing that matters — three devices, pick ONE.** The neutral highlight card (white + grey frame on light, light-grey card on ink); a 10px left block — orange / purple / teal *only* on a page that already carries that accent as a category colour, or brand yellow when the page has no category colour to follow; or a 1pt outlined tag pill. Never two at once, never more than one marked item per group.
- **Main pages take the neutral highlight, pre-applied.** Section summaries, plans, lifecycle stages and before/after pages spend their colour on categorisation, so the highlight must not be a colour — it is the card face that changes. A template ships with that card **already** rendered as the highlight (the adjust panel is for swapping it later, not for the user to assign it in the first place). Accent bars stay on data pages, matched to the accent the page's categorisation already uses.
- **Tags carry categorising information; numbers do not get tags.** A pill states an industry, a status, a channel, a period, a plan, a region — the list is open; the test is whether the word helps the reader place the page. An ordinal (CASE 01, 項次) is set in the light grey `#ADADAD`; an ordered list marker is a 40 × 40 `#333333` block with a **brand-yellow `#FFEA00`** numeral (`#1A1A1A` on ink).
- **Images keep their distance from type.** ≥ 56px between an image edge and a text column, ≥ 32px inside a card, ≥ 20px between an image and its caption.
- **Marker highlight covers the lower half of the text, not the whole line.** `background:linear-gradient(180deg,transparent 0 46%,#FFEA00 46% 94%)` + `box-decoration-break:clone`. A full band is a colour block, not a highlighter. Ink grounds don't use it at all — white text over yellow is unreadable; set the words in brand yellow instead.
- **Charts: pale base + dark accent.** Light-accent tint (`#FFE8DC` / `#E7F5F4`) or light grey for the base, the one point being made in the matching dark accent (`#FC6815` / `#24C6B7`). No black bars — a `#333333` bar is a large block of the darkest value on a light page. No yellow bars.
- **Every page carries at least one colour.** Logo aside, no page is black-and-white only. One accent colour per page by default; several only when the colours mark different categories (e.g. multi-type labels, chart series).
- Icons: geometric Lucide glyphs only — 性別用 `venus` / `mars`, never illustrative heads.
- Minimum type on a 1280×720 slide: 16px (captions), 18–20px body, 24px+ sub-heads. Never smaller.
- One idea per slide. If a slide needs more than five bullets it is two slides.
- No photography ships with this system. Every image position in every template is a drag-and-drop `<image-slot>` — drop a real product shot onto it and it persists. Source photos from Magnific (paid, first choice), Unsplash or Pexels per the Imagery rules above; never generate imagery.
- Page number bottom-right, small `ofb-horizontal` lockup bottom-left. On light slides both sit at `--oc-gray-700`; on ink slides at `--oc-gray-400`. In a half-bleed layout the footer spans only the text column, so the number lands at the inner edge rather than over the image.

*UI kits were removed at the user's request (2026-09-14): this system is scoped to presentation production, not product-screen recreation.*

---
