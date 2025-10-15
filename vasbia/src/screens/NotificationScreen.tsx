import * as React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import BackIcon from '../assets/icons/BackIcon';
import NotificationCard from '../components/NotificationCard';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {StackParamList} from '../../App';
import {Notification} from '../types/Notification';
import CookieManager from '@react-native-cookies/cookies';
import Config from 'react-native-config';

export default function NotificationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);

  // --- Fetch notifications ---
  const fetchNotifications = async (token: string) => {
    try {
      const response = await fetch(
        `${Config.BASE_API_URL}/api/notification/getNotification?token=${token}`,
      );
      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();
      console.log('Fetched notifications:', data);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  // --- Update notifications before fetching ---
  const updateNotifications = async () => {
    try {
      const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
      const token = cookies.token?.value;

      if (!token) {
        console.warn('No token found in cookies');
        return;
      }

      console.log('Updating notifications with token:', token);

      const response = await fetch(
        `${Config.BASE_API_URL}/api/notification/update`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        },
      );

      if (!response.ok)
        throw new Error('Network response was not ok ' + response.status);

      const data = await response.json();
      console.log('Notification update response:', data);

      // After updating, fetch the latest list
      await fetchNotifications(token);
    } catch (error) {
      console.error('Error updating notifications:', error);
      Alert.alert('Error', 'Failed to update notifications.');
      setLoading(false);
    }
  };

  React.useEffect(() => {
    updateNotifications();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <BackIcon size={40} color="#000" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{padding: 16}}
        renderItem={({item}) => (
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

const {width: screenWidth} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  titleBar: {
    width: '100%',
    marginTop: 44,
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
    transform: [{translateY: -screenWidth * 0.035}],
  },
  pageTitle: {
    fontSize: screenWidth * 0.06,
    fontFamily: 'Inter_24pt-Bold',
    color: '#000',
    textAlign: 'center',
  },
});
