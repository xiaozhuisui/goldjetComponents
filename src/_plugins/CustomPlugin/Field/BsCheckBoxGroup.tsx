/*
 * @Description:
 * @Author: rodchen
 * @Date: 2021-01-06 21:54:45
 * @LastEditTime: 2021-01-20 18:00:20
 * @LastEditors: rodchen
 */
// @ts-nocheck

import React, { useEffect } from 'react';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

const BsCheckBoxgroup = (props: any) => {
  const { source = [], onChange, value, ctx, disabled, hiddenAll, caution } = props;

  const plainOptions = source.map((item: { text: string; value: any }) => {
    return {
      ...item,
      label: item.text,
    };
  });
  const [checkedList, setCheckedList] = React.useState(value ? value.split(',') : []);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  useEffect(() => {
    let valueList = value ? value.split(',') : [];
    if (valueList.length > 0) {
      valueList = [...new Set(valueList)];
    }
    if (JSON.stringify(checkedList) !== JSON.stringify(valueList)) {
      setCheckedList(valueList);
    }
    setCheckAll(valueList.length === plainOptions.length);
    setIndeterminate(!!valueList.length && valueList.length < plainOptions.length);
    setHidden(hiddenAll);
  }, [source, value]);

  const onChangeInner = (list: []) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
    onChange(list.length ? list.join(',') : undefined);
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(
      e.target.checked
        ? plainOptions.map((item: any) => item.value)
        : plainOptions.filter((item: any) => item.disabled).map((item: any) => item.value),
    );
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    onChange(
      e.target.checked
        ? plainOptions.map((item: any) => item.value).join()
        : plainOptions
            .filter((item: any) => item.disabled)
            .map((item: any) => item.value)
            .join(),
    );
  };
  return (
    <>
      {!hidden ? (
        <Checkbox
          disabled={ctx.mode === 'view' || disabled}
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          全部
        </Checkbox>
      ) : (
        ''
      )}
      <CheckboxGroup
        disabled={ctx.mode === 'view' || disabled}
        options={plainOptions}
        value={checkedList}
        onChange={onChangeInner}
      >
        {plainOptions.map((item) => (
          <Checkbox disabled={item.disabled} key={item.value} value={item.value}>
            {item.text}
          </Checkbox>
        ))}
      </CheckboxGroup>
      <span style={{ color: 'red', fontWeight: 600 }}>{caution}</span>
    </>
  );
};

export default BsCheckBoxgroup;
