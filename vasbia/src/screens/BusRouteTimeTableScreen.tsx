import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StackParamList } from '../../App';
import BusStopScrollComponent from '../components/BusStopScrollComponent';
import TimeScrollComponent from '../components/TimeScrollComponent';
import BackIcon from '../assets/icons/BackIcon';
import { Dimensions } from 'react-native';
import Config from 'react-native-config';
import ToastError from '../components/ToastError';
import ToastSuccess from '../components/ToastSuccess';

interface BusStop {
  id: number;
  busStop: string;
  schedules: { time: string; busId: number }[];
  pastSchedules?: { time: string; busId: number }[];
}

const BusRouteTimeTableScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [selectedStopId, setSelectedStopId] = React.useState<number>(1);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const route = useRoute<RouteProp<StackParamList, 'BusRouteTimeTable'>>();
  const { routeId, routeName } = route.params;

  useEffect(() => {
    setBusStops([]);
    fetch(`${Config.BASE_API_URL}/api/busstop/route/${routeId}`)
      .then((res) => {
        if (!res.ok) {throw new Error('Network error ' + res.status);}
        return res.json();
      })
      .then((data) => {
        const formatted: BusStop[] = data.map((stop: any) => ({
          id: stop.busStopId,
          busStop: stop.name,
          schedules: [],
          pastSchedules: [],
        }));
        setBusStops(formatted);
      })
      .catch((err) => console.error('Error fetching route:', err));
  }, []);

  const handleBusStopPress = (stop: BusStop, _index: number) => {
    setSelectedStopId(stop.id);

    fetch(`${Config.BASE_API_URL}/api/busstop/getBusShedule?busId=${stop.id}`)
      .then((res) => {
        if (!res.ok) {throw new Error('Network error ' + res.status);}
        return res.json();
      })
      .then((data) => {
        setBusStops((prev) =>
          prev.map((item) =>
            item.id === stop.id ? {
              ...item, schedules: data.busScheduleData.map((s: any) => ({
                time: s.arriveTime,
                busId: s.busId,
              })),
              pastSchedules: (data.busScheduleDataPast || []).map((s: any) => ({
                time: s.arriveTime,
                busId: s.busId,
              })),
            } : item
          )
        );
      })
      .catch((err) => console.error('Error fetching times:', err));
  };

  const selectedStop = busStops.find((stop) => stop.id === selectedStopId);

  return (
    <View style={styles.container}>
      {showSuccess && (
        <ToastSuccess toastMessage={successMsg} onHide={() => setShowSuccess(false)} />
      )}
      {showError && (
        <ToastError toastMessage={errorMsg} onHide={() => setShowError(false)} />
      )}

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <BackIcon size={40} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bus Route Schedule</Text>
        <Text style={styles.headerSubtitle}>{routeName}</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <BusStopScrollComponent
          routes={busStops}
          onBusStopPress={handleBusStopPress}
          selectedRouteId={selectedStopId}
        />

        <TimeScrollComponent
          schedules={selectedStop?.schedules || []}
          pastSchedules={[...(selectedStop?.pastSchedules || [])].sort((a, b) => (a.time > b.time ? 1 : -1))}
          title={`Time: ${selectedStop?.busStop || ''}`}
          busStopId={selectedStopId}
          onSuccess={(msg) => { setSuccessMsg(msg); setShowSuccess(true); }}
          onError={(msg) => { setErrorMsg(msg); setShowError(true); }}
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
    paddingTop: 64,
    paddingBottom: 20,
    paddingHorizontal: screenWidth * 0.025,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Inter_24pt-Bold',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_24pt-Medium',
    color: '#000000',
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
    fontFamily: 'Inter_24pt-SemiBold',
    fontSize: 14,
    color: '#495057',
    textAlign: 'center',
  },
  headerCellDestination: {
    flex: 2,
    fontFamily: 'Inter_24pt-SemiBold',
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
    left: 16,
    top: '100%',
    transform: [{ translateY: -screenWidth * 0.035 }],
  },
});

export default BusRouteTimeTableScreen;
