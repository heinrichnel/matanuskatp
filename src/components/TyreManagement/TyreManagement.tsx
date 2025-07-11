import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'; // Fixed casing
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import TyreDashboard from './TyreDashboard'; // Updated to default import
import TyreInspectionForm from './TyreInspection'; // Replaced with TyreInspectionForm
import { TyreInventory } from './TyreInventory';
import { TyreReports } from './TyreReports';
import VehicleTyreView from './VehicleTyreView'; // Updated to default import

const TyreManagement: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tyre Management System</h2>
        <p className="text-gray-600">Comprehensive tyre tracking, maintenance, and analytics</p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="vehicle-view">Vehicle View</TabsTrigger>
          <TabsTrigger value="inspection">Inspection</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <TyreDashboard />
        </TabsContent>

        <TabsContent value="vehicle-view" className="space-y-4">
          <VehicleTyreView 
            selectedVehicle={selectedVehicle}
            onVehicleSelect={setSelectedVehicle}
          />
        </TabsContent>

        <TabsContent value="inspection" className="space-y-4">
          <TyreInspectionForm />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <TyreInventory />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <TyreReports />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Brand Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Michelin</div>
                <p className="text-xs text-muted-foreground">Top performing brand</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Tyre Life</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">95,000 km</div>
                <p className="text-xs text-muted-foreground">Fleet average</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cost per KM</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R 0.45</div>
                <p className="text-xs text-muted-foreground">Average across fleet</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TyreManagement;