import React from 'react';
import { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackParamList } from '../../App';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MapView, Camera, MarkerView, CameraRef } from '@maplibre/maplibre-react-native';
import { useFlyTo } from '../map/useFlyTo';
import SearchBar from '../components/SearchBar';
import ToggleModeButton from '../components/ToggleModeButton';
import RatingButton from '../components/RatingButton';
import RatingModal from "../components/bottomSheet/RatingModal";
import NotificationButton from "../components/NotificationButton";
import SuggestionBIcon from '../assets/icons/SuggestionBIcon';
import SuggestBottomSheet from '../components/bottomSheet/SuggestBottomSheet';

import RenderAllBusStops from '../map/RenderBusStop';
import RenderAllBusRoutes from '../map/RenderBusRoute';
import RenderAllLandmarks from '../map/RenderLandmark';
import RenderDetailsBottomSheet from '../map/RenderBottomSheet';

import useUserLocation from '../map/UserLocation';
import CookieManager from '@react-native-cookies/cookies';
import Config from 'react-native-config';

type MapMode = 'bus' | 'landmark';

export default function MapScreen() {
  const { location, hasPermission } = useUserLocation();
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
  const [suggestVisible, setSuggestVisible] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');

  return (
    <View style={styles.page}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search..."
          style={styles.functionalSearchBar}
          inputStyle={styles.functionalSearchInput}
        />
      </View>

      <MapView style={styles.map} mapStyle="https://api.maptiler.com/maps/streets-v2/style.json?key=oQ7ceXLhobx6gMFyLsem"
        onDidFinishLoadingMap={() => {
          if (!initialSet) {
            if (hasPermission && location) {
              cameraRef.current?.setCamera({
                centerCoordinate: [location.longitude, location.latitude],
                zoomLevel: 17,
                animationDuration: 1000,
              });
            } else {
              cameraRef.current?.setCamera({
                centerCoordinate: [100.772451, 13.727075],
                zoomLevel: 18,
                animationDuration: 1000,
              });
            }
            setInitialSet(true);
          }
        }}
      >
        <Camera ref={cameraRef} />

        {location && (
          <MarkerView coordinate={[location.longitude, location.latitude]}>
            <View style={styles.marker} />
          </MarkerView>
        )}

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

      {RenderDetailsBottomSheet(selected)}

      <View style={styles.buttonContainer}>
        <ToggleModeButton mode={mode} setMode={setMode} onToggle={() => setSelected({type: null, id: null})}/>
        <RatingButton onPressButton = {() => { console.log('RatingBIcon pressed'); setModalVisible(true); }} />
        <NotificationButton  onPressButton = {() => navigation.navigate('Notification')} />
      </View>

      <TouchableOpacity onPress={() => {setSuggestVisible(true)}} style={styles.suggestButton}>
        <SuggestionBIcon />
      </TouchableOpacity>

      <RatingModal visible={modalVisible} onClose={() => setModalVisible(false)} />

      <SuggestBottomSheet 
        visible={suggestVisible} 
        setVisible={setSuggestVisible} 
        setSelected={setSelected} 
        flyTo={flyTo}
        setMode={setMode}
      />
    </View>
  );
}

const { width: screenWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  searchBarContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: 'center',
  width: '100%',
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
    top: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },
  suggestButton: {
    position: 'absolute',
    right: 15,
    bottom: '30%',
  },

});
