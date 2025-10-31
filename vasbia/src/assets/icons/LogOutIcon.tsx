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
      stroke="#FF2D2D"
      strokeWidth={3}
      d="M26.71 1.5H3.53c-1.104 0-1.99.894-1.992 1.997l-.038 28a2 2 0 0 0 2 2.003h23.21"
    />
    <Path
      fill="#FF2D2D"
      d="M34.558 18.56a1.5 1.5 0 0 0 0-2.12l-9.546-9.547a1.5 1.5 0 1 0-2.121 2.122l8.485 8.485-8.485 8.485a1.5 1.5 0 1 0 2.121 2.122l9.546-9.546ZM16.043 17.5V19h17.454v-3H16.043v1.5Z"
    />
  </Svg>
)
export default SvgComponent
