import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import * as Progress from "react-native-progress";

export default function AdminScreen() {

  const [occupancy, setOccupancy] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const capacity = 80; // 🔥 Set your max capacity here

  useEffect(() => {
    loadOccupancy();
  }, []);

  async function loadOccupancy() {
    const venueId = "gym1";

    try {
      const q = query(
        collection(db, "checkins"),
        where("venueId", "==", venueId),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(q);
      const events = snapshot.docs.map(doc => doc.data());

      let countIn = 0;
      let countOut = 0;

      events.forEach(e => {
        if (e.type === "in") countIn++;
        if (e.type === "out") countOut++;
      });

      const occ = countIn - countOut;
      setOccupancy(occ);

      if (occ >= capacity) setShowWarning(true);
      else setShowWarning(false);

    } catch (err) {
      console.log("Error loading occupancy:", err);
    }
  }

  const percentage = (occupancy / capacity);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

      <Text style={{ fontSize: 32, marginBottom: 10 }}>
        Current Occupancy
      </Text>

      {/* Big progress bar */}
      <Progress.Bar 
        progress={percentage}
        width={250}
        height={30}
        color={percentage >= 1 ? "red" : "green"}
      />

      <Text style={{ fontSize: 22, marginTop: 20 }}>
        {occupancy} / {capacity}
      </Text>

      {showWarning && (
        <Text style={{ color: "red", fontSize: 20, marginTop: 10 }}>
          ⚠ Venue at full capacity!
        </Text>
      )}

    </View>
  );
}
