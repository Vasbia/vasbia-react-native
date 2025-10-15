import { MarkerView } from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import TrackBusIcon from "../assets/icons/TrackBusIcon";
import Config from "react-native-config";

type TrackedBus = {
  busId: number;
  routeId: number;
  coordinate: [number, number];
};

type RenderTrackedBusesProps = {
  selectedRouteId: number | null;
};

function useMockTrackedBuses(selectedRouteId: number | null) {
  const [buses, setBuses] = useState<TrackedBus[]>([]);

  useEffect(() => {
    if (!selectedRouteId) {
      setBuses([]);
      return;
    }
    // ============================ update bus position from API ===============================
     const interval = setInterval(async () => {
    try {
      const activeBusResponse = await fetch(`${Config.BASE_API_URL}/api/busroute/activebus/${selectedRouteId}`);
      if (!activeBusResponse.ok) throw new Error('Network response was not ok');
      const activeBus = await activeBusResponse.json();
      // console.log('Active buses:', activeBus);

      const busData = await Promise.all(
        activeBus.map(async (bus: any) => {
          try {
            const positionRes = await fetch(`${Config.BASE_API_URL}/api/bus/position/${bus.busId}`);
            if (!positionRes.ok) throw new Error('Network response was not ok');
            const data = await positionRes.json();
            // console.log('Bus position data:', data);

            if (data.message === "NO_BUS_ACTIVE") return null;

            return {
              busId: bus.busId,
              routeId: selectedRouteId,
              coordinate: [data.data.longitude, data.data.latitude],
            } as TrackedBus;
          } catch (error) {
            console.error(`Error fetching bus ${bus.busId} position:`, error);
            return null;
          }
        })
      );

      const validBuses = busData.filter((b): b is TrackedBus => b !== null);
      // console.log('Active bus data to set:', validBuses);
      setBuses(validBuses);
    } catch (error) {
      console.error('Error fetching active buses:', error);
    }
  }, 3000);
  // ============================ update bus position from API ===============================

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
          coordinate={bus.coordinate}
          anchor={{ x: 0.5, y: 1 }} // bottom-center hits the coordinate
        >
          <TrackBusIcon />
        </MarkerView>
      ))}
    </>
  );
}