/*
 * @Date: 2022-09-02 18:36:54
 * @LastEditors: 追随
 * @LastEditTime: 2022-09-03 16:21:21
 */
import { createPath } from 'history';
import qs from 'qs';
import { notification } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { history } from 'umi';

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

// 请求配置
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = _.debounce((error: any) => {
  const { response } = error;
  if (response && response.status) {
    // @ts-ignore
    const errorText = codeMessage[String(response.status)] || response.statusText;
    const { status, url } = response;

    if (response.status === 401) {
      notification.open({
        message: '提示：登陆已失效',
        description: '系统将在6秒之后退出登录,您也可以手动点右上角关闭提示并退出。',
        duration: 6,
        onClose: async () => {
          localStorage.removeItem('userInfo');
          localStorage.removeItem('buttonAuth_OMS');
          onLoginOut();
        },
      });
    } else {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    }
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
});

const requestInterceptors = [
  (url: string, options: any) => {
    const handleOptions = handleRequestHeader(options);
    return {
      url,
      options: handleOptions,
    };
  },
];

// 响应拦截 异步函数
const responseInterceptors: any = [
  async (response: any) => {
    try {
      // clone进行拷贝一层
      const res = await response.clone().json?.();
      const { code } = res;
      return { ...res, success: code === '000000' };
    } catch (error) {
      // 这一部分针对的是数据流
      return response;
    }
  },
];

export const onLoginOut = (redirect?: string) => {
  if (history.location.pathname !== '/user/login') {
    localStorage.removeItem('userInfo');
    const finalRedirect = redirect ? redirect : createPath(history.location);
    // @ts-ignore
    if (window?.__POWERED_BY_QIANKUN__) {
      // @ts-ignore
      window?._parentProps?.onLoginOut(finalRedirect);
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

export const requestConfig: any = {
  errorHandler,
  requestInterceptors,
  responseInterceptors,
  errorConfig: {
    adaptor: (resData: any) => {
      return {
        ...resData,
        errorMessage: resData.msg || resData.message,
        response: resData,
        success: true,
      };
    },
  },
};

export const convertParamsTable = (params: any) => {
  const tempParams = { ...params };
  for (const key in tempParams) {
    if (Object.prototype.hasOwnProperty.call(tempParams, key)) {
      let element = tempParams[key];
      if (element && key.indexOf('#createTime#') >= 0) {
        tempParams['year'] = moment(element).get('year').toString();
        tempParams['month'] = (moment(element).get('month') + 1).toString();
        delete tempParams[key];
      } else if (element && key.indexOf('#treeCategory#') >= 0) {
        const treeParams = key.split('#treeCategory#')[1];
        tempParams[treeParams] = element.join(',');
        delete tempParams[key];
      }
    }
  }
  return tempParams;
};

export const handleConvertParams = (params: object): object => {
  let ParamsResult: object = { ...params };

  // 处理时间
  for (const key in ParamsResult) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      // @ts-ignore
      const element = ParamsResult[key];
      if (element && key.indexOf('*fullDate*') >= NumberValue.ZERO) {
        const dataParams = key.split('*fullDate*');
        dataParams.forEach((value, index) => {
          if (index == NumberValue.ZERO) {
            // @ts-ignore
            ParamsResult[value] = moment(element[index])
              .millisecond(NumberValue.ZERO)
              .second(NumberValue.ZERO)
              .minute(NumberValue.ZERO)
              .hour(NumberValue.ZERO)
              .format('YYYY-MM-DD HH:mm:ss');
          } else {
            // @ts-ignore
            ParamsResult[value] = moment(element[index])
              .millisecond(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .second(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .minute(Number(`${NumberValue.FIVE}${NumberValue.NINE}`))
              .hour(Number(`${NumberValue.TWO}${NumberValue.THREE}`))
              .format('YYYY-MM-DD HH:mm:ss');
          }
        });
        // @ts-ignore
        delete ParamsResult[key];
      } else if (element && key.indexOf('#treeCategory#') >= NumberValue.ZERO) {
        const treeParams = key.split('#treeCategory#')[1];
        // @ts-ignore
        ParamsResult[treeParams] = element.join(',');
        // @ts-ignore
        delete ParamsResult[key];
      }
    }
  }

  return ParamsResult;
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
