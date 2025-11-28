import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './Screens/HomeScreen';
import CheckinScreen from './Screens/CheckinScreen';
import HistoryScreen from './Screens/HistoryScreen';
import NewScreen from './Screens/NewScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Checkin" component={CheckinScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="New" component={NewScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
