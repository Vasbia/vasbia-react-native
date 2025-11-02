import React from 'react';
import { useState, useRef } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Text, TextInput, Dimensions, Platform } from 'react-native';
import { MapView, Camera, MarkerView, CameraRef } from '@maplibre/maplibre-react-native';
import { useFlyTo } from "../map/useFlyTo";
import XBIcon from '../assets/icons/XBIcon';
import RatingButton from "../components/RatingButton";
import { Rating } from 'react-native-elements';
import NotificationButton from "../components/NotificationButton";
import { useNavigation } from '@react-navigation/native';
import type { StackParamList } from '../../App';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SearchBar from '../components/SearchBar';
import RenderAllBusStops from "../map/RenderBusStop";
import RenderAllBusRoutes from "../map/RenderBusRoute";
import RenderAllLandmarks from "../map/RenderLandmark";
import CookieManager from '@react-native-cookies/cookies';
import Config from 'react-native-config';
import AccidentButton from "../components/AccidentButton";


type MapMode = "bus" | "landmark";

export default function MapScreen() {
  const [initialSet, setInitialSet] = useState(false);
  const [mode, setMode] = useState<MapMode>("bus");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const cameraRef = useRef<CameraRef>(null);
  const flyTo = useFlyTo(cameraRef);

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [feedback, setFeedback] = React.useState('');
  const [searchText, setSearchText] = React.useState('');

  return (
    <View style={styles.page}>
      {/* 🔍 Search Bar */}
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

      {/* ⚙️ ปุ่มต่างๆ */}
      <View style={styles.buttonContainer}>
        <RatingButton onPressButton={() => setModalVisible(true)} />
        <NotificationButton onPressButton={() => navigation.navigate('Notification')} />
        <AccidentButton
          onPress={async () => {
            const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
            const token = cookies.token?.value;
            console.log("🚍 Retrieved token for accident report:", token);

            fetch(`${Config.BASE_API_URL}/api/busdriver/emergency?token=${token}`, {
              method: 'POST',
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Network error: ${response.status}`);
                }
                return response.json();
              })
              .then((data) => {
                console.log("✅ Accident report submitted:", data);
              })
              .catch((error) => {
                console.error("❌ Error submitting accident:", error);
              });
          }}
        />
      </View>

      <View style={styles.bottomBox}>
        <Text style={styles.tableTitle}>🚌 Monitor</Text>

        {/* ตาราง */}
        <View style={styles.tableContainer}>
          {/* หัวตาราง */}
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.headerCell]}>Bus Stop</Text>
            <Text style={[styles.cell, styles.headerCell]}>รอบที่ 1</Text>
            <Text style={[styles.cell, styles.headerCell]}>รอบที่ 2</Text>
            <Text style={[styles.cell, styles.headerCell]}>รอบที่ 3</Text>
          </View>

          {/* แถวข้อมูล */}
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.highlightCell]}>07:00</Text>
            <Text style={styles.cell}>07:00</Text>
            <Text style={styles.cell}>07:00</Text>
            <Text style={styles.cell}>07:00</Text>
          </View>
        </View>
      </View>

      {/* ⭐ Rating Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.sheetOverlay}>
          <View style={styles.sheetContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <XBIcon/>
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
                fetch(`${Config.BASE_API_URL}/api/feedback-application?rating=${rating}&comment=${feedback}&token=${cookies.token?.value}`, { method: 'POST' })
                  .then((response) => {
                    if (!response.ok) throw new Error('Network response was not ok ' + response.status);
                    return response.json();
                  })
                  .then((data) => console.log('Feedback submitted successfully:', data))
                  .catch((error) => console.error('Error submitting feedback:', error));

                setModalVisible(false);
                setFeedback('');
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  buttonContainer: {
    position: 'absolute',
    right: 15,
    top: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },
  bottomBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight / 3, // ✅ 1 ใน 3 ของจอ
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 50,          // แสดงบนสุด
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  cell: {
    flex: 1,
    paddingVertical: 8,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  headerCell: {
    fontWeight: '700',
  },
  highlightCell: {
    backgroundColor: '#D6E4FF',
    borderColor: '#2D6EFF',
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheetContent: {
    backgroundColor: '#353638',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  feedbackInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  submitButtonBlack: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 8,
    alignItems: 'center',
    width: '100%',
  },
  feedbackLabel: {
    alignSelf: 'flex-start',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButtonTextWhite: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 16,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
    maxWidth: screenWidth * 0.7,
    alignSelf: 'center',
    textAlign: 'center',
  },
  rating: {
    marginBottom: 16,
    color: '#fff',
  },
});
