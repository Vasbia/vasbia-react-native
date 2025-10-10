import { useEffect, useState } from "react";
import LandmarkDetails from "../components/bottomSheet/LandmarkDetails";
import BusStopDetails from "../components/bottomSheet/BusStopDetails";
import BusRouteDetails from "../components/bottomSheet/BusRouteDetails";

type SelectedItem = {
  type: "busStop" | "busRoute" | "landmark" | null;
  id: string | null;
};

//Mock API calls for details
async function fetchLandmarkDetails(id: string) {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    id,
    landmarkName: "อาคาร 12 ชั้น",
    description: "อาคารเรียนสูง 12 ชั้น เป็นจุดสำคัญของคณะวิศวกรรมศาสตร์",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Example-image.jpg",
  };
}

async function fetchBusStopDetails(id: string) {
  await new Promise((r) => setTimeout(r, 1000));
  return {
    id,
    busStopName: "Bus Stop A",
    routes: ["Route 1", "Route 2"],
  };
}

async function fetchBusRouteDetails(id: string) {
  await new Promise((r) => setTimeout(r, 1000));
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
        selected.type === "landmark"
            ? fetchLandmarkDetails
            : selected.type === "busStop"
            ? fetchBusStopDetails
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
  if (loading) return null; // you can replace with a spinner if you like
  if (!details) return null;

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
