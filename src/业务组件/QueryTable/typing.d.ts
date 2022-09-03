/*
 * @Date: 2022-09-03 20:00:40
 * @LastEditors: 追随
 * @LastEditTime: 2022-09-03 20:14:49
 */
import React from 'react';
export interface IColumns {
  title: string | '序号';
  type: 'time' | 'ell';
  render: (text: string | object, row: object, index: number) => React.ElementType;
}

export interface BtnItemProps {
  children: string;
  type: string;
  buttonType?: string;
  menuData?: any[];
  onClick?: (param?: any) => void;
  [key: string]: any;
}
