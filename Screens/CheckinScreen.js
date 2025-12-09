import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import { serverTimestamp } from "firebase/firestore";
const addCheckin = async () => ({ id: "test" });
const getCheckins = async () => [];

//import { addCheckin, getCheckins } from ../services/firebaseService-tempe";

export default function CheckInScreen() {
  const venueId = "gym1";
  const [occupancy, setOccupancy] = useState(0);
  const [loading, setLoading] = useState(false);

  async function loadOccupancy() {
    try {
      const events = await getCheckins(venueId);

      let count = 0;
      events.forEach(e => {
        if (e.type === "in") count++;
        if (e.type === "out") count--;
      });

      setOccupancy(count);
    } catch (error) {
      console.log("Error loading:", error);
    }
  }

  useEffect(() => {
    loadOccupancy();
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

      console.log("Saved:", docRef.id);
      Alert.alert("Success", `Checked ${type}`);
    } catch (error) {
      setOccupancy(prev => prev - change);
      Alert.alert("Error", "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
