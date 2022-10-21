/*
 * @Date: 2022-10-17 14:08:32
 * @LastEditors: 追随
 * @LastEditTime: 2022-10-17 16:00:45
 */
import React, { useImperativeHandle, useRef, forwardRef, useEffect, useState } from 'react';
import { ModalForm } from 'sula';
interface Iprops {}
interface IField {
  name: string | string[];
  label?: string;
  field: string | { type: () => JSX.Element; props: { [key: string]: any } };
}
interface showProps {
  title: string;
  initialValues?: { [key: string]: any };
  fields: IField[];
  submit: any;
}
interface IRef {
  show: (...arg: any) => void;
}
function SyncModalForm(props: Iprops, propsRef: any) {
  const [modalProps, setModalProps] = useState<showProps | undefined>();
  const ref = useRef<IRef>(null);
  useEffect(() => {
    if (modalProps) {
      if (ref.current) {
        ref.current.show(modalProps);
      }
    }
  }, [modalProps]);

  useImperativeHandle(propsRef, () => ({
    show: (data: showProps) => {
      setModalProps(data);
    },
  }));
  return <ModalForm type="modal" ref={ref}></ModalForm>;
}
export default forwardRef(SyncModalForm);
