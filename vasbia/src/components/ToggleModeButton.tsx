import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import RouteToggleIcon from '../assets/icons/RouteToggleIcon';
import LandmarkToggleIcon from '../assets/icons/LandmarkToggleIcon';

type MapMode = 'bus' | 'landmark';

type ToggleIconButtonProps = {
  mode: MapMode;
  setMode: (item: MapMode) => void;
  onToggle: () => void;
};

export default function ToggleModeButton({mode, setMode, onToggle}: ToggleIconButtonProps) {

  const handlePress = () => {
    (mode === 'bus') ? setMode('landmark') : setMode('bus')
    if (onToggle) onToggle();
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {(mode === 'bus') ? <RouteToggleIcon /> : <LandmarkToggleIcon />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    
  },
});