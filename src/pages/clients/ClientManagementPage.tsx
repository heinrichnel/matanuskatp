import { Button, Card, Layout, Typography } from "antd";
import {
  Building as BuildingOfficeIcon,
  Download,
  Edit,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import { useClients } from "../../hooks/useClients";
import { exportToCSV } from "../../utils/csvUtils";

// Types
import { CardContent, CardHeader } from "../../components/ui/Card";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { Input, Select } from "../../components/ui/FormElements";
import LoadingIndicator from "../../components/ui/LoadingIndicator";
import { UIClient, fromUIClient, toUIClient } from "../../utils/clientMapper";

const { Title } = Typography;
const { Content } = Layout;

const ClientManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { clients, loading, error, addClient, updateClient, deleteClient, fetchClients } =
    useClients();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<UIClient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterIsActive, setFilterIsActive] = useState(""); // 'true', 'false', ''

  // Convert API clients to UI clients
  const uiClients = useMemo(() => {
    return clients.map((client) => toUIClient(client));
  }, [clients]);

  // Memoize filtered clients for performance
  const filteredClients = useMemo(() => {
    let filtered = uiClients;

    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.client.toLowerCase().includes(lowerCaseSearch) ||
          client.contact?.toLowerCase().includes(lowerCaseSearch) ||
          client.email?.toLowerCase().includes(lowerCaseSearch) ||
          client.city?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    if (filterCity) {
      filtered = filtered.filter((client) => client.city === filterCity);
    }

    if (filterIsActive !== "") {
      const isActiveBool = filterIsActive === "true";
      filtered = filtered.filter((client) => (client.isActive ?? true) === isActiveBool);
    }

    return filtered;
  }, [uiClients, searchTerm, filterCity, filterIsActive]);

  // Get unique cities for filter dropdown
  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    uiClients.forEach((client) => {
      if (client.city) cities.add(client.city);
    });
    return Array.from(cities).sort();
  }, [uiClients]);

  const handleAddClient = (clientData: UIClient) => {
    const apiClient = fromUIClient(clientData);
    return addClient(apiClient);
  };

  const handleEditClient = (clientData: UIClient) => {
    const apiClient = fromUIClient(clientData);
    return updateClient(apiClient);
  };

  const handleDeleteClient = async (id: string) => {
    return await deleteClient(id);
  };

  const handleExport = () => {
    try {
      exportToCSV(filteredClients, "clients_export.csv");
    } catch (error) {
      console.error("Failed to export clients:", error);
      // Optionally show a toast/notification about the error
    }
  };

  return (
    <Content className="site-layout-background" style={{ padding: 24 }}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BuildingOfficeIcon className="w-6 h-6 mr-2 text-blue-600" />
            Client Management
          </h2>
          <div className="flex space-x-2">
            <Button type="default" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
              Export
            </Button>
            <Button
              type="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Client
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader title="Filter Clients" />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by name, contact, email, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  label="Search"
                />
              </div>

              <Select
                label="City"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                options={[
                  { label: "All Cities", value: "" },
                  ...uniqueCities.map((city) => ({ label: city, value: city })),
                ]}
              />

              <Select
                label="Status"
                value={filterIsActive}
                onChange={(e) => setFilterIsActive(e.target.value)}
                options={[
                  { label: "All Statuses", value: "" },
                  { label: "Active", value: "true" },
                  { label: "Inactive", value: "false" },
                ]}
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button
                type="default"
                size="small"
                onClick={() => {
                  setSearchTerm("");
                  setFilterCity("");
                  setFilterIsActive("");
                }}
                icon={<Filter className="w-3 h-3" />}
              >
                Clear Filters
              </Button>
              <Button
                type="default"
                size="small"
                onClick={fetchClients}
                icon={<RefreshCw className="w-3 h-3" />}
                className="ml-2"
              >
                Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading and Error States */}
        {loading && (
          <div className="bg-white p-8 rounded-lg shadow flex justify-center items-center">
            <LoadingIndicator />
            <span className="ml-3 text-gray-700">Loading clients...</span>
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        {/* Client Table */}
        {!loading && !error && (
          <Card>
            <CardHeader title={`Clients (${filteredClients.length})`} />
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Client Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contact
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        City
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {client.client}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {client.contact || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {client.email || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {client.city || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                                (client.isActive ?? true)
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {(client.isActive ?? true) ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button
                                size="small"
                                type="default"
                                icon={<Edit className="w-3 h-3" />}
                                onClick={() => setEditingClient(client)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="small"
                                danger
                                icon={<Trash2 className="w-3 h-3" />}
                                onClick={() => handleDeleteClient(client.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No clients found
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || filterCity || filterIsActive
                              ? "No clients match your filter criteria."
                              : "Get started by adding your first client."}
                          </p>
                          {!searchTerm && !filterCity && !filterIsActive && (
                            <div className="mt-6">
                              <Button
                                type="primary"
                                onClick={() => setIsAddModalOpen(true)}
                                icon={<Plus className="w-4 h-4" />}
                              >
                                Add Client
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dynamic import for ClientFormModal to be added later */}
      {/*
      <ClientFormModal
        isOpen={isAddModalOpen || editingClient !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingClient(null);
        }}
        editingClient={editingClient}
        onSave={(client) => {
          if (editingClient) {
            return handleEditClient(client);
          } else {
            return handleAddClient(client);
          }
        }}
      />
      */}
    </Content>
  );
};

export default ClientManagementPage;
