// Define CSV record types for typed access
interface CSVRecordObject {
  [key: string]: string | number | null | undefined;
  location?: string;
  tyreId?: string;
  description?: string;
  pattern?: string;
  quantity?: string | number;
  status?: string;
  axlePosition?: string;
  size?: string;
  model?: string;
  brand?: string;
  vehicleId?: string;
  registrationNumber?: string;
  price?: string | number;
  holdingBay?: string;
  expiryDate?: string;
  dateAdded?: string;
  mileage?: string;
}

type CSVRecordArray = (string | number | null | undefined)[];
type CSVRecord = CSVRecordObject | CSVRecordArray;

// Augment Firebase namespace
declare namespace firebase {
  export interface FirebaseService {
    importInventoryItems(items: any[]): Promise<{ success: boolean; count: number }>;
    getAllInventoryItems(): Promise<any[]>;
    getInventoryItemById(id: string): Promise<any>;
    updateInventoryItem(id: string, data: any): Promise<any>;
    deleteInventoryItem(id: string): Promise<any>;
  }
}

// Export the types so they can be used in other files
export type { CSVRecord, CSVRecordArray, CSVRecordObject };
