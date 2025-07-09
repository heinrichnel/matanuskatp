import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// Define types
interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'financial' | 'operational' | 'customer' | 'compliance';
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastUpdated: Timestamp;
}

interface KPITimeSeriesData {
  date: Timestamp;
  value: number;
}

interface KPITimeSeries {
  kpiId: string;
  kpiName: string;
  data: KPITimeSeriesData[];
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const KPIOverview: React.FC = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [kpiTimeSeries, setKpiTimeSeries] = useState<KPITimeSeries[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch KPIs from Firestore
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setLoading(true);
        let kpiQuery = collection(db, 'kpis');
        
        // Apply category filter if not 'all'
        let queryConstraints = [];
        if (selectedCategory !== 'all') {
          queryConstraints.push(where('category', '==', selectedCategory));
        }
        
        const q = query(kpiQuery, ...queryConstraints);
        const querySnapshot = await getDocs(q);
        
        const fetchedKpis: KPI[] = [];
        querySnapshot.forEach((doc) => {
          fetchedKpis.push({ id: doc.id, ...doc.data() } as KPI);
        });
        
        setKpis(fetchedKpis);
        
        // Fetch time series data for the first 5 KPIs (to avoid too many reads)
        const kpiIds = fetchedKpis.slice(0, 5).map(kpi => kpi.id);
        await fetchTimeSeriesData(kpiIds);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching KPIs:', err);
        setError('Failed to load KPI data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchKPIs();
  }, [selectedCategory]);
  
  // Fetch time series data for selected KPIs
  const fetchTimeSeriesData = async (kpiIds: string[]) => {
    try {
      const timeSeriesData: KPITimeSeries[] = [];
      
      // For each KPI, fetch its historical data
      for (const kpiId of kpiIds) {
        const kpi = kpis.find(k => k.id === kpiId);
        if (!kpi) continue;
        
        const q = query(
          collection(db, 'kpiTimeSeries'),
          where('kpiId', '==', kpiId),
          orderBy('date', 'desc'),
          limit(30) // Last 30 data points
        );
        
        const querySnapshot = await getDocs(q);
        const dataPoints: KPITimeSeriesData[] = [];
        
        querySnapshot.forEach((doc) => {
          dataPoints.push(doc.data() as KPITimeSeriesData);
        });
        
        // Sort by date ascending for charts
        dataPoints.sort((a, b) => a.date.seconds - b.date.seconds);
        
        timeSeriesData.push({
          kpiId,
          kpiName: kpi.name,
          data: dataPoints
        });
      }
      
      setKpiTimeSeries(timeSeriesData);
    } catch (err) {
      console.error('Error fetching time series data:', err);
      setError('Failed to load KPI historical data.');
    }
  };
  
  // Format time series data for charts
  const formatTimeSeriesForChart = (timeSeries: KPITimeSeries) => {
    return timeSeries.data.map(dataPoint => ({
      date: dataPoint.date.toDate().toLocaleDateString(),
      value: dataPoint.value
    }));
  };
  
  // Calculate KPI achievement percentage
  const calculateAchievementPercentage = (value: number, target: number) => {
    return Math.min(Math.round((value / target) * 100), 100);
  };
  
  // Prepare data for category distribution pie chart
  const prepareCategoryData = () => {
    const categoryCount = kpis.reduce((acc, kpi) => {
      const category = kpi.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.keys(categoryCount).map(category => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: categoryCount[category]
    }));
  };

  // Prepare data for performance summary bar chart
  const preparePerformanceData = () => {
    return kpis.slice(0, 7).map(kpi => ({
      name: kpi.name,
      actual: kpi.value,
      target: kpi.target
    }));
  };

  // Mock data for demonstration if no actual data is available
  const getMockData = () => {
    if (kpis.length === 0) {
      return [
        { name: 'Fuel Efficiency', actual: 8.2, target: 9.0 },
        { name: 'On-Time Delivery', actual: 92, target: 95 },
        { name: 'Maintenance Cost', actual: 2500, target: 2000 },
        { name: 'Driver Compliance', actual: 98, target: 95 },
        { name: 'Vehicle Utilization', actual: 78, target: 85 }
      ];
    }
    return preparePerformanceData();
  };

