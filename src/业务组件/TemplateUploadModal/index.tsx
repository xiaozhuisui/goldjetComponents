/*
 * @Date: 2022-08-01 14:30:46
 * @LastEditors: 追随
 * @LastEditTime: 2022-10-09 18:59:59
 */
import { InboxOutlined } from '@ant-design/icons';
import { Button, message, Modal, Upload, UploadProps } from 'antd';
import { RcFile } from 'antd/lib/upload';
import React from 'react';
import { useState } from 'react';
import { request } from 'umi';
const { Dragger } = Upload;
export interface ITemplateUploadModalProps {
  /**
   * @description      是否多选
   * @default false
   */
  multiple?: boolean;
  /**
   * @description       点击完成按钮后的事件
   * @default
   */
  success?: Function;
  /**
   * @description  modal标题
   * @default 导入
   */
  title?: string;
  /**
   * @description  按钮标题
   * @default 上传
   */
  buttonText?: string;
  /**
   * @description  模板文字
   * @default linkText
   */
  linkText?: string;
  /**
   * @description       后端提供的下载模板地址
   * @default
   */
  url: string;
  /**
   * @description       最多上传多少份文件
   * @default 1
   */
  maxCount?: number;
}
const TemplateUploadModal: React.FC<ITemplateUploadModalProps> = (
  props: ITemplateUploadModalProps,
) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState<any>();
  const {
    multiple = false,
    success,
    // action,
    title = '导入',
    buttonText = '上传',
    linkText = '下载模板',
    url = '',
    maxCount = 1,
  } = props;
  const draggerProps: UploadProps = {
    // name: 'file',
    multiple,
    beforeUpload: (file, list) => {
      setFileData(file);
      return false;
    },
    maxCount,
    onChange(info) {
      // const { status } = info.file;
      // setLoading(true);
      // if (status !== 'uploading') {
      //   console.log(info.file, info.fileList);
      // }
      // if (status === 'done') {
      //   message.success(`${info.file.name} 上传成功！`);
      //   setFileData(info);
      //   setLoading(false);
      // } else if (status === 'error') {
      //   message.error(`${info.file.name} 上传失败！`);
      //   setLoading(false);
      // }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  // 下载模板
  const handleDown = async () => {
    const { success, data } = await request(url, { method: 'get' });
    if (success) {
      window.open(data);
    }
  };
  // 处理完成事件
  const handleOk = () => {
    if (!fileData) {
      return message.error('请上传模板');
    }
    success?.(fileData);
    setVisible(false);
  };
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        {buttonText}
      </Button>
      <Modal
        title={title}
        visible={visible}
        destroyOnClose
        okButtonProps={{ loading }}
        onCancel={() => setVisible(false)}
        onOk={handleOk}
      >
        <>
          <Button type="link" onClick={handleDown}>
            {linkText}
          </Button>
          <div style={{ height: 30 }}></div>
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽您要上传的文件到此框中</p>
          </Dragger>
        </>
      </Modal>
    </>
  );
};

export default TemplateUploadModal;
