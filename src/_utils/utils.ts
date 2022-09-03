/* eslint-disable @typescript-eslint/no-loop-func */
// @ts-nocheck
import { message } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import qs from 'qs';
import { history } from 'umi';
import pathToRegexp from 'path-to-regexp';
import memoizeOne from 'memoize-one';
import { createPath } from 'history';
import isEqual from 'lodash/isEqual';
export function handleAccountID() {
  return JSON.parse(localStorage.getItem('userInfo') || '{}')?.accountPersonDetail?.id;
}
const NumberValue = Object.freeze({
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
  ELEVEN: 11,
  TWELVE: 12,
  THIRTEEN: 13,
  FOURTEEN: 14,
  FIFTEEN: 15,
  SIXTEEN: 16,
  SEVENTEEN: 17,
  EIGHTEEN: 18,
  NINETEEN: 19,
  TWENTY: 20,
  TWENTY_ONE: 21,
  TWENTY_TWO: 22,
  TWENTY_THREE: 23,
  TWENTY_FOUR: 24,
});
// 替换title 和ico
export const titleAndIco = () => {
  const link = document.createElement('link');
  link.setAttribute('rel', 'icon');
  link.setAttribute('type', 'image/x-icon');
  if (BUSINESS_TYPE === 'yzjyy') {
    link.setAttribute('href', '/yzjyy.ico');
    const heads = document.getElementsByTagName('head');
    if (heads.length) heads[0].appendChild(link);
    return;
  }
  link.setAttribute('href', '/favicon.ico');
  const heads = document.getElementsByTagName('head');
  if (heads.length) heads[0].appendChild(link);
  // 全渠道
};

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const requiredRules = { required: true };

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 非空校验
const isValidateValue = (value: any) => {
  if (value == null || value === undefined || String(value).trim() === '') {
    return false;
  }
  return true;
};

/**
 * 处理错误请求
 * @param {*} response         返回结果
 * @param {*} needBackError    是否需要将错误回传到页面单独处理
 */
export function handleError(response: object, needBackError?: boolean) {
  // @ts-ignore
  if (!response || response.status !== '0' || response.code !== '000000') {
    if (response && !needBackError) {
      // @ts-ignore
      message.error(response.msg);
    }
    return false;
  }

  return true;
}

// format树结构
function mapTree(treeDataItem: any) {
  const haveChildren = Array.isArray(treeDataItem.children) && treeDataItem.children.length > 0;
  return {
    // 分别将我们查询出来的值做出改变他的key
    title: treeDataItem.title,
    key: `${treeDataItem.id}___${treeDataItem.parentId}`,
    parentId: treeDataItem.parentId,
    data: { ...treeDataItem },
    isLeaf: !haveChildren,
    selectable: treeDataItem.parentId !== '-1',
    // 判断它是否存在子集，若果存在就进行再次进行遍历操作，知道不存在子集便对其他的元素进行操作
    children: haveChildren ? treeDataItem.children.map((i: any) => mapTree(i)) : [],
  };
}

export { mapTree, isValidateValue };

