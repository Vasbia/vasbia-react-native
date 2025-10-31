import { TouchableOpacity, StyleSheet } from 'react-native';
import BusStopIcon from '../assets/icons/BusStopIcon';

type BusStop= {
  stopId: number;
  stopName: string;
  coordinate: [number, number];
};

type SelectedItem = {
  type: "busStop" | "busRoute" | "landmark" | null;
  id: number | null;
};

type BusStopButtonProps = {
  stop: BusStop;
  selected: SelectedItem;
  setSelected: (item: SelectedItem) => void;
  flyTo: (coordinate: [number, number], duration?: number, zoom?: number) => void;
};

export default function BusStopButton({ stop, selected, setSelected, flyTo }: BusStopButtonProps) {
  const isSelected = (selected.id === stop.stopId && selected.type === "busStop");
  const size = isSelected ? 44 : 32;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: size, height: (size * 46) / 32 },
      ]}
      onPress={ () => {
        if (isSelected) {
          setSelected({ type: null, id: null });
        } else {
          setSelected({type: "busStop", id: stop.stopId});
        }
        flyTo(stop.coordinate);
      }}
      activeOpacity={0.7}
    >
      <BusStopIcon size={size} color={isSelected ? '#FF0000' : '#1F0198'} />
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
