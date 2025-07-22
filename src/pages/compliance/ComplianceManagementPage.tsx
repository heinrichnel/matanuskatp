import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileBadge, 
  ClipboardCheck, 
  FileWarning,
  GraduationCap,
  FileSearch,
  AlertTriangle,
  FileType2
} from 'lucide-react';

/**
 * Compliance & Safety Management Page
 * Container for all compliance and safety related functionality
 */
const ComplianceManagementPage: React.FC = () => {
  const navigate = useNavigate();
  
  const complianceFeatures = [
    { name: 'Dashboard', icon: <ShieldCheck className="h-6 w-6" />, path: '/compliance' },
    { name: 'DOT Compliance', icon: <FileBadge className="h-6 w-6" />, path: '/compliance/dot' },
    { name: 'Safety Inspections', icon: <ClipboardCheck className="h-6 w-6" />, path: '/compliance/safety-inspections' },
    { name: 'Incident Reports', icon: <FileWarning className="h-6 w-6" />, path: '/compliance/incidents' },
    { name: 'Safety Training', icon: <GraduationCap className="h-6 w-6" />, path: '/compliance/training' },
    { name: 'Audit Management', icon: <FileSearch className="h-6 w-6" />, path: '/compliance/audits' },
    { name: 'Violation Tracking', icon: <AlertTriangle className="h-6 w-6" />, path: '/compliance/violations' },
    { name: 'Insurance Management', icon: <FileType2 className="h-6 w-6" />, path: '/compliance/insurance' }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Compliance & Safety</h1>
        <div className="flex space-x-2">
          <button
            onClick={onClick || (() => {})}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Report New Incident
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Export Compliance Reports
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 p-4">
          {complianceFeatures.map((feature, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center p-4 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={onClick || (() => {})}
            >
              <div className="p-2 bg-blue-100 rounded-full text-blue-600 mb-2">
                {feature.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{feature.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Outlet for nested routes */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default ComplianceManagementPage;
