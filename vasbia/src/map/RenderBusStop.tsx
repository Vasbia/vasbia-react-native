import { CameraRef, MarkerView } from "@maplibre/maplibre-react-native";
import { useState } from "react";
import BusStopButton from "../components/BusStopButton";

type BusStop= {
  stopId: string;
  stopName: string;
  coordinate: [number, number];
};

type RenderProps = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
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

export default function RenderAllBusStops({ selectedId, setSelectedId, flyTo }: RenderProps) {  
  return (
    <>
        {loadedBusStops.map((stop) => (
          <MarkerView 
            key={stop.stopId} 
            coordinate={stop.coordinate} 
            anchor={{ x: 0.5, y: 1 }} //bottom-center hits the coordinate
          >
            <BusStopButton 
              selected={selectedId === stop.stopId} 
              onPress={() => {
                setSelectedId(selectedId === stop.stopId ? null : stop.stopId);
                flyTo(stop.coordinate);
              }}
            />
          </MarkerView>
        ))}
    </>
  );
}