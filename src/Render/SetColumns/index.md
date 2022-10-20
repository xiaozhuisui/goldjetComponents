---
nav:
  title: Render组件
  path: /render
---

## 列设置（未完善）

Demo:

```tsx
import React from 'react';
import { SetColumns } from 'goldjet-components';
const columns = [
  { title: '序号', key: 'number1' },
  { title: '提单号', key: 'number2' },
  { title: '清单号', key: 'number3' },
  { title: '账单号', key: 'number4' },
  { title: '日期', key: 'number5' },
];

export default () => <SetColumns columns={columns} />;
```

## API 怎么写 参考 Antd

| 成员      | 说明 | 类型 | 默认值 | 版本 | 版本 |
| --------- | ---- | ---- | ------ | ---- | ---- |
| config    | ---  | ---  | ---    | ---  | ---  |
| setConfig | ---  | ---  | ---    | ---  | ---  |
