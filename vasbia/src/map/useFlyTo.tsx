import { CameraRef } from "@maplibre/maplibre-react-native";
import { RefObject, useCallback } from "react";

export function useFlyTo(cameraRef: RefObject<CameraRef | null>) {
  const flyTo = useCallback(
    (coordinate: [number, number], duration: number = 1200, zoom?: number) => {
      if (!cameraRef.current) return;

      if (zoom !== undefined) {
        cameraRef.current.setCamera({
          centerCoordinate: coordinate,
          zoomLevel: zoom,
          animationDuration: duration,
        });
      } else {
        cameraRef.current.flyTo(coordinate, duration);
      }
    },
    [cameraRef]
  );

  return flyTo;
}
