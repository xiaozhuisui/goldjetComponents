/*
 * @Date: 2022-09-01 18:21:54
 * @LastEditors: 追随
 * @LastEditTime: 2022-09-03 19:51:12
 */
import { defineConfig } from 'dumi';

function slash(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);
  const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex

  if (isExtendedLengthPath || hasNonAscii) {
    return path;
  }

  return path.replace(/\\/g, '/');
}
export default defineConfig({
  title: '高捷集团',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  base: '/goldjetComponents',
  publicPath: '/goldjetComponents/',
  exportStatic: {},
  theme: {
    'primary-color': '#E82D1E',
  },
  mfsu: {
    development: {
      output: './.mfsu-dev',
    },
    // production: {
    //   output: '.mfsu-prod'
    // }
  },
  lessLoader: {},
  cssLoader: {
    modules: {
      // CSS Modules 模式 定义前缀作用域
      getLocalIdent: (context: any, localIdentName: any, localName: any) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }
        const match = context.resourcePath.match(/src(.*)/);
        if (match && match[1]) {
          const antdProPath = match[1].replace('.less', '');
          const arr = slash(antdProPath)
            .split('/')
            .map((a) => a.replace(/([A-Z])/g, '-$1'))
            .map((a) => a.toLowerCase());
          return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }
        return localName;
      },
    },
  },
  // locale: {
  //   // default zh-CN
  //   default: 'zh-CN',
  //   antd: true,
  //   // default true, when it is true, will use `navigator.language` overwrite default
  //   baseNavigator: true,
  // },
  sula: { locale: { default: 'zh-CN' } },
});
