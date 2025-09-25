import * as React from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Platform} from 'react-native';
import BackIcon from '../assets/icons/BackIcon';
import NotificationCard from '../components/NotificationCard';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StackParamList } from '../../App';
import { Dimensions } from 'react-native';
import { Notification } from '../types/Notification';

export default function NotificationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [title, setTitle] = React.useState('');
  const [subtitle, setSubtitle] = React.useState('');

  function handleAddNotification() {
    if (!title || !subtitle) {
      return;
    }

    const now = new Date();
    // const date = now.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

    setNotifications([{ title, date: now.toISOString(), subtitle }, ...notifications]);
    setTitle('');
    setSubtitle('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BackIcon size={40} color="#000" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Notifications</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter Title..."
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Enter Description..."
          value={subtitle}
          onChangeText={setSubtitle}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleAddNotification}>
          <Text style={styles.buttonText}>Add Notification</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications */}
      <FlatList
        data={notifications}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <NotificationCard
            title={item.title}
            date={item.date}
            description={item.subtitle}
            onPress={() =>
              navigation.navigate('FullNotificationInfo', {
                notification: item,
              })
            }
          />
        )}
      />
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
  pageTitle: {
    fontSize: screenWidth * 0.06,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  form: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: screenWidth * 0.025,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: screenWidth * 0.02,
    marginBottom: screenWidth * 0.02,
    fontSize: screenWidth * 0.04,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: screenWidth * 0.025,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.045,
  },
});