export function download(fileName: string, url: string) {
  const isDownloadUrl = typeof url === 'string' && /^https?/.test(url);
  if (isDownloadUrl) {
    const a = document.createElement('a'); /// 创建a标签
    const e = document.createEvent('MouseEvents'); /// 创建鼠标事件对象
    e.initEvent('click', false, false); /// 初始化事件对象
    a.href = url;
    a.download = fileName; /// 设置下载文件名
    a.setAttribute('style', 'display: none');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

/*
 * 判斷是否全屏
 * [全屏则返回当前调用全屏的元素,不全屏返回false] */
export function isFullscreen() {
  return (
    document.fullscreenElement ||
    document.msFullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    false
  );
}

/*
 * 全屏
 * */
export function fullScreen() {
  const el = document.documentElement;
  const rfs =
    el.requestFullScreen ||
    el.webkitRequestFullScreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen;
  if (typeof rfs != 'undefined' && rfs) {
    rfs.call(el);
  }

  return;
}

/*
 * 關閉全屏
 * */
export function exitScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  if (typeof cfs != 'undefined' && cfs) {
    cfs.call(el);
  }
}

// 多页签开始

export const getPagePrimaryKey = (match, query) => {
  const primaryKeyId = match.params.id || query.id || '';

  if (primaryKeyId) return ` -  ${primaryKeyId}`;

  return '';
};

export const formatter = (data, parentAuthority, parentName) => {
  return data
    .map((item) => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      const result = {
        ...item,
        // name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter((item) => item);
};

export const memoizeOneFormatter = memoizeOne(formatter, isEqual);

const cache = {};
const cacheLimit = 10000;
const cacheCount = 0;

export const getBreadcrumbNameMap = (menuData) => {
  const routerMap = {};

  const flattenMenuData = (data) => {
    data.forEach((menuItem) => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

export const getRouterList = (menuData) => {
  const flattenMenuData = (data) => {
    data.forEach((menuItem) => {
      if (menuItem.name) {
        if (menuItem.parentName) {
          menuItem.locale = `${menuItem.parentName}.${menuItem.name}`;
        } else {
          menuItem.locale = `menu.${menuItem.name}`;
        }
      }

      if (menuItem.children) {
        menuItem.childrenNames = menuItem.children.forEach((d) => {
          if (d.name) {
            d.locale = `menu.${d.name}`;
          }
          if (menuItem.name) {
            d.parentName = `menu.${menuItem.name}`;
          }
        });
        flattenMenuData(menuItem.children);
      }
    });
  };
  flattenMenuData(menuData);
  return menuData;
};

export const ergodicMenuRoutes = (routes) => {
  const codeArray = [];

  function ergodicRoutes(routesParam) {
    routesParam.forEach((element) => {
      // element.code &&
      // 有这个树形会自动关闭
      if (element.hideInMenu) {
        codeArray.push(element);
      }
      if (element.routes) {
        ergodicRoutes(element.routes);
      }
    });
  }

  ergodicRoutes(routes);

  return codeArray;
};

// 多页签结束

export const authFn = (code?: any, getItem?: string) => {
  return JSON.parse(localStorage.getItem(getItem || 'buttonAuth_OMS') || '[]')?.find(
    (d: any) => d.code === code,
  );
};

export function handleUserName() {
  return JSON.parse(localStorage.getItem('userInfo') || '{}')?.personDetailResDto?.employeeName;
}
export function handleUserPhone() {
  const str =
    JSON.parse(localStorage.getItem('userInfo') || '{}')?.personDetailResDto?.person?.phone || '';
  const enStr = str && str.slice(0, 3) + '****' + str.slice(str.length - 4);
  return enStr;
}
export function handleUserTentName() {
  return JSON.parse(localStorage.getItem('userInfo') || '{}')?.personDetailResDto?.username;
}

export function handleUserID() {
  return JSON.parse(localStorage.getItem('userInfo') || '{}')?.personDetailResDto?.username;
}

// 环境处理是否隐藏方法
export const isBusinessFn = (obj: any) => {
  let newObj = obj;
  // @ts-ignore
  const { columns = [], fields = [], actionsRender = [] } = newObj;
  let columnsAll: any = Array.isArray(columns) ? columns : [];
  let fieldsAll: any = Array.isArray(fields) ? fields : [];
  let actionsRenderAll: any = Array.isArray(actionsRender) ? actionsRender : [];

  // 是否开启多业务配置权限
  if (newObj.is_business) {
    // 新增
    // @ts-ignore
    if (newObj[BUSINESS_TYPE]) {
      const {
        columns: businessColumns = [],
        fields: businessFields = [],
        fieldsRight: businessFieldsRight = [],
        actionsRender: businessActionsRender = [],
        excludeColumnsKey = [], // 排除表格的字段key
        excludeFieldsKey = [], // 排除查询条件的的字段key
        excludeBtnKey = [], // 排除操作按钮条件的的字段key
        updateColumnsParams = [], // 要修改的表格字段 名字的 数组  { key: xxx, value: xxx}
        updateActionRenderParams = [], // 要修改的查询的操作按钮字段 名字的 数组  { key: xxx, value: xxx}
        updateFieldsParams = [], // 要修改的查询的字段 名字的 数组  { key: xxx, value: xxx}
        // @ts-ignore
      } = newObj[BUSINESS_TYPE];

      // 新增 删除一步走
      columnsAll =
        _.remove(
          [...businessColumns, ...columnsAll],
          (d: any) => !excludeColumnsKey.includes(d.key || d.dataIndex),
        )?.map((d: any) => {
          const currentValue = updateColumnsParams.find(
            (r: any) => r.updateKey === d.key || d.dataIndex,
          );
          if (!d.update && currentValue) {
            d = {
              ...d,
              ...currentValue,
              update: true,
            };
          }
          return d;
        }) || [];
      // 如果filds 层级比较复杂想要控制 加在哪一个container 分类下可以通过 floor_num
      const floorNumFields = businessFields.filter((d: any) => d.floor_num);
      floorNumFields.reverse();
      const notFloorNumFields = businessFields.filter((d: any) => !d.floor_num);
      floorNumFields.forEach((d: any) => {
        if (fieldsAll[d.floor_num - 1]?.fields && d.push) {
          fieldsAll[d.floor_num - 1].fields = [...fieldsAll[d.floor_num - 1]?.fields, d];
        }
        if (fieldsAll[d.floor_num - 1]?.fields && !d.push) {
          fieldsAll[d.floor_num - 1].fields = [d, ...fieldsAll[d.floor_num - 1]?.fields];
        }
      });
      fieldsAll =
        [
          ...notFloorNumFields,
          ..._.remove([...fieldsAll], (d: any) => !excludeFieldsKey.includes(d.name)),
        ]?.map((d: any) => {
          return deepUpdateFunc(d, updateFieldsParams);
        }) || [];
      actionsRenderAll =
        _.remove(
          [...businessActionsRender, ...actionsRenderAll],
          (d: any) => !excludeBtnKey.includes(d.removeKey),
        )?.map((d: any) => {
          if (d?.props?.children) {
            const currentValue = updateActionRenderParams.find(
              (r: any) => r.updateKey === d.props.children,
            );
            if (!d.update && currentValue) {
              d = {
                ...d,
                ...currentValue,
                update: true,
              };
            }
          }
          return d;
        }) || [];

      newObj = {
        ...newObj,
        // @ts-ignore
        ...newObj[BUSINESS_TYPE],
      };
    }
  }

  return {
    ...newObj,
    columns: columnsAll && columnsAll.length > 0 ? columnsAll : null,
    fields: fieldsAll && fieldsAll.length > 0 ? fieldsAll : null,
    actionsRender: actionsRenderAll && actionsRenderAll.length > 0 ? actionsRenderAll : null,
  };
};

/**
 * 查询参数处理
 * @param params 要应用于查询的参数
 * @returns 返回处理后的查询参数
 */
export const queryParams = (params: object, needObj = false) => {
  // 数组对象处理
  // eslint-disable-next-line no-restricted-syntax
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const element = params[key];
      if (element && key.indexOf('*NotAParam') >= 0) {
        delete params[key];
      } else if (element && key.indexOf('*number*') >= NumberValue.ZERO) {
        const dataParams = key.split('*number*');
        dataParams.forEach((value, index) => {
          params[value] = element[index];
        });
        delete params[key];
      } else if (element && key.indexOf('*address*') >= NumberValue.ZERO) {
        const dataParams = key.split('*address*');
        dataParams.forEach((value, index) => {
          params[value] = element.PCDCode[index];
        });
        delete params[key];
      } else if (element && key.indexOf('*costType*') >= NumberValue.ZERO) {
        const dataParams = key.split('*costType*');
        params[dataParams[NumberValue.ZERO]] = element[1];
        delete params[key];
      } else if (element && key.indexOf('*fullDate*') >= NumberValue.ZERO) {
        const dataParams = key.split('*fullDate*');
        dataParams.forEach((value, index) => {
          if (index == NumberValue.ZERO) {
            params[value] = moment(element[index])
              .millisecond(NumberValue.ZERO)
              .second(NumberValue.ZERO)
              .minute(NumberValue.ZERO)
              .hour(NumberValue.ZERO)
              .format('YYYY-MM-DD HH:mm:ss');
          } else {
            params[value] = moment(element[index])
              .millisecond(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .second(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .minute(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .hour(Number(`${NumberValue.TWO}${NumberValue.THREE}`))
              .format('YYYY-MM-DD HH:mm:ss');
          }
        });
        delete params[key];
      } else if (element && key.indexOf('*fullDate-T*') >= NumberValue.ZERO) {
        const dataParams = key.split('*fullDate-T*');
        dataParams.forEach((value, index) => {
          if (index == NumberValue.ZERO) {
            params[value] = moment(element[index])
              .millisecond(NumberValue.ZERO)
              .second(NumberValue.ZERO)
              .minute(NumberValue.ZERO)
              .hour(NumberValue.ZERO)
              .format('YYYY-MM-DDTHH:mm:ss');
          } else {
            params[value] = moment(element[index])
              .millisecond(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .second(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .minute(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .hour(Number(`${NumberValue.TWO}${NumberValue.THREE}`))
              .format('YYYY-MM-DDTHH:mm:ss');
          }
        });
        delete params[key];
      } else if (element && key.indexOf('*dateYMD*') >= NumberValue.ZERO) {
        const dataParams = key.split('*dateYMD*');
        dataParams.forEach((value, index) => {
          if (index == NumberValue.ZERO) {
            params[value] = moment(element[index]).format('YYYY-MM-DD');
          } else {
            params[value] = moment(element[index]).format('YYYY-MM-DD');
          }
        });
        delete params[key];
      } else if (element && key.indexOf('*') >= NumberValue.ZERO) {
        const dataParams = key.split('*');
        dataParams.forEach((value, index) => {
          params[value] = element[index].format('YYYY-MM-DD HH:mm:ss');
        });
        delete params[key];
      } else if (Array.isArray(element)) {
        params[key] = element.join(',');
      }
    }
  }
  if (needObj) {
    const returnParams = {};
    for (const key in params) {
      if (typeof params[key] !== 'undefined') {
        returnParams[key] = params[key];
      }
    }
    return returnParams;
  }
  return qs.stringify(params);
};

export const handleConvertParams = (
  params: object,
  inputArray?: any,
  timeArray?: any[],
  selectMulArray?: any,
  formatObject?: object,
): object => {
  let ParamsResult = { ...params };

  // 处理空格
  let InputParams = {};
  if (inputArray) {
    InputParams = handleConvertInputParams(ParamsResult, inputArray);
    ParamsResult = {
      ...ParamsResult,
      ...InputParams,
    };

    Object.keys(ParamsResult).forEach((i: any) => {
      if (ParamsResult[i] === '') {
        ParamsResult = _.omit(ParamsResult, [i]); // 去除空字符串 等
      }
    });
  }

  // 处理时间
  let TimeParams = {};
  if (timeArray) {
    TimeParams = handleConvertTimeParams(ParamsResult, timeArray, formatObject);
    ParamsResult = {
      ..._.omit(ParamsResult, timeArray),
      ...TimeParams,
    };
  }

  // 处理多选
  let SelectMulParams = {};
  if (selectMulArray) {
    SelectMulParams = handleConvertSelectMulParams(ParamsResult, selectMulArray);
    ParamsResult = {
      ...ParamsResult,
      ...SelectMulParams,
    };
  }

  // 处理时间
  for (const key in ParamsResult) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const element = ParamsResult[key];
      // 忽略时分秒
      if (element && key.indexOf('*fullDate-D*') >= NumberValue.ZERO) {
        const dataParams = key.split('*fullDate-D*');
        dataParams.forEach((value, index) => {
          if (index == NumberValue.ZERO) {
            ParamsResult[value] = moment(element[index])
              .millisecond(NumberValue.ZERO)
              .second(NumberValue.ZERO)
              .minute(NumberValue.ZERO)
              .hour(NumberValue.ZERO)
              .format('YYYY-MM-DD');
          } else {
            ParamsResult[value] = moment(element[index])
              .millisecond(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .second(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .minute(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .hour(Number(`${NumberValue.TWO}${NumberValue.THREE}`))
              .format('YYYY-MM-DD');
          }
        });
        delete ParamsResult[key];
      } else if (element && key.indexOf('*fullDate*') >= NumberValue.ZERO) {
        const dataParams = key.split('*fullDate*');
        dataParams.forEach((value, index) => {
          if (index == NumberValue.ZERO) {
            ParamsResult[value] = moment(element[index])
              .millisecond(NumberValue.ZERO)
              .second(NumberValue.ZERO)
              .minute(NumberValue.ZERO)
              .hour(NumberValue.ZERO)
              .format('YYYY-MM-DD HH:mm:ss');
          } else {
            ParamsResult[value] = moment(element[index])
              .millisecond(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .second(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .minute(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .hour(Number(`${NumberValue.TWO}${NumberValue.THREE}`))
              .format('YYYY-MM-DD HH:mm:ss');
          }
        });
        delete ParamsResult[key];
      } else if (element && key.indexOf('#treeCategory#') >= NumberValue.ZERO) {
        const treeParams = key.split('#treeCategory#')[1];
        ParamsResult[treeParams] = element.join(',');
        delete ParamsResult[key];
      }
    }
  }

  return ParamsResult;
};

export function formatterTime(value, formatterStr = 'YYYY-MM-DD HH:mm:ss') {
  const str = value?.replace('T', ' ');
  return moment(str).format(formatterStr);
}

export function addHours(value, time = 8, type = 'h') {
  return moment(value).add(time, 8, type);
}

export const judgeIsEmpty = (value: any) => {
  if (value == null || value == undefined || String(value).trim() == '') {
    return true;
  }
  return false;
};

export const getDictionarySource = (dicCode: string, needConvertInterger = false) => {
  let dicData = [];
  const storageDic = localStorage.getItem('dicData')
    ? JSON.parse(localStorage.getItem('dicData'))
    : {};
  dicData = storageDic[dicCode];
  // if (!dicData || !dicData.length) {
  //   throw new Error(`当前没有${dicCode}字典值`);
  // }

  try {
    if (needConvertInterger) {
      dicData = dicData.map((item: { text: string; value: string }) => ({
        ...item,
        value: parseFloat(item.value),
      }));
    }
  } catch (e) {}

  return dicData;
};

export const getDictionaryTextByValue = (dicCode: string, value: string) => {
  let dicData = [];
  const storageDic = localStorage.getItem('dicData')
    ? JSON.parse(localStorage.getItem('dicData' || '[]'))
    : {};
  dicData = storageDic[dicCode];

  if (!dicData || !dicData.length) {
    // throw new Error(`当前没有${dicCode}字典值`);
  }

  if (value === undefined) return '- -';
  // if (value === undefined) return '字典没有值 请查验';

  const dicItemArray = dicData?.filter(
    (item: { value: string }) => item.value === value.toString(),
  );

  if (!dicItemArray?.length) {
    // throw new Error(`当前${dicCode}字典值合没有${value}的数据`)
    return value;
  }

  return dicItemArray[0].text;
};

export function toArray<T>(value?: T | T[] | null): T[] {
  if (value === undefined || value === null) {
    return [];
  }

  // @ts-ignore
  return Array.isArray(value) ? value : [value];
}

//  downfile by Buffer
export const downFileByBuffer = (data: any, name?: any, type?: any) => {
  const blob = new Blob([data], {
    type:
      type ||
      'application/xlsx;charset=utf-8' /* application/xlsx // 这里写要下载的文件格式;charset=utf-8 */,
  });
  // debugger
  const eleLink = document.createElement('a');
  // eleLink.download = '模板.xlsx' // 这里写的是下载文件的名称
  eleLink.download = name || '模板.xlsx'; // 这里是后端返回的文件名称
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  // URL.createObjectURL(blob)会创建URL对象，返回一个下载文件的地址
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 释放URL对象
  URL.revokeObjectURL(eleLink.href);
  // 然后移除
  document.body.removeChild(eleLink);
};

export const arrToMap = (list = [], key, label) => {
  return list.reduce((memo, item) => ((memo[item[key]] = item[label]), memo), {});
};

export function imageBase64ToUrl(urlData, type = 'image/jpeg') {
  try {
    const arr = urlData.split(',');
    const mime = arr[0].match(/:(.*?);/)[1] || type;
    // 去掉url的头，并转化为byte
    const bytes = window.atob(arr[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    const ia = new Uint8Array(ab);

    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return blobToUrl(
      new Blob([ab], {
        type: mime,
      }),
    );
  } catch (e) {
    var ab = new ArrayBuffer(0);
    return blobToUrl(
      new Blob([ab], {
        type: type,
      }),
    );
  }
}

// base64转url
function blobToUrl(blob_data) {
  return URL.createObjectURL(blob_data);
}

// base64 保存图片
function saveBase64Img(imgSrc) {
  const base64 = imgSrc.toString(); // imgSrc 就是base64哈
  const byteCharacters = window.atob(base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {
    type: undefined,
  });
  const aLink = document.createElement('a');
  aLink.download = '图片名称.jpg'; //这里写保存时的图片名称
  aLink.href = URL.createObjectURL(blob);
  aLink.click();
}

// base64图片下载
export function getBase64Img(data, type = 'image/jpg') {
  const blob = new Blob([data], { type }); //类型一定要写！！！
  // return new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(blob);
  //   reader.onload = () => resolve(reader.result);
  //   reader.onerror = (error) => reject(error);
  // });
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = () => saveBase64Img(reader.result);
}

export const onLoginOut = (redirect?: string) => {
  if (history.location.pathname !== '/user/login') {
    localStorage.removeItem('userInfo');
    const finalRedirect = redirect ? redirect : createPath(history.location);
    if (window.__POWERED_BY_QIANKUN__) {
      window._parentProps?.onLoginOut(finalRedirect);
    } else {
      // @ts-ignore
      if (BUILD_TYPE) {
        history.replace({
          pathname: '/user/login',
          search: qs.stringify({ redirect: finalRedirect }),
        });
      } else {
        window.location.href = '/#/user/login?' + qs.stringify({ redirect: finalRedirect });
      }
    }
  }
};

/**时间格式化 */
export const timeFormat = (
  timeStr: any,
  format: string,
  notNeedConvertTimeZone: boolean = true,
) => {
  if (!timeStr) return '';
  if (notNeedConvertTimeZone) {
    return moment(timeStr).format(format);
  }
  return moment(timeStr).add(8, 'hours').format(format);
};

/* 导出方法 */
export const exportMethod = (res: any) => {
  if ((res instanceof Object && !res.data) || JSON.stringify(res) == '{}') {
    history.push('/report-data-management/report-data-download');
  } else {
    const url = res.data || res;
    downFile(url);
  }
};
export type RouteComponentProps<ParamsType = {}, QueryType = {}> = {
  match: {
    isExact: boolean;
    params: ParamsType;
    path: string;
    url: string;
  };
  location: {
    pathname: string;
    hash: string;
    search: string;
    query: QueryType;
    params: ParamsType;
  };
  query: QueryType;
  getDictionaryTextByValue: (dicCode: string, value: any) => string;
  getDictionarySource: (dicCode: string, needConvertInterger?: boolean) => any[];
  timeFormat: (timeStr: any, format: string, notNeedConvertTimeZone?: boolean) => string;
};

export const downFile = (content: any, filename?: string, target?: string) => {
  console.log(content);
  try {
    // 创建隐藏的可下载链接
    const eleLink = document.createElement('a');
    if (filename) {
      eleLink.download = filename;
    }
    if (target) eleLink.target = target;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    // var blob = new Blob([content]);
    // var blob =content;
    // eleLink.href = URL.createObjectURL(blob);
    eleLink.href = content.replace('http:', 'https:');
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  } catch (e) {}
};

export const setServiceFieldDisabled = (ctx: any, serviceType: string, serviceStatus: any) => {
  if (ctx.mode == 'editCopy') return false;
  const fieldsValue = ctx.form.getFieldsValue(true);
  if (
    fieldsValue &&
    (fieldsValue[serviceType] ||
      (!judgeIsEmpty(fieldsValue[serviceStatus]) &&
        fieldsValue[serviceStatus] !== 0 &&
        fieldsValue[serviceStatus] !== 1))
  )
    return true;
  return ctx.disabled;
};

/**数组对象去重 */
export const duplicateRemoval = (arr: any[] = []) => {
  const obj = {};
  return arr.reduce((cur, next) => {
    obj[next.value] ? '' : (obj[next.value] = true && cur.push(next));
    return cur;
  }, []);
};

/**传入日期，获取当前日期的星期, 默认当前时间的星期 */
export function getWeek(value: string = '', needDefaultValue: boolean = true) {
  const weekList = ['日', '一', '二', '三', '四', '五', '六'];
  const weekName = value
    ? weekList[new Date(value).getDay()]
    : needDefaultValue
    ? weekList[new Date().getDay()]
    : '';
  return weekName ? '星期' + weekName : '';
}

/**给定一个当前日期前后时间范围数，获取前后时间之间的所有日期, 一个参数的时候 */
export const getRangeDayByRangeOneValue = (rangeValue: number, day?: string) => {
  const date: string[] = new Array(rangeValue * 2).fill('');
  const orgValue = rangeValue;
  while (rangeValue >= 0) {
    date[orgValue - rangeValue] = moment(day).subtract(rangeValue, 'days').format('YYYY-MM-DD');
    date[orgValue + rangeValue] = moment(day).add(rangeValue, 'days').format('YYYY-MM-DD');
    rangeValue--;
  }
  return date;
};

export const goLoginPage = (redirect?: string) => {
  // if (BUILD_TYPE) {
  //   history.replace({
  //     pathname: '/user/login',
  //   });
  // } else {
  //   window.location.href = '/#/user/login';
  // }
  if (history.location.pathname !== '/user/login') {
    localStorage.removeItem('userInfo');
    const finalRedirect = redirect ? redirect : createPath(history.location);
    if (window.__POWERED_BY_QIANKUN__) {
      window._parentProps?.onLoginOut(finalRedirect);
    } else {
      // @ts-ignore
      if (BUILD_TYPE) {
        history.replace({
          pathname: '/user/login',
          search: qs.stringify({ redirect: finalRedirect }),
        });
      } else {
        window.location.href = '/#/user/login?' + qs.stringify({ redirect: finalRedirect });
      }
    }
  }
};

export function handleRequestHeader(options?: any) {
  const resposne = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const personInfo = resposne?.personDetailResDto || {};
  const handleOptions = {
    ...options,
    headers: {
      ...options?.headers,
      // appId: 1,
      'x-tenant-id': personInfo?.tenantId || '1',
      'x-sso-sessionid': resposne?.sessionId || '',
    },
  };
  if (localStorage.getItem('x-user-auth-context')) {
    handleOptions.headers['x-user-auth-context'] = localStorage.getItem('x-user-auth-context');
  }
  const filterMap = {
    base: [
      'bankAccount',
      'bscArea',
      'bscEndangeredSpecies',
      'bscPackingMaterial',
      'bscWarehouseCode',
      'bscdict',
      'bscdictitem',
      'bscsensitiveword',
      'document',
      'documentCustomer',
      'hsCode',
      'hsCodeHistory',
      'hsCodeVersion',
    ],
  };
  if (
    options?.url?.includes('/api/base') &&
    filterMap.base.some((item: string) =>
      options?.url?.toLowerCase()?.includes('/api/base' + '/' + item.toLowerCase()),
    )
  ) {
    delete handleOptions.headers['x-tenant-id'];
  }
  return handleOptions;
}
