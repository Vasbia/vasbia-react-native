import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import BottomSheetWithHeader from "./BottomSheetWithHeader";

type LandmarkDetails = {
  id: number;
  landmarkName: string;
  subDetails?: string; 
  description?: string;
  imageUrl?: string;
};

export default function LandmarkDetails({ data }: { data: LandmarkDetails }) {
  if (!data) return null;

  const header = data.landmarkName;
  const subHeader = data.subDetails;

  return (
    <BottomSheetWithHeader
      header={header}
      subHeader={subHeader}
    >
      <View style={styles.container}>
        <View>
          <Text style={styles.headerText}>
            {header}
          </Text>
          <Text style={styles.subHeaderText}>
            {subHeader}
          </Text>
        </View>

        {data.imageUrl && (
          <Image source={{ uri: data.imageUrl }} style={styles.image} />
        )}
        
        <Text style={styles.description}>
          {data.description ?? "No description"}
        </Text>
      </View>
    </BottomSheetWithHeader>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000"
  },
  subHeaderText: {
    fontWeight: "medium",
    paddingBottom: 12,
    color: "#000"
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginVertical: 15,
  },
  description: {
    fontWeight: "medium",
    color: "#000"
  },
});