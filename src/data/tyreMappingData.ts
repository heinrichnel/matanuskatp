import type { TyreStore, StockEntry, StockEntryHistory } from '../types/tyre';
import { TyrePosition } from '../types/tyre';

// Raw mapping data dump from CSV
export interface TyreMappingRow {
  RegistrationNo: string;
  StoreName: string;
  TyrePosDescription: string;
  TyreCode: string;
}

export const mappingData: TyreMappingRow[] = [
  { RegistrationNo: 'AAX2987', StoreName: '15L', TyrePosDescription: 'V1', TyreCode: 'MAT0171' },
  { RegistrationNo: 'AAX2987', StoreName: '15L', TyrePosDescription: 'V2', TyreCode: 'MAT0172' },
  { RegistrationNo: 'AAX2987', StoreName: '15L', TyrePosDescription: 'V3', TyreCode: 'MAT0173' },
  { RegistrationNo: 'AAX2987', StoreName: '15L', TyrePosDescription: 'V4', TyreCode: 'MAT0174' },
  { RegistrationNo: 'AAX2987', StoreName: '15L', TyrePosDescription: 'SP', TyreCode: 'MAT0175' },
  // ... add remaining rows here
];

// Builds the initial VehicleTyreStore TyreStore object
export function buildVehicleTyreStore(): TyreStore {
  const entries: StockEntry[] = mappingData
    .filter(row => row.TyreCode && row.TyreCode.trim() !== '')
    .map(row => {
      const history: StockEntryHistory[] = [{
        event: 'mounted',
        toStore: 'VehicleTyreStore',
        vehicleReg: row.RegistrationNo,
        position: row.TyrePosDescription as TyrePosition,
        odometer: 0,
        date: new Date().toISOString(),
        user: 'system'
      }];
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

  return {
    id: 'VehicleTyreStore',
    name: 'Vehicle Tyre Store',
    entries
  };
}
