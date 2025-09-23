import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, TextInput, Dimensions } from 'react-native';
import { MapView, Camera, MarkerView} from '@maplibre/maplibre-react-native';

import FloatingIconButton from '../components/FloatingIconButton';
import XBIcon from '../assets/icons/XBIcon';
import ToggleModeBIcon from '../assets/icons/ToggleModeBIcon';
import RatingBIcon from '../assets/icons/RatingBIcon';
import { Rating } from 'react-native-elements';
import NotificationBIcon from '../assets/icons/NotificationBIcon';
import RouteIcon from '../assets/icons/RouteIcon';
import LandmarkIcon from '../assets/icons/LandmarkIcon';
import { useNavigation } from '@react-navigation/native';
import type { StackParamList } from '../../App';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function MapScreen() {

  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [feedback, setFeedback] = React.useState('');

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
        <FloatingIconButton icon={<RatingBIcon />} onPress={() => { console.log('RatingBIcon pressed'); setModalVisible(true); }} />
        <FloatingIconButton icon={<NotificationBIcon />} onPress={() => navigation.navigate('Notification')} />
      </View>

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
              onPress={() => {
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

const { width: screenWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
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
    backgroundColor: 'transparent',
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
  submitButton: {
    backgroundColor: '#2D6EFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: screenWidth * 0.3,
    backgroundColor: 'transparent',
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
    top: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
