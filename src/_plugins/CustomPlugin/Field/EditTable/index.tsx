/*
 * @Description:
 * @Author: rodchen
 * @Date: 2020-10-28 15:41:58
 * @LastEditTime: 2022-09-03 17:21:27
 * @LastEditors: 追随
 */

import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Form, Select, InputNumber, Popconfirm, DatePicker } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { request } from 'sula';
import styles from './index.less';
import moment from 'moment';

const EditableContext = React.createContext<any>({});

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
  [dataIndex: string]: any; // 动态属性
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false} layout="inline">
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  disabled: boolean;
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: Item;
  type: string;
  width?: number;
  isRequired: boolean;
  isRequiredTwo: boolean;
  PersonalComponent: React.FC<any>;
  columnData: any;
  isFirstValid: boolean;
  handleSave: (record: Item, dataIndex?: any, innerRemoteSource?: any) => void;
  dataSource: Array<any>;
  min?: number;
  max?: number;
  index: number;
  step?: string;
  render?: any;
}

interface PropsType {
  tip: string;
  buttonText: string;
  disabled?: boolean;
  id: string;
  Search: any;
  Export: any;
  onChange: (value: any) => {};
  formatAddOn: (a: any, b: any, c: any) => {};
  value?: Array<any>;
  onValueChange?: () => {};
  setFieldDisabled?: any;
  dataSource: any[];
  dependency: any; // 联动
  columns: Array<any>;
  addNode?: React.ReactNode;
  onlyOneRow?: boolean;
  fixed?: string;
  hiddenDelete?: boolean;
  hiddenAdd?: boolean;
  hiddenAddNum?: boolean;
  totalCountField?: any;
  totalCountFieldTwo?: any;
  showPagination?: boolean;
  cellDataFormat?: (row: any, col: any) => {}; // 按模式对数据进行格式化
  mode?: string;
  source?: any[];
  formatMessage?: (title: { id: string }) => {};
}

