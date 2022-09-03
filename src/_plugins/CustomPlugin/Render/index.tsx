/*
 * @Description:
 * @Author: minghuiXiao
 * @Date: 2021-06-27 15:58:26
 * @LastEditTime: 2022-09-03 18:29:23
 * @LastEditors: 追随
 */
import { registerRenderPlugin } from 'sula';
import { Space, Switch } from 'antd';
import React from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import bsFormContainer from './bs-formContainer';
import moment from 'moment';
/** render插件 */

// 注册方式一
/* ***************************** 选中提示及清除 ************************************************* */
registerRenderPlugin('bs-selectButton')(({ ctx }: any) => {
  const selectedRows = ctx.table.getSelectedRows() || [];
  return (
    <div className="sula-table-row-selects">
      <span>已选 {selectedRows.length} 项,&nbsp;</span>
      <span onClick={() => ctx.table.clearRowSelection()} className="customAdomStyle">
        清除
      </span>
    </div>
  );
}, true);

registerRenderPlugin('bs-orderTransfer')(({ ctx }: any) => {
  return (
    <Space>
      <span style={{ display: 'flex', justifyItems: 'center' }}>
        传送
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />}></Switch>
      </span>
      <span style={{ display: 'flex', justifyItems: 'center' }}>
        传送JDE
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />}></Switch>
      </span>
    </Space>
  );
}, true);

registerRenderPlugin('bs-formContainer')(bsFormContainer, true);
registerRenderPlugin('bs-formatTime')(({ ctx }: any) => {
  const { text } = ctx;
  return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '';
}, true);

// 注册方式二
/* ***************************** 上传文件按钮 ************************************** */

registerRenderPlugin('bs-rowContianer')((config: any) => {
  const { children, style, ...props } = config;
  const divStyle = {
    top: '5px',
    left: `calc(9.99% - 75px)`,
    fontWeight: 'bold',
    ...(config.titleStyle || {}),
  };
  return (
    <div style={Object.assign({}, { position: 'relative' }, style)}>
      <div style={{ position: 'absolute', ...divStyle }}>{props.title}</div>
      {children}
    </div>
  );
}, true);

/** render插件 */
registerRenderPlugin('tableRowSelect')(({ ctx, config }) => {
  const selectedRows = ctx.table.getSelectedRows() || [];

  return (
    <div
      className={
        !config?.props?.noRowSelect ? 'sula-table-row-selects' : 'sula-table-row-selects-noaction'
      }
    >
      <span>已选 {selectedRows.length} 项</span>
      {/* <span>总数量：120件</span>
      <span>总重量：800kg </span>
      <span>总体积: 120m<sup>3</sup></span>
      <span onClick={() => ctx.table.clearRowSelection()}><a href="#">清除</a></span> */}
    </div>
  );
}, true);
