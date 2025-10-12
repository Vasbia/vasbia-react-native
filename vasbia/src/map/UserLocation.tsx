import Geolocation from '@react-native-community/geolocation';
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export default function useUserLocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const startWatching = async () => {
      const granted =
        Platform.OS === 'ios' || (await requestLocationPermission());
      setHasPermission(granted);

      if (!granted) {
        console.log('Permission denied — using fallback location');
        return;
      }

      // Start continuous watch
      const watchId = Geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          console.log('Updated location:', latitude, longitude);
        },
        error => console.error('Location error:', error),
        {
          enableHighAccuracy: true,
          distanceFilter: 3, // update every 3 meters
          interval: 2000,    // Android only: update every 2s
          fastestInterval: 1000,
        },
      );

      // Cleanup
      return () => Geolocation.clearWatch(watchId);
    };

    startWatching();
  }, []);

  return { location, hasPermission };
}
