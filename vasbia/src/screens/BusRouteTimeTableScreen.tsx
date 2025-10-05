import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StackParamList } from '../../App';
import BusStopScrollComponent from '../components/BusStopScrollComponent';
import TimeScrollComponent from '../components/TimeScrollComponent';
import BackIcon from '../assets/icons/BackIcon';
import { Dimensions } from 'react-native';

const BusStopTimeTableScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [selectedRouteId, setSelectedRouteId] = React.useState<string>('1'); // Default to first route

  const routeData: Array<{
    id: string;
    busStop: string;
    times: string[];
    description?: string;
  }> = [
    {
      id: '1',
      busStop: 'หน้าหอประชุมวิศวะ',
      times: ['09:00', '11:30', '15:30'],
    },
    {
      id: '2',
      busStop: 'สำนักงานคณบดี ตึก A',
      times: ['09:01', '11:31', '15:31'],
    },
    {
      id: '3',
      busStop: 'โรงอาหาร A',
      times: ['09:02', '11:32', '15:32'],
    },
    {
      id: '4',
      busStop: 'อาคาร CV',
      times: ['09:03', '11:33', '15:33'],
    },
    {
      id: '5',
      busStop: 'อาคาร ME, อาคาร IE',
      times: ['09:04', '11:34', '15:34'],
    },
    {
      id: '6',
      busStop: 'อาคาร 12 ชั้น',
      times: ['09:05', '11:35', '15:35'],
    },
    {
      id: '7',
      busStop: 'อาคาร CCA',
      times: ['09:09', '11:39', '15:39'],
    },
    {
      id: '8',
      busStop: 'อาคาร HM',
      times: ['09:11', '11:41', '15:41'],
    },
  ];

  const selectedRoute = routeData.find(route => route.id === selectedRouteId);
  const selectedTimes = selectedRoute ? selectedRoute.times.sort() : [];

  const handleBusStopPress = (route: typeof routeData[0], _index: number) => {
    setSelectedRouteId(route.id);
    console.log('Selected route:', route.busStop);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <BackIcon size={40} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bus Route Schedule</Text>
        <Text style={styles.headerSubtitle}>หน้าหอประชุมวิศวะ - อาคาร HM</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <BusStopScrollComponent
          routes={routeData}
          onBusStopPress={handleBusStopPress}
          selectedRouteId={selectedRouteId}
        />

        <TimeScrollComponent
          times={selectedTimes}
          title={`Time: ${selectedRoute?.busStop || ''}`}
        />



      </ScrollView>
    </View>
  );
};

const { width: screenWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#696969',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  scrollContainer: {
    flex: 1,

  },
  tableContainer: {
    backgroundColor: '#666',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
  },
  headerCellDestination: {
    flex: 2,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 60,
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  routeCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  routeNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D6EFF',
    backgroundColor: '#e8f2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    textAlign: 'center',
    minWidth: 40,
  },
  destinationCell: {
    flex: 2,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  destinationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  timesCell: {
    flex: 1,
    paddingVertical: 8,
  },
  timesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  timeSlot: {
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 2,
    minWidth: 50,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  legend: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  evenRow: {
    backgroundColor: '#ffffff',
  },
  oddRow: {
    backgroundColor: '#f8f9fa',
  },
  detailCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  detailButton: {
    backgroundColor: '#2D6EFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    left: screenWidth * 0.025,
    top: '70%',
    transform: [{ translateY: -screenWidth * 0.035 }],
  },
});

export default BusStopTimeTableScreen;
