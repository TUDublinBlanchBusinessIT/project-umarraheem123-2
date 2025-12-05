import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 26, marginBottom: 30 }}>Home Screen</Text>

      <Button title="Go to Check-In" onPress={() => navigation.navigate('Checkin')} />
      <View style={{ height: 15 }} />
      <Button title="Go to History" onPress={() => navigation.navigate('History')} />
      <View style={{ height: 15 }} />
      <Button title="Go to Admin" onPress={() => navigation.navigate('Admin')} />
    </View>
  );
}
