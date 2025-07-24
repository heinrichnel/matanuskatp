// seedFleet.mjs - For use with Node.js to seed fleet data into Firestore
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

// Fleet data
const fleetData = [



const stockInventory = [
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "14LHUB",
    SupplierPartNo: "",
    StockDescription: "14L HUB",
    StockCostPrice: 250.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "215/80R15C TYRES",
    SupplierPartNo: "",
    StockDescription: "215/80R15C TYRES",
    StockCostPrice: 146.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "24v",
    SupplierPartNo: "",
    StockDescription: "H1 24V HALOGEN",
    StockCostPrice: 2.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "24V 75/70W HALOGEN BULBS",
    SupplierPartNo: "",
    StockDescription: "24V 75/70W HALOGEN BULBS",
    StockCostPrice: 2.0,
    StockQty: 20.0,
    StockValue: 40.0,
    ReorderLevel: 8
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "27H OIL PUMP",
    SupplierPartNo: "",
    StockDescription: "OIL PUMP ASSEMBLY",
    StockCostPrice: 385.31,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "295s retread ",
    SupplierPartNo: "",
    StockDescription: "295s retread tyres",
    StockCostPrice: 96.88,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "385 STEER TYRES",
    SupplierPartNo: "",
    StockDescription: "NEW STEER TYRES 385",
    StockCostPrice: 247.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "5F BATTERY",
    SupplierPartNo: "",
    StockDescription: "5F BATTERY",
    StockCostPrice: 195.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "5L HEAD GASKET",
    SupplierPartNo: "",
    StockDescription: "5L HEAD GASKET",
    StockCostPrice: 35.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "5L Oil pressure switch",
    SupplierPartNo: "",
    StockDescription: "5L Oil pressure switch",
    StockCostPrice: 5.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "AIR0002",
    SupplierPartNo: "R3000430/23",
    StockDescription: "AIRFILTERS CARRIER UNITS",
    StockCostPrice: 24.29,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 4
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "AIRBAG",
    SupplierPartNo: "",
    StockDescription: "30K BPW AIRBAG",
    StockCostPrice: 150.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "Airbags",
    SupplierPartNo: "",
    StockDescription: "Airbags for JT62VYGP",
    StockCostPrice: 175.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "AIRC001",
    SupplierPartNo: "",
    StockDescription: "INNER AIR FILTER UD",
    StockCostPrice: 30.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "AIRC002",
    SupplierPartNo: "",
    StockDescription: "OUTER AIR FILTER UD",
    StockCostPrice: 70.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "ALLIGNMENT",
    SupplierPartNo: "",
    StockDescription: "Wheel Allignment",
    StockCostPrice: 80.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "Batteries",
    SupplierPartNo: "",
    StockDescription: "Batteries",
    StockCostPrice: 190.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "batteries- 4H",
    SupplierPartNo: "",
    StockDescription: "Batteries- 4H",
    StockCostPrice: 190.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "BOTTLE JACKS",
    SupplierPartNo: "",
    StockDescription: "30T BOTTLE JACKS",
    StockCostPrice: 65.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "brake drums-Serco trailers",
    SupplierPartNo: "",
    StockDescription: "Brake drums- Serco Fridge trailers",
    StockCostPrice: 160.0,
    StockQty: 6.0,
    StockValue: 960.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "Cab bushes",
    SupplierPartNo: "",
    StockDescription: "Cab bushes-6H",
    StockCostPrice: 55.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "CABLE TIES",
    SupplierPartNo: "",
    StockDescription: "CABLE TIES- 4 PACKS",
    StockCostPrice: 0.1,
    StockQty: 75.0,
    StockValue: 7.5,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "canter knuckles",
    SupplierPartNo: "",
    StockDescription: "Canter knuckles",
    StockCostPrice: 45.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "CFIL001",
    SupplierPartNo: "",
    StockDescription: "CANTER AIR FILTERS",
    StockCostPrice: 20.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "corner light",
    SupplierPartNo: "",
    StockDescription: "Corner light",
    StockCostPrice: 75.0,
    StockQty: 1.0,
    StockValue: 75.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "COUPON",
    SupplierPartNo: "",
    StockDescription: "COUPON BORDERS",
    StockCostPrice: 10.0,
    StockQty: 500.0,
    StockValue: 5000.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "crankshaft seal",
    SupplierPartNo: "",
    StockDescription: "Crakshaft seal for 27H",
    StockCostPrice: 145.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "DEGREASER",
    SupplierPartNo: "",
    StockDescription: "DEGREASER/LTR",
    StockCostPrice: 2.0,
    StockQty: 40.0,
    StockValue: 80.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "DOOR HANDLE",
    SupplierPartNo: "",
    StockDescription: "SHACMAN DOOR HANDLES",
    StockCostPrice: 28.48,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "DOU- 12V",
    SupplierPartNo: "",
    StockDescription: "12V DOUBLE CONTACT BULBS",
    StockCostPrice: 1.0,
    StockQty: 3.0,
    StockValue: 3.0,
    ReorderLevel: 8
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "Draglink ball joints",
    SupplierPartNo: "",
    StockDescription: "Draglink ball joints",
    StockCostPrice: 166.16,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "EXHS001",
    SupplierPartNo: "",
    StockDescription: "EXHAUST SILINCER",
    StockCostPrice: 678.5,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "FANB001",
    SupplierPartNo: "",
    StockDescription: "FAN BELT V5462 P477",
    StockCostPrice: 12.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "FBRP001",
    SupplierPartNo: "",
    StockDescription: "BRAKE PADS ISUZU",
    StockCostPrice: 10.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "FFUE004",
    SupplierPartNo: "",
    StockDescription: "Engine Oil",
    StockCostPrice: 2.91,
    StockQty: 235.0,
    StockValue: 681.5,
    ReorderLevel: 100
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "FFUE005",
    SupplierPartNo: "",
    StockDescription: "Gear oil- SAE 80W90",
    StockCostPrice: 4.15,
    StockQty: 869.0,
    StockValue: 3606.35,
    ReorderLevel: 100
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "FIL001",
    SupplierPartNo: "",
    StockDescription: "Volvo Gearbox Oil Filter",
    StockCostPrice: 11.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "Fire extinguishers",
    SupplierPartNo: "",
    StockDescription: "FIRE EXTINGUISHERS FOR TRAILERS",
    StockCostPrice: 66.7,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "FLAT WASHERS",
    SupplierPartNo: "",
    StockDescription: "FLAT WASHERS",
    StockCostPrice: 3.0,
    StockQty: 16.0,
    StockValue: 48.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "Flor brooms",
    SupplierPartNo: "",
    StockDescription: "Floor brooms",
    StockCostPrice: 5.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "FN008",
    SupplierPartNo: "FH12",
    StockDescription: "Volvo FH12 Fan Belt",
    StockCostPrice: 45.0,
    StockQty: 3.0,
    StockValue: 105.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "FN010",
    SupplierPartNo: "3681811",
    StockDescription: "Fan Belt",
    StockCostPrice: 7.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "FN012",
    SupplierPartNo: "P478",
    StockDescription: "Fan Belt",
    StockCostPrice: 5.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "FRONT CAB",
    SupplierPartNo: "",
    StockDescription: "FRONT CAB MOUNTING",
    StockCostPrice: 9.62,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "H/LAMP- 12V",
    SupplierPartNo: "",
    StockDescription: "12V 100/90W HEADLAMP BULBS",
    StockCostPrice: 2.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 8
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "HGSC001",
    SupplierPartNo: "",
    StockDescription: "HEAD GASKETS- SCANIA G460",
    StockCostPrice: 25.0,
    StockQty: 6.0,
    StockValue: 150.0,
    ReorderLevel: 5
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "HOSE CLAMPS",
    SupplierPartNo: "",
    StockDescription: "HOSE CLAMPS",
    StockCostPrice: 0.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "HSB002",
    SupplierPartNo: "",
    StockDescription: "Hacksaw blade sandflex",
    StockCostPrice: 3.14,
    StockQty: 2.0,
    StockValue: 6.28,
    ReorderLevel: 2
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "Idlier Arm",
    SupplierPartNo: "",
    StockDescription: "Idlier Arm",
    StockCostPrice: 40.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "Injector Oil seals",
    SupplierPartNo: "",
    StockDescription: "Injector Oil seals- UD95",
    StockCostPrice: 0.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "Inner Air filter",
    SupplierPartNo: "",
    StockDescription: "Inner Air filter",
    StockCostPrice: 121.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "INST001",
    SupplierPartNo: "",
    StockDescription: "Insulation Tape 18mm* 20m Red",
    StockCostPrice: 1.18,
    StockQty: 21.0,
    StockValue: 24.78,
    ReorderLevel: 4
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "Isuzu AIR filters",
    SupplierPartNo: "",
    StockDescription: "Air filters",
    StockCostPrice: 15.0,
    StockQty: 5.0,
    StockValue: 75.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "KLAM0001",
    SupplierPartNo: "",
    StockDescription: "TRUCK LAMB HOLDER",
    StockCostPrice: 19.7,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "KLDH0001",
    SupplierPartNo: "",
    StockDescription: "License Disc Holders-h5453",
    StockCostPrice: 5.0,
    StockQty: 3.0,
    StockValue: 0.15,
    ReorderLevel: 2
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "Large speed stickers",
    SupplierPartNo: "",
    StockDescription: "Maximum speed stickers- Large",
    StockCostPrice: 2.31,
    StockQty: 5.0,
    StockValue: 11.55,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "load sensing valve",
    SupplierPartNo: "",
    StockDescription: "Loading sensing valve",
    StockCostPrice: 120.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "Loading bars",
    SupplierPartNo: "",
    StockDescription: "Loading bars",
    StockCostPrice: 30.84,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "LSPR001",
    SupplierPartNo: "",
    StockDescription: "LEAF SPRING KB",
    StockCostPrice: 45.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "MOVING NUTS",
    SupplierPartNo: "",
    StockDescription: "MOVING NUTS- NEW REFEERS",
    StockCostPrice: 3.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "NUT LOCKS",
    SupplierPartNo: "",
    StockDescription: "NUT LOCKS",
    StockCostPrice: 0.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "Outer Air filter",
    SupplierPartNo: "",
    StockDescription: "Outer air filter",
    StockCostPrice: 146.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 0
  },
  {
    StoreName: "MUTARE DEPOT STOCK",
    StockCde: "PARK- 24V",
    SupplierPartNo: "",
    StockDescription: "24V PARLIGHT BULBS",
    StockCostPrice: 1.0,
    StockQty: 0.0,
    StockValue: 0.0,
    ReorderLevel: 8
  },
  
  

      async function seedFleet() {
  console.log(`🔄 Starting fleet data seeding process...`);
  console.log(`📊 Found ${fleetData.length} fleet vehicles to seed`);
  
  try {
    const batch = db.batch();
    let successCount = 0;
    let skipCount = 0;
    
    for (const vehicle of fleetData) {
      const docRef = db.collection('fleet').doc(vehicle.fleetNumber);
      
      // Check if document already exists to avoid duplicates
      const doc = await docRef.get();
      
      if (doc.exists) {
        console.log(`ℹ️ Fleet ${vehicle.fleetNumber} already exists, skipping...`);
        skipCount++;
        continue;
      }
      
      // Add vehicle data to batch
      batch.set(docRef, {
        ...vehicle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      successCount++;
    }
    
    // Commit the batch
    await batch.commit();
    
    console.log(`✅ Successfully seeded ${successCount} fleet vehicles to Firestore`);
    console.log(`ℹ️ Skipped ${skipCount} existing fleet vehicles`);
  } catch (error) {
    console.error('❌ Error seeding fleet data:', error);
  }
}

// Run the seeding function
seedFleet().then(() => {
  console.log('🏁 Fleet seeding process complete');
  process.exit(0);
}).catch(error => {
  console.error('❌ Unhandled error during fleet seeding:', error);
  process.exit(1);
});