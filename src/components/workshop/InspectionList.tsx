import React from 'react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Eye, ClipboardList, Clock, Calendar, User, AlertTriangle, CheckCircle, Edit } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

interface InspectionListProps {
  status: 'active' | 'completed';
}

// Mock inspection data
const mockInspections = [
  {
    id: 'insp-1',
    vehicleId: '28H',
    type: 'Pre-Trip Inspection',
    inspector: 'Jonathan Bepete',
    date: '2025-07-15',
    status: 'in_progress',
    issues: 2,
    critical: 1
  },
  {
    id: 'insp-2',
    vehicleId: '23H',
    type: 'Routine Inspection',
    inspector: 'Lovemore Qochiwe',
    date: '2025-07-14',
    status: 'completed',
    issues: 0,
    critical: 0
  },
  {
    id: 'insp-3',
    vehicleId: '31H',
    type: 'Safety Inspection',
    inspector: 'Peter Farai',
    date: '2025-07-13',
    status: 'failed',
    issues: 5,
    critical: 2
  }
];

const InspectionList: React.FC<InspectionListProps> = ({ status }) => {
  // Filter inspections based on status
  const filteredInspections = mockInspections.filter(insp => {
    if (status === 'active') {
      return insp.status === 'in_progress' || insp.status === 'failed';
    } else {
      return insp.status === 'completed';
    }
  });

  return (
    <Card>
      <CardHeader 
        title={`${status === 'active' ? 'Active' : 'Completed'} Inspections`} 
        action={
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search inspections..."
              />
            </div>
          </div>
        }
      />
      <CardContent>
        {filteredInspections.length === 0 ? (
          <div className="text-center py-8">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No inspections found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {status === 'active' ? 'No active inspections at the moment.' : 'No completed inspections to display.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInspections.map(inspection => (
              <div 
                key={inspection.id} 
                className={`p-4 rounded-lg border ${
                  inspection.status === 'completed' ? 'bg-green-50 border-green-200' :
                  inspection.status === 'failed' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{inspection.type} - Fleet {inspection.vehicleId}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Inspector</p>
                          <p className="font-medium">{inspection.inspector}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Inspection Date</p>
                          <p className="font-medium">{formatDate(inspection.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="font-medium flex items-center">
                            {inspection.status === 'completed' ? (
                              <><CheckCircle className="w-4 h-4 text-green-500 mr-1" /> Completed</>
                            ) : inspection.status === 'failed' ? (
                              <><AlertTriangle className="w-4 h-4 text-red-500 mr-1" /> Failed</>
                            ) : (
                              <><Clock className="w-4 h-4 text-yellow-500 mr-1" /> In Progress</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {inspection.issues > 0 && (
                      <div className="mt-3 flex items-center space-x-4">
                        <span className="text-sm text-red-600 font-medium">
                          {inspection.issues} issues found
                        </span>
                        {inspection.critical > 0 && (
                          <span className="text-sm bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">
                            {inspection.critical} critical
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<Eye className="w-4 h-4" />}
                    >
                      View
                    </Button>
                    {inspection.status !== 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Edit className="w-4 h-4" />}
                      >
                        Edit
                      </Button>
                    )}
                    {inspection.status === 'failed' && (
                      <Button
                        size="sm"
                        variant="primary"
                      >
                        Create Job Card
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InspectionList;