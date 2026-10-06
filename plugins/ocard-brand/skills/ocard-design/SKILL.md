---
name: ocard-design
description: "Ocard 的品牌設計系統與簡報製作 skill，也是所有 Ocard 簡報工作的預設。Use for well-branded Ocard decks, interfaces and assets (colors, type, fonts, logos, layouts, UI kit), for production or throwaway prototypes. Triggers include: \"簡報\", \"Ocard 簡報\", \"做投影片\", \"幫我排版投影片\", \"PPT\", \"品牌簡報\", \"公司簡報\", \"提案簡報\", \"業務簡報\", \"客戶提案\", \"案例分享簡報\", \"投資簡報\", \"季報\", \"年度簡報\", \"內部報告簡報\", \"把文件轉成簡報\", \"把逐字稿／會議紀錄做成簡報\", \"整理成投影片\", \"重新設計這份簡報\", \"白底標準\", \"墨底標準\", \"六角幾何拼貼\", \"六角形版型\", \"六角風格簡報\", \"Ocard 設計系統\", \"Ocard 視覺規範\", \"Ocard 色票\", \"Ocard 字型\", \"Ocard deck\", \"Ocard presentation\", \"pitch deck\", \"slides\", \"slide deck\", \"presentation\", \"make a deck\", \"proposal deck\", \"sales deck\", \"investor deck\", \"quarterly review\", \"turn this into slides\", \"convert to slides\", \"redesign this deck\", \"hex geometric deck\", \"Ocard design system\", \"Ocard brand guidelines\", \"make this on-brand for Ocard\", or any slide deck, one-pager or visual that should follow Ocard's visual identity. When triggered by a deck request, first ask whether the user wants a deck made before starting."
user-invocable: true
---

> 最後更新：2026-10-06（新增共用統計圖表；「調整」按鈕各版型統一；更新紀錄見 `CHANGELOG.md`）

# ⓪ 觸發後先確認（最優先）

**被簡報類的關鍵字觸發時，第一個回覆只問一件事：「要我幫你製作一份 Ocard 簡報嗎？」**

- 有選項工具時用點選：AskUserQuestion（Claude Code）或對話內選項表單（Claude Design），選項為「要，開始製作簡報」（第一個）與「不用，我只是要問問題／做別的」。沒有選項工具時，用一句話問並等回覆。
- 使用者選「要」→ 進入下方的強制前置流程（Step 1）。選「不用」→ 不進入簡報流程，直接照他的需求回答（例如查色票、字型、logo 用法），仍依本 skill 的品牌規範。
- **同一段對話只問一次**：已經確認過要做簡報，之後的回覆（包括 Step 1、Step 2 的每一題、微調）都不再問這一句。只有使用者在同一段對話裡又提出一份新的簡報需求時，才再問一次。
- 只問色票、字型、logo 這類品牌規範問題，而不是要做簡報時，不問這一句，直接回答。

# ⛔ 強制前置流程（最高優先，先於一切其他指示）

**使用者在 ⓪ 確認要做 Ocard 簡報後（新做、重做、依此模板產出、把文件轉成簡報），下一個回覆一定是 Step 1，不得例外。**

硬性規則：

1. **拿到原始文本後，第一個回覆只做 Step 1a：請使用者選資訊密度**（附示意，見 Step 1）。不得先問風格、底色、受眾等其他選項；不得複製模板、寫簡報的 HTML／CSS。
   **選好密度後，下一個回覆才是 Step 1b 的條列式頁面大綱**，照選定的密度拆頁。
2. **使用者沒給原始文本 → 第一個回覆只做一件事：請他貼上原始文字或檔案**，拿到後才做 Step 1。
3. **Step 1 必須等使用者明確回覆「確認」或提出修改並再確認，才能進 Step 2**。使用者沒回覆確認前，不得自行假設已通過。
4. **Step 2 才能問風格問題**（簡報風格、系統預設／參考來源、該風格自己的題目）。這些問題不得與 Step 1 合併、不得提前。
5. 每一步開頭標示進度，例如「**Step 1a／4 · 資訊密度**」「**Step 1b／4 · 文本梳理**」，讓使用者清楚目前在哪一步。
6. 即使使用者說「直接做」「幫我決定」，也要至少交出 Step 1b 大綱讓他過目一次；密度和 Step 2 可以改用預設值（標準密度、系統預設風格）並說明。
7. 任何一步被跳過，就是錯誤——發現時立即停下，回到被跳過的那一步。

---

