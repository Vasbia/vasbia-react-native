import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  Animated,
} from 'react-native';
import ChevronUp from '../../assets/icons/ChevronUp';
import BottomSheet from './BottomSheet';
// import { Slider } from "react-native-elements";

type LandmarkDetails = {
  id: string;
  landmarkName: string;
  coordinate: [number, number];
  subDetails: string;
  description?: string;
  imageUrl?: string;
};

type SelectedItem = {
  type: 'busStop' | 'busRoute' | 'landmark' | null;
  id: string | null;
};

type SuggestBottomSheetProps = {
  visible: boolean;
  setVisible: (item: boolean) => void;
  setSelected: (item: SelectedItem) => void;
  flyTo: (coordinate: [number, number], duration?: number, zoom?: number) => void;
  setMode: (item: 'bus' | 'landmark') => void;
};

const landmarkSuggestion: LandmarkDetails[] = [
  {
    id: 'landmark1',
    landmarkName: 'Faculty of Engineering, KMITL',
    coordinate: [100.772388, 13.727487],
    subDetails: 'Chalong Krung 1 Alley, Lat Krabang, Bangkok 10520',
    description: 'อาคารเรียนสูง 1 ชั้น เป็นจุดสำคัญของคณะวิศวกรรมศาสตร์',
    imageUrl:
      'https://admin.curriculum.kmitl.ac.th/api/media/file/1440753623-72-o.jpg',
  },
  {
    id: 'landmark2',
    landmarkName: 'Faculty of TWO, KMITL',
    coordinate: [100.77255, 13.726472],
    subDetails: 'Chalong Krung 1 Alley, Lat Krabang, Bangkok 10520',
    description: 'อาคารเรียนสูง 2 ชั้น เป็นจุดสำคัญของคณะวิศวกรรมศาสตร์',
    imageUrl:
      'https://admin.curriculum.kmitl.ac.th/api/media/file/1440753623-72-o.jpg',
  },
  {
    id: 'landmark1',
    landmarkName: 'Faculty of THREE, KMITL',
    coordinate: [100.772388, 13.727487],
    subDetails: 'Chalong Krung 1 Alley, Lat Krabang, Bangkok 10520',
    description: 'อาคารเรียนสูง 3 ชั้น เป็นจุดสำคัญของคณะวิศวกรรมศาสตร์',
    imageUrl:
      'https://admin.curriculum.kmitl.ac.th/api/media/file/1440753623-72-o.jpg',
  },
];

export default function SuggestBottomSheet({ visible, setVisible, setSelected, flyTo, setMode}: SuggestBottomSheetProps) {
  const [current, setCurrent] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const changeSlide = (direction: 'next' | 'prev') => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    setCurrent((prev) =>
      direction === 'next'
        ? (prev + 1) % landmarkSuggestion.length
        : (prev - 1 + landmarkSuggestion.length) % landmarkSuggestion.length
    );
  };

  const currentLandmark = landmarkSuggestion[current];

  return (
    <BottomSheet visible={visible} onClose={() => {setVisible(false);}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>{currentLandmark.landmarkName}</Text>
        <Text style={styles.subDetails}>{currentLandmark.subDetails}</Text>

        <View style={styles.slide}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <Image source={{ uri: currentLandmark.imageUrl }} style={styles.image} />
            </Animated.View>

            <View style={styles.slideControls}>
              <TouchableOpacity onPress={() => changeSlide('prev')} style={styles.arrowButton}>
                <View style={{ transform: [{ rotate: '-90deg' }] }}>
                  <ChevronUp />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => changeSlide('next')} style={styles.arrowButton}>
                <View style={{ transform: [{ rotate: '90deg' }] }}>
                  <ChevronUp />
                </View>
              </TouchableOpacity>
            </View>
        </View>

        <TouchableOpacity onPress = { () => {
            setMode('landmark');
            setVisible(false);
            setSelected({type: 'landmark', id: currentLandmark.id});
            flyTo(currentLandmark.coordinate);
        }}>
            <Text style={styles.guide}>แสดงในแผนที่</Text>
        </TouchableOpacity>

        <Text style={styles.description}>{currentLandmark.description}</Text>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subDetails: {
    color: '#fff',
    fontWeight: 'medium',
    paddingBottom: 12,
  },
  slide: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginVertical: 15,
  },
  slideControls: {
    position: 'absolute',
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '100%',
    top: '35%',
  },
  arrowButton: {
    paddingVertical: 16,
  },
  guide: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 12,
    alignSelf: 'center',
    color: '#fff',
  },
  description: {
    fontWeight: 'medium',
    color: '#fff',
  },
});