import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheetWithHeader from "./BottomSheetWithHeader";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../../App";

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

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const header = data.routeName;
  const subHeader = data.id;

  return (
    <BottomSheetWithHeader
      header={header}
      subHeader={subHeader}
    >
      <View style={styles.container}>
        <View>
          <Text style={styles.headerText}>
            Bus stop: {header}
          </Text>
          <Text style={styles.subHeaderText}>
            {subHeader}
          </Text>
        </View>

        <TouchableOpacity onPress = {() => navigation.navigate('BusRouteTimeTable')}>
          <Text style={styles.timeTable}>ดูตารางเวลา</Text>
        </TouchableOpacity>
        
        <Text style={{ color: "#ccc", marginTop: 8 }}>
          Stops: {data.stops?.map((s: any) => s.name).join(", ") ?? "N/A"}
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
    color: "#fff"
  },
  subHeaderText: {
    fontWeight: "medium",
    paddingBottom: 12,
    color: "#fff"
  },
  timeTable: {
    fontWeight: "bold", 
    fontSize: 16, 
    paddingBottom: 12, 
    alignSelf: "center", 
    color: "#fff"
  },
  description: {
    fontWeight: "medium",
    color: "#fff"
  },
});