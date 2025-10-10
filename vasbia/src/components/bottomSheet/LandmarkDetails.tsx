import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheetWithHeader from "./BottomSheetWithHeader";

type LandmarkDetails = {
  id: string;
  landmarkName: string;
  coordinate: [number, number]; 
  description?: string;         
  imageUrl?: string;            
};

export default function LandmarkDetails({ data }: { data: LandmarkDetails }) {
  if (!data) return null;

  const header = data.landmarkName;
  const subHeader = data.coordinate.join(", ");

  return (
    <BottomSheetWithHeader
      header={header}
      subHeader={subHeader}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={styles.headerText}>
          {header}
        </Text>
        <Text style={styles.subHeaderText}>
          {subHeader}
        </Text>
        <Text style={styles.description}>
          {data.description ?? "No description"}
        </Text>
      </View>
    </BottomSheetWithHeader>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  subHeaderText: {
    color: "#ccc",
  },
  description: {

  },
});