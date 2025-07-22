import React from 'react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { ArrowRight, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import { useAppContext } from '../../context/AppContext';
import SyncIndicator from '../ui/SyncIndicator';

// This would typically come from Firestore
interface RouteOptimizationSuggestion {
  id: string;
  origin: string;
  destination: string;
  currentDistance: number;
  optimizedDistance: number;
  estimatedSavings: number;
}

const OptimizedRouteSuggestion: React.FC = () => {
  const { isLoading } = useAppContext();

  // Mock data - in a real implementation, this would be fetched from Firestore
  const optimizationSuggestions: RouteOptimizationSuggestion[] = [
    {
      id: 'RT-1001',
      origin: 'Windhoek',
      destination: 'Walvis Bay',
      currentDistance: 360,
      optimizedDistance: 318,
      estimatedSavings: 170
    },
    {
      id: 'RT-1002',
      origin: 'Otjiwarongo',
      destination: 'Rundu',
      currentDistance: 420,
      optimizedDistance: 370,
      estimatedSavings: 220
    },
    {
      id: 'RT-1003',
      origin: 'Swakopmund',
      destination: 'Lüderitz',
      currentDistance: 550,
      optimizedDistance: 490,
      estimatedSavings: 280
    },
    {
      id: 'RT-1004',
      origin: 'Keetmanshoop',
      destination: 'Mariental',
      currentDistance: 250,
      optimizedDistance: 230,
      estimatedSavings: 90
    },
    {
      id: 'RT-1005',
      origin: 'Windhoek',
      destination: 'Katima Mulilo',
      currentDistance: 890,
      optimizedDistance: 810,
      estimatedSavings: 420
    }
  ];

  const metricCards = [
    {
      title: 'Average Route Efficiency',
      value: '78%',
      trend: '+4.2% from last month',
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      color: 'blue'
    },
    {
      title: 'Avg. Delivery Time',
      value: '3.2 days',
      trend: '-0.5 days from baseline',
      icon: <Clock className="h-6 w-6 text-green-600" />,
      color: 'green'
    },
    {
      title: 'Optimization Opportunities',
      value: '12',
      trend: 'Est. saving: $4,320',
      icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
      color: 'yellow'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Route Optimization</h1>
          <p className="text-gray-600">Optimize routes to reduce costs and improve efficiency</p>
        </div>
        <div className="flex space-x-2 items-center">
          <SyncIndicator />
          <Button 
            icon={<TrendingUp className="w-4 h-4" />}
            disabled={isLoading?.trips}
          >
            Run Optimization
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 bg-${card.color}-100 rounded-full mr-4`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-green-600">{card.trend}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Routes to Optimize */}
      <Card>
        <CardHeader title="Routes Recommended for Optimization" />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Distance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Optimized Distance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Savings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {optimizationSuggestions.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{route.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {route.origin} <ArrowRight className="inline h-4 w-4 mx-1" /> {route.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.currentDistance} km</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.optimizedDistance} km</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${route.estimatedSavings}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        Apply
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedRouteSuggestion;
