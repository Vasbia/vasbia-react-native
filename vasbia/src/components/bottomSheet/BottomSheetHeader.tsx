import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

type BottomSheetHeaderProps = {
  onPress: () => void;
  children: React.ReactNode;
};

export default function BottomSheetHeader({ onPress, children }: BottomSheetHeaderProps) {
  return (
    <TouchableOpacity style={styles.headerContainer} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.dragHandle} />
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#353638",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#aaa",
    borderRadius: 2,
    marginBottom: 8,
  },
});
