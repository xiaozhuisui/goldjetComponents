/*
 * @Date: 2022-09-03 16:48:46
 * @LastEditors: 追随
 * @LastEditTime: 2022-09-03 16:53:23
 */
/*
 * @Author: your name
 * @Date: 2021-09-06 09:03:30
 * @LastEditTime: 2022-06-28 11:19:15
 * @LastEditors: 追随
 * @Description: In User Settings Edit
 * @FilePath: \oms-ops-front\src\plugins\CustomPlugin\Converter\index.tsx
 */
// @ts-ignore
import sula from 'sula/es/core';

// 分页
sula.converterType('tableConverterType', (ctx: any) => {
  const { data } = ctx;
  // 处理错误
  const res = data.items || data.list;
  return {
    list:
      (res.length &&
        res.map((item: any, index: number) => {
          return {
            ...item,
            keyIndex: `${index + 1}`,
          };
        })) ||
      [],
    total: (data.total && Number(data.total)) || (data.totalCount && Number(data.totalCount)) || 0,
    // total: data.total || data.totalCount,
  };
});

// 不分页
sula.converterType('tableConvertNoPage', (ctx: any) => {
  return ctx?.data || [];
});

sula.converterType('remoteSource', (ctx: any, config: any) => {
  const { textKey = 'text', valueKey = 'name' } = config;
  return ctx?.data.map((item: any) => ({ text: item[textKey], value: item[valueKey] } || []));
});
