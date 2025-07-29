import { useState, useEffect } from 'react';

interface ClientOption {
  label: string;
  value: string;
}

interface UseClientDropdownOptions {
  activeOnly?: boolean;
  sortBy?: 'client' | 'id';
  descending?: boolean;
}

export function useClientDropdown(options: UseClientDropdownOptions = {}) {
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock implementation - in a real app, this would fetch from your database
    const fetchClients = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data
        const mockClients = [
          { label: 'ABC Logistics', value: 'abc-logistics' },
          { label: 'XYZ Transport', value: 'xyz-transport' },
          { label: 'FastFreight Ltd', value: 'fastfreight' },
          { label: 'Global Shippers', value: 'global-shippers' },
          { label: 'Cargo Express', value: 'cargo-express' },
        ];

        let filteredClients = [...mockClients];

        // Apply filtering
        if (options.activeOnly) {
          // In real implementation, filter inactive clients
        }

        // Apply sorting
        if (options.sortBy) {
          filteredClients.sort((a, b) => {
            const compareVal = options.sortBy === 'client'
              ? a.label.localeCompare(b.label)
              : a.value.localeCompare(b.value);
            return options.descending ? -compareVal : compareVal;
          });
        }

        setClients(filteredClients);
        setError(null);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to load client data");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [options.activeOnly, options.sortBy, options.descending]);

  return { clients, loading, error };
}
