/*
 * @Description:
 * @Author: minghuiXiao
 * @Date: 2021-06-27 15:58:26
 * @LastEditTime: 2022-09-03 18:28:39
 * @LastEditors: 追随
 */
import RemoteSearch from '@/_components/RemoteSearch';
import RemoteDepartmentTreeSelect from '@/_components/RemoteSearch/departmentTreeSelect';
import RemoteSearchNeedShowOpt from '@/_components/RemoteSearch/searchShowOpt';
import RemoteStationNeedShowOpt from '@/_components/RemoteSearch/stationShowOpt';
import RemoteSearchTreeSelect from '@/_components/RemoteSearch/treeSelect';
import { getDictionaryTextByValue, isValidateValue } from '@/_utils/utils';
import { Col, Input, Radio, Select, DatePicker } from 'antd';
import { registerFieldPlugin, request } from 'sula';
import moment from 'moment';
import { history } from 'umi';
import BsTextArea from './BsBatchTextArea';
import BsCascader from './BsCascader';
import BsCascaderAddress from './BsCascaderByAddress';
import BsEditTable from './BsEditTable';
import BsImage from './BsImage';
import BsInputRate from './BsInputRate';
import BsMultipleInput from './BsMultipleInput';
import BsNumberRange from './BsNumberRange';
import BsSearchSelect from './BsSearchSelect';
import BsTableField from './BsTableField';
import BsUploadList from './BsUploadList';
import EditTable from './EditTable';
import searchSelect from './GjSearchSelect';
import newVehicleDispatch from './newVehicleDispatch';
import sula from 'sula/es/core';
import BsCheckBoxgroup from './BsCheckBoxGroup';

const { Option } = Select;
/** field插件 */
registerFieldPlugin('editTable')(EditTable, true, true);
registerFieldPlugin('bs-cascader')(BsCascader, true, true);
registerFieldPlugin('bs-cascader-address')(BsCascaderAddress, true, true);
registerFieldPlugin('bs-image')(BsImage, true, true);
/* ***************************** 上传图片 ******************************** */
registerFieldPlugin('bs-uploadList')(BsUploadList, true, true);
/* ***************************** input下面带有小旗子 ******************************** */
registerFieldPlugin('bs-inputRate')(BsInputRate, true, true);
/* ***************************** 数字范围 ******************************** */
registerFieldPlugin('bs-numberRange')(BsNumberRange, true, true);

/* ***************************** 表单项 - 不可编辑表格 **************************** */
registerFieldPlugin('bs-TableField')(BsTableField, true, true);

/* ***************************** 表单项 - 可编辑表格（未完成） ****************************** */
// registerFieldPlugin('bs-editTableField')(BsEditTableField, true, true);

/* ***************************** 重复项校验 **************************** */
registerFieldPlugin('bs-testItemInput')(
  (ctx: any) => {
    const {
      onChange,
      requstCfg, // 请求内容
    } = ctx;

    /* 请求数据，获取数据源，然后比对当前值 */
    // 接口数据
    let data;
    request({
      ...requstCfg,
    }).then((res: any) => {
      data = res.items;
      console.log(data);
    });

    // 临时数据源
    const testArr = ['a', 'b', 'c', 'd'];

    const handleOnChange = (e: any) => {
      const hasName = testArr.some((item: any) => item === e.target.value);
      if (hasName) {
        return onChange('hasItem');
      }
      return onChange(e.target.value);
    };
    return (
      <div>
        <Input onChange={handleOnChange} />
      </div>
    );
  },
  true,
  true,
);

/* ***************************** Form Field 双行文本 ******************************** */
// 支持 sula Form field支持 自定义 input 和 select
registerFieldPlugin('form-two-text')(
  (context: any) => {
    const { onChange, source, value, id, ctx, disabled, ...reset } = context;
    const {
      type = 'input',
      label = '', // 第一行是label
      description = '', // 第二行描述
      labelCol = 8,
      wrapperCol = 16,
      required = false,
      ...comProps
    } = reset || {};

    let ControlComponent = (
      <Input value={value} disabled={disabled} {...comProps} onChange={onChange}></Input>
    );
    if (type === 'select') {
      ControlComponent = (
        <Select value={value} disabled={disabled} {...comProps} onChange={onChange}>
          {(source || []).map((item: any, index: number) => {
            <Option value={item.value} key={index}>
              {item.text}
            </Option>;
          })}
        </Select>
      );
    }

    return (
      <div className="flex align-center">
        <Col span={labelCol} style={{ textAlign: 'right', color: 'rgba(44, 47, 46, 0.85)' }}>
          <div>
            {required && <span style={{ color: 'red' }}>*</span>}
            {label}：
          </div>
          <div style={{ paddingRight: '5px' }}>{description}</div>
        </Col>
        <Col span={wrapperCol}>{ControlComponent}</Col>
      </div>
    );
  },
  true,
  true,
);

/* ***************************** 文本text ******************************** */
registerFieldPlugin('text')(
  (ctx: any) => {
    return <div>{ctx.value}</div>;
  },
  true,
  true,
);

