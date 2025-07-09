import React, { useState, useEffect } from 'react';
import { 
  collection, query, getDocs, doc, setDoc, serverTimestamp,
  Timestamp, where, orderBy, limit
} from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// Define types
interface ReportField {
  id: string;
  name: string;
  fieldPath: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  collection: string;
  displayName: string;
  description?: string;
}

interface ReportFilter {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains' | 'between';
  value: any;
  valueTo?: any; // For 'between' operator
}

interface ReportSort {
  fieldId: string;
  direction: 'asc' | 'desc';
}

interface ReportConfig {
  id?: string;
  name: string;
  description?: string;
  collection: string;
  fields: string[]; // Array of field IDs
  filters: ReportFilter[];
  sort: ReportSort[];
  limit: number;
  chartType?: 'bar' | 'line' | 'pie' | 'none';
  chartConfig?: {
    xAxis?: string; // Field ID for X-axis
    yAxis?: string[]; // Field IDs for Y-axis (can be multiple for multi-series)
    groupBy?: string; // Field ID to group by (for pie charts)
  };
  createdAt?: Timestamp;
  createdBy?: string;
  lastRunAt?: Timestamp;
}

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdHocReportBuilder: React.FC = () => {
  const [availableFields, setAvailableFields] = useState<ReportField[]>([]);
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: 'New Report',
    description: '',
    collection: 'trips',
    fields: [],
    filters: [],
    sort: [],
    limit: 100
  });
  const [reportData, setReportData] = useState<any[]>([]);
  const [savedReports, setSavedReports] = useState<ReportConfig[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Fetch available fields and saved reports on component mount
  useEffect(() => {
    const fetchFieldsAndReports = async () => {
      try {
        // Fetch available fields
        const fieldsQuery = query(collection(db, 'reportFields'), orderBy('name'));
        const fieldsSnapshot = await getDocs(fieldsQuery);
        
        const fields: ReportField[] = [];
        fieldsSnapshot.forEach(doc => {
          fields.push({ id: doc.id, ...doc.data() } as ReportField);
        });
        
        setAvailableFields(fields);
        
        // Fetch saved reports
        const reportsQuery = query(
          collection(db, 'reportConfigs'), 
          orderBy('createdAt', 'desc')
        );
        const reportsSnapshot = await getDocs(reportsQuery);
        
        const reports: ReportConfig[] = [];
        reportsSnapshot.forEach(doc => {
          reports.push({ id: doc.id, ...doc.data() } as ReportConfig);
        });
        
        setSavedReports(reports);
      } catch (err) {
        console.error('Error fetching fields and reports:', err);
        setError('Failed to load report builder data. Please try again.');
      }
    };
    
    fetchFieldsAndReports();
  }, []);
  
  // Get fields for the selected collection
  const getFieldsForCollection = (collectionName: string) => {
    return availableFields.filter(field => field.collection === collectionName);
  };
  
  // Handle collection change
  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const collectionName = e.target.value;
    setReportConfig({
      ...reportConfig,
      collection: collectionName,
      fields: [], // Reset fields when collection changes
      filters: [], // Reset filters when collection changes
      sort: [] // Reset sort when collection changes
    });
  };
  
  // Toggle field selection
  const toggleField = (fieldId: string) => {
    const newFields = [...reportConfig.fields];
    
    if (newFields.includes(fieldId)) {
      // Remove field
      const index = newFields.indexOf(fieldId);
      newFields.splice(index, 1);
    } else {
      // Add field
      newFields.push(fieldId);
    }
    
    setReportConfig({
      ...reportConfig,
      fields: newFields
    });
  };
  
  // Add new filter
  const addFilter = () => {
    const availableFieldsForCollection = getFieldsForCollection(reportConfig.collection);
    
    if (availableFieldsForCollection.length === 0) {
      setError('No fields available for filtering');
      return;
    }
    
    const newFilter: ReportFilter = {
      fieldId: availableFieldsForCollection[0].id,
      operator: 'equals',
      value: ''
    };
    
    setReportConfig({
      ...reportConfig,
      filters: [...reportConfig.filters, newFilter]
    });
  };
  
  // Update filter
  const updateFilter = (index: number, key: keyof ReportFilter, value: any) => {
    const newFilters = [...reportConfig.filters];
    newFilters[index] = { ...newFilters[index], [key]: value };
    
    setReportConfig({
      ...reportConfig,
      filters: newFilters
    });
  };
  
  // Remove filter
  const removeFilter = (index: number) => {
    const newFilters = [...reportConfig.filters];
    newFilters.splice(index, 1);
    
    setReportConfig({
      ...reportConfig,
      filters: newFilters
    });
  };
  
  // Add new sort
  const addSort = () => {
    if (reportConfig.fields.length === 0) {
      setError('Please select fields before adding sort criteria');
      return;
    }
    
    const newSort: ReportSort = {
      fieldId: reportConfig.fields[0],
      direction: 'asc'
    };
    
    setReportConfig({
      ...reportConfig,
      sort: [...reportConfig.sort, newSort]
    });
  };
  
  // Update sort
  const updateSort = (index: number, key: keyof ReportSort, value: any) => {
    const newSort = [...reportConfig.sort];
    newSort[index] = { ...newSort[index], [key]: value };
    
    setReportConfig({
      ...reportConfig,
      sort: newSort
    });
  };
  
  // Remove sort
  const removeSort = (index: number) => {
    const newSort = [...reportConfig.sort];
    newSort.splice(index, 1);
    
    setReportConfig({
      ...reportConfig,
      sort: newSort
    });
  };
  
  // Get field by ID
  const getFieldById = (fieldId: string): ReportField | undefined => {
    return availableFields.find(field => field.id === fieldId);
  };
  
  // Run the report
  const runReport = async () => {
    if (reportConfig.fields.length === 0) {
      setError('Please select at least one field for your report');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Build Firestore query
      let q = collection(db, reportConfig.collection);
      
      // Apply filters
      const queryConstraints = [];
      
      for (const filter of reportConfig.filters) {
        const field = getFieldById(filter.fieldId);
        if (!field) continue;
        
        const fieldPath = field.fieldPath;
        
        switch (filter.operator) {
          case 'equals':
            queryConstraints.push(where(fieldPath, '==', filter.value));
            break;
          case 'notEquals':
            queryConstraints.push(where(fieldPath, '!=', filter.value));
            break;
          case 'greaterThan':
            queryConstraints.push(where(fieldPath, '>', filter.value));
            break;
          case 'lessThan':
            queryConstraints.push(where(fieldPath, '<', filter.value));
            break;
          case 'contains':
            // Firestore doesn't support native contains, this is a simplification
            // In a real implementation, you might need to use array-contains or other alternatives
            queryConstraints.push(where(fieldPath, '>=', filter.value));
            break;
          case 'between':
            if (filter.valueTo) {
              queryConstraints.push(where(fieldPath, '>=', filter.value));
              queryConstraints.push(where(fieldPath, '<=', filter.valueTo));
            }
            break;
        }
      }
      
      // Apply sorting
      for (const sort of reportConfig.sort) {
        const field = getFieldById(sort.fieldId);
        if (field) {
          queryConstraints.push(orderBy(field.fieldPath, sort.direction));
        }
      }
      
      // Apply limit
      queryConstraints.push(limit(reportConfig.limit));
      
      // Execute query
      const querySnapshot = await getDocs(query(q, ...queryConstraints));
      
      const results: any[] = [];
      querySnapshot.forEach(doc => {
        // Extract only the selected fields
        const result: Record<string, any> = { id: doc.id };
        const data = doc.data();
        
        for (const fieldId of reportConfig.fields) {
          const field = getFieldById(fieldId);
          if (field) {
            // Handle nested field paths (e.g., "user.name")
            const parts = field.fieldPath.split('.');
            let value = data;
            
            for (const part of parts) {
              if (value && typeof value === 'object' && part in value) {
                value = value[part];
              } else {
                // If the path does not exist, stop and set value to null
                value = {};
                break;
              }
            }
            
            // Format value based on field type
            if (value !== undefined) {
              if (field.dataType === 'date' && value instanceof Timestamp) {
                result[field.name] = value.toDate().toLocaleDateString();
              } else {
                result[field.name] = value;
              }
            } else {
              result[field.name] = null;
            }
          }
        }
        
        results.push(result);
      });
      
      setReportData(results);
      
      // Update lastRunAt
      setReportConfig({
        ...reportConfig,
        lastRunAt: Timestamp.now()
      });
      
      setSuccessMessage(`Report executed successfully. Found ${results.length} records.`);
      setTimeout(() => setSuccessMessage(null), 5000); // Clear success message after 5 seconds
    } catch (err) {
      console.error('Error running report:', err);
      setError('Failed to execute the report query. Please check your configuration and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save the report configuration
  const saveReport = async () => {
    if (!reportConfig.name.trim()) {
      setError('Please provide a name for the report');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const reportToSave = {
        ...reportConfig,
        createdAt: reportConfig.createdAt || serverTimestamp(),
        lastRunAt: reportConfig.lastRunAt || null,
        createdBy: 'current-user-id' // In a real app, this would come from auth
      };
      
      // Create a new document in the reportConfigs collection
      if (reportConfig.id) {
        // Update existing report
        await setDoc(doc(db, 'reportConfigs', reportConfig.id), reportToSave, { merge: true });
      } else {
        // Create new report
        const newReportRef = doc(collection(db, 'reportConfigs'));
        await setDoc(newReportRef, reportToSave);
        
        // Update local state with new ID
        setReportConfig({
          ...reportConfig,
          id: newReportRef.id
        });
      }
      
      // Refresh saved reports list
      const reportsQuery = query(collection(db, 'reportConfigs'), orderBy('createdAt', 'desc'));
      const reportsSnapshot = await getDocs(reportsQuery);
      
      const reports: ReportConfig[] = [];
      reportsSnapshot.forEach(doc => {
        reports.push({ id: doc.id, ...doc.data() } as ReportConfig);
      });
      
      setSavedReports(reports);
      
      setSuccessMessage('Report configuration saved successfully');
      setTimeout(() => setSuccessMessage(null), 5000); // Clear success message after 5 seconds
    } catch (err) {
      console.error('Error saving report config:', err);
      setError('Failed to save the report configuration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load a saved report
  const loadReport = (reportId: string) => {
    const report = savedReports.find(r => r.id === reportId);
    if (report) {
      setReportConfig(report);
      setReportData([]); // Clear any existing data
    }
  };
  
  // Create a new report
  const createNewReport = () => {
    setReportConfig({
      name: 'New Report',
      description: '',
      collection: 'trips',
      fields: [],
      filters: [],
      sort: [],
      limit: 100
    });
    setReportData([]);
  };
  
  // Prepare chart data
  const prepareChartData = () => {
    if (!reportConfig.chartType || !reportConfig.chartConfig || reportData.length === 0) {
      return [];
    }
    
    // For pie charts
    if (reportConfig.chartType === 'pie' && reportConfig.chartConfig.groupBy) {
      const groupByField = reportConfig.chartConfig.groupBy;
      const valueField = reportConfig.chartConfig.yAxis?.[0];
      
      if (!valueField) return [];
      
      // Group data by the groupBy field and sum the value field
      const groupedData: Record<string, number> = {};
      
      reportData.forEach(item => {
        const groupValue = item[getFieldById(groupByField)?.name || ''] || 'Unknown';
        const numValue = parseFloat(item[getFieldById(valueField)?.name || '']) || 0;
        
        groupedData[groupValue] = (groupedData[groupValue] || 0) + numValue;
      });
      
      // Convert to chart format
      return Object.entries(groupedData).map(([name, value]) => ({
        name,
        value
      }));
    }
    
    // For bar and line charts
    if ((reportConfig.chartType === 'bar' || reportConfig.chartType === 'line') && 
        reportConfig.chartConfig.xAxis && 
        reportConfig.chartConfig.yAxis?.length) {
      
      const xAxisField = getFieldById(reportConfig.chartConfig.xAxis)?.name || '';
      
      return reportData.map(item => {
        const result: Record<string, any> = {
          name: item[xAxisField]
        };
        
        // Add all Y-axis fields
        reportConfig.chartConfig?.yAxis?.forEach(yFieldId => {
          const yField = getFieldById(yFieldId);
          if (yField) {
            result[yField.name] = parseFloat(item[yField.name]) || 0;
          }
        });
        
        return result;
      });
    }
    
    return [];
  };
  
  // Render chart based on configuration
  const renderChart = () => {
    if (!reportConfig.chartType || !reportConfig.chartConfig || reportData.length === 0) {
      return null;
    }
    
    const chartData = prepareChartData();
    
    if (chartData.length === 0) return null;
    
    switch (reportConfig.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {reportConfig.chartConfig.yAxis?.map((yFieldId, idx) => {
                const field = getFieldById(yFieldId);
                return field ? (
                  <Bar 
                    key={field.id}
                    dataKey={field.name} 
                    fill={COLORS[idx % COLORS.length]} 
                    name={field.displayName}
                  />
                ) : null;
              })}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {reportConfig.chartConfig.yAxis?.map((yFieldId, idx) => {
                const field = getFieldById(yFieldId);
                return field ? (
                  <Line 
                    key={field.id}
                    type="monotone" 
                    dataKey={field.name} 
                    stroke={COLORS[idx % COLORS.length]} 
                    name={field.displayName}
                    activeDot={{ r: 8 }} 
                  />
                ) : null;
              })}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };

  // Get mock fields if no fields are loaded yet
  const getMockFields = () => {
    if (availableFields.length > 0) return availableFields;
    
    return [
      { id: '1', name: 'driverName', displayName: 'Driver Name', collection: 'trips', dataType: 'string', fieldPath: 'driver.name' },
      { id: '2', name: 'vehicleReg', displayName: 'Vehicle Reg', collection: 'trips', dataType: 'string', fieldPath: 'vehicle.registrationNumber' },
      { id: '3', name: 'startDate', displayName: 'Start Date', collection: 'trips', dataType: 'date', fieldPath: 'startDate' },
      { id: '4', name: 'distance', displayName: 'Distance (km)', collection: 'trips', dataType: 'number', fieldPath: 'distance' },
      { id: '5', name: 'fuelUsed', displayName: 'Fuel Used (L)', collection: 'trips', dataType: 'number', fieldPath: 'fuelUsed' },
      { id: '6', name: 'client', displayName: 'Client', collection: 'trips', dataType: 'string', fieldPath: 'client.name' },
      { id: '7', name: 'status', displayName: 'Status', collection: 'trips', dataType: 'string', fieldPath: 'status' }
    ];
  };

  // Mock data for charts if no real data is available
  const mockTripData = [
    { id: '1', driver: 'John Smith', vehicle: 'ABC123', startDate: '2023-01-15', distance: 450, fuelUsed: 45, client: 'Acme Inc', status: 'completed' },
    { id: '2', driver: 'Sarah Johnson', vehicle: 'DEF456', startDate: '2023-01-16', distance: 320, fuelUsed: 30, client: 'XYZ Corp', status: 'completed' },
    { id: '3', driver: 'Mike Brown', vehicle: 'GHI789', startDate: '2023-01-17', distance: 280, fuelUsed: 25, client: 'Global Trans', status: 'completed' },
    { id: '4', driver: 'Lisa Davis', vehicle: 'JKL012', startDate: '2023-01-18', distance: 520, fuelUsed: 50, client: 'City Logistics', status: 'completed' },
    { id: '5', driver: 'Robert Wilson', vehicle: 'MNO345', startDate: '2023-01-19', distance: 380, fuelUsed: 35, client: 'Acme Inc', status: 'completed' }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">Ad Hoc Report Builder</h1>
        
        <div className="flex space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={createNewReport}
          >
            New Report
          </button>
          
          <select
            className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value=""
            onChange={(e) => loadReport(e.target.value)}
          >
            <option value="">Load Saved Report</option>
            {savedReports.map(report => (
              <option key={report.id} value={report.id}>{report.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-6">
          {/* Report Configuration Panel */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Report Configuration</h2>
            
            <div className="mb-4">
              <label htmlFor="report-name" className="block text-sm font-medium text-gray-700 mb-1">
                Report Name
              </label>
              <input
                type="text"
                id="report-name"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={reportConfig.name}
                onChange={(e) => setReportConfig({ ...reportConfig, name: e.target.value })}
                placeholder="Enter report name"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="report-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="report-description"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={reportConfig.description || ''}
                onChange={(e) => setReportConfig({ ...reportConfig, description: e.target.value })}
                placeholder="Enter report description"
                rows={2}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="report-collection" className="block text-sm font-medium text-gray-700 mb-1">
                Data Source
              </label>
              <select
                id="report-collection"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={reportConfig.collection}
                onChange={handleCollectionChange}
              >
                <option value="trips">Trips</option>
                <option value="vehicles">Vehicles</option>
                <option value="drivers">Drivers</option>
                <option value="clients">Clients</option>
                <option value="fuelTransactions">Fuel Transactions</option>
                <option value="maintenance">Maintenance Records</option>
                <option value="invoices">Invoices</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="report-limit" className="block text-sm font-medium text-gray-700 mb-1">
                Row Limit
              </label>
              <input
                type="number"
                id="report-limit"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={reportConfig.limit}
                onChange={(e) => setReportConfig({ ...reportConfig, limit: parseInt(e.target.value) || 100 })}
                min={1}
                max={1000}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="chart-type" className="block text-sm font-medium text-gray-700 mb-1">
                Chart Type
              </label>
              <select
                id="chart-type"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                value={reportConfig.chartType || 'none'}
                onChange={(e) => setReportConfig({ 
                  ...reportConfig, 
                  chartType: e.target.value === 'none' ? undefined : e.target.value as any,
                  chartConfig: e.target.value === 'none' ? undefined : { xAxis: '', yAxis: [] }
                })}
              >
                <option value="none">No Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>
            
            {reportConfig.chartType && reportConfig.chartType !== 'none' && (
              <div className="mb-4 p-4 border border-gray-200 rounded-md bg-white">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Chart Configuration</h3>
                
                {(reportConfig.chartType === 'bar' || reportConfig.chartType === 'line') && (
                  <>
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        X-Axis Field
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm"
                        value={reportConfig.chartConfig?.xAxis || ''}
                        onChange={(e) => setReportConfig({
                          ...reportConfig,
                          chartConfig: {
                            ...reportConfig.chartConfig,
                            xAxis: e.target.value
                          }
                        })}
                      >
                        <option value="">Select field</option>
                        {reportConfig.fields.map(fieldId => {
                          const field = getFieldById(fieldId);
                          return field ? (
                            <option key={field.id} value={field.id}>{field.displayName}</option>
                          ) : null;
                        })}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Y-Axis Fields (Numeric)
                      </label>
                      <div className="space-y-2">
                        {reportConfig.fields.filter(fieldId => {
                          const field = getFieldById(fieldId);
                          return field?.dataType === 'number';
                        }).map(fieldId => {
                          const field = getFieldById(fieldId);
                          if (!field) return null;
                          
                          const isSelected = reportConfig.chartConfig?.yAxis?.includes(fieldId);
                          
                          return (
                            <div key={field.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`y-field-${field.id}`}
                                checked={isSelected}
                                onChange={() => {
                                  const currentYAxis = reportConfig.chartConfig?.yAxis || [];
                                  let newYAxis;
                                  
                                  if (isSelected) {
                                    newYAxis = currentYAxis.filter(id => id !== fieldId);
                                  } else {
                                    newYAxis = [...currentYAxis, fieldId];
                                  }
                                  
                                  setReportConfig({
                                    ...reportConfig,
                                    chartConfig: {
                                      ...reportConfig.chartConfig,
                                      yAxis: newYAxis
                                    }
                                  });
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label 
                                htmlFor={`y-field-${field.id}`}
                                className="ml-2 text-sm text-gray-700"
                              >
                                {field.displayName}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
                
                {reportConfig.chartType === 'pie' && (
                  <>
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Group By Field
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm"
                        value={reportConfig.chartConfig?.groupBy || ''}
                        onChange={(e) => setReportConfig({
                          ...reportConfig,
                          chartConfig: {
                            ...reportConfig.chartConfig,
                            groupBy: e.target.value
                          }
                        })}
                      >
                        <option value="">Select field</option>
                        {reportConfig.fields.map(fieldId => {
                          const field = getFieldById(fieldId);
                          return field && field.dataType !== 'number' ? (
                            <option key={field.id} value={field.id}>{field.displayName}</option>
                          ) : null;
                        })}
                      </select>
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Value Field (Numeric)
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm"
                        value={(reportConfig.chartConfig?.yAxis || [])[0] || ''}
                        onChange={(e) => setReportConfig({
                          ...reportConfig,
                          chartConfig: {
                            ...reportConfig.chartConfig,
                            yAxis: [e.target.value]
                          }
                        })}
                      >
                        <option value="">Select field</option>
                        {reportConfig.fields.map(fieldId => {
                          const field = getFieldById(fieldId);
                          return field?.dataType === 'number' ? (
                            <option key={field.id} value={field.id}>{field.displayName}</option>
                          ) : null;
                        })}
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={runReport}
              disabled={isLoading}
            >
              {isLoading ? 'Running...' : 'Run Report'}
            </button>
            
            <button
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={saveReport}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Report'}
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          {/* Field Selection */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Select Fields</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getFieldsForCollection(reportConfig.collection).length > 0 ? (
                getFieldsForCollection(reportConfig.collection).map(field => (
                  <div key={field.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`field-${field.id}`}
                      checked={reportConfig.fields.includes(field.id)}
                      onChange={() => toggleField(field.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={`field-${field.id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {field.displayName}
                      <span className="text-xs text-gray-500 block">
                        {field.dataType}
                      </span>
                    </label>
                  </div>
                ))
              ) : (
                // Show mock fields if no fields are loaded yet
                getMockFields().filter(field => field.collection === reportConfig.collection).map(field => (
                  <div key={field.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`field-${field.id}`}
                      checked={reportConfig.fields.includes(field.id)}
                      onChange={() => toggleField(field.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={`field-${field.id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {field.displayName}
                      <span className="text-xs text-gray-500 block">
                        {field.dataType}
                      </span>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Filter Configuration */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                className="px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={addFilter}
              >
                Add Filter
              </button>
            </div>
            
            {reportConfig.filters.length === 0 ? (
              <p className="text-gray-500 text-sm">No filters configured. Click "Add Filter" to create one.</p>
            ) : (
              <div className="space-y-4">
                {reportConfig.filters.map((filter, index) => (
                  <div key={index} className="flex flex-wrap gap-2 items-center p-3 border border-gray-200 rounded-md bg-gray-50">
                    <div className="w-full sm:w-auto">
                      <select
                        className="border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm"
                        value={filter.fieldId}
                        onChange={(e) => updateFilter(index, 'fieldId', e.target.value)}
                      >
                        {getFieldsForCollection(reportConfig.collection).map(field => (
                          <option key={field.id} value={field.id}>{field.displayName}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="w-full sm:w-auto">
                      <select
                        className="border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm"
                        value={filter.operator}
                        onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                      >
                        <option value="equals">Equals</option>
                        <option value="notEquals">Not Equals</option>
                        <option value="greaterThan">Greater Than</option>
                        <option value="lessThan">Less Than</option>
                        <option value="contains">Contains</option>
                        <option value="between">Between</option>
                      </select>
                    </div>
                    
                    <div className="w-full sm:w-auto">
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm"
                        value={filter.value}
                        onChange={(e) => updateFilter(index, 'value', e.target.value)}
                        placeholder="Value"
                      />
                    </div>
                    
                    {filter.operator === 'between' && (
                      <div className="w-full sm:w-auto">
                        <input
                          type="text"
                          className="border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm"
                          value={filter.valueTo || ''}
                          onChange={(e) => updateFilter(index, 'valueTo', e.target.value)}
                          placeholder="To Value"
                        />
                      </div>
                    )}
                    
                    <div className="w-full sm:w-auto ml-auto">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => removeFilter(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Sort Configuration */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Sorting</h2>
              <button
                className="px-2 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={addSort}
              >
                Add Sort
              </button>
            </div>
            
            {reportConfig.sort.length === 0 ? (
              <p className="text-gray-500 text-sm">No sorting configured. Click "Add Sort" to create one.</p>
            ) : (
              <div className="space-y-4">
                {reportConfig.sort.map((sort, index) => (
                  <div key={index} className="flex flex-wrap gap-2 items-center p-3 border border-gray-200 rounded-md bg-gray-50">
                    <div className="w-full sm:w-auto">
                      <select
                        className="border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm"
                        value={sort.fieldId}
                        onChange={(e) => updateSort(index, 'fieldId', e.target.value)}
                      >
                        {reportConfig.fields.map(fieldId => {
                          const field = getFieldById(fieldId);
                          return field ? (
                            <option key={field.id} value={field.id}>{field.displayName}</option>
                          ) : null;
                        })}
                      </select>
                    </div>
                    
                    <div className="w-full sm:w-auto">
                      <select
                        className="border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm"
                        value={sort.direction}
                        onChange={(e) => updateSort(index, 'direction', e.target.value as 'asc' | 'desc')}
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </div>
                    
                    <div className="w-full sm:w-auto ml-auto">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => removeSort(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Report Results */}
      {(reportData.length > 0 || reportConfig.chartType) && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Report Results</h2>
            <div className="flex space-x-3">
              <button
                className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => {
                  // In a real app, this would export to CSV/Excel
                  alert('Export functionality would be implemented here');
                }}
              >
                Export CSV
              </button>
              <button
                className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => {
                  // In a real app, this would open a print view
                  window.print();
                }}
              >
                Print Report
              </button>
            </div>
          </div>
          
          {/* Visualization */}
          {reportConfig.chartType && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Data Visualization</h3>
              {renderChart()}
            </div>
          )}
          
          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {reportConfig.fields.map(fieldId => {
                    const field = getFieldById(fieldId);
                    return field ? (
                      <th 
                        key={field.id} 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {field.displayName}
                      </th>
                    ) : null;
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.length > 0 ? (
                  reportData.map((row, index) => (
                    <tr key={index}>
                      {reportConfig.fields.map(fieldId => {
                        const field = getFieldById(fieldId);
                        return field ? (
                          <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row[field.name] !== null && row[field.name] !== undefined ? String(row[field.name]) : '-'}
                          </td>
                        ) : null;
                      })}
                    </tr>
                  ))
                ) : (
                  // Show mock data if no results are loaded yet
                  mockTripData.map((row, index) => (
                    <tr key={index}>
                      {reportConfig.fields.map(fieldId => {
                        const field = getFieldById(fieldId);
                        if (!field) return null;
                        
                        // Map mock field names to mock data properties
                        const fieldMap: Record<string, keyof typeof row> = {
                          driverName: 'driver',
                          vehicleReg: 'vehicle',
                          startDate: 'startDate',
                          distance: 'distance',
                          fuelUsed: 'fuelUsed',
                          client: 'client',
                          status: 'status'
                        };
                        
                        return (
                          <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row[fieldMap[field.name] || ''] || '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdHocReportBuilder;
