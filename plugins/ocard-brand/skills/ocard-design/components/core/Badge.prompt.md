Status or count label.

```jsx
<Badge tone="brand">限時</Badge>
<Badge tone="success"><i className="icon-check" aria-hidden="true" />已兌換</Badge>
```

Six tones, and the fill logic is the rule, not a style choice:

| tone | treatment |
| --- | --- |
| `brand` | 品牌黃實心 + 墨黑字 |
| `solid` | 墨黑實心 + 白字 |
| `neutral` | 白底 + 1pt `--oc-gray-300` 外框 |
| `success` / `warning` / `info` | 白底 + 1pt teal / orange / purple 外框，文字同色 |

Accent tones are **never filled and never shadowed** — a filled teal pill is off-brand. Use several accent tones on one page only when the colour is carrying a category distinction; otherwise one accent per page.
