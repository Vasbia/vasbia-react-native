import { TouchableOpacity, StyleSheet } from "react-native";
import LandmarkIcon from "../assets/icons/LandmarkIcon";

type Landmark= {
  landmarkId: string;
  landmarkName: string;
  coordinate: [number, number];
};

type SelectedItem = {
  type: "busStop" | "busRoute" | "landmark" | null;
  id: string | null;
};

type LandmarkButtonProps = {
  landmark: Landmark;
  selected: SelectedItem;
  setSelected: (item: SelectedItem) => void;
  flyTo: (coordinate: [number, number], duration?: number, zoom?: number) => void;
};

export default function LandmarkButton({ landmark, selected, setSelected, flyTo }: LandmarkButtonProps) {
  const isSelected = (selected.id === landmark.landmarkId && selected.type === "landmark")
  const size = isSelected ? 35 : 27; 

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { width: size, height: (size * 41) / 29 },
      ]}
      onPress={ () => {
        if (isSelected) {
          setSelected({ type: null, id: null });
        } else {
          setSelected({type: "landmark", id: landmark.landmarkId});
        }
        flyTo(landmark.coordinate);
      }}
      activeOpacity={0.7}
    >
      <LandmarkIcon size={size} color={isSelected ? "#FF0000" : "#2D6EFF"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
