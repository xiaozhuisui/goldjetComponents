import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Modal, Table, Row, Col, Pagination, Radio, Space } from 'antd';
import styles from './index.less';
// import { request } from 'sula';
/* **** */
import { request, Form, ModalForm } from 'sula';
import { getDictionaryTextByValue } from '@/_utils/utils';
/* **** */
const { Search } = Input;

// 司机信息
const DriverInfo = ({ onUpdate }: any) => {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);

  // 驾驶员选择
  const [mainDriver, setMainDriver] = useState<any>(null); // 主驾驶
  const [secondDriver, setSecondDriver] = useState<any>(null); // 副驾驶

  const fetchList = (driverName = '', currentPage = 1, pageSize = 12) => {
    request({
      url: `/api/warehousetransport/logistics/getDriverStatusPage?sorter=asc-vehicleStatus&qp-driverName-like=${driverName}&currentPage=${currentPage}&pageSize=${pageSize}`,
      method: 'get',
    }).then((res: any) => {
      setList(res.list);
      setTotal(~~res.totalCount);
    });
  };

  useEffect(() => {
    if (!list.length) {
      fetchList();
    }
  }, []);

  const changePage = (page: number) => {
    setCurrent(page);
    fetchList('', page);
  };

  const onSearch = (name: string) => {
    fetchList(name);
  };

  const selectDriver = (driver: any) => {
    if (mainDriver && mainDriver.id === driver.id) {
      // 主驾驶
      setMainDriver(null);
      return onUpdate({ mainDriver: null, secondDriver });
    } else if (mainDriver === null && (secondDriver === null || secondDriver.id !== driver.id)) {
      setMainDriver(driver);
      return onUpdate({ mainDriver: driver, secondDriver });
    }

    if (secondDriver && secondDriver.id === driver.id) {
      // 副驾驶
      setSecondDriver(null);
      return onUpdate({ mainDriver, secondDriver: null });
    } else if (mainDriver && secondDriver === null) {
      setSecondDriver(driver);
      return onUpdate({ mainDriver, secondDriver: driver });
    }
  };

  return (
    <Row gutter={[10, 20]}>
      <Col span={24} style={{ paddingBottom: 0 }}>
        <div className={styles.stack_title}>司机信息</div>
      </Col>
      <Col span={24} style={{ paddingBottom: 0 }}>
        <Search
          allowClear
          style={{ width: 300 }}
          placeholder="输入司机姓名"
          onSearch={onSearch}
          enterButton
        />
      </Col>
      <Col span={24}>
        <Row gutter={[10, 20]}>
          {list.map((item: any, index: number) => {
            const address = [
              item.lastDeliveryProvinceName,
              item.lastDeliveryCityName,
              item.lastDeliveryDistrictName,
              '-',
              item.lastTakeDeliveryProvinceName,
              item.lastTakeDeliveryCityName,
              item.lastTakeDeliveryDistrictName,
            ]
              .filter(Boolean)
              .join('');

            let position = false;
            if (mainDriver || secondDriver) {
              position =
                (mainDriver && item.id === mainDriver.id && '主驾驶') ||
                (secondDriver && item.id === secondDriver.id && '副驾驶');
            }

            return (
              <Col span={6} key={index}>
                <div
                  className={styles.driver_box + ' ' + (position ? styles.driver_bg : '')}
                  onClick={(e) => selectDriver(item)}
                  style={{ border: position ? 'none' : '1px solid #cbd2da' }}
                >
                  <div className="flex-space-between">
                    <div className={styles.driver_base_info}>
                      <div style={{ fontSize: '20px' }} className={styles.driver_name}>
                        {item.driverName}
                        <span style={{ fontSize: '14px', marginLeft: '5px' }}>
                          {(item.driverType.split(',') || [])
                            .map((item: any) => getDictionaryTextByValue('LC000022', item))
                            .join(',')}
                        </span>
                      </div>
                    </div>
                    <div className={styles.driver_task}>
                      <span style={{ fontSize: '22px' }}>{item.workWeekTime || 0}</span>
                      <span>本周任务数量</span>
                    </div>
                  </div>

                  <div className={styles.driver_task_address}>
                    <div className={styles.task_time}>最近1次任务地址</div>
                    <div className={styles.address}>{address}</div>
                  </div>

                  <div
                    className={
                      styles.driver_status +
                      ' ' +
                      (item.driverStatus === '20' ? styles.status_transfer : styles.status_nothing)
                    }
                  >
                    {item.driverStatus === '20' ? '运输中' : '空闲中'}
                  </div>

                  {position && <div className={styles.driver_position}>{position}</div>}
                </div>
              </Col>
            );
          })}
        </Row>
      </Col>
      <Col span={10}>
        {list.length ? (
          <Pagination
            defaultPageSize={12}
            current={current}
            total={total}
            onChange={changePage}
          ></Pagination>
        ) : null}
      </Col>
    </Row>
  );
};

