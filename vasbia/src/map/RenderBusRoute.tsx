import { LineLayer, ShapeSource } from "@maplibre/maplibre-react-native";
import RenderTrackBus from "./RenderTrackBus";
import Config from "react-native-config";

type busRoute= {
  routeId: number;
  routeName: string;
  description?: string;
  color: string;
  coordinates: [number, number][];
};

type SelectedItem = {
  type: "busStop" | "busRoute" | "landmark" | null;
  id: number | null;
};

type RenderProps = {
  selected: SelectedItem;
  setSelected: (item: SelectedItem) => void;
};

// ============================ Load bus routes from API ===============================
var loadedBusRoutes: busRoute[] = [];
export const RouteNames: String[] = [];

// ============================ Load bus routes from API ===============================
fetch(`${Config.BASE_API_URL}/api/busroute/all`)
.then((response) => response.json())
.then((data) => {
  // console.log("Fetched bus routes:", data);
  data.forEach((route:any) => {
    // console.log("Processing route:", route.path);
    RouteNames.push(route.name);
    loadedBusRoutes.push({
      routeId: route.routeId,
      routeName: route.name,
      description: route.description,
      color: route.color,
      coordinates: route.path.map((coord: any) => [coord.longitude, coord.latitude]),
    });
  })
  // console.log("Loaded bus routes:", loadedBusRoutes);
})
.catch((error) => {
  console.error("Error fetching bus routes:", error);
});
// ============================ Load bus routes from API ===============================

export default function RenderAllBusRoutes({ selected, setSelected }: RenderProps) {
  const { unSelectedRoute, selectedRoute } = splitRoutesGeoJSON(loadedBusRoutes, selected);

  return (
    <>
      <ShapeSource id="unselectedRoutes" shape={unSelectedRoute}
        onPress={(e) => {
          const pressedFeature = e.features[0];
          const PressId = pressedFeature?.properties?.routeId;
          if (PressId) { 
            if (selected.id === PressId && selected.type === "busRoute") {
              setSelected({ type: null, id: null });
            } else {
              setSelected({type: "busRoute", id: PressId});
            }
          }
        }}
      >
        <LineLayer id="unselectedLine"
          style={{
            lineColor: ['get', 'color'],
            lineWidth: 5,
            lineOpacity: 0.8,
          }}
        />
      </ShapeSource>

      <ShapeSource id="selectedRoute" shape={selectedRoute}
        onPress={(e) => {
          const pressedFeature = e.features[0];
          const PressId = pressedFeature?.properties?.routeId;
          if (PressId) { 
            if (selected.id === PressId && selected.type === "busRoute") {
              setSelected({ type: null, id: null });
            } else {
              setSelected({type: "busRoute", id: PressId});
            }
          }
        }}
      >
        <LineLayer id="selectedLine"
          style={{
            lineColor: "#a02dffff",
            lineWidth: 7,
            lineOpacity: 1,
          }}
        />
      </ShapeSource>
      
      {selectedRoute.features.length > 0 && selectedRoute.features[0].properties?.routeId === selected.id && 
        ( <RenderTrackBus selectedRouteId={selected.id} /> ) 
      }
    </>
  );
}

function splitRoutesGeoJSON(busRoutes: busRoute[], selected: SelectedItem) 
  : {
    unSelectedRoute: GeoJSON.FeatureCollection;
    selectedRoute: GeoJSON.FeatureCollection;
  } {
  const selectedRoute: GeoJSON.Feature[] = [];
  const unSelectedRoute: GeoJSON.Feature[] = [];

  busRoutes.forEach((route) => {
    const feature: GeoJSON.Feature = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: route.coordinates,
      },
      properties: {
        routeId: route.routeId,
        routeName: route.routeName,
        color: route.color,
      },
    };

    if (selected.type === "busRoute" && route.routeId === selected.id) {
      selectedRoute.push(feature);
    } else {
      unSelectedRoute.push(feature);
    }
  });

  return {
    unSelectedRoute: { type: "FeatureCollection", features: unSelectedRoute },
    selectedRoute: { type: "FeatureCollection", features: selectedRoute }
  };
}