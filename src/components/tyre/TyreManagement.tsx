
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CircleDot, 
  AlertTriangle, 
  CheckCircle, 
  Gauge,
  Calendar,
  DollarSign,
  BarChart3,
  Plus
} from "lucide-react";
import { TireDashboard } from './TireDashboard';
import { TyreInspection } from './TireInspection';
import { TireInventory } from './TireInventory';
import { TireReports } from './TireReports';
import { VehicleTireView } from './VehicleTireView';

const TireManagement: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tire Management System</h2>
        <p className="text-gray-600">Comprehensive tire tracking, maintenance, and analytics</p>
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
          <TireDashboard />
        </TabsContent>

        <TabsContent value="vehicle-view" className="space-y-4">
          <VehicleTireView 
            selectedVehicle={selectedVehicle}
            onVehicleSelect={setSelectedVehicle}
          />
        </TabsContent>

        <TabsContent value="inspection" className="space-y-4">
          <TyreInspection />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <TireInventory />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <TireReports />
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
                <CardTitle className="text-sm font-medium">Average Tire Life</CardTitle>
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

export default TireManagement;