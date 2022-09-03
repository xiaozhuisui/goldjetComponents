import React, { useRef, useEffect } from 'react';
import { Table } from 'sula';
import styles from './index.less';

export default (props: any) => {
  const {
    rowKey, // 列唯一标识， 默为id
    value, // 初始值
    columns, // 列表项
    // onChange,         // 保存数据
    mode, // 表格模式
    actionsRender, // 上方操作按钮
    noRowSelection, // 无选中框
    noOperation, // 无操作键
  } = props;

  const tableData = value ? [...value] : [];

  const tableRef = useRef();

  /* 值 */
  if (mode === 'view' && noOperation) {
    console.log(columns.pop());
  }

  useEffect(() => {
    // @ts-ignore
    tableRef.current.setDataSource(tableData);
  }, [tableData]);

  // 弹出框内表格选中项变化方法
  const selectLengthChange = (selectedRowKeys: any) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    // setSelectLength(selectedRowKeys.length);
  };

  // 初始数据源
  const initialDataSource = mode === 'create' ? [] : tableData;

  const config = {
    type: '',
    initialDataSource,
    columns,
    initialPaging: {
      pagination: false, // 无分页情况
    },
    rowSelection:
      mode !== 'view' && !noRowSelection
        ? {
            onChange: selectLengthChange,
          }
        : false,
    rowKey: rowKey || 'id',
  };

  /* 方法 */
  // 处理分页 (函数柯里化)
  const paginationChange = (ref: any) => {
    return ({ current }: any) => {
      ref.current.setPagination({ current });
    };
  };

  return (
    <div className={styles.cont}>
      <Table
        {...config}
        actionsRender={mode !== 'view' ? actionsRender : false}
        ref={tableRef}
        onChange={paginationChange(tableRef)}
        // rowSelection={mode !== 'view' && !noRowSelection ? selectLengthChange : false}
        size={'small'}
      />
    </div>
  );
};
