import { MarkerView } from "@maplibre/maplibre-react-native";
import BusStopButton from "../components/BusStopButton";
import Config from "react-native-config";

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

var loadedBusStops: BusStop[] = [
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

// ============================ Load bus stops from API ===============================
fetch(`${Config.BASE_API_URL}/api/busstop/route/1`) // fixed id 1 for now
.then((response) => {
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.status);
  }
  return response.json();
})
.then((data) => {
  // console.log('Data received:', data);
  loadedBusStops = [];
  data.forEach((stopData: any) => {
    loadedBusStops.push({
      stopId: stopData.name,
      stopName: stopData.name,
      coordinate: [stopData.longitude, stopData.latitude]
    });
  })
})
.catch((error) => {
  console.error('Error fetching data:', error);
});
// ============================ Load bus stops from API ===============================

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