import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheetWithHeader from "./BottomSheetWithHeader";

type BusStopDetails = {
  id: string;
  busStopName: string;
  coordinate: [number, number]; 
  routes: string[];          
};

export default function BusStopDetails({ data }: { data: BusStopDetails }) {
  if (!data) return null;

  const header = data.busStopName;
  const subHeader = data.coordinate.join(", ");

  return (
    <BottomSheetWithHeader
      header={header}
      subHeader={subHeader}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={styles.headerText}>
          Bus Stop: {header}
        </Text>
        <Text style={styles.subHeaderText}>
            {subHeader}
        </Text>
        <Text style={styles.description}>
          Routes: {data.routes?.join(", ") ?? "N/A"}
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