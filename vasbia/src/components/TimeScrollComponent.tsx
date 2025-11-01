import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import Config from 'react-native-config';

interface TimeItem { time: string; busId: number }

interface Props {
  schedules: TimeItem[];
  pastSchedules?: TimeItem[];
  title?: string;
  busStopId?: number;
}

const TimeScrollComponent: React.FC<Props> = ({
  schedules,
  pastSchedules = [],
  title = 'Time',
  busStopId = 0,
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedBusId, setSelectedBusId] = useState<number | null>(null);
  const [minutesBefore, setMinutesBefore] = useState<number>(1);

  const handleTimePress = (busId: number, time: string) => {
    setSelectedBusId(busId);
    setSelectedTime(time);
    setMinutesBefore(1);
  };

  const adjustMinutes = (delta: number) => {
    setMinutesBefore(prev => Math.max(0, prev + delta));
  };

  const handleConfirm = async () => {
    if (!selectedTime || !selectedBusId) {
      Alert.alert('⚠️ Select a time first');
      return;
    }
    try {
      const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
      const token = cookies['token']?.value;
      if (!token) {
        Alert.alert('⚠️ Not logged in', 'Please log in again.');
        return;
      }

      // build HH:mm:ss notify time
      const [h, m, s] = selectedTime.split(':').map(Number);
      const d = new Date();
      d.setHours(h);
      d.setMinutes(m - minutesBefore);
      d.setSeconds(s || 0);
      const timeToNotify = d.toTimeString().split(' ')[0].slice(0, 8);

      // this endpoint expects query params (empty body)
      const url =
        `${Config.BASE_API_URL}/api/notification/TrackBusStop?` +
        `bus_id=${selectedBusId}` +
        `&bus_stop_id=${busStopId}` +
        `&schedule_time=${encodeURIComponent(selectedTime)}` +
        `&time_to_notify=${encodeURIComponent(timeToNotify)}` +
        `&token=${encodeURIComponent(token)}`;

      const res = await fetch(url, { method: 'POST', headers: { Accept: '*/*' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      Alert.alert('✅ ตั้งค่าการแจ้งเตือนสำเร็จ', `คุณจะได้รับการแจ้งเตือนเมื่อ ${timeToNotify}`);
      setSelectedTime(null);
      setSelectedBusId(null);
      setMinutesBefore(1);
    } catch (e) {
      console.error(e);
      Alert.alert('❌ เกิดข้อผิดพลาด', 'ตั้งค่าการแจ้งเตือนไม่สำเร็จ');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {/* Wrapping grid (upcoming first) */}
      <View style={styles.wrapGrid}>
        {schedules.map((s, i) => {
          const isSelected = selectedTime === s.time && selectedBusId === s.busId;
          return (
            <TouchableOpacity
              key={`up-${i}`}
              onPress={() => handleTimePress(s.busId, s.time)}
              style={[styles.chip, isSelected && styles.chipSelected]}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {s.time}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Past schedules appended, greyed & not tappable */}
        {pastSchedules.map((s, i) => (
          <View key={`past-${i}`} style={[styles.chip, styles.chipPast]}>
            <Text style={styles.chipTextPast}>{s.time}</Text>
          </View>
        ))}
      </View>

      {/* Adjustment bar (outside the grid) */}
      {selectedTime && (
        <View style={styles.adjustContainer}>
          <Text style={styles.selectedTimeLabel}>
            เลือก: {selectedTime} ({minutesBefore} นาที ก่อนหน้า)
          </Text>

          <View style={styles.adjustRow}>
            {[-10, -5, -1].map(v => (
              <TouchableOpacity key={v} style={styles.adjustButton} onPress={() => adjustMinutes(v)}>
                <Text style={styles.adjustText}>{v}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.minuteLabel}>ก่อน {minutesBefore} นาที</Text>

            {[1, 5, 10].map(v => (
              <TouchableOpacity key={v} style={styles.adjustButton} onPress={() => adjustMinutes(v)}>
                <Text style={styles.adjustText}>{`+${v}`}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>ยืนยันการแจ้งเตือน</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const GAP = 8;

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },

  // Wrapping grid: chips flow to next line automatically
  wrapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: GAP, // RN 0.71+; if older, replace with margins on chip
  },

  chip: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',

    // If 'gap' unsupported, uncomment these and remove gap above:
    // marginRight: 8,
    // marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#2D6EFF',
  },
  chipPast: {
    backgroundColor: '#E6E6E6',
  },

  chipText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  chipTextSelected: { color: '#fff' },
  chipTextPast: { fontSize: 15, fontWeight: '700', color: '#8A8A8A' },

  // Adjust bar
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
    flexWrap: 'wrap',
    marginBottom: 10,
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
  adjustText: { fontSize: 14, fontWeight: '600' },
  minuteLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginHorizontal: 8 },

  confirmButton: {
    backgroundColor: '#2D6EFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});

export default TimeScrollComponent;
