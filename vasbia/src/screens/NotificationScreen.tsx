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
  SafeAreaView,
} from 'react-native';
import BackIcon from '../assets/icons/BackIcon';
import NotificationCard from '../components/NotificationCard';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {StackParamList} from '../../App';
import {Notification} from '../types/Notification';
import CookieManager from '@react-native-cookies/cookies';
import Config from 'react-native-config';
import NoNotification from '../assets/icons/EmptyState/NoNotification';

export default function NotificationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);

  // --- Fetch notifications ---
  const fetchNotifications = async () => {
    try {
      const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
      const token = cookies.token?.value;

      if (!token) {
        console.warn('No token found in cookies');
        return;
      }

      const response = await fetch(
        `${Config.BASE_API_URL}/api/notification/getNotification?token=${token}`,
      );
      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();

      const sortedData = [...data].sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
      );

      const mappedNotifications = sortedData.map((item: any) => ({
        id: item.notification_id,
        title: item.title,
        datetime: item.datetime,
        message: item.message,
        is_read: item.is_read,
      }));

      console.log('=============================================== Fetched notifications:==============================================', data);
      setNotifications(mappedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to fetch notifications.');
    } finally {
      setLoading(false);
      console.log('notification data', notifications);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
  },);

  React.useEffect(() => {
    console.log('notification data', notifications);
  }, [notifications]);

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

      {notifications.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <NoNotification/>
          <Text style={styles.emptyTextTitle}>No Notifications</Text>
          <Text style={styles.emptyTextDescription}>Try to follow the information from each bus route / bus stop!</Text>
        </View>
      ) : (
        <SafeAreaView>
          <FlatList
            data={notifications}
            keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{padding: 16}}
          style={styles.flatlist}
          renderItem={({item}) => (
            <NotificationCard
              id={item.id}
              title={item.title}
              datetime={item.datetime}
              message={item.message}
              is_read={item.is_read}
              onPress={async () => {
                const cookies = await CookieManager.get(`${Config.BASE_API_URL}`);
                const token = cookies.token?.value;

                if (!token) {
                  console.warn('No token found in cookies');
                  return;
                }

                await fetch(
                  `${Config.BASE_API_URL}/api/notification/read?token=${token}&notification_id=${item.id}`,
                  {
                    method: 'POST',
                  }
                );

                console.log('Notification marked as read:', item.id);

                setNotifications((prev) =>
                  prev.map((notif) =>
                    notif.id === item.id ? { ...notif, is_read: true } : notif
                  )
                );
                navigation.navigate('FullNotificationInfo', {
                  notification: { ...item, is_read: true },
                });

                console.log('Notification data:', item);
              }}
            />
          )}
        />
      </SafeAreaView>
      )}
    </View>
  );
}

const {width: screenWidth} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
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
    transform: [{translateY: -screenWidth * 0.035}],
  },
  pageTitle: {
    fontSize: 32,
    fontFamily: 'Inter_24pt-Bold',
    color: '#000',
    textAlign: 'center',
  },
  flatlist: {
    marginLeft: 8,
    marginRight: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTextTitle: {
    marginTop: 20,
    fontSize: 32,
    fontFamily: 'Inter_24pt-Bold',
    color: '#2D6EFF',
  },
  emptyTextDescription: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: 'Inter_24pt-Regular',
    color: '#828282',
    textAlign: 'center',
  },
});
