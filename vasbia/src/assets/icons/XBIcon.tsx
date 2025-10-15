import * as React from 'react';
import Svg, {  Path,  SvgProps } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#1B2228"
      d="M2.4 24 0 21.6 9.6 12 0 2.4 2.4 0 12 9.6 21.6 0 24 2.4 14.4 12l9.6 9.6-2.4 2.4-9.6-9.6L2.4 24Z"
    />
  </Svg>
)
export default SvgComponent;
