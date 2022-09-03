// @ts-ignore
import { request } from 'sula';
import { Select } from 'antd';
import { useEffect } from 'react';

import EllipsisTooltip from '@/_components/EllipsisTooltip';

const RemoteSearchNeedShowOpt = (props: any) => {
  const {
    source = [],
    ctx,
    value,
    onChange,
    placeholder,
    name,
    remoteSource,
    initialValue,
    onCallback,
  } = props;

  const {
    url,
    initiakKey = '',
    paramsKey = 'qp-name-like',
    resKeyValue = ['id', 'name', 'personName', 'nickname', 'phone', 'email'],
    ShowOptCol = [],
    resIsNoPage = false,
  } = remoteSource;

  const handleSearch = (q: string) => {
    let params = {
      pageSize: 5000,
      currentPage: 1,
      [`${paramsKey}`]: q,
    };

    if (initiakKey !== '') {
      params = {
        ...params,
        [`${initiakKey}`]: initialValue,
      };
    }

    request({
      url,
      params,
    }).then((res: any) => {
      const data = resIsNoPage ? res : res.items;

      const coverData =
        (data &&
          Array.isArray(data) &&
          data.length &&
          data.map((ites: any) => {
            return {
              ...ites,
              text: (
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {resKeyValue &&
                    resKeyValue.length &&
                    resKeyValue.slice(1, resKeyValue.length).map((i: any) => (
                      <EllipsisTooltip
                        key={i}
                        style={{
                          textAlign: 'left',
                          width: 100,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          display: 'inline',
                        }}
                        maxLength={10}
                        title={ites[i]}
                        showInfo={ites[i]}
                      />
                    ))}
                </div>
              ),
              value: ites[`${resKeyValue[0]}`],
            };
          })) ||
        [];

      ctx.form.setFieldSource(name, coverData);
    });
  };

  const handleChange = (data: any) => {
    const selectedItem = source.find((item: any) => item.value === data);

    if (onChange) {
      onChange(data);

      onCallback(selectedItem);
    }
  };

  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <Select
      allowClear
      showSearch
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      notFoundContent={null}
      value={value}
      onChange={handleChange}
      onSearch={handleSearch}
      style={{ width: '100%' }}
    >
      <Select.OptGroup
        label={
          <div style={{ fontWeight: 900, display: 'flex', justifyContent: 'space-around' }}>
            {ShowOptCol &&
              ShowOptCol.length &&
              ShowOptCol.map((i: any) => (
                <div key={i} style={{ textAlign: 'left', width: 80 }}>
                  {i}
                </div>
              ))}
          </div>
        }
      >
        {source.map((item: any) => {
          return (
            <Select.Option key={item.value} value={item.value}>
              {item.text}
            </Select.Option>
          );
        })}
      </Select.OptGroup>
    </Select>
  );
};

export default RemoteSearchNeedShowOpt;
