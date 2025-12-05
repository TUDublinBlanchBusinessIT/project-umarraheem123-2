import React from 'react';
import { View, Text } from 'react-native';

import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "firebase/firestore";

import { db } from '../config/firebaseConfig';

export default function HistoryScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>History Screen</Text>
      <Text>Past check-ins will appear here</Text>
    </View>
  );
}
