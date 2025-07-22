import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

// Define types
interface ROIProject {
  id: string;
  name: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp | null; // Null if ongoing
  category: string;
  initialInvestment: number;
  actualReturns: number[];
  projectedReturns: number[];
  datePeriods: Timestamp[];
  status: 'planned' | 'in-progress' | 'completed';
  metrics: ROIMetrics;
}

interface ROIMetrics {
  roi: number; // Return on Investment percentage
  paybackPeriodMonths: number;
  npv: number; // Net Present Value
  irr: number; // Internal Rate of Return
  breakEvenDate: Timestamp | null;
}

interface ROIReport {
  id: string;
  name: string;
  description: string;
  createdAt: Timestamp;
  projectIds: string[];
  timeframe: 'monthly' | 'quarterly' | 'yearly';
  filters: {
    categories?: string[];
    startDate?: Timestamp;
    endDate?: Timestamp;
    minROI?: number;
  };
}

// Color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff6b6b', '#6ba8ff'];

const ROIReportView: React.FC = () => {
  const [projects, setProjects] = useState<ROIProject[]>([]);
  const [reports, setReports] = useState<ROIReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ROIReport | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<ROIProject[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('monthly');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ROI projects from Firestore
  useEffect(() => {
    const fetchROIData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects
        const projectsQuery = query(
          collection(db, 'roiProjects'),
          orderBy('startDate', 'desc')
        );
        
        const projectsSnapshot = await getDocs(projectsQuery);
        const fetchedProjects: ROIProject[] = [];
        
        projectsSnapshot.forEach((doc) => {
          fetchedProjects.push({ id: doc.id, ...doc.data() } as ROIProject);
        });
        
        setProjects(fetchedProjects);
        
        // Fetch reports
        const reportsQuery = query(
          collection(db, 'roiReports'),
          orderBy('createdAt', 'desc')
        );
        
        const reportsSnapshot = await getDocs(reportsQuery);
        const fetchedReports: ROIReport[] = [];
        
        reportsSnapshot.forEach((doc) => {
          fetchedReports.push({ id: doc.id, ...doc.data() } as ROIReport);
        });
        
        setReports(fetchedReports);
        
        // Select the most recent report by default if available
        if (fetchedReports.length > 0) {
          setSelectedReport(fetchedReports[0]);
          setTimeframe(fetchedReports[0].timeframe);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ROI data:', err);
        setError('Failed to load ROI data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchROIData();
  }, []);

  // Filter projects based on selected filters and report
  useEffect(() => {
    if (!projects.length) return;
    
    let filtered = [...projects];
    
    // Filter by selected report if available
    if (selectedReport) {
      filtered = filtered.filter(project => selectedReport.projectIds.includes(project.id));
      
      // Apply report-specific filters
      if (selectedReport.filters.categories?.length) {
        filtered = filtered.filter(project => 
          selectedReport.filters.categories?.includes(project.category));
      }
      
      if (selectedReport.filters?.startDate && selectedReport.filters.startDate.seconds) {
        const startSeconds = selectedReport.filters.startDate.seconds;
        filtered = filtered.filter(project => 
          project.startDate.seconds >= startSeconds);
      }
      
      if (selectedReport.filters?.endDate) {
        const endDateSeconds = selectedReport.filters.endDate.seconds;
        if (endDateSeconds !== undefined) {
          filtered = filtered.filter(project => 
            !project.endDate || project.endDate.seconds <= endDateSeconds);
        }
      }
      
      if (selectedReport.filters.minROI !== undefined) {
        filtered = filtered.filter(project => 
          project.metrics.roi >= (selectedReport.filters.minROI || 0));
      }
    }
    
    // Apply UI filters
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.category === categoryFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }
    
    setFilteredProjects(filtered);
  }, [projects, selectedReport, categoryFilter, statusFilter]);

  // Get available categories from projects
  const getCategories = () => {
    const categories = new Set(projects.map(project => project.category));
    return Array.from(categories);
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate total ROI and investment for filtered projects
  const calculateTotals = () => {
    const totalInvestment = filteredProjects.reduce(
      (sum, project) => sum + project.initialInvestment, 
      0
    );
    
    const totalReturns = filteredProjects.reduce(
      (sum, project) => sum + project.actualReturns.reduce((a, b) => a + b, 0), 
      0
    );
    
    const aggregateROI = totalInvestment > 0 ? 
      ((totalReturns - totalInvestment) / totalInvestment) * 100 : 0;
      
    return {
      totalInvestment,
      totalReturns,
      aggregateROI
    };
  };

  // Format project data for charts
  const formatProjectsForBarChart = () => {
    return filteredProjects.map(project => {
      const totalActualReturn = project.actualReturns.reduce((a, b) => a + b, 0);
      const totalProjectedReturn = project.projectedReturns.reduce((a, b) => a + b, 0);
      
      return {
        name: project.name,
        investment: project.initialInvestment,
        actualReturn: totalActualReturn,
        projectedReturn: totalProjectedReturn,
        roi: project.metrics.roi
      };
    });
  };

  // Prepare category distribution data for pie chart
  const prepareCategoryData = () => {
    const categoryMap: Record<string, { investment: number, returns: number }> = {};
    
    filteredProjects.forEach(project => {
      if (!categoryMap[project.category]) {
        categoryMap[project.category] = { investment: 0, returns: 0 };
      }
      
      categoryMap[project.category].investment += project.initialInvestment;
      categoryMap[project.category].returns += project.actualReturns.reduce((a, b) => a + b, 0);
    });
    
    return Object.entries(categoryMap).map(([category, data]) => ({
      name: category,
      investment: data.investment,
      returns: data.returns,
      value: data.investment // For pie chart size
    }));
  };

  // Format aggregate ROI trend data
  const formatROITrendData = () => {
    if (!filteredProjects.length) return [];
    
    // Find the earliest and latest dates across all projects
    let earliestDate = new Date();
    let latestDate = new Date(0);
    
    filteredProjects.forEach(project => {
      const startDate = project.startDate.toDate();
      if (startDate < earliestDate) earliestDate = startDate;
      
      const endDate = project.endDate?.toDate() || new Date();
      if (endDate > latestDate) latestDate = endDate;
    });
    
    // Generate date periods based on timeframe
    const periods: Date[] = [];
    let currentDate = new Date(earliestDate);
    
    while (currentDate <= latestDate) {
      periods.push(new Date(currentDate));
      
      if (timeframe === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else if (timeframe === 'quarterly') {
        currentDate.setMonth(currentDate.getMonth() + 3);
      } else { // yearly
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
    }
    
    // Calculate investment and returns for each period
    return periods.map((period, index) => {
      const periodData = {
        date: period.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: timeframe === 'yearly' ? undefined : 'short',
          day: timeframe === 'monthly' ? '2-digit' : undefined
        }),
        investment: 0,
        actualReturns: 0,
        projectedReturns: 0
      };
      
      // Add up values from projects that were active during this period
      filteredProjects.forEach(project => {
        const projectStartPeriod = Math.floor(
          (project.startDate.toDate().getTime() - earliestDate.getTime()) / 
          (period.getTime() - earliestDate.getTime())
        );
        
        if (index >= projectStartPeriod) {
          // Add investment only in the first period
          if (index === projectStartPeriod) {
            periodData.investment += project.initialInvestment;
          }
          
          // Add returns if available for this period
          if (index - projectStartPeriod < project.actualReturns.length) {
            periodData.actualReturns += project.actualReturns[index - projectStartPeriod];
          }
          
          if (index - projectStartPeriod < project.projectedReturns.length) {
            periodData.projectedReturns += project.projectedReturns[index - projectStartPeriod];
          }
        }
      });
      
      return periodData;
    });
  };

  // Mock data for demonstration when real data is not available
  const getMockBarChartData = () => {
    if (filteredProjects.length > 0) {
      return formatProjectsForBarChart();
    }
    
    return [
      { name: 'Fleet Modernization', investment: 250000, actualReturn: 375000, projectedReturn: 350000, roi: 50 },
      { name: 'Fuel Efficiency', investment: 120000, actualReturn: 180000, projectedReturn: 192000, roi: 60 },
      { name: 'Maintenance Optimization', investment: 75000, actualReturn: 90000, projectedReturn: 120000, roi: 20 },
      { name: 'Route Planning System', investment: 150000, actualReturn: 225000, projectedReturn: 210000, roi: 50 },
      { name: 'Driver Training', investment: 50000, actualReturn: 85000, projectedReturn: 75000, roi: 70 }
    ];
  };
  
  const getMockTrendData = () => {
    if (filteredProjects.length > 0 && formatROITrendData().length > 0) {
      return formatROITrendData();
    }
    
    return [
      { date: 'Jan 2023', investment: 120000, actualReturns: 0, projectedReturns: 0 },
      { date: 'Feb 2023', investment: 150000, actualReturns: 12000, projectedReturns: 10000 },
      { date: 'Mar 2023', investment: 75000, actualReturns: 35000, projectedReturns: 30000 },
      { date: 'Apr 2023', investment: 0, actualReturns: 65000, projectedReturns: 60000 },
      { date: 'May 2023', investment: 0, actualReturns: 85000, projectedReturns: 80000 },
      { date: 'Jun 2023', investment: 0, actualReturns: 110000, projectedReturns: 100000 }
    ];
  };

  const totals = calculateTotals();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">ROI & Investment Analysis</h1>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <div>
            <label htmlFor="report-selector" className="block text-sm font-medium text-gray-700 mb-1">
              Report Template:
            </label>
            <select
              id="report-selector"
              className="w-full md:w-auto border border-gray-300 rounded-md shadow-sm py-2 px-3"
              value={selectedReport?.id || ''}
              onChange={(e) => {
                const report = reports.find(r => r.id === e.target.value);
                setSelectedReport(report || null);
                if (report) setTimeframe(report.timeframe);
              }}
              disabled={loading || reports.length === 0}
            >
              <option value="">Custom Filter</option>
              {reports.map(report => (
                <option key={report.id} value={report.id}>{report.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Category:
            </label>
            <select
              id="category-filter"
              className="w-full md:w-auto border border-gray-300 rounded-md shadow-sm py-2 px-3"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {getCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Project Status:
            </label>
            <select
              id="status-filter"
              className="w-full md:w-auto border border-gray-300 rounded-md shadow-sm py-2 px-3"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="timeframe-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Timeframe:
            </label>
            <select
              id="timeframe-filter"
              className="w-full md:w-auto border border-gray-300 rounded-md shadow-sm py-2 px-3"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
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
      
      {!loading && (
        <>
          {/* ROI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Investment</h3>
              <p className="text-3xl font-bold">{formatCurrency(totals.totalInvestment)}</p>
              <p className="mt-1 text-sm text-gray-500">
                Across {filteredProjects.length} projects
              </p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Returns</h3>
              <p className="text-3xl font-bold">{formatCurrency(totals.totalReturns)}</p>
              <p className="mt-1 text-sm text-gray-500">
                Net profit: {formatCurrency(totals.totalReturns - totals.totalInvestment)}
              </p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Aggregate ROI</h3>
              <p className="text-3xl font-bold">{totals.aggregateROI.toFixed(1)}%</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    totals.aggregateROI > 50 ? 'bg-green-500' : 
                    totals.aggregateROI > 20 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(totals.aggregateROI, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Project ROI Comparison Bar Chart */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-4">Project ROI Comparison</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={getMockBarChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="investment" name="Investment" fill="#8884d8" />
                    <Bar yAxisId="left" dataKey="actualReturn" name="Actual Return" fill="#82ca9d" />
                    <Bar yAxisId="right" dataKey="roi" name="ROI %" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* ROI Trend Line Chart */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-4">ROI Trend Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={getMockTrendData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="investment" 
                      name="Investment" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actualReturns" 
                      name="Actual Returns" 
                      stroke="#82ca9d" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="projectedReturns" 
                      name="Projected Returns" 
                      stroke="#ffc658" 
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Category Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-4">Investment by Category</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareCategoryData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {prepareCategoryData().map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* ROI Status Summary */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-4">ROI Status Summary</h3>
              
              <div className="space-y-6">
                {/* ROI Performance Categories */}
                <div className="space-y-4">
                  {[
                    { 
                      label: 'High Performing', 
                      count: filteredProjects.filter(p => p.metrics.roi > 50).length, 
                      color: 'bg-green-500' 
                    },
                    { 
                      label: 'Average Performing', 
                      count: filteredProjects.filter(p => p.metrics.roi > 20 && p.metrics.roi <= 50).length, 
                      color: 'bg-yellow-500' 
                    },
                    { 
                      label: 'Low Performing', 
                      count: filteredProjects.filter(p => p.metrics.roi <= 20).length, 
                      color: 'bg-red-500' 
                    }
                  ].map((category, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${category.color} mr-2`}></div>
                      <span className="flex-1">{category.label}</span>
                      <span className="font-semibold">{category.count}</span>
                      <span className="text-gray-500 ml-2">
                        ({filteredProjects.length > 0 ? 
                          Math.round((category.count / filteredProjects.length) * 100) : 0}%)
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Payback Period Distribution */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Payback Period Distribution</h4>
                  <div className="space-y-2">
                    {[
                      { 
                        label: 'Less than 6 months', 
                        count: filteredProjects.filter(p => p.metrics.paybackPeriodMonths < 6).length 
                      },
                      { 
                        label: '6-12 months', 
                        count: filteredProjects.filter(p => 
                          p.metrics.paybackPeriodMonths >= 6 && p.metrics.paybackPeriodMonths <= 12
                        ).length 
                      },
                      { 
                        label: '1-2 years', 
                        count: filteredProjects.filter(p => 
                          p.metrics.paybackPeriodMonths > 12 && p.metrics.paybackPeriodMonths <= 24
                        ).length 
                      },
                      { 
                        label: 'Over 2 years', 
                        count: filteredProjects.filter(p => p.metrics.paybackPeriodMonths > 24).length 
                      }
                    ].map((period, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="flex-1 text-sm">{period.label}</span>
                        <span className="font-semibold text-sm">{period.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* ROI Projects Table */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Investment Projects</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Investment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Returns
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ROI
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payback Period
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project) => {
                    const totalActualReturns = project.actualReturns.reduce((a, b) => a + b, 0);
                    
                    return (
                      <tr key={project.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${project.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'}`}
                          >
                            {project.status === 'in-progress' ? 'In Progress' : 
                              project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(project.initialInvestment)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(totalActualReturns)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${project.metrics.roi > 50 ? 'bg-green-100 text-green-800' : 
                                project.metrics.roi > 20 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}
                          >
                            {project.metrics.roi.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.metrics.paybackPeriodMonths < 1 ? 
                            '< 1 month' : 
                            project.metrics.paybackPeriodMonths < 12 ? 
                              `${Math.round(project.metrics.paybackPeriodMonths)} months` : 
                              `${(project.metrics.paybackPeriodMonths / 12).toFixed(1)} years`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ROIReportView;
