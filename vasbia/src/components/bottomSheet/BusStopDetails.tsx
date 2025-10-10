import React from "react";
import { Text, View } from "react-native";
import BottomSheetWithHeader from "./BottomSheetWithHeader";

export default function BusStopDetails({ data }: { data: any }) {
  if (!data) return null;

  return (
    <BottomSheetWithHeader
      header={data.busStopName}
      subHeader={"Bus stop information"}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Bus Stop: {data.busStopName}
        </Text>
        <Text>
            {"Bus stop information"}
        </Text>
        <Text style={{ color: "#ccc", marginTop: 8 }}>
          Routes: {data.routes?.join(", ") ?? "N/A"}
        </Text>
      </View>
    </BottomSheetWithHeader>
  );
}
