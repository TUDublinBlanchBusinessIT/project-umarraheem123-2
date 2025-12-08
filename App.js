import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './Screens/HomeScreen';
import CheckinScreen from './Screens/CheckinScreen';
import HistoryScreen from './Screens/HistoryScreen';
import AdminScreen from './Screens/AdminScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>

        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: "Home" }}
        />

        <Stack.Screen 
          name="Checkin" 
          component={CheckinScreen} 
          options={{ title: "Check-In" }}
        />

        <Stack.Screen 
          name="History" 
          component={HistoryScreen} 
          options={{ title: "History" }}
        />

        <Stack.Screen 
          name="Admin" 
          component={AdminScreen} 
          options={{ title: "Admin Panel" }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
