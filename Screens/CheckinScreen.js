import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { serverTimestamp } from "firebase/firestore";
import { addCheckin, getCheckinsByVenue } from "../services/firebaseService";

export default function CheckInScreen() {

  const venueId = "gym1"; 
  const [occupancy, setOccupancy] = useState(0); 
  const [loading, setLoading] = useState(false);

  const loadCheckins = async () => {
    try {
      const data = await getCheckinsByVenue(venueId);
      console.log("Loaded check-ins:", data);

      
      let count = 0;
      data.forEach(item => {
        if (item.type === "in") count++;
        if (item.type === "out") count--;
      });

      setOccupancy(count);
    } catch (error) {
      console.log("Error loading check-ins:", error);
    }
  };

  useEffect(() => {
    loadCheckins();
  }, []);

  async function handleCheck(type) {
    if (loading) return;

    setLoading(true);

    const change = type === "in" ? 1 : -1;
    setOccupancy(prev => prev + change);

    try {
      const docRef = await addCheckin({
        venueId,
        type,
        timestamp: serverTimestamp(),
        method: "manual"
      });

      console.log("Saved with ID:", docRef.id);
      Alert.alert("Success", `Checked ${type}!`);

    } catch (error) {
      console.error("Error saving check-in:", error);

      setOccupancy(prev => prev - change);

      Alert.alert("Error", "Failed to save check-in. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
      <Text style={{ fontSize: 30, marginBottom: 20 }}>
        Current Occupancy: {occupancy}
      </Text>

      <Button 
        title={loading ? "Saving..." : "CHECK IN"} 
        onPress={() => handleCheck("in")}
        disabled={loading}
      />

      <View style={{ height: 20 }} />

      <Button 
        title={loading ? "Saving..." : "CHECK OUT"} 
        onPress={() => handleCheck("out")}
        disabled={loading}
      />

    </View>
  );
}
