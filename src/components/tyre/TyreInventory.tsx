import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { TIRE_BRANDS } from "@/data/tireData";
import { TyreInventoryStats } from "./tyre/TyreInventoryStats";
import { TyreInventoryFilters } from "./tyre/TyreInventoryFilters";

interface TireStock {
  id: string;
  brand: string;
  model: string;
  pattern: string;
  size: string;
  quantity: number;
  minStock: number;
  cost: number;
  supplier: string;
  location: string;
}

const SAMPLE_INVENTORY: TireStock[] = [
  {
    id: '1',
    brand: 'Michelin',
    model: 'X Line Energy D',
    pattern: 'Long Haul',
    size: '295/80R22.5',
    quantity: 12,
    minStock: 8,
    cost: 450,
    supplier: 'Tyre Pro Ltd',
    location: 'Warehouse A'
  },
  {
    id: '2',
    brand: 'Bridgestone',
    model: 'M788',
    pattern: 'Mixed Service',
    size: '295/80R22.5',
    quantity: 6,
    minStock: 10,
    cost: 420,
    supplier: 'Fleet Tyres Inc',
    location: 'Warehouse A'
  },
  {
    id: '3',
    brand: 'Continental',
    model: 'HDR2',
    pattern: 'Regional',
    size: '11R22.5',
    quantity: 15,
    minStock: 5,
    cost: 380,
    supplier: 'Continental Direct',
    location: 'Warehouse B'
  }
];

export const TireInventory: React.FC = () => {
  const [inventory] = useState<TireStock[]>(SAMPLE_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.size.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !brandFilter || item.brand === brandFilter;
    return matchesSearch && matchesBrand;
  });

  const getStockStatus = (item: TireStock) => {
    if (item.quantity <= item.minStock) return 'low';
    if (item.quantity <= item.minStock * 1.5) return 'warning';
    return 'good';
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Tyre Inventory Management</h3>
        <p className="text-gray-600">Track tyre stock levels, costs, and suppliers</p>
      </div>

      <TyreInventoryStats inventory={inventory} />

      <Card>
        <CardContent className="p-4">
          <TyreInventoryFilters
            searchTerm={searchTerm}
            brandFilter={brandFilter}
            onSearchChange={setSearchTerm}
            onBrandChange={setBrandFilter}
            onAddStock={() => console.log('Add stock clicked')}
            brands={TIRE_BRANDS}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredInventory.map(item => {
              const status = getStockStatus(item);
              return (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-semibold">{item.brand} {item.model}</h4>
                          <p className="text-sm text-gray-600">{item.pattern} - {item.size}</p>
                          <p className="text-xs text-gray-500">
                            Supplier: {item.supplier} | Location: {item.location}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <Badge className={getStockStatusColor(status)}>
                        {item.quantity} in stock
                      </Badge>
                      <div className="text-sm">
                        <div>R {item.cost} each</div>
                        <div className="text-xs text-gray-500">
                          Min: {item.minStock} | Value: R {(item.quantity * item.cost).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {status === 'low' && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Stock level is below minimum threshold
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};