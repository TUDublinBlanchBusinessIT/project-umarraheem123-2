import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>

      <Button title="Go to Check-In" onPress={() => navigation.navigate('Checkin')} />
      <Button title="Go to History" onPress={() => navigation.navigate('History')} />
      <Button title="Go to New" onPress={() => navigation.navigate('New')} />
    </View>
  );
}
