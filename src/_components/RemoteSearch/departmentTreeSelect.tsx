import { request } from 'sula';
import { TreeSelect } from 'antd';
import { useEffect, useState } from 'react';

const RemoteDepartmentTreeSelect = (props: any) => {
  const [treeData, setTreeData] = useState([]);

  const { ctx, onChange, placeholder, name, remoteSource, initialValue } = props;

  const { url, paramsKey = 'qp-employeeId-eq', initialParams = {} } = remoteSource;

  // format树结构
  function mapTree(treeDataItem: any) {
    const haveChildren = Array.isArray(treeDataItem.children) && treeDataItem.children.length > 0;
    return {
      // 分别将我们查询出来的值做出改变他的key
      title: treeDataItem.viewName || treeDataItem.name,
      key:
        (treeDataItem.viewId && `${treeDataItem.viewId}___1`) ||
        (treeDataItem.id && `${treeDataItem.id}___2___${treeDataItem.orgViewId}`),
      value:
        (treeDataItem.viewId && `${treeDataItem.viewId}___1`) ||
        (treeDataItem.id && `${treeDataItem.id}___2___${treeDataItem.orgViewId}`),
      data: { ...treeDataItem },
      isLeaf: !haveChildren,
      disabled: treeDataItem.viewId,
      selectable: true,
      // 默认展开树
      defaultExpandParent: true,
      // 判断它是否存在子集，若果存在就进行再次进行遍历操作，知道不存在子集便对其他的元素进行操作
      children: haveChildren ? treeDataItem.children.map((i: any) => mapTree(i)) : [],
    };
  }

  const handleSearch = (q: string) => {
    request({
      url,
      params: {
        [`${paramsKey}`]: q,
        ...initialParams,
      },
    }).then((res: any) => {
      const data = res || [];

      const coverData =
        (data && Array.isArray(data) && data.length && data.map((ites: any) => mapTree(ites))) ||
        [];

      setTreeData(coverData);

      ctx.form.setFieldSource(name, coverData);
    });
  };

  const handleChange = (data: any) => {
    let tempKey;

    if (data) {
      // eslint-disable-next-line prefer-destructuring
      tempKey = data.split('___')[0];
    }

    // 自动填充form
    onChange(tempKey);
  };

  useEffect(() => {
    handleSearch(initialValue);
  }, []);

  return (
    <TreeSelect
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      placeholder={placeholder}
      allowClear
      showArrow={true}
      // @ts-ignore
      filterOption={false}
      notFoundContent={'暂无数据'}
      treeDefaultExpandAll
      onChange={handleChange}
    />
  );
};

export default RemoteDepartmentTreeSelect;
