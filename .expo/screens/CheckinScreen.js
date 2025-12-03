import React from 'react';
import { View, Text } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { addCheckin } from "../services/firebaseService";



export default function CheckInScreen() {
    async function handleManualCheckin() {
        try {
          await addCheckin({
            venueId: "gym1",
            type: "in",
            timestamp: Date.now(),
            method: "manual"
          });
    
          alert("Check-In Saved!");
        } catch (error) {
          console.log("Error adding check-in:", error);
          alert("Failed to save check-in");
        }
      }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Check-In Screen</Text>
    </View>
  );
}
