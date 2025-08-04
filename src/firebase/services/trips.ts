import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { Trip } from "../../types";
import { firestore } from "../core";
// import { handleFirestoreError } from "../../utils/firebaseConnectionHandler";

// Add trip to Firebase
export const addTripToFirebase = async (trip: Trip) => {
  try {
    const tripRef = doc(firestore, "trips", trip.id);
    await setDoc(tripRef, {
      ...trip,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Trip added with ID:", trip.id);
    return trip.id;
  } catch (error) {
    console.error("Error adding trip:", error);
    throw error;
  }
};

// Function to update a trip in Firebase
export async function updateTripInFirebase(tripId: string, tripData: Partial<Trip>) {
  const tripRef = doc(firestore, "trips", tripId);
  await setDoc(tripRef, { ...tripData, updatedAt: serverTimestamp() }, { merge: true });
}

// Function to delete a trip from Firebase
export async function deleteTripFromFirebase(tripId: string) {
  try {
    const tripRef = doc(firestore, "trips", tripId);
    await deleteDoc(tripRef);
    console.log("Trip deleted with ID:", tripId);
    return tripId;
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
}

// Firestore listener for real-time updates
export function listenToDriverBehaviorEvents(callback: (events: any[]) => void) {
  const eventsRef = collection(firestore, "driverBehaviorEvents");
  const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
    const events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(events);
  });
  return unsubscribe;
}
