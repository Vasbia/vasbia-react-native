import { TouchableOpacity, StyleSheet } from 'react-native';
import BusStopIcon from '../assets/icons/BusStopIcon';

type BusStopButtonProps = {
  selected?: boolean;
  onPress?: () => void;
};

export default function BusStopButton({ selected, onPress }: BusStopButtonProps) {
    const size = selected ? 45 : 30;
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: size, height: (size * 41) / 29 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <BusStopIcon size={size} color={selected ? '#FF0000' : '#2D6EFF'} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 10,
  },
});
