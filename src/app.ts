/*
 * @Date: 2022-09-02 18:22:43
 * @LastEditors: 追随
 * @LastEditTime: 2022-09-05 09:40:05
 */

export { requestConfig as request } from './_utils';
import {
  registerFieldPlugins as slRegisterFieldPlugins,
  registerRenderPlugins as slRegisterRenderPlugins,
  registerActionPlugins as slRegisterActionPlugins,
  registerFilterPlugins as slRegisterFilterPlugins,
  Icon as slIcon,
} from 'sula';
import { UserOutlined } from '@ant-design/icons';
// 注册插件
slRegisterFieldPlugins();
slRegisterRenderPlugins();
slRegisterActionPlugins();
slRegisterFilterPlugins();
// 注册icon
slIcon.iconRegister({
  user: UserOutlined,
});
import '@/_plugins';