Read `readme.md` in this skill first, then explore the files it indexes. For visual artefacts (slides, mocks, prototypes) copy the assets you need out and produce HTML the user can open; for production code, copy assets and use the rules here to design accurately in this brand.

If the user invokes this skill with no other guidance, ask what they want to build, ask focused questions, and act as an expert designer.

---

# 簡報生成流程規範（Workflow Guardrails）

**建立 Ocard 簡報時必須依序走完四步，未取得使用者確認前不得跳級（見檔案開頭的強制前置流程）。** 其他類型的產出（單頁、報表、產品介面）不受此四步約束，但品牌規範一律適用。

## Step 1 — 資訊密度與文本梳理（零簡報程式碼）

### Step 1a — 先選資訊密度

密度決定每頁放多少、總共幾頁，必須在拆頁之前定案。選項：A 精簡／B 標準（預設）／C 詳盡，圖與白話說明取自 `guidelines/style-picker-options.json` 的「資訊密度」。可同時大略告訴使用者：「依原稿份量，精簡約 X 頁、標準約 Y 頁、詳盡約 Z 頁。」

- **Claude Design（有 ask_user 表單工具）**：出一題 svg-options 單選題。表單本身有送出鍵，**送出即視為確認，不再加確認題**；收到答案後直接交出 Step 1b 大綱。
- **Claude Code 或任何能發布 Artifact 的環境**（選項工具沒有圖、也沒有送出鍵，所以要多一步確認）：
  1. 用 Artifact 工具發布 `guidelines/density-picker.artifact.html`（宣告 `capabilities: {db: {}, user: {}}`），把連結給使用者。**這一頁只用來看示意**。
  2. **緊接著用 AskUserQuestion 出同一題**（description 用頁面上的白話說明），並說明「看著右邊的示意，在這裡點選，按確認後我就開始整理大綱，示意視窗可以關掉」。
  3. **選完再出一個確認題**：題目寫出選到的密度與預估頁數（例如「用『標準』密度整理，約 7 頁？」），選項為「確認，開始整理」（第一個）與「重新選擇」。選確認後，同一個回合直接交出 Step 1b 大綱；選重新選擇就重出密度題。Artifact 頁面無法主動通知對話，作答一律以對話裡的選擇題為準。
  4. 只有使用者改在頁面上按「確認選擇」並回對話說「選好了」時，才用 ArtifactData `get`（collection `picks`、doc_id `density`）讀取；讀不到就請他按「複製文字」貼回。
- **其他沒有選項工具的環境**：直接列出三個選項，都附白話說明。

### Step 1b — 照選定密度梳理大綱

讀取使用者的原始文本，主動梳理出資訊層級，並拆解為適合 16:9 的頁數。

輸出**條列式的頁面內容**，只呈現使用者看得懂的資訊結構——頁碼與頁面主題、主要／副標題、內文重點或關鍵數據或階段流程。層級依文本屬性動態判斷（數據分析、流程步驟、論述對比各有不同結構），不套固定模板。

**嚴禁向使用者暴露工程或設計模組名稱**：Card、Grid、Flexbox、layout code、版型代號、component 名稱都不出現在這一步的對話裡。

**封面預設不放講者資訊**（姓名、職稱、部門、日期都不放）。原始文本裡若只有「講者：〔姓名／職稱〕」這類待填欄位，直接拿掉，並在大綱後的說明裡提一句；只有使用者明確要求、而且給了實際內容時才放。

照 Step 1a 選定的密度拆頁：精簡＝一頁一個重點；標準＝一頁約 3 個重點；詳盡＝一頁多組數據與說明。大綱開頭註明「依〔密度〕拆成 N 頁」，使用者想換密度時重新拆頁即可。

梳理完畢後問使用者：「請確認以上的頁數拆解與內容重點是否符合需求？有需要調整或增刪的地方請告訴我。」

**此階段嚴禁輸出簡報的 HTML、CSS 或渲染程式碼（密度示意頁除外），也不得詢問任何風格選項**，必須等使用者確認架構後才進入 Step 2。

## Step 2 — 風格確認與 Design Token 映射

**固定資產（Fixed Assets）不隨風格改變**：品牌標準色七色、Montserrat + Noto Sans TC、兩套 logo lockup、輔助色用量上限。任何參考來源都不能覆寫這些。

