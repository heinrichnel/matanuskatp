import { useMemo } from "react";
import { toUIClient } from "../utils/clientMapper"; // Import the client mapper utility
import { useClients } from "./useClients"; // Import the useClients hook

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
