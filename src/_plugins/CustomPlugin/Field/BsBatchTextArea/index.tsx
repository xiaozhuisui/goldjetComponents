/*
 * @Date: 2022-06-02 13:57:44
 * @LastEditors: 追随
 * @LastEditTime: 2022-06-07 10:30:11
 */
import React from 'react';
import { Input } from 'antd';
export default function index(props: any) {
  const { placeholder } = props;
  return (
    <Input.TextArea
      onChange={(e) => {
        props.ctx.form.setFieldValue(
          props.ctx.name,
          e.target.value
            .split('\n')
            .filter((item) => item)
            .join(',')
            .replaceAll(' ', ''),
        );
      }}
      autoSize={{ minRows: 1, maxRows: 3 }}
      placeholder={placeholder}
    />
  );
}
