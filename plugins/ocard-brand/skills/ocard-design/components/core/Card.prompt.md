Default container for grouped content on a slide. 一般卡片用淺灰底（`filled`），墨底頁用 `inverse`。

```jsx
<Card variant="filled"><h3>會員總數</h3><p>12,480</p></Card>
<Card variant="inverse">深色頁上的一般卡片</Card>
```

**標重點 — 三選一，不疊加，一組卡片只標一張：**

```jsx
{/* 1. 中性強調：主要頁面（總結、方案、章節重點）的預設做法，不吃該頁的分類色 */}
<Card variant="filled" emphasis="neutral">白底 + 灰框，旁邊的一般卡是淺灰底</Card>
<Card variant="inverse" emphasis="neutral" ground="ink">墨底頁改成淺灰底卡片 + 墨色字</Card>

{/* 2. 輔助色側條：只有該頁真的有分類色時才用，且顏色要跟圖表一致 */}
<Card variant="filled" emphasis="accent" accent="teal">藍綠圖表下方的解讀卡</Card>

{/* 2b. 品牌黃側條：該頁沒有分類色可跟時 */}
<Card variant="filled" emphasis="accent" accent="yellow">重點卡</Card>

{/* 3. 外框標籤：要說明「為什麼是這張」時 */}
<Card variant="filled" tag="最多人選">方案比較</Card>
```

沒有淺黃卡面；品牌黃可作 10px 側條，其餘只用於標題裝飾線、螢光筆、標題裡的一個詞、編號方塊裡的字。
主要章節頁若用輔助色側條標重點，會和分類色撞在一起，一律改用 `emphasis="neutral"`。
