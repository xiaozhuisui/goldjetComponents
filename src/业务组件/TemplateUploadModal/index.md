---
nav:
  title: 业务组件
  path: /businessComponents
---

## 上传弹窗 包含下载模板

Demo:

```tsx
import React from 'react';
import { TemplateUploadModal } from 'goldjet-components';
import { request } from 'bssula';
const templateUploadModalConfig = {
  url: '/api/warehousetransport/ownerWarehouse/downloadTemplate',
  templateName: '库存分配模板',
  success: (fileData: any) => {
    const formData = new FormData();
    formData.append('file', fileData);
    request({
      url: '/api/warehousetransport/ownerWarehouse/importAssignInfo',
      method: 'post',
      params: formData,
      converter: () => {
        alert('发送成功！');
      },
    });
  },
};
export default () => <TemplateUploadModal {...templateUploadModalConfig} />;
```

<API></API>
