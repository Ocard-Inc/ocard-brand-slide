# 更新紀錄 · Ocard 簡報設計系統

新的紀錄加在最上面。每筆標日期；只記錄已經做進檔案的變更。

## 2026-10-06 — 白底／墨底合併成單一來源、調整面板比照六角幾何拼貼

- **25 種版型全部收進 Claude Code**：`templates/deck-panel/` 改成白底標準、墨底標準的唯一來源（`slides-white.html`、`slides-ink.html`，內容和 Claude Design 版逐頁比對過，版面一致）。舊的 8 頁示範（`src.html`）移除。
- **調整面板改寫，Claude Code 與 Claude Design 共用**：`build.py` 產出單一 HTML，面板做在簡報裡，操作比照六角幾何拼貼（只顯示畫面中間那一頁、捲動換頁、「調整這一頁」、「正在調整」、只還原這一頁、照片放置）。面板項目依每頁的元件標記自動產生，頁碼與面板頁數不再需要手動維護，`ocardTweakAudit()`、`dc_set_props` 的流程停用。
- **Claude Design 面板沒有作用的問題**：舊做法依賴 Design 編輯模式與 sidecar 存檔，`WhiteDeck.dc.html`／`InkDeck.dc.html` 改成和 `DeckHexgeo.dc.html` 同樣的預覽入口（iframe 嵌入 build 好的檔案）。`ocard-panel.js`、`ds-base.js` 與兩份各自維護的版面移除。
- **標題圖示 3 選 1**：25 版型裡每個編號圖示都依標題意思補了 2 個候選（`data-ic-alt`），面板可逐一更換。
- **編號／圖示、列點的顏色拿掉黃色**：沿用「黃色圖磚、黃色列點是禁用法」的決定（Design 舊面板原本可選），兩個環境統一。
- **所有版型共用的存檔、編輯文字、下載**（`templates/_shared/ocard-kit.js`、`kit_build.py`）：白底、墨底、六角幾何拼貼都接上；下載可選 PDF（不可編輯）、PPTX（可編輯）、Keynote（同一份 PPTX）；「編輯文字」可直接改簡報上的字並隨存檔保存。之後新增的版型一律要接。
- **下載的 PPTX、PDF 一律 1920 × 1080**（所有版型）。
- **面板依投影片位置排序**：只顯示一頁時，選項依它在投影片上的位置由上到下排列，同一個元件的設定放在一起（共用 `OcardKit.orderPanel`）；按「調整這一頁」不會再跳到隔壁頁。
- **GitHub 預覽圖**：`01_模板/預覽/` 每個版型一張總覽圖與封面圖。
- **面板順序**：「重點卡」移到「卡片」組、排在「重點強調方式」下方；「解讀卡側條」排在「重點側條顏色」下方。
- **調整面板不再蓋住簡報**：寬畫面時簡報往左讓位，窄畫面改成從下方展開。
- **照片呈現的「依版型」改名為「各頁原本的樣式」**。
- **調整面板只在 Claude 裡出現，並新增「存檔」**：Claude 頁面（有編輯權的人）按存檔會把設定和照片寫進頁面成為新版本；Claude Design 在 Edit 模式下存到 `.ocard-deck.state.json`；在 Claude 以外打開是成品，沒有面板、照片鎖定。`build.py` 新增 `--state`、`--photos`、`--dc`；範本輸出改到 `deck-white/`、`deck-ink/`，和 Design 預覽入口同一層。
- **加回舊 Code 版的四個功能**：照片呈現（依版型／半版分欄／六角遮罩／卡片內嵌／不放照片）、重點數字逐個上色、列點「圖示」形狀（每個列點 3 個候選）、內文標籤「跟隨產業色」。
- **圖示與字型離線可用**：Lucide 圖示改成 build 時內嵌向量，不再從 CDN 載入圖示字型；字型只嵌入用到的字。
- **文件修正**：版型數統一為 25（白底、墨底各 25；六角幾何拼貼 14）；簡報風格統一為三種（白底標準、墨底標準、六角幾何拼貼）；版型清單第 08 頁名稱改為「指標橫列 · 六欄」；輔助色規則統一寫成「一頁預設一色，只有顏色在區分不同類別時才可多色」；這份更新紀錄從 `readme.md` 拆出來。

---

以下為 2026-09 的紀錄，原本寫在 `readme.md` 末尾，原文保留。

## Conformance pass — 2026-09-17

Every layout in `templates/ofb-deck-17/` and both files in `slides/` were re-set against the type scale, colour rules, icon spec and footer rule above. What changed, and the rule each change answers:

| Was | Now | Rule |
| --- | --- | --- |
| Page number in accent orange, weight 600 | `#5C5C5C` on light / `#ADADAD` on ink, 14px/400 | Page number is not an accent |
| No lockup on any interior slide | 20px `ofb-horizontal` bottom-left on all interior slides | Footer rule |
| 19px, 17px, 16px, 13px, 12px, 11px type | 42 / 32 / 26 / 24 / 20 / 18 / 15 / 14 only | Slide type scale — no intermediate sizes |
| Weight 600 | 700 | Scale carries 800 / 700 / 400 only |
| Body leading 1.6 / 1.8 | 1.75 | CJK leading |
| Card padding 22–30px | 32px, 24px between cards | Slide card geometry |
| 09 highlight = 8px yellow top bar | 10px yellow left block (`bar`) | Only two sanctioned highlight treatments |
| 06 yellow-tint card, no edge | Neutral card face + 10px yellow left block | Highlight card face |
| 03 body copy set in yellow | `rgba(255,255,255,.58)`, yellow moved to a 6px rule | Yellow is a highlight, not body text |
| 4px yellow bullet bars | 8px blocks, 4px radius | Yellow is a block, never a thin line |
| 11 — thirteen yellow check discs | Ink glyphs; yellow disc kept only on the 企業 column | Pale-first, yellow marks the conclusion |
| White cards with a bare shadow | Neutral face (`#FAFAFA` + 1px hairline) or elevated + hairline | Four slide card faces, no fifth |
| 3px / 6px radii | 4px / 8px | Radius scale |
| 13px / 14px / 19px glyphs | 20px inline, 24px default | Icon sizes |

Open nits, deliberately left: slide 17's second headline line is a full clause in yellow rather than one word — kept as a closing brand moment.

### Second pass — same day

**Badge rewritten to match the accent rule.** It was filling accent tints (`--oc-teal-tint` ground with an invented `#12796F` text colour, and the same for orange and purple) — both a filled status label and three hex values outside the palette. It now renders white fill + 1pt accent outline + accent text, which is what the accent rules asked for all along. Solid fills survive only for `brand` (yellow + ink) and `solid` (ink + white). Sizes went to 32px / 15px and 26px / 13px so a badge is legible on a 1280 slide.

**Cards removed** (asked for, 2026-09-17): 圖磚 Icon tiles, 簡報卡片樣式 Slide cards, 數據呈現 Metric・Callout・權益清單, and the two `slides/` reference files — the `slides/` folder is gone. 膠囊標籤 Pills was folded into the components card, deduped against Badge one-for-one, so the pill set and the component are now the same six tones rather than two overlapping inventories. The specs those cards illustrated (icon tiles, the four slide card faces, the type scale) remain written down here — only the duplicate specimen cards went.

**The three non-Ocard decks** were brought onto the shared structural standards without touching their palettes or typefaces: a footer on every page (four pages had none), the dead grey 「Image · 520 × 720」 blocks replaced with real `<image-slot>` drop targets, 12px labels raised to the 14px floor, metric and comparison panels given real card treatment with one elevation cue, a pale-first trend chart with exactly one highlighted bar (Telemetry had two), and icon rows at 24px. Information hierarchy was thickened where the pages were thin: section pages gained a three-item contents list, statement pages an attribution, data pages a headline and target figures, comparison pages a source line.

**The three deck directions were re-skinned into the brand.** They previously carried three foreign visual identities — near-black `#0A0A0B` with Geist, blurred pastel colour fields with Manrope, warm `#EEEFE9` with amber `#EE9B2E` and IBM Plex. All of it is gone: they now use the Ocard palette, Montserrat + Noto Sans TC, the slide type scale, the Ocard card faces and the standard lockup footer. **The Luminous gradient problem resolved itself** — the blurred colour fields were the direction's whole identity and they are the one thing this brand forbids outright, so they were removed rather than variant-ed. What differentiates the three now is ground colour and density: ink / white-with-96px-gutters / `#FAFAFA`-with-dense-card-grids. That is a more useful axis anyway — the question a deck actually poses is how much has to fit on a page, not which visual language to borrow.

### Consolidation pass — 2026-09-18

**Luminous was removed.** It and Telemetry were carrying the same layout logic at two strengths — white ground, filled card faces, one point per page versus a denser grid of the same parts — which is a density setting, not a direction. Telemetry covers both: an airy page is a Telemetry page with fewer elements on it. `templates/deck-luminous/` and `slide-deck-design-system/luminous/` are gone; two directions remain, Monochrome (ink, sparse) and Telemetry (`#FAFAFA`, dense).

**The yellow-tint card face is retired system-wide.** Every `#FFF8C8` + 2px `#DCCA00` card in `templates/ofb-deck-17/`, `templates/deck-telemetry/` and `templates/ocard-report/` now uses the single sanctioned treatment: the **neutral card face it sits beside** (`#FAFAFA` or `#FFFFFF`, 1px `#E8E8E8` hairline) plus a **10px yellow left block**, with left padding raised to clear it. Two reasons. A tinted face is a second surface colour, so a highlighted card stopped reading as *the same card, marked* and started reading as *a different kind of card*; and it left the system with two competing highlight devices where the rule already said there should be one gesture. The left block also survives the ink ground, which the tint never could.

Checked page by page: OfbDeck17 (17 layouts), TelemetryDeck (7), OcardReport (7), MonochromeDeck (7 — no cards, hairlines and the 6px yellow top rule only). No light-yellow card faces remain in any template. The `--oc-yellow-tint` token stays in `tokens/colors.css` for focus rings and inline marks.

### Three-ground consolidation — 2026-09-18 (second pass)

**One layout set, three grounds.** The four deck templates collapsed into three: `deck-ink` / `deck-white` / `deck-grey`, each carrying **all 26 layouts**. Nothing was dropped — the OFB 17-layout sales set, the seven-page spine and the data-report layouts were merged into a single index and rebuilt on every ground. Ground colour is now the only variable a user picks; layout choice is a per-slide decision, not a per-deck one.

**The card bar got a second tone.** `Card` gained `barTone`: `brand` (yellow) and `accent` (orange). Ink decks use yellow; white and grey decks use orange. On a light ground yellow is already carrying the title rule and the marker, so a yellow bar was the third yellow on the page and marked nothing.

**Brand yellow pulled back to a point accent.** Filled yellow CTAs became ink-filled (white-filled on ink grounds); every chart's highlighted bar went from yellow to ink / white. Yellow now appears only as the title rule, the ink-ground card bar, the marker, one word of a headline, a 32px check disc and a 44px icon tile.

**The marker highlight was covering half the glyph.** `padding:0 8px` gave the band the height of Montserrat's em box, and CJK glyphs — set from Noto Sans TC, which sits lower — dropped out of the bottom of it. Now `padding:.12em .3em .24em` with the paragraph at `line-height:1.5`. Documented in the new 簡報強調手法 card.

**Illustrative icons replaced.** `fi-rr-woman-head` / `fi-rr-man-head` on the gender pages were detailed pictograms, not 2px-stroke UI glyphs; they are now `fi-rr-venus` / `fi-rr-mars`, unfilled and at the muted ink weight rather than sitting in a yellow tile.

**No page is monochrome.** Every layout on every ground now carries at least one colour beyond the logo — at minimum the yellow title rule. 門市展示, 信任牆, 深度個案 and 圖文列表 gained one where they had none.

### Emphasis pass — 2026-09-18 (third pass)

**Three emphasis devices, pick one.** 10px accent bar · 1pt outlined tag pill · the figure set in the accent colour. Stacking them (a bar *and* a pill on the same card, as slide 10 had) marks nothing. `Card`'s `barTone` became `orange | teal | purple` — the brand-yellow bar is gone from every ground, so yellow's whole job on a slide is now the title rule, the marker and the odd word of a headline.

**The marker is a highlighter again.** The previous fix over-corrected into a full-height yellow block. It now covers the lower 46–94% of the text — a pen stroke. Ink grounds drop the band entirely and set the words in brand yellow.

**Charts stopped using black.** A `#333333` highlighted bar is a large mass of the darkest value on a light page. Bases are now the light accent tints (`#FFE8DC`, `#E7F5F4`), highlights the matching dark accent (`#FC6815`, `#24C6B7`), and the page's card bar takes the same accent so the chart and the callout read as one statement.

**Cover hexagons went big.** The mask path is scaled 1.7× (850 × 952 on cover, 882 × 952 on the section divider) and pushed off two edges, so roughly half the shape is cropped and it reads as a graphic device rather than a photo in a badge.

**雙欄對照 was two-thirds card.** The grid no longer stretches to fill; a lead line was added and every row now carries a 24px icon, so the page has a top, a middle and air at the bottom.

### Typography & emphasis pass — 2026-09-18 (fourth pass)

**全形／半形之間補空格.** Every text node in all three decks was re-spaced: a half-width space now sits between CJK characters and adjacent Latin letters or digits (「第 3 頁」, 「1.65 億」, 「8,410 萬」). CJK punctuation takes no space.

**Title rules unified.** Every interior page now carries the 6 × 72 yellow rule under its `<h2>`; previously only six pages had one, which read as an accident. Following margins were pulled in by 24px so nothing grew taller.

**A numbered-list marker.** Ordered lists (章節目錄, 三大支柱, 資料限制) dropped the orange numeral for a 40 × 40 ink rounded square with a yellow numeral — `#333333` on light grounds, `#1A1A1A` on ink so it separates from the `#3D3D3D` card. Numbering is not one of the three emphasis devices and does not spend the page's accent.

**Dark grounds go back to a yellow bar.** On ink, accent bars and accent numerals are too quiet; the ink deck's highlighted cards use the bright-yellow bar, and its KPI card uses a top-right outlined tag instead of an orange figure. Light grounds keep the accent bar.

