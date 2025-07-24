// seedVendors.mjs - For use with Node.js to seed vendor data into Firestore
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

// Sample vendor data
const vendors = [
  {
    vendorId: 'VND001',
    vendorName: 'AutoParts International',
    contactPerson: 'John Smith',
    workEmail: 'john.smith@autoparts.com',
    mobile: '+27811234567',
    address: '123 Main Street, Industrial Park',
    city: 'Johannesburg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    vendorId: 'VND002',
    vendorName: 'Truck Spare Parts Ltd',
    contactPerson: 'Mary Johnson',
    workEmail: 'mary@truckspares.co.za',
    mobile: '+27821234567',
    address: '456 Commercial Road',
    city: 'Cape Town',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    vendorId: 'VND003',
    vendorName: 'AfriTech Auto Supplies',
    contactPerson: 'David Moyo',
    workEmail: 'david@afritech.co.zw',
    mobile: '+263771234567',
    address: '789 Industrial Way',
    city: 'Harare',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    vendorId: 'VND004',
    vendorName: 'Global Truck Services',
    contactPerson: 'Sarah Williams',
    workEmail: 'sarah@globaltrucks.com',
    mobile: '+27831234567',
    address: '101 Transport Avenue',
    city: 'Durban',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    vendorId: 'VND005',
    vendorName: 'Premier Tire Suppliers',
    contactPerson: 'Michael Brown',
    workEmail: 'michael@premiertires.com',
    mobile: '+27841234567',
    address: '202 Rubber Road',
    city: 'Pretoria',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Function to seed vendors to Firestore
async function seedVendors() {
  try {
    // Get a reference to the vendors collection
    const vendorsCollection = db.collection('vendors');
    
    // Create a batch
    const batch = db.batch();
    
    // Check if vendors already exist
    const existingVendors = await vendorsCollection.get();
    if (!existingVendors.empty) {
      console.log(`⚠️ ${existingVendors.size} vendors already exist in the database.`);
      const shouldContinue = process.argv.includes('--force');
      if (!shouldContinue) {
        console.log('\n❓ To overwrite existing data, run with --force flag.');
        process.exit(0);
      } else {
        console.log('⚠️ --force flag detected. Proceeding to overwrite existing data...');
        // Delete existing vendors if --force is provided
        const deletePromises = existingVendors.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);
        console.log('✅ Existing vendors deleted successfully.');
      }
    }
    
    // Add all vendors to batch
    for (const vendor of vendors) {
      const docRef = vendorsCollection.doc(); // Auto-generate IDs
      batch.set(docRef, vendor);
    }
    
    // Commit the batch
    await batch.commit();
    
    console.log(`✅ Successfully seeded ${vendors.length} vendors to Firestore.`);
  } catch (error) {
    console.error('❌ Error seeding vendors:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedVendors()
  .then(() => {
    console.log('✅ Vendor seeding complete.');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error during seeding process:', error);
    process.exit(1);
  });
