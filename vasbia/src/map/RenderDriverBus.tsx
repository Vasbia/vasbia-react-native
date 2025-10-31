import { MarkerView } from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import TrackBusIcon from "../assets/icons/TrackBusIcon";
import Config from "react-native-config";
import CookieManager from "@react-native-cookies/cookies";

type TrackedBus = {
  busId: number;
  routeId: number;
  coordinate: [number, number];
  status: string;
  eta: number;
  rem_sch: any;
};

type RenderTrackedBusesProps = {
  selectedRouteId: number | null;
  DriverBus: number | null;
  onBusUpdate?: (status: string, eta: number, rem_sch: any) => void;
};

function useMockTrackedBuses(selectedRouteId: number | null, DriverBus: number | null) {
  const [buses, setBuses] = useState<TrackedBus[]>([]);

  useEffect(() => {
    if (!selectedRouteId) {
      setBuses([]);
      return;
    }
    // ============================ update bus position from API ===============================
     const interval = setInterval(async () => {
      console.log("Fetching driver bus position...");
    try {
      const activeBusResponse = await fetch(`${Config.BASE_API_URL}/api/busroute/activebus/${selectedRouteId}`);
      if (!activeBusResponse.ok) throw new Error('Network response was not ok');
      const activeBus = await activeBusResponse.json();

      var checked = false;
      activeBus.forEach((bus: any) => {
        if (bus.busId === DriverBus){
          checked = true;
        }
      });

      if (!checked){
        setBuses([]);
        return;
      }

      const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
      const positionRes = await fetch(`${Config.BASE_API_URL}/api/busdriver/status?token=${cookies['token'].value}`);
      if (!positionRes.ok){
        setBuses([]);
        return;
    }
      const data = await positionRes.json();

      if (data.message === "NO_BUS_ACTIVE"){
        console.log("No active bus for driver");
        setBuses([]);
        return;
      }
      else{
        var schedules: any[] = [];
        data.remaining_schedule.forEach((schedule: any) => {
            schedules.push({ busStopName: schedule.busStopName, arriveTime: schedule.arriveTime })
        });
        var busData = [{
            busId: DriverBus,
            routeId: selectedRouteId,
            coordinate: [data.longitude, data.latitude],
            status: data.status,
            eta: data.difference_seconds,
            rem_sch: schedules,
        } as TrackedBus];
      }  

      setBuses(busData);
    } catch (error) {
      console.log('Error fetching active buses:', error);
    }
  }, 3000);
  // ============================ update bus position from API ===============================

    return () => clearInterval(interval);
  }, [selectedRouteId]);

  return buses;
}

export default function RenderDriverBus({ selectedRouteId, DriverBus, onBusUpdate}: RenderTrackedBusesProps) {
  const trackedBuses = useMockTrackedBuses(selectedRouteId, DriverBus);

  useEffect(() => {
    if (trackedBuses.length > 0 && onBusUpdate) {
      const { status, eta, rem_sch } = trackedBuses[0];
      onBusUpdate(status, eta, rem_sch);
    }
  }, [trackedBuses]);

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