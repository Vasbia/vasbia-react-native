import React, { useState } from "react";
import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheet from "./BottomSheet";
import ChevronUp from "../../assets/icons/ChevronUp";

type BottomSheetWithHeaderProps = {
  header: string;
  subHeader: string;
  children: React.ReactNode;
};

export default function BottomSheetWithHeader({
  header,
  subHeader,
  children,
}: BottomSheetWithHeaderProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <>
      {!expanded && (
        <TouchableOpacity style={styles.headerContainer} onPress={toggleExpand}>
          <View style={styles.dragHandle}>
            <ChevronUp />
          </View>
          <Text style={styles.headerText}>{header}</Text>
          <Text style={styles.subHeaderText}>{subHeader}</Text>
        </TouchableOpacity>
      )}

      <BottomSheet visible={expanded} onClose={toggleExpand}>
        {children}
      </BottomSheet>
    </>
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
    paddingHorizontal: 30,
  },
  dragHandle: {
    marginBottom: 8,
    alignSelf: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  subHeaderText: {
    color: "#ccc",
    paddingBottom: 10,
  },
});