- **字型在所有風格都固定**：繁體中文 Noto Sans TC、英文與數字 Montserrat。
- **每種風格是獨立的一套版型**，字級表、版面規則各自獨立，不混用：白底標準、墨底標準用 `readme.md` 的簡報字級表；六角幾何拼貼用 `templates/deck-hexgeo/README.md` 裡它自己的字級表。除非使用者指名要更新哪一個版型，否則改一個版型不動其他版型。

問使用者：「請選擇使用【系統預設風格】，或提供您希望參考的【網站連結、圖片、風格關鍵字】。」資訊密度已在 Step 1a 定案，這裡不再問。

### Step 2a — 先選簡報風格（版型）

Step 2 的第一題一定是「簡報風格」，和 Step 1a 一樣附示意圖。圖與白話說明取自 `guidelines/style-picker-options.json` 的「簡報風格」，示意頁是 `guidelines/template-picker.artifact.html`（Artifact 讀取用 doc_id `template`）。

| 選項 | 模板 | Step 2b 要問的題目（示意頁） |
| --- | --- | --- |
| **A 白底標準**（預設） | `templates/deck-panel/slides-white.html`（兩個環境共用，`python3 build.py white`，內建調整面板） | 封面樣式、照片呈現（`guidelines/style-picker.artifact.html`，doc_id `latest`） |
| **B 墨底標準** | `templates/deck-panel/slides-ink.html`（兩個環境共用，`python3 build.py ink`，內建調整面板） | 同白底標準，共用同一頁 |
| **C 六角幾何拼貼** | `templates/deck-hexgeo/`（兩個環境共用，內建調整面板） | 封面樣式（六角幾何拼貼）（`guidelines/hexgeo-picker.artifact.html`，doc_id `hexgeo`） |

**之後新增版型**：在 `style-picker-options.json` 的「簡報風格」加一個選項（附示意圖），再替它新增自己的題目（同一個 JSON 裡的新鍵）和題目頁（`style-picker.build.py` 的 `PAGES` 加一頁），重新執行 `python3 guidelines/style-picker.build.py`。既有版型的題目頁不用改。

### Step 2b — 只問所選版型自己的題目

- **白底標準／墨底標準**：只問「封面樣式」和「照片呈現」。
  - **章節頁不問**：簡報有章節時預設產出章節頁（六角照片），使用者生成後說不要再拿掉。
  - **卡片外觀不問**：預設實心淺灰底，產出後可在調整面板改成線框或無框分欄。
  - **圓角不問、也不提供調整**：一律標準圓角 16px。
- **六角幾何拼貼**：只問「封面樣式（六角幾何拼貼）」：A 六角膠囊拼貼（預設）／B 墨色滿版。章節頁、卡片、圓角、照片都不問：這個風格有自己固定的版面，輔助色、編號、小標記號、圖示、照片在產出後的面板調整。完整規則與示意見 `guidelines/style-hexgeo.board.html`。

### 風格提問一律附示意圖＋白話說明（使用者多半不是設計背景）

- **不得只丟專有名詞**讓使用者自己理解。每個選項都要有：示意圖、一句白話描述（長什麼樣子＋適合什麼場合）、字母代號。圖與說明取自 `guidelines/style-picker-options.json`（每題的 label／desc／svg）；全部選項的總覽是 `guidelines/style-picker.card.html`。
- **作答一律用點選，不要求使用者手動打字**：
  - **Claude Design（有 ask_user 表單工具）一律用對話內的選項表單**，不得請使用者開啟圖卡頁、也不得要求複製貼上。先出 Step 2a 一題，送出後再出所選版型的 Step 2b 題目；每題各開一個圖像選項題（svg-options），題目副標放白話說明。**表單送出即視為確認，不再加確認題**，Step 2b 送出後直接進入 Step 3。
  - **Claude Code 或任何能發布 Artifact 的環境**：**不要只丟一張圖片**，要讓使用者能邊看邊選——
    1. 用 Artifact 工具發布 `guidelines/template-picker.artifact.html`（宣告 `capabilities: {db: {}, user: {}}`），把連結給使用者。**這一頁只用來看示意**。
    2. **緊接著用 AskUserQuestion 出同一題**（label 用「字母＋選項名」，description 用頁面上的白話說明），並說明「看著右邊的示意，在這裡點選」。
    3. 選好後，同樣發布所選版型的題目頁（上表），再用 AskUserQuestion 出那幾題。
    4. **選完再出一個確認題**（這個環境的選項工具沒有送出鍵）：用一句話列出選擇摘要（含套用預設的項目），選項為「確認，開始製作」（第一個）與「重新選擇」。選確認後，同一個回合直接進入 Step 3；選重新選擇就問要改哪一題，只重出那一題。
    5. 只有使用者改在頁面上按「確認選擇」並回對話說「選好了」時，才用 ArtifactData `get`（collection `picks`、doc_id 見上表）讀取，`confirmed` 為 true 才算定案；讀不到就請他按「複製文字」貼回。
  - **選項表單和示意頁都打不開的環境**：附上 `assets/style-picker.png`（Step 2a 與各版型題目的示意截圖，每個選項都有字母），逐題列出選項＋白話描述，請使用者回覆字母。截圖由 `guidelines/` 的三個示意頁截成，選項有變動時要重新截圖。
