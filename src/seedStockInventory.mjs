// seedStockInventory.mjs - For use with Node.js to seed stock inventory data into Firestore
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from 'fs';

// Check if service account key file exists and load it
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));
  console.log('✅ Service account key loaded successfully');
} catch (error) {
  console.error('❌ Error loading service account key:', error.message);
  console.log('\n📝 INSTRUCTIONS:');
  console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
  console.log('2. Click "Generate new private key"');
  console.log('3. Save the file as "serviceAccountKey.json" in the project root directory');
  console.log('4. Run this script again\n');
  process.exit(1);
}

// Initialize Firebase Admin
try {
  initializeApp({
    credential: cert(serviceAccount)
  });
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error);
  process.exit(1);
}

const db = getFirestore();

// Sample stock inventory data
const stockItems = [
  {
    itemCode: 'PTR-001',
    itemName: 'Fuel Filter',
    category: 'Filters',
    subCategory: 'Fuel System',
    description: 'High quality fuel filter for diesel engines',
    unit: 'Each',
    quantity: 25,
    reorderLevel: 10,
    cost: 450.00,
    vendor: 'AutoParts International',
    vendorId: 'VND001',
    location: 'Shelf A1-B3',
    lastRestocked: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    itemCode: 'PTR-002',
    itemName: 'Air Filter',
    category: 'Filters',
    subCategory: 'Air Intake',
    description: 'Heavy duty air filter for trucks',
    unit: 'Each',
    quantity: 18,
    reorderLevel: 8,
    cost: 350.00,
    vendor: 'Truck Spare Parts Ltd',
    vendorId: 'VND002',
    location: 'Shelf A1-B4',
    lastRestocked: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    itemCode: 'PTR-003',
    itemName: 'Oil Filter',
    category: 'Filters',
    subCategory: 'Lubrication',
    description: 'Premium engine oil filter',
    unit: 'Each',
    quantity: 30,
    reorderLevel: 15,
    cost: 275.00,
    vendor: 'AutoParts International',
    vendorId: 'VND001',
    location: 'Shelf A1-B5',
    lastRestocked: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    itemCode: 'PTR-004',
    itemName: 'Brake Pad Set',
    category: 'Braking System',
    subCategory: 'Friction',
    description: 'Front brake pad set for heavy duty trucks',
    unit: 'Set',
    quantity: 12,
    reorderLevel: 5,
    cost: 1250.00,
    vendor: 'AfriTech Auto Supplies',
    vendorId: 'VND003',
    location: 'Shelf B2-C1',
    lastRestocked: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    itemCode: 'PTR-005',
    itemName: 'Engine Oil',
    category: 'Fluids',
    subCategory: 'Engine Lubrication',
    description: '15W-40 diesel engine oil, 20L',
    unit: 'Container',
    quantity: 15,
    reorderLevel: 8,
    cost: 850.00,
    vendor: 'Global Truck Services',
    vendorId: 'VND004',
    location: 'Shelf C3-D2',
    lastRestocked: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    itemCode: 'PTR-006',
    itemName: 'Transmission Fluid',
    category: 'Fluids',
    subCategory: 'Transmission',
    description: 'Automatic transmission fluid, 5L',
    unit: 'Container',
    quantity: 20,
    reorderLevel: 10,
    cost: 450.00,
    vendor: 'Global Truck Services',
    vendorId: 'VND004',
    location: 'Shelf C3-D3',
    lastRestocked: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    itemCode: 'PTR-007',
    itemName: 'Windshield Wiper Blades',
    category: 'Exterior',
    subCategory: 'Visibility',
    description: '24" heavy duty wiper blades',
    unit: 'Pair',
    quantity: 24,
    reorderLevel: 12,
    cost: 180.00,
    vendor: 'AutoParts International',
    vendorId: 'VND001',
    location: 'Shelf D1-E2',
    lastRestocked: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    itemCode: 'PTR-008',
    itemName: 'Alternator',
    category: 'Electrical',
    subCategory: 'Charging System',
    description: '24V truck alternator, 150A',
    unit: 'Each',
    quantity: 5,
    reorderLevel: 2,
    cost: 3850.00,
    vendor: 'AfriTech Auto Supplies',
    vendorId: 'VND003',
    location: 'Shelf E3-F1',
    lastRestocked: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    itemCode: 'PTR-009',
    itemName: 'Truck Battery',
    category: 'Electrical',
    subCategory: 'Power',
    description: '12V truck battery, high capacity',
    unit: 'Each',
    quantity: 8,
    reorderLevel: 4,
    cost: 2200.00,
    vendor: 'Global Truck Services',
    vendorId: 'VND004',
    location: 'Shelf E3-F2',
    lastRestocked: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    itemCode: 'PTR-010',
    itemName: 'Drive Belt',
    category: 'Engine Components',
    subCategory: 'Belts',
    description: 'Serpentine belt for truck engines',
    unit: 'Each',
    quantity: 15,
    reorderLevel: 7,
    cost: 350.00,
    vendor: 'Truck Spare Parts Ltd',
    vendorId: 'VND002',
    location: 'Shelf F2-G1',
    lastRestocked: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    itemCode: 'PTR-011',
    itemName: 'Truck Tire 315/80R22.5',
    category: 'Tires',
    subCategory: 'Drive Axle',
    description: 'Premium drive axle truck tire',
    unit: 'Each',
    quantity: 12,
    reorderLevel: 6,
    cost: 5500.00,
    vendor: 'Premier Tire Suppliers',
    vendorId: 'VND005',
    location: 'Tire Rack A1',
    lastRestocked: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    itemCode: 'PTR-012',
    itemName: 'Truck Tire 385/65R22.5',
    category: 'Tires',
    subCategory: 'Steer Axle',
    description: 'Premium steer axle truck tire',
    unit: 'Each',
    quantity: 8,
    reorderLevel: 4,
    cost: 6200.00,
    vendor: 'Premier Tire Suppliers',
    vendorId: 'VND005',
    location: 'Tire Rack A2',
    lastRestocked: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Function to seed stock inventory to Firestore
async function seedStockInventory() {
  try {
    // Get a reference to the stockInventory collection
    const stockCollection = db.collection('stockInventory');
    
    // Create a batch
    const batch = db.batch();
    
    // Check if stock items already exist
    const existingItems = await stockCollection.get();
    if (!existingItems.empty) {
      console.log(`⚠️ ${existingItems.size} stock items already exist in the database.`);
      const shouldContinue = process.argv.includes('--force');
      if (!shouldContinue) {
        console.log('\n❓ To overwrite existing data, run with --force flag.');
        process.exit(0);
      } else {
        console.log('⚠️ --force flag detected. Proceeding to overwrite existing data...');
        // Delete existing items if --force is provided
        const deletePromises = existingItems.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);
        console.log('✅ Existing stock items deleted successfully.');
      }
    }
    
    // Add all stock items to batch
    for (const item of stockItems) {
      const docRef = stockCollection.doc(); // Auto-generate IDs
      batch.set(docRef, item);
    }
    
    // Commit the batch
    await batch.commit();
    
    console.log(`✅ Successfully seeded ${stockItems.length} stock items to Firestore.`);
  } catch (error) {
    console.error('❌ Error seeding stock inventory:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedStockInventory()
  .then(() => {
    console.log('✅ Stock inventory seeding complete.');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error during seeding process:', error);
    process.exit(1);
  });
