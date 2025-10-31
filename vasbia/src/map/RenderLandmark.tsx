import { MarkerView } from "@maplibre/maplibre-react-native";
import LandmarkButton from "../components/LandmarkButton";
import Config from "react-native-config";

type Landmark= {
  landmarkId: number;
  landmarkName: string;
  coordinate: [number, number];
};

type SelectedItem = {
  type: "busStop" | "busRoute" | "landmark" | null;
  id: number | null;
};

type RenderProps = {
  selected: SelectedItem;
  setSelected: (item: SelectedItem) => void;
  flyTo: (coordinate: [number, number], duration?: number, zoom?: number) => void;
};

var loadedLandmark: Landmark[] = [];

// ============================ Load landmarks from API ===============================
fetch(`${Config.BASE_API_URL}/api/place/route/1`) // id 1
.then((response) => response.json())
.then((data) => {
  //console.log("Fetched landmarks:", data);
  data.forEach((landmark:any) => {
    // console.log("Processing landmark:", landmark.place_id);
    loadedLandmark.push({
      landmarkId: landmark.place_id,
      landmarkName: landmark.name,
      coordinate: [landmark.longitude, landmark.latitude],
    });
  })
  // console.log("Loaded landmarks:", loadedLandmark);
})
.catch((error) => {
  console.error("Error fetching landmarks:", error);
});

fetch(`${Config.BASE_API_URL}/api/place/route/2`) // id 2
.then((response) => response.json())
.then((data) => {
  //console.log("Fetched landmarks:", data);
  data.forEach((landmark:any) => {
    // console.log("Processing landmark:", landmark.place_id);
    loadedLandmark.push({
      landmarkId: landmark.place_id,
      landmarkName: landmark.name,
      coordinate: [landmark.longitude, landmark.latitude],
    });
  })
  //console.log("Loaded landmarks:", loadedLandmark);
})
.catch((error) => {
  console.error("Error fetching landmarks:", error);
});
// ============================ Load landmarks from API ===============================

export default function RenderAllLandmarks({ selected, setSelected, flyTo }: RenderProps) {  

  return (
    <>
        {loadedLandmark.map((landmark) => (
          <MarkerView 
            key={landmark.landmarkId} 
            coordinate={landmark.coordinate} 
            anchor={{ x: 0.5, y: 1 }} //bottom-center hits the coordinate
            >
            <LandmarkButton landmark={landmark} selected={selected} setSelected={setSelected} flyTo={flyTo} />
          </MarkerView>
        ))}
    </>
  );
}