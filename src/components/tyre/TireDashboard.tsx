import React, { useEffect, useState } from 'react';
import { Tyre } from '../../types/workshop-tyre-inventory';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import Button from '../ui/Button';
import { AlertTriangle, CheckCircle2, Filter, TrendingDown, ShoppingBag, Package } from 'lucide-react';
import LoadingIndicator from '../ui/LoadingIndicator';
import { Select, Input } from '../ui/FormElements';

// Import tire reference data and mock inventory
import {
  TYRE_REFERENCES,
  getUniqueTyreBrands,
  getUniqueTyrePatterns,
  getUniqueTyreSizes,
  getTyresByPosition,
  VENDORS,
  MOCK_INVENTORY,
  TyreInventoryItem,
  getInventoryItemsByCriteria
} from '../../utils/tyreConstants';

// Extended type for mock tire data that includes additional fields not in the standard Tyre interface
interface ExtendedTyre extends Omit<Tyre, 'purchaseDate' | 'loadIndex' | 'speedRating' | 'type' | 'cost' | 'supplier' | 'warranty' | 'retread'> {
  manufactureDate: string;
  lastInspection: string;
}

// Use the mock inventory data instead of static mock tires
const MOCK_TIRES = [
  {
    id: 'tire1',
    brand: 'Michelin',
    model: 'XZA2 Energy',
    size: '315/80R22.5',
    serialNumber: 'MX123456789',
    dotCode: 'DOT1234ABC1022',
    manufactureDate: new Date('2022-10-01').toISOString(),
    installDetails: {
      date: new Date('2023-01-15').toISOString(),
      position: 'front-left',
      vehicle: '21H',
      mileage: 120500,
    },
    treadDepth: 8.5, // mm
    pressure: 35, // PSI
    lastInspection: new Date('2023-05-10').toISOString(),
    status: 'good',
  },
  {
    id: 'tire2',
    brand: 'Bridgestone',
    model: 'R-Drive 001',
    size: '315/80R22.5',
    serialNumber: 'BS987654321',
    dotCode: 'DOT9876XYZ0522',
    manufactureDate: new Date('2022-05-15').toISOString(),
    installDetails: {
      date: new Date('2022-08-20').toISOString(),
      position: 'front-right',
      vehicle: '21H',
      mileage: 105200,
    },
    treadDepth: 5.2, // mm
    pressure: 34, // PSI
    lastInspection: new Date('2023-05-10').toISOString(),
    status: 'worn',
  },
  {
    id: 'tire3',
    brand: 'Continental',
    model: 'HDR2+',
    size: '315/80R22.5',
    serialNumber: 'CT543216789',
    dotCode: 'DOT5432ZYX0422',
    manufactureDate: new Date('2022-04-10').toISOString(),
    installDetails: {
      date: new Date('2022-07-05').toISOString(),
      position: 'drive-left-1',
      vehicle: '21H',
      mileage: 98700,
    },
    treadDepth: 2.8, // mm
    pressure: 32, // PSI
    lastInspection: new Date('2023-05-10').toISOString(),
    status: 'urgent',
  },
  {
    id: 'tire4',
    brand: 'Goodyear',
    model: 'KMAX S',
    size: '385/65R22.5',
    serialNumber: 'GY123987456',
    dotCode: 'DOT1239GYZ0322',
    manufactureDate: new Date('2022-03-20').toISOString(),
    installDetails: {
      date: new Date('2022-09-10').toISOString(),
      position: 'trailer-left-1',
      vehicle: '22H',
      mileage: 45600,
    },
    treadDepth: 7.2, // mm
    pressure: 36, // PSI
    lastInspection: new Date('2023-05-15').toISOString(),
    status: 'good',
  },
  {
    id: 'tire5',
    brand: 'Dunlop',
    model: 'SP346',
    size: '385/65R22.5',
    serialNumber: 'DL567891234',
    dotCode: 'DOT5678DLP0222',
    manufactureDate: new Date('2022-02-25').toISOString(),
    installDetails: {
      date: new Date('2022-06-15').toISOString(),
      position: 'trailer-right-1',
      vehicle: '22H',
      mileage: 32400,
    },
    treadDepth: 4.3, // mm
    pressure: 33, // PSI
    lastInspection: new Date('2023-05-15').toISOString(),
    status: 'worn',
  },
];

