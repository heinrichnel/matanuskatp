import React, { useState } from 'react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { Check, Search, Filter, Download, MapPin, Camera, FileText, Clock } from 'lucide-react';
import Button from '../ui/Button';
import { useAppContext } from '../../context/AppContext';
import SyncIndicator from '../ui/SyncIndicator';

interface DeliveryConfirmation {
  id: string;
  tripId: string;
  timestamp: string;
  location: string;
  customer: string;
  signedBy: string;
  photoEvidence: boolean;
  docsUploaded: number;
  status: 'verified' | 'pending' | 'incomplete';
}

const DeliveryConfirmationPanel: React.FC = () => {
  const { isLoading } = useAppContext();
  const [filter, setFilter] = useState('all');

  // Mock data - would be fetched from Firestore in real implementation
  const deliveryConfirmations: DeliveryConfirmation[] = [
    {
      id: 'DEL-1001',
      tripId: 'TRP-2025001',
      timestamp: '2025-07-08 14:32',
      location: 'Walvis Bay Central',
      customer: 'Namibia Shipping Co.',
      signedBy: 'T. Johnson',
      photoEvidence: true,
      docsUploaded: 3,
      status: 'verified'
    },
    {
      id: 'DEL-1002',
      tripId: 'TRP-2025003',
      timestamp: '2025-07-08 11:15',
      location: 'Windhoek North Industrial',
      customer: 'Global Logistics Ltd.',
      signedBy: 'M. Shivute',
      photoEvidence: true,
      docsUploaded: 2,
      status: 'verified'
    },
    {
      id: 'DEL-1003',
      tripId: 'TRP-2025007',
      timestamp: '2025-07-08 09:47',
      location: 'Swakopmund Port',
      customer: 'Atlantic Freight',
      signedBy: 'S. Nangolo',
      photoEvidence: false,
      docsUploaded: 1,
      status: 'incomplete'
    },
    {
      id: 'DEL-1004',
      tripId: 'TRP-2025012',
      timestamp: '2025-07-07 16:23',
      location: 'Ondangwa Industrial Park',
      customer: 'Northern Distributors',
      signedBy: 'P. Amukoto',
      photoEvidence: true,
      docsUploaded: 0,
      status: 'pending'
    },
    {
      id: 'DEL-1005',
      tripId: 'TRP-2025015',
      timestamp: '2025-07-07 14:05',
      location: 'Oshakati Business Center',
      customer: 'Regional Supplies Inc.',
      signedBy: 'L. Haikali',
      photoEvidence: true,
      docsUploaded: 4,
      status: 'verified'
    }
  ];

  const statusCounts = {
    verified: deliveryConfirmations.filter(d => d.status === 'verified').length,
    pending: deliveryConfirmations.filter(d => d.status === 'pending').length,
    incomplete: deliveryConfirmations.filter(d => d.status === 'incomplete').length
  };

  const filteredDeliveries = filter === 'all' 
    ? deliveryConfirmations 
    : deliveryConfirmations.filter(d => d.status === filter);

  // Status badge styling helper
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'incomplete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Delivery Confirmations</h1>
          <p className="text-gray-600">Track and verify delivery proof documentation</p>
        </div>
        <div className="flex space-x-2 items-center">
          <SyncIndicator />
          <Button 
            variant="outline"
            icon={<Search className="w-4 h-4" />}
          >
            Search
          </Button>
          <Button 
            icon={<Download className="w-4 h-4" />}
            disabled={isLoading?.trips}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.verified}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full mr-4">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full mr-4">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Incomplete</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.incomplete}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex space-x-2 items-center pb-4">
        <Filter className="h-5 w-5 text-gray-500 mr-1" />
        <div className="flex space-x-2">
          <Button 
            size="sm"
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={onClick}
          >
            All
          </Button>
          <Button 
            size="sm"
            variant={filter === 'verified' ? 'primary' : 'outline'}
            onClick={onClick}
          >
            Verified
          </Button>
          <Button 
            size="sm"
            variant={filter === 'pending' ? 'primary' : 'outline'}
            onClick={onClick}
          >
            Pending
          </Button>
          <Button 
            size="sm"
            variant={filter === 'incomplete' ? 'primary' : 'outline'}
            onClick={onClick}
          >
            Incomplete
          </Button>
        </div>
      </div>

      {/* Delivery Confirmations Table */}
      <Card>
        <CardHeader title="Recent Delivery Confirmations" />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confirmation ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signed By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evidence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{delivery.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{delivery.tripId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{delivery.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{delivery.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{delivery.signedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        {delivery.photoEvidence && <Camera className="h-4 w-4 text-green-600" />}
                        {delivery.docsUploaded > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            <FileText className="h-3 w-3 mr-1" /> {delivery.docsUploaded}
                          </span>
                        )}
                        <MapPin className="h-4 w-4 text-gray-500" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(delivery.status)}`}>
                        {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        View
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

export default DeliveryConfirmationPanel;
