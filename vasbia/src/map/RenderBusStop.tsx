import { MarkerView } from "@maplibre/maplibre-react-native";
import BusStopButton from "../components/BusStopButton";
import BottomSheetWithHeader from "../components/bottomSheet/BottomSheetWithHeader";
import { Text } from "react-native-svg";

type BusStop= {
  stopId: string;
  stopName: string;
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

const loadedBusStops: BusStop[] = [
  {
    stopId: "stop1",
    stopName: "โรงอาหาร C",
    coordinate: [100.772123, 13.727050]
  },
  {
    stopId: "stop2",
    stopName: "CCA",
    coordinate: [100.772751, 13.726169]
  }
];

export default function RenderAllBusStops({ selected, setSelected, flyTo }: RenderProps) {  
  return (
    <>
        {loadedBusStops.map((stop) => (
          <MarkerView 
            key={stop.stopId} 
            coordinate={stop.coordinate} 
            anchor={{ x: 0.5, y: 1 }} //bottom-center hits the coordinate
          >
            <BusStopButton 
              selected={selected.id === stop.stopId && selected.type === "busStop"} 
              onPress={() => {
                if (selected.id === stop.stopId && selected.type === "busStop") {
                  setSelected({ type: null, id: null });
                } else {
                  setSelected({type: "busStop", id: stop.stopId});
                }
                flyTo(stop.coordinate);
              }} 
            />
          </MarkerView>
        ))}
    </>
  );
}