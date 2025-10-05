import { LineLayer, ShapeSource } from "@maplibre/maplibre-react-native";
import RenderTrackBus from "./RenderTrackBus";

type busRoute= {
  routeId: string;
  routeName: string;
  coordinates: [number, number][];
};

type RenderProps = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

const engineerRoutePaths:busRoute = {
  routeId: "route1",
  routeName: "Engineering Faculty Route",
  coordinates: [
    [13.72689, 100.77685],
    [13.72701, 100.77685],
    [13.72711, 100.77685],
    [13.72713, 100.77685],
    [13.72714, 100.77684],
    [13.72716, 100.77683],
    [13.72717, 100.77682],
    [13.72719, 100.7768],
    [13.7272, 100.77678],
    [13.7272, 100.77676],
    [13.72721, 100.77673],
    [13.72721, 100.7767],
    [13.72719, 100.77623],
    [13.72718, 100.77577],
    [13.72716, 100.7753],
    [13.72715, 100.77484],
    [13.72714, 100.77438],
    [13.72713, 100.77392],
    [13.72712, 100.77346],
    [13.72712, 100.77299],
    [13.72711, 100.7729],
    [13.72705, 100.77244],
    [13.72703, 100.77187],
    [13.72703, 100.77186],
    [13.72703, 100.77187],
    [13.72692, 100.77187],
    [13.7268, 100.77187],
    [13.72658, 100.77187],
    [13.72615, 100.77188],
    [13.72614, 100.77188],
    [13.72614, 100.77189],
    [13.72616, 100.77235],
    [13.72617, 100.77282],
    [13.72619, 100.77328],
    [13.7262, 100.77374],
    [13.72622, 100.7742],
    [13.72625, 100.77464],
    [13.72639, 100.77465],
    [13.7264, 100.77467],
    [13.72641, 100.77513],
    [13.72642, 100.7756],
    [13.72643, 100.77605],
    [13.72644, 100.77652],
    [13.72645, 100.77685],
    [13.72646, 100.77686],
  ]
}

const loadedBusRoutes: busRoute[] =  [
  engineerRoutePaths,
]

export default function RenderAllBusRoutes({ selectedId, setSelectedId }: RenderProps) {
  const { unselected, selected } = splitRoutesGeoJSON(loadedBusRoutes, selectedId);

  return (
    <>
      <ShapeSource id="unselectedRoutes" shape={unselected}
        onPress={(e) => {
          const pressedFeature = e.features[0];
          const routeId = pressedFeature?.properties?.routeId;
          if (routeId) { setSelectedId(selectedId === routeId ? null : routeId); }
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

      <ShapeSource id="selectedRoute" shape={selected}
        onPress={(e) => {
          const pressedFeature = e.features[0];
          const routeId = pressedFeature?.properties?.routeId;
          if (routeId) { setSelectedId(selectedId === routeId ? null : routeId); }
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
      
      {selected.features.length > 0 && selected.features[0].properties?.routeId === selectedId && 
        ( <RenderTrackBus selectedRouteId={selectedId!} /> ) 
      }
    </>
  );
}

function splitRoutesGeoJSON(busRoutes: busRoute[], selectedId: string | null) 
  : {
    unselected: GeoJSON.FeatureCollection;
    selected: GeoJSON.FeatureCollection;
  } {
  const selected: GeoJSON.Feature[] = [];
  const unselected: GeoJSON.Feature[] = [];

  busRoutes.forEach((route) => {
    const feature: GeoJSON.Feature = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coordsPolish(route.coordinates),
      },
      properties: {
        routeId: route.routeId,
        routeName: route.routeName,
      },
    };

    if (selectedId && route.routeId === selectedId) {
      selected.push(feature);
    } else {
      unselected.push(feature);
    }
  });

  return {
    unselected: { type: "FeatureCollection", features: unselected },
    selected: { type: "FeatureCollection", features: selected },
  };
}

function coordsPolish(coords: [number, number][]): [number, number][] {
  const newCoords = [...coords, coords[0]];
  return newCoords.map(([lat, lng]) => [lng, lat])
}