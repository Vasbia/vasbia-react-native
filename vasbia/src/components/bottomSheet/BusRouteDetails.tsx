import React from "react";
import { Text, View } from "react-native";
import BottomSheetWithHeader from "./BottomSheetWithHeader";

export default function BusRouteDetails({ data }: { data: any }) {
  if (!data) return null;

  return (
    <BottomSheetWithHeader
      header={data.routeName}
      subHeader={"Bus route details"}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Route: {data.routeName}
        </Text>
        <Text>
            {"Bus route details"}
        </Text>
        <Text style={{ color: "#ccc", marginTop: 8 }}>
          Stops: {data.stops?.map((s: any) => s.name).join(", ") ?? "N/A"}
        </Text>
      </View>
    </BottomSheetWithHeader>
  );
}
