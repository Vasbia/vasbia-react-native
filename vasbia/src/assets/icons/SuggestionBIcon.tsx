import Svg, { Path, Defs, G, ClipPath } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
};

export default function SuggestionBIcon({ size = 56 }: IconProps) {
  return (
  <Svg
    width={size}
    height={size}
    fill="none"
  >
    <Path
      fill="#fff"
      stroke="#2D6EFF"
      strokeWidth={2}
      d="M20 1h16c10.493 0 19 8.507 19 19v16c0 10.493-8.507 19-19 19H20C9.507 55 1 46.493 1 36V20C1 9.507 9.507 1 20 1Z"
    />
    <Path
      stroke="#1E1E1E"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M21.333 38 9.667 44.667V18l11.666-6.667m0 26.667 13.334 6.667M21.333 38V11.333m13.334 33.334L46.333 38V11.333L34.667 18m0 26.667V18m0 0-13.334-6.667"
    />
    <G clipPath="url(#a)">
      <Path
        fill="#fff"
        stroke="#1E1E1E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m44.5 7.25 1.931 3.912 4.319.632-3.125 3.043.737 4.3-3.862-2.03-3.862 2.03.737-4.3-3.125-3.043 4.319-.632L44.5 7.25Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M37 6h15v15H37z" />
      </ClipPath>
    </Defs>
  </Svg>
);
}
