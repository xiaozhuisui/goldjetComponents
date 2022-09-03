/*
 * @Date: 2022-09-03 17:05:29
 * @LastEditors: 追随
 * @LastEditTime: 2022-09-03 17:07:50
 */
import { Select } from 'antd';
import { useEffect } from 'react';

import { requestStations } from '@/_components/RemoteSearch/function';

const RemoteStationNeedShowOpt = (props: any) => {
  const { source = [], ctx, value, onChange, placeholder, name, remoteSource, onCallback } = props;

  const {
    url,
    initialParams = {},
    resKeyValue = ['name', 'code', 'id'],
    ShowOptCol = [],
  } = remoteSource;

  const handleSearch = () => {
    const params = {
      pageSize: 5000,
      currentPage: 1,
      ...initialParams,
    };

    requestStations(
      url,
      params,
      resKeyValue && resKeyValue.length && resKeyValue.slice(0, resKeyValue.length - 1),
      `${resKeyValue[2]}`,
    ).then((coverData: any) => {
      ctx.form.setFieldSource(name, coverData);
    });
  };

  const handleChange = (data: any) => {
    const selectedItem = source.find((item: any) => item.value === data);

    // 自动填充form
    onChange(data);

    if (onCallback) {
      onCallback(selectedItem);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <Select
      allowClear
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      showArrow={true}
      filterOption={false}
      notFoundContent={'暂无数据'}
      value={value}
      onChange={handleChange}
      style={{ width: '100%' }}
    >
      <Select.OptGroup
        label={
          <div
            style={{
              fontWeight: 900,
              display: 'flex',
              color: 'black',
              justifyContent: 'space-around',
            }}
          >
            {ShowOptCol &&
              ShowOptCol.length &&
              ShowOptCol.map((i: any) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  {i}
                </div>
              ))}
          </div>
        }
      >
        {source.map((item: any) => {
          return (
            <Select.Option key={item.value} value={item.value} style={{ textAlign: 'center' }}>
              {item.text}
            </Select.Option>
          );
        })}
      </Select.OptGroup>
    </Select>
  );
};

export default RemoteStationNeedShowOpt;
