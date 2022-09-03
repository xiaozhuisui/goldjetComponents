/*
 * @Author: your name
 * @Date: 2021-09-02 17:15:38
 * @LastEditTime: 2022-09-03 17:03:19
 * @LastEditors: 追随
 * @Description: In User Settings Edit
 * @FilePath: \operation-management-frontend\src\plugins\request.js
 */
import { request } from 'sula';
import { handleRequestHeader } from '@/_utils/utils';
import { notification } from 'antd';
import moment from 'moment';
import { onLoginOut } from '@/_utils/utils';

request.use({
  // 执行顺序在发出请求前
  // 是所有请求发出前的钩子中最后执行的。
  bizRequestAdapter(requestConfig) {
    // 处理moment 对象转换时区的问题
    for (const k in requestConfig.data) {
      if (requestConfig.data[k] && requestConfig.data[k]._isAMomentObject) {
        requestConfig.data[k] = moment(requestConfig.data[k]).add(8, 'hours').local().toISOString();
      }
    }
    const handleOptions = handleRequestHeader(requestConfig);
    return handleOptions;
  },
  // 网络错误/404/服务器错误等信息提示转换
  errorMessageAdapter: (error) => {
    const errorMessage = error?.response?.data?.message || error?.response?.data?.msg;
    const errorStatus = error?.request?.status;
    // Object.keys(error).forEach((ites) => {
    //   console.log(ites, error[ites])
    // })
    return {
      message: errorMessage,
      code: 200,
      success: errorStatus,
    };
  },
  // errorMessageAdapter: 转换后的数据会传入 bizErrorMessageAdapter
  // 用户级错误信息转换
  bizErrorMessageAdapter(response) {
    const { msg, message, status } = response;
    let code = response.code;

    if (response && response.success === 401) {
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
    }

    if (status !== '0' && code !== '000000') {
      return msg || message;
    }
  },
  bizSuccessMessageAdapter(response, successMessage) {
    const { success, code, message, msg, status } = response;
    // 禁止显示
    if (successMessage === false) {
      return null;
    }

    if (success !== false) {
      // 默认使用后端返回
      if (successMessage === true) {
        return message || msg;
        // @ts-ignore
      }
      if (status === '0' || code === '000000') {
        return successMessage;
      }
    }

    return null;
  },
});
