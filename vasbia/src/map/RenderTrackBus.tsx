import { MarkerView } from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import TrackBusIcon from "../assets/icons/TrackBusIcon";
import Config from "react-native-config";

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
      return;
    }

    const interval = setInterval(() => {
      // ============================ track bus API ===============================
      fetch(`${Config.BASE_API_URL}/api/bus/position/1`) // fixed id 1 for now
      .then((response) => {
        if (!response.ok) {
          // throw new Error('Network response was not ok ' + response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Data received:', data);
        setBuses([
          {
            busId: "bus-1",
            routeId: selectedRouteId,
            coordinate: [data.longitude, data.latitude]
          },
        ]);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
      // ============================ track bus API ===============================
    }, 3000);

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