- 不能顯示圖片的環境：逐題列出選項＋白話描述，不得省略描述。
- 提供「都交給我決定」的選項；跳過的題目套用預設（白底標準・封面六角照片・半版分欄；六角幾何拼貼則為六角膠囊拼貼），並在回覆中說明採用了哪些預設。
- 選項對應（白底／墨底都在 `templates/deck-panel/` 產出的簡報面板上）：
  - 封面樣式 → 面板「封面樣式」（六角照片／長方照片／灰色 logo mark）；章節頁 → 「章節頁樣式」預設六角照片；卡片 → 「卡片外觀」預設實心淺灰底。Step 2 選的封面樣式：產出時只留選定那一款的版面，或在交付說明裡告訴使用者到面板切換。
  - 照片呈現（單選，整份一致）→ 面板「照片呈現」（依版型／半版分欄／六角遮罩／卡片內嵌／不放照片），作用在一側照片、一側文字的版型；其他頁則挑對應的版型：半版分欄＝照片在右側的分欄版型（如 20 圖文列表）、六角遮罩＝六角照片版型（如 02 宣言、21 深度個案）、卡片內嵌＝照片在卡片裡的版型（如 17 門市展示）、不放照片＝改用無照片版型。
  - 六角幾何拼貼的封面 → `deck-hexgeo` 的 `cover`（六角膠囊拼貼）／`coverB`（墨色滿版），產出時只留一款。

若使用者提供參考資源，只提取這四個維度並轉譯為 token：

1. **邊角風格 Border Radius** — 不轉譯：簡報圓角固定標準圓角 16px，參考來源的圓角不採用。
2. **圖片呈現樣式 Image Treatment** — 滿版、卡片內嵌、六角遮罩（品牌特徵手法）、留白分欄。漸層遮罩與雙色調一律不採用。
3. **資訊留白與密度 Spacing & Density** — 緊湊 Compact ↔ 大留白 Spacious。
4. **容器與邊框樣式 Container Elevation** — 實心卡片、線框、無邊框純文字分欄、細陰影浮起。

## Step 3 — 生成與微調（Delta Edit 鐵律）

**首次生成**：結合 Step 1 的文案層級與 Step 2 的風格 token，套用既有版型生成完整簡報。

微調時：

1. **單一或區域變更**（icon 大小、單頁內文、替換圖片）：**只改動指定頁面或該區塊**，禁止重新輸出全份簡報。
2. **全域 token 變更**（字級系統、標準色、底色）：為維持整份一致性，**允許且必須**更新全份的全域 token。
3. **重新生成**：除使用者明確要求「重新生成全份簡報」，一律採最小範圍更新。

### 白底／墨底：產出方式與調整面板（2026-10-06 起，兩個環境相同）

> 舊做法（另存 `.dc.html`、保留 `DCLogic`、`dc_set_props`、`ocardTweakAudit()` 重建 Tweaks 頁數）已停用。Claude Design 的 `WhiteDeck.dc.html`／`InkDeck.dc.html` 現在只是預覽入口，用 iframe 嵌入 `templates/deck-panel/` build 好的檔案，和六角幾何拼貼的 `DeckHexgeo.dc.html` 同樣做法。

