import * as React from 'react';
import Svg, { G, Path, Defs, SvgProps } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={22}
    height={26}
    fill="none"
    {...props}
  >
    <G filter="url(#a)">
      <Path
        fill="#FEF7FF"
        d="M5.4 17.412 4 15.671l5.6-6.965L4 1.741 5.4 0 11 6.965 16.6 0 18 1.741l-5.6 6.965 5.6 6.965-1.4 1.741-5.6-6.965-5.6 6.965Z"
      />
    </G>
    <Defs></Defs>
  </Svg>
);
export default SvgComponent;
