/*
 * @Date: 2022-09-02 18:22:43
 * @LastEditors: 追随
 * @LastEditTime: 2022-09-03 18:27:12
 */

export { requestConfig as request } from './_utils';
import {
  registerFieldPlugins,
  registerRenderPlugins,
  registerActionPlugins,
  registerFilterPlugins,
  Icon,
} from 'sula';
import { UserOutlined } from '@ant-design/icons';
// 注册插件
registerFieldPlugins();
registerRenderPlugins();
registerActionPlugins();
registerFilterPlugins();
// 注册icon
Icon.iconRegister({
  user: UserOutlined,
});
import '@/_plugins';
