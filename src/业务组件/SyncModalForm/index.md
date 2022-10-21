---
nav:
  title: 业务组件
  path: /businessComponents
---

## 可在异步请求后调用的 FormModal 接触原生的限制

Demo:

```tsx
import React, { useRef } from 'react';
import { SyncModalForm } from 'goldjet-components';
import { request } from 'bssula';
import { Button } from 'antd';

export default () => {
  const SyncModalFormRef = useRef(null);
  const handleClick = async () => {
    SyncModalFormRef.current.show({
      title: '弹框标题',
      initialValues: {
        name: '未知',
        nihao: 'cat',
      },
      preserveInitialValues: true,
      fields: [
        {
          name: 'name',
          label: '姓名',
          field: 'input',
        },
        {
          name: 'upload',
          label: '姓名',
          field: { type: 'bs-uploadList', props: { maxCount: 1, required: true } },
        },
      ],
      submit: {
        url: 'https://www.mocky.io/v2/5ed7a8b63200001ad9274ab5',
        method: 'post',
      },
    });
  };
  return (
    <>
      <SyncModalForm ref={SyncModalFormRef} />
      <Button type="primary" onClick={handleClick}>
        异步调用
      </Button>
    </>
  );
};
```

## API
