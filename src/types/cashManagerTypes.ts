// Zimbabwe supplier expense item
export interface ZimbabweSupplierItem {
  id: string;
  supplier: string;
  description: string;
  ir: string;
  usd: number | null;
}

// Zimbabwe petty cash, tarps, and driver T&S
export interface ZimbabwePettyCashItem {
  id: string;
  description: string;
  usd: number | null;
}

// Diesel expense item
export interface DieselItem {
  id: string;
  supplier: string;
  qty: number | null;
  price: number | null;
  total: number | null;
}

// South Africa expense item
export interface SouthAfricaItem {
  id: string;
  supplier: string;
  description: string;
  ir: string;
  zar: number | null;
}

// Complete cash manager request form data
export interface CashManagerFormData {
  date: string;
  zimbabweSupplierItems: ZimbabweSupplierItem[];
  zimbabwePettyCashItems: ZimbabwePettyCashItem[];
  dieselItems: DieselItem[];
  southAfricaItems: SouthAfricaItem[];
  totalUSD: number;
  totalZAR: number;
}

// Default petty cash items
export const DEFAULT_PETTY_CASH_ITEMS: ZimbabwePettyCashItem[] = [
  { id: '1', description: 'Petty Cash', usd: 200 },
  { id: '2', description: 'Tarps and Services', usd: 60 },
  { id: '3', description: 'Driver T&S', usd: 150 }
];
