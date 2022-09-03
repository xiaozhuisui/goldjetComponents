---
nav:
  title: 业务组件
  path: /businessComponents
---

## 查询表格

可选择的统计数量以及左侧插槽:

```tsx
import React from 'react';
import { QueryTable } from 'goldjet-components';
import { Button } from 'antd';
const config = {
  rowSelection: {},
  requestconfig: {
    url: [
      `https://www.fastmock.site/mock/03ce8ea7718dc59bf1e808e436ae63d9/api-goldjet/expressServiceOrder`,
    ],
    method: 'GET',
  },
  leftSlot: '我是插槽',
  actionsRender: [
    {
      buttonType: 'batch',
      type: 'primary',
      children: '带下拉菜单的！！！',
      disabled: false,
      menuData: [
        {
          name: '按勾选数据导出',
          control: true,
          onClick: (ctx: any) => {
            alert('按勾选数据导出');
          },
        },
        {
          name: '按查询条件导出',
          onClick: (ctx: any) => {
            alert('按查询条件导出');
          },
        },
      ],
    },
    {
      children: '完成服务',
      type: 'primary',
      onClick: () => {
        alert('完成服务');
      },
    },
    {
      children: '接单',
      onClick: () => {
        alert('接单');
      },
      type: 'primary',
      disabled: false,
    },
    {
      children: '流转',
      onClick: () => {
        alert('流转');
      },
    },
    {
      children: '取消服务',
      onClick: () => {
        alert('取消服务');
      },
    },
    {
      children: '终止服务',
      onClick: () => {
        alert('已终止');
      },
    },
  ],
  fields: [
    {
      name: 'qp-orderNo-in',
      label: '服务单号',
      field: {
        type: 'input',
        props: {
          placeholder: '请输入服务单号',
        },
      },
    },
    {
      name: 'qp-deliverOrderNo-in',
      label: '总运/提单号',
      field: {
        type: 'bs-textArea',
        props: {
          placeholder: '请输入总运/提单号',
        },
      },
    },
    {
      name: 'qp-platOrderNo-in',
      label: '平台订单号',
      field: {
        type: 'bs-textArea',
        props: {
          placeholder: '请输入平台订单号',
        },
      },
    },
    {
      name: 'qp-customerCode-eq',
      label: '客户名称',
      field: {
        type: 'searchSelect',
        props: {
          placeholder: '请选择客户',
        },
      },
      remoteSource: {
        url: 'https://www.fastmock.site/mock/03ce8ea7718dc59bf1e808e436ae63d9/api-goldjet/info/getInfoList',
        converter: ({ data = [] }) => {
          return data.map((item: any) => ({
            text: item.name,
            value: item.contactCode,
            code: item.contactUnitCode,
          }));
        },
      },
    },
    {
      name: 'qp-createTime-ge*fullDate*qp-createTime-le',
      label: '建单时间',
      field: {
        type: 'rangepicker',
        props: {
          format: 'YYYY-MM-DD',
          style: {
            width: '100%',
          },
          placeholder: ['开始时间', '结束时间'],
        },
      },
    },
    {
      name: 'qp-stateCode-eq',
      label: '订单状态',
      field: {
        type: 'searchSelect',
        props: {
          placeholder: '请选择订单状态',
        },
      },
      initialSource: [
        {
          text: '已取消',
          value: '-1',
        },
        {
          text: '已完成',
          value: '0',
        },
        {
          text: '待接单',
          value: '1',
        },
        {
          text: '已提交',
          value: '2',
        },
        {
          text: '进行中',
          value: '3',
        },
      ],
    },
    {
      name: 'qp-serviceStateCode-eq',
      label: '服务单状态',
      field: {
        type: 'searchSelect',
        props: {
          placeholder: '请选择服务单状态',
        },
      },
      initialSource: [
        {
          text: '进行中',
          value: '10',
        },
        {
          text: '已完成',
          value: '20',
        },
        {
          text: '待接单',
          value: '5',
        },
        {
          text: '已取消',
          value: '-5',
        },
        {
          text: '已终止',
          value: '-1',
        },
      ],
    },
    {
      name: 'qp-orderingCarStateCode-eq',
      label: '约车状态',
      field: {
        type: 'searchSelect',
        props: {
          placeholder: '请选择约车状态',
        },
      },
      initialSource: [
        {
          text: '待约车',
          value: '0',
        },
        {
          text: '部分完成',
          value: '1',
        },
        {
          text: '已完成',
          value: '2',
        },
      ],
    },
    {
      name: 'qp-receiptStateCode-eq',
      label: '交接状态',
      field: {
        type: 'searchSelect',
        props: {
          placeholder: '请选择交接状态',
        },
      },
      initialSource: [
        {
          text: '待交接',
          value: '0',
        },
        {
          text: '已完成',
          value: '1',
        },
      ],
    },
  ],
  columns: [
    { title: '序号' },
    {
      dataIndex: 'orderNo',
      title: '服务单号',
      render: (_: any, row: any) => (
        <Button
          type="link"
          onClick={() => {
            history.push({
              pathname: '/express/services/list/detail',
              query: {
                serviceOrderId: row.id,
                'qp-orderNo-eq': row.orderNo,
                'qp-platOrderNo-eq': row.platOrderNo,
              },
            });
          }}
        >
          {_}
        </Button>
      ),
    },
    {
      dataIndex: 'deliverOrderNo',
      title: '总运/提单号',
      type: 'ell',
    },
    {
      dataIndex: 'platOrderNo',
      title: '平台订单号',
    },
    {
      dataIndex: 'customerName',
      title: '客户名称',
    },
    {
      dataIndex: 'createTime',
      title: '建单时间',
      type: 'time',
      format: 'YYYY-MM',
    },
    {
      dataIndex: 'orderTaker',
      title: '接单人',
    },
    {
      dataIndex: 'stateCode',
      title: '订单状态',
      render: (text: string) =>
        ({
          0: '已完成',
          '-1': '已取消',
          '1': '待接单',
          '2': '已提交',
          '3': '进行中',
        }[text]),
    },
    {
      dataIndex: 'upstreamCancelServiceFlag',
      title: '上游取消服务',
      render: (text: string) =>
        ({
          0: '否',
          1: '是',
        }[text]),
    },
    {
      dataIndex: 'serviceStateCode',
      title: '服务单状态',
      render: (text: string) =>
        ({
          '20': '已完成',
          '-5': '已取消',
          '-1': '已终止',
          '5': '待接单',
          '10': '进行中',
        }[text]),
    },
    {
      dataIndex: 'orderingCarStateCode',
      title: '约车状态',
      render: (text: string) =>
        ({
          '0': '待约车',
          '1': '部分完成',
          '2': '已完成',
        }[text]),
    },
    {
      dataIndex: 'receiptStateCode',
      title: '交接状态',
      render: (text: string) =>
        ({
          '0': '待交接',
          '1': '已完成',
        }[text]),
    },
  ],
  selectDatas: [
    { title: '总计数量', value: undefined, type: 'Count' },
    { title: '待服务', value: '5', type: 'Waiting' },
    { title: '进行中', value: '10', type: 'Ongoing' },
    { title: '已完成', value: '20', type: 'Finish' },
    { title: '已取消', value: '-5', type: 'Cancel' },
    { title: '已终止', value: '-1', type: 'Finish' },
  ],
  selectDatasInfo: {
    url: 'https://www.fastmock.site/mock/03ce8ea7718dc59bf1e808e436ae63d9/api-goldjet/expressServiceOrder/count',
    paramsName: 'qp-serviceStateCode-eq',
  },
};