1. 複製 `templates/deck-panel/slides-white.html`（墨底用 `slides-ink.html`），第一行 `<title>` 改成簡報標題。
2. 換成 Step 1 確認的內容：需要的版型照抄、用不到的整頁刪掉、可調順序。每頁 `<section>` 的 `data-id` 不可重複（同一版型用兩次就改成 `kpi-2` 這類代號）。
3. **元件標記不得刪除**：`data-num`、`data-ind`、`data-photomode`／`data-photoframe`／`data-pm-*`、`data-card`、`data-emphgroup`、`data-emph`、`data-metricno`／`data-mn`／`data-mi`、`data-icon`、`data-tag`、`data-sublabel`、`data-tagable`、`data-bullet`／`data-b`、`data-pagenum`、`data-ctaicon`、`data-coverstyle`、`data-secstyle`。調整面板依這些標記自動產生每一頁的項目（完整對照見 `templates/deck-panel/README.md`）；自行組合新版面時也照同樣規則加上。
4. **頁碼與面板頁數全部自動**：依頁面實際順序產生，不需要、也不可以手動維護頁碼清單。
5. **標題圖示**：每個 `data-mi` 圖示依新標題的意思挑 3 個 Lucide 圖示——本身的 class 是預設，`data-ic-alt` 放另外 2 個。不得沿用範本的圖示，也不得給一整組共用清單。
6. 執行 `python3 templates/deck-panel/build.py white 檔名.html`（墨底 `ink`）。**改過文字就要重新執行**，新字才會嵌進字型。
6b. **調整階段**：Claude Code 把產出檔發布成 Claude 頁面（Artifact，宣告 `capabilities: {artifact: {}, user: {}, downloads: true}`）給使用者調整；Claude Design 用 `--dc` 產生預覽入口。調整面板只在這兩個地方出現，使用者按「存檔」保存。
6c. **交付成品**：用 `--state`（必要時加 `--photos`）把存檔內容寫進最終 HTML 再交付；成品在 Claude 以外打開時沒有調整面板。做法見 `templates/deck-panel/README.md`「編輯中與成品」。
7. 交付前用瀏覽器打開產出檔確認：沒有錯誤、按「調整」能打開畫面中間那一頁、面板項目和這一頁對得上。可在主控台執行 `ocardDeck.schema()` 看每個面板項目作用在哪幾頁。

調整面板只在 Claude 裡出現（有編輯權的 Claude 頁面、Claude Design 的 Edit 模式），有「存檔」「編輯文字」「下載」（見下方「所有版型共用」）；在其他地方打開就是成品。操作（和六角幾何拼貼一致）：右上「調整」只顯示畫面中間那一頁的項目、捲動自動換頁；正在調整的頁標「正在調整」、其他頁變淡；每項標「只改這頁」或「整份套用」；「恢復預設」只還原目前這一頁。

**「調整」按鈕所有版型一致（2026-10-06 起）**：只有一個入口，就是工具列上的「調整」（白底的樣式：外框膠囊按鈕、滑桿圖示、「調整」兩字，和「編輯文字／存檔／下載」放在同一排）；按下打開畫面中間那一頁。投影片上不另放「調整這一頁」按鈕（預覽時一次只看得到一頁，兩個按鈕功能重複）。新版型照這個做。

**統計圖表（2026-10-06 起）**：所有版型共用 `templates/_shared/charts/ocard-charts.js` 畫圖表，各版型只換外觀（`white`／`ink`／`hexgeo`）。支援 10 種：KPI 小趨勢、折線／面積、直向長條、橫向長條、堆疊長條、甜甜圈、分段進度、漏斗、熱度表、時間軸。一張圖只有一個重點用輔助色、其餘淡底；多色只用在不同分類。用法與欄位見 `templates/_shared/charts/README.md`，三種外觀對照見同資料夾的 `charts-preview.html`。（尚未接進各版型的頁面、調整面板與 PPTX 原生圖表。）

**圖示一律用 Lucide**：寫 `<i class="icon-<名稱>"></i>`（名稱見 lucide.dev/icons），依標題意思挑選；`build.py` 會換成內嵌向量圖示，不需要網路。不用 Flaticon、emoji 或其他圖示庫。

**圖片一律使用可拖放的圖片佔位框**，並提醒使用者提供最終圖片來源。照片佔位框會保留原始畫質（不壓縮）；可直接拖進照片框、點一下選檔，或用面板每頁的「照片」；放入後可雙擊或按「調整範圍」拖曳／縮放，縮到最小能讓整張照片入框，遮罩（六角、圓角）內的範圍都可自由調整；按「更換照片」可重新上傳、按「移除」清空（滑鼠移到照片上，按鈕出現在照片可見範圍的正中央）。`templates/deck-panel/image-slot.js` 是 Ocard 修改版，**不得以一般版本覆蓋**。

**截圖用 `fit="width"`**：手機／產品畫面截圖的照片框一律加 `fit="width"`——照片寬度永遠等於框寬（左右不裁切），框的高度跟著照片比例變化，超過容器高度時只裁上下、可上下拖曳選範圍。一般照片維持 `fit="cover"`。範本裡的手機畫面截圖框已套用。

