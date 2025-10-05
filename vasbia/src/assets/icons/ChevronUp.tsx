import * as React from "react"
import Svg, { Path } from "react-native-svg"
export default function ChevronUp() {
  return (
    <Svg
    width={44}
    height={16}
    fill="none"
  >
    <Path
      stroke="#F3F3F3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M41.5 14 22 2 2.5 14"
    />
  </Svg>
  );
}