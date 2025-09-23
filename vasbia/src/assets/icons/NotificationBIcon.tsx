import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
};



export default function NotificationBIcon({ size = 49}: IconProps) {
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
      <Path
        fill="#2D6EFF"
        d="M12.833 29.708v-2.916h2.917V16.583c0-2.017.608-3.803 1.823-5.36 1.215-1.579 2.795-2.612 4.74-3.098v-1.02c0-.608.206-1.119.62-1.532a2.14 2.14 0 0 1 1.567-.656c.608 0 1.118.218 1.531.656.438.413.657.924.657 1.531v1.021c1.944.486 3.524 1.52 4.74 3.099 1.214 1.556 1.822 3.342 1.822 5.36v10.208h2.917v2.916H12.833ZM24.5 34.083c-.802 0-1.495-.28-2.078-.838a2.901 2.901 0 0 1-.839-2.078h5.834c0 .802-.292 1.494-.875 2.078a2.779 2.779 0 0 1-2.042.838Zm-5.833-7.291h11.666V16.583c0-1.604-.57-2.977-1.713-4.12-1.143-1.142-2.516-1.713-4.12-1.713s-2.977.571-4.12 1.713c-1.142 1.143-1.713 2.516-1.713 4.12v10.209Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h49v40H0z" />
      </ClipPath>
    </Defs>
  </Svg>
  );
}
