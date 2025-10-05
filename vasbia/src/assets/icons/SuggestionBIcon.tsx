import Svg, { Path, Defs, G, ClipPath } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
};

export default function SuggestionBIcon({ size = 70 }: IconProps) {
  return (
  <Svg
    width={size}
    height={(size * 57) / 70}
    fill="none"
  >
    <G clipPath="url(#a)">
      <Path
        fill="#fff"
        stroke="#2D6EFF"
        strokeWidth={2}
        d="M20 1h30c10.493 0 19 8.507 19 19v17c0 10.493-8.507 19-19 19H20C9.507 56 1 47.493 1 37V20C1 9.507 9.507 1 20 1Z"
      />
      <Path
        fill="#fff"
        stroke="#1E1E1E"
        strokeLinejoin="round"
        strokeWidth={3}
        d="m50.5 34.083 4.5 11.5H15l4.5-11.5h31Z"
      />
      <Path
        fill="#fff"
        d="M48.25 20.75c0 9.917-12.75 18.417-12.75 18.417s-12.75-8.5-12.75-18.417a12.75 12.75 0 0 1 25.5 0Z"
      />
      <Path
        fill="#fff"
        d="M35.5 25a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Z"
      />
      <Path
        stroke="#1E1E1E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M48.25 20.75c0 9.917-12.75 18.417-12.75 18.417s-12.75-8.5-12.75-18.417a12.75 12.75 0 0 1 25.5 0Z"
      />
      <Path
        stroke="#1E1E1E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M35.5 25a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h70v57H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
}
