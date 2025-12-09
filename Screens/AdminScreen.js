import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../config/firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import * as Progress from "react-native-progress";

export default function AdminScreen() {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [notes, setNotes] = useState("");
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [occupancy, setOccupancy] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

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

  useEffect(() => {
    if (selectedVenue) loadOccupancy();
  }, [selectedVenue]);

  async function loadOccupancy() {
    const venueId = selectedVenue.id;

    const qRef = query(
      collection(db, "checkins"),
      where("venueId", "==", venueId),
      orderBy("timestamp", "desc")
    );

    const snap = await getDocs(qRef);

    const events = snap.docs
      .map(doc => doc.data())
      .filter(e => e.timestamp?.toDate);

    let countIn = 0;
    let countOut = 0;

    events.forEach(e => {
      if (e.type === "in") countIn++;
      if (e.type === "out") countOut++;
    });

    const occ = countIn - countOut;
    setOccupancy(occ);
    setShowWarning(occ >= selectedVenue.capacity);
  }

  const progressPercent = selectedVenue
    ? selectedVenue.capacity > 0
      ? occupancy / selectedVenue.capacity
      : 0
    : 0;

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
        backgroundColor: selectedVenue?.id === item.id ? "#e6f0ff" : "white",
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

          <View style={{ marginTop: 30, alignItems: "center" }}>
            <Text style={{ fontSize: 22, marginBottom: 10 }}>Current Occupancy</Text>

            <Progress.Bar
              progress={progressPercent}
              width={250}
              height={30}
            />

            <Text style={{ fontSize: 20, marginTop: 10 }}>
              {occupancy} / {selectedVenue.capacity}
            </Text>

            {showWarning && (
              <Text style={{ color: "red", fontSize: 18, marginTop: 10 }}>
                ⚠ Venue at full capacity!
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
