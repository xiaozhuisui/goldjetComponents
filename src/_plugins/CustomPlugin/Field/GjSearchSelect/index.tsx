/*
 * @Date: 2022-03-25 17:59:18
 * @LastEditors: 追随
 * @LastEditTime: 2022-08-09 16:29:44
 */
import { Select as ASelect } from 'antd';
import { OptionProps, SelectProps as ASelectProps } from 'antd/lib/select';
import React from 'react';

export type SelectSourceItem = {
  text: any;
} & Omit<OptionProps, 'children'>;

export interface SelectGroupItem {
  text: any;
  children: SelectSourceItem[];
}

export interface SelectProps extends ASelectProps<any> {
  source: Array<SelectSourceItem | SelectGroupItem>;
}

export default class Select extends React.Component<SelectProps> {
  renderOption = (item: SelectSourceItem) => {
    const { text, value, ...restProps } = item;
    return (
      <ASelect.Option value={value} key={value} {...restProps}>
        {text}
      </ASelect.Option>
    );
  };

  renderGroupOptions = (group: SelectGroupItem) => {
    return (
      <ASelect.OptGroup key={group.text} label={group.text}>
        {(group.children as SelectSourceItem[]).map((item) => {
          return this.renderOption(item);
        })}
      </ASelect.OptGroup>
    );
  };

  handleChange = (e: any, row: any) => {
    //@ts-ignore
    const { onChange, name, ctx } = this.props;
    //@ts-ignore
    onChange(e);
    if (name) {
      ctx.form.setFieldValue(name, row.children);
    }
  };
  render() {
    const { source = [], ...restProps } = this.props;
    return (
      <ASelect
        {...restProps}
        showSearch
        onChange={this.handleChange}
        filterOption={(input, option) =>
          (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
        }
      >
        {source.map((item) => {
          if ((item as SelectGroupItem).children) {
            return this.renderGroupOptions(item as SelectGroupItem);
          }
          return this.renderOption(item as SelectSourceItem);
        })}
      </ASelect>
    );
  }
}
