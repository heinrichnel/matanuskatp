// Firestore utility functions for Workshop, Tyre, and Inventory modules
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

// Generic Firestore CRUD with merge: true
export async function createOrUpdateDoc(collectionName: string, id: string, data: any) {
    const db = getFirestore();
    const ref = doc(db, collectionName, id);
    await setDoc(ref, data, { merge: true });
}

export async function getDocById(collectionName: string, id: string) {
    const db = getFirestore();
    const ref = doc(db, collectionName, id);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
}

export async function addDocToCollection(collectionName: string, data: any) {
    const db = getFirestore();
    const ref = collection(db, collectionName);
    return await addDoc(ref, data);
}

export async function queryCollection(collectionName: string, field: string, value: any) {
    const db = getFirestore();
    const ref = collection(db, collectionName);
    const q = query(ref, where(field, '==', value));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
