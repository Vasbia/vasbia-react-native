import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type NotificationCardProps = {
  title: string;
  date: string;
  description: string;
  onPress?: () => void;
};

function formatNotificationDate(dateString: string) {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();

  // remove time parts for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const compare = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const timePart = date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Bangkok',
  });

  if (compare.getTime() === today.getTime()) {
    return `Today, ${timePart}`;
  }
  if (compare.getTime() === yesterday.getTime()) {
    return `Yesterday, ${timePart}`;
  }

  return date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  }) + `, ${timePart}`;
}

export default function NotificationCard({
  title,
  date,
  description,
  onPress,
}: NotificationCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>
          {formatNotificationDate(date)}
        </Text>
      </View>
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
        {description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  date: { color: '#888', fontSize: 12 },
  description: { fontSize: 16, color: '#666' },
});
