import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/FormElements';
import { Plus } from 'lucide-react';

interface Fault {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export const FaultManagement: React.FC = () => {
  const [faults] = React.useState<Fault[]>([]);
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [filterPriority, setFilterPriority] = React.useState('all');

  const filteredFaults = faults.filter(fault => {
    const statusMatch = filterStatus === 'all' || fault.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || fault.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge className="bg-red-100 text-red-800">Open</Badge>;
      case 'in_progress': return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'resolved': return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fault Management</h1>
          <p className="text-gray-600">Track and resolve faults efficiently</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Fault
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Open', value: 'open' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Resolved', value: 'resolved' }
              ]}
            />
            <Select
              label="Priority"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              options={[
                { label: 'All Priorities', value: 'all' },
                { label: 'Critical', value: 'critical' },
                { label: 'High', value: 'high' },
                { label: 'Medium', value: 'medium' },
                { label: 'Low', value: 'low' }
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredFaults.map(fault => (
          <Card key={fault.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg">{fault.title}</h3>
                    {getStatusBadge(fault.status)}
                    {getPriorityBadge(fault.priority)}
                  </div>
                  <p className="text-sm text-gray-600">{fault.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Created: {new Date(fault.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">Updated: {new Date(fault.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FaultManagement;
