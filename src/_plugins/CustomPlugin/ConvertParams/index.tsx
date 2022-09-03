import { isValidateValue } from '@/_utils/utils';
import sula from 'sula/es/core';
import moment from 'moment';

// tableConvertParamsType
// sula.convertParamsType('tableConvertParamsType', (ctx: any, config: any) => {
//   const initialParams = config.initialParams || {};
//   //  initial   为了初始化的时候处理
//   const initialValues = config.initialValues || {};
//   const initial = config.initial || {};
//   const params = { ...ctx.params.filters };
//   // 数组对象处理,对带有特殊标记的name进行处理
//   for (const key in params) {
//     if (Object.prototype.hasOwnProperty.call(params, key)) {
//       const element = params[key];
//       if (element && key.indexOf('*number*') >= 0) {
//         const dataParams = key.split('*number*');
//         dataParams.forEach((value, index) => {
//           params[value] = element[index];
//         });
//         delete params[key];
//       } else if (element && key.indexOf('*address*') >= 0) {
//         const dataParams = key.split('*address*');
//         dataParams.forEach((value, index) => {
//           params[value] = element.PCDCode[index];
//         });
//         delete params[key];
//       } else if (element && key.indexOf('*costType*') >= 0) {
//         const dataParams = key.split('*costType*');
//         // eslint-disable-next-line prefer-destructuring
//         params[dataParams[0]] = element[1];
//         delete params[key];
//       } else if (element && key.indexOf('*fullDate*') >= 0) {
//         const dataParams = key.split('*fullDate*');
//         dataParams.forEach((value, index) => {
//           if (index === 0) {
//             params[value] = moment(element[index])
//               .millisecond(0)
//               .second(0)
//               .minute(0)
//               .hour(0)
//               .format('YYYY-MM-DD HH:mm:ss');
//           } else {
//             params[value] = moment(element[index])
//               .millisecond(59)
//               .second(59)
//               .minute(59)
//               .hour(23)
//               .format('YYYY-MM-DD HH:mm:ss');
//           }
//         });
//         delete params[key];
//       } else if (element && key.indexOf('*date*') >= 0) {
//         const dataParams = key.split('*date*');
//         dataParams.forEach((value, index) => {
//           if (index === 0) {
//             params[value] = moment(element[index]).format('YYYY-MM-DD');
//           } else {
//             params[value] = moment(element[index]).format('YYYY-MM-DD');
//           }
//         });
//         delete params[key];
//       } else if (element && key.indexOf('*size*') >= 0) {
//         const dataParams = key.split('*size*')[0];
//         params[dataParams] = typeof element === 'string' ? element.toUpperCase() : element;
//         delete params[key];
//       } else if (element && key.indexOf('*n*') >= 0) {
//         // \n 切割符
//         const [activeKey] = key.split('*n*');
//         params[activeKey] = element.replace(/\n/g, ',');
//         delete params[key];
//       } else if (element && key.indexOf('*') >= 0) {
//         const dataParams = key.split('*');
//         dataParams.forEach((value, index) => {
//           params[value] = element[index].format('YYYY-MM-DD HH:mm:ss');
//         });
//         delete params[key];
//       } else if (Array.isArray(element)) {
//         params[key] = element.join(',');
//       }
//     }
//   }

//   let finalParams = {};

//   if (JSON.stringify(params) === '{}') {
//     finalParams = { ...finalParams, ...initial };
//   }

//   for (const key in params) {
//     if (initial.hasOwnProperty(key)) {
//       // @ts-ignore
//       finalParams[key] = params[key] ? params[key] : initial[key];
//       if (params[key] === null || !params[key]) {
//         // @ts-ignore
//         finalParams[key] = null;
//       }
//     } else if (isValidateValue(params[key])) {
//       // @ts-ignore
//       finalParams[key] = params[key];
//     }
//   }

//   // 排序动作触发
//   let sorter;
//   if (Object.keys(ctx.params.sorter).length) {
//     if (ctx.params.sorter.order === 'ascend') {
//       sorter = `asc-${ctx.params.sorter.columnKey}`;
//     } else if (ctx.params.sorter.order === 'descend') {
//       sorter = `desc-${ctx.params.sorter.columnKey}`;
//     }
//   }

//   return {
//     ...initialParams,
//     ...initialValues,
//     pageSize: ctx.params.pageSize,
//     currentPage: ctx.params.current,
//     ...finalParams,
//     sorter,
//   };
// });
