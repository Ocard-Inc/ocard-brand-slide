# Ocard-brand-Slide

> 最後更新：2026-10-08

Ocard 品牌簡報的設計系統、模板與 Claude 外掛。這個 repo 是唯一來源：要改設計規範或模板，改這裡，再更新組織的外掛。

```
Ocard-brand-Slide/
├── 01_模板/                      三種簡報風格的範本與預覽圖（預覽/），點進資料夾就能看到每個版型
│   ├── 白底標準_261008.html
│   ├── 墨底標準_261008.html
│   └── 六角幾何拼貼_261006.html
├── 02_品牌素材/
│   ├── logo_261006/              各版本 logo（svg/、png/）
│   ├── 標準字型_261006/           Montserrat、Noto Sans TC 下載連結與說明
│   └── 規定用色_261006.html       色票：標準色、輔助色、用量規則
├── 03_使用流程_261006.md          從「做一份簡報」到交付的完整步驟（給人看的版本）
├── 04_討論決定紀錄_261008.md       已確認的設計決定，新的決定往上加
├── .claude-plugin/marketplace.json  組織上架用的外掛清單
└── plugins/ocard-brand/          skill 本體（結構不能動，組織上架用）
    └── skills/ocard-design/      SKILL.md、readme.md、CHANGELOG.md、模板、素材
```

`01_模板`、`02_品牌素材` 裡的檔案是從 skill 複製出來方便瀏覽的；要修改請改 skill 裡的原始檔，再重新產出、覆蓋這裡的檔案。檔名後的六碼是該檔案最後更新的日期（例：`261008` = 2026-10-08），各檔案依自己的更新日標示。

## 更新組織的外掛

這個 repo 本身就是外掛市集（`.claude-plugin/marketplace.json`）：市集名稱 `ocard`，外掛名稱固定為 **`ocard-slide-system`**（不帶日期），更新日期與版本寫在 `version` 和說明裡（目前 1.3.1，2026-10-08）。

- **改了 skill 就要升版本號**（`plugin.json` 與 `marketplace.json` 的 `version` 一起改），Claude 才會把它當成新版。
- **Claude Code 安裝**：`/plugin marketplace add Ocard-Inc/ocard-brand-slide` → `/plugin install ocard-slide-system@ocard`。repo 是私人的，電腦需先登入 GitHub（`gh auth login`、`gh auth setup-git`）。
- **Claude Code 更新**：`/plugin marketplace update ocard`；或在 `/plugin` → Marketplaces 把這個市集的自動更新打開（預設關閉）。
- **claude.ai 網頁版／桌面版**：不會自動從 GitHub 同步，由組織管理員在組織設定的外掛／技能頁面加入或更新。
- 舊外掛 `ocard-brand-261002`（以及先前帶日期的名稱）請移除，避免兩個版本同時觸發。
