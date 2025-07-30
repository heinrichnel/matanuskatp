// src/hooks/useClients.ts
import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { db } from '../firebase'; // Your Firestore instance
import { Client } from '../types/client'; // Your Client interface
import { useToast } from './useToast'; // Your custom toast hook
import { handleError, ErrorCategory } from '../utils/errorHandling'; // Your global error handling

interface UseClientsOptions {
  activeOnly?: boolean;
  sortBy?: 'client' | 'createdAt'; // Assuming 'client' (name) or 'createdAt' for sorting
  descending?: boolean;
}

/**
 * Custom hook for managing client data with Firestore integration.
 * Provides real-time data (via onSnapshot if implemented) and CRUD operations.
 */
import { useMemo } from "react";
import { toUIClient } from "../utils/clientMapper"; // Import the client mapper utility

export interface ClientOption {
  label: string;
  value: string;
}

export interface UseClientDropdownOptions {
  activeOnly?: boolean;
  sortBy?: "client" | "createdAt";
  descending?: boolean;
}

/**
 * Custom hook to fetch and format client data specifically for dropdowns.
 * Uses the useClients hook for data fetching and clientMapper for type conversion.
 */
export function useClientDropdown(options: UseClientDropdownOptions = {}) {
  // Use the useClients hook to get the raw client data, loading, and error states
  const { clients: rawClients, loading, error } = useClients(options);

  // Memoize the transformation to dropdown options
  const clients = useMemo(() => {
    // Convert API Client objects to UIClient objects, then map to ClientOption format
    return rawClients.map((client) => {
      const uiClient = toUIClient(client);
      return {
        label: uiClient.client, // Use the client name from UIClient
        value: uiClient.id, // Use the ID for the value
      };
    });
  }, [rawClients]); // Re-calculate only when rawClients change

  return { clients, loading, error };
}

export function useClients(options: UseClientsOptions = {}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const clientsCollectionRef = collection(db, 'clients');

  // Function to fetch clients from Firestore
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let q = query(clientsCollectionRef);

      // Apply activeOnly filter if specified
      if (options.activeOnly) {
        q = query(q, where('isActive', '==', true));
      }

      // Apply sorting
      if (options.sortBy) {
        q = query(q, orderBy(options.sortBy, options.descending ? 'desc' : 'asc'));
      } else {
        // Default sort if no sortBy is provided
        q = query(q, orderBy('client', 'asc'));
      }

      const querySnapshot = await getDocs(q);
      const fetchedClients: Client[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id
        } as Client;
      });
      setClients(fetchedClients);
    } catch (err) {
      console.error("Error fetching clients:", err);
      const errorMessage = 'Failed to load client data. Please try again.';
      setError(errorMessage);
      handleError(() => Promise.reject(err), {
        category: ErrorCategory.DATABASE,
        context: {
          component: 'useClients',
          operation: 'fetchClients',
          errorMessage: errorMessage
        }
      });
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [options.activeOnly, options.sortBy, options.descending, clientsCollectionRef, showToast]);

  // Effect to fetch data on mount and when options change
  useEffect(() => {
    fetchClients();
    // TODO: Implement onSnapshot for real-time updates if needed for this hook
    // const unsubscribe = onSnapshot(q, (snapshot) => { ... }); return unsubscribe;
  }, [fetchClients]);

  // CRUD Operations
  const addClient = useCallback(async (clientData: Omit<Client, 'id'>): Promise<void> => {
    try {
      const newClientRef = await addDoc(clientsCollectionRef, {
        ...clientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true // Default for new clients
      });
      showToast('Client added successfully!', 'success');
      await fetchClients(); // Re-fetch to update local state
    } catch (err) {
      console.error("Error adding client:", err);
      const errorMessage = 'Failed to add client. Please try again.';
      showToast(errorMessage, 'error');
      handleError(() => Promise.reject(err), {
        category: ErrorCategory.DATABASE,
        context: {
          component: 'useClients',
          operation: 'addClient',
          errorMessage: errorMessage
        }
      });
      throw err; // Re-throw to allow component to handle loading/error state
    }
  }, [clientsCollectionRef, fetchClients, showToast]);

  const updateClient = useCallback(async (clientData: Client): Promise<void> => {
    if (!clientData.id) {
      showToast('Client ID is missing for update.', 'error');
      throw new Error('Client ID missing for update');
    }
    try {
      const clientDocRef = doc(clientsCollectionRef, clientData.id);
      await updateDoc(clientDocRef, {
        ...clientData,
        updatedAt: new Date().toISOString()
      });
      showToast('Client updated successfully!', 'success');
      await fetchClients(); // Re-fetch to update local state
    } catch (err) {
      console.error("Error updating client:", err);
      const errorMessage = 'Failed to update client. Please try again.';
      showToast(errorMessage, 'error');
      handleError(() => Promise.reject(err), {
        category: ErrorCategory.DATABASE,
        context: {
          component: 'useClients',
          operation: 'updateClient',
          errorMessage: errorMessage
        }
      });
      throw err;
    }
  }, [clientsCollectionRef, fetchClients, showToast]);

  const deleteClient = useCallback(async (id: string): Promise<void> => {
    try {
      const clientDocRef = doc(clientsCollectionRef, id);
      await deleteDoc(clientDocRef);
      showToast('Client deleted successfully!', 'success');
      await fetchClients(); // Re-fetch to update local state
    } catch (err) {
      console.error("Error deleting client:", err);
      const errorMessage = 'Failed to delete client. Please try again.';
      showToast(errorMessage, 'error');
      handleError(() => Promise.reject(err), {
        category: ErrorCategory.DATABASE,
        context: {
          component: 'useClients',
          operation: 'deleteClient',
          errorMessage: errorMessage
        }
      });
      throw err;
    }
  }, [clientsCollectionRef, fetchClients, showToast]);

  return { clients, loading, error, addClient, updateClient, deleteClient, fetchClients };
}
