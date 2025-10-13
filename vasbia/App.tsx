import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import MapScreen from './src/screens/MapScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import FullNotificationInfoScreen from './src/screens/FullNotificationInfoScreen';
import BusStopTimeTableScreen from './src/screens/BusStopTimeTableScreen';
import BusRouteTimeTableScreen from './src/screens/BusRouteTimeTableScreen';


import type { Notification } from './src/types/Notification';

const Stack = createNativeStackNavigator<StackParamList>();

const isLoggedIn = false; //will be replace with google auth

export type StackParamList = {
  Login: undefined;
  Map: undefined;
  Notification: undefined;
  FullNotificationInfo: { notification: Notification };
  BusStopTimeTable: undefined;
  BusRouteTimeTable: undefined;
};

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isLoggedIn ? 'Map' : 'Login'}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="FullNotificationInfo" component={FullNotificationInfoScreen} />
          <Stack.Screen name="BusStopTimeTable" component={BusStopTimeTableScreen} />
          <Stack.Screen name="BusRouteTimeTable" component={BusRouteTimeTableScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
