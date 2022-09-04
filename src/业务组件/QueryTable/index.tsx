// @ts-nocheck
import React, { ReactElement } from 'react';
import { DownOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  convertParamsTable,
  handleConvertParams,
  queryParams,
  getDictionaryTextByValue,
} from '@/_utils';
import { Button, Dropdown, Menu, Space, Spin, Table, Tooltip } from 'antd';
import moment from 'moment';
import qs from 'qs';
import { QueryForm } from 'sula';
import { useLocation, request } from 'umi';
import styles from './index.less';

import { BtnItemProps } from './typing';

export interface IQueryProps {
  /**
   * 可以这样写属性描述
   * @description   不了解请看sula文档
   * @default           请传数组 不然不传也行
   */
  fields: any[]; // 支持识别 TypeScript 可选类型为非必选属性
  /**
   * 可以这样写属性描述
   * @description       参考antd item.type 写'time' 'ell'有特别效果 写'time'还请添加format 属性 有默认值 YYYY-MM-DD hh:mm:ss
   * @default --
   */
  columns: any[]; // 支持识别 TypeScript 可选类型为非必选属性
  /**
   *
   * @description       行选择唯一标识
   * @default id
   */
  rowKey?: any;
  /**
   * 可以这样写属性描述
   * @description       表格其他属性
   * @default id
   */
  tableProps?: any; // 支持识别 TypeScript 可选类型为非必选属性
  /**
   * 可以这样写属性描述
   * @description       请求后的函数
   * @default
   */
  handleConverter?: Function; // 支持识别 TypeScript 可选类型为非必选属性
  /**
   * @description       设置超过多少搜索项出现
   * @default 3
   */
  visibleFieldsCount?: number;
  /**
   * 可以这样写属性描述
   * @description  设置了将会出现数量统计栏 查看示例就行 其中 value 是传递给后端的值 type 是后端返回data中数据的key 不清楚按下F12
   * @default
   */
  selectDatas?: []; // 支持识别 TypeScript 可选类型为非必选属性
  /**
   *
   * @description        与上方相对应 相信能看懂
   * @default id
   */
  selectDatasInfo?: { url?: string; method?: 'get' | 'post' | 'delete' };
  /**
   *
   * @description       按钮中的每一项 其中disabled 可传 Boolean Function 不传的话需要勾选数据才会启用 另外还有下拉菜单的示例 以及可以直接传一个render
   * @default id
   */
  actionsRender?: any;
  /**
   *
   * @description       按钮中的每一项 其中disabled 可传 Boolean Function 不传的话需要勾选数据才会启用 另外还有下拉菜单的示例 以及可以直接传一个render
   * @default id
   */
  leftActionsRender?: any;
  /**
   *
   * @description       切换tab页的时候是否自动刷新
   * @default false
   */
  refDatas?: boolean;
  /**
   *
   * @description 参考antd
   * @default
   */
  rowSelection?: object;
  /**
   * @description 点击搜索按钮回调
   * @default
   */
  queryEnd?: Function;
  /**
   * @description （左侧）插槽 习惯Vue叫法
   * @default
   */
  leftSlot?: ReactElement;
  /**
   * @description 后端需要另外传的其他参数
   * @default
   */
  otherParams?: object;
  // [key:string ]:any
}
export default forwardRef((props: IQueryProps, ref: any) => {
  const {
    fields,
    columns,
    pagination,
    overScrollX,
    requestconfig,
    rowKey = 'id',
    tableProps = {},
    size = 'middle',
    autoRqf = true,
    actionsRender = [],
    leftActionsRender = [],
    summary, // 总结
    isParamsObj = false, // 抛出去的参数， 默认为字符串型
    needInitPage = false, // 是否存在切换初始参数需要重置页码的情景
    noOtherParams = true,
    otherParams,
    rowSelection,
    visibleFieldsCount, //设置超过多少搜索项出现展开收起按钮
    setQueryParams, // 将查询入参通过传进来的useState抛出去
    handleConverter, // 接受参数后自己处理的回调函数
    formOtherConfig = {}, // 提供其他的页面参数
    leftSlot,
    queryEnd,
    initialValues,
    refDatas = false, //是否路由跳转自动刷新的参数
    selectDatas = [], //集成到里面
    selectDatasInfo = {},
    setCountInfo,
    isOtherSelectWays = false,
  } = props;
  const [slotDatas, setSlotDatas] = useState(
    selectDatas.map((item: any) => ({ ...item, number: 0 })),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const { pathname } = useLocation();
  const initPathName: any = useRef();
  const initFlag: any = useRef(false);
  const [loading, setLoading]: any = useState(false);
  const isLoading = useRef({ flag: false });
  const [switchCode, setSwitchCode]: any = useState('');
  const [data, setData]: any = useState([]);
  const [currentPageCode, setCurrentPageCode]: any = useState(1);
  const [pageSize, setPageSize]: any = useState(10);
  const [total, setTotal]: any = useState([]);
  const [selectRowKeys, setSelectRowKeys]: any[] = useState([]);
  const [selectRows, setSelectRows]: any = useState([]);
  const innerRef: any = useRef();
  const [queryForm, setQueryForm]: any = useState({});
  const requestNumber = async (params: {}) => {
    if (Object.keys(selectDatasInfo).length === 0) return;
    const { success, data } = await request(selectDatasInfo.url, {
      method: selectDatasInfo?.method ?? 'get',
      params: { ...handleConvertParams(params || {}), pageSize: 9999999 },
    });
    if (success) {
      if (setCountInfo) {
        setCountInfo?.(data, setSlotDatas);
      } else {
        setSlotDatas(slotDatas.map((item: any) => ({ ...item, number: data[item.type] || 0 })));
        setCurrentIndex(0);
      }
    }
  };
  const otherSelectData: any = useRef({ rows: [], keys: [] });

  useEffect(() => {
    if (otherParams && Object.keys(otherParams) && autoRqf) {
      fetchTable(initialValues || {});
    } else if (noOtherParams && autoRqf) {
      fetchTable();
    }
  }, [autoRqf]);
  useEffect(() => {
    if (otherParams && Object.keys(otherParams).length > 0) {
      fetchTable();
    }
  }, [otherParams]);
  useEffect(() => {
    initPathName.current = pathname;
    requestNumber?.({});
    setTimeout(() => {
      initFlag.current = true;
    }, 100);
  }, []);
  useEffect(() => {
    if (refDatas && initFlag.current && initPathName.current === pathname) {
      if (otherParams && Object.keys(otherParams) && autoRqf) {
        fetchTable(initialValues || {});
      } else if (noOtherParams && autoRqf) {
        fetchTable();
      }
    }
  }, [pathname]);
  const Oprate = {
    getQueryParams: () => {
      if (noOtherParams && autoRqf) {
        return {
          ...qs.parse(requestconfig.url[1]),
          ...queryForm,
        };
      } else {
        return { ...queryForm };
      }
    },
    refreshTable: (reset = true) => {
      if (reset) {
        fetchTable({}, true);
        requestNumber({});
      } else {
        const value = innerRef.current.getFieldValue();
        const params = {
          current: currentPageCode,
          pageSize,
          ...convertParamsTable(value),
        };
        fetchTable(params);
        requestNumber({ params });
      }
    },
    setFieldValue: innerRef?.current?.setFieldValue,
    getSelectedRows: () => {
      if (isOtherSelectWays) {
        return otherSelectData.current.rows;
      }
      return selectRows;
    },
    getSelectedRowKeys: () => {
      if (isOtherSelectWays) {
        return otherSelectData.current.keys;
      }
      return selectRowKeys;
    },
    selectRowKeys: isOtherSelectWays ? otherSelectData.current : selectRowKeys,
    setSelectRowKeys,
    resetForm: () => {
      innerRef.current.resetFields();
      setQueryForm({ ...(otherParams ? otherParams : {}) });
    },
    data,
    setData,
  };

  useImperativeHandle(ref, () => ({ ...Oprate }));

  /* 主页面 */
  // 页面请求
  const fetchTable = (page?: any, flag = false, innerOtherParams?: any) => {
    if (isLoading.current.flag) return;
    const paramsObj = {
      ...page,
      currentPage: flag ? 1 : page?.current || page?.currentPage,
      pageSize: page?.pageSize || pageSize || 10,
      ...otherParams,
    };
    if (needInitPage) {
      const nowValue = Object.values(otherParams);
      const lastValue = Object.values(switchCode);
      if (!(nowValue.sort().toString() === lastValue.sort().toString())) {
        setCurrentPageCode(1);
        setPageSize(10);
      }
      setSwitchCode({ ...otherParams });
    }
    if (paramsObj.currentPage == 1 || paramsObj.current == 1) {
      setCurrentPageCode(1);
    }
    delete paramsObj.total;
    delete paramsObj.current;
    for (const param in paramsObj) {
      if (paramsObj[param] && typeof paramsObj[param] === 'string') {
        paramsObj[param] = paramsObj[param].trimStart().trimEnd();
      }
      if (typeof paramsObj[param] === 'undefined') {
        delete paramsObj[param];
      }
    }
    let paramsUrl = '',
      rqfRest: any = {},
      requestBody: any;
    rqfRest.method = requestconfig.method || 'GET';
    requestBody = handleConvertParams(paramsObj);
    if (typeof requestconfig.url[1] === 'object') {
      requestBody = {
        ...requestconfig.url[1],
        ...requestBody,
      };
    }
    if (rqfRest.method === 'POST') {
      if (requestconfig.needUrlParams) {
        paramsUrl = `${requestconfig.url[0]}?${queryParams(requestBody)}`;
      } else {
        paramsUrl = `${requestconfig.url}`;
        if (Array.isArray(requestconfig.url)) {
          paramsUrl = `${requestconfig.url[0]}`;
        }
        rqfRest.data = { ...requestBody };
      }
    } else {
      if (Array.isArray(requestconfig.url)) {
        // 有初始参数
        if (typeof requestconfig.url[1] === 'object') {
          // 初始参数为对象
          paramsUrl = `${requestconfig.url[0]}?${queryParams({
            ...requestBody,
            ...innerOtherParams,
          })}`;
        } else {
          // 初始参数为字符串
          paramsUrl = `${requestconfig.url[0]}?${
            requestconfig.url[1] ? `${requestconfig.url[1]}&` : ''
          }${queryParams({ ...requestBody, ...innerOtherParams })}`;
        }
      } else {
        // 无初始参数
        paramsUrl = `${requestconfig.url}?${queryParams({ ...requestBody, ...innerOtherParams })}`;
      }
    }
    setLoading(true);
    isLoading.current.flag = true;
    request(paramsUrl, {
      ...rqfRest,
    })
      .then((res: any) => {
        if (res.success) {
          const { data } = res;
          const dataList = data?.list || data?.items || data || [];
          const total = data?.total || data?.totalCount || 0;
          if (handleConverter) {
            handleConverter(dataList, setData, setTotal, total);
          } else {
            setData([...dataList]);
            setTotal(total);
          }
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          isLoading.current.flag = false;
        }, 500);
      });
  };

  const formConfig = {
    actionsRender: [
      {
        type: 'button',
        props: {
          type: 'primary',
          children: '查询',
          icon: {
            type: 'SearchOutlined',
            iconMapper: {
              SearchOutlined: SearchOutlined,
            },
          },
        },
        loading,
        action: [
          (ctx: any) => {
            ctx.form.validateFields().then(() => {
              // 每次点查询都要回到初始查询显示, 第一页, 每页十条
              setCurrentPageCode(1);
              // setPageSize(10);
              const value = ctx.form.getFieldsValue();
              const params = convertParamsTable(value);
              if (Array.isArray(requestconfig.url)) {
                setQueryForm({ ...params, ...qs.parse(requestconfig.url[1]) });
                queryEnd?.({ ...params, ...qs.parse(requestconfig.url[1]) });
              } else {
                setQueryForm({ ...params });
                queryEnd?.({ ...params });
              }
              fetchTable(params, true);
              if (typeof setQueryParams !== 'undefined') {
                if (isParamsObj) {
                  setQueryParams(params);
                } else {
                  setQueryParams(queryParams(params));
                }
              }
              requestNumber(params);
              setCurrentIndex(0);
            });
          },
        ],
      },
      {
        type: 'button',
        props: {
          children: '重置',
          icon: {
            type: 'SyncOutlined',
            iconMapper: {
              SyncOutlined: SyncOutlined,
            },
          },
        },
        action: [
          (ctx: any) => {
            const { resetFields } = ctx.form;
            resetFields();
            setQueryForm({});
            setTotal(0);
            setData([]);
            setCurrentIndex(0);
            requestNumber({});
            if (typeof setQueryParams !== 'undefined') {
              setQueryParams(undefined);
            }
            if (autoRqf || (otherParams && Object.keys(otherParams).length > 0)) {
              fetchTable({}, true);
            }
          },
        ],
      },
    ],
    visibleFieldsCount: visibleFieldsCount || 3,
    itemLayout: { span: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
    fields,
    ...formOtherConfig,
  };

  // 换页
  const handleTableChange = (page: any) => {
    const { current, pageSize } = page;
    const value = innerRef.current.getFieldValue();
    const params = convertParamsTable(value);
    const paramsObj = {
      current,
      pageSize,
      ...params,
    };
    setPageSize(pageSize);
    setCurrentPageCode(current);
    fetchTable(paramsObj);
  };

  // 这边不做按钮权限
  const actionsRenderDesc = (BtnArr: BtnItemProps[]) => {
    /*
      有code就过滤, 没有就不用过滤
    */
    return (
      <>
        {BtnArr.map((item: BtnItemProps, index: number) => {
          if (item.render) {
            return item.render?.(Oprate);
          }
          if (item.buttonType === 'batch') {
            const menu = (
              <Menu key={index}>
                {(item.menuData || []).map((dropBtnItem: any, index: number) => (
                  <Menu.Item
                    onClick={() => {
                      dropBtnItem?.onClick?.(Oprate);
                    }}
                    disabled={dropBtnItem?.control && !selectRowKeys.length}
                    key={dropBtnItem.name}
                  >
                    {dropBtnItem.name}
                  </Menu.Item>
                ))}
              </Menu>
            );
            return (
              <Dropdown
                overlay={menu}
                disabled={item.disabled ?? (!selectRowKeys.length && !item.noRelateSelectRow)}
                key={item.children}
              >
                {/* @ts-ignore */}
                <Button type={item?.type || 'primary'}>
                  {item.children} <DownOutlined />
                </Button>
              </Dropdown>
            );
          }
          return (
            <Button
              {...item}
              type={
                (item?.type as
                  | 'primary'
                  | 'default'
                  | 'link'
                  | 'text'
                  | 'ghost'
                  | 'dashed'
                  | undefined) || 'default'
              }
              disabled={
                typeof item.disabled !== 'undefined'
                  ? typeof item.disabled === 'boolean'
                    ? item.disabled
                    : item.disabled?.(selectRows)
                  : !selectRowKeys.length && rowSelection
              }
              style={{ display: item.hidden ? 'none' : 'inline-block', ...item.style }}
              onClick={() => {
                item.onClick?.(Oprate);
              }}
              key={item.children}
            />
          );
        })}
      </>
    );
  };

  const columnsProps = (width = 150, item: any) => {
    let obj: any = {};
    if (item.ell) {
      obj = {
        ...obj,
        onCell: () => {
          return {
            style: {
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              cursor: 'pointer',
              maxWidth: width,
            },
          };
        },
        ellipsis: true,
        width,
      };
    }
    return obj;
  };

  const render = (item: any) => {
    if (item.title === '序号') {
      return (_text: any, _row: any, index: number) => index + 1 + pageSize * (currentPageCode - 1);
    } else if (item.type === 'time' || item.isTime) {
      return (text: any) => moment(text).format(item.format || 'YYYY-MM-DD hh:mm:ss');
    } else if (item.type === 'ell' || item.ell) {
      return (text: any) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      );
    } else if (item.dicName) {
      return (text: any) => getDictionaryTextByValue(item.dicName, text);
    }
    return item.render;
  };

  const tableSetting: any = {
    dataSource: [...data] || [],
    columns: (columns || []).map((item: any) => ({
      width: (item.title === '序号' && 45) || (item.isTime && 180),
      ...columnsProps(item.width, item),
      ...item,
      fixed: (item.title === '操作' && 'right') || (item.title === '序号' && 'left'),
      render: render(item),
    })),
    scroll: { x: overScrollX || 'max-content' },
    onChange: handleTableChange,
    pagination:
      typeof pagination !== 'undefined'
        ? pagination
        : {
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: any) => `共 ${total} 条`,
            current: currentPageCode,
            pageSize,
            size: 'small',
          },
    rowSelection:
      typeof rowSelection !== 'undefined'
        ? {
            type: rowSelection.type || 'checkbox',
            onChange: (keys: any, rows: any) => {
              if (isOtherSelectWays) {
                otherSelectData.current.rows = rows;
                otherSelectData.current.keys = keys;
                return;
              }
              setSelectRowKeys([...keys]);
              setSelectRows([...rows]);
              if (typeof rowSelection.onChange !== 'undefined') {
                rowSelection.onChange(keys, rows);
              }
            },
            selectedRowKeys: isOtherSelectWays
              ? undefined
              : rowSelection.selectedRowKeys || selectRowKeys || [],
            getCheckboxProps: rowSelection.getCheckboxProps,
          }
        : null,
    loading: false,
    summary,
    rowKey,
    size,
    ...tableProps,
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.outContainer}>
        <div className={styles.formContainer}>
          <QueryForm {...formConfig} ref={innerRef} />
        </div>
        <div className={styles.tableContainer}>
          {selectDatas.length > 0 && (
            <Space size="middle" style={{ marginTop: 30 }}>
              {slotDatas.map((item: any, index: number) => (
                <div
                  style={{
                    width: 200,
                    borderRadius: 5,
                    border: '1px solid #ececec',
                    boxSizing: 'border-box',
                    padding: 10,
                    paddingLeft: 15,
                    cursor: 'pointer',
                    ...(index === currentIndex
                      ? { color: '#ff4c20', background: '#ff4c2020', border: 'unset' }
                      : {}),
                  }}
                  onClick={() => {
                    setCurrentIndex(index);
                    setQueryForm({ ...queryForm, [selectDatasInfo.paramsName]: item.value });
                    fetchTable(undefined, true, { [selectDatasInfo.paramsName]: item.value });
                  }}
                >
                  <div style={{ lineHeight: '40px', fontSize: 20, fontWeight: 600 }}>
                    {item.title}
                  </div>
                  <div style={{ lineHeight: '30px', fontSize: 20 }}>{item.number}</div>
                </div>
              ))}
            </Space>
          )}
          <div className={styles.btnsContainer}>
            <Space size={10}>
              {leftActionsRender.length > 0 && actionsRenderDesc(leftActionsRender)}
              {leftSlot}
            </Space>
            <Space size={10}>{actionsRender.length > 0 && actionsRenderDesc(actionsRender)}</Space>
          </div>
          <Table {...tableSetting} />
        </div>
      </div>
    </Spin>
  );
});
