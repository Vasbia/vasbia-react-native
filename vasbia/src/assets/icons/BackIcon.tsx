import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
  style?: object;
};

const BackIcon = ({ size = 24, color = '#1E1E1E', style }: IconProps) => (
  <Svg
    width={size}
    height={size}
    style={style}
    fill="none"
    viewBox="0 0 49 49" // make sure it's scalable
  >
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M37.708 27.5H17.292m0 0L27.5 37.708M17.292 27.5 27.5 17.292"
    />
  </Svg>
);

export default BackIcon;
