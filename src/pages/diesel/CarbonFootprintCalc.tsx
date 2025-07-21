import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import { Leaf, Calculator, BarChart, Save } from 'lucide-react';
import Button from '../../components/ui/Button';

const CarbonFootprintCalc: React.FC = () => {
  const { isLoading } = useAppContext();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carbon Footprint Calculator</h1>
          <p className="text-gray-500 mt-1">Track and analyze fleet carbon emissions</p>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Total CO₂</h3>
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0.00 tonnes</div>
            <p className="text-xs text-gray-500 mt-1">Fleet emissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Per Vehicle</h3>
              <Leaf className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0.00 kg</div>
            <p className="text-xs text-gray-500 mt-1">Average per vehicle</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Per Kilometer</h3>
              <Leaf className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0.00 g/km</div>
            <p className="text-xs text-gray-500 mt-1">Fleet average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Emission Factors</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>Diesel</option>
                <option>Gasoline</option>
                <option>Biodiesel</option>
                <option>CNG</option>
                <option>LPG</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calculation Method</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>Fuel-Based</option>
                <option>Distance-Based</option>
                <option>Custom Factor</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Carbon Emission Trends</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <BarChart className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No emission data available</p>
            <p className="text-sm mt-2">Start tracking fuel consumption to calculate carbon emissions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonFootprintCalc;
