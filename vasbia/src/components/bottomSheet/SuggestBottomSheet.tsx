import React, { useEffect, useState } from "react";
import {View, Image, TouchableOpacity, StyleSheet, Text, ScrollView, Animated,} from "react-native";
import ChevronUp from "../../assets/icons/ChevronUp";
import BottomSheet from "./BottomSheet";
import Config from "react-native-config";

type LandmarkDetails = {
  id: number;
  landmarkName: string;
  coordinate: [number, number];
  subDetails?: string;
  description?: string;
  imageUrl?: string;
};

type SelectedItem = {
  type: "busStop" | "busRoute" | "landmark" | null;
  id: number | null;
};

type SuggestBottomSheetProps = {
  visible: boolean;
  setVisible: (item: boolean) => void;
  setSelected: (item: SelectedItem) => void;
  flyTo: (coordinate: [number, number], duration?: number, zoom?: number) => void;
  setMode: (item: 'bus' | 'landmark') => void;
  location: { latitude: number; longitude: number } | null;
};

async function fetchSuggestLandmark(userLongitude: number, userLatitude: number) {
  try {
    const response = await fetch(`${Config.BASE_API_URL}/api/place/findNearByPlace`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userLatitude: userLatitude,
        userLongitude: userLongitude,
        routeId: 1, // route ID?
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((landmark: any) => ({
      id: landmark.place_id,
      landmarkName: landmark.name,
      imageUrl: landmark.image,
      coordinate: [landmark.longitude, landmark.latitude]
    }));
  } catch (error) {
    console.error("Error fetching suggest landmarks:", error);
    return [];
  }
};

export default function SuggestBottomSheet({ visible, setVisible, setSelected, flyTo, setMode, location}: SuggestBottomSheetProps) {
  const [suggestLandmark, setSuggestLandmark] = useState<LandmarkDetails[]>([]);
  const [current, setCurrent] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (visible && location) {
      fetchSuggestLandmark(location.longitude, location.latitude)
        .then((data:any) => setSuggestLandmark(data));
      console.log(suggestLandmark);
    }
  }, [visible]);  

  const changeSlide = (direction: "next" | "prev") => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    setCurrent((prev) =>
      direction === "next"
        ? (prev + 1) % suggestLandmark.length
        : (prev - 1 + suggestLandmark.length) % suggestLandmark.length
    );
  };

  const currentLandmark = suggestLandmark[current];
  
  if (!currentLandmark) {
    return (
      <BottomSheet visible={visible} onClose={() => setVisible(false)}>
        <View style={{ alignItems: "center", padding: 20 }}>
          <Text style={{ color: "#000" }}>กำลังโหลดสถานที่แนะนำ...</Text>
        </View>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet visible={visible} onClose={() => {setVisible(false)}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>{currentLandmark.landmarkName}</Text>
        <Text style={styles.subDetails}>{currentLandmark.subDetails}</Text>

        <View style={styles.slide}>
          {currentLandmark.imageUrl &&
            <Animated.View style={{ opacity: fadeAnim }}>
              <Image source={{ uri: `data:image/png;base64,${currentLandmark.imageUrl}` }} style={styles.image} />
            </Animated.View>
          }

            <View style={styles.slideControls}>
              <TouchableOpacity onPress={() => changeSlide("prev")} style={styles.arrowButton}>
                <View style={{ transform: [{ rotate: "-90deg" }] }}>
                  <ChevronUp />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => changeSlide("next")} style={styles.arrowButton}>
                <View style={{ transform: [{ rotate: "90deg" }] }}>
                  <ChevronUp />
                </View>
              </TouchableOpacity>
            </View>
        </View>

        <TouchableOpacity onPress = { () => {
            setMode("landmark");
            setVisible(false);
            setSelected({type: "landmark", id: currentLandmark.id});
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
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  subDetails: {
    color: "#000",
    fontWeight: "medium",
    paddingBottom: 12,
  },
  slide: {
    width: "100%",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginVertical: 15,
  },
  slideControls: {
    position: "absolute",
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    width: "100%",
    top: "35%",
  },
  arrowButton: {
    paddingVertical: 16,
  },
  guide: {
    fontWeight: "bold", 
    fontSize: 16, 
    paddingBottom: 12, 
    alignSelf: "center", 
    color: "#000"
  },
  description: {
    fontWeight: "medium",
    color: "#000"
  },
});
