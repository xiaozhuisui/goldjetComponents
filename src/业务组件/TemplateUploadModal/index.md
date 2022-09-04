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
const templateUploadModalConfig = {
  url: '/api/warehousetransport/ownerWarehouse/downloadTemplate',
  templateName: '库存分配模板',
  success: (fileData: any) => {
    const { file } = fileData;
    if (!file) {
      return message.info('请上传文件');
    }
    const formData = new FormData();
    formData.append('file', file.originFileObj);
    request({
      url: '/api/warehousetransport/ownerWarehouse/importAssignInfo',
      method: 'post',
      params: formData,
      converter: () => {
        forwardedRef.current.tableRef.current.refreshTable();
      },
    });
  },
};
export default () => <TemplateUploadModal {...templateUploadModalConfig} />;
```

<API></API>
