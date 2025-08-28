import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MapView, Camera, PointAnnotation, MarkerView} from '@maplibre/maplibre-react-native';

export default function App() {
  return (
    <View style={styles.page}>
      <MapView style={styles.map} mapStyle="https://maptiler.code4.dad/api/maps/bangkok/style.json">
        <Camera centerCoordinate={[100.5018, 13.7563]} zoomLevel={12}/>
        {/* <PointAnnotation id={"test"} coordinate={[100.5018, 13.7563]}/> */}
        <MarkerView coordinate={[100.5018, 13.7563]}>
          <View style={styles.marker} />
        </MarkerView>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  map: { flex: 1 },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
    borderColor: 'white',
    borderWidth: 2,
  },
});
