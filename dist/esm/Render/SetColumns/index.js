function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly &&
      (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })),
      keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2
      ? ownKeys(Object(source), !0).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
      : ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) ||
    _iterableToArray(arr) ||
    _unsupportedIterableToArray(arr) ||
    _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
  );
}

function _iterableToArray(iter) {
  if (
    (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null) ||
    iter['@@iterator'] != null
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  var _i =
    arr == null
      ? null
      : (typeof Symbol !== 'undefined' && arr[Symbol.iterator]) || arr['@@iterator'];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/*
 * @Date: 2022-09-01 20:27:53
 * @LastEditors: 追随
 * @LastEditTime: 2022-09-02 09:31:30
 */
import { Menu, Checkbox, Space, Tooltip, message, Dropdown, Button } from 'antd';
import React, { useState } from 'react';
import { cloneDeep } from 'lodash';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { jsx as _jsx } from 'react/jsx-runtime';
import { jsxs as _jsxs } from 'react/jsx-runtime';
import { Fragment as _Fragment } from 'react/jsx-runtime';
export default function SetColoums(props) {
  var columns = props.columns;

  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    indeterminate = _useState2[0],
    setIndeterminate = _useState2[1];

  var _useState3 = useState(true),
    _useState4 = _slicedToArray(_useState3, 2),
    checkAll = _useState4[0],
    setCheckAll = _useState4[1];

  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    topColumns = _useState6[0],
    setTopColumns = _useState6[1];

  var _useState7 = useState([]),
    _useState8 = _slicedToArray(_useState7, 2),
    btmColumns = _useState8[0],
    setBtmColumns = _useState8[1];

  var _useState9 = useState(props),
    _useState10 = _slicedToArray(_useState9, 2),
    value = _useState10[0],
    setValue = _useState10[1];

  var _useState11 = useState(props.columns),
    _useState12 = _slicedToArray(_useState11, 2),
    initColumns = _useState12[0],
    setInitColumns = _useState12[1];

  var _useState13 = useState(
      columns.map(function (d) {
        return d.key || d.dataIndex;
      }),
    ),
    _useState14 = _slicedToArray(_useState13, 2),
    checkedList = _useState14[0],
    setCheckedList = _useState14[1];

  var _useState15 = useState(cloneDeep(columns)),
    _useState16 = _slicedToArray(_useState15, 1),
    initColumnsPure = _useState16[0];

  var onCheckAllChange = function onCheckAllChange(e) {
    var columnsKey = [].concat(
      _toConsumableArray(
        topColumns.map(function (d) {
          return d.key || d.dataIndex;
        }),
      ),
      _toConsumableArray(
        btmColumns.map(function (d) {
          return d.key || d.dataIndex;
        }),
      ),
    );

    if (e.target.checked) {
      setValue(
        _objectSpread(
          _objectSpread({}, value),
          {},
          {
            columns: [].concat(
              _toConsumableArray(
                topColumns.map(function (r) {
                  return _objectSpread(
                    _objectSpread({}, r),
                    {},
                    {
                      fixed: 'left',
                    },
                  );
                }),
              ),
              _toConsumableArray(
                initColumns.filter(function (r) {
                  return !r.topFixed && !r.btmFixed && !columnsKey.includes(r.key || r.dataIndex);
                }),
              ),
              _toConsumableArray(
                btmColumns.map(function (r) {
                  return _objectSpread(
                    _objectSpread({}, r),
                    {},
                    {
                      fixed: 'right',
                    },
                  );
                }),
              ),
            ),
          },
        ),
      );
    } else {
      setValue(
        _objectSpread(
          _objectSpread({}, value),
          {},
          {
            columns: [],
          },
        ),
      );
    }

    setCheckedList(
      e.target.checked
        ? initColumnsPure.map(function (d) {
            return d.key || d.dataIndex;
          })
        : [],
    );
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  var onChange = function onChange(list) {
    setCheckedList(list);
    var columnsKey = [].concat(
      _toConsumableArray(
        topColumns.map(function (d) {
          return d.key || d.dataIndex;
        }),
      ),
      _toConsumableArray(
        btmColumns.map(function (d) {
          return d.key || d.dataIndex;
        }),
      ),
    );
    setValue(
      _objectSpread(
        _objectSpread({}, value),
        {},
        {
          columns: [].concat(
            _toConsumableArray(
              topColumns
                .map(function (r) {
                  return _objectSpread(
                    _objectSpread({}, r),
                    {},
                    {
                      fixed: 'left',
                    },
                  );
                })
                .filter(function (d) {
                  return list.includes(d.key || d.dataIndex);
                }),
            ),
            _toConsumableArray(
              initColumns.filter(function (d) {
                return (
                  list.includes(d.key || d.dataIndex) && !columnsKey.includes(d.key || d.dataIndex)
                );
              }),
            ),
            _toConsumableArray(
              btmColumns
                .map(function (r) {
                  return _objectSpread(
                    _objectSpread({}, r),
                    {},
                    {
                      fixed: 'right',
                    },
                  );
                })
                .filter(function (d) {
                  return list.includes(d.key || d.dataIndex);
                }),
            ),
          ),
        },
      ),
    );
    setIndeterminate(!!list.length && list.length < initColumnsPure.length);
    setCheckAll(list.length === initColumnsPure.length);
  }; // d 每个元素

  var cancelFixed = function cancelFixed(d, type) {
    initColumns[
      initColumns.findIndex(function (r) {
        return (r.key || r.dataIndex) === (d.key || d.dataIndex);
      })
    ].topFixed = false;
    initColumns[
      initColumns.findIndex(function (r) {
        return (r.key || r.dataIndex) === (d.key || d.dataIndex);
      })
    ].btmFixed = false;

    if (type === 'top') {
      topColumns.splice(
        topColumns.findIndex(function (r) {
          return (r.key || r.dataIndex) === (d.key || d.dataIndex);
        }),
        1,
      );
      setTopColumns(_toConsumableArray(topColumns));
    } else {
      btmColumns.splice(
        btmColumns.findIndex(function (r) {
          return (r.key || r.dataIndex) === (d.key || d.dataIndex);
        }),
        1,
      );
      setBtmColumns(_toConsumableArray(btmColumns));
    }

    setValue(
      _objectSpread(
        _objectSpread({}, value),
        {},
        {
          columns: [].concat(
            _toConsumableArray(
              topColumns.map(function (r) {
                return _objectSpread(
                  _objectSpread({}, r),
                  {},
                  {
                    fixed: 'left',
                  },
                );
              }),
            ),
            _toConsumableArray(initColumns),
            _toConsumableArray(
              btmColumns.map(function (r) {
                return _objectSpread(
                  _objectSpread({}, r),
                  {},
                  {
                    fixed: 'right',
                  },
                );
              }),
            ),
          ),
        },
      ),
    );
    setInitColumns(_toConsumableArray(initColumns));
  };

  var btmFixedFunc = function btmFixedFunc(d, type) {
    initColumns[
      initColumns.findIndex(function (r) {
        return (r.key || r.dataIndex) === (d.key || d.dataIndex);
      })
    ].topFixed = false;
    initColumns[
      initColumns.findIndex(function (r) {
        return (r.key || r.dataIndex) === (d.key || d.dataIndex);
      })
    ].btmFixed = true;
    btmColumns.unshift(d);

    if (type) {
      topColumns.splice(
        topColumns.findIndex(function (r) {
          return (r.key || r.dataIndex) === (d.key || d.dataIndex);
        }),
        1,
      );
    }

    setValue(
      _objectSpread(
        _objectSpread({}, value),
        {},
        {
          columns: [].concat(
            _toConsumableArray(
              topColumns.map(function (r) {
                return _objectSpread(
                  _objectSpread({}, r),
                  {},
                  {
                    fixed: 'left',
                  },
                );
              }),
            ),
            _toConsumableArray(
              initColumns.filter(function (r) {
                return !r.topFixed && !r.btmFixed;
              }),
            ),
            _toConsumableArray(
              btmColumns.map(function (r) {
                return _objectSpread(
                  _objectSpread({}, r),
                  {},
                  {
                    fixed: 'right',
                  },
                );
              }),
            ),
          ),
        },
      ),
    );
    setBtmColumns(_toConsumableArray(btmColumns));
    setTopColumns(_toConsumableArray(topColumns));
    setInitColumns(_toConsumableArray(initColumns));
  };

  var topFixedFunc = function topFixedFunc(d, type) {
    initColumns[
      initColumns.findIndex(function (r) {
        return (r.key || r.dataIndex) === (d.key || d.dataIndex);
      })
    ].topFixed = true;
    initColumns[
      initColumns.findIndex(function (r) {
        return (r.key || r.dataIndex) === (d.key || d.dataIndex);
      })
    ].btmFixed = false;
    topColumns.push(d);

    if (type) {
      btmColumns.splice(
        btmColumns.findIndex(function (r) {
          return (r.key || r.dataIndex) === (d.key || d.dataIndex);
        }),
        1,
      );
    }

    setValue(
      _objectSpread(
        _objectSpread({}, value),
        {},
        {
          columns: [].concat(
            _toConsumableArray(
              topColumns.map(function (r) {
                return _objectSpread(
                  _objectSpread({}, r),
                  {},
                  {
                    fixed: 'left',
                  },
                );
              }),
            ),
            _toConsumableArray(
              initColumns.filter(function (r) {
                return !r.topFixed && !r.btmFixed;
              }),
            ),
            _toConsumableArray(
              btmColumns.map(function (r) {
                return _objectSpread(
                  _objectSpread({}, r),
                  {},
                  {
                    fixed: 'right',
                  },
                );
              }),
            ),
          ),
        },
      ),
    );
    setTopColumns(_toConsumableArray(topColumns));
    setBtmColumns(_toConsumableArray(btmColumns));
    setInitColumns(_toConsumableArray(initColumns));
  };

  var menu = /*#__PURE__*/ _jsxs(Menu, {
    style: {
      padding: '15px',
    },
    children: [
      /*#__PURE__*/ _jsxs('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
        },
        children: [
          /*#__PURE__*/ _jsx(Checkbox, {
            indeterminate: indeterminate,
            onChange: onCheckAllChange,
            checked: checkAll,
            children: '\u5217\u5C55\u793A',
          }),
          /*#__PURE__*/ _jsx('a', {
            onClick: function onClick() {
              setTopColumns([]);
              setBtmColumns([]);
              setInitColumns(
                _toConsumableArray(
                  initColumnsPure.map(function (d) {
                    return _objectSpread(
                      _objectSpread({}, d),
                      {},
                      {
                        topFixed: false,
                        btmFixed: false,
                      },
                    );
                  }),
                ),
              );
              setCheckedList(
                initColumnsPure.map(function (d) {
                  return d.key || d.dataIndex;
                }),
              );
              setIndeterminate(false);
              setCheckAll(true);
              setValue(
                _objectSpread(
                  _objectSpread({}, value),
                  {},
                  {
                    columns: initColumnsPure,
                  },
                ),
              );
            },
            children: '\u91CD\u7F6E',
          }),
        ],
      }),
      /*#__PURE__*/ _jsx(Menu.Divider, {}),
      /*#__PURE__*/ _jsxs(Checkbox.Group, {
        className: 'settingCheckboxGroup',
        style: {
          display: 'flex',
          flexDirection: 'column',
        },
        value: checkedList,
        onChange: onChange,
        children: [
          topColumns.length > 0
            ? /*#__PURE__*/ _jsx(_Fragment, {
                children: '\u56FA\u5B9A\u5728\u5DE6\u4FA7',
              })
            : /*#__PURE__*/ _jsx(_Fragment, {}),
          topColumns.map(function (d, index) {
            return /*#__PURE__*/ _jsxs(
              'div',
              {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                },
                children: [
                  /*#__PURE__*/ _jsx(
                    Checkbox,
                    {
                      value: d.key || d.dataIndex,
                      children: d.title,
                    },
                    d.key || d.dataIndex,
                  ),
                  /*#__PURE__*/ _jsxs(Space, {
                    children: [
                      /*#__PURE__*/ _jsx('a', {
                        children: /*#__PURE__*/ _jsx(Tooltip, {
                          title: '\u53D6\u6D88\u56FA\u5B9A',
                          children: /*#__PURE__*/ _jsx(VerticalAlignMiddleOutlined, {
                            onClick: function onClick() {
                              cancelFixed(d, 'top');
                            },
                          }),
                        }),
                      }),
                      /*#__PURE__*/ _jsx('a', {
                        children: /*#__PURE__*/ _jsx(Tooltip, {
                          title: '\u56FA\u5B9A\u5728\u5217\u5C3E',
                          children: /*#__PURE__*/ _jsx(VerticalAlignBottomOutlined, {
                            onClick: function onClick() {
                              btmFixedFunc(d, 'top');
                            },
                          }),
                        }),
                      }),
                    ],
                  }),
                ],
              },
              d.key || d.dataIndex,
            );
          }),
          topColumns.length > 0 || btmColumns.length > 0
            ? /*#__PURE__*/ _jsx(_Fragment, {
                children: '\u4E0D\u56FA\u5B9A',
              })
            : /*#__PURE__*/ _jsx(_Fragment, {}),
          initColumns.map(function (d, index) {
            return /*#__PURE__*/ _jsx(
              'div',
              {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                },
                children:
                  !d.topFixed &&
                  !d.btmFixed &&
                  /*#__PURE__*/ _jsxs(_Fragment, {
                    children: [
                      /*#__PURE__*/ _jsx(
                        Checkbox,
                        {
                          value: d.key || d.dataIndex,
                          children: d.title,
                        },
                        d.key || d.dataIndex,
                      ),
                      /*#__PURE__*/ _jsxs(Space, {
                        children: [
                          /*#__PURE__*/ _jsx('a', {
                            children: /*#__PURE__*/ _jsx(Tooltip, {
                              title: '\u4E0A\u79FB',
                              children: /*#__PURE__*/ _jsx(ArrowUpOutlined, {
                                onClick: function onClick() {
                                  var myIndex = initColumns
                                    .filter(function (r) {
                                      return !r.topFixed && !r.btmFixed;
                                    })
                                    .findIndex(function (r) {
                                      return (r.key || r.dataIndex) === (d.key || d.dataIndex);
                                    });

                                  if (myIndex === 0) {
                                    message.error('当前已经是第一位了');
                                    return;
                                  }

                                  initColumns[myIndex] = initColumns.splice(
                                    myIndex - 1,
                                    1,
                                    initColumns[myIndex],
                                  )[0];
                                  setInitColumns(_toConsumableArray(initColumns));
                                  setValue(
                                    _objectSpread(
                                      _objectSpread({}, value),
                                      {},
                                      {
                                        columns: initColumns.filter(function (d) {
                                          return checkedList.includes(d.key || d.dataIndex);
                                        }),
                                      },
                                    ),
                                  );
                                },
                              }),
                            }),
                          }),
                          /*#__PURE__*/ _jsx('a', {
                            children: /*#__PURE__*/ _jsx(Tooltip, {
                              title: '\u4E0B\u79FB',
                              children: /*#__PURE__*/ _jsx(ArrowDownOutlined, {
                                onClick: function onClick() {
                                  var myIndex = initColumns
                                    .filter(function (r) {
                                      return !r.topFixed && !r.btmFixed;
                                    })
                                    .findIndex(function (r) {
                                      return (r.key || r.dataIndex) === (d.key || d.dataIndex);
                                    });

                                  if (myIndex + 1 === initColumns.length) {
                                    message.error('当前已经最后第一位了');
                                    return;
                                  }

                                  initColumns[myIndex] = initColumns.splice(
                                    myIndex + 1,
                                    1,
                                    initColumns[myIndex],
                                  )[0];
                                  setInitColumns(_toConsumableArray(initColumns));
                                  setValue(
                                    _objectSpread(
                                      _objectSpread({}, value),
                                      {},
                                      {
                                        columns: initColumns.filter(function (d) {
                                          return checkedList.includes(d.key || d.dataIndex);
                                        }),
                                      },
                                    ),
                                  );
                                },
                              }),
                            }),
                          }),
                          /*#__PURE__*/ _jsx('a', {
                            children: /*#__PURE__*/ _jsx(Tooltip, {
                              title: '\u56FA\u5B9A\u5728\u5217\u9996',
                              children: /*#__PURE__*/ _jsx(VerticalAlignTopOutlined, {
                                onClick: function onClick() {
                                  topFixedFunc(d);
                                },
                              }),
                            }),
                          }),
                          /*#__PURE__*/ _jsx('a', {
                            children: /*#__PURE__*/ _jsx(Tooltip, {
                              title: '\u56FA\u5B9A\u5728\u5217\u5C3E',
                              children: /*#__PURE__*/ _jsx(VerticalAlignBottomOutlined, {
                                onClick: function onClick() {
                                  btmFixedFunc(d);
                                },
                              }),
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
              },
              d.key || d.dataIndex,
            );
          }),
          btmColumns.length > 0
            ? /*#__PURE__*/ _jsx(_Fragment, {
                children: '\u56FA\u5B9A\u5728\u53F3\u4FA7',
              })
            : /*#__PURE__*/ _jsx(_Fragment, {}),
          btmColumns.map(function (d, index) {
            return /*#__PURE__*/ _jsxs(
              'div',
              {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                },
                children: [
                  /*#__PURE__*/ _jsx(
                    Checkbox,
                    {
                      value: d.key || d.dataIndex,
                      children: d.title,
                    },
                    d.key || d.dataIndex,
                  ),
                  /*#__PURE__*/ _jsxs(Space, {
                    children: [
                      /*#__PURE__*/ _jsx('a', {
                        children: /*#__PURE__*/ _jsx(Tooltip, {
                          title: '\u56FA\u5B9A\u5728\u5217\u9996',
                          children: /*#__PURE__*/ _jsx(VerticalAlignTopOutlined, {
                            onClick: function onClick() {
                              topFixedFunc(d, 'btn');
                            },
                          }),
                        }),
                      }),
                      /*#__PURE__*/ _jsx('a', {
                        children: /*#__PURE__*/ _jsx(Tooltip, {
                          title: '\u53D6\u6D88\u56FA\u5B9A',
                          children: /*#__PURE__*/ _jsx(VerticalAlignMiddleOutlined, {
                            onClick: function onClick() {
                              cancelFixed(d, 'btn');
                            },
                          }),
                        }),
                      }),
                    ],
                  }),
                ],
              },
              d.key || d.dataIndex,
            );
          }),
        ],
      }),
    ],
  });

  return /*#__PURE__*/ _jsx('div', {
    style: {
      maxWidth: 600,
    },
    children: /*#__PURE__*/ _jsx(Dropdown, {
      overlay: menu,
      trigger: ['click'],
      children: /*#__PURE__*/ _jsx(Button, {
        onClick: function onClick(e) {
          return e.preventDefault();
        },
        type: 'primary',
        children: '\u81EA\u5B9A\u4E49\u5217\u8868',
      }),
    }),
  });
}
