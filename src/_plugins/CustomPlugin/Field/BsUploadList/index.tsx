import React from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { request } from 'umi';
import { download } from '@/_utils/utils';

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

interface ComponentState {
  fileList: any[];
  previewVisible: boolean;
  previewImage: string;
  previewTitle?: string;
  fileListIds: any[];
  loading: boolean;
}

export default class PicturesWall extends React.Component<any, ComponentState> {
  prevValue = null;

  constructor(props: any) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: [],
      fileListIds: [],
      loading: false,
    };
  }

  componentDidUpdate(nextProps: any) {
    if (this.prevValue !== nextProps.value && Array.isArray(nextProps.value)) {
      this.setState({ fileList: nextProps.value }, () => {
        this.prevValue = nextProps.value;
      });
    }
  }

  isPic = (file: any) => {
    const fileTypes = ['.jpg', '.png', '.jpeg'];
    const test = file.url || file.name;
    return fileTypes.some((type: string) => test.indexOf(type) > -1);
  };

  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  handlePreview = async (file: any) => {
    console.log(file);
    if (!this.isPic(file)) {
      download(file.name, file.url);
      // 下载
    } else {
      if (!file.url && !file.preview) {
        // eslint-disable-next-line no-param-reassign
        file.preview = await getBase64(file.originFileObj);
      }

      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        // previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      });
    }
  };

  handleChange = (info: any) => {
    console.log(info);
    const { onChange, url, allFile }: any = this.props;
    const fileList = this.state.fileList;
    const isFile = !this.isPic(info.file);
    this.setState({
      loading: true,
    });
    if (info && info?.fileList?.length && info.fileList.length > fileList.length) {
      console.log(info, 'info');
      const formdata = new FormData();
      formdata.append('file ', info.file);
      request(url || '/api/base/upload/oss/order/template', {
        method: 'POST',
        data: formdata,
      })
        .then((res: any) => {
          const { data } = res;
          this.setState(
            {
              fileList: [
                ...fileList,
                isFile || allFile ? { name: info.file.name, url: data } : data,
              ],
            },
            () => onChange(this.state.fileList),
          );
        })
        .finally(() => {
          this.setState({ loading: false });
          console.log(this.state);
        });
    } else {
      this.setState({ loading: false });
    }
  };

  handleRemove = (file: any) => {
    const { onChange }: any = this.props;
    this.setState((state: any) => {
      const index = state.fileList.indexOf(file);
      const newFileList = state.fileList.slice();
      newFileList.splice(index, 1);
      const newFileListIds = state.fileListIds.slice();
      newFileListIds.splice(index, 1);
      if (onChange) {
        onChange(newFileListIds);
      }
      return { fileList: newFileList, fileListIds: newFileListIds };
    });
  };

  render() {
    // @ts-ignore
    const { previewVisible, previewImage, fileList, previewTitle, loading } = this.state;
    const {
      url,
      maxCount,
      uploadTitle,
      ctx = {},
      listType = 'picture-card',
      suffixRule = ['.png', '.jpg', '.jpeg'],
      size = 10,
      title,
      disabled,
      align = 'left',
    }: any = this.props;
    const uploadButton = (
      <div className="flex-center flex-column">
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>{uploadTitle || '上传图片'}</div>
      </div>
    );
    return (
      <div style={{ textAlign: align }}>
        {title || ''}
        <Upload
          maxCount={maxCount || 8}
          action={url || '/api/base/upload/oss/order/template'}
          listType={listType}
          // @ts-ignore
          fileList={fileList}
          onPreview={this.handlePreview}
          accept=""
          disabled={ctx.mode === 'view' || disabled}
          onRemove={this.handleRemove}
          onChange={this.handleChange}
          // @ts-ignore
          beforeUpload={(file: any) => {
            // 文件校验
            const extName = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            if (file.size > size * 1024 * 1024) {
              message.error(`上传文件不能超过${size}M!`);
              return Upload.LIST_IGNORE;
            }
            if (suffixRule.length > 0 && !suffixRule.includes(extName)) {
              message.error(`请上传${suffixRule.toString()}等格式的文件!`);
              return Upload.LIST_IGNORE;
            }
            return false;
          }}
        >
          {fileList.length >= (maxCount || 8) || ctx.mode === 'view' || disabled
            ? null
            : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
