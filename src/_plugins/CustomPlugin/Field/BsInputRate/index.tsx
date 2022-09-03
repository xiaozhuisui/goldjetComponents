/*
 * @Author: your name
 * @Date: 2021-09-06 09:03:30
 * @LastEditTime: 2021-09-27 20:45:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oms-ops-front\src\plugins\CustomPlugin\Field\BsNumberRange\index.tsx
 */
// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Input, Radio } from 'antd';
import styles from './index.less';

const BsNumberRange = (props: any) => {
  const { onChange, placeholder, ctx, disabled, value = {} }: any = props;

  const [value1, setValue1] = useState({});
  useEffect(() => {
    if (JSON.stringify(value1) !== JSON.stringify(value)) {
      setValue1({
        ...value,
        value: value.value || 0,
      });
    }
  }, [value]);

  const onChange1 = ({ target: value }) => {
    setValue1({
      ...value1,
      text: value.value,
    });
    onChange({
      ...value1,
      text: value.value,
    });
  };
  const onChange2 = ({ target: value }: any) => {
    setValue1({
      ...value1,
      value: value.value,
    });
    onChange({
      ...value1,
      value: value.value,
    });
  };

  return (
    <div className={styles.number_range}>
      <Input
        value={value1.text}
        disabled={ctx.mode === 'view' || disabled}
        onChange={onChange1}
        placeholder={placeholder}
      />
      <Radio.Group
        disabled={ctx.mode === 'view' || disabled}
        className={styles.rageWarp}
        value={value1.value}
        onChange={onChange2}
      >
        <Radio value={0}>无</Radio>
        <Radio value={1}>
          <img src="/oms/redRate.png"></img>
        </Radio>
        <Radio value={2}>
          <img src="/oms/yellowRate.png"></img>
        </Radio>
        <Radio value={3}>
          <img src="/oms/qingRate.png"></img>
        </Radio>
        <Radio value={4}>
          <img src="/oms/blueRate.png"></img>
        </Radio>

        <Radio value={5}>
          <img src="/oms/ziRate.png"></img>
        </Radio>
      </Radio.Group>
    </div>
  );
};

export default BsNumberRange;
