import { useEffect, useState } from "react";
import LandmarkDetails from "../components/bottomSheet/LandmarkDetails";
import BusStopDetails from "../components/bottomSheet/BusStopDetails";
import BusRouteDetails from "../components/bottomSheet/BusRouteDetails";
import Config from "react-native-config";
import {RouteNames} from "./RenderBusRoute"

type SelectedItem = {
  type: "busStop" | "busRoute" | "landmark" | null;
  id: number | null;
};

//API calls for details
async function fetchLandmarkDetails(id: number) {
  const details = {
    id: {id},
    landmarkName: null as string | null,
    imageUrl: null as string | null,
  };
  await fetch(`${Config.BASE_API_URL}/api/place/${id}`)
  .then((response) => response.json())
  .then((data) => {
    console.log("Fetched landmark details:", data);
    details.landmarkName = data.name;
    details.imageUrl = data.image;
  })
  // console.log("Loaded landmark details:", details);
  .catch((error) => {
    console.error("Error fetching landmark details:", error);
  });
  return details;
}

async function fetchBusStopDetails(id: number) {
  const details = {
    id: {id},
    busStopName: null as number | null,
  };
  await fetch(`${Config.BASE_API_URL}/api/busstop/${id}`)
  .then((response) => response.json())
  .then((data) => {
    // console.log("Fetched busStop details:", data);
    details.busStopName = data.name;
  })
  // console.log("Loaded busStop details:", details);
  .catch((error) => {
    console.error("Error fetching busStop details:", error);
  });
  return details;
}

async function fetchBusRouteDetails(id: number) {
  const details =  {
    id: {id},
    routeName: RouteNames[Math.max(0, id - 1)],
    stops: [] as {busStopId:number, name:string}[],
  };
  await fetch(`${Config.BASE_API_URL}/api/busstop/route/${id}`)
  .then((response) => response.json())
  .then((data) => {
    // console.log("Fetched busRoute details:", data);
    data.forEach((stop:any) => {
      // console.log("Processing stop in route:", stop);
      details.stops.push({
        busStopId: stop.busStopId,
        name: stop.name,
      });
    })
  })
  // console.log("Loaded busRoute details:", details);
  .catch((error) => {
    console.error("Error fetching busRoute details:", error);
  });
  return details;
}

export default function RenderDetailsBottomSheet(selected : SelectedItem) {
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState<any>(null);

    useEffect(() => {
        if (!selected || !selected.type || !selected.id) {
          setDetails(null);
          return;
        }

        let active = true;
        setLoading(true);
        setDetails(null);
        
        const fetcher =
        selected.type === "landmark" ? fetchLandmarkDetails
            : selected.type === "busStop" ? fetchBusStopDetails
            : fetchBusRouteDetails;

        fetcher(selected.id)
            .then((data) => {
              if (active) setDetails(data);
            })
            .catch(() => {
              if (active) setDetails(null);
            })
            .finally(() => {
              if (active) setLoading(false);
            });
        
        return () => {active = false;};
    }, [selected]);

  if (!selected?.type || !selected.id) return null;
  if (loading || !details) return null; //replace with a spinner?

  switch (selected.type) {
    case "landmark":
      return <LandmarkDetails data={details} />;
    case "busStop":
      return <BusStopDetails data={details} />;
    case "busRoute":
      return <BusRouteDetails data={details} />;
    default:
      return null;
  }
}
