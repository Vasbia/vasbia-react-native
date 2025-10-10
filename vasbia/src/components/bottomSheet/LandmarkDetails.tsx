import React from "react";
import { Text, View } from "react-native";
import BottomSheetWithHeader from "./BottomSheetWithHeader";

export default function LandmarkDetails({ data }: { data: any }) {
  if (!data) return null;

  return (
    <BottomSheetWithHeader
      header={data.landmarkName}
      subHeader={"Landmark details"}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          {data.landmarkName}
        </Text>
        <Text>
            {"Landmark details"}
        </Text>
        <Text style={{ color: "#ccc", marginTop: 8 }}>
          {data.description ?? "No description"}
        </Text>
      </View>
    </BottomSheetWithHeader>
  );
}
