import { db } from "../config/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  where,
  setDoc,
  deleteDoc
} from "firebase/firestore";

// -----------------------------
// Add a check-in or check-out
// -----------------------------
export async function addCheckin({ venueId, type, timestamp, method }) {
  return await addDoc(collection(db, "checkins"), {
    venueId,
    type,       // 'in' or 'out'
    timestamp,
    method      // e.g. "manual", "qr"
  });
}

// -----------------------------
// Get all checkins for a venue
// -----------------------------
export async function getCheckins(venueId, options = {}) {
  const ref = collection(db, "checkins");

  const q = query(
    ref,
    where("venueId", "==", venueId),
    orderBy("timestamp", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// -----------------------------
// Get venue details (capacity)
// -----------------------------
export async function getVenue(venueId) {
  const ref = doc(db, "venues", venueId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// -----------------------------
// Create or update venue
// -----------------------------
export async function setVenue(venueId, venueData) {
  const ref = doc(db, "venues", venueId);
  return await setDoc(ref, venueData, { merge: true });
}

// -----------------------------
// Delete wrong check-in entries
// -----------------------------
export async function deleteCheckin(id) {
  const ref = doc(db, "checkins", id);
  return await deleteDoc(ref);
}
