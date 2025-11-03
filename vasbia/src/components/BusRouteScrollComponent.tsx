import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface Route {
  routeId: number;
  busRoute: string;
  stopRange: number[];
  schedules: { time: string; busId: number }[];
}

interface BusRouteScrollComponentProps {
  routes: Route[];
  onBusRoutePress: (route: Route, index: number) => void;
  selectedRouteId?: number;
  containerStyle?: object;
}

const BusRouteScrollComponent: React.FC<BusRouteScrollComponentProps> = ({
  routes,
  onBusRoutePress,
  selectedRouteId,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.sectionTitle}>Bus Route</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {routes.map((route, index) => {
          const isSelected = route.routeId === selectedRouteId;
          return (
            <TouchableOpacity
              key={route.routeId}
              style={[
                styles.busRouteCard,
                isSelected && styles.selectedBusRouteCard,
              ]}
              onPress={() => onBusRoutePress(route, index)}
            >
              <Text style={[
                styles.busRouteText,
                isSelected && styles.selectedBusRouteText,
              ]}>
                {route.busRoute}
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
  busRouteCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busRouteText: {
    fontSize: 16,
    fontFamily: 'Inter_24pt-Medium',
    color: '#000',
    // lineHeight: 22,
  },
  selectedBusRouteCard: {
    backgroundColor: '#2d6eff',
    borderWidth: 2,
    borderColor: '#2d6eff',
  },
  selectedBusRouteText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_24pt-Medium',
  },
  selectedTimesCount: {
    color: '#fff',
    opacity: 0.9,
  },
});

export default BusRouteScrollComponent;
