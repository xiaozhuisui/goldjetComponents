import { Radio } from 'antd';
import { registerFieldPlugin } from 'sula';
import { useEffect, useState } from 'react';

interface BupCheckProps {
  value: string;
  source: Array<{ value: string | number; label: string }>;
  onChange: (value: any) => void;
  disabled: boolean;
}

const BupCheck = (props: BupCheckProps) => {
  const { value: propsValue, source = [], disabled = false, onChange: propsOnChange } = props;
  const [value, setValue] = useState<any>(propsValue);

  useEffect(() => {
    setValue(propsValue);
  }, [propsValue]);

  const onChang = (e: any) => {
    if (propsOnChange && typeof propsOnChange == 'function') {
      propsOnChange(e.target.value);
    }
  };

  return (
    <Radio.Group value={value} disabled={disabled} onChange={onChang}>
      {(source || []).map((item) => (
        <Radio value={item.value}>{item.label}</Radio>
      ))}
    </Radio.Group>
  );
};

registerFieldPlugin('gj-bup-check')(BupCheck, true, true);
