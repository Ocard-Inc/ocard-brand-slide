# deck-panel：白底標準／墨底標準（內建調整面板）

> 最後更新：2026-10-08

白底標準、墨底標準兩種風格的**唯一來源**。Claude Code 和 Claude Design 用的是同一份：產出單一 HTML，調整面板做在簡報裡，任何人打開就能用，選項全部限制在品牌規範內。做法比照六角幾何拼貼（`../deck-hexgeo/`）。

- **2026-10-06 起**：25 種版型全部收進這裡（之前 Claude Code 只有 8 種示範頁）。Claude Design 的 `../deck-white/WhiteDeck.dc.html`、`../deck-ink/InkDeck.dc.html` 改成預覽入口，只是用 iframe 嵌入這裡 build 好的檔案，不再各自維護一份版面和面板。

## 檔案

| 檔案 | 用途 |
| --- | --- |
| `slides-white.html` | 白底標準的 25 頁版面（內容是版型示範） |
| `slides-ink.html` | 墨底標準的 25 頁版面。墨底有逐頁微調過的配色，所以和白底分開兩份，不用程式自動換色 |
| `build.py` | 把版面組成單一 HTML：嵌入 logo、QR、用到的 Lucide 圖示、照片框程式，只取出用到的字嵌入字型 |
| `shell.html` | 檢視器外框：工具列、捲動列表、播放模式、調整面板的版面 |
| `engine.js` | 調整面板與品牌規則：依每頁的元件標記產生面板項目，並套用到版面 |
| `../_shared/ocard-kit.js`、`../_shared/kit_build.py` | 所有版型共用的存檔、編輯文字、下載，以及 build.py 寫入存檔內容的工具 |
| `image-slot.js` | 可拖放的照片框（Ocard 修改版，保留原始畫質）。不得以一般版本覆蓋 |
| `panel-thumbs.json` | 面板上封面、章節頁、卡片三個選項的示意圖 |
| `../deck-white/ocard-deck-white.html`、`../deck-ink/ocard-deck-ink.html` | build 好的範本，和 Claude Design 的預覽入口放在同一個資料夾（Design 的存檔檔會寫在同一層） |

## 產生一份新簡報

1. 依 Step 2 選的風格，複製 `slides-white.html` 或 `slides-ink.html`（例：`member-deck.html`）。
2. 第一行 `<title>` 改成簡報標題，它也是工具列上的標題。
3. 把內容換成 Step 1 確認過的大綱：需要的版型照抄、用不到的整頁刪掉、可以調整順序。**頁碼、面板頁數會依實際順序自動產生，不用手改。**
4. 執行 `python3 build.py white member-deck.html`（墨底用 `ink`），產出 `member-deck.out.html`；也可以加 `-o 檔名.html` 指定輸出位置。
5. 交付產出的單一 HTML。**之後每次改文字都要重新執行 `build.py`**，新加的字才會嵌進字型。

`python3 build.py white`／`python3 build.py ink`（不給檔名）會重新產生 `../deck-white/ocard-deck-white.html`／`../deck-ink/ocard-deck-ink.html`；改了版型、面板或規則之後都要重跑，Claude Design 的預覽入口才會更新。

需要 Python 的 `fontTools` 與 `brotli`（`pip install fonttools brotli`）。缺少時會改用 Google Fonts（需要網路），並在執行時印出提示。

## 編輯中與成品：調整面板只在 Claude 裡出現（2026-10-06）

| 打開的地方 | 調整面板 | 存檔 |
| --- | --- | --- |
| Claude 頁面（Claude Code 產出後發布的連結），有編輯權的人 | 有 | 按「存檔」：設定和照片寫進頁面本身，成為新版本；換電腦、換瀏覽器、對話被清掉都還在 |
| Claude 頁面，只有檢視權的人 | 沒有 | — |
| Claude Design（預覽入口 `.dc.html`） | 有；要先進入 Edit 模式 | 按「存檔」：寫進同資料夾的 `.ocard-deck.state.json`；照片由照片框自動存成 `.image-slots.state.json` 與每張照片一個檔 |
| 其他地方（下載的 HTML、直接用瀏覽器開） | 沒有，照片框鎖定 | 顯示最後一次存檔的樣子 |

- 發布成 Claude 頁面時要宣告 `capabilities: {artifact: {}, user: {}, downloads: true}`，存檔與下載才會作用。
- 存檔、編輯文字、下載（PDF／PPTX／Keynote）都來自所有版型共用的 `../_shared/ocard-kit.js`，說明見 `SKILL.md`「所有版型共用」。
- 還沒存檔的調整會暫存在瀏覽器，重新整理不會不見，工具列顯示「有未存檔的調整」。
- 本機檢查時，在網址後面加 `#edit` 可以打開面板（按「存檔」只會複製設定）。

**交付成品**：把存檔的內容寫進最終 HTML，再交給使用者——
- 從 Claude 頁面：讀取頁面（Artifact `read`）存成 html，`python3 build.py white 檔名.html --state 存下來的頁面.html`。
- 從 Claude Design：`python3 build.py white 檔名.html --state .ocard-deck.state.json --photos .image-slots.state.json`。
- 使用者貼回來的設定（`{"v":…}`）：存成 json 後用 `--state`。
- 加 `--dc` 會同時產生 `檔名.dc.html`（Claude Design 預覽入口，要和 `support.js` 放在同一個資料夾）。

## 版面怎麼寫

- 每頁是一個 `<section data-id="…" data-label="…">`，尺寸 1280 × 720，樣式寫在 inline style 裡。
  - `data-id` 是這一頁的固定代號（`cover`、`kpi`…），調整面板的設定用它記住。**同一份簡報裡不可重複**；複製同一個版型做第二頁時，改成 `kpi-2` 這類新代號。
  - `data-label` 是頁名，顯示在檢視器和面板上，不要加頁碼。
- logo、QR 寫 `../../assets/logos/…`、`../../assets/qr/…`，`build.py` 會換成內嵌圖檔。
- 圖示一律用 Lucide：寫 `<i class="icon-名稱"></i>`（名稱見 lucide.dev/icons），`build.py` 會換成向量圖示，不需要網路。名稱打錯時 `build.py` 會停下來告訴你是哪一個。
- 照片一律用 `<image-slot id="…" placeholder="說明｜拍攝建議">`。`id` 在同一份簡報裡不可重複；`placeholder` 的「｜」前面會當作面板上的照片名稱。

## 元件標記（面板依這些標記產生項目，刪掉就不能調）

| 標記 | 放在哪裡 | 面板項目 | 範圍 |
| --- | --- | --- | --- |
| `data-coverstyle="photo／rect／mark"` | 封面三款各自的容器 | 封面樣式 | 整份 |
| `data-secstyle="photo／mark／yellow"` | 章節頁三款各自的容器 | 章節頁樣式 | 整份 |
| `data-card="plain"` | 每張卡片 | 卡片外觀 | 整份 |
| `data-emphgroup="N"` | 一組卡片的容器；`N` 是預設的重點卡（0＝無） | 重點卡（逐頁）；重點強調方式、側條顏色（整份） | 逐頁／整份 |
| `data-emph="note" data-def="青"` | 圖表頁的解讀卡；`data-def` 是預設側條顏色（橘／青／紫／黃／跟隨全局／無側條） | 解讀卡側條 | 逐頁 |
| `data-metricno="list"`＋內含 `<span data-mn>01</span><i data-mi class="icon-…" data-ic-alt="名稱2,名稱3">` | 編號方塊 | 編號／圖示的形式、樣式（逐頁可覆寫）、顏色；標題圖示 3 選 1 | 逐頁／整份 |
| `data-icon="on"` | 獨立的圖示方塊 | 編號／圖示的樣式、顏色 | 整份 |
| `data-icon="gf"`、`data-icon="gm"` | 女性、男性圖示 | 性別圖示顏色 | 逐頁 |
| `data-bullet` ＋ 內含 `data-b="check／dot／num"` | 列點 | 列點形狀、顏色 | 整份 |
| `data-tagable` | 每頁左上的頁面標籤 | 頁面標籤樣式、顏色 | 整份 |
| `data-sublabel`、`data-tag`（`data-def` 可指定預設，例如 `外框 · 橘`） | 內文標籤 | 內文標籤（一頁一組；一頁有兩個以上 `data-tag`、又沒有重點卡時，改成每張各自設定） | 逐頁 |
| `data-ctaicon` | 封底按鈕裡的圖示 | 聯絡按鈕圖示 | 逐頁 |
| `data-num` | 大數字（32px 以上） | 重點數字顏色 | 逐頁、逐個 |
| `data-b="icon"`（`<i data-b="icon" class="icon-…" data-ic-alt="名稱2,名稱3">`，放在 `data-bullet` 裡） | 列點的圖示形狀 | 列點形狀「圖示」、列點圖示 3 選 1 | 整份／逐頁 |
| `data-ind="橘／紫／青"` | 有產業分類的內文標籤 | 「跟隨產業色」選項 | 逐頁 |
| `<section data-photomode="half／hex">` ＋ `data-photoframe`（照片外框）＋ `data-pm-half／hex／card／none="CSS"`（各模式要覆寫的樣式）；照片框加 `data-mask-hex`（六角遮罩路徑）、`data-fit0`（原本的 fit） | 一側照片、一側文字的頁面 | 照片呈現 | 整份 |
| `data-pagenum` | 頁碼（內含 `<span>`） | 顯示頁碼 | 整份 |
| `<image-slot>` | 照片位置 | 照片（選擇、調整範圍、移除） | 逐頁 |

