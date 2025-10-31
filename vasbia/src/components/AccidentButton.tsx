import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import AccidentIcon from "../assets/icons/AccidentIcon";

type BusDriverButtonProps = {
  selected?: boolean;
  onPress?: () => void;
};

export default function BusDriverButton({ selected, onPress }: BusDriverButtonProps) {
  // Change size slightly if selected (optional animation style)
  const size = selected ? 49 : 40;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: size, height: (size * 40) / 49 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <AccidentIcon
        size={size}
        color={selected ? "#FF0000" : "#2D6EFF"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
