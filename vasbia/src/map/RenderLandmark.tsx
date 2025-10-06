import { MarkerView } from "@maplibre/maplibre-react-native";
import LandmarkButton from "../components/LandmarkButton";

type Landmark= {
  landmarkId: string;
  landmarkName: string;
  coordinate: [number, number];
};

type RenderProps = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  flyTo: (coordinate: [number, number], duration?: number, zoom?: number) => void;
};

const loadedLandmark: Landmark[] = [
  {
    landmarkId: "landmark1",
    landmarkName: "อาคาร 12 ชั้น",
    coordinate: [100.772388, 13.727487]
  },
  {
    landmarkId: "landmark2",
    landmarkName: "ภาควิชาวิศวกรรมเกษตร",
    coordinate: [100.77255, 13.726472]
  }
];

export default function RenderAllLandmarks({ selectedId, setSelectedId, flyTo }: RenderProps) {  

  return (
    <>
        {loadedLandmark.map((landmark) => (
          <MarkerView 
            key={landmark.landmarkId} 
            coordinate={landmark.coordinate} 
            anchor={{ x: 0.5, y: 1 }} //bottom-center hits the coordinate
            >
            <LandmarkButton 
              selected={selectedId === landmark.landmarkId} 
              onPress={() => {
                setSelectedId(selectedId === landmark.landmarkId ? null : landmark.landmarkId);
                flyTo(landmark.coordinate);
              }} 
            />
          </MarkerView>
        ))}
    </>
  );
}