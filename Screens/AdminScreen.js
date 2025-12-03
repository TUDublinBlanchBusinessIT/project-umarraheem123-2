import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminScreen() {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [notes, setNotes] = useState("");
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    loadVenues();
  }, []);

  async function loadVenues() {
    const snap = await getDocs(collection(db, "venues"));
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setVenues(list);
  }

  async function createVenue() {
    if (!name || !capacity) return;

    await addDoc(collection(db, "venues"), {
      name,
      capacity: Number(capacity),
      accessibilityNotes: notes,
      createdAt: new Date()
    });

    setName("");
    setCapacity("");
    setNotes("");

    loadVenues();
  }

  async function updateCapacity() {
    if (!selectedVenue) return;

    const ref = doc(db, "venues", selectedVenue.id);

    await updateDoc(ref, {
      capacity: Number(capacity)
    });

    loadVenues();
  }

  const renderVenue = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedVenue(item);
        setCapacity(String(item.capacity));
      }}
      style={{
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        backgroundColor: selectedVenue?.id === item.id ? "#e6f0ff" : "white"
      }}
    >
      <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
      <Text>Capacity: {item.capacity}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Create Venue</Text>

      <TextInput
        placeholder="Venue name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Capacity"
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Accessibility notes (optional)"
        value={notes}
        onChangeText={setNotes}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Button title="Create Venue" onPress={createVenue} />

      <Text style={{ fontSize: 24, marginVertical: 20 }}>Select Venue</Text>

      <FlatList
        data={venues}
        keyExtractor={(item) => item.id}
        renderItem={renderVenue}
      />

      {selectedVenue && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>
            Edit Capacity for {selectedVenue.name}
          </Text>

          <TextInput
            placeholder="New capacity"
            value={capacity}
            onChangeText={setCapacity}
            keyboardType="numeric"
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />

          <Button title="Update Capacity" onPress={updateCapacity} />
        </View>
      )}
    </View>
  );
}
