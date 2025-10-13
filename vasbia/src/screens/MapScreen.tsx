import React from 'react';
import { useState, useRef } from 'react';
import { View, StyleSheet, Text} from 'react-native';
import { MapView, Camera, MarkerView, CameraRef } from '@maplibre/maplibre-react-native';
import { useFlyTo } from '../map/useFlyTo';
import ToggleModeButton from '../components/ToggleModeButton';
import RatingButton from '../components/RatingButton';
import RatingModal from '../components/bottomSheet/RatingModal';
import NotificationButton from '../components/NotificationButton';
import SuggestionButton from '../components/SuggestionButton';
import { useNavigation } from '@react-navigation/native';
import type { StackParamList } from '../../App';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SearchBar from '../components/SearchBar';
import RenderAllBusStops from '../map/RenderBusStop';
import RenderAllBusRoutes from '../map/RenderBusRoute';
import RenderAllLandmarks from '../map/RenderLandmark';

type MapMode = 'bus' | 'landmark';

export default function MapScreen() {
  const [initialSet, setInitialSet] = useState(false);
  const [mode, setMode] = useState<MapMode>('bus');
  const [selected, setSelected] = useState<{
    type: 'busStop' | 'busRoute' | 'landmark' | null;
    id: string | null;
  }>({ type: null, id: null });


  const cameraRef = useRef<CameraRef>(null);
  const flyTo = useFlyTo(cameraRef);

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [modalVisible, setModalVisible] = React.useState(false);
  // const [searchText, setSearchText] = React.useState('');

  return (
    <View style={styles.page}>
      <View style={styles.searchBarContainer}>
        <Text style={styles.appTitle}>VASBIA</Text>
        <SearchBar/>
      </View>

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

        {mode === 'bus' && (
          <>
            <RenderAllBusRoutes selected={selected} setSelected={setSelected} />
            <RenderAllBusStops selected={selected} setSelected={setSelected} flyTo={flyTo}/>
          </>
        )}

        {mode === 'landmark' && (
          <RenderAllLandmarks selected={selected} setSelected={setSelected} flyTo={flyTo}/>
        )}

      </MapView>

      <View style={styles.buttonContainer}>
        <ToggleModeButton onToggle={(isBusMode) => {
          setMode(isBusMode ? 'bus' : 'landmark');
          setSelected({ type: null, id: null });
        }} />
        <RatingButton onPressButton = {() => { console.log('RatingBIcon pressed'); setModalVisible(true); }} />
        <NotificationButton  onPressButton = {() => navigation.navigate('Notification')} />
      </View>

      <View style={styles.suggestButton}>
        <SuggestionButton />
      </View>

      <RatingModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

// const { width: screenWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  appTitle:{
    marginTop: 64,
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'black',
  },
  searchBarContainer: {
    position: 'absolute',
    zIndex: 20,
    alignItems: 'center',
    // width: screenWidth - 64,
    left: 32,
    right: 32,
  },
  functionalSearchBar: {
    width: '90%',
    alignSelf: 'center',
  },
  functionalSearchInput: {
    fontSize: 16,
    color: '#222',
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchIconLeft: {
    marginRight: 8,
  },
  page: { flex: 1},
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
    right: 16,
    top: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,

  },
  suggestButton: {
    position: 'absolute',
    right: 15,
    bottom: '15%',
  },

});
