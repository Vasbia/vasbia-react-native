import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheetWithHeader from "./BottomSheetWithHeader";

type BusRouteDetails = {
  id: string;
  routeName: string;
  stops: {
    id: string;
    name: string;
  }[];
};

export default function BusRouteDetails({ data }: { data: any }) {
  if (!data) return null;

  const header = data.routeName;
  const subHeader = "";

  return (
    <BottomSheetWithHeader
      header={header}
      subHeader={subHeader}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={styles.headerText}>
          Route: {header}
        </Text>
        <Text style={styles.subHeaderText}>
            {subHeader}
        </Text>
        <Text style={{ color: "#ccc", marginTop: 8 }}>
          Stops: {data.stops?.map((s: any) => s.name).join(", ") ?? "N/A"}
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