**Small labels in orange, figures one step up.** Caption-level labels next to a figure (宣言's 會員回訪率 etc.) are now 700-weight orange. Where a page carries four or fewer non-numeric figures, those figures moved one step up the scale (32 → 42px).

**Fixes:** 12 頁's highlighted card now uses the same icon colour as its neighbour; 09 頁 dropped its yellow cell rule and tightened the six cells from 26/28 to 18/22 padding; 06 and 07 were near-duplicates and now differ — 06 is a bare statement with a source line, 07 is a testimonial with the quote wrapped in 「」 rather than a floating opening mark.

### Emphasis, tags and icons — 2026-09-18 (fifth pass)

**The highlight card stopped borrowing the category colour.** On a main page — section summary, plan ladder, lifecycle, before/after — the accent is already doing categorisation work, so an accent-barred card marked nothing and read as “another category.” The highlight is now a **change of card face**: light grounds put the marked card on white with a 1px `#D6D6D6` frame and a soft shadow while every ordinary card drops to `#F2F2F2` with no hairline; ink grounds turn the marked card into a **light-grey card** (`#F2F2F2`, ink text) among `#3D3D3D` ones. The 10px accent bar survives only where the colour genuinely ties two things together — the 解讀 note under a chart, in the chart's own colour.

**The bright-yellow card bar is gone from every ground**, ink included. Brand yellow on a slide is now: the 6 × 72 title rule, the marker highlight, one word of a headline, the pale-yellow numeral in a numbering block, and the 8px list bullet block. Nothing else.

**Icon tiles are outline-only.** Transparent fill, 1px `#D6D6D6` edge (`rgba(255,255,255,.28)` on ink), `#5C5C5C` glyph. Filled tiles — brand yellow above all — are forbidden outright; the yellow check disc in the 權益對照表 became an outlined disc for the same reason. `Icon`'s `tile` prop changed from “pass a fill colour” to a boolean + `tileTone`.

**Tags carry information; numbers do not get tags.** Pills now state an industry (餐飲 · 零售 · 美業) on 門市展示 and 深度個案 — the one case where several accents on one page is legitimate, because the colour *is* the category. Ordinals lost their accent colour: CASE 01 is now `#8A8A8A`, and the ordered-list marker is a 40 × 40 `#333333` block with a **pale-yellow `#FFF8C8`** numeral (`#1A1A1A` on ink).

**中文標點前後也要除空格.** The mixed-script spacing rule now applies across `，。、` as well — a numeral or Latin word touching one of those marks takes a half-width space on that side（「回訪率 +38% 。」）. Re-spaced across all three decks.

**09 頁 was too loose** — six metrics in a 3 × 2 thin-ruled grid with a full-width rule under each row. It is now one row of six columns, each an outlined icon tile → figure → label → one-line caption, with a lead line above. The numbers-as-decoration idea from the reference was dropped in favour of icons, per the brief.

**Image safe distance.** The cover hexagon was 6px from the headline; it now clears it by 86px. Text columns facing an image went to 56px of inner padding, and image captions to 20px.

**結尾頁 logo.** The vertical lockup on 25 / 26 is 1.6× larger (224 / 240px) and centred in the empty right-hand band rather than pinned to the page edge.

**重點卡片 tweak.** All three decks now carry a logic class and two props: 重點卡片強調方式（中性白底灰框／輔助色側條／不強調）and which accent the bar uses — editable from the Tweaks panel without touching markup. Cards opt in with `data-emph="card"`; chart notes with `data-emph="note"`.

### Review fixes — 2026-09-18 (sixth pass)

**一頁只有一種卡片邏輯.** 淺灰底卡片讓了一階到 `#F7F7F7`，而且只用在每張卡權重相同的頁面（三大支柱、13、圖文列表 21、資料限制 24）。有重點的頁面（KPI 08、數據 10）把其他項目的卡面拿掉，改成細線分隔的開放欄位，只有重點那一張是卡片：白底 + 1px `#D6D6D6` + `0 3px 12px rgba(51,51,51,.10)` 浮起。KPI 頁的橘色數字改回墨色，改用卡面標重點。

**圖磚改回灰底，而且不強制使用.** 上一輪把卡片裡的裸圖示全改成外框圖磚，那是過度套用；現在裸圖示回到預設，圖磚只是多一種可用樣式（淺灰底、圖示置中）。`Icon` 的字形框拉滿整個圖磚，修掉圖示偏左上的問題。權益對照表的黃色勾選圓點還原。

**版面修正：** 02 頁左邊界跟其他頁一樣改成 64px；03 頁頁碼回到右邊界；09 頁圖示去框放大到 40px 並降到淺灰，附註改成中性標籤；20 頁三個列點方塊改輔助橘；結尾頁 logo 再往左，真正置中於右側留白。

### Colour floor, one grey, and the closing slide — 2026-09-21 (seventh pass)

**一頁至少一個顏色 — 但不硬補.** The first attempt bolted an orange pill onto sixteen layouts; most of them said nothing (「2026 年度提案」「聯絡我們」). Reversed: colour now comes from information the slide already carries — the three KPI names on 08, the three lifecycle stages on 15, the three capabilities on 21 — and slides with nothing categorising on them (covers, pull-quote, logo wall) stay achromatic.

**連續標籤三色輪替.** Slide 09's six metric notes sat in one row in a single orange and merged into a band; they now cycle orange → teal → purple, where colour separates rather than categorises.

**淺灰再淺一階** to `#ADADAD` (Neutral 400), `rgba(255,255,255,.38)` on ink.

**封底 QR** is now the real OFB site code (`assets/qr/ofb-site.png`), white-padded on the ink deck.

**灰底版型刪除** — too close to the white deck to justify a third variant. Two decks remain: 白底 and 墨底.

**編號改回深黃.** The numbering block is `#333333` with a `#FFEA00` numeral again; the pale `#FFF8C8` trialled last pass was too weak to read as a deliberate mark.

**標籤的範圍放寬.** Pills are not just industry — status, channel, period, plan, region, whatever helps the reader place the page. The rule that stays: **numbers never become tags.**

**重點卡片預先標好.** Templates ship with the summary / product-pitch card already rendered as the highlight; the Tweaks control exists to swap it afterwards, not to make the user assign it. An accent bar, when used, takes the accent that page's categorisation already uses.

**封底拿掉網址型 CTA，改放 QR code.** The audience cannot tap a URL. The closing slide now has email, phone and a 96px **OFB site QR** slot in the footer contact block.

### Per-page highlight, metric tiles, tweak scope — 2026-09-23 (eighth pass)

**重點卡片規範放寬.** Every card page (05 08 10 13 15 16 19 24) can now carry a highlight card. Equal-weight pages still ship with none — the default is 「無」 — but the author can mark one when the talk track needs it. 15 (常客與 VIP) and 16 (成長) keep their shipped highlights. Card groups carry `data-emphgroup="NN"`; the highlight is applied by the logic class, so the markup of every card in a group is the plain face.

**Tweaks: 重點卡片 · 逐頁.** One dropdown per card page — 無 / 第 1 張 / 第 2 張 … The global 強調方式 (中性白底灰框／輔助色側條／不強調) still decides *how* the chosen card is marked; 不強調 overrides every page.

**09 指標橫列 gained 「圖磚 + 圖示」** under 指標編號樣式: the ordinal numeral is swapped for a 44px tinted tile holding the metric's icon, same colour pairing as the numeral tiles.

**編號統一成一套.** 09 頁指標編號與 05 / 13 / 24 頁有序清單原本是兩套（36px 橘紫交錯淡色方塊 vs 40px 墨色方塊黃字），現在全部是 **40 × 40 墨色方塊（墨底 `#1A1A1A`）+ `#FFEA00` 數字**，編號不消耗輔助色。Tweaks「編號」一組控制全部：墨色實心（預設）／淡色圖磚／1pt 外框／純數字／數字外框線（無方框、數字本身描邊）／圖磚 + 圖示（僅 09，其他頁退回淡色圖磚）。顏色 橘／青／紫／中性灰，只在非實心樣式生效；「橘紫交錯」移除。

**Tweaks 重整 — 2026-09-23.** Panel keys are now Chinese and every section title carries the pages it touches (「卡片 · 05 08 10 …」), replacing the 說明 line; per-page highlight dropdowns sit inside 卡片 next to 卡片樣式. 編號: 「圖磚 + 圖示」 works on every numbered tile (05 / 13 / 24 carry icons matched to each item), 1pt 外框 shrinks to 32px, 中性灰 lines/numerals go to `#ADADAD` (tinted tile keeps `#5C5C5C`), 數字外框線 uses `paint-order: stroke fill` with the fill set to the ground colour so Montserrat's overlapping contours no longer show at the joins. 圖示: icons on filled cards (08) were being skipped — the “already in a tile” check now only fires for parents ≤ 64px; 14's venus / mars left the shared colour and have their own 「14 性別圖示配色」. 小標籤: 「小標也套標籤樣式」 turns uppercase eyebrows (`data-tagable`, outside cards) and/or card mini-labels (inside cards) into pills using the current 標籤樣式 — CASE ordinals excluded.

**Tweak scope note.** The panel is document-wide and cannot hide per page, so a 說明 · 作用頁數 line at the bottom lists which pages each control touches.

**Fix:** the ink deck's 16 highlight title was `#FFE8DC` on `#F2F2F2` — invisible. It now inherits ink.