  const mockTimeSeriesData = [
    { date: '1/1/2023', value: 75 },
    { date: '2/1/2023', value: 78 },
    { date: '3/1/2023', value: 80 },
    { date: '4/1/2023', value: 79 },
    { date: '5/1/2023', value: 82 },
    { date: '6/1/2023', value: 85 }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">KPI Overview</h1>
        
        <div className="flex items-center">
          <label htmlFor="category-filter" className="mr-2 text-sm font-medium text-gray-700">
            Filter by Category:
          </label>
          <select
            id="category-filter"
            className="border border-gray-300 rounded-md shadow-sm py-2 px-3"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="financial">Financial</option>
            <option value="operational">Operational</option>
            <option value="customer">Customer</option>
            <option value="compliance">Compliance</option>
          </select>
        </div>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <>
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.slice(0, 4).map((kpi, index) => (
              <div key={kpi.id || index} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{kpi.name}</h3>
                  <span 
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${kpi.trend === 'up' ? 'bg-green-100 text-green-800' : 
                        kpi.trend === 'down' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}`}
                  >
                    {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'}
                    {kpi.trend.charAt(0).toUpperCase() + kpi.trend.slice(1)}
                  </span>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-3xl font-bold">{kpi.value}{kpi.unit}</span>
                    <span className="text-sm text-gray-500">Target: {kpi.target}{kpi.unit}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        kpi.value >= kpi.target ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${calculateAchievementPercentage(kpi.value, kpi.target)}%` }}
                    ></div>
                  </div>
                  
                  <p className="mt-1 text-xs text-gray-500">
                    Last updated: {kpi.lastUpdated?.toDate().toLocaleDateString() || 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Bar Chart */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-4">Performance Summary</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getMockData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actual" fill="#8884d8" name="Actual" />
                    <Bar dataKey="target" fill="#82ca9d" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Trend Line Chart */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-4">KPI Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={kpiTimeSeries.length > 0 ? 
                      formatTimeSeriesForChart(kpiTimeSeries[0]) : mockTimeSeriesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      name={kpiTimeSeries.length > 0 ? kpiTimeSeries[0].kpiName : "Sample KPI"} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Category Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-4">Category Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareCategoryData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {prepareCategoryData().map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Status Summary */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-4">KPI Status Summary</h3>
              <div className="space-y-4">
                {[
                  { label: 'On Target', count: kpis.filter(k => k.value >= k.target).length, color: 'bg-green-500' },
                  { label: 'Near Target', count: kpis.filter(k => k.value >= k.target * 0.9 && k.value < k.target).length, color: 'bg-yellow-500' },
                  { label: 'Below Target', count: kpis.filter(k => k.value < k.target * 0.9).length, color: 'bg-red-500' }
                ].map((status, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${status.color} mr-2`}></div>
                    <span className="flex-1">{status.label}</span>
                    <span className="font-semibold">{status.count}</span>
                    <span className="text-gray-500 ml-2">({kpis.length > 0 ? Math.round((status.count / kpis.length) * 100) : 0}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* KPI Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    KPI Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {kpis.map((kpi) => (
                  <tr key={kpi.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {kpi.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {kpi.category.charAt(0).toUpperCase() + kpi.category.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {kpi.value}{kpi.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {kpi.target}{kpi.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${kpi.value >= kpi.target ? 'bg-green-100 text-green-800' : 
                            kpi.value >= kpi.target * 0.9 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}
                      >
                        {kpi.value >= kpi.target ? 'On Target' : 
                          kpi.value >= kpi.target * 0.9 ? 'Near Target' : 'Below Target'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span 
                        className={`inline-flex items-center
                          ${kpi.trend === 'up' ? 'text-green-600' : 
                            kpi.trend === 'down' ? 'text-red-600' : 
                            'text-gray-600'}`}
                      >
                        {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default KPIOverview;
