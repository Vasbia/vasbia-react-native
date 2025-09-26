import { TouchableOpacity, StyleSheet } from "react-native";
import LandmarkIcon from "../assets/icons/LandmarkIcon";

type LandmarkButtonProps = {
  selected?: boolean;
  onPress?: () => void;
};

export default function LandmarkButton({ selected, onPress }: LandmarkButtonProps) {
    const size = selected ? 35 : 27; 
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { width: size, height: (size * 41) / 29 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LandmarkIcon size={size} color={selected ? "#FF0000" : "#2D6EFF"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
