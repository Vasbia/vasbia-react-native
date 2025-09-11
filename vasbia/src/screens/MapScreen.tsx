import { View, StyleSheet} from 'react-native';
import { MapView, Camera, MarkerView} from '@maplibre/maplibre-react-native';

import FloatingIconButton from "../components/FloatingIconButton";
import ToggleModeBIcon from "../assets/icons/ToggleModeBIcon";
import RatingBIcon from "../assets/icons/RatingBIcon";
import NotificationBIcon from "../assets/icons/NotificationBIcon";
import RouteIcon from '../assets/icons/RouteIcon';
import LandmarkIcon from '../assets/icons/LandmarkIcon';

export default function MapScreen() {

  return (
    <View style={styles.page}>
      <MapView style={styles.map} mapStyle="https://maptiler.code4.dad/api/maps/bangkok/style.json">
        <Camera centerCoordinate={[100.772451, 13.727075]} zoomLevel={18}/>
        <MarkerView coordinate={[100.772451, 13.727075]}>
          <View style={styles.marker} />
        </MarkerView>
      </MapView>

      <View style={styles.buttonContainer}>
        <ToggleModeBIcon iconOn={<RouteIcon  />} iconOff={<LandmarkIcon  />}/>
        <FloatingIconButton icon={<RatingBIcon />} />
        <FloatingIconButton icon={<NotificationBIcon />} />
      </View>

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

  buttonContainer: {
    position: 'absolute',
    right: 15,
    top: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
