import { request } from 'sula';
import { Select } from 'antd';
import { useEffect } from 'react';

const RemoteSearch = (props: any) => {
  const {
    source = [],
    ctx,
    value,
    onChange,
    placeholder,
    name,
    remoteSource,
    initialValue,
    disabled,
  } = props;

  const {
    url,
    paramsKey = 'qp-name-like',
    resIsNoPage = true,
    resKeyValue = ['id', 'name'],
    initKeyValue = ['id', 'name'],
  } = remoteSource;

  const handleSearch = (q: string) => {
    if (!q) {
      return;
    }

    request({
      url,
      params: {
        [`${paramsKey}`]: q,
      },
    }).then((res: any) => {
      const data = resIsNoPage ? res : res.items;
      const coverData =
        (data &&
          Array.isArray(data) &&
          data.length &&
          data.map((ites: any) => {
            return {
              text: ites[`${resKeyValue[1]}`],
              value: ites[`${resKeyValue[0]}`],
            };
          })) ||
        [];
      ctx.form.setFieldSource(name, coverData);
    });
  };

  const handleChange = (data: any) => {
    onChange(data);
  };

  useEffect(() => {
    handleSearch(initialValue);
  }, []);

  useEffect(() => {
    // 编辑回显下拉框
    if (!source.length && value) {
      const coverData = [
        {
          text: ctx.record[`${initKeyValue[1]}`],
          value,
        },
      ];
      ctx.form.setFieldSource(name, coverData);
    }
  }, value);

  return (
    <Select
      allowClear
      disabled={disabled || false}
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
      {source.map((item: any) => {
        return (
          <Select.Option key={item.value} value={item.value}>
            {item.text}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default RemoteSearch;
