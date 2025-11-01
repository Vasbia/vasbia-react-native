import Svg, { Path, Rect } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
};

export default function UserIcon({ size = 24, color = "#2D6EFF" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      fill="none"
    >
    <Rect width={24} height={24} fill={color} rx={12} />
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M15.6 9.6a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0Zm-1.2 0a2.4 2.4 0 1 1-4.8 0 2.4 2.4 0 0 1 4.8 0Z"
      clipRule="evenodd"
    />
    <Path
      fill="#fff"
      d="M12 15c-3.884 0-7.194 2.297-8.455 5.515.307.305.63.594.97.864C5.452 18.425 8.397 16.2 12 16.2c3.602 0 6.547 2.225 7.486 5.18.339-.271.662-.56.97-.865C19.194 17.297 15.884 15 12 15Z"
    />
    </Svg>
  );
}
