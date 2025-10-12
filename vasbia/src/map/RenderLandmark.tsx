import { MarkerView } from "@maplibre/maplibre-react-native";
import LandmarkButton from "../components/LandmarkButton";
import Config from "react-native-config";

type Landmark= {
  landmarkId: string;
  landmarkName: string;
  coordinate: [number, number];
};

type SelectedItem = {
  type: "busStop" | "busRoute" | "landmark" | null;
  id: string | null;
};

type RenderProps = {
  selected: SelectedItem;
  setSelected: (item: SelectedItem) => void;
  flyTo: (coordinate: [number, number], duration?: number, zoom?: number) => void;
};

//const loadedLandmark: Landmark[] = [
//  {
//    landmarkId: "landmark1",
//    landmarkName: "อาคาร 12 ชั้น",
//    coordinate: [100.772388, 13.727487]
//  },
//  {
//    landmarkId: "landmark2",
//    landmarkName: "ภาควิชาวิศวกรรมเกษตร",
//    coordinate: [100.77255, 13.726472]
//  }
//];

var loadedLandmark: Landmark[] = [];

// ============================ Load landmarks from API ===============================
fetch(`${Config.BASE_API_URL}/api/place/route/1`)
.then((response) => response.json())
.then((data) => {
  console.log("Fetched landmarks:", data);
  data.forEach((landmark:any) => {
    // console.log("Processing landmark:", landmark.place_id);
    loadedLandmark.push({
      landmarkId: landmark.place_id,
      landmarkName: landmark.name,
      coordinate: [landmark.longitude, landmark.latitude],
    });
  })
  // console.log("Loaded bus landmarks:", loadedLandmark);
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