// 车辆信息
const CarsInfo = ({ onUpdate, defVal, source }: any) => {
  const [value, setValue] = useState(defVal);
  const [list, setList] = useState([]);

  const fetchList = (number: string = '') => {
    request({
      url: `/api/warehousetransport/vehicle/notPage?qp-licensePlateNumber-eq=${number}&sorter=asc-vehicleStatus`,
      method: 'get',
    }).then((res: any) => {
      setList(res);
    });
  };

  useEffect(() => {
    fetchList();
  }, []);

  const onChange = (e: any) => {
    setValue(e.target.value);
    onUpdate(list.find((item: any) => item.id === e.target.value));
  };

  const onSearch = (number: string) => {
    fetchList(number);
  };

  return (
    <Row gutter={[10, 20]}>
      <Col span={24} style={{ paddingBottom: 0 }}>
        <div className={styles.stack_title}>车辆信息</div>
      </Col>
      <Col span={24} style={{ paddingBottom: 0 }}>
        <Search
          placeholder="输入车牌号"
          style={{ width: '220px' }}
          allowClear
          onSearch={onSearch}
          enterButton
        />
      </Col>
      <Col span={24}>
        <div className={styles.car_info_box}>
          <div className={styles.car_info_detail}>车牌号/车型/核载重量</div>
          <Radio.Group value={value} onChange={onChange} className={styles.group}>
            <Space direction="vertical">
              {list.map((item: any, index: number) => {
                const carType =
                  (source || []).find((car: any) => car.value === `${item.models}`) || {};
                return (
                  <Radio value={item.id} key={index}>
                    <div style={{ color: item.vehicleStatus === 10 ? '#1D92FE' : '#00C276' }}>
                      {item.licensePlateNumber} {carType.text} {item.loadWeight}KG
                    </div>
                  </Radio>
                );
              })}
            </Space>
          </Radio.Group>
        </div>
      </Col>
    </Row>
  );
};

export default class newVehicleDispatch extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      showMoreInfo: false,
      clientInfos: [
        {
          vehicleType: '',
          supplierNo: '',
          price: '',
          licensePlateNumber: '',
          driverMessage: [
            {
              driverName: '',
              driverMobileNo: '',
              licenseNumber: '',
            },
          ],
          size: {
            length: '',
            wide: '',
            high: '',
          },
          specificGoodsWeight: '',
          specificGoodsVolume: '',
          specificGoodsNumber: '',
          remark: '',
          customerPassword: '',
          sealNumber: '',
          classes: '',
          containerWeight: '',
          shelfWeight: '',
          containerNumber: '',
          carWeight: '',
          customsNumber: '',
          companyAddress: '',
          id: null,
          transportNo: null,
          isOrderSubmit: false, //判断当前派车item是否是已经提交过的
        },
      ],
      supplierList: [],
      isModalVisible: false,
      licensePlateNumberList: [null],
      vehicleTypeList: [],
      dispatchIndex: 0,
      requiredField: ['vehicleType', 'supplierNo', 'licensePlateNumber'],
      invalidField: {
        index: -1,
        fieldName: '',
      },
      goodsInfo: null, // 排班弹出货物信息
    };
    this.modalFormRef = React.createRef();
    this.modalTaskCheck = React.createRef();
    // this.setSupplierInfo();
  }

  componentDidMount() {
    const { saveChildThis, getRemoteData, getDictionarySource, goodInfoApi } = this.props as any;
    request({
      url: goodInfoApi,
      method: 'get',
    }).then((res: any) => {
      console.log(res, 'resresres');
      this.setState({
        goodsInfo: {
          packageNumber: res.packageNumber, // 货物信息-件数
          roughWeight: res.roughWeight, // 货物信息-重量
          cube: res.cube, // 货物信息-体积
          size: res.size, // 尺寸
          deliveryAddress: res.deliveryAddress, // 送货地址
          takeDeliveryAddress: res.takeDeliveryAddress, // 提货地址
        },
      });
      const newInfos =
        (res.waybillResDtoList &&
          res.waybillResDtoList.map((item) => {
            return {
              vehicleType: item.vehicleType,
              supplierNo: item.supplierNo,
              price: item.price,
              licensePlateNumber: item.licensePlateNumber,
              driverMessage: item.driverMessage,
              size: item.size,
              specificGoodsWeight: item.specificGoodsWeight,
              specificGoodsVolume: item.specificGoodsVolume,
              specificGoodsNumber: item.specificGoodsNumber,
              remark: item.remark,
              customerPassword: item.customerPassword,
              sealNumber: item.sealNumber,
              classes: item.classes,
              containerWeight: item.containerWeight,
              shelfWeight: item.shelfWeight,
              containerNumber: item.containerNumber,
              carWeight: item.carWeight,
              customsNumber: item.customsNumber,
              companyAddress: item.companyAddress,
              id: item.id,
              transportNo: item.transportNo,
              isOrderSubmit: true,
            };
          })) ||
        [];
      this.setSupplierInfo(res.financialOrgCode);
      newInfos.forEach((item: any, index: number) => {
        // if (item.vehicleType) {
        //   this.setSupplierInfo(item.vehicleType, index);
        // }
        if (item.licensePlateNumber) {
          this.setVehicleTypeList(item.licensePlateNumber, index, false);
        }
      });
      this.props.onChange(newInfos);
      this.setState({
        invalidField: this.setInvalidfield(newInfos, this.state.requiredField),
      });
    });
    // this.setSupplierInfo(res.financialOrgCode)
    // this.setLicensePlateNumberList()

    saveChildThis(this);
    if (this.props.orderType == '20') {
      this.setState({
        requiredField: ['vehicleType', 'supplierNo', 'licensePlateNumber', 'specificGoodsWeight'],
      });
    }
  }

  componentWillReceiveProps(nextProps: any) {
    if (
      nextProps &&
      nextProps.value &&
      nextProps.value.length > 0 /*  && nextProps.value != this.props.value */
    ) {
      const { requiredField } = this.state as any;

      this.setState({
        clientInfos: nextProps.value,
        invalidField: this.setInvalidfield(nextProps.value, requiredField),
      });
    }
  }

  setInvalidfield = (source, requiredField) => {
    for (let i = 0; i < source.length; i++) {
      for (let j = 0; j < requiredField.length; j++) {
        if (!source[i][requiredField[j]]) {
          return {
            index: i,
            fieldName: requiredField[j],
          };
        }
      }
    }
    return {
      index: -1,
      fieldName: '',
    };
  };

  handleDelete = (index: any) => {
    const { clientInfos } = this.state as any;
    clientInfos.splice(index, 1);
    const invalidField = this.setInvalidfield(clientInfos, this.state.requiredField);
    this.props.onChange(clientInfos);
    this.setState({
      clientInfos,
      invalidField,
    });
  };

  addRow = () => {
    const { clientInfos, requiredField, licensePlateNumberList } = this.state;
    clientInfos.push({
      vehicleType: '',
      supplierNo: '',
      price: '',
      licensePlateNumber: '',
      driverMessage: [
        {
          driverName: '',
          driverMobileNo: '',
          licenseNumber: '',
        },
      ],
      size: {
        length: '',
        wide: '',
        high: '',
      },
      specificGoodsWeight: '',
      specificGoodsVolume: '',
      specificGoodsNumber: '',
      remark: '',
      customerPassword: '',
      sealNumber: '',
      classes: '',
      containerWeight: '',
      shelfWeight: '',
      containerNumber: '',
      carWeight: '',
      customsNumber: '',
      companyAddress: '',
      isOrderSubmit: false,
      id: null,
      transportNo: null,
    });
    licensePlateNumberList.push(null); // 车牌号是根据供应商查询
    const invalidField = this.setInvalidfield(clientInfos, requiredField);
    this.props.onChange(clientInfos);
    this.setState({
      clientInfos,
      invalidField,
      licensePlateNumberList,
    });
  };

  saveValue = (value, key) => {
    const { clientInfos } = this.state as any;
    clientInfos[key] = value;
    this.setState({
      clientInfos,
    });
  };

  getDriverContent = (parentIndex: number, driverMessage: any) => {
    const { clientInfos } = this.state as any;
    const driverLen = clientInfos[parentIndex].driverMessage.length;
    let driverDom = <div></div>;
    if (driverMessage && driverMessage.length) {
      driverDom = driverMessage.map((info, childIndex) => {
        return (
          <div style={{ marginBottom: '10px' }}>
            <span className={styles.spanLabel}>司机姓名: </span>
            <Input
              disabled={this.props.mode === 'view'}
              style={{
                display: 'inline-block',
                width: '200px',
                border: '1px solid #d9d9d9',
                marginRight: '50px',
              }}
              value={clientInfos[parentIndex].driverMessage[childIndex].driverName}
              onChange={(e) => {
                this.handleChange(parentIndex, childIndex, 'driverName', e);
              }}
            />
            <span className={styles.spanLabel}>联系方式: </span>
            <Input
              disabled={this.props.mode === 'view'}
              style={{ display: 'inline-block', width: '200px', border: '1px solid #d9d9d9' }}
              value={clientInfos[parentIndex].driverMessage[childIndex].driverMobileNo}
              onChange={(e) => {
                this.handleChange(parentIndex, childIndex, 'driverMobileNo', e);
              }}
            />
            <span className={styles.spanLabel}>身份证: </span>
            <Input
              disabled={this.props.mode === 'view'}
              style={{ display: 'inline-block', width: '200px', border: '1px solid #d9d9d9' }}
              value={clientInfos[parentIndex].driverMessage[childIndex].licenseNumber}
              onChange={(e) => {
                this.handleChange(parentIndex, childIndex, 'licenseNumber', e);
              }}
            />
            <Button
              style={{ display: driverLen == 2 ? 'inline-block' : 'none', marginLeft: '10px' }}
              onClick={() => {
                this.handleDeleteDriver(parentIndex, childIndex);
              }}
              type="primary"
              danger
            >
              删除
            </Button>
            <Button
              style={{ display: driverLen == 1 ? 'inline-block' : 'none', marginLeft: '10px' }}
              onClick={() => {
                this.handleAddDriver(parentIndex);
              }}
              type="primary"
            >
              新增
            </Button>
          </div>
        );
      });
    }

    return driverDom;
  };

  handleDeleteDriver = (parentIndex: number, childIndex: number) => {
    const { clientInfos } = this.state as any;
    let initalDriverInfo = clientInfos[parentIndex].driverMessage;
    initalDriverInfo.splice(childIndex, 1);
    clientInfos[parentIndex].driverMessage = initalDriverInfo;
    this.setState({
      clientInfos,
    });
  };

  handleAddDriver = (parentIndex: number) => {
    const { clientInfos } = this.state as any;
    let initalDriverInfo = clientInfos[parentIndex].driverMessage;
    initalDriverInfo.push({
      driverName: '',
      driverMobileNo: '',
      licenseNumber: '',
    });
    clientInfos[parentIndex].driverMessage = initalDriverInfo;
    this.setState({
      clientInfos,
    });
  };

  handleChange = (parentIndex: number, childIndex: number, type: string, e: any) => {
    const { clientInfos } = this.state as any;
    switch (type) {
      case 'driverName':
        clientInfos[parentIndex].driverMessage[childIndex].driverName = e.target.value;
        break;
      case 'driverMobileNo':
        clientInfos[parentIndex].driverMessage[childIndex].driverMobileNo = e.target.value.replace(
          /\s/g,
          '',
        );
        break;
      case 'licenseNumber':
        clientInfos[parentIndex].driverMessage[childIndex].licenseNumber = e.target.value;
        break;
      default:
        break;
    }
    const invalidField = this.setInvalidfield(clientInfos, this.state.requiredField);
    this.props.onChange(clientInfos);
    this.setState({
      clientInfos,
      invalidField,
    });
  };

  setSupplierInfo = async (financialOrgCode: string) => {
    console.log(this.state, 'thisstate');

    request({
      url: `/api/base/info/getSupplierNameList?qp-businessType-in=2000,4000&defaultFinancialOrgCodeType=20`,
      method: 'get',
    }).then((res: any) => {
      if (res) {
        const supplierList = res.map((item: any) => {
          return {
            text: item.name,
            value: item.contactUnitCode,
          };
        });
        this.setState({
          supplierList: supplierList,
        });
      }
    });
  };

  setLicensePlateNumberList = async (value: string, index: number) => {
    const { licensePlateNumberList } = this.state;
    request({
      url: '/api/warehousetransport/vehicle/notPage',
      method: 'get',
      params: { 'qp-supplierNo-eq': value },
    }).then((res: any) => {
      if (res) {
        const list = res.map((item: any) => {
          return {
            text: item.licensePlateNumber,
            value: item.licensePlateNumber,
          };
        });
        licensePlateNumberList[index] = list;
        this.setState({
          licensePlateNumberList,
        });
      }
    });
  };
  /* 获取车型 */
  setVehicleTypeList = async (licensePlateNumber: any, index: any, canLoda: boolean) => {
    const { vehicleTypeList, clientInfos } = this.state as any;

    const { getDictionaryTextByValue, getDictionarySource } = this.props as any;
    request({
      url: `/goldjet-ops-platform/vehicle/one?licensePlateNumber=${licensePlateNumber}`,
      method: 'get',
    }).then((res: any) => {
      let invalidField;
      if (res) {
        if (JSON.stringify(res) == '{}') {
          vehicleTypeList[index] = getDictionarySource('LC000001', true).sort(
            (a: any, b: any) => a.value - b.value,
          );
          if (canLoda) {
            clientInfos[index].vehicleType = '';
          }
        } else {
          vehicleTypeList[index] = getDictionarySource('LC000001', true).sort(
            (a: any, b: any) => a.value - b.value,
          );
          if (canLoda) {
            clientInfos[index].vehicleType = res.models / 1;
            this.setPrice('vehicleType', res.models, index);
            invalidField = this.setInvalidfield(clientInfos, this.state.requiredField);
            this.props.onChange(clientInfos);
          }
        }
      }
      this.setState({
        vehicleTypeList,
        ...(canLoda ? clientInfos : ''),
        ...(canLoda ? invalidField : ''),
      });
    });
  };
  /* 获取成本价格 */
  setPrice = async (type: string, value: string, index: number) => {
    const { PCDData, tailBus, regulationCar, specialVehicleType, typeTransportation } = this
      .props as any;
    const { clientInfos } = this.state as any;
    if (
      (type == 'supplierNo' ? !clientInfos[index].vehicleType : !clientInfos[index].vehicleType) ||
      !value
    ) {
      return;
    }
    const params = {
      'qp-carType-eq': clientInfos[index].vehicleType,
      'qp-contactUnitCode-eq': clientInfos[index].supplierNo,
      // 提货省市区
      'qp-shippingFromProvinceCode-eq': PCDData.tProvince,
      'qp-shippingFromCityCode-eq': PCDData.tCity,
      'qp-shippingFromDistrictCode-eq': PCDData.tDistrict,
      // 卸货省市区
      'qp-shippingToProvinceCode-eq': PCDData.aProvince,
      'qp-shippingToCityCode-eq': PCDData.aCity,
      'qp-shippingToDistrictCode-eq': PCDData.aDistrict,

      /* 运输类型 */
      ...(typeTransportation
        ? { 'qp-transportType-eq': typeTransportation }
        : { 'qp-transportType-isNull': true }),
      /* 特种车类型 */
      ...(specialVehicleType
        ? { 'qp-specialVehicle-eq': specialVehicleType }
        : { 'qp-specialVehicle-isNull': true }),
      /* 监管类型 */
      ...(regulationCar
        ? { 'qp-supervisionType-eq': regulationCar }
        : { 'qp-supervisionType-isNull': true }),
      /* 尾班车类型 */
      ...(tailBus ? { 'qp-tailTruck-eq': tailBus } : { 'qp-tailTruck-isNull': true }),
    };
    request({
      url: `/goldjet-ops-platform/quotation/querySupplierNameQuotationList`,
      method: 'get',
      params: params,
    }).then((res) => {
      if (res && res.length == 0) {
        clientInfos[index].price = 0;
      } else if (res && res.length > 0) {
        clientInfos[index].price = res[0].transportPrice;
      }
      this.setState({
        clientInfos,
      });
    });
  };

  handleSelectFieldChange = (value: any, index: number, type: string) => {
    const { clientInfos, requiredField } = this.state as any;
    switch (type) {
      /**车型 */
      case 'vehicleType':
        clientInfos[index].vehicleType = value;
        this.setPrice('vehicleType', value, index);
        break;
      /**供应商 */
      case 'supplierNo':
        clientInfos[index].supplierNo = value;
        this.setPrice('supplierNo', value, index);
        this.setLicensePlateNumberList(value, index); // 通过供应商获取车牌号信息
        clientInfos[index].licensePlateNumber = ''; // 清空车牌号
        break;
      case 'licensePlateNumber':
        clientInfos[index].licensePlateNumber = value;
        clientInfos[index].vehicleType = '';
        break;
      default:
        break;
    }
    const invalidField = this.setInvalidfield(clientInfos, requiredField);
    this.props.onChange(clientInfos);
    this.setState({
      clientInfos,
      invalidField,
    });
  };

  handleBaseInfoChange = (e: any, index: number, type: string, sizeDetail?: string) => {
    console.log(e, 'eeee', index, 'index', type);

    const { clientInfos, requiredField } = this.state as any;
    switch (type) {
      case 'price':
        clientInfos[index].price = e.target.value;
        break;
      case 'licensePlateNumber':
        if (e) {
          clientInfos[index].licensePlateNumber = e.replace(/\s/g, '');
        }
        break;
      case 'specificGoodsWeight':
        clientInfos[index].specificGoodsWeight = e.target.value;
        break;
      case 'specificGoodsVolume':
        clientInfos[index].specificGoodsVolume = e.target.value;
        break;
      case 'specificGoodsNumber':
        clientInfos[index].specificGoodsNumber = e.target.value;
        break;
      case 'remark':
        clientInfos[index].remark = e.target.value;
        break;
      case 'customerPassword':
        clientInfos[index].customerPassword = e.target.value;
        break;
      case 'sealNumber':
        clientInfos[index].sealNumber = e.target.value;
        break;
      case 'classes':
        clientInfos[index].classes = e.target.value;
        break;
      case 'containerWeight':
        clientInfos[index].containerWeight = e.target.value;
        break;
      case 'shelfWeight':
        clientInfos[index].shelfWeight = e.target.value;
        break;
      case 'containerNumber':
        clientInfos[index].containerNumber = e.target.value;
        break;
      case 'carWeight':
        clientInfos[index].carWeight = e.target.value;
        break;
      case 'customsNumber':
        clientInfos[index].customsNumber = e.target.value;
        break;
      case 'companyAddress':
        clientInfos[index].companyAddress = e.target.value;
        break;
      case 'size':
        if (sizeDetail === 'length') {
          clientInfos[index].size.length = e.target.value;
        }
        if (sizeDetail === 'wide') {
          clientInfos[index].size.wide = e.target.value;
        }
        if (sizeDetail === 'high') {
          clientInfos[index].size.high = e.target.value;
        }
        break;
      default:
        break;
    }
    const invalidField = this.setInvalidfield(clientInfos, requiredField);
    this.props.onChange(clientInfos);
    this.setState({
      clientInfos,
      invalidField,
    });
  };

  handleCancelPatch = (index: any) => {
    // debugger
    const { clientInfos } = this.state as any;
    const { confirm } = Modal;
    const that = this;
    /* **** */
    const tableConfig = [
      {
        name: 'cancelFee',
        label: '生成返空费',
        initialSource: [
          {
            text: '是',
            value: true,
          },
          {
            text: '否',
            value: false,
          },
        ],
        field: 'radiogroup',
        rules: [
          {
            required: true,
            message: '该项为必选项',
          },
        ],
      },
    ];
    /**取消派车 */
    if (clientInfos[index].id) {
      this.modalFormRef.current &&
        this.modalFormRef.current.show({
          title: '确定取消该派车订单 ?',
          width: 500,
          fields: tableConfig,
          submitButtonProps: {
            children: '确认',
          },
          submit: (ctx: any) => {
            const {
              result: { cancelFee },
            } = ctx;
            let url = `/api/warehousetransport/waybill/cancel?cancelFee=${cancelFee}&id=${clientInfos[index].id}`;
            request({
              url: url,
              method: 'patch',
              params: {
                ...clientInfos[index],
                statusKey: 0,
              },
            }).then((res: any) => {
              clientInfos.splice(index, 1);
              that.setState({
                clientInfos,
              });
            });
          },
          // 与 CreateForm 一致
        });
    }
  };

  // 排班查看
  checkTaskModal = (propsIndex: number) => {
    const { clientInfos } = this.state as any;

    const makeHandler = (def: any = '', defMap: any = null) => ({
      get(target: any, propKey: string) {
        if (target[propKey]) return target[propKey];

        return defMap && defMap[propKey] !== undefined ? defMap[propKey] : def;
      },
    });
    const goodsInfo = this.state.goodsInfo
      ? new Proxy(
          this.state.goodsInfo,
          makeHandler(0, { takeDeliveryAddress: '', deliveryAddress: '' }),
        )
      : {};
    if (goodsInfo)
      goodsInfo.size = (goodsInfo?.size || []).map((item: any) => new Proxy(item, makeHandler(0)));
    const size = goodsInfo?.size
      ?.reduce((acc: any, item: any) => {
        acc.push(`${item.length}*${item.high}*${item.wide}`);
        return acc;
      }, [])
      .join(';');

    if (this.modalTaskCheck && this.modalTaskCheck.current) {
      this.modalTaskCheck.current.show({
        title: <div style={{ color: '#2c2f2e', fontSize: '16px', fontWeight: 500 }}>排班查看</div>,
        width: 1400,
        fields: [
          {
            name: 'just-look-look',
            initialVisible: !!this.props.goodInfoApi /**多点调度不展示物料信息 */,
            itemLayout: {
              span: 12,
            },
            container: {
              type: (ctx: any) => {
                return <Row gutter={[10, 20]}></Row>;
              },
            },
            fields: [
              {
                name: 'stackInfo',
                label: '货物信息',
                initialValue: `${goodsInfo.packageNumber}件/${goodsInfo.roughWeight}KG/${goodsInfo.cube}m³`,
                field: {
                  type: 'text',
                },
              },
              {
                name: 'stockAddress',
                label: '提货地址',
                initialValue: goodsInfo.takeDeliveryAddress,
                field: {
                  type: 'text',
                },
              },
              {
                name: 'size',
                label: '尺寸(CM)',
                initialValue: size,
                field: {
                  type: 'text',
                },
              },
              {
                name: 'sendGoodsAddress',
                label: '送货地址',
                initialValue: goodsInfo.deliveryAddress,
                field: {
                  type: 'text',
                },
              },
            ],
          },
          {
            name: 'just-Row',
            itemLayout: {
              span: 24,
            },
            container: {
              type: (ctx: any) => {
                return <Row gutter={[10, 20]}></Row>;
              },
            },
            fields: [
              {
                name: 'driverInfo',
                label: '',
                itemLayout: {
                  span: 18,
                  labelCol: {
                    span: 2,
                  },
                  wrapperCol: {
                    span: 22,
                  },
                },
                field: (ctx: any) => {
                  const onUpdate = (driverInfo: any) => {
                    ctx.form.setFieldValue('driverInfo', driverInfo);
                  };

                  return <DriverInfo onUpdate={onUpdate}></DriverInfo>;
                },
                rules: [
                  {
                    required: true,
                    message: '请先选择司机信息',
                  },
                  {
                    validator: (ctx: any) => {
                      const { mainDriver } = ctx.value;
                      if (!mainDriver) {
                        return Promise.reject('请先选择主驾驶员');
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ],
              },
              {
                name: 'goodsInfo',
                label: '',
                itemLayout: {
                  span: 6,
                  labelCol: {
                    span: 2,
                  },
                  wrapperCol: {
                    span: 22,
                  },
                },
                field: (ctx: any) => {
                  const defVal = ctx.form.getFieldValue('goodsInfo');
                  const onUpdate = (val: any) => {
                    ctx.form.setFieldValue('goodsInfo', val);
                  };
                  const source = this.props.getDictionarySource('LC000001'); // 获取车型数据

                  return <CarsInfo onUpdate={onUpdate} defVal={defVal} source={source}></CarsInfo>;
                },
                rules: [
                  {
                    required: true,
                    message: '请先选择车辆信息',
                  },
                ],
              },
            ],
          },
        ],
        actionsPosition: 'center',
        submitButtonProps: {
          children: '提交',
        },
        submit: (ctx: any) => {
          const result = ctx.result;
          const { mainDriver, secondDriver } = result.driverInfo;
          const goodsInfo = result.goodsInfo;

          clientInfos.map((item: any, index: number) => {
            if (index === propsIndex) {
              item.driverMessage = [mainDriver, secondDriver].filter(Boolean);
              item.vehicleType = ~~goodsInfo.models;
              item.supplierNo = goodsInfo.supplierNo;
              item.licensePlateNumber = goodsInfo.licensePlateNumber;
            }
            return item;
          });

          // const clientInfos1 = [{
          //   ...this.state.clientInfos[0],
          //   driverMessage: [mainDriver, secondDriver].filter(Boolean),
          //   vehicleType: ~~goodsInfo.models,
          //   supplierNo: goodsInfo.supplierNo,
          //   licensePlateNumber: goodsInfo.licensePlateNumber,
          // }];
          this.props.onChange(clientInfos);
          this.setState(
            {
              clientInfos,
            },
            () => {
              // this.setSupplierInfo(goodsInfo.vehicleTypeCode, 0);
              this.setVehicleTypeList(goodsInfo.licensePlateNumber, 0);
            },
          );
        },
      });
    }
  };

  setContent = () => {
    const { clientInfos, supplierList, invalidField, licensePlateNumberList, vehicleTypeList } =
      this.state as any;
    const { Option } = Select;

    let results = clientInfos.map((item, index) => {
      const { clientInfos } = this.state as any;
      return (
        <div
          className={styles.dispatchContent}
          style={{
            borderBottom: '1px solid silver',
            marginTop: '20px',
            paddingBottom: '10px',
            position: 'relative',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <div style={{ margin: '0 0 8px 45px', overflow: 'auto', lineHeight: '28px' }}>
              {/* 供应商 */}
              <div className={styles.baseItemContent1}>
                <span className={styles.spanLabel}>
                  <span style={{ color: 'red' }}>*</span>
                  <span>供应商: </span>
                </span>
                <Select
                  showSearch
                  disabled={this.props.mode === 'view'}
                  className={styles.carSelect}
                  value={clientInfos[index].supplierNo}
                  onChange={(val) => {
                    this.handleSelectFieldChange(val, index, 'supplierNo');
                  }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  style={{
                    display: 'inline-block',
                    width: '200px',
                    marginRight: '10px',
                    border:
                      invalidField['index'] == index && invalidField['fieldName'] == 'supplierNo'
                        ? '1px solid red'
                        : '1px solid #d9d9d9',
                  }}
                >
                  {supplierList
                    ? supplierList.map((item) => {
                        return <Option value={item.value}>{item.text}</Option>;
                      })
                    : []}
                </Select>
                <Button
                  type="primary"
                  disabled={this.props.mode === 'view'}
                  onClick={() => {
                    console.log(index, 'ssssssssssssssss');

                    this.checkTaskModal(index);
                  }}
                >
                  排班查看
                </Button>
                {/* <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ isModalVisible: true, dispatchIndex: index });
                  }}
                >
                  查看更多供应商报价
                </Button> */}
              </div>
            </div>
            <div style={{ margin: '0 0 8px 45px', overflow: 'auto', lineHeight: '28px' }}>
              {/* 车牌号 */}
              <div className={styles.carNumberConetent}>
                <span className={styles.spanLabel}>
                  <span style={{ color: 'red' }}>*</span>
                  <span>车牌号: </span>
                </span>
                <Select
                  className={styles.carSelect}
                  disabled={this.props.mode === 'view'}
                  value={clientInfos[index].licensePlateNumber}
                  onChange={(val) => {
                    this.handleSelectFieldChange(val, index, 'licensePlateNumber');
                  }}
                  showSearch
                  onSearch={(val) => {
                    this.handleBaseInfoChange(val, index, 'licensePlateNumber');
                  }}
                  onBlur={(e) => {
                    this.setVehicleTypeList(clientInfos[index].licensePlateNumber, index, true);
                  }}
                  style={{
                    display: 'inline-block',
                    width: '200px',
                    border:
                      invalidField['index'] == index &&
                      invalidField['fieldName'] == 'licensePlateNumber'
                        ? '1px solid red'
                        : '1px solid #d9d9d9',
                    marginRight: '40px',
                  }}
                >
                  {licensePlateNumberList[index]?.map((item) => {
                    return <Option value={item.value}>{item.text}</Option>;
                  })}
                </Select>
              </div>
              {/* 车型 */}
              <div className={styles.baseItemContent}>
                <span className={styles.spanLabel}>
                  <span style={{ color: 'red' }}>*</span>
                  <span>车型: </span>
                </span>
                <Select
                  disabled={this.props.mode === 'view'}
                  className={styles.carSelect}
                  value={clientInfos[index].vehicleType}
                  onChange={(val) => {
                    this.handleSelectFieldChange(val, index, 'vehicleType');
                  }}
                  style={{
                    display: 'inline-block',
                    width: '200px',
                    border:
                      invalidField['index'] == index && invalidField['fieldName'] == 'vehicleType'
                        ? '1px solid red'
                        : '1px solid #d9d9d9',
                  }}
                >
                  {vehicleTypeList[index]
                    ? vehicleTypeList[index].map((item: any) => {
                        return <Option value={item.value}>{item.text}</Option>;
                      })
                    : []}
                </Select>
                <span className={styles.spanLabel}>柜号: </span>
                <Input
                  value={clientInfos[index].containerNumber}
                  disabled={this.props.mode === 'view'}
                  onChange={(val) => {
                    this.handleBaseInfoChange(val, index, 'containerNumber');
                  }}
                  style={{ display: 'inline-block', width: '200px', border: '1px solid #d9d9d9' }}
                ></Input>
                {/* <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ isModalVisible: true, dispatchIndex: index });
                  }}
                >
                  查看更多供应商报价
                </Button> */}
              </div>
              {/* 成本价格，批量调度不需要展示 */}
              {/* {
                this.props?.batch ? '' : (
                  <div className={styles.baseItemContent}>
                    <span className={styles.spanLabel}>成本价格(元/车): </span>
                    <span>{clientInfos[index].price}</span>
                  </div>
                )
              } */}
              <Button
                style={{
                  display: clientInfos.length == 1 || item.isOrderSubmit ? 'none' : 'block',
                  float: 'right',
                }}
                onClick={() => {
                  this.handleDelete(index);
                }}
                type="primary"
                danger
              >
                删除
              </Button>
              <Button
                style={{ display: item.isOrderSubmit ? 'block' : 'none', float: 'right' }}
                onClick={() => {
                  this.handleCancelPatch(index);
                }}
                type="primary"
                danger
              >
                取消调度
              </Button>
            </div>

            {/* <div style={{ overflow: 'hidden', width: '1300px' }}>
              <Button
                style={{ float: 'right' }}
                type="link"
                onClick={() => {
                  this.setState({ showMoreInfo: !this.state.showMoreInfo });
                }}
              >
                更多信息
              </Button>
            </div> */}
          </div>
          <div
            style={{
              /* display: this.state.showMoreInfo ? 'block' : 'none', */ marginLeft: '50px',
            }}
          >
            <div style={{ marginBottom: '15px' }}>
              <span className={styles.spanLabel}>车次: </span>
              <Input
                value={clientInfos[index].classes}
                disabled={this.props.mode === 'view'}
                onChange={(val) => {
                  this.handleBaseInfoChange(val, index, 'classes');
                }}
                style={{
                  display: 'inline-block',
                  width: '200px',
                  border: '1px solid #d9d9d9',
                  marginRight: '50px',
                }}
              ></Input>
              <span className={styles.spanLabel}>封条号: </span>
              <Input
                value={clientInfos[index].sealNumber}
                disabled={this.props.mode === 'view'}
                onChange={(val) => {
                  this.handleBaseInfoChange(val, index, 'sealNumber');
                }}
                style={{ display: 'inline-block', width: '200px', border: '1px solid #d9d9d9' }}
              ></Input>
              <span className={styles.spanLabel}>客户密码: </span>
              <Input
                disabled={this.props.mode === 'view'}
                value={clientInfos[index].customerPassword}
                onChange={(val) => {
                  this.handleBaseInfoChange(val, index, 'customerPassword');
                }}
                style={{ display: 'inline-block', width: '200px', border: '1px solid #d9d9d9' }}
              ></Input>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <span className={styles.spanLabel}>车自重(kg): </span>
              <Input
                disabled={this.props.mode === 'view'}
                value={clientInfos[index].carWeight}
                onChange={(val) => {
                  this.handleBaseInfoChange(val, index, 'carWeight');
                }}
                style={{
                  display: 'inline-block',
                  width: '200px',
                  border: '1px solid #d9d9d9',
                  marginRight: 50,
                }}
              ></Input>
              <span className={styles.spanLabel}>架重(kg): </span>
              <Input
                disabled={this.props.mode === 'view'}
                value={clientInfos[index].shelfWeight}
                onChange={(val) => {
                  this.handleBaseInfoChange(val, index, 'shelfWeight');
                }}
                style={{ display: 'inline-block', width: '200px', border: '1px solid #d9d9d9' }}
              ></Input>
              <span className={styles.spanLabel}>柜重(kg): </span>
              <Input
                disabled={this.props.mode === 'view'}
                value={clientInfos[index].containerWeight}
                onChange={(val) => {
                  this.handleBaseInfoChange(val, index, 'containerWeight');
                }}
                style={{
                  display: 'inline-block',
                  width: '200px',
                  border: '1px solid #d9d9d9',
                  marginRight: 50,
                }}
              ></Input>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <span className={styles.spanLabel}>特定提货件数(件): </span>
              <Input
                disabled={this.props.mode === 'view'}
                value={clientInfos[index].specificGoodsNumber}
                onChange={(val) => {
                  this.handleBaseInfoChange(val, index, 'specificGoodsNumber');
                }}
                style={{
                  display: 'inline-block',
                  width: '200px',
                  border: '1px solid #d9d9d9',
                  marginRight: '50px',
                }}
              ></Input>
              <span className={styles.spanLabel}>特定提货体积(m³): </span>
              <Input
                disabled={this.props.mode === 'view'}
                value={clientInfos[index].specificGoodsVolume}
                onChange={(val) => {
                  this.handleBaseInfoChange(val, index, 'specificGoodsVolume');
                }}
                style={{ display: 'inline-block', width: '200px', border: '1px solid #d9d9d9' }}
              ></Input>
              <span className={styles.spanLabel}>
                <span
                  style={{
                    color: 'red',
                    display: this.props.orderType == '20' ? 'inline' : 'none',
                  }}
                >
                  *
                </span>
                特定提货重量(kg):
              </span>
              <Input
                disabled={this.props.mode === 'view'}
                value={clientInfos[index].specificGoodsWeight}
                onChange={(val) => {
                  this.handleBaseInfoChange(val, index, 'specificGoodsWeight');
                }}
                style={{
                  display: 'inline-block',
                  width: '200px',
                  border:
                    invalidField['index'] == index &&
                    invalidField['fieldName'] == 'specificGoodsWeight'
                      ? '1px solid red'
                      : '1px solid #d9d9d9',
                }}
              ></Input>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <span className={styles.spanLabel}>特定提货尺寸: </span>
              <Input
                disabled={this.props.mode === 'view'}
                placeholder="长"
                value={
                  clientInfos[index].size
                    ? clientInfos[index].size.length
                      ? clientInfos[index].size.length
                      : ''
                    : ''
                }
                onChange={(val) => {
                  this.handleBaseInfoChange(val, index, 'size', 'length');
                }}
                style={{
                  display: 'inline-block',
                  width: '50px',
                  marginRight: '17px',
                  border: '1px solid #d9d9d9',
                }}
              ></Input>
              <Input
                disabled={this.props.mode === 'view'}
                placeholder="宽"
                value={
                  clientInfos[index].size
                    ? clientInfos[index].size.wide
                      ? clientInfos[index].size.wide
                      : ''
                    : ''
                }
                onChange={(val) => {
                  this.handleBaseInfoChange(val, index, 'size', 'wide');
                }}
                style={{
                  display: 'inline-block',
                  width: '50px',
                  marginRight: '17px',
                  border: '1px solid #d9d9d9',
                }}
              ></Input>
              <Input
                disabled={this.props.mode === 'view'}
                placeholder="高"
                value={
                  clientInfos[index].size
                    ? clientInfos[index].size.high
                      ? clientInfos[index].size.high
                      : ''
                    : ''
                }
                onChange={(val) => {
                  this.handleBaseInfoChange(val, index, 'size', 'high');
                }}
                style={{
                  display: 'inline-block',
                  width: '50px',
                  marginRight: '66px',
                  border: '1px solid #d9d9d9',
                }}
              ></Input>
              <span className={styles.spanLabel}>海关编号: </span>
              <Input
                disabled={this.props.mode === 'view'}
                value={clientInfos[index].customsNumber}
                onChange={(val) => {
                  this.handleBaseInfoChange(val, index, 'customsNumber');
                }}
                style={{ display: 'inline-block', width: '200px', border: '1px solid #d9d9d9' }}
              ></Input>
              <span className={styles.spanLabel}>备注: </span>
              <Input
                disabled={this.props.mode === 'view'}
                value={clientInfos[index].remark}
                onChange={(val) => {
                  this.handleBaseInfoChange(val, index, 'remark');
                }}
                style={{ display: 'inline-block', width: '200px', border: '1px solid #d9d9d9' }}
              ></Input>
            </div>
            <div style={{ overflow: 'auto', width: '100%' }}>
              <div className={styles.driverInfoContent}>
                {this.getDriverContent(index, item.driverMessage)}
              </div>
            </div>
          </div>
          {/* <div className={styles.xuhao}>{index + 1}</div> */}
        </div>
      );
    });
    return <div>{results}</div>;
  };

  render() {
    const contents = this.setContent();
    const { supplierList, dispatchIndex } = this.state as any;
    const dataSource = supplierList
      ? supplierList.map((item) => {
          return {
            name: item.text,
            price: item.price,
            value: item.value,
          };
        })
      : [];
    return (
      <div className={styles.content}>
        <p style={{ lineHeight: '28px', marginTop: '10px', fontSize: '14px' }}>调度派车: </p>
        <Button disabled={this.props.mode === 'view'} onClick={this.addRow} type="primary">
          新增调度
        </Button>
        {contents}
        <ModalForm type="modal" ref={this.modalFormRef} />
        <ModalForm type="modal" ref={this.modalTaskCheck} />
      </div>
    );
  }
}
