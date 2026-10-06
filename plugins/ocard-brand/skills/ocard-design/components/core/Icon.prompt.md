Lucide glyph at the Ocard spec: 24×24 grid, 2px stroke, round caps and joins, no fill. Open source (ISC) — free for commercial use, no attribution.

```jsx
<Icon name="user" />
<Icon name="chart-column" tile />                        {/* 48px 淺灰底圖磚，圖示 #5C5C5C、置中 */}
<Icon name="chart-column" tile tileTone="inverse" />     {/* 墨底頁 */}
<Icon name="ticket" size={20} color="var(--oc-orange)" />
```

Load the stylesheet once in `<head>` (Claude Design / any page with network):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lucide-static@0.544.0/font/lucide.css">
```

Plain HTML without React: `<i class="icon-user"></i>`. Offline single-file output (Claude Code, deck-panel): inline the SVG from `lucide-static/icons/<name>.svg` — same names, same stroke.

**One library, one stroke.** Never mix in another icon set, never fill a Lucide glyph, never change its stroke width.

**圖磚只有一種：淺灰底 + 淺灰圖示，圖示置中。** 不可以出現品牌黃底或淺黃底的 icon（表格裡的黃色勾選圓點除外，那是勾選記號）。多數情況不加圖磚，直接用裸圖示。
