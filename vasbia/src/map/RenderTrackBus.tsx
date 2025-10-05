import { MarkerView } from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import TrackBusIcon from "../assets/icons/TrackBusIcon";

type TrackedBus = {
  busId: string;
  routeId: string;
  coordinate: [number, number];
};

type RenderTrackedBusesProps = {
  selectedRouteId: string | null;
};

function useMockTrackedBuses(selectedRouteId: string | null) {
  const [buses, setBuses] = useState<TrackedBus[]>([]);

  useEffect(() => {
    if (!selectedRouteId) {
      setBuses([]);
      return;
    }

    const fetchMockBuses = () => {
      setBuses([
        {
          busId: "bus-1",
          routeId: selectedRouteId,
          coordinate: [
            100.772451 + Math.random() * 0.001,
            13.727075 + Math.random() * 0.001,
          ],
        },
      ]);
    }

    fetchMockBuses();

    const interval = setInterval(fetchMockBuses, 3000);

    return () => clearInterval(interval);
  }, [selectedRouteId]);

  return buses;
}

export default function RenderTrackBus({ selectedRouteId }: RenderTrackedBusesProps) {
  const trackedBuses = useMockTrackedBuses(selectedRouteId);

  return (
    <>
      {trackedBuses.map((bus) => (
        <MarkerView
          key={bus.busId}
          id={bus.busId}
          coordinate={bus.coordinate}
          anchor={{ x: 0.5, y: 1 }} // bottom-center hits the coordinate
        >
          <TrackBusIcon />
        </MarkerView>
      ))}
    </>
  );
}