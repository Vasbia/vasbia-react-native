import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
};

export default function RatingBIcon({ size = 49, color = "#2D6EFF" }: IconProps) {
  return (
  <Svg
    width={size}
    height={(size * 40) / 49}
    fill="none"
  >
    <G clipPath="url(#a)">
      <Path
        fill="#fff"
        stroke="#2D6EFF"
        strokeWidth={2}
        d="M20 1h9c10.493 0 19 8.507 19 19s-8.507 19-19 19h-9C9.507 39 1 30.493 1 20S9.507 1 20 1Z"
      />
    </G>
    <Path
      stroke="#2D6EFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="m24.5 5.083 4.764 9.651 10.653 1.557-7.709 7.508 1.82 10.607-9.528-5.01-9.527 5.01 1.819-10.607-7.709-7.508 10.653-1.557 4.764-9.65Z"
    />
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h49v40H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
}
