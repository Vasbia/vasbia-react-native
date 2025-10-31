import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import BackIcon from '../assets/icons/BackIcon';
import { Notification } from '../types/Notification';

function formatNotificationDate(dateString: string) {
  if (dateString === '') return '';
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
      <View style={styles.titleBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon size={40} color="#000" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Notification</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.date}>{formatNotificationDate(notification.datetime)}</Text>
        </View>
          <Text style={styles.description}>{notification.message}</Text>
      </ScrollView>
    </View>
  );
}

const { width: screenWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleBar: {
    width: '100%',
    marginTop: 64,
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
  pageTitle: {
    fontSize: 32,
    fontFamily: 'Inter_24pt-Bold',
    color: '#000',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_24pt-Bold',
    marginBottom: 16,
    color: '#2d6eff',
    width: '70%',
  },
  date: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
    fontFamily: 'Inter_24pt-Regular',
  },
  description: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Inter_24pt-Regular',
  },
});