**標題圖示**：每個 `data-mi` 圖示有 3 個候選：本身的圖示是預設，`data-ic-alt` 再給 2 個。換內容時，依新標題的意思重新挑這 3 個（`python3 ../deck-hexgeo/lucide_pick.py --search 關鍵字`），不要沿用範本的圖示，也不要給一整組共用清單。面板上點選圖示時，這一頁會自動切成「圖示」形式。

## 面板行為

和六角幾何拼貼一致：

- 右上「調整」只顯示**畫面中間那一頁**能改的項目，捲動時自動換頁；不另放每頁的「調整這一頁」按鈕（2026-10-06 起，各版型一致），並顯示這頁有幾項可調整。
- 正在調整的頁標「正在調整」，其他頁暫時變淡；寬螢幕時簡報往左讓出空間，不加暗幕。
- 每項標「只改這頁」或「整份套用」，右側列出影響的頁碼。可切「顯示全部選項」。
- 「恢復預設」只還原目前這一頁的「只改這頁」項目；在「顯示全部選項」下按，才會整份還原。
- 「顯示可調整區塊」用虛線框出這一頁面板裡每一項會改到的元素（`engine.js` 的 `MKT()`：面板項目 → 元素；顏色：青＝版面與照片、灰＝卡片、紫＝編號與數字、橘＝標籤、深色＝列點、金＝其他）。新增面板項目時要在 `MKT()` 補上對應，否則這一項不會被框出。成品與下載的 PDF／PPTX 不會出現虛線。
- 選「輔助色側條」時，若這一頁還沒選重點卡，自動選第 1 張。
- 按「存檔」才會寫進檔案（見上方「編輯中與成品」）；存檔前的調整只暫存在自己的瀏覽器。
- 「播放」全螢幕逐頁播放；瀏覽器的列印／另存 PDF 會一頁一張輸出。

## 品牌決定（2026-10-06 合併兩個面板時確認）

- **編號／圖示、列點、重點數字的顏色不提供黃色**：黃色圖磚、黃色列點是品牌規範禁止的用法。兩個環境統一照 Claude Code 版的規則（2026-10-06 確認）。頁面標籤、側條仍可選黃，黃色是沒有分類色可跟時的補充色。
- 圓角固定 16px，面板不提供調整。
- 墨底的重點卡（白底灰框）改成淺灰卡 `#F2F2F2` 配深色字；墨底輔助色用 `tokens/colors.css` 的 `--oc-ink-*`。
- 封面、章節頁的六角形一律用 Ocard 消費者版 logo mark；Ocard for Business 版只用在 logo（左上、頁尾、封底）。

## 2026-10-06 加回的四個功能

- **照片呈現（整份一致）**：依版型／半版分欄／六角遮罩／卡片內嵌／不放照片。作用在有 `data-photomode` 的頁面（範本：02 宣言、19 自動化推播、20 圖文列表）。
- **重點數字顏色（逐頁、逐個數字）**：墨（墨底為白）／橘／紫／青，不提供黃。和「重點卡」同時使用時面板會提醒擇一（只提醒、不阻擋）。
- **列點 · 圖示**：列點形狀多一個「圖示」，每個列點有 3 個依意思挑的候選。
- **內文標籤 · 跟隨產業色**：有產業分類的標籤（`data-ind`）可選「跟隨產業色」，每個標籤用自己產業的顏色；「整頁一次套用」會清掉逐張的設定。
