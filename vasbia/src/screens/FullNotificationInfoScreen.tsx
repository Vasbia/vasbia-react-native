import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import BackIcon from '../assets/icons/BackIcon';

type Notification = {
  title: string;
  date: string;
  subtitle: string;
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

export default function FullNotificationInfo() {
  const route = useRoute();
  const navigation = useNavigation();
  const { notification } = route.params as { notification: Notification };

  return (
    <View style={styles.container}>
      {/* Title Bar */}
      <View style={styles.titleBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon size={40} color="#000" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Notification</Text>
      </View>

      {/* Full Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.date}>{formatNotificationDate(notification.date)}</Text>
        <Text style={styles.description}>{notification.subtitle}</Text>
      </ScrollView>
    </View>
  );
}

const { width: screenWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  titleBar: {
    width: '100%',
    marginTop: Platform.OS === 'ios' ? screenWidth * 0.13 : screenWidth * 0.08,
    marginBottom: screenWidth * 0.025,
    paddingHorizontal: screenWidth * 0.025,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: screenWidth * 0.04,
  },
  backButton: {
    position: 'absolute',
    left: screenWidth * 0.025,
    top: '30%',
    transform: [{ translateY: -screenWidth * 0.035 }],
  },
  pageTitle: { fontSize: screenWidth * 0.06, fontWeight: 'bold', color: '#000', textAlign: 'center' },
  content: { padding: screenWidth * 0.045 },
  title: { fontSize: screenWidth * 0.06, fontWeight: 'bold', marginBottom: screenWidth * 0.015, color: '#000' },
  date: { color: '#888', fontSize: screenWidth * 0.037, marginBottom: screenWidth * 0.03 },
  description: { fontSize: screenWidth * 0.042, lineHeight: screenWidth * 0.06, color : '#000' },
});
