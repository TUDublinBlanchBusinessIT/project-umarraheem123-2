import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { db } from "../config/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit
} from "firebase/firestore";

export default function HistoryScreen() {
  const venueId = "gym1";

  const [dailyTotals, setDailyTotals] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [peakHour, setPeakHour] = useState(null);
  const [totalVisits, setTotalVisits] = useState(0);
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => {
    loadDailyTotals();
    loadRecentEvents();
  }, []);

  function computePeakHour(events) {
    const hourly = {};
    events.forEach(e => {
      const hour = e.timestamp.toDate().getHours();
      hourly[hour] = (hourly[hour] || 0) + 1;
    });

    let bestHour = null;
    let max = 0;

    Object.keys(hourly).forEach(h => {
      if (hourly[h] > max) {
        max = hourly[h];
        bestHour = h;
      }
    });

    return { hour: bestHour, count: max };
  }

  async function loadDailyTotals() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const qRef = query(
        collection(db, "checkins"),
        where("venueId", "==", venueId),
        where("type", "==", "in"),
        where("timestamp", ">=", sevenDaysAgo),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(qRef);
      const events = snapshot.docs.map(d => d.data());

      const totals = {};
      events.forEach(e => {
        const date = e.timestamp.toDate().toISOString().split("T")[0];
        totals[date] = (totals[date] || 0) + 1;
      });

      const formatted = Object.keys(totals).map(date => ({
        date,
        count: totals[date]
      }));

      setDailyTotals(formatted);

      const peak = computePeakHour(events);
      setPeakHour(peak);

      setTotalVisits(events.length);

      if (peak.hour !== null) {
        if (peak.hour >= 17 && peak.hour <= 19) {
          setSuggestion("Peak hour is around 17:00–18:00. Consider promoting off-peak hours such as 9:00–11:00.");
        } else if (peak.hour >= 8 && peak.hour <= 11) {
          setSuggestion("Mornings are busy. Consider spacing sessions or promoting afternoon hours.");
        } else {
          setSuggestion("Traffic is steady. No major congestion detected this week.");
        }
      }

    } catch (err) {
      console.log("Error:", err);
    }
  }

  async function loadRecentEvents() {
    try {
      const qRef = query(
        collection(db, "checkins"),
        where("venueId", "==", venueId),
        orderBy("timestamp", "desc"),
        limit(100)
      );

      const snap = await getDocs(qRef);
      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setRecentEvents(list);
    } catch (err) {
      console.log("Error:", err);
    }
  }

  const renderDaily = ({ item }) => (
    <View style={{ padding: 12, marginBottom: 10, backgroundColor: "#eee", borderRadius: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.date}</Text>
      <Text style={{ fontSize: 16 }}>{item.count} check-ins</Text>
    </View>
  );

  const renderEvent = ({ item }) => (
    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: "#ccc" }}>
      <Text style={{ fontWeight: "bold" }}>
        {item.type === "in" ? "Check In" : "Check Out"}
      </Text>
      <Text>{item.timestamp?.toDate().toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>

      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 12 }}>
        Last 7 Days
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 20 }}>Total visits: {totalVisits}</Text>

        {peakHour && (
          <Text style={{ fontSize: 20 }}>
            Peak Hour: {peakHour.hour}:00 ({peakHour.count} visits)
          </Text>
        )}

        {suggestion !== "" && (
          <Text style={{ fontSize: 18, marginTop: 10 }}>{suggestion}</Text>
        )}
      </View>

      {dailyTotals.length === 0 ? (
        <Text>No recent check-ins.</Text>
      ) : (
        <FlatList
          data={dailyTotals}
          keyExtractor={(item) => item.date}
          renderItem={renderDaily}
        />
      )}

      <Text style={{ fontSize: 26, fontWeight: "bold", marginVertical: 20 }}>
        Recent Events
      </Text>

      <FlatList
        data={recentEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
      />

    </View>
  );
}