// Status statistics calculation
const calculateStatusStats = (tires: Tyre[]) => {
  const stats = {
    total: tires.length,
    good: 0,
    worn: 0,
    urgent: 0,
  };

  tires.forEach(tire => {
    if (tire.status === 'good') stats.good++;
    else if (tire.status === 'worn') stats.worn++;
    else if (tire.status === 'urgent') stats.urgent++;
  });

  return stats;
};

// Inventory stock levels calculation
const calculateInventoryStats = (inventory: TyreInventoryItem[]) => {
  return {
    total: inventory.reduce((sum, item) => sum + item.quantity, 0),
    items: inventory.length,
    lowStock: inventory.filter(item => item.quantity <= item.reorderLevel).length,
    outOfStock: inventory.filter(item => item.quantity === 0).length
  };
};

const TireDashboard: React.FC = () => {
  const [tires, setTires] = useState<Tyre[]>([]);
  const [inventory, setInventory] = useState<TyreInventoryItem[]>(MOCK_INVENTORY);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterActive, setFilterActive] = useState<boolean>(false);
  const [showInventory, setShowInventory] = useState<boolean>(false);

  // More detailed filter criteria
  const [filterCriteria, setFilterCriteria] = useState<{
    status?: string;
    vehicle?: string;
    size?: string;
    brand?: string;
    pattern?: string;
    position?: string;
  }>({});

  // Stats derived from the current filtered tire list
  const stats = calculateStatusStats(tires);
  const inventoryStats = calculateInventoryStats(inventory);

  // Load tires from Firestore (mocked for now)
  useEffect(() => {
    const fetchTires = async () => {
      setLoading(true);

      try {
        // This would normally be a Firestore query
        // const db = getFirestore();
        // const tiresCollection = collection(db, 'tires');
        // const tiresSnapshot = await getDocs(tiresCollection);
        // const tiresData = tiresSnapshot.docs.map(doc => ({
        //   id: doc.id,
        //   ...doc.data(),
        // })) as Tyre[];

        // For now, use mock data
        const tiresData = [...MOCK_TIRES];

        // Cast to unknown first, then to Tyre[] to avoid TypeScript errors with missing properties
        const filteredTires = applyFilters(tiresData as unknown as Tyre[], filterCriteria);

        setTires(filteredTires);

        // Filter inventory based on criteria if inventory view is active
        if (showInventory) {
          const filteredInventory = getInventoryItemsByCriteria(
            filterCriteria.brand,
            filterCriteria.size,
            filterCriteria.pattern
          );
          setInventory(filteredInventory);
        } else {
          setInventory(MOCK_INVENTORY);
        }
      } catch (error) {
        console.error('Error fetching tires:', error);
        // In production, would set an error state here
      } finally {
        setLoading(false);
      }
    };

    fetchTires();
  }, [filterCriteria, showInventory]); // Refetch when filter criteria or view changes

  // Apply filters to the tire data
  const applyFilters = (tires: Tyre[], criteria: any) => {
    return tires.filter(tire => {
      // Status filter
      if (criteria.status && tire.status !== criteria.status) {
        return false;
      }

      // Vehicle filter
      if (criteria.vehicle && tire.installDetails.vehicle !== criteria.vehicle) {
        return false;
      }

      // Size filter
      if (criteria.size && tire.size !== criteria.size) {
        return false;
      }

      // Brand filter
      if (criteria.brand && tire.brand !== criteria.brand) {
        return false;
      }

      // Pattern filter
      if (criteria.pattern && tire.pattern !== criteria.pattern) {
        return false;
      }

      // Position filter (partial match)
      if (criteria.position && !tire.installDetails.position.includes(criteria.position)) {
        return false;
      }

      return true;
    });
  };

  // Toggle views
  const toggleFilter = () => {
    setFilterActive(!filterActive);
  };

  const toggleInventoryView = () => {
    setShowInventory(!showInventory);
  };

  // Update a specific filter criterion
  const updateFilter = (key: string, value: string) => {
    setFilterCriteria(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterCriteria({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tyre Dashboard</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={toggleInventoryView}
            icon={<Package className="w-4 h-4" />}
          >
            {showInventory ? 'Show Active Tyres' : 'Show Inventory'}
          </Button>
          <Button
            variant="outline"
            onClick={toggleFilter}
            icon={<Filter className="w-4 h-4" />}
          >
            {filterActive ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {filterActive && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {showInventory ? (
              // Inventory-specific filters
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.brand || 'all'}
                    onChange={(e) => updateFilter('brand', e.target.value)}
                  >
                    <option value="all">All Brands</option>
                    {getUniqueTyreBrands().map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.size || 'all'}
                    onChange={(e) => updateFilter('size', e.target.value)}
                  >
                    <option value="all">All Sizes</option>
                    {getUniqueTyreSizes().map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                {filterCriteria.brand && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pattern
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={filterCriteria.pattern || 'all'}
                      onChange={(e) => updateFilter('pattern', e.target.value)}
                    >
                      <option value="all">All Patterns</option>
                      {TYRE_REFERENCES
                        .filter(ref => !filterCriteria.brand || ref.brand === filterCriteria.brand)
                        .map(ref => ref.pattern)
                        .filter((pattern, index, self) => pattern && self.indexOf(pattern) === index)
                        .map(pattern => (
                          <option key={pattern} value={pattern}>{pattern}</option>
                        ))
                      }
                    </select>
                  </div>
                )}
              </>
            ) : (
              // Active tires filters
              <>
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.status || 'all'}
                    onChange={(e) => updateFilter('status', e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="good">Good</option>
                    <option value="worn">Worn</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {/* Vehicle Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.vehicle || 'all'}
                    onChange={(e) => updateFilter('vehicle', e.target.value)}
                  >
                    <option value="all">All Vehicles</option>
                    <option value="21H">21H - Volvo FH16</option>
                    <option value="22H">22H - Afrit Side Tipper</option>
                    <option value="23H">23H - Mercedes Actros</option>
                  </select>
                </div>

                {/* Size Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.size || 'all'}
                    onChange={(e) => updateFilter('size', e.target.value)}
                  >
                    <option value="all">All Sizes</option>
                    {getUniqueTyreSizes().map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.brand || 'all'}
                    onChange={(e) => updateFilter('brand', e.target.value)}
                  >
                    <option value="all">All Brands</option>
                    {getUniqueTyreBrands().map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Position Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.position || 'all'}
                    onChange={(e) => updateFilter('position', e.target.value)}
                  >
                    <option value="all">All Positions</option>
                    <option value="front">Front</option>
                    <option value="drive">Drive</option>
                    <option value="trailer">Trailer</option>
                    <option value="left">Left Side</option>
                    <option value="right">Right Side</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              size="sm"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {showInventory ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium">Total Inventory</h3>
            <p className="text-3xl font-bold mt-2">{inventoryStats.total} units</p>
            <p className="text-sm text-gray-500 mt-1">
              {inventoryStats.items} different items
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium">Brands in Stock</h3>
            <p className="text-3xl font-bold mt-2">
              {new Set(inventory.map(item => item.brand)).size}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
            <h3 className="text-lg font-medium">Low Stock Items</h3>
            <p className="text-3xl font-bold mt-2 text-amber-600">{inventoryStats.lowStock}</p>
            <p className="text-sm text-gray-500 mt-1">
              Below reorder level
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <h3 className="text-lg font-medium">Out of Stock</h3>
            <p className="text-3xl font-bold mt-2 text-red-600">{inventoryStats.outOfStock}</p>
            <p className="text-sm text-gray-500 mt-1">
              Need immediate reordering
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium">Total Tyres</h3>
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <h3 className="text-lg font-medium">Good Condition</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">{stats.good}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.total > 0 ? Math.round((stats.good / stats.total) * 100) : 0}% of total
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
            <h3 className="text-lg font-medium">Worn</h3>
            <p className="text-3xl font-bold mt-2 text-amber-600">{stats.worn}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.total > 0 ? Math.round((stats.worn / stats.total) * 100) : 0}% of total
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <h3 className="text-lg font-medium">Urgent</h3>
            <p className="text-3xl font-bold mt-2 text-red-600">{stats.urgent}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.total > 0 ? Math.round((stats.urgent / stats.total) * 100) : 0}% of total
            </p>
          </div>
        </div>
      )}

      {/* Content Based on View */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <LoadingIndicator />
        </div>
      ) : showInventory ? (
        // Inventory View
        inventory.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">No inventory items match the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map(item => (
              <div
                key={item.id}
                className={`
                  bg-white p-5 rounded-lg shadow-sm border 
                  ${item.quantity === 0 ? 'border-red-300' :
                    item.quantity <= item.reorderLevel ? 'border-amber-300' : 'border-green-300'}
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{item.brand} {item.pattern}</h3>
                    <p className="text-sm text-gray-500">{item.size}</p>
                  </div>
                  <div
                    className={`
                      h-8 w-8 rounded-full flex items-center justify-center
                      ${item.quantity === 0 ? 'bg-red-100 text-red-600' :
                        item.quantity <= item.reorderLevel ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}
                    `}
                  >
                    {item.quantity === 0 ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : item.quantity <= item.reorderLevel ? (
                      <TrendingDown className="h-5 w-5" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5" />
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Stock Level</p>
                    <p className="text-xl font-bold">
                      {item.quantity} <span className="text-sm font-normal">units</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reorder Level</p>
                    <p className="text-sm font-medium">{item.reorderLevel} units</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Position Type</p>
                    <p className="text-sm font-medium capitalize">
                      {item.position}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cost per Unit</p>
                    <p className="text-sm font-medium">
                      ${item.cost.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500">Supplier</p>
                  <p className="text-sm font-medium">
                    {VENDORS.find(v => v.id === item.supplierId)?.name || 'Unknown'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={item.quantity === 0}
                  >
                    Use in Job Card
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    Reorder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // Tire Cards View
        tires.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">No tires match the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tires.map(tire => (
              <div
                key={tire.id}
                className={`
                  bg-white p-5 rounded-lg shadow-sm border 
                  ${tire.status === 'urgent' ? 'border-red-300' :
                    tire.status === 'worn' ? 'border-amber-300' : 'border-green-300'}
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{tire.brand} {tire.model}</h3>
                    <p className="text-sm text-gray-500">{tire.size}</p>
                  </div>
                  <div
                    className={`
                      h-8 w-8 rounded-full flex items-center justify-center
                      ${tire.status === 'urgent' ? 'bg-red-100 text-red-600' :
                        tire.status === 'worn' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}
                    `}
                  >
                    {tire.status === 'urgent' ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : tire.status === 'worn' ? (
                      <TrendingDown className="h-5 w-5" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5" />
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Serial Number</p>
                    <p className="text-sm font-medium">{tire.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">DOT Code</p>
                    <p className="text-sm font-medium">{tire.dotCode}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500">Vehicle</p>
                  <p className="text-sm font-medium">{tire.installDetails.vehicle}</p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Position</p>
                    <p className="text-sm font-medium capitalize">
                      {tire.installDetails.position.replace(/-/g, ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Install Date</p>
                    <p className="text-sm font-medium">
                      {new Date(tire.installDetails.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Tread Depth</p>
                    <p className={`text-sm font-medium ${tire.treadDepth < 3 ? 'text-red-600' : tire.treadDepth < 5 ? 'text-amber-600' : 'text-green-600'}`}>
                      {tire.treadDepth} mm
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pressure</p>
                    <p className="text-sm font-medium">
                      {tire.pressure} PSI
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Last Inspection</p>
                  <p className="text-sm">
                    {new Date((tire as any).lastInspection || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default TireDashboard;