/* ***************************** radio switch ******************************** */
registerFieldPlugin('radio-switch')(
  (ctx: any) => {
    const { labels = ['是', '否'], values = [true, false] } = ctx;
    return (
      <Radio.Group disabled={ctx.disabled} onChange={ctx.onChange} value={ctx.value}>
        <Radio value={values[0]}>{labels[0]}</Radio>
        <Radio value={values[1]}>{labels[1]}</Radio>
      </Radio.Group>
    );
  },
  true,
  true,
);

/* ***************************** form详情文字项 ******************************** */
registerFieldPlugin('bs-formText')(
  ({ ctx, text, id, formatDate, value, color, href, dicName, renderText, format, map }: any) => {
    if (renderText) {
      return <span>{renderText(value, ctx)}</span>;
    }
    // 处理时间 需要先引入 moment ， 然后在页面的适用时， 在props下传入一个moment的时间格式(如: YYYY-MM-DD)
    if (formatDate) {
      if (!ctx.form.getFieldsValue(true)[id]) return '';
      return moment(ctx.form.getFieldsValue(true)[id]).format(formatDate);
    }
    if (format) {
      return moment(value).format(format);
    }
    let textVal = '';
    // 非空校验
    if (isValidateValue(ctx.form.getFieldValue(id))) {
      textVal = ctx.form.getFieldValue(id);
    } else if (isValidateValue(value)) {
      textVal = value;
    } else if (dicName) {
      textVal = getDictionaryTextByValue(dicName, value);
    } else {
      textVal = text;
    }

    if (href) {
      return (
        <a
          onClick={() => {
            history.push(`/order-management/sales-order-list/detail/${textVal}`);
          }}
        >
          {textVal}
        </a>
      );
    }

    return <span style={{ color }}>{textVal}</span>;
  },
  true,
  true,
);

/* ***************************** 基本select ******************************** */
registerFieldPlugin('bs-remoteSearch')(RemoteSearch, true, true); // 注入 source 和 ctx

/* ***************************** 分组select ******************************** */
registerFieldPlugin('bs-remoteSearchNeedShowOpt')(RemoteSearchNeedShowOpt, true, true);

/* ***************************** 树选择 ******************************** */
registerFieldPlugin('bs-remoteSearchTreeSelect')(RemoteSearchTreeSelect, true, true);

/* ***************************** 分组树选择 ******************************** */
registerFieldPlugin('bs-remoteDepartmentTreeSelect')(RemoteDepartmentTreeSelect, true, true);

/* ***************************** 分组select ******************************** */
registerFieldPlugin('bs-remoteStationNeedShowOpt')(RemoteStationNeedShowOpt, true, true);

/* ***************************** 获取远程数据select ******************************** */
registerFieldPlugin('bs-searchSelect')(BsSearchSelect, true, true);
/* ***************************** 获取远程数据select ******************************** */
registerFieldPlugin('searchSelect')(searchSelect, true, true);

registerFieldPlugin('bs-editTable')(BsEditTable, true, true);

registerFieldPlugin('bs-textArea')(BsTextArea, true, true);
/* **************多条数据通过回车或者空格分隔输入，结果返回','分割的数据TextArea ******************************** */
registerFieldPlugin('bs-multipleInput')(BsMultipleInput, true, true);
/* ********************************************运输服务 ************************************************** */
registerFieldPlugin('bs-newVehicleDispatch')(newVehicleDispatch, true, true);

sula.validatorType('bs-newVehicleDispatch', (ctx) => {
  const FieldName = {
    vehicleType: '车型',
    supplierNo: '供应商名称',
    licensePlateNumber: '车牌号',
    specificGoodsWeight: '特定提货重量',
  };
  const fieldsValue = ctx.form.getFieldsValue(true);
  const { value, name } = ctx || {};
  const ErrorArray = [];
  console.log(!value, 'valuevalue');

  if (value.length === 0) return Promise.reject('供应商名称不能为空');
  if (fieldsValue && Array.isArray(fieldsValue.requiredField)) {
    value.forEach((row, index) => {
      fieldsValue.requiredField.forEach((item) => {
        if (!row[item]) {
          ErrorArray.push(`${FieldName[item]}不能为空`);
        }
      });
    });
  } else {
    value.forEach((row, index) => {
      if (!row.vehicleType) {
        ErrorArray.push(`车型不能为空`);
      }
      if (!row.supplierNo) {
        ErrorArray.push(`供应商名称不能为空`);
      }
      if (!row.licensePlateNumber) {
        ErrorArray.push(`车牌号不能为空`);
      }
      if (fieldsValue && fieldsValue.orderType == '20') {
        if (!row.specificGoodsWeight) {
          ErrorArray.push(`特定提货重量不能为空`);
        }
      }
    });
  }
  if (ErrorArray.length) {
    return Promise.reject(ErrorArray[0]);
  }
  return Promise.resolve();
});

registerFieldPlugin('bs-checkboxgroup')(BsCheckBoxgroup, true, true);
