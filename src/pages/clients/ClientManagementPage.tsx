import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { 
  Users, 
  UserPlus, 
  ChartBar, 
  Building, 
  SearchIcon,
  UserCog,
  Network
} from 'lucide-react';
import Button from '../../components/ui/Button';
import ClientList from '../../components/CustomerManagement/ClientList';
import ClientDetail from '../../components/CustomerManagement/ClientDetail';
import ClientForm from '../../components/CustomerManagement/ClientForm';
import ClientRelationships from '../../components/CustomerManagement/ClientRelationships';
import ClientAnalytics from '../../components/CustomerManagement/ClientAnalytics';
import { useAppContext } from '../../context/AppContext';
import { Client, createNewClient } from '../../types/client';

const ClientManagementPage: React.FC = () => {
  const { clients, trips } = useAppContext();
  const [activeTab, setActiveTab] = useState('list');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRelationshipsModal, setShowRelationshipsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Select the first client if none is selected and clients exist
  useEffect(() => {
    if (!selectedClientId && clients.length > 0) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients, selectedClientId]);
  
  // Find the selected client
  const selectedClient = clients.find(client => client.id === selectedClientId);
  
  // Handle client selection
  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    
    // If we're not already on the detail tab, switch to it
    if (activeTab !== 'detail') {
      setActiveTab('detail');
    }
  };
  
  // Handle adding a new client
  const handleAddNewClient = () => {
    setShowAddModal(true);
  };
  
  // Handle editing the selected client
  const handleEditClient = () => {
    if (!selectedClientId) return;
    setShowEditModal(true);
  };
  
  // Handle managing client relationships
  const handleManageRelationships = () => {
    if (!selectedClientId) return;
    setShowRelationshipsModal(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Client Management</h1>
          <p className="text-gray-600">Manage and track client relationships and data</p>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search clients..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={onClick} icon={<UserPlus className="w-4 h-4" />}>
            Add Client
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Client List</span>
          </TabsTrigger>
          <TabsTrigger value="detail" className="flex items-center gap-2">
            <UserCog className="w-4 h-4" />
            <span>Client Details</span>
          </TabsTrigger>
          <TabsTrigger value="relationships" className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            <span>Client Relationships</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <ChartBar className="w-4 h-4" />
            <span>Client Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <ClientList 
            clients={clients}
            searchTerm={searchTerm}
            onSelectClient={handleSelectClient}
            onAddClient={handleAddNewClient}
          />
        </TabsContent>
        
        <TabsContent value="detail" className="mt-6">
          {selectedClient ? (
            <ClientDetail
              client={selectedClient}
              onEdit={handleEditClient}
              onManageRelationships={handleManageRelationships}
            />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Client Selected</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                Select a client from the client list to view their details, or add a new client to get started.
              </p>
              <div className="mt-6">
                <Button onClick={onClick} icon={<UserPlus className="w-4 h-4" />}>
                  Add New Client
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="relationships" className="mt-6">
          <ClientRelationships 
            clients={clients}
            selectedClientId={selectedClientId}
            onSelectClient={handleSelectClient}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <ClientAnalytics 
            clients={clients}
            trips={trips}
            selectedClientId={selectedClientId}
            onSelectClient={handleSelectClient}
          />
        </TabsContent>
      </Tabs>
      
      {/* Add Client Modal */}
      {showAddModal && (
        <ClientForm
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          initialValues={createNewClient()}
        />
      )}
      
      {/* Edit Client Modal */}
      {showEditModal && selectedClient && (
        <ClientForm
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          initialValues={selectedClient}
          isEditing={true}
        />
      )}
      
      {/* Client Relationships Modal */}
      {showRelationshipsModal && selectedClient && (
        <ClientRelationships
          isModal={true}
          isOpen={showRelationshipsModal}
          onClose={() => setShowRelationshipsModal(false)}
          clients={clients}
          selectedClientId={selectedClient.id}
          onSelectClient={handleSelectClient}
        />
      )}
    </div>
  );
};

export default ClientManagementPage;