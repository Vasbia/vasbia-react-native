import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface Route {
  id: number;
  busStop: string;
  times: string[];
}

interface BusStopScrollComponentProps {
  routes: Route[];
  onBusStopPress: (route: Route, index: number) => void;
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
      <Text style={styles.sectionTitle}>Bus Route</Text>
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
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollView: {
    paddingLeft: 16,
  },
  scrollContent: {
    paddingRight: 16,
  },
  busStopCard: {
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
  busStopText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    lineHeight: 22,
    alignSelf: 'center',
  },
  selectedBusStopCard: {
    backgroundColor: '#141488',
    borderWidth: 2,
    borderColor: '#3636bb',
  },
  selectedBusStopText: {
    color: '#fff',
  },
  selectedTimesCount: {
    color: '#fff',
    opacity: 0.9,
  },
});

export default BusStopScrollComponent;
