import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSheetWithHeader from './BottomSheetWithHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamList } from '../../../App';

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
  if (!data) {return null;}

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const header = 'Route: ' + data.routeName;
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
          <Text style={styles.timeTable}>Click to see time table</Text>
        </TouchableOpacity>

        <Text style={{ color: '#000', fontFamily: 'Inter_24pt-Regular', marginTop: 8 }}>
          Bus Stops: {data.stops?.map((s: any) => s.name).join(', ') ?? 'N/A'}
        </Text>
      </View>
    </BottomSheetWithHeader>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Inter_24pt-Bold',
    color: '#000',
  },
  subHeaderText: {
    fontFamily: 'Inter_24pt-Medium',
    paddingBottom: 12,
    color: '#000',
  },
  tableButton : {
    paddingBottom:12,
  },
  timeTable: {
    fontFamily: 'Inter_24pt-SemiBold',
    fontSize: 16,
    alignSelf: 'center',
    color: '#fff',
    backgroundColor: '#2d6eff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontFamily: 'Inter_24pt-Medium',
    fontSize: 14,
    color: '#000',
  },
});
