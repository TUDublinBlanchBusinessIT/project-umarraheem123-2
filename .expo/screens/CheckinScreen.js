import React from 'react';
import { View, Text } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";


export default function CheckInScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Check-In Screen</Text>
    </View>
  );
}
