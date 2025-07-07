import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Truck, 
  AlertTriangle, 
  CheckCircle, 
  Wrench,
  Search,
  Filter,
  Snowflake,
  Zap
} from "lucide-react";
import { 
  FLEET_VEHICLES, 
  getFleetStats, 
  searchVehicles, 
  filterVehicles,
  Vehicle 
} from "@/data/vehicles";

export const FleetDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [manufacturerFilter, setManufacturerFilter] = useState<string>('all');
  const [seriesFilter, setSeriesFilter] = useState<string>('all');

  const fleetStats = getFleetStats();

  const filteredVehicles = useMemo(() => {
    let vehicles = FLEET_VEHICLES;

    // Apply search
    if (searchQuery) {
      vehicles = searchVehicles(searchQuery);
    }

    // Apply filters
    const filters: any = {};
    if (statusFilter !== 'all') filters.status = [statusFilter as Vehicle['status']];
    if (typeFilter !== 'all') filters.type = [typeFilter as Vehicle['type']];
    if (manufacturerFilter !== 'all') filters.manufacturer = [manufacturerFilter];
    if (seriesFilter !== 'all') filters.series = [seriesFilter as Vehicle['series']];

    if (Object.keys(filters).length > 0) {
      vehicles = filterVehicles(filters);
    }

    return vehicles;
  }, [searchQuery, statusFilter, typeFilter, manufacturerFilter, seriesFilter]);

  const getStatusIcon = (status: Vehicle['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'maintenance': return <Wrench className="w-4 h-4 text-yellow-600" />;
      case 'out_of_service': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Truck className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: Vehicle['type']) => {
    switch (type) {
      case 'heavy_truck': return <Truck className="w-4 h-4 text-blue-600" />;
      case 'light_vehicle': return <Truck className="w-3 h-3 text-green-600" />;
      case 'trailer': return <Truck className="w-4 h-4 text-purple-600" />;
      case 'reefer': return <Snowflake className="w-4 h-4 text-cyan-600" />;
      case 'generator': return <Zap className="w-4 h-4 text-yellow-600" />;
      default: return <Truck className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setManufacturerFilter('all');
    setSeriesFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Fleet Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Fleet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStats.total}</div>
            <p className="text-xs text-muted-foreground">All vehicles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{fleetStats.active}</div>
            <p className="text-xs text-muted-foreground">Operational</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{fleetStats.maintenance}</div>
            <p className="text-xs text-muted-foreground">Under service</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{fleetStats.outOfService}</div>
            <p className="text-xs text-muted-foreground">Not operational</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Heavy Trucks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{fleetStats.byType.heavy_truck}</div>
            <p className="text-xs text-muted-foreground">H-series</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Fleet Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="out_of_service">Out of Service</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="heavy_truck">Heavy Truck</SelectItem>
                <SelectItem value="light_vehicle">Light Vehicle</SelectItem>
                <SelectItem value="trailer">Trailer</SelectItem>
                <SelectItem value="reefer">Reefer</SelectItem>
                <SelectItem value="generator">Generator</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={manufacturerFilter} onValueChange={setManufacturerFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Manufacturer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Manufacturers</SelectItem>
                <SelectItem value="SCANIA">SCANIA</SelectItem>
                <SelectItem value="SHACMAN">SHACMAN</SelectItem>
                <SelectItem value="ISUZU">ISUZU</SelectItem>
                <SelectItem value="SINOTRUK">SINOTRUK</SelectItem>
                <SelectItem value="SERCO">SERCO</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={seriesFilter} onValueChange={setSeriesFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Series" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Series</SelectItem>
                <SelectItem value="H">H-Series</SelectItem>
                <SelectItem value="L">L-Series</SelectItem>
                <SelectItem value="T">T-Series</SelectItem>
                <SelectItem value="F">F-Series</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Vehicles ({filteredVehicles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(vehicle.type)}
                      <span className="font-bold text-lg">{vehicle.fleetNo}</span>
                    </div>
                    <Badge className={getStatusBadgeColor(vehicle.status)}>
                      {vehicle.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Registration:</span>
                      <span className="ml-2 font-mono">{vehicle.registrationNo}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Vehicle:</span>
                      <span className="ml-2">{vehicle.manufacturer} {vehicle.model}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 capitalize">{vehicle.type.replace('_', ' ')}</span>
                    </div>
                    {vehicle.mileage && (
                      <div>
                        <span className="text-gray-500">Mileage:</span>
                        <span className="ml-2">{vehicle.mileage.toLocaleString()} km</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredVehicles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Truck className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No vehicles found matching your criteria</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};