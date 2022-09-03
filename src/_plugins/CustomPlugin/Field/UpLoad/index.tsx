import React from 'react';
import { Upload, message, Button, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { request } from 'sula';
import styles from './index.less';

interface PropsType {
  // sula register props
  // onChange: (value: any) => {};
  formatMessage?: (title: { id: string }) => {};
  ctx: any;
  id: string;
  promptInfo?: string; // 上传按钮下方的文件类型提示信息
  className?: string; // 类名，方便重写upload组件样式, 在index.less里面写上对应的样式
  maxUploadSize?: number; // 上传大小限制, 单位兆（M），默认上传最大限制10M
  fileType?: string; // 支持的文件上传格式, 默认不限制
}

export default class uploadField extends React.Component {
  state = {
    fileList: [],
    uploading: false,
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    invoiceDisable: false,
  };

  constructor(props: PropsType) {
    super(props);
  }

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      let tempValue = undefined;

      try {
        tempValue = value ? JSON.parse(value) : undefined;
      } catch {}
      this.setState({
        fileList: Array.isArray(tempValue) ? tempValue : [],
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      let tempValue = undefined;

      try {
        tempValue = nextProps.value ? JSON.parse(nextProps.value) : undefined;
      } catch {}

      this.setState({
        fileList: Array.isArray(tempValue) ? tempValue : [],
      });
    }
  }

  onChange = ({ fileList }) => {
    const { invoice, ctx, mode } = this.props as any;
    if (invoice && fileList.length == 0) {
      ctx.form.setFieldValue('invoiceServiceInfos', [{}]);
    }
    console.log('Aliyun OSS:', fileList);
  };

  onRemove = (file) => {
    const { fileList } = this.state;
    const { ctx, id } = this.props;
    const files = fileList.filter((v) => v.url !== file.url);
    this.setState(
      {
        fileList: files,
      },
      () => {
        if (this.props.isOrigin) {
          this.props.updateRecord({
            ...this.props.record,
            [this.props.urlproperty]: JSON.stringify(files),
          });
        } else {
          ctx.form.setFieldValue(id, JSON.stringify(files));
        }
      },
    );
  };

  beforeUpload = async (file) => {
    const extName = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const { maxUploadSize = 10, fileType = '' } = this.props;
    if (maxUploadSize && Number((Number(file.size) / 1024 / 1024).toFixed(2)) > maxUploadSize) {
      message.error(`上传文件大小不能超过${maxUploadSize}M`);
      return false;
    }
    if (fileType && fileType.length > 0 && fileType.indexOf(extName) == -1) {
      message.error(`请上传 ${fileType.toString()} 等格式的文件!`);
      return Upload.LIST_IGNORE;
    }
    return file;
  };

  doImgUpload = (options) => {
    const { file } = options;
    const { onlyImg, extraParams, invoice } = this.props as any;
    const rFilter =
      /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    if (onlyImg) {
      if (!rFilter.test(file.type)) {
        message.error('只能上传图片类型文件');
        return;
      }
    }
    const formData = new FormData();
    formData.append('file', file);
    // 额外的参数, 参数格式extraParams: [ [filedName, value] ]
    extraParams &&
      extraParams?.forEach((item: any) => {
        formData.append(item[0], item[1]);
      });
    this.setState({ uploading: true });
    request({
      url: this.props.url,
      method: 'post',
      params: formData,
    })
      .then((res: any) => {
        /* **** */
        if (
          this.props.url == '/goldjet-ops-platform/quotation/importDemo' ||
          this.props.url == '/goldjet-ops-platform/businessCost/importBusinessCosts'
        ) {
          console.log(this.props.url, res);
          message.success('报价上传成功');
          this.setState({ uploading: false });
          return;
        }
        /* **** */
        message.success('文件上传成功');
        const { ctx, id, isUploadSLI } = this.props;
        const { fileList } = this.state;
        let imgItem = {};
        if (invoice) {
          imgItem = {
            name: file.name,
            url: res.url,
            excludeTaxAmount: res.totalAmount,
            totalAmount: res.totalAmount,
            taxAmount: res.totalRateAmount,
            invoiceServiceInfos: res.serviceInfoResDtoList,
          };
        } else {
          imgItem = {
            name: file.name,
            url: res,
          };
        }
        fileList.push(imgItem);
        if (isUploadSLI) {
          const orignialData = ctx.form.getFieldsValue(true);
          console.log(orignialData);
          orignialData &&
            orignialData.billLading &&
            orignialData.billLading.billLadingNo &&
            request({
              url: '/goldjet-ops-platform/orderApp/upLoadShippers',
              method: 'post',
              params: {
                billLadingNo: orignialData.billLading.billLadingNo,
                imgUrl: fileList.map((item) => {
                  return item.url;
                }),
              },
            });
        }
        this.setState(
          {
            fileList: fileList,
            uploading: false,
          },
          () => {
            if (this.props.isOrigin) {
              this.props.updateRecord({
                ...this.props.record,
                [this.props.urlproperty]: JSON.stringify(fileList),
              });
            } else if (invoice) {
              ctx.form.setFieldValue(id, JSON.stringify(fileList));
              ctx.form.setFieldValue('invoiceServiceInfos', res.serviceInfoResDtoList);
            } else {
              ctx.form.setFieldValue(id, JSON.stringify(fileList));
            }
          },
        );
      })
      .catch((e: any) => {
        if (e == '已经存在该条报价') {
          this.setState({ uploading: false });
          return;
        }
        message.error('文件上传失败，请重试');
        this.setState({ uploading: false });
      });
  };

  onPreview = (file) => {
    console.log(file);
    if (this.props.isshow) {
      this.setState({
        previewImage: file.url,
        previewVisible: true,
        previewTitle: file.name,
      });
      return;
    }
    try {
      // 创建隐藏的可下载链接
      var eleLink = document.createElement('a');
      if (file && file.name) {
        eleLink.download = file.name;
      }
      eleLink.style.display = 'none';
      // 字符内容转变成blob地址
      // var blob = new Blob([content]);
      // var blob =content;
      // eleLink.href = URL.createObjectURL(blob);
      let url = file.url.replace('http:', 'https:');
      eleLink.href = url;
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
    } catch (e) {}
  };
  // 预览图片
  handleCancel = () => {
    this.setState({
      previewVisible: false,
    });
  };
  render() {
    const props = {
      name: 'file',
      fileList: this.state.fileList,
      customRequest: this.doImgUpload,
      listType: 'text',
      onChange: this.onChange,
      onRemove: this.onRemove,
      onPreview: this.onPreview,
      beforeUpload: this.beforeUpload,
    };
    const { ctx, onlyShow, disabled, maxCount, promptInfo, buttonProps, className } = this.props;
    const { uploading, previewVisible, previewImage, previewTitle, invoiceDisable } = this.state;

    const maxCountDisable = maxCount <= this.state.fileList.length; // 最大上传数量限制(注意: Upload的disabled属性如果是true,那么已经上传的就无法删除了 )
    return (
      <div className={styles[className]} style={{ display: 'flex' }}>
        <span
          style={{
            display: this.props.required ? 'inline-block' : 'none',
            color: 'red',
            verticalAlign: 'bottom',
          }}
        >
          *
        </span>
        <Upload disabled={disabled || ctx.mode === 'view' || onlyShow || invoiceDisable} {...props}>
          {ctx.mode !== 'view' && !onlyShow && (
            <Button
              disabled={disabled || maxCountDisable}
              loading={uploading}
              icon={<UploadOutlined />}
              type="link"
            >
              上传文件
            </Button>
          )}
        </Upload>
        {promptInfo && (
          <div
            style={{ marginTop: 7, position: 'absolute', left: 100 }}
            dangerouslySetInnerHTML={{ __html: promptInfo }}
          />
        )}
        {buttonProps && <Button {...buttonProps}>{buttonProps.name}</Button>}
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
          width="700px"
        >
          <img alt="example" style={{ width: '650px' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
