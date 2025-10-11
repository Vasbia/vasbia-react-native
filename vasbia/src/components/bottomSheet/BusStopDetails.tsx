import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheetWithHeader from "./BottomSheetWithHeader";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../../App";

type BusStopDetails = {
  id: string;
  busStopName: string;
  subDetails: string; 
  routes: string[];          
};

export default function BusStopDetails({ data }: { data: BusStopDetails }) {
  if (!data) return null;

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  
  const header = data.busStopName;
  const subHeader = data.subDetails;

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
        
        <TouchableOpacity onPress = {() => navigation.navigate('BusStopTimeTable')}>
          <Text style={styles.timeTable}>ดูตารางเวลา</Text>
        </TouchableOpacity>

        <Text style={styles.description}>
          Routes: {data.routes?.join(", ") ?? "N/A"}
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