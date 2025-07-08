import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../src/utils/firebaseConnectionHandler';
import type { TyreStore, StockEntry, StockEntryHistory } from '../src/types/tyre';
import { TyrePosition } from '../src/types/tyre';

// Mapping data dump (RegistrationNo, StoreName, TyrePosDescription, TyreCode)
const mappingData = [
  { RegistrationNo: 'AAX2987', StoreName: '15L', TyrePosDescription: 'V1', TyreCode: 'MAT0171' },
  { RegistrationNo: 'AAX2987', StoreName: '15L', TyrePosDescription: 'V2', TyreCode: 'MAT0172' },
  { RegistrationNo: 'AAX2987', StoreName: '15L', TyrePosDescription: 'V3', TyreCode: 'MAT0173' },
  { RegistrationNo: 'AAX2987', StoreName: '15L', TyrePosDescription: 'V4', TyreCode: 'MAT0174' },
  { RegistrationNo: 'AAX2987', StoreName: '15L', TyrePosDescription: 'SP', TyreCode: 'MAT0175' },
  // ...continue for all rows from your dump
];

// Build initial StockEntry[]
const initialEntries: StockEntry[] = mappingData
  .filter(row => row.TyreCode && row.TyreCode.trim() !== '')
  .map(row => {
    const history: StockEntryHistory[] = [
      {
        event: 'mounted',
        toStore: 'VehicleTyreStore',
        vehicleReg: row.RegistrationNo,
        position: row.TyrePosDescription as TyrePosition,
        odometer: 0,
        date: new Date().toISOString(),
        user: 'system'
      }
    ];

    return {
      tyreId: row.TyreCode,
      brand: '',
      pattern: '',
      size: '',
      type: row.StoreName,
      vehicleReg: row.RegistrationNo,
      position: row.TyrePosDescription as TyrePosition,
      currentTreadDepth: 0,
      lastMountOdometer: 0,
      currentOdometer: 0,
      kmCovered: 0,
      status: 'active',
      history
    };
  });

// TyreStore document
const storeDoc: TyreStore = {
  id: 'VehicleTyreStore',
  name: 'Vehicle Tyre Store',
  entries: initialEntries
};

async function seed() {
  const ref = doc(firestore, 'tyreStores', storeDoc.id);
  await setDoc(ref, {
    ...storeDoc,
    dateAdded: serverTimestamp()
  });
  console.log(`Seeded ${initialEntries.length} tyres into VehicleTyreStore`);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
