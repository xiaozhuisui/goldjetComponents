// @ts-nocheck

import React from 'react';
import { Cascader } from 'antd';
import type { CascaderProps as ACascaderProps } from 'antd/lib/cascader';
import { request } from 'sula';
import { handleBaseUrlPre } from '@/_utils/utils';

export type CascaderSourceItem = {
  text: any;
  value: any;
};

export interface CascaderSource {
  text: any;
  value: any;
  children: CascaderSourceItem[];
}

export interface CascaderProps extends ACascaderProps {
  source: CascaderSource[];
}

const BsCascader = ({
  source,
  onChange,
  value,
  disabled,
  needNameAndCode,
  requiredLength,
  url,
  placeholder,
  id,
}: {
  source: any;
  onChange: Function;
}) => {
  if (!source) return null;
  source = source?.map((item) => ({ ...item, label: item.text, isLeaf: false }));
  const [options, setOptions] = React.useState(source);
  if (options && source && options.length != source.length) {
    setOptions(source);
  }

  const onChangeInner = (value: string, selectedOptions: any[]) => {
    // if (requiredLength && value.length > requiredLength) return;
    if (needNameAndCode) {
      onChange({
        PCDName: selectedOptions.map((item) => item.text),
        PCDCode: selectedOptions.map((item) => item.value),
      });
    } else {
      onChange(selectedOptions.map((item) => item.text));
    }
  };

  const loadData = (selectedOptions) => {
    if (requiredLength && selectedOptions.length === requiredLength) {
      return;
    }
    const targetOption = selectedOptions[selectedOptions.length - 1];

    targetOption.loading = true;
    request({
      url: `${url}?qp-pid-eq=${targetOption[id]}&qp-level-eq=${targetOption.level + 1}`,
      method: 'get',
      converter: ({ data }) => {
        const initialVal =
          data && Array.isArray(data)
            ? data?.map((item) => {
                return {
                  text: item.name,
                  value: item.code,
                  level: item.level,
                  id: item.id,
                  label: item.name,
                  isLeaf: item.level >= requiredLength,
                };
              })
            : [];
        return initialVal;
      },
    }).then((res) => {
      targetOption.loading = false;
      if (res.length) {
        targetOption.children = res;
      } else {
        targetOption.children = undefined;
      }
      setOptions([...options]);
    });
  };

  const filter = (inputValue, path) => {
    return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };

  let CascaderVal = value;
  if (needNameAndCode) {
    CascaderVal = value ? value.PCDName : value;
  }

  const showSearch = !!(options.length && options.length > 5);

  return (
    <Cascader
      key={1}
      disabled={disabled}
      value={CascaderVal}
      options={options}
      loadData={loadData}
      onChange={onChangeInner}
      showSearch={showSearch ? filter : false}
      changeOnSelect
      placeholder={placeholder}
    />
  );
};

export default BsCascader;
