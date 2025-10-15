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

// const engineerRoutePaths:busRoute = {
//   routeId: "route1",
//   routeName: "Engineering Faculty Route",
//   coordinates: [
//     [13.72689, 100.77685],
//     [13.72701, 100.77685],
//     [13.72711, 100.77685],
//     [13.72713, 100.77685],
//     [13.72714, 100.77684],
//     [13.72716, 100.77683],
//     [13.72717, 100.77682],
//     [13.72719, 100.7768],
//     [13.7272, 100.77678],
//     [13.7272, 100.77676],
//     [13.72721, 100.77673],
//     [13.72721, 100.7767],
//     [13.72719, 100.77623],
//     [13.72718, 100.77577],
//     [13.72716, 100.7753],
//     [13.72715, 100.77484],
//     [13.72714, 100.77438],
//     [13.72713, 100.77392],
//     [13.72712, 100.77346],
//     [13.72712, 100.77299],
//     [13.72711, 100.7729],
//     [13.72705, 100.77244],
//     [13.72703, 100.77187],
//     [13.72703, 100.77186],
//     [13.72703, 100.77187],
//     [13.72692, 100.77187],
//     [13.7268, 100.77187],
//     [13.72658, 100.77187],
//     [13.72615, 100.77188],
//     [13.72614, 100.77188],
//     [13.72614, 100.77189],
//     [13.72616, 100.77235],
//     [13.72617, 100.77282],
//     [13.72619, 100.77328],
//     [13.7262, 100.77374],
//     [13.72622, 100.7742],
//     [13.72625, 100.77464],
//     [13.72639, 100.77465],
//     [13.7264, 100.77467],
//     [13.72641, 100.77513],
//     [13.72642, 100.7756],
//     [13.72643, 100.77605],
//     [13.72644, 100.77652],
//     [13.72645, 100.77685],
//     [13.72646, 100.77686],
//   ]
// }

// const loadedBusRoutes: busRoute[] =  [
//   engineerRoutePaths,
// ]

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
            lineColor: "#2D6EFF",
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