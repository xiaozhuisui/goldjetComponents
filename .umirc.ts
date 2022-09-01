/*
 * @Date: 2022-09-01 18:21:54
 * @LastEditors: 追随
 * @LastEditTime: 2022-09-01 18:42:44
 */
import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'goldjetComponents',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  base: '/goldjetComponents',
  publicPath: '/goldjetComponents/',
  exportStatic: {},
  // more config: https://d.umijs.org/config
});