**照片儲存**：白底／墨底的照片隨「存檔」一起寫進檔案（Claude 頁面）或 Design 的存檔檔，交付時用 `build.py --state／--photos` 寫進成品。六角幾何拼貼也一樣（2026-10-06 起）。

- 生成交付時，不要在照片框加 `readonly`（加了就不能換照片）。**不得以動態關鍵字圖床（Unsplash Source 等）填圖，也不得生成圖像**——來源優先 Magnific（Ocard 已訂閱），其次 Unsplash、Pexels，依 readme 的選圖規則挑選。不要用雲端分享連結（Google Drive 等）當照片來源，多數無法直接顯示。

## 所有版型共用：存檔、編輯文字、下載（`templates/_shared/`，2026-10-06）

**每一個版型——現有的白底標準、墨底標準、六角幾何拼貼，以及之後新增的版型——都必須接上 `templates/_shared/ocard-kit.js`**，讓使用者在每種風格都有同樣的操作：

- **編輯中／成品**：只有在 Claude 裡（有編輯權的 Claude 頁面、Claude Design 的 Edit 模式）才出現調整面板、「編輯文字」、「存檔」；其他地方打開就是成品，沒有面板、照片鎖定。
- **存檔**：設定、照片、改過的文字一起存。Claude 頁面＝寫進頁面成為新版本（發布時宣告 `capabilities: {artifact: {}, user: {}, downloads: true}`）；Claude Design＝同資料夾的 `.ocard-deck.state.json`（照片每張一個檔）。
- **編輯文字**：打開後直接點簡報上的字修改，隨存檔保存。
- **下載**（每個地方都有）：**所有版型的 PPTX、PDF 一律 1920 × 1080**（PPTX 為 20 × 11.25 吋，1280 × 720 的版面等比例放大 1.5 倍，字級、線條、間距一起放大）。格式：PDF（不可編輯）、PowerPoint .pptx（可編輯：文字是文字框、色塊是形狀、圖示與照片是圖片）、Keynote（同一份 .pptx，用 Keynote 開啟；Keynote 的 .key 格式無法在網頁產生）。可編輯檔案不帶 Ocard 的調整面板，改用 PowerPoint／Keynote 自己的工具；收件人電腦需要安裝 Noto Sans TC 與 Montserrat。
- **新版型的接法**：頁面在所有版面之後放 `<!--OCARD-KIT-HEAD-->`，之後的每個 `<script>` 加 `data-ocard-after`，在版型程式前放 `<!--OCARD-KIT-->`；`build.py` 用 `_shared/kit_build.py` 把這兩個記號換成存檔區塊與共用模組，並支援 `--state`、`-o`、`--dc`。版型程式用 `OcardKit.state.v` 存設定、`OcardKit.state.photos` 存照片、改動後呼叫 `OcardKit.changed()`、開面板前呼叫 `OcardKit.canAdjust()`，最後 `OcardKit.init({...})`。範例：`templates/deck-hexgeo/src.html`、`templates/deck-panel/engine.js`。
- **交付成品**：讀回使用者存檔的版本，用 `build.py … --state` 寫進最終 HTML；要給 PowerPoint 的，請使用者在頁面按「下載」。

## Step 4 — 交付與字型安全檢查

先看交付的檔案類型，再決定要不要提醒安裝字型：

| 交付形式 | 字型 | 要不要提醒安裝 |
| --- | --- | --- |
| PDF | 字型嵌在檔案裡 | 不用 |
| `deck-panel`（白底／墨底）、`deck-hexgeo` 產出的 HTML（改完文字有重新執行 `build.py`） | `build.py` 已把用到的字嵌進檔案，斷網、沒裝字型也正確 | 不用 |
| PPTX、Keynote、Google 簡報，或任何會在別的軟體重新排版的檔案 | 依賴對方電腦的字型 | **要提醒** |
| 手動改過文字、沒有重新執行 `build.py` 的 HTML | 新加的字沒有嵌入，會改用電腦預設字型 | **重新執行 `build.py`**；做不到時才提醒安裝 |

需要提醒時，附上載點：

- 繁體中文標準字：https://fonts.google.com/specimen/Noto+Sans+TC
- 歐文標準字：https://fonts.google.com/specimen/Montserrat

並說明備援：「若未安裝上述字型，系統會自動降級為電腦預設字型（PingFang TC／Microsoft JhengHei），斷行可能改變。」

匯出 PPTX 前，確認字型已就位——字型不同會改變斷行，是跑版最常見的原因。
