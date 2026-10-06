# Ocard 圖表（共用骨架 + 版型外觀）

最後更新：2026-10-06（261006）

所有版型共用同一支 `ocard-charts.js` 畫圖表，各版型只提供「外觀」（theme）：顏色、長條形狀、字級。
同一份資料換版型不用重做，換的是外觀。

| 檔案 | 用途 |
|---|---|
| `ocard-charts.js` | 圖表骨架。資料 → SVG，品牌規則內建 |
| `preview-src.html` | 圖表總覽原始檔（10 種 × 3 版型）；建置時把 `ocard-charts.js` 塞進 `<!--CHARTS-JS-->` |

## 三種外觀

| 版型 | 名稱 | 長條／點 | 淡底 |
|---|---|---|---|
| 白底標準 | `white` | 圓角長條、圓點 | 輔助色的淡色（橘 #FFE8DC、青 #E7F5F4、紫 #EEE5FF） |
| 墨底標準 | `ink` | 圓角長條、圓點 | 白 16% 透明 |
| 六角幾何拼貼 | `hexgeo` | 長條尖端是六角形、六角點 | 同白底 |

## 品牌規則（程式已內建）

- 一張圖只有一個重點（`highlight`）用輔助色，其餘淡底。
- 多色只在「分類不同」時出現（甜甜圈、堆疊長條）。
- 不用黑色、黃色長條；黃色只留給標題下的短線。
- 輔助色用 `accent` 選：`orange`（預設）、`teal`、`purple`。

## 放進投影片

```html
<div data-chart style="position:absolute;left:64px;top:260px;width:1152px;height:360px">
  <script type="application/json">{"type":"bar","labels":["19-22","60+"],"values":[1157,2510],"highlight":1,"accent":"teal"}</script>
</div>
<script>OcardCharts.render(document, 'white');</script>
```

## 10 種圖表與欄位

共用欄位：`unit`（單位，如 `" 萬"`、`"%"`）、`prefix`、`decimals`、`accent`、`highlight`（重點的索引）、`valueLabels:false`（不顯示數值）。

| type | 用途 | 主要欄位 |
|---|---|---|
| `kpi` | 數字＋漲跌＋小趨勢線 | `value` `delta`（%，負數為下降） `deltaLabel` `label` `trend[]`；`deltaGood:false` 表示下降是好事 |
| `line` | 趨勢（面積、平滑） | `labels[]` `values[]` `smooth` `area:false` `compare:{name,values[]}`（灰色虛線對照） |
| `bar` | 直向長條 | `labels[]` `values[]` `highlight` |
| `hbar` | 橫向長條／排名 | `labels[]` `values[]` `highlight` `labelWidth` |
| `stacked` | 堆疊長條 | `labels[]` `series:[{name,values[]}]` |
| `donut` | 組成比例（≤4 類） | `labels[]` `values[]` `center` `centerLabel` |
| `progress` | 分段進度 | `value` `max`（預設 100） `segments`（預設 20） `caption` `valueLabel` |
| `funnel` | 轉換漏斗 | `labels[]` `values[]` `highlight` |
| `heatmap` | 兩維度交叉 | `rows[]` `cols[]` `values[][]` `valueLabels:true` |
| `timeline` | 進度時間軸 | `items:[{date,title,text,state:'done'|'now'|'next'}]` |

## 尚未完成（下一步）

- 放進白底／墨底／六角的版型（各加圖表頁）與調整面板（重點項目、顯示數值、輔助色）。
- 下載 PPTX 時轉成 PowerPoint／Keynote 原生圖表（可改數字）。
