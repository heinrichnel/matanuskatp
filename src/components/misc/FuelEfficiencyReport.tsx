import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SyncIndicator from '../../components/ui/SyncIndicator';
import { BarChart2, Download, Filter, RefreshCw } from 'lucide-react';

const FuelEfficiencyReport: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Fuel Efficiency Reports</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
          >
            Export Data
          </Button>
          <Button
            variant="outline"
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
          <SyncIndicator />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Fleet Average</h3>
              <BarChart2 className="h-5 w-5 text-blue-500" />
            </div>
            <p className="mt-2 text-3xl font-bold">3.2 km/L</p>
            <p className="text-sm text-gray-500">Fleet-wide average consumption</p>
            <div className="mt-4 text-sm">
              <span className="text-green-500 font-medium">+0.2 km/L</span>
              <span className="text-gray-500"> vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Best Performer</h3>
              <BarChart2 className="h-5 w-5 text-green-500" />
            </div>
            <p className="mt-2 text-3xl font-bold">4.1 km/L</p>
            <p className="text-sm text-gray-500">MT-1002 (MAN TGX)</p>
            <div className="mt-4 text-sm">
              <span className="text-green-500 font-medium">28% better</span>
              <span className="text-gray-500"> than fleet average</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Needs Attention</h3>
              <BarChart2 className="h-5 w-5 text-red-500" />
            </div>
            <p className="mt-2 text-3xl font-bold">2.3 km/L</p>
            <p className="text-sm text-gray-500">MT-1008 (Volvo FH16)</p>
            <div className="mt-4 text-sm">
              <span className="text-red-500 font-medium">28% worse</span>
              <span className="text-gray-500"> than fleet average</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">Efficiency Comparison by Vehicle</h3>
          
          {/* This would be a chart in a real implementation */}
          <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center">
            <p className="text-gray-500">Bar chart showing km/L by vehicle would appear here</p>
            <p className="text-sm text-gray-400 mt-2">Using real data from Firestore in the actual implementation</p>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-md font-medium mb-2">Top 5 Most Efficient</h4>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fleet #</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average km/L</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">MT-1002</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">MAN TGX</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-green-600">4.1 km/L</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">MT-1005</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">Scania R450</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-green-600">3.9 km/L</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">MT-1007</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">MAN TGX</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-green-600">3.8 km/L</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">MT-1012</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">Volvo FH16</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-green-600">3.7 km/L</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">MT-1003</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">Mercedes Actros</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-green-600">3.6 km/L</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h4 className="text-md font-medium mb-2">5 Least Efficient</h4>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fleet #</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average km/L</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">MT-1008</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">Volvo FH16</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-red-600">2.3 km/L</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">MT-1015</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">DAF XF</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-red-600">2.5 km/L</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">MT-1009</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">Scania R450</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-red-600">2.7 km/L</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">MT-1011</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">MAN TGX</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-red-600">2.8 km/L</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">MT-1004</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">Mercedes Actros</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-red-600">2.9 km/L</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-4">Driver Impact on Fuel Efficiency</h3>
          
          {/* This would be a chart in a real implementation */}
          <div className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center">
            <p className="text-gray-500">Chart showing how driver behavior impacts fuel efficiency</p>
            <p className="text-sm text-gray-400 mt-2">Same vehicle driven by different drivers - efficiency comparison</p>
          </div>
          
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">Key Recommendations</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Investigate MT-1008 for possible mechanical issues</li>
              <li>Schedule maintenance check for the 5 least efficient vehicles</li>
              <li>Provide additional training to drivers of low-efficiency vehicles</li>
              <li>Implement driver incentive program based on fuel efficiency metrics</li>
              <li>Consider route optimization for long-haul trips</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FuelEfficiencyReport;
