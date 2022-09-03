import React from 'react';
import { Form, Table } from 'antd';
import cx from 'classnames';
import type { FieldProps } from 'sula';
import { Field } from 'sula';
import type { Dependencies, DependencyType } from 'sula';
import { toArray } from '@/_utils/utils';
import type { FieldNameList, FieldNamePath } from 'sula';
import { LocaleReceiver } from 'sula';
import './index.less';

interface FieldData {
  name: number;
  key: number;
  fieldKey: number;
  [key: string]: any;
}

export interface EditableProps {
  fields: FieldProps[];
  name: FieldNamePath;
}

export default class Editable extends React.Component<EditableProps> {
  static defaultProps = {
    fields: [],
  };

  renderField = (field: FieldData, fieldConfig: FieldProps, isViewMode: boolean) => {
    const { name, key, fieldKey, ...restField } = field;
    const { dependency = {} as Dependencies, label, ...restFieldConfig } = fieldConfig;
    const transformedDep = Object.keys(dependency).reduce(
      (memo: Dependencies, depType: DependencyType) => {
        const dep = dependency[depType];
        const relates = dep!.relates.map((r) => {
          return [fieldKey, ...toArray(r)];
        });
        memo[depType] = {
          ...dep,
          relates,
        };
        return memo;
      },
      {},
    ) as Dependencies;

    const fieldName = [name, ...toArray(fieldConfig.name)] as FieldNameList;
    const fieldNameKey = [fieldKey, ...toArray(fieldConfig.name)];

    return (
      <Field
        {...restField}
        {...restFieldConfig}
        noStyle={isViewMode}
        key={key}
        name={fieldName}
        fieldKey={fieldNameKey}
        dependency={transformedDep}
      />
    );
  };

  render() {
    const { list, ctx, scroll = { x: 'max-content' } } = this.props;
    const [fields, { add, remove }, { errors }] = list;
    const { mode } = ctx;
    const isViewMode = mode === 'view';
    return (
      <LocaleReceiver>
        {(locale) => {
          return (
            <div>
              <Table<FieldData>
                className={cx('sula-editable', {
                  [`sula-editable-view`]: isViewMode,
                })}
                scroll={scroll}
                pagination={false}
                dataSource={fields}
                rowKey="fieldKey"
                columns={[
                  ...this.props.fields.map((fieldConfig) => {
                    return {
                      title: fieldConfig.label,
                      key: toArray(fieldConfig.name).join('_'),
                      width: fieldConfig.width,
                      render: (_: any, field: FieldData) => {
                        return this.renderField(field, fieldConfig, isViewMode);
                      },
                    };
                  }),
                ]}
              />
              <Form.ErrorList errors={errors} />
            </div>
          );
        }}
      </LocaleReceiver>
    );
  }
}
