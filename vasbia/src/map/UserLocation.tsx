import Geolocation from '@react-native-community/geolocation';
import { useEffect, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,);
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
      const granted = Platform.OS === 'ios' || (await requestLocationPermission());
      setHasPermission(granted);

      if (!granted) {
        Alert.alert(
          'เปิดการเข้าถึงตำแหน่ง',
          'กรุณาเปิดการเข้าถึงตำแหน่งในการตั้งค่า เพื่อใช้งานฟังก์ชันแนะนำสถานที่ใกล้เคียง',
          [
            { text: 'ยกเลิก', style: 'cancel' },
            { text: 'เปิดการตั้งค่า', onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }

      Geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          // console.log('Updated location:', latitude, longitude);
        },
        error => {
          console.log('Location error:', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 3,
          interval: 2000,
          fastestInterval: 1000,
        },
      );
    };

    startWatching();
  }, []);

  return { location, hasPermission };
}
