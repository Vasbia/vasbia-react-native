import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheetWithHeader from "./BottomSheetWithHeader";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../../App";

type BusRouteDetails = {
  id: number;
  routeName: string;
  subDetails?: string;
  stops: {
    busStopId: number;
    name: string;
  }[];
};

export default function BusRouteDetails({ data }: { data: BusRouteDetails }) {
  if (!data) return null;

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const header = "สายรถ : " + data.routeName;
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

        <TouchableOpacity onPress={() => navigation.navigate('BusRouteTimeTable', {
          routeId: data.id,
          routeName: data.routeName,
          })
        } style={styles.tableButton}>
          <Text style={styles.timeTable}>ดูตารางเวลา</Text>
        </TouchableOpacity>
        
        <Text style={{ color: "#000", marginTop: 8 }}>
          ป้ายจอดรถ: {data.stops?.map((s: any) => s.name).join(", ") ?? "N/A"}
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
  tableButton : {
    paddingBottom:12
  },
  timeTable: {
    fontWeight: "bold", 
    fontSize: 16, 
    alignSelf: "center", 
    color: "#fff",
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontWeight: "medium",
    color: "#000"
  },
});