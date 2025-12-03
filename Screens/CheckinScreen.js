import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { addCheckin } from "../services/firebaseService";

export default function CheckInScreen() {

  const [loading, setLoading] = useState(false); 
  const handleCheckIn = async () => {
    try {
      setLoading(true); // optional: show loading state

      await addCheckin({
        venueId: "gym1",
        type: "in",
        timestamp: Date.now(),
        method: "manual"
      });

      alert("Check-in saved!");
    } catch (error) {
      alert("Error saving check-in: " + error.message);
    } finally {
      setLoading(false); // optional: end loading
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Check-In Screen</Text>

      <Button title={loading ? "Checking In..." : "Check In"} disabled={loading} onPress={handleCheckIn} />
    </View>
  );
}
