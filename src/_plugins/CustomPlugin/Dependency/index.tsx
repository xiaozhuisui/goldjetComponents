// @ts-ignore
import sula from 'sula/es/core';

// 表单项frameType选中“列表取值”时，表单项name出现，否则隐藏
sula.dependencyType('propertyNameDependency1', (ctx: any) => {
  const { name, form, values } = ctx || {};
  if (values[0] === 10) {
    form.setFieldVisible(name[0], true);
  } else {
    form.setFieldVisible(name[0], false);
  }
});

// 表单项frameType选中非“列表取值”时，表单项name出现，否则隐藏
sula.dependencyType('propertyNameDependency2', (ctx: any) => {
  const { name, form, values } = ctx || {};
  if (values[0] !== 10) {
    form.setFieldVisible(name[0], true);
  } else {
    form.setFieldVisible(name[0], false);
  }
});

// 表单项frameType选中“零售户店主”时，表单项name出现，否则隐藏
sula.dependencyType('personType1', (ctx: any) => {
  const { name, form, values, mode } = ctx || {};
  if (values[0] === 50 && mode === 'view') {
    form.setFieldVisible(name[0], true);
  } else {
    form.setFieldVisible(name[0], false);
  }
});

// 创建类目-商品模式
sula.dependencyType('categoryTypeDependency', (ctx: any) => {
  const { name, form, values } = ctx || {};
  if (values[0] === '1') {
    form.setFieldVisible(name[0], true);
  } else {
    form.setFieldVisible(name[0], false);
  }
});

// 创建类目-商品模式-单极
sula.dependencyType('createModeDependency1', (ctx: any) => {
  const { name, form, values } = ctx || {};
  if (values[1] === '1' && (values[0] === '1' || values[0] === '2')) {
    form.setFieldVisible(name[0], true);
  } else {
    form.setFieldVisible(name[0], false);
  }
});

// 创建类目-商品模式-两级
sula.dependencyType('createModeDependency2', (ctx: any) => {
  const { name, form, values } = ctx || {};
  if (values[1] === '1' && values[0] === '2') {
    form.setFieldVisible(name[0], true);
  } else {
    form.setFieldVisible(name[0], false);
  }
});

// 物理仓MDM同步字段 依赖数据来源
sula.dependencyType('createDataSourceDependency', (ctx: any) => {
  const { name, form, values } = ctx || {};
  if (values[0] === 10) {
    form.setFieldVisible(name[0], true);
  } else {
    form.setFieldVisible(name[0], false);
  }
});
