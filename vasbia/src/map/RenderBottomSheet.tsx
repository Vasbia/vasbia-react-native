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
  await new Promise((r) => setTimeout(r, 300));
  return {
    id,
    landmarkName: "Faculty of Engineering, KMITL",
    subDetails: "Chalong Krung 1 Alley, Lat Krabang, Bangkok 10520",
    description: "อาคารเรียนสูง 12 ชั้น เป็นจุดสำคัญของคณะวิศวกรรมศาสตร์",
    imageUrl: "https://admin.curriculum.kmitl.ac.th/api/media/file/1440753623-72-o.jpg",
  };
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
