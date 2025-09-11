import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

type ToggleIconButtonProps = {
  iconOn: React.ReactNode;   
  iconOff: React.ReactNode;
  onToggle?: (state: boolean) => void;
  initial?: boolean;
};

export default function ToggleModeBIcon({
  iconOn,
  iconOff,
  onToggle,
  initial = false,
}: ToggleIconButtonProps) {
  const [isOn, setIsOn] = useState(initial);

  const handlePress = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {isOn ? iconOn : iconOff}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingBottom: 7,
  },
});
