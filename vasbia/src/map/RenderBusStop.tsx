import { MarkerView } from "@maplibre/maplibre-react-native";
import BusStopButton from "../components/BusStopButton";
import Config from "react-native-config";

type BusStop= {
  stopId: number;
  stopName: string;
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

//var loadedBusStops: BusStop[] = [
//  {
//    stopId: "stop1",
//    stopName: "โรงอาหาร C",
//    coordinate: [100.772123, 13.727050]
//  },
//  {
//    stopId: "stop2",
//    stopName: "CCA",
//    coordinate: [100.772751, 13.726169]
//  }
//];

var loadedBusStops: BusStop[] = [];

// ============================ Load bus stops from API ===============================
fetch(`${Config.BASE_API_URL}/api/busstop/route/1`) // id 1
.then((response) => {
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.status);
  }
  return response.json();
})
.then((data) => {
  // console.log('Data received:', data);
  data.forEach((stopData: any) => {
    loadedBusStops.push({
      stopId: stopData.busStopId,
      stopName: stopData.name,
      coordinate: [stopData.longitude, stopData.latitude]
    });
  })
})
.catch((error) => {
  console.error('Error fetching data:', error);
});

fetch(`${Config.BASE_API_URL}/api/busstop/route/2`) // id 2
.then((response) => {
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.status);
  }
  return response.json();
})
.then((data) => {
  console.log('Data received:', data);
  data.forEach((stopData: any) => {
    loadedBusStops.push({
      stopId: stopData.busStopId,
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
            <BusStopButton stop={stop} selected={selected} setSelected={setSelected} flyTo={flyTo} />
          </MarkerView>
        ))}
    </>
  );
}