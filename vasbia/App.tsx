import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import MapScreen from './src/screens/MapScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import FullNotificationInfoScreen from './src/screens/FullNotificationInfoScreen';
import SearchScreen from './src/screens/SearchScreen';
import AccidentScreen from './src/screens/AccidentScreen';
import BusDriverScreen from './src/screens/BusDriverScreen';

import type { Notification } from './src/types/Notification';

const Stack = createNativeStackNavigator<StackParamList>();

const isLoggedIn = false; //will be replace with google auth

export type StackParamList = {
  Login: undefined;
  Map: undefined;
  Notification: undefined;
  FullNotificationInfo: { notification: Notification };
  Search: undefined;
  Accident: undefined;
  BusDriver: undefined;
};

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isLoggedIn ? 'BusDriver' : 'Login'}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="FullNotificationInfo" component={FullNotificationInfoScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Accident" component={AccidentScreen} />
          <Stack.Screen name="BusDriver" component={BusDriverScreen} />

        </Stack.Navigator>
    </NavigationContainer>
  );
}
