// Firebase Admin SDK initialization
const admin = require('firebase-admin');

// Check if Firebase Admin is already initialized
let firebaseApp;
if (!admin.apps.length) {
  // Initialize with environment variables or service account
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } catch (error) {
      console.error('Error initializing Firebase with service account:', error);
      // Fall back to default app if service account fails
      firebaseApp = admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
    }
  } else {
    // Initialize with application default credentials
    firebaseApp = admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }
} else {
  firebaseApp = admin.app();
}

// Get Firestore instance
const db = admin.firestore(firebaseApp);

// Import inventory items to Firestore
const importInventoryItems = async (items) => {
  try {
    const batch = db.batch();
    const inventoryRef = db.collection('inventory');
    
    // Process each item in a batch
    items.forEach(item => {
      const docRef = item.id ? 
        inventoryRef.doc(item.id) : 
        inventoryRef.doc();
      
      batch.set(docRef, {
        ...item,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    // Commit the batch
    await batch.commit();
    
    return {
      success: true,
      count: items.length,
      message: `${items.length} inventory items imported successfully`
    };
  } catch (error) {
    console.error('Error importing inventory items:', error);
    throw error;
  }
};

// Get all inventory items
const getAllInventoryItems = async () => {
  try {
    const snapshot = await db.collection('inventory').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting inventory items:', error);
    throw error;
  }
};

// Get inventory item by ID
const getInventoryItemById = async (id) => {
  try {
    const doc = await db.collection('inventory').doc(id).get();
    if (!doc.exists) {
      throw new Error(`Inventory item with ID ${id} not found`);
    }
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error(`Error getting inventory item ${id}:`, error);
    throw error;
  }
};

// Update inventory item
const updateInventoryItem = async (id, data) => {
  try {
    await db.collection('inventory').doc(id).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return {
      success: true,
      message: `Inventory item ${id} updated successfully`
    };
  } catch (error) {
    console.error(`Error updating inventory item ${id}:`, error);
    throw error;
  }
};

// Delete inventory item
const deleteInventoryItem = async (id) => {
  try {
    await db.collection('inventory').doc(id).delete();
    return {
      success: true,
      message: `Inventory item ${id} deleted successfully`
    };
  } catch (error) {
    console.error(`Error deleting inventory item ${id}:`, error);
    throw error;
  }
};

module.exports = {
  db,
  admin,
  importInventoryItems,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem
};
