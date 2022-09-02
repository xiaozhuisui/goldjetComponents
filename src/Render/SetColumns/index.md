---
nav:
  title: Render组件
  path: /render
---

## 列设置

Demo:

```tsx
import React from 'react';
import { SetColumns } from 'goldjet-components';
const columns = [
  { title: '序号' },
  { title: '提单号' },
  { title: '清单号' },
  { title: '账单号' },
  { title: '日期' },
];

export default () => <SetColumns columns={columns} />;
```
