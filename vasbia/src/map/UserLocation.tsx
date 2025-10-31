import Geolocation from '@react-native-community/geolocation';
import { useEffect, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

async function requestLocationPermission() {
  if (Platform.OS !== 'android') return true;
  try {
    const fine = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    // Request COARSE too (Android 12+ can grant only Approximate)
    if (fine !== PermissionsAndroid.RESULTS.GRANTED) {
      const coarse = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      );
      return coarse === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch {
    return false;
  }
}

type LatLng = { latitude: number; longitude: number };

export default function useUserLocation() {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let pollId: ReturnType<typeof setInterval> | null = null;

    const getFix = (opts: Parameters<typeof Geolocation.getCurrentPosition>[2]) =>
      new Promise<LatLng>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          p => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
          e => reject(e),
          opts
        );
      });

    // Robust fetch with fallbacks:
    const getFixWithFallback = async (): Promise<LatLng | null> => {
      // 1) High accuracy, short timeout
      try {
        return await getFix({
          enableHighAccuracy: true,
          timeout: 6000,
          maximumAge: 0,
        });
      } catch (e1) {
        // 2) Balanced / network-based
        try {
          return await getFix({
            enableHighAccuracy: false,
            timeout: 6000,
            maximumAge: 0,
          });
        } catch (e2) {
          // 3) Accept cached fix ≤ 60s
          try {
            return await getFix({
              enableHighAccuracy: false,
              timeout: 4000,
              maximumAge: 60000, // accept last known if fresh enough
            });
          } catch {
            return null;
          }
        }
      }
    };

    const tick = async () => {
      const fix = await getFixWithFallback();
      if (fix) setLocation(fix);
      // else keep previous location; avoids flicker
    };

    const start = async () => {
      const granted = Platform.OS === 'ios' || (await requestLocationPermission());
      setHasPermission(granted);
      if (!granted) {
        Alert.alert(
          'ต้องเปิดการเข้าถึงตำแหน่ง',
          'กรุณาเปิด Location Permission ใน Settings',
          [
            { text: 'ยกเลิก', style: 'cancel' },
            { text: 'เปิดการตั้งค่า', onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      // First fix immediately
      await tick();

      // Then poll every 3 seconds
      pollId = setInterval(tick, 3000);
    };

    start();

    return () => {
      if (pollId) clearInterval(pollId);
      Geolocation.stopObserving();
    };
  }, []);

  return { location, hasPermission };
}
