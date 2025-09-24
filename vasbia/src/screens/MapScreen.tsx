import { useState, useRef } from "react";
import { View, StyleSheet } from 'react-native';
import { MapView, Camera, MarkerView, CameraRef } from '@maplibre/maplibre-react-native';
import { useFlyTo } from "../map/useFlyTo";

import ToggleModeButton from "../components/ToggleModeButton";
import RatingButton from "../components/RatingButton";
import NotificationButton from "../components/NotificationButton";
import RenderAllBusStops from "../map/RenderBusStop";
import RenderAllBusRoutes from "../map/RenderBusRoute";
import RenderAllLandmarks from "../map/RenderLandmark";

type MapMode = "bus" | "landmark";

export default function MapScreen() {
  const [initialSet, setInitialSet] = useState(false);
  const [mode, setMode] = useState<MapMode>("bus");
  const [selectedId, setSelectedId] = useState<string | null>("null");
  
  const cameraRef = useRef<CameraRef>(null);
  const flyTo = useFlyTo(cameraRef);

  return (
    <View style={styles.page}>
      <MapView style={styles.map} mapStyle="https://maptiler.code4.dad/api/maps/bangkok/style.json"
        onDidFinishLoadingMap={() => {
          if (!initialSet) {
            cameraRef.current?.setCamera({
              centerCoordinate: [100.772451, 13.727075],
              zoomLevel: 18,
              animationDuration: 1000,
            });
            setInitialSet(true);
          }
        }}
      >
        <Camera ref={cameraRef} />
        
        <MarkerView coordinate={[100.772451, 13.727075]}>
          <View style={styles.marker} />
        </MarkerView>

        {mode === "bus" && (
          <>
            <RenderAllBusRoutes selectedId={selectedId} setSelectedId={setSelectedId} />
            <RenderAllBusStops selectedId={selectedId} setSelectedId={setSelectedId} flyTo={flyTo}/>
          </>
        )}

        {mode === "landmark" && (
          <RenderAllLandmarks selectedId={selectedId} setSelectedId={setSelectedId} flyTo={flyTo}/>
        )}

      </MapView>

      <View style={styles.buttonContainer}>
        <ToggleModeButton onToggle={(isBusMode) => {
          setMode(isBusMode ? "bus" : "landmark");
          setSelectedId(null);
        }} />
        <RatingButton />
        <NotificationButton />
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
    gap: 7,
  },

});
