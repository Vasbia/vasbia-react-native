import { useEffect, useState } from "react";
import LandmarkDetails from "../components/bottomSheet/LandmarkDetails";
import BusStopDetails from "../components/bottomSheet/BusStopDetails";
import BusRouteDetails from "../components/bottomSheet/BusRouteDetails";
import Config from "react-native-config";

type SelectedItem = {
  type: "busStop" | "busRoute" | "landmark" | null;
  id: string | null;
};

//API calls for details
async function fetchLandmarkDetails(id: string) {
  const details = {
    id: {id},
    landmarkName: null as string | null,
    subDetails: null as string | null,
    imageUrl: null as string | null,
  };
  await fetch(`${Config.BASE_API_URL}/api/place/${id}`)
  .then((response) => response.json())
  .then((data) => {
    // console.log("Fetched landmark details:", data);
    details.landmarkName = data.name;
    details.subDetails = data.name;
    details.imageUrl = data.image;
  })
  // console.log("Loaded landmark details:", loadedLandmark);
  .catch((error) => {
    console.error("Error fetching landmark details:", error);
  });
  return details;
}

async function fetchBusStopDetails(id: string) {
  await new Promise((r) => setTimeout(r, 300));
  return {
    id,
    busStopName: "Bus Stop A",
    subDetails: "Chalong Krung 1 Alley, Lat Krabang, Bangkok 10520",
    routes: ["Route 1", "Route 2"],
  };
}

async function fetchBusRouteDetails(id: string) {
  await new Promise((r) => setTimeout(r, 300));
  return {
    id,
    routeName: "Route 1",
    stops: [
      { id: "stop1", name: "Stop A" },
      { id: "stop2", name: "Stop B" },
    ],
  };
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