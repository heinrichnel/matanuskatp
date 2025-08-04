import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { DieselConsumptionRecord } from "../../types/diesel";
import { firestore } from "../core";

// Add diesel record to Firebase
export const addDieselToFirebase = async (dieselRecord: DieselConsumptionRecord) => {
  try {
    const dieselRef = doc(firestore, "diesel", dieselRecord.id);
    await setDoc(dieselRef, {
      ...dieselRecord,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Diesel record added with ID:", dieselRecord.id);
    return dieselRecord.id;
  } catch (error) {
    console.error("Error adding diesel record:", error);
    throw error;
  }
};

// Function to update a diesel record in Firebase
export async function updateDieselInFirebase(
  dieselId: string,
  dieselData: Partial<DieselConsumptionRecord>
) {
  try {
    const dieselRef = doc(firestore, "diesel", dieselId);
    await setDoc(
      dieselRef,
      {
        ...dieselData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log("Diesel record updated with ID:", dieselId);
    return dieselId;
  } catch (error) {
    console.error("Error updating diesel record:", error);
    throw error;
  }
}

// Function to delete a diesel record from Firebase
export async function deleteDieselFromFirebase(dieselId: string) {
  try {
    const dieselRef = doc(firestore, "diesel", dieselId);
    await deleteDoc(dieselRef);
    console.log("Diesel record deleted with ID:", dieselId);
    return dieselId;
  } catch (error) {
    console.error("Error deleting diesel record:", error);
    throw error;
  }
}