const isEmpty = (value) => {
  if (value == null || value == undefined || String(value).trim() == '') {
    return true;
  }
  return false;
};

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  disabled,
  editable,
  columnData,
  children,
  dataIndex,
  record,
  render,
  index,
  handleSave,
  dataSource,
  dependency,
  type,
  width,
  isRequired,
  isRequiredTwo,
  isFirstValid,
  min,
  max,
  step,
  mode,
  source,
  setFieldDisabled,
  PersonalComponent,
  ...restProps
}) => {
  const inputRef = useRef() as any;
  const form = useContext(EditableContext);

  const [innerRemoteSource, setInnerRemoteSource] = useState([]);
  // 为每一列默认赋值
  useEffect(() => {
    if (record && (record[dataIndex] === 0 || record[dataIndex])) {
      form.setFieldsValue({
        [dataIndex]: record[dataIndex] || '',
      });

      // 格式化moment
      if (type === 'datepicker' && !moment.isMoment(record[dataIndex])) {
        form.setFieldsValue({ [dataIndex]: moment(record[dataIndex]) });
      }
    }
  }, [editable]);

  const save = async (injectRowData: any) => {
    try {
      let values = await form.validateFields();

      // 支持添加table 行外的数据到同行中
      if (Array.isArray(injectRowData)) {
        const [rowData] = injectRowData;
        values = {
          ...values,
          ...rowData,
        };
      }

      if (type == 'fullAddress') {
        handleSave(
          {
            ...record,
            [dataIndex]: {
              ...record[dataIndex],
              [dataIndex.split('*')[1]]: values[dataIndex.split('*')[1]],
            },
          },
          dataIndex,
        );
      } else {
        handleSave({ ...record, ...values }, dataIndex, form);
      }
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const handleSearch = (value) => {
    const { fuzzyRequestConfig } = columnData as any;

    if (!fuzzyRequestConfig) return;
    request({
      url: fuzzyRequestConfig.url,
      method: 'get',
      convertParams: ({ params }) => {
        return {
          ...params,
          [fuzzyRequestConfig.filter]: value,
        };
      },
    }).then((res) => {
      let source = res
        ? res.list
          ? res.list.map((item) => {
              return {
                text: item[fuzzyRequestConfig.mappingTextField],
                value: item[fuzzyRequestConfig.mappingValueField],
                supplierType: fuzzyRequestConfig.supplierType
                  ? item[fuzzyRequestConfig.supplierType]
                  : '',
                departmentCode: fuzzyRequestConfig.departmentCode
                  ? item[fuzzyRequestConfig.departmentCode]
                  : '',
              };
            })
          : res.map((item) => {
              return {
                text: item[fuzzyRequestConfig.mappingTextField],
                value: item[fuzzyRequestConfig.mappingValueField],
                supplierType: fuzzyRequestConfig.supplierType
                  ? item[fuzzyRequestConfig.supplierType]
                  : '',
                departmentCode: fuzzyRequestConfig.departmentCode
                  ? item[fuzzyRequestConfig.departmentCode]
                  : '',
              };
            })
        : [];
      setInnerRemoteSource(source);
    });
  };

  const renderCustomNode = (type: string, index: number, disabled = false) => {
    // 复杂组件调用 editable为true才生效
    // 非editable模式用 ant Table默认的render(text: string, record: any, index: number)
    if (type === 'render' && typeof render === 'function') {
      const options = {
        disabled,
      };
      return render(record, index, save, form, options);
    }

    let customNode = undefined;
    switch (type) {
      case 'component':
        const config = {
          options: {
            disabled,
            source,
          },
          record,
          index,
          save,
          form,
        };
        customNode = <PersonalComponent {...config}></PersonalComponent>;
        break;
      case 'input':
        customNode = (
          <Input
            disabled={disabled}
            allowClear
            ref={inputRef}
            style={{
              border:
                record.isFirstValid && record.firstValidKey === dataIndex
                  ? '1px solid red'
                  : 'none',
            }}
            onPressEnter={save}
            onBlur={save}
            placeholder="请输入"
          />
        );
        break;
      case 'inputNumber':
        customNode = (
          <InputNumber
            disabled={disabled}
            ref={inputRef}
            style={{
              border:
                record.isFirstValid && record.firstValidKey === dataIndex
                  ? '1px solid red'
                  : 'none',
            }}
            min={min}
            max={max}
            onPressEnter={save}
            onBlur={save}
            step={step}
            precision={step && step == '0.01' && 2}
          />
        );
        break;
      case 'select':
        customNode = (
          <Select
            mode={mode}
            disabled={disabled}
            placeholder="请选择"
            allowClear
            onSearch={handleSearch}
            showSearch={columnData.showSearch ? true : false}
            filterOption={(input, option) => {
              return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
            maxTagCount={4}
            style={{
              border:
                record.isFirstValid && record.firstValidKey === dataIndex
                  ? '1px solid red'
                  : 'none',
            }}
            ref={inputRef}
            onChange={save}
          >
            {source &&
              source.map((item: any) => (
                <Select.Option value={item.value} key={item.value} code={item.code}>
                  {item.text}
                </Select.Option>
              ))}
          </Select>
        );
        break;
      case 'dependency-select':
        let depDisabled = false;
        let isDepSource = false; // 依赖source
        // 联动 disabled
        if (dependency && Array.isArray(dependency.disableds)) {
          dependency.disableds.some((item: any) => {
            const [disabledKye, disabledVal] = item || [];
            if (record[disabledKye] === disabledVal) {
              depDisabled = true;
            }
            return depDisabled;
          });
        }
        const makeOption = () => {
          let options = source;
          if (dependency) {
            const [key, val] = dependency.relates || [];
            if (record[key] === val && dependency.source?.length) {
              options = dependency.source;
            } else if (typeof dependency.fetchSource === 'function') {
              // 更新columns参数达到联动
              dependency.fetchSource(record);
            }
          }
          return (options || []).map((item: any) => (
            <Select.Option value={item.value} key={item.value} code={item.code}>
              {item.text}
            </Select.Option>
          ));
        };

        // 值置空
        if (depDisabled && record[dataIndex] !== undefined) {
          form.setFieldsValue({ [dataIndex]: undefined });
        }

        customNode = (
          <Select
            mode={mode}
            disabled={depDisabled || disabled}
            placeholder="请选择"
            allowClear
            onSearch={handleSearch}
            showSearch
            filterOption={(input, option) => {
              return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
            maxTagCount={4}
            style={{
              border:
                record.isFirstValid && record.firstValidKey === dataIndex
                  ? '1px solid red'
                  : 'none',
            }}
            ref={inputRef}
            onChange={save}
          >
            {makeOption()}
          </Select>
        );
        break;
      case 'datepicker':
        customNode = (
          <DatePicker
            disabled={disabled}
            ref={inputRef}
            allowClear
            style={{
              border:
                record.isFirstValid && record.firstValidKey === dataIndex
                  ? '1px solid red'
                  : 'none',
            }}
            onChange={save}
          />
        );
        break;
      case 'datepicker-detail':
        customNode = (
          <DatePicker
            disabled={disabled}
            ref={inputRef}
            allowClear
            style={{
              border:
                record.isFirstValid && record.firstValidKey === dataIndex
                  ? '1px solid red'
                  : 'none',
            }}
            onChange={save}
            showTime={{ format: 'HH:mm' }}
          />
        );
        break;
      default:
        customNode = (
          <Input
            disabled={disabled}
            ref={inputRef}
            allowClear
            style={{
              border:
                record.isFirstValid && record.firstValidKey === dataIndex
                  ? '1px solid red'
                  : 'none',
            }}
            onPressEnter={save}
            onBlur={save}
            placeholder="请输入"
          />
        );
        break;
    }
    return customNode;
  };

  const setFormItem = (type: string, width: number, disabled: boolean) => {
    const itemWidth = width ? width + 'px' : '100%';
    return (
      <Form.Item style={{ margin: 0, width: itemWidth }} name={dataIndex}>
        {renderCustomNode(type, index, disabled)}
      </Form.Item>
    );
  };

  const disabeldEdit = setFieldDisabled ? setFieldDisabled(disabled, dataIndex, record) : disabled;

  let childNode = children;

  childNode =
    editable || type == 'upload' ? (
      setFormItem(type, width, disabeldEdit)
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 0 }}>
        {children}
      </div>
    );

  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component<any, any> {
  columns: any;
  depFields: any = {}; // 需要联动的字段

  constructor(props: any) {
    super(props);

    this.columns = !props.disabled
      ? [
          {
            title: '序号1',
            dataIndex: 'tableIndex',
            width: 50,
            showColumn: props.showOrderNum ? 1 : 2,
            fixed: 'left',
          },
          ...props.columns,
          {
            title:
              props.formatMessage && props.formatMessage({ id: 'sula-component.edit-table.action' })
                ? props.formatMessage({
                    id: 'sula-component.edit-table.action',
                  })
                : '操作',
            width: '30',
            showColumn:
              props.onlyOneRow ||
              props.hiddenDelete ||
              props.customOperateCopy ||
              props.customOperateEditToSave ||
              props.resetCopyOperation ||
              props.customOperateRender
                ? 2
                : 1,
            dataIndex: 'operation',
            render: (undefined: undefined, record: any) => {
              const deleteOperate =
                this.state.dataSource.length >= 1 ? (
                  <Popconfirm
                    title={
                      props.formatMessage &&
                      props.formatMessage({
                        id: 'sula-component.edit-table.delete',
                      })
                        ? props.formatMessage({
                            id: 'sula-component.edit-table.delete',
                          })
                        : '确认是否删除？'
                    }
                    onConfirm={() => this.handleDelete(record.key)}
                  >
                    <a>&nbsp;删除</a>
                  </Popconfirm>
                ) : null;
              return deleteOperate;
            },
          },
        ] || []
      : [
          {
            title: '序号1',
            width: 50,
            dataIndex: 'tableIndex',
            showColumn: props.showOrderNum ? 1 : 2,
            fixed: 'left',
          },
          ...props.columns,
        ];
    this.state = {
      dataSource: [],
      count: 0,
      totalVal: 0,
      totalValTwo: 0,
    };
    this.makeColumns(props.columns, props.showMethod);
  }

  handleDelete = (key: string) => {
    const { onChange } = this.props as PropsType;
    const dataSource = [...this.state.dataSource];
    const newData = dataSource.filter((item: any) => item.key !== key);
    const row = dataSource.find((item: any) => item.key === key);
    if (row && this.props.onDeleted) {
      this.props.onDeleted(row);
    }
    this.setState({ dataSource: newData });
    onChange(newData);
  };

  makeColumns = (cols: any[], showMethod: boolean) => {
    this.columns = [
      ...cols,
      showMethod && {
        title: '操作',
        width: '30',
        dataIndex: 'operation',
        render: (undefined: undefined, record: any) => {
          const deleteOperate =
            this.state.dataSource.length >= 1 ? (
              <Popconfirm title="确认是否删除？" onConfirm={() => this.handleDelete(record.key)}>
                <a>&nbsp;删除</a>
              </Popconfirm>
            ) : null;
          return deleteOperate;
        },
      },
    ].filter(Boolean);
  };

  componentDidMount() {
    const { onlyOneRow } = this.props;

    if (onlyOneRow && !this.props.value) {
      this.setState({
        dataSource: [{ key: 1 }],
      });
    } else if (this.props.value) {
      let { count } = this.state;
      const dataSource = this.props.value.map((item: any, index: number) => {
        let key;
        if (isEmpty(item.key)) {
          key = count + 1;
          count = count + 1;
        } else {
          key = item.key;
        }
        return {
          ...item,
          key: key,
          tableIndex: index + 1,
        };
      });
      this.setState({
        dataSource: dataSource,
        count: count,
        total: this.props.value.length,
      });
      if (this.props.totalCountField) {
        const totalVal = this.props.totalCountField.caculateWay({
          tableData: this.props.value,
        });
        this.setState({
          totalVal: totalVal,
        });
      }
      if (this.props.totalCountFieldTwo) {
        const totalValTwo = this.props.totalCountFieldTwo.caculateWay({
          tableData: this.props.value,
        });
        this.setState({
          totalValTwo: totalValTwo,
        });
      }
    }
  }

  // 重新渲染table
  handlerCallback = (nextProps: any) => {
    let { count } = this.state;
    const dataSource = nextProps.value.map((item: any, index: number) => {
      let key;
      if (isEmpty(item.key)) {
        key = count + 1;
        count = count + 1;
      } else {
        key = item.key;
      }
      return {
        ...item,
        key: key,
        tableIndex: index + 1,
      };
    });
    // console.log(dataSource, 'data')
    this.setState({
      dataSource: dataSource,
      count: count,
      total: nextProps.value.length,
    });
    if (nextProps.totalCountField) {
      const totalVal = nextProps.totalCountField.caculateWay({
        tableData: nextProps.value,
      });
      this.setState({
        totalVal,
      });
    }
    if (nextProps.totalCountFieldTwo) {
      const totalValTwo = nextProps.totalCountFieldTwo.caculateWay({
        tableData: nextProps.value,
      });
      this.setState({
        totalValTwo,
      });
    }
  };

  diffValue = (oldValue: any[], newValue: any[]) => {
    return oldValue.some((row: any, index: number) => {
      return JSON.stringify(row) !== JSON.stringify(newValue[index]);
    });
  };

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.value && JSON.stringify(nextProps.value) != JSON.stringify(this.props.value)) {
      // const isAdd = nextProps.value.length > this.props.value.length;
      // const isDelete = nextProps.value.length < this.props.value.length;
      // const isEdit = nextProps.value.length === this.props.value.length;

      // 编辑的时候不要更新Table只进行数据交换
      // 联动需要 setState 更新
      if (
        !nextProps.value ||
        nextProps.value?.length !== this.props.value?.length ||
        this.diffValue(this.props.value, nextProps.value)
      ) {
        this.handlerCallback(nextProps);
      }
    }
    // 点击编辑
    this.makeColumns(nextProps.columns, nextProps.showMethod);
  }

  handleAdd = () => {
    const { columns, onChange, formatAddOn } = this.props as PropsType;
    const { count, dataSource } = this.state;
    const newData = {} as Item;
    columns.forEach((value, index, array) => {
      newData[value.dataIndex] = '';
    });

    // newData.key = `${count + 1}`;

    // 更新最新的数据
    const updateState = (newDataSource: any, newItenData: any) => {
      // 联动需要
      this.setState({
        dataSource: [...dataSource, newData],
        count: count + 1,
      });
      onChange([...newDataSource, newItenData]);
    };

    if (formatAddOn) {
      formatAddOn(newData, dataSource, updateState);
    } else {
      updateState(dataSource, newData);
    }
  };

  handleSave = (row: { key: any; bankAccount?: any }, dataIndex: any, form?: any) => {
    const { onChange, totalCountField, totalCountFieldTwo } = this.props as PropsType;
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item: { key: string }) => row.key === item.key);
    const item = newData[index];

    if (dataIndex != 'fileList') {
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
    } else {
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
    }

    // 联动需要
    this.setState({ dataSource: newData }, () => {
      if (totalCountField) {
        if (dataIndex && dataIndex == totalCountField.dependences) {
          let totalVal = totalCountField.caculateWay({
            tableData: this.state.dataSource,
          });
          this.setState({
            totalVal: totalVal,
          });
        }
      }
      if (totalCountFieldTwo) {
        if (dataIndex && dataIndex == totalCountFieldTwo.dependences) {
          let totalValTwo = totalCountFieldTwo.caculateWay({
            tableData: this.state.dataSource,
          });
          this.setState({
            totalValTwo: totalValTwo,
          });
        }
      }
      onChange(newData);
    });

    if (this.props.onValueChange) {
      this.props.onValueChange(newData);
    }
  };

  render() {
    const { dataSource, costModal } = this.state;

    const {
      disabled,
      addNode,
      formatMessage,
      totalCountField,
      totalCountFieldTwo,
      onlyOneRow,
      hiddenDelete,
      hiddenAdd,
      hiddenAddNum,
      showPagination,
      buttonText,
      Search,
      Export,
      mode,
      tip,
      cellDataFormat,
      ...restProps
    } = this.props as PropsType;
    const { ismarger, isSmall } = this.props as any;

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    let isFirstError = true;

    dataSource.forEach((item: any) => {
      delete item.isFirstValid;
      delete item.firstValidKey;
      this.columns.forEach((value: any) => {
        if (value.isRequired) {
          if (item[value.dataIndex] === undefined && isFirstError) {
            item.isFirstValid = true;
            isFirstError = false;
            item.firstValidKey = value.dataIndex;
          }
        }
        if (cellDataFormat) {
          cellDataFormat(item, value);
        }
      });
    });

    const columns = this.columns.map((col: Item) => {
      const title = col.title;
      if (!col.editable && col.type != 'upload') {
        return {
          ...col,
          title: () => (
            <div style={{ width: col.width ? col.width : 'auto' }}>
              {col.isRequired || col.isRequiredTwo ? <span style={{ color: 'red' }}>*</span> : ''}
              {title}
            </div>
          ),
        };
      }
      return {
        ...col,
        title: () => (
          <div style={{ width: col.width ? col.width : 'auto' }}>
            {col.isRequired || col.isRequiredTwo ? <span style={{ color: 'red' }}>*</span> : ''}
            {title}
          </div>
        ),
        onCell: (record: any, index: number) => ({
          ...col,
          record,
          index,
          editable: true,
          disabled: col.disabled,
          dataIndex: col.dataIndex,
          type: col.type,
          setFieldDisabled: this.props.setFieldDisabled,
          title: () => <div>*{title}</div>,
          handleSave: this.handleSave,
          dataSource: this.state.dataSource,
          isRequired: col.isRequired,
          isRequiredTwo: col.isRequiredTwo,
          width: col.width,
          min: col.min,
          max: col.max,
          step: col.step,
          columnData: col,
        }),
      };
    });

    const isEdit = mode === 'edit';
    const showBar = addNode || buttonText;

    return (
      <div
        className={[
          styles.edit_table,
          ismarger ? styles.ismarger : null,
          isSmall ? styles.isSmall : null,
        ].join(' ')}
      >
        {showBar && (
          <div
            style={{
              marginBottom: '10px',
              height: '28px',
            }}
          >
            <div className="flex align-center">
              {Search}
              {addNode ? (
                <span onClick={this.handleAdd}>{addNode}</span>
              ) : (
                <Button onClick={this.handleAdd} type="primary">
                  {formatMessage && formatMessage({ id: 'sula-component.edit-table.addRow' })
                    ? formatMessage({ id: 'sula-component.edit-table.addRow' })
                    : buttonText || '添加一行'}
                </Button>
              )}
              {isEdit && Export}
            </div>
          </div>
        )}

        {tip && (
          <div className={styles.table_tip}>
            <ExclamationCircleOutlined style={{ marginRight: '5px' }} />
            {tip}
          </div>
        )}

        <Table
          {...restProps}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          pagination={showPagination ? {} : false}
          dataSource={dataSource}
          columns={columns}
          onChange={this.onPageChange}
          rowKey="key"
          scroll={{ x: 'auto' }}
        />
        <p
          style={{
            display: totalCountField ? 'block' : 'none',
            color: 'black',
            marginBottom: '15px',
            fontWeight: 'bold',
          }}
        >
          <span>{totalCountField && totalCountField.label}</span>
          {this.state.totalVal}
        </p>
        <p
          style={{
            display: totalCountFieldTwo ? 'block' : 'none',
            color: 'black',
            marginBottom: '15px',
            fontWeight: 'bold',
          }}
        >
          <span>{totalCountFieldTwo && totalCountFieldTwo.label}</span>
          {this.state.totalValTwo}
        </p>
      </div>
    );
  }
}

export default EditableTable;
