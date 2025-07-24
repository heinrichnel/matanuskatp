import { useState, useEffect, createContext, useContext } from 'react';
import {
  listenToTyreStores,
  addTyreStore,
  updateTyreStoreEntry
} from '@/firebase/tyreStores';
import { TyreStore, StockEntry } from '@/types/tyre';

const TyreStoresContext = createContext<{
  stores: TyreStore[];
  addStore: (store: TyreStore) => Promise<void>;
  updateEntry: (storeId: string, entry: StockEntry) => Promise<void>;
}>({
  stores: [],
  addStore: async () => {},
  updateEntry: async () => {}
});

export function TyreStoresProvider({ children }) {
  const [stores, setStores] = useState<TyreStore[]>([]);

  useEffect(() => {
    const unsub = listenToTyreStores(setStores);
    return () => unsub();
  }, []);

  return (
    <TyreStoresContext.Provider
      value={{
        stores,
        addStore: addTyreStore,
        updateEntry: updateTyreStoreEntry
      }}
    >
      {children}
    </TyreStoresContext.Provider>
  );
}

export function useTyreStores() {
  return useContext(TyreStoresContext);
}
