import React from 'react';
import { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackParamList } from '../../App';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MapView, Camera, MarkerView, CameraRef } from '@maplibre/maplibre-react-native';
import { useFlyTo } from '../map/useFlyTo';
import useUserLocation from '../map/UserLocation';
import { useFocusEffect } from '@react-navigation/native';
// import Geolocation from '@react-native-community/geolocation';
import SearchBar from '../components/SearchBarMainPage';
import ToggleModeButton from '../components/ToggleModeButton';
import SettingButton from '../components/SettingButton';
import NotificationButton from '../components/NotificationButton';
import SuggestionBIcon from '../assets/icons/SuggestionBIcon';
import SuggestBottomSheet from '../components/bottomSheet/SuggestBottomSheet';
import RenderAllBusStops from '../map/RenderBusStop';
import RenderAllBusRoutes from '../map/RenderBusRoute';
import RenderAllLandmarks from '../map/RenderLandmark';
import RenderDetailsBottomSheet from '../map/RenderBottomSheet';
import CookieManager from '@react-native-cookies/cookies';
import Config from 'react-native-config';
import UserIcon from '../assets/icons/UserIcon';

type MapMode = 'bus' | 'landmark';

export default function MapScreen() {
  const { location, hasPermission } = useUserLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [initialSet, setInitialSet] = useState(false);
  const [mode, setMode] = useState<MapMode>('bus');
  const [selected, setSelected] = useState<{
    type: 'busStop' | 'busRoute' | 'landmark' | null;
    id: number | null;
  }>({ type: null, id: null });
  const cameraRef = useRef<CameraRef>(null);
  const flyTo = useFlyTo(cameraRef);
  useFocusEffect(
  React.useCallback(() => {
    const fetchUnreadCount = async () => {
      const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
      const token = cookies.token?.value;
      if (!token) {
        console.warn('No token found in cookies');
        setUnreadCount(0);
        return;
      }
      const response = await fetch(`${Config.BASE_API_URL}/api/notification/countNotification?token=${token}`, {
        method: 'GET',
      });
      if (!response.ok) {
        console.warn('Failed to fetch unread count');
        setUnreadCount(0);
        return;
      }
      const count = await response.json();
      setUnreadCount(count || 0);
      console.log('===== Unread count: ======', count);
    };
    fetchUnreadCount();
  }, [])
);

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  // const [modalVisible, setModalVisible] = React.useState(false);
  const [suggestVisible, setSuggestVisible] = React.useState(false);

  return (
    <View style={styles.page}>
      <View style={styles.searchBarContainer}>
        <Text style={styles.appTitle}>VASBIA</Text>
        <SearchBar onPressButton={() => navigation.navigate('Search')}/>
      </View>

      <View style={{position: 'absolute', top: 64, right: 16, zIndex: 20}}>
        <SettingButton onPressButton={() => navigation.navigate('Setting')} />
      </View>

      <MapView style={styles.map} mapStyle="https://api.maptiler.com/maps/streets-v2/style.json?key=oQ7ceXLhobx6gMFyLsem"
        onDidFinishLoadingMap={() => {
          if (!initialSet) {
            if (location) {
              cameraRef.current?.setCamera({
                centerCoordinate: [location.longitude, location.latitude],
                zoomLevel: 17,
                animationDuration: 1000,
              });
            } else {
              cameraRef.current?.setCamera({
                centerCoordinate: [100.7743534, 13.7270673],
                zoomLevel: 17,
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
            <UserIcon />
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
        <NotificationButton onPressButton = {() => navigation.navigate('Notification')} badgeCount={unreadCount}/>
      </View>

      <TouchableOpacity onPress={() => {setSuggestVisible(true)}} style={styles.suggestButton}>
        <SuggestionBIcon />
      </TouchableOpacity>


      <SuggestBottomSheet 
        visible={suggestVisible} 
        setVisible={setSuggestVisible} 
        setSelected={setSelected} 
        flyTo={flyTo}
        setMode={setMode}
        location={location}
      />
    </View>
  );
}

// const { width: screenWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  appTitle:{
    marginTop: 64,
    fontSize: 40,
    fontFamily: 'Inter_24pt-SemiBold',
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
    bottom: '30%',
  },

});
