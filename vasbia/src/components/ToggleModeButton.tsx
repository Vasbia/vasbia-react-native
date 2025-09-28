import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import RouteToggleIcon from '../assets/icons/RouteToggleIcon';
import LandmarkToggleIcon from '../assets/icons/LandmarkToggleIcon';

type ToggleIconButtonProps = {
  onToggle?: (state: boolean) => void;
  initial?: boolean;
};

export default function ToggleModeButton({onToggle, initial = true}: ToggleIconButtonProps) {
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
      {isOn ? <RouteToggleIcon /> : <LandmarkToggleIcon />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    
  },
});
