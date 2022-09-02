/*
 * @Date: 2022-09-02 16:08:59
 * @LastEditors: 追随
 * @LastEditTime: 2022-09-02 16:51:41
 */
import React from 'react';
import { Tabs } from 'antd';
export default function Index() {
  return (
    <Tabs>
      <Tabs.TabPane tab="title1"></Tabs.TabPane>
      <Tabs.TabPane tab="title2"></Tabs.TabPane>
    </Tabs>
  );
}
