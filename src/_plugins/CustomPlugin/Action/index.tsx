/*
 * @Author: your name
 * @Date: 2021-09-06 09:03:30
 * @LastEditTime: 2022-09-03 18:31:03
 * @LastEditors: 追随
 * @Description: In User Settings Edit
 * @FilePath: \oms-ops-front\src\plugins\CustomPlugin\Action\index.tsx
 */
import { registerActionPlugin, request } from 'sula';
import React from 'react';
import { omit } from 'lodash';
import moment from 'moment';
const parseTime = (timeStr, format, notNeedConvertTimeZone: boolean) => {
  if (!timeStr) return '';

  if (notNeedConvertTimeZone) {
    return moment(timeStr).format(format);
  }

  return moment(timeStr).add(8, 'hours').format(format);
};
registerActionPlugin('goBack', (ctx: any) => {
  ctx.history.goBack();
});

registerActionPlugin('bs-delete', async (ctx: any, config: any) => {
  // 此处用到的 async, 非必要情况可以不用
  // config 是自定义的配置项
  const {
    requestCfg: { url, method },
  } = config;
  // ctx 是实例对象
  const {
    table: { getSelectedRowKeys },
  } = ctx;
  const querys = getSelectedRowKeys().join(',');
  await request({
    url: url + querys,
    method,
    successMessage: '删除成功',
  });
});

registerActionPlugin('bs-sulaForm-modelForm', (ctx, config) => {
  const { confirm } = Modal;

  confirm({
    title: config.title,
    // icon: <ExclamationCircleOutlined />,
    content: getContent(ctx, config),
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    width: 600,
    onOk() {},
    onCancel() {
      console.log('Cancel');
    },
  });
});

const getContent = (ctx, config) => {
  if (config.searchIdKey) {
    config.requestCfg.url = config.requestCfg.url + ctx.record[config.searchIdKey];
  }
  const tableConfig = {
    remoteDataSource: {
      ...config.requestCfg,
      convertParams: ({ params }) => {
        if (config.noParams) {
          return {};
        } else {
          return omit(params, 'sorter');
        }
      },
      converter: ({ data }) => {
        let parseData = {};
        let finalData = [];
        if (Array.isArray(data)) {
          finalData = data;
        } else {
          finalData = data.list;
        }
        config.columns.forEach((item) => {
          if (item.parseTime) {
            finalData = finalData.map((operateData) => {
              return {
                ...operateData,
                [item.key]: parseTime(operateData[item.key], 'YYYY-MM-DD', true),
              };
            });
          }
        });
        parseData = {
          list: finalData,
          total: parseInt(finalData.length),
        };
        return parseData;
      },
    },
    columns: config.columns,
  };

  return <Table {...tableConfig} />;
};
