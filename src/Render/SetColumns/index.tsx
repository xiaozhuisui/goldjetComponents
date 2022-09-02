/*
 * @Date: 2022-09-01 20:27:53
 * @LastEditors: 追随
 * @LastEditTime: 2022-09-02 09:31:30
 */
import { Menu, Checkbox, Space, Tooltip, message, Dropdown, Button } from 'antd';
import React, { useState } from 'react';
import { cloneDeep } from 'lodash';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SettingOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
interface IProps {
  columns: { title: string; topFixed?: boolean; btmFixed?: boolean }[];
}
export default function SetColoums(props: IProps) {
  const { columns } = props;
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [checkAll, setCheckAll] = useState<boolean>(true);
  const [topColumns, setTopColumns] = useState<any>([]);
  const [btmColumns, setBtmColumns] = useState<any>([]);
  const [value, setValue] = useState(props);
  const [initColumns, setInitColumns] = useState(props.columns);
  const [checkedList, setCheckedList] = useState(columns.map((d: any) => d.key || d.dataIndex));
  const [initColumnsPure]: any = useState(cloneDeep(columns));
  const onCheckAllChange = (e: any) => {
    const columnsKey = [
      ...topColumns.map((d: any) => d.key || d.dataIndex),
      ...btmColumns.map((d: any) => d.key || d.dataIndex),
    ];
    if (e.target.checked) {
      setValue({
        ...value,
        columns: [
          ...topColumns.map((r: any) => ({ ...r, fixed: 'left' })),
          ...initColumns.filter(
            (r: any) => !r.topFixed && !r.btmFixed && !columnsKey.includes(r.key || r.dataIndex),
          ),
          ...btmColumns.map((r: any) => ({ ...r, fixed: 'right' })),
        ],
      });
    } else {
      setValue({
        ...value,
        columns: [],
      });
    }
    setCheckedList(e.target.checked ? initColumnsPure.map((d: any) => d.key || d.dataIndex) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  const onChange = (list: any) => {
    setCheckedList(list);
    const columnsKey = [
      ...topColumns.map((d: any) => d.key || d.dataIndex),
      ...btmColumns.map((d: any) => d.key || d.dataIndex),
    ];

    setValue({
      ...value,
      columns: [
        ...topColumns
          .map((r: any) => ({ ...r, fixed: 'left' }))
          .filter((d: any) => list.includes(d.key || d.dataIndex)),
        ...initColumns.filter(
          (d: any) =>
            list.includes(d.key || d.dataIndex) && !columnsKey.includes(d.key || d.dataIndex),
        ),
        ...btmColumns
          .map((r: any) => ({ ...r, fixed: 'right' }))
          .filter((d: any) => list.includes(d.key || d.dataIndex)),
      ],
    });
    setIndeterminate(!!list.length && list.length < initColumnsPure.length);
    setCheckAll(list.length === initColumnsPure.length);
  };
  // d 每个元素
  const cancelFixed = (d: any, type: string) => {
    initColumns[
      initColumns.findIndex((r: any) => (r.key || r.dataIndex) === (d.key || d.dataIndex))
    ].topFixed = false;
    initColumns[
      initColumns.findIndex((r: any) => (r.key || r.dataIndex) === (d.key || d.dataIndex))
    ].btmFixed = false;
    if (type === 'top') {
      topColumns.splice(
        topColumns.findIndex((r: any) => (r.key || r.dataIndex) === (d.key || d.dataIndex)),
        1,
      );
      setTopColumns([...topColumns]);
    } else {
      btmColumns.splice(
        btmColumns.findIndex((r: any) => (r.key || r.dataIndex) === (d.key || d.dataIndex)),
        1,
      );
      setBtmColumns([...btmColumns]);
    }
    setValue({
      ...value,
      columns: [
        ...topColumns.map((r: any) => ({ ...r, fixed: 'left' })),
        ...initColumns,
        ...btmColumns.map((r: any) => ({ ...r, fixed: 'right' })),
      ],
    });
    setInitColumns([...initColumns]);
  };

  const btmFixedFunc = (d: any, type?: string) => {
    initColumns[
      initColumns.findIndex((r: any) => (r.key || r.dataIndex) === (d.key || d.dataIndex))
    ].topFixed = false;
    initColumns[
      initColumns.findIndex((r: any) => (r.key || r.dataIndex) === (d.key || d.dataIndex))
    ].btmFixed = true;
    btmColumns.unshift(d);
    if (type) {
      topColumns.splice(
        topColumns.findIndex((r: any) => (r.key || r.dataIndex) === (d.key || d.dataIndex)),
        1,
      );
    }

    setValue({
      ...value,
      columns: [
        ...topColumns.map((r: any) => ({ ...r, fixed: 'left' })),
        ...initColumns.filter((r: any) => !r.topFixed && !r.btmFixed),
        ...btmColumns.map((r: any) => ({ ...r, fixed: 'right' })),
      ],
    });
    setBtmColumns([...btmColumns]);
    setTopColumns([...topColumns]);
    setInitColumns([...initColumns]);
  };

  const topFixedFunc = (d: any, type?: string) => {
    initColumns[
      initColumns.findIndex((r: any) => (r.key || r.dataIndex) === (d.key || d.dataIndex))
    ].topFixed = true;
    initColumns[
      initColumns.findIndex((r: any) => (r.key || r.dataIndex) === (d.key || d.dataIndex))
    ].btmFixed = false;
    topColumns.push(d);
    if (type) {
      btmColumns.splice(
        btmColumns.findIndex((r: any) => (r.key || r.dataIndex) === (d.key || d.dataIndex)),
        1,
      );
    }

    setValue({
      ...value,
      columns: [
        ...topColumns.map((r: any) => ({ ...r, fixed: 'left' })),
        ...initColumns.filter((r: any) => !r.topFixed && !r.btmFixed),
        ...btmColumns.map((r: any) => ({ ...r, fixed: 'right' })),
      ],
    });
    setTopColumns([...topColumns]);
    setBtmColumns([...btmColumns]);
    setInitColumns([...initColumns]);
  };
  const menu = (
    <Menu style={{ padding: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          列展示
        </Checkbox>
        <a
          onClick={() => {
            setTopColumns([]);
            setBtmColumns([]);
            setInitColumns([
              ...initColumnsPure.map((d: any) => ({
                ...d,
                topFixed: false,
                btmFixed: false,
              })),
            ]);
            setCheckedList(initColumnsPure.map((d: any) => d.key || d.dataIndex));
            setIndeterminate(false);
            setCheckAll(true);
            setValue({
              ...value,
              columns: initColumnsPure,
            });
          }}
        >
          重置
        </a>
      </div>

      <Menu.Divider />
      <Checkbox.Group
        className="settingCheckboxGroup"
        style={{ display: 'flex', flexDirection: 'column' }}
        value={checkedList}
        onChange={onChange}
      >
        {topColumns.length > 0 ? <>固定在左侧</> : <></>}
        {topColumns.map((d: any, index: any) => (
          <div
            key={d.key || d.dataIndex}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Checkbox key={d.key || d.dataIndex} value={d.key || d.dataIndex}>
              {d.title}
            </Checkbox>
            <Space>
              <a>
                <Tooltip title="取消固定">
                  <VerticalAlignMiddleOutlined
                    onClick={() => {
                      cancelFixed(d, 'top');
                    }}
                  />
                </Tooltip>
              </a>
              <a>
                <Tooltip title="固定在列尾">
                  <VerticalAlignBottomOutlined
                    onClick={() => {
                      btmFixedFunc(d, 'top');
                    }}
                  />
                </Tooltip>
              </a>
            </Space>
          </div>
        ))}
        {topColumns.length > 0 || btmColumns.length > 0 ? <>不固定</> : <></>}

        {initColumns.map((d: any, index: any) => (
          <div
            key={d.key || d.dataIndex}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            {!d.topFixed && !d.btmFixed && (
              <>
                <Checkbox key={d.key || d.dataIndex} value={d.key || d.dataIndex}>
                  {d.title}
                </Checkbox>
                <Space>
                  <a>
                    <Tooltip title="上移">
                      <ArrowUpOutlined
                        onClick={() => {
                          const myIndex = initColumns
                            .filter((r: any) => !r.topFixed && !r.btmFixed)
                            .findIndex(
                              (r: any) => (r.key || r.dataIndex) === (d.key || d.dataIndex),
                            );
                          if (myIndex === 0) {
                            message.error('当前已经是第一位了');
                            return;
                          }
                          initColumns[myIndex] = initColumns.splice(
                            myIndex - 1,
                            1,
                            initColumns[myIndex],
                          )[0];
                          setInitColumns([...initColumns]);
                          setValue({
                            ...value,
                            columns: initColumns.filter((d: any) =>
                              checkedList.includes(d.key || d.dataIndex),
                            ),
                          });
                        }}
                      />
                    </Tooltip>
                  </a>
                  <a>
                    <Tooltip title="下移">
                      <ArrowDownOutlined
                        onClick={() => {
                          const myIndex = initColumns
                            .filter((r: any) => !r.topFixed && !r.btmFixed)
                            .findIndex(
                              (r: any) => (r.key || r.dataIndex) === (d.key || d.dataIndex),
                            );
                          if (myIndex + 1 === initColumns.length) {
                            message.error('当前已经最后第一位了');
                            return;
                          }
                          initColumns[myIndex] = initColumns.splice(
                            myIndex + 1,
                            1,
                            initColumns[myIndex],
                          )[0];
                          setInitColumns([...initColumns]);
                          setValue({
                            ...value,
                            columns: initColumns.filter((d: any) =>
                              checkedList.includes(d.key || d.dataIndex),
                            ),
                          });
                        }}
                      />
                    </Tooltip>
                  </a>
                  <a>
                    <Tooltip title="固定在列首">
                      <VerticalAlignTopOutlined
                        onClick={() => {
                          topFixedFunc(d);
                        }}
                      />
                    </Tooltip>
                  </a>
                  <a>
                    <Tooltip title="固定在列尾">
                      <VerticalAlignBottomOutlined
                        onClick={() => {
                          btmFixedFunc(d);
                        }}
                      />
                    </Tooltip>
                  </a>
                </Space>
              </>
            )}
          </div>
        ))}
        {btmColumns.length > 0 ? <>固定在右侧</> : <></>}
        {btmColumns.map((d: any, index: any) => (
          <div
            key={d.key || d.dataIndex}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Checkbox key={d.key || d.dataIndex} value={d.key || d.dataIndex}>
              {d.title}
            </Checkbox>
            <Space>
              <a>
                <Tooltip title="固定在列首">
                  <VerticalAlignTopOutlined
                    onClick={() => {
                      topFixedFunc(d, 'btn');
                    }}
                  />
                </Tooltip>
              </a>
              <a>
                <Tooltip title="取消固定">
                  <VerticalAlignMiddleOutlined
                    onClick={() => {
                      cancelFixed(d, 'btn');
                    }}
                  />
                </Tooltip>
              </a>
            </Space>
          </div>
        ))}
      </Checkbox.Group>
    </Menu>
  );
  return (
    <div style={{ maxWidth: 600 }}>
      <Dropdown overlay={menu} trigger={['click']}>
        <Button onClick={(e) => e.preventDefault()} type="primary">
          自定义列表
        </Button>
      </Dropdown>
    </div>
  );
}
