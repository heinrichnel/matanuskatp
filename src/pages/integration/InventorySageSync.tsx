import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { importInventoryFromSage, updateInventoryInSage } from '../../api/sageIntegration';
import { InventoryItem } from '../../types/inventory';

const InventorySageSync: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'importing' | 'exporting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  
  // Mock data for demonstration
  useEffect(() => {
    // This would normally be a Firestore query
    setTimeout(() => {
      const mockItems: InventoryItem[] = [
        {
          id: '1',
          sageId: 'sage-inv-001',
          name: 'Brake Pads',
          code: 'BP-1001',
          quantity: 24,
          unitPrice: 45.99,
          category: 'Brakes',
          reorderLevel: 10,
          status: 'active'
        },
        {
          id: '2',
          name: 'Engine Oil Filter',
          code: 'OF-2002',
          quantity: 8,
          unitPrice: 12.50,
          category: 'Filters',
          reorderLevel: 15,
          status: 'active'
        },
        {
          id: '3',
          sageId: 'sage-inv-003',
          name: 'Headlight Assembly',
          code: 'HL-3003',
          quantity: 6,
          unitPrice: 89.95,
          category: 'Lighting',
          reorderLevel: 5,
          status: 'active'
        },
        {
          id: '4',
          name: 'Windshield Wipers',
          code: 'WW-4004',
          quantity: 3,
          unitPrice: 21.75,
          category: 'Exterior',
          reorderLevel: 8,
          status: 'active'
        },
        {
          id: '5',
          sageId: 'sage-inv-005',
          name: 'Air Filter',
          code: 'AF-5005',
          quantity: 12,
          unitPrice: 18.25,
          category: 'Filters',
          reorderLevel: 10,
          status: 'active'
        }
      ];
      
      setInventoryItems(mockItems);
      setFilteredItems(mockItems);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(mockItems.map(item => item.category))];
      setCategories(uniqueCategories);
    }, 1000);
  }, []);
  
  // Apply search and category filters
  useEffect(() => {
    let filtered = [...inventoryItems];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.code.toLowerCase().includes(term)
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, categoryFilter, inventoryItems]);
  
  const handleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };
  
  const handleImportFromSage = async () => {
    setSyncStatus('importing');
    setStatusMessage('Importing inventory items from Sage...');
    
    try {
      const importedItems = await importInventoryFromSage();
      
      setStatusMessage(`Successfully imported ${importedItems.length} items from Sage`);
      setSyncStatus('success');
      setLastSync(new Date());
      
      // Update inventory items with imported data
      // In a real app, this would be handled by Firestore listeners
      setInventoryItems(prev => {
        const updatedItems = [...prev];
        
        importedItems.forEach(importedItem => {
          const existingIndex = updatedItems.findIndex(item => 
            item.sageId === importedItem.sageId ||
            item.code === importedItem.code
          );
          
          if (existingIndex >= 0) {
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              ...importedItem
            };
          } else {
            updatedItems.push(importedItem);
          }
        });
        
        return updatedItems;
      });
      
    } catch (error) {
      console.error('Error importing from Sage:', error);
      setStatusMessage(`Error importing from Sage: ${(error as Error).message}`);
      setSyncStatus('error');
    }
  };
  
  const handleUpdateSage = async () => {
    if (selectedItems.length === 0) {
      setStatusMessage('No items selected for update');
      return;
    }
    
    setSyncStatus('exporting');
    setStatusMessage(`Updating ${selectedItems.length} items in Sage...`);
    
    try {
      const itemsToUpdate = selectedItems
        .map(id => inventoryItems.find(item => item.id === id))
        .filter(item => item && item.sageId) as InventoryItem[];
      
      if (itemsToUpdate.length === 0) {
        setStatusMessage('No selected items have Sage IDs to update');
        setSyncStatus('error');
        return;
      }
      
      const formattedItems = itemsToUpdate.map(item => ({
        sageId: item.sageId!,
        quantity: item.quantity
      }));
      
      const success = await updateInventoryInSage(formattedItems);
      
      if (success) {
        setStatusMessage(`Successfully updated ${itemsToUpdate.length} items in Sage`);
        setSyncStatus('success');
        setLastSync(new Date());
      } else {
        setStatusMessage('Failed to update items in Sage');
        setSyncStatus('error');
      }
      
    } catch (error) {
      console.error('Error updating Sage:', error);
      setStatusMessage(`Error updating Sage: ${(error as Error).message}`);
      setSyncStatus('error');
    }
  };
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventory & Sage Synchronization</h1>
          <p className="text-gray-600">Synchronize inventory items with Sage</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={handleImportFromSage}
            disabled={syncStatus === 'importing' || syncStatus === 'exporting'}
            isLoading={syncStatus === 'importing'}
          >
            Import from Sage
          </Button>
          <Button
            onClick={handleUpdateSage}
            disabled={selectedItems.length === 0 || syncStatus === 'importing' || syncStatus === 'exporting'}
            isLoading={syncStatus === 'exporting'}
          >
            Update Selected in Sage
          </Button>
        </div>
      </div>
      
      {/* Status Message */}
      {statusMessage && (
        <div className={`p-4 rounded-md ${
          syncStatus === 'error' ? 'bg-red-50 text-red-700' :
          syncStatus === 'success' ? 'bg-green-50 text-green-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          <p>{statusMessage}</p>
          {lastSync && syncStatus === 'success' && (
            <p className="text-sm mt-1">
              Last synced: {lastSync.toLocaleString()}
            </p>
          )}
        </div>
      )}
      
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="search"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by name or code"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="mt-1">
                <select
                  id="category"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-end">
              <div className="flex items-center h-10">
                <input
                  id="select-all"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={selectedItems.length > 0 && selectedItems.length === filteredItems.length}
                  onChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="ml-2 block text-sm text-gray-900">
                  {selectedItems.length > 0 && selectedItems.length === filteredItems.length
                    ? `All ${filteredItems.length} items selected`
                    : selectedItems.length > 0
                      ? `${selectedItems.length} of ${filteredItems.length} selected`
                      : 'Select all items'
                  }
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Inventory Items Table */}
      <Card>
        <CardHeader title="Inventory Items" />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedItems.length > 0 && selectedItems.length === filteredItems.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sage Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No items found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className={selectedItems.includes(item.id) ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {item.sageId ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                            Synced with Sage
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                            Not synced
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventorySageSync;