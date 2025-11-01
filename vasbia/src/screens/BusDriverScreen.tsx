import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, TextInput, Dimensions, Platform, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import type { StackParamList } from '../../App';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MapView, Camera, MarkerView, CameraRef } from '@maplibre/maplibre-react-native';
import { useFlyTo } from '../map/useFlyTo';
import Geolocation from '@react-native-community/geolocation';
import SearchBar from '../components/SearchBar';
import RatingButton from '../components/RatingButton';
import RatingModal from '../components/bottomSheet/RatingModal';
import NotificationButton from '../components/NotificationButton';
import RenderAllBusStops from '../map/RenderBusStop';
import RenderAllBusRoutes from '../map/RenderBusRoute';
import RenderAllLandmarks from '../map/RenderLandmark';
import RenderDetailsBottomSheet from '../map/RenderBottomSheet';
import CookieManager from '@react-native-cookies/cookies';
import Config from 'react-native-config';
import AccidentButton from "../components/AccidentButton";
import RenderDriverBus from '../map/RenderDriverBus';
import SettingButton from '../components/SettingButton';

export default function BusDriverScreen() {
    const [initialSet, setInitialSet] = useState(false);
    const [selected, setSelected] = useState<{
      type: 'busStop' | 'busRoute' | 'landmark' | null;
      id: number | null;
    }>({ type: null, id: null });
    const cameraRef = useRef<CameraRef>(null);
    const flyTo = useFlyTo(cameraRef);
  
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [suggestVisible, setSuggestVisible] = React.useState(false);
    const [searchText, setSearchText] = React.useState('');

    const [driverStatus, setDriverStatus] = useState<string | null>("REST");
    const [etaTime, setEtaTime] = useState<number | null>(null);

    const driverStatusCallback = (status: string | null, eta: number | null, rem_sch: any[]) => {
      status ? setDriverStatus(status) : setDriverStatus("REST");
      eta ? setEtaTime(eta) : setEtaTime(null);
      setDriverData(prev => ({
        ...prev,
        busStops: rem_sch,
      }));
    }

  // const busId = 'bus123'; // Example bus ID, replace with actual data as needed

  // ============================ Load Driver Route ===============================
  const [driverData, setDriverData] = useState<{
    route: number | null;
    bus: number | null;
    busStops?: { busStopName: string; arriveTime: string; }[];
  }>({route: null, bus: null});

  useEffect(() => {
    const fetchDriverRoute = async () => {
      try {
        const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
        const token = cookies.token?.value;
        if (!token) {
          console.warn("⚠️ No token found");
          return;
        }

        const response1 = await fetch(`${Config.BASE_API_URL}/api/busdriver/info?token=${token}`);
        if (!response1.ok) throw new Error("Network error: " + response1.status);

        const data1 = await response1.json();
        console.log("✅ Driver bus info:", data1);
        
        // const response2 = await fetch(`${Config.BASE_API_URL}/api/busdriver/schedule/token?token=${token}`);
        // if (!response2.ok) throw new Error("Network error: " + response2.status);

        // const data2 = await response2.json();
        // console.log("✅ Driver route data:", data2);

        // var schedules: any[] = [];
        // data2.forEach((schedule: any) => {
        //     schedules.push({ busStopName: schedule.busStopName, arriveTime: schedule.arriveTime })
        // });

        // Store into state
        setDriverData({
          route: data1.routeId,
          bus: data1.busId,
          // busStops: schedules,
        });
      } catch (error) {
        console.error("❌ Error fetching driver route:", error);
      }
    };

    fetchDriverRoute();
  }, []);
  // ============================ END Load Driver Route ===============================

  return (
    <View style={styles.page}>
      {/* <View style={styles.searchBarContainer}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Searchsss..."
          style={styles.functionalSearchBar}
          inputStyle={styles.functionalSearchInput}
        />
      </View> */}

      <View style={{position: 'absolute', top: 64, right: 16, zIndex: 20}}>
        <SettingButton onPressButton={() => navigation.navigate('Setting')} />
      </View>

      <MapView style={styles.map} mapStyle="https://api.maptiler.com/maps/streets-v2/style.json?key=oQ7ceXLhobx6gMFyLsem"
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

        <RenderAllBusRoutes selected={selected} setSelected={setSelected} />
        <RenderAllBusStops selected={selected} setSelected={setSelected} flyTo={flyTo}/>

        <RenderDriverBus selectedRouteId={driverData.route} DriverBus={driverData.bus} onBusUpdate={driverStatusCallback}/>

      </MapView>

      <View style={styles.buttonContainer}>
        <RatingButton onPressButton = {() => { console.log('RatingBIcon pressed'); setModalVisible(true); }} />
        <NotificationButton  onPressButton = {() => navigation.navigate('Notification')} />
        <AccidentButton
          onPress={async () => {
            const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
            const token = cookies.token?.value;
            console.log("🚍 Retrieved token for accident report:", token);
            // console.log("🚍 Accident report sent for Bus ID:", busId);

            // 🛰️ Send to API
            fetch(`${Config.BASE_API_URL}/api/busdriver/emergency?token=${token}`, {
              method: 'POST',
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Network error: ${response.status}`);
                }
                return response;
              })
              .then((data) => {
                console.log("✅ Accident report submitted:", data);
                // alert("อุบัติเหตุถูกส่งเรียบร้อยแล้ว! 🚨");
              })
              .catch((error) => {
                console.error("❌ Error submitting accident:", error);
                // alert("ไม่สามารถส่งรายงานอุบัติเหตุได้ โปรดลองอีกครั้ง 😢");
              });
          }}
        />

      </View>

      {/* 📊 Bottom Box (Monitor Table) */}
      <View style={styles.bottomBox}>
        <Text style={styles.tableTitle}>🚌 Monitor</Text>

        <Text style={styles.driverStatus}>{driverStatus}</Text>
        <Text style={{ textAlign: "center", marginBottom: 8, color: "#444" }}>
          {etaTime ? "by est. " + etaTime + " s" : ""}
        </Text>

        <ScrollView 
          style={styles.scrollArea}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.headerCell]}>Bus Stop</Text>
            <Text style={[styles.cell, styles.headerCell]}>ScheduleTime</Text>
          </View>

          {driverData.busStops ? (
            driverData.busStops.map((stop, index) => (
              <View key={index} style={[styles.tableRow, index === 0 && styles.firstRowHighlight]}>
                <Text style={[styles.cell, index === 0 ? styles.firstRowCell : styles.normalCell]}>{stop.busStopName}</Text>
                <Text style={[styles.cell, index === 0 ? styles.firstRowCell : styles.normalCell]}>{stop.arriveTime}</Text>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", padding: 10, color: "#888" }}>No active schedule</Text>
          )}
        </View>
        </ScrollView>
      </View>
      
      <RatingModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      
    </View>
  );
}
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
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
    bottom: '30%',
  },

  bottomBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight / 3,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 50,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  tableTitle: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 12, color: 'black' },
  tableContainer: {
    width: "100%",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: { flexDirection: "row", backgroundColor: "#f0f0f0", color: 'black' },
  tableRow: { flexDirection: "row", backgroundColor: "#fff", color: 'black' },
  cell: { flex: 1, paddingVertical: 8, textAlign: "center", borderWidth: 1, borderColor: "#ccc", fontSize: 16 },
  headerCell: { fontWeight: "700" },
  highlightCell: { backgroundColor: "#D6E4FF", borderColor: "#2D6EFF" },
  scrollArea: {
    flexGrow: 0,
    maxHeight: '75%', // 👈 ตารางจะสูงได้ไม่เกิน 75% ของกล่อง
    width: '100%',
  },
  driverStatus: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#333",
  textAlign: "center",
  marginBottom: 10,
  },
  firstRowHighlight: {
    backgroundColor: '#FFF6D0',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#FFD700',
  },
  firstRowCell: {
    backgroundColor: '#FFEAB6',
    fontWeight: 'bold',
    color: '#000',
  },

  normalCell: {
    backgroundColor: '#fff',
    color: 'black',
  },
});
