import { request } from 'sula';
import { TreeSelect } from 'antd';
import { useEffect, useState } from 'react';

const RemoteSearchTreeSelect = (props: any) => {
  const [treeData, setTreeData] = useState([]);
  const { ctx, value, onChange, placeholder, name, remoteSource, initialValue } = props;

  const {
    url,
    paramsKey = 'qp-name-like',
    resKeyValue = ['id', 'name'],
    initialParams = {},
  } = remoteSource;

  const mapSearchTree = (treeDataItem: any) => {
    const haveChildren = Array.isArray(treeDataItem.children) && treeDataItem.children.length > 0;
    return {
      title: treeDataItem[resKeyValue[1]],
      key: treeDataItem[resKeyValue[0]],
      parentId: treeDataItem.parent,
      data: { ...treeDataItem },
      isLeaf: !haveChildren,
      children: haveChildren ? treeDataItem.children.map((i: any) => mapSearchTree(i)) : [],
    };
  };

  const handleSearch = (q: string) => {
    // if(!q) {
    //   return;
    // }

    request({
      url,
      params: {
        [`${paramsKey}`]: q,
        ...initialParams,
      },
    }).then((res: any) => {
      const data = res || [];

      const coverData =
        (data &&
          Array.isArray(data) &&
          data.length &&
          data.map((ites: any) => mapSearchTree(ites))) ||
        [];

      setTreeData(coverData);

      ctx.form.setFieldSource(name, coverData);
    });
  };

  const handleChange = (data: any) => {
    onChange(data);

    ctx.form.setFieldValue(name, data);
  };

  useEffect(() => {
    handleSearch(initialValue);
  }, []);

  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      placeholder={placeholder}
      allowClear
      showArrow={false}
      // @ts-ignore
      filterOption={false}
      notFoundContent={null}
      treeDefaultExpandAll
      onChange={handleChange}
      onSearch={handleSearch}
    />
  );
};

export default RemoteSearchTreeSelect;
