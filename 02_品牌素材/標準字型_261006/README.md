# 標準字型

> 最後更新：2026-10-06

Ocard 簡報與所有品牌產出只用這兩套字，任何風格都不換：

| 用途 | 字型 | 下載 |
| --- | --- | --- |
| 繁體中文 | Noto Sans TC | https://fonts.google.com/specimen/Noto+Sans+TC |
| 英文與數字 | Montserrat | https://fonts.google.com/specimen/Montserrat |

兩套都是 Google Fonts 的免費開源字型（SIL Open Font License），可商用。

## 什麼時候需要安裝

- **用模板 build 出來的 HTML 簡報（`01_模板/` 裡的檔案、或 Claude 產出的簡報）**：字型已經嵌在檔案裡，對方沒裝字型、沒網路也會正確顯示，**不用安裝**。
- **改了 HTML 裡的文字但沒有重新 build**：新加的字沒有嵌進去，會改用電腦預設字型（PingFang TC／Microsoft JhengHei），斷行可能改變。請 Claude 重新執行 `build.py`。
- **PPTX、Keynote、Google 簡報或其他會重新排版的檔案**：依賴對方電腦的字型，**要安裝**上面兩套字，否則會跑版。

字型檔本身放在 skill 裡（`plugins/ocard-brand/skills/ocard-design/assets/fonts/`），`build.py` 嵌入字型時會用到，不能刪；這個資料夾只放下載連結，不重複放一份。
