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

export async function addCheckin({ venueId, type, timestamp, method }) {
  return await addDoc(collection(db, "checkins"), {
    venueId,
    type,       
    timestamp,
    method     
  });
}

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

export async function getVenue(venueId) {
  const ref = doc(db, "venues", venueId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function setVenue(venueId, venueData) {
  const ref = doc(db, "venues", venueId);
  return await setDoc(ref, venueData, { merge: true });
}

export async function deleteCheckin(id) {
  const ref = doc(db, "checkins", id);
  return await deleteDoc(ref);
}
