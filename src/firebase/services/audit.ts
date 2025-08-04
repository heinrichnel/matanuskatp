import { addDoc, collection, deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { handleFirestoreError } from "../../utils/firebaseConnectionHandler";
import { firestore } from "../core";

// Add audit log function
export const addAuditLogToFirebase = async (auditLogData: any) => {
  try {
    const auditLogsRef = collection(firestore, "auditLogs");
    const docRef = await addDoc(auditLogsRef, {
      ...auditLogData,
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    console.log("Audit log added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding audit log:", error);
    await handleFirestoreError(error);
    throw error;
  }
};

// Add missed load to Firebase
export const addMissedLoadToFirebase = async (missedLoadData: any) => {
  try {
    const missedLoadsRef = collection(firestore, "missedLoads");
    const docRef = await addDoc(missedLoadsRef, {
      ...missedLoadData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Missed load added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding missed load:", error);
    throw error;
  }
};

// Function to delete a missed load from Firebase
export async function deleteMissedLoadFromFirebase(missedLoadId: string) {
  try {
    const missedLoadRef = doc(firestore, "missedLoads", missedLoadId);
    await deleteDoc(missedLoadRef);
    console.log("Missed load deleted with ID:", missedLoadId);
    return missedLoadId;
  } catch (error) {
    console.error("Error deleting missed load:", error);
    throw error;
  }
}

// Function to update a missed load in Firebase
export async function updateMissedLoadInFirebase(missedLoadId: string, missedLoadData: any) {
  try {
    const missedLoadRef = doc(firestore, "missedLoads", missedLoadId);
    await setDoc(
      missedLoadRef,
      {
        ...missedLoadData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log("Missed load updated with ID:", missedLoadId);
    return missedLoadId;
  } catch (error) {
    console.error("Error updating missed load:", error);
    throw error;
  }
}
