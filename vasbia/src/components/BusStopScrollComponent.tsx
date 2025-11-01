import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface BusStop {
  id: number;
  busStop: string;
  schedules: { time: string; busId: number }[];
}

interface BusStopScrollComponentProps {
  routes: BusStop[];
  onBusStopPress: (route: BusStop, index: number) => void;
  selectedRouteId?: number;
  containerStyle?: object;
}

const BusStopScrollComponent: React.FC<BusStopScrollComponentProps> = ({
  routes,
  onBusStopPress,
  selectedRouteId,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.sectionTitle}>Bus Stop</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {routes.map((route, index) => {
          const isSelected = route.id === selectedRouteId;
          return (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.busStopCard,
                isSelected && styles.selectedBusStopCard,
              ]}
              onPress={() => onBusStopPress(route, index)}
            >
              <Text style={[
                styles.busStopText,
                isSelected && styles.selectedBusStopText,
              ]}>
                {route.busStop}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_24pt-SemiBold',
    color: '#000',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollView: {
    paddingLeft: 16,
    paddingVertical: 4,
  },
  scrollContent: {
    paddingRight: 16,
    paddingVertical: 4,
  },
  busStopCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  busStopText: {
    fontSize: 16,
    fontFamily: 'Inter_24pt-Medium',
    color: '#000',
    // lineHeight: 22,
  },
  selectedBusStopCard: {
    backgroundColor: '#2d6eff',
    borderWidth: 2,
    borderColor: '#2d6eff',
    alignItems: 'center',
  },
  selectedBusStopText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_24pt-Medium',
  },
  selectedTimesCount: {
    color: '#fff',
    opacity: 0.9,
  },
});

export default BusStopScrollComponent;
