import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheetWithHeader from "./BottomSheetWithHeader";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../../App";

type BusStopDetails = {
  id: number;
  busStopName: string;
  subDetails?: string; 
  routes?: string[];          
};

export default function BusStopDetails({ data }: { data: BusStopDetails }) {
  if (!data) return null;

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  
  const header = "ป้ายจอดรถ : " + data.busStopName;
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
        
        <TouchableOpacity onPress={() => navigation.navigate('BusStopTimeTable', {
          busStopId: data.id,
          busStopName: data.busStopName,
          })
        } >
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
    color: "#000"
  },
  subHeaderText: {
    fontWeight: "medium",
    paddingBottom: 12,
    color: "#000"
  },
  timeTable: {
    fontWeight: "bold", 
    fontSize: 16, 
    paddingBottom: 12, 
    alignSelf: "center", 
    color: "#000"
  },
  description: {
    fontWeight: "medium",
    color: "#000"
  },
});