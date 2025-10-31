import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props : any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={35}
    height={35}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2D6EFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="m17.5 1.5 4.944 10.532 11.056 1.7-8 8.193L27.388 33.5 17.5 28.032 7.612 33.5 9.5 21.925l-8-8.194 11.056-1.699L17.5 1.5Z"
    />
  </Svg>
)
export default SvgComponent