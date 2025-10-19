import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp  } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StackParamList } from '../../App';
import BusRouteScrollComponent from '../components/BusRouteScrollComponent';
import TimeScrollComponent from '../components/TimeScrollComponent';
import BackIcon from '../assets/icons/BackIcon';
import { Dimensions } from 'react-native';
import Config from 'react-native-config';
import { RouteNames } from '../map/RenderBusRoute';

interface RouteData {
  routeId: number;
  busRoute: string;
  stopRange: number[];
  schedules: { time: string; busId: number }[];
}

const RouteInit: RouteData[] = [
  { routeId: 1, busRoute: 'หน้าหอประชุมวิศวะ - อาคาร HM', stopRange: [1, 8], schedules: []},
  { routeId: 2, busRoute: 'Airport Rail Link - KMITL', stopRange: [9, 12], schedules: []},
  // { routeId: 3, busRoute: 'New Route', stopRange: [13, 18], times: []},
];

const BusStopTimeTableScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [routes, setRoutes] = useState<RouteData[]>(RouteInit);
  const [selectedRouteId, setSelectedRouteId] = React.useState<number>(1); // Default to first route

  const route = useRoute<RouteProp<StackParamList, 'BusStopTimeTable'>>();
  const { busStopId, busStopName } = route.params;

  // ============================ Load schedule of this stop from API ===============================
  React.useEffect(() => {
    setRoutes(RouteInit);
    
    fetch(`${Config.BASE_API_URL}/api/busstop/getBusShedule?busId=${busStopId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setRoutes((prevRoutes) => {
          return prevRoutes.map((route) => {
            // find if this route should be updated
            if (busStopId >= route.stopRange[0] && busStopId <= route.stopRange[1]) {
              return {
                ...route,
                schedules: data.busScheduleData.map((item: any) => ({
                  time: item.arriveTime,
                  busId: item.busId
                })),
              };
            }
            // otherwise
            return route;
          });
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);


  const selectedRoute = routes.find((r) => r.routeId === selectedRouteId);

  const handleBusRoutePress = (route: RouteData, _index: number) => {
    setSelectedRouteId(route.routeId);
    //console.log('Selected route:', route.busRoute);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <BackIcon size={40} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bus Stop Schedule</Text>
        <Text style={styles.headerSubtitle}>{busStopName}</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <BusRouteScrollComponent
          routes={routes}
          onBusRoutePress={handleBusRoutePress}
          selectedRouteId={selectedRouteId}
        />

        <TimeScrollComponent
          schedules={selectedRoute?.schedules || []}
          title={`Time: ${selectedRoute?.busRoute || ''}`}
          busStopId={busStopId}
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
