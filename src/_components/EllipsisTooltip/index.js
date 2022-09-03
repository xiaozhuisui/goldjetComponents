import React from 'react';
import { Tooltip } from 'antd';

class EllipsisTooltip extends React.Component {
  state = {
    visible: false,
  };

  handleVisibleChange = (visible) => {
    if (this.props.title.length > this.props.maxLength) {
      this.setState({
        visible,
      });
    }
  };

  render() {
    const style = {
      ...this.props.style,
    };

    return (
      <Tooltip
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        title={this.props.title}
      >
        <div className="customEllipse" style={style}>
          {this.props.showInfo}
        </div>
      </Tooltip>
    );
  }
}
export default EllipsisTooltip;