export default () => <QueryTable {...config} />;
```

## 左侧操作按钮

```tsx
import React from 'react';
import { QueryTable } from 'goldjet-components';
import { Button } from 'antd';
const config = {
  noOtherParams: true,
  rowSelection: {},
  requestconfig: {
    url: [
      `https://www.fastmock.site/mock/03ce8ea7718dc59bf1e808e436ae63d9/api-goldjet/expressServiceOrder`,
    ],
    method: 'GET',
  },
  leftActionsRender: [
    {
      children: '完成服务',
      type: 'primary',
      onClick: () => {
        alert('完成服务');
      },
    },
    {
      children: '接单',
      onClick: () => {
        alert('接单');
      },
      type: 'primary',
      disabled: false,
    },
    {
      children: '流转',
      onClick: () => {
        alert('流转');
      },
    },
    {
      children: '取消服务',
      onClick: () => {
        alert('取消服务');
      },
    },
    {
      children: '终止服务',
      onClick: () => {
        alert('已终止');
      },
    },
  ],
  fields: [
    {
      name: 'qp-orderNo-in',
      label: '服务单号',
      field: {
        type: 'input',
        props: {
          placeholder: '请输入服务单号',
        },
      },
    },
    {
      name: 'qp-deliverOrderNo-in',
      label: '总运/提单号',
      field: {
        type: 'bs-textArea',
        props: {
          placeholder: '请输入总运/提单号',
        },
      },
    },
    {
      name: 'qp-platOrderNo-in',
      label: '平台订单号',
      field: {
        type: 'bs-textArea',
        props: {
          placeholder: '请输入平台订单号',
        },
      },
    },
    {
      name: 'qp-customerCode-eq',
      label: '客户名称',
      field: {
        type: 'searchSelect',
        props: {
          placeholder: '请选择客户',
        },
      },
      remoteSource: {
        url: 'https://www.fastmock.site/mock/03ce8ea7718dc59bf1e808e436ae63d9/api-goldjet/info/getInfoList',
        converter: ({ data = [] }) => {
          return data.map((item: any) => ({
            text: item.name,
            value: item.contactCode,
            code: item.contactUnitCode,
          }));
        },
      },
    },
    {
      name: 'qp-createTime-ge*fullDate*qp-createTime-le',
      label: '建单时间',
      field: {
        type: 'rangepicker',
        props: {
          format: 'YYYY-MM-DD',
          style: {
            width: '100%',
          },
          placeholder: ['开始时间', '结束时间'],
        },
      },
    },
    {
      name: 'qp-stateCode-eq',
      label: '订单状态',
      field: {
        type: 'searchSelect',
        props: {
          placeholder: '请选择订单状态',
        },
      },
      initialSource: [
        {
          text: '已取消',
          value: '-1',
        },
        {
          text: '已完成',
          value: '0',
        },
        {
          text: '待接单',
          value: '1',
        },
        {
          text: '已提交',
          value: '2',
        },
        {
          text: '进行中',
          value: '3',
        },
      ],
    },
    {
      name: 'qp-serviceStateCode-eq',
      label: '服务单状态',
      field: {
        type: 'searchSelect',
        props: {
          placeholder: '请选择服务单状态',
        },
      },
      initialSource: [
        {
          text: '进行中',
          value: '10',
        },
        {
          text: '已完成',
          value: '20',
        },
        {
          text: '待接单',
          value: '5',
        },
        {
          text: '已取消',
          value: '-5',
        },
        {
          text: '已终止',
          value: '-1',
        },
      ],
    },
    {
      name: 'qp-orderingCarStateCode-eq',
      label: '约车状态',
      field: {
        type: 'searchSelect',
        props: {
          placeholder: '请选择约车状态',
        },
      },
      initialSource: [
        {
          text: '待约车',
          value: '0',
        },
        {
          text: '部分完成',
          value: '1',
        },
        {
          text: '已完成',
          value: '2',
        },
      ],
    },
    {
      name: 'qp-receiptStateCode-eq',
      label: '交接状态',
      field: {
        type: 'searchSelect',
        props: {
          placeholder: '请选择交接状态',
        },
      },
      initialSource: [
        {
          text: '待交接',
          value: '0',
        },
        {
          text: '已完成',
          value: '1',
        },
      ],
    },
  ],
  columns: [
    { title: '序号' },
    {
      dataIndex: 'orderNo',
      title: '服务单号',
      render: (_: any, row: any) => (
        <Button
          type="link"
          onClick={() => {
            history.push({
              pathname: '/express/services/list/detail',
              query: {
                serviceOrderId: row.id,
                'qp-orderNo-eq': row.orderNo,
                'qp-platOrderNo-eq': row.platOrderNo,
              },
            });
          }}
        >
          {_}
        </Button>
      ),
    },
    {
      dataIndex: 'deliverOrderNo',
      title: '总运/提单号',
    },
    {
      dataIndex: 'platOrderNo',
      title: '平台订单号',
    },
    {
      dataIndex: 'customerName',
      title: '客户名称',
    },
    {
      dataIndex: 'createTime',
      title: '建单时间',
      isTime: true,
    },
    {
      dataIndex: 'orderTaker',
      title: '接单人',
    },
    {
      dataIndex: 'stateCode',
      title: '订单状态',
      render: (text: string) =>
        ({
          0: '已完成',
          '-1': '已取消',
          '1': '待接单',
          '2': '已提交',
          '3': '进行中',
        }[text]),
    },
    {
      dataIndex: 'upstreamCancelServiceFlag',
      title: '上游取消服务',
      render: (text: string) =>
        ({
          0: '否',
          1: '是',
        }[text]),
    },
    {
      dataIndex: 'serviceStateCode',
      title: '服务单状态',
      render: (text: string) =>
        ({
          '20': '已完成',
          '-5': '已取消',
          '-1': '已终止',
          '5': '待接单',
          '10': '进行中',
        }[text]),
    },
    {
      dataIndex: 'orderingCarStateCode',
      title: '约车状态',
      render: (text: string) =>
        ({
          '0': '待约车',
          '1': '部分完成',
          '2': '已完成',
        }[text]),
    },
    {
      dataIndex: 'receiptStateCode',
      title: '交接状态',
      render: (text: string) =>
        ({
          '0': '待交接',
          '1': '已完成',
        }[text]),
    },
  ],
};

export default () => <QueryTable {...config} />;
```

<!-- 不传递 src 将自动探测当前组件，比如 src/Hello/index.md 将会识别 src/Hello/index.tsx -->

# 实例 可通过 <实例名称 Ref>.current.xxx 调用

### getQueryParams 方法 获取请求参数

### refreshTable 方法 刷新

### setFieldValue 方法 设置值

### getSelectedRows 方法 获取已选中的行的数组

### getSelectedRowKeys 方法 获取已选中的行的 key 数组

### resetForm 方法 初始化

# 属性 API

### 文档这东西 就写得简单点吧 相信大家看字段名也能看懂 当然也是写部分重要的属性

#### [sula](https://docs.sula.vercel.app/docs/introduction) 文档 打不开请学会科学上网

<API></API>
