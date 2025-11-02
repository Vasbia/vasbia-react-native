import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  ScrollView,
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Text, 
  TextInput, 
  Dimensions, 
  Platform, 
} from "react-native";
import { MapView, Camera, MarkerView, CameraRef } from "@maplibre/maplibre-react-native";
import { useFlyTo } from "../map/useFlyTo";
import XBIcon from "../assets/icons/XBIcon";
import RatingButton from "../components/RatingButton";
import { Rating } from "react-native-elements";
import NotificationButton from "../components/NotificationButton";
import { useNavigation } from "@react-navigation/native";
import type { StackParamList } from "../../App";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SearchBar from "../components/SearchBar";
import RenderAllBusStops from "../map/RenderBusStop";
import RenderAllBusRoutes from "../map/RenderBusRoute";
import RenderAllLandmarks from "../map/RenderLandmark";
import CookieManager from "@react-native-cookies/cookies";
import Config from "react-native-config";
import AccidentButton from "../components/AccidentButton";

type MapMode = "bus" | "landmark";

export default function BusDriverScreen() {
  const [initialSet, setInitialSet] = useState(false);
  const [mode, setMode] = useState<MapMode>("bus");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cameraRef = useRef<CameraRef>(null);
  const flyTo = useFlyTo(cameraRef);
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [searchText, setSearchText] = useState("");

  // ============================ Load Driver Route ===============================
const [driverData, setDriverData] = useState<{
  busStops?: { name: string; round1: string; round2: string; round3: string }[];
}>({});
const [driverStatus, setDriverStatus] = useState<string>("ไม่ Active"); // ✅ new state

useEffect(() => {
  const fetchDriverRoute = async () => {
    try {
      const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
      const token = cookies.token?.value;
      if (!token) {
        console.warn("⚠️ No token found");
        throw new Error("Missing token");
      }

      const response = await fetch(
        `${Config.BASE_API_URL}/api/busdriver/getRouteByUserId?token=${token}`
      );
      if (!response.ok) throw new Error("Network error: " + response.status);

      const data = await response.json();
      console.log("✅ Driver route data:", data);

      let statusText = "ไม่ Active";
      switch (data.state) {
        case "slow":
          statusText = "ขับช้า 🐢";
          break;
        case "fast":
          statusText = "ขับเร็ว 🚀";
          break;
        case "normal":
          statusText = "ขับพอดี ✅";
          break;
        default:
          statusText = "ไม่ Active ⛔";
      }

      setDriverStatus(statusText);
      setDriverData({ busStops: data.busStops });

    } catch (error) {
      console.error("❌ Error fetching driver route:", error);

      // ✅ mock-up data (ถ้าโหลดไม่ได้)
      const mockBusStops = Array.from({ length: 10 }, (_, i) => ({
        name: `สถานีจำลองที่ ${i + 1}`,
        round1: `07:${(30 + i).toString().padStart(2, "0")}:00`,
        round2: `08:${(15 + i).toString().padStart(2, "0")}:00`,
        round3: `09:${(45 + i).toString().padStart(2, "0")}:00`,
      }));

      setDriverData({ busStops: mockBusStops });
      setDriverStatus("ไม่ Active ⛔"); // ✅ fallback status

      console.log("🧩 Using mock-up driver data (10 items)");
    }
  };

  fetchDriverRoute();
}, []);
// ============================ END Load Driver Route ===============================


  return (
    <View style={styles.page}>
      {/* 🔍 Search bar */}
      <View style={styles.searchBarContainer}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search..."
          style={styles.functionalSearchBar}
          inputStyle={styles.functionalSearchInput}
        />
      </View>

      {/* 🗺️ Map */}
      <MapView
        style={styles.map}
        mapStyle="https://maptiler.code4.dad/api/maps/bangkok/style.json"
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
            <RenderAllBusStops selectedId={selectedId} setSelectedId={setSelectedId} flyTo={flyTo} />
          </>
        )}

        {mode === "landmark" && (
          <RenderAllLandmarks selectedId={selectedId} setSelectedId={setSelectedId} flyTo={flyTo} />
        )}
      </MapView>

      {/* 🔘 Buttons */}
      <View style={styles.buttonContainer}>
        <RatingButton onPressButton={() => setModalVisible(true)} />
        <NotificationButton onPressButton={() => navigation.navigate("Notification")} />
        <AccidentButton
          onPress={async () => {
            const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
            const token = cookies.token?.value;
            console.log("🚍 Retrieved token for accident report:", token);

            fetch(`${Config.BASE_API_URL}/api/busdriver/emergency?token=${token}`, { method: "POST" })
              .then((response) => {
                if (!response.ok) throw new Error(`Network error: ${response.status}`);
                return response.json();
              })
              .then((data) => console.log("✅ Accident report submitted:", data))
              .catch((error) => console.error("❌ Error submitting accident:", error));
          }}
        />
      </View>

      {/* 📊 Bottom Box (Monitor Table) */}
      <View style={styles.bottomBox}>
        <Text style={styles.tableTitle}>🚌 Monitor</Text>
        <Text style={styles.driverStatus}>{driverStatus}</Text>

        <ScrollView 
          style={styles.scrollArea}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View style={styles.tableContainer}>
            {/* หัวตาราง */}
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, styles.headerCell]}>Bus Stop</Text>
              <Text style={[styles.cell, styles.headerCell]}>เวลาตามตาราง</Text>
            </View>

            {/* แถวข้อมูล */}
            {driverData.busStops ? (
              driverData.busStops.map((stop, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.cell]}>{stop.name}</Text>
                  <Text style={styles.cell}>{stop.round1}</Text>
                </View>
              ))
            ) : (
              <Text style={{ textAlign: "center", padding: 10, color: "#888" }}>Loading...</Text>
            )}
          </View>
        </ScrollView>
      </View>


      {/* ⭐ Rating Modal */}
      <Modal visible={modalVisible} transparent animationType="none" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.sheetOverlay}>
          <View style={styles.sheetContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <XBIcon />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>How do you rate our application?</Text>
            <Rating
              imageSize={36}
              startingValue={rating}
              onFinishRating={setRating}
              style={styles.rating}
              tintColor="#353638"
              ratingColor="#ccd"
              ratingBackgroundColor="#fff"
              type="custom"
            />
            <Text style={styles.feedbackLabel}>Tell us more (optional)</Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Please comment here..."
              placeholderTextColor="#fff"
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={8}
            />
            <TouchableOpacity
              style={styles.submitButtonBlack}
              onPress={async () => {
                const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
                fetch(
                  `${Config.BASE_API_URL}/api/feedback-application?rating=${rating}&comment=${feedback}&token=${cookies.token?.value}`,
                  { method: "POST" }
                )
                  .then((response) => response.json())
                  .then((data) => console.log("✅ Feedback submitted:", data))
                  .catch((error) => console.error("❌ Error submitting feedback:", error));

                setModalVisible(false);
                setFeedback("");
                setRating(0);
              }}
            >
              <Text style={styles.submitButtonTextWhite}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 🎨 Styles
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  page: { flex: 1 },
  map: { flex: 1 },
  marker: { width: 20, height: 20, borderRadius: 10, backgroundColor: "blue", borderColor: "white", borderWidth: 2 },

  searchBarContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: "center",
    width: "100%",
  },
  functionalSearchBar: { width: "90%", alignSelf: "center" },
  functionalSearchInput: { fontSize: 16, color: "#222" },

  buttonContainer: {
    position: "absolute",
    right: 15,
    top: "35%",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },

  bottomBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight / 2.5,
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

  tableTitle: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 12 },
  tableContainer: {
    width: "100%",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: { flexDirection: "row", backgroundColor: "#f0f0f0" },
  tableRow: { flexDirection: "row", backgroundColor: "#fff" },
  cell: { flex: 1, paddingVertical: 8, textAlign: "center", borderWidth: 1, borderColor: "#ccc", fontSize: 16 },
  headerCell: { fontWeight: "700" },
  highlightCell: { backgroundColor: "#D6E4FF", borderColor: "#2D6EFF" },

  scrollArea: {
  flexGrow: 0,
  maxHeight: '75%',
  width: '100%',
  },

  driverStatus: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#333",
  textAlign: "center",
  marginBottom: 10,
},



  sheetOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" },
  sheetContent: { backgroundColor: "#353638", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, alignItems: "center", width: "100%" },
  feedbackLabel: { alignSelf: "flex-start", color: "#fff", fontSize: 18, fontWeight: "bold" },
  feedbackInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#fff",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: "top",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  submitButtonBlack: { backgroundColor: "#000", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24, marginTop: 8, alignItems: "center", width: "100%" },
  submitButtonTextWhite: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  closeButton: { position: "absolute", top: 20, right: 16, zIndex: 10 },
  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 16, color: "#fff", maxWidth: screenWidth * 0.7, alignSelf: "center", textAlign: "center" },
  rating: { marginBottom: 16, color: "#fff" },
});
