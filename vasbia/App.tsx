import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from "./src/screens/LoginScreen";
import MapScreen from "./src/screens/MapScreen";

const Stack = createNativeStackNavigator<StackParamList>();

const isLoggedIn = false; //will be replace with google auth

export type StackParamList = {
  Login: undefined;
  Map: undefined;
  //Search: undefined;
  //Notification: undefined;
};

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isLoggedIn ? "Map" : "Login"}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
