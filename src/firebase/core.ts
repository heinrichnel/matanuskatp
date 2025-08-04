import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseApp } from "../firebaseConfig";

// Initialize core Firebase services
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// Export the database as both firestore and db for backward compatibility
export { firebaseApp, firestore, storage };
export const db = firestore;
