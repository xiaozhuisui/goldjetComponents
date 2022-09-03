import { useState } from 'react';
import { Input } from 'antd';
const { TextArea } = Input;

export default (props: any) => {
  const { onChange } = props;
  const [inputValue, setInputValue] = useState('');
  const onChangeValue = (e: any) => {
    const {
      target: { value },
    } = e;
    setInputValue(value);
    onChange(
      value
        ?.split(/[\s\n]/g)
        ?.filter((item: any) => item)
        ?.join(','),
    );
  };
  return <TextArea rows={1} value={inputValue} onChange={onChangeValue} />;
};
