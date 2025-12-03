import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";

export default function HistoryScreen() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
      
        const q = query(
          collection(db, "checkins"),
          orderBy("timestamp", "desc"),
          limit(100)
        );

        const snapshot = await getDocs(q);

        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setEvents(list);
      } catch (err) {
        console.log("Error loading events:", err);
      }
    };

    loadEvents();
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <Text style={{ fontWeight: 'bold' }}>
        {item.type === "in" ? "In" : "Out"}
      </Text>
      <Text>
        {item.timestamp?.toDate().toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
