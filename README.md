# Ocard-brand-Slide

> 最後更新：2026-10-06

Ocard 品牌簡報的設計系統、模板與 Claude 外掛。這個 repo 是唯一來源：要改設計規範或模板，改這裡，再更新組織的外掛。

```
Ocard-brand-Slide/
├── 01_模板/                      三種簡報風格的範本與預覽圖（預覽/），點進資料夾就能看到每個版型
│   ├── 白底標準_261006.html
│   ├── 墨底標準_261006.html
│   └── 六角幾何拼貼_261006.html
├── 02_品牌素材/
│   ├── logo_261006/              各版本 logo（svg/、png/）
│   ├── 標準字型_261006/           Montserrat、Noto Sans TC 下載連結與說明
│   └── 規定用色_261006.html       色票：標準色、輔助色、用量規則
├── 03_使用流程_261006.md          從「做一份簡報」到交付的完整步驟（給人看的版本）
├── 04_討論決定紀錄_261006.md       已確認的設計決定，新的決定往上加
├── .claude-plugin/marketplace.json  組織上架用的外掛清單
└── plugins/ocard-brand/          skill 本體（結構不能動，組織上架用）
    └── skills/ocard-design/      SKILL.md、readme.md、CHANGELOG.md、模板、素材
```

`01_模板`、`02_品牌素材` 裡的檔案是從 skill 複製出來方便瀏覽的；要修改請改 skill 裡的原始檔，再重新產出、覆蓋這裡的檔案。檔名後的 `261006` 是更新日期（2026-10-06）。

## 更新組織的外掛

`.claude-plugin/marketplace.json` 讓這個 repo 可以當作外掛市集：外掛名稱 `ocard-slide-system-261006`（Ocard Slide System，名稱後面是更新日期，每次更新換新日期）。組織管理員把這個 repo 加成外掛來源後，在 Claude 裡安裝新的外掛；舊的外掛（`ocard-brand-261002`）建議移除，避免同時觸發兩個版本。
