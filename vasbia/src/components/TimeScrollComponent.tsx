import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import Config from 'react-native-config';

interface TimeScrollComponentProps {
  schedules: { time: string; busId: number }[];
  title?: string;
  busStopId?: number;
}

const TimeScrollComponent: React.FC<TimeScrollComponentProps> = ({
  schedules,
  title = 'Time',
  busStopId = 0,
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedBusId, setSelectedBusId] = useState<number | null>(null);
  const [minutesBefore, setMinutesBefore] = useState<number>(1);

  const handleTimePress = (busId: number, time: string) => {
    if(selectedTime == null && selectedBusId == null){
      setSelectedBusId(busId);
      setSelectedTime(time);
      setMinutesBefore(0);
    } else {
      setSelectedBusId(null);
      setSelectedTime(null);
    }
  };

  const adjustMinutes = (delta: number) => {
    setMinutesBefore((prev) => Math.max(0, prev + delta));
  };

  const handleConfirm = async () => {
    if (!selectedTime || !selectedBusId) {
      Alert.alert('⚠️ Select a time first');
      return;
    }

    try {
      // Retrieve token from cookies
      const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
      const token = cookies['token']?.value;

      if (!token) {
        Alert.alert('⚠️ Not logged in', 'Please log in again.');
        return;
      }

      // calculate time_to_notify
      const [h, m, s] = selectedTime.split(':').map(Number);
      const date = new Date();
      date.setHours(h);
      date.setMinutes(m - minutesBefore);
      date.setSeconds(s || 0);
      const timeToNotify = date.toTimeString().split(' ')[0].slice(0, 8);

      const url = `${Config.BASE_API_URL}/api/notification/TrackBusStop?` +
        `bus_id=${selectedBusId}` +
        `&bus_stop_id=${busStopId}` +
        `&schedule_time=${encodeURIComponent(selectedTime)}` +
        `&time_to_notify=${encodeURIComponent(timeToNotify)}` +
        `&token=${encodeURIComponent(token)}`;

      console.log('POST URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: '*/*',
        },
      });


      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      console.log(response);
      Alert.alert('Notification set', `You’ll be notified at ${timeToNotify}`);

      setSelectedTime(null);
      setSelectedBusId(null);
      setMinutesBefore(1);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to set notification time.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {/* Horizontal Time Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {schedules.map((s, index) => {
          const isSelected = selectedTime === s.time && selectedBusId === s.busId;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.timeSlot, isSelected && styles.selectedSlot]}
              onPress={() => handleTimePress(s.busId, s.time)}
            >
              <Text style={styles.timeText}>{s.time}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Adjustment Bar (outside scroll view) */}
      {selectedTime && (
        <View style={styles.adjustContainer}>
          <Text style={styles.selectedTimeLabel}>
            Selected: {selectedTime} (เตือนก่อนหน้า {minutesBefore} นาที)
          </Text>

          <View style={styles.adjustRow}>
            {[-10, -5, -1].map((v) => (
              <TouchableOpacity
                key={v}
                style={styles.adjustButton}
                onPress={() => adjustMinutes(v)}
              >
                <Text style={styles.adjustText}>{v}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.minuteLabel}>{minutesBefore}</Text>

            {[+1, +5, +10].map((v) => (
              <TouchableOpacity
                key={v}
                style={styles.adjustButton}
                onPress={() => adjustMinutes(v)}
              >
                <Text style={styles.adjustText}>{`+${v}`}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirm Notification</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollView: { paddingLeft: 16 },
  scrollContent: { paddingRight: 16 },
  timeSlot: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 6,
    alignItems: 'center',
    minWidth: 70,
  },
  selectedSlot: {
    backgroundColor: '#2D6EFF',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  adjustContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  selectedTimeLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  adjustButton: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  adjustText: {
    fontSize: 14,
    fontWeight: '600',
  },
  minuteLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 8,
  },
  confirmButton: {
    backgroundColor: '#2D6EFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default TimeScrollComponent;
