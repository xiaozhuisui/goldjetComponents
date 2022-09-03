import React from 'react';
import { Image } from 'antd';

const ShowImage: React.FC = (props: any) => {
  const { width = 50, height = 50, value, ...restProps } = props;

  return <Image width={width} height={height} src={value} {...restProps}></Image>;
};

export default ShowImage;
