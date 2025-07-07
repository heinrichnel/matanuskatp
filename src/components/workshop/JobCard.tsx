import React, { useState } from 'react';
import JobCardHeader from './JobCardHeader';
import TaskManager from './TaskManager';
import InventoryPanel from './InventoryPanel';
import JobCardNotes from './JobCardNotes';
import CompletionPanel from './CompletionPanel';

// Mock data for a job card
const mockJobCard = {
  id: 'jc123',
  workOrderNumber: 'JC-2025-0042',
  vehicleId: '28H',
  customerName: 'Internal Service',
  priority: 'high' as const,
  status: 'in_progress' as const,
  createdDate: '2025-06-28',
  scheduledDate: '2025-06-30',
  assignedTo: 'John Smith - Senior Mechanic',
  estimatedCompletion: '4 hours',
  workDescription: 'Replace brake pads and inspect rotors',
  estimatedHours: 4,
  laborRate: 250,
  partsCost: 1500,
  totalEstimate: 2500,
  notes: []
};

// Mock tasks for the job card
const mockTasks = [
  {
    id: 't1',
    title: 'Remove wheels',
    description: 'Remove all wheels to access brake assemblies',
    category: 'Brakes',
    estimatedHours: 0.5,
    status: 'completed' as const,
    assignedTo: 'John Smith - Senior Mechanic',
    isCritical: false
  },
  {
    id: 't2',
    title: 'Replace brake pads',
    description: 'Install new brake pads on all wheels',
    category: 'Brakes',
    estimatedHours: 2,
    status: 'in_progress' as const,
    assignedTo: 'John Smith - Senior Mechanic',
    isCritical: true,
    parts: [
      { partName: 'Front Brake Pads', quantity: 1, isRequired: true },
      { partName: 'Rear Brake Pads', quantity: 1, isRequired: true }
    ]
  },
  {
    id: 't3',
    title: 'Inspect rotors',
    description: 'Check rotors for wear or damage',
    category: 'Brakes',
    estimatedHours: 0.5,
    status: 'pending' as const,
    isCritical: true
  },
  {
    id: 't4',
    title: 'Reassemble',
    description: 'Reinstall wheels and torque to spec',
    category: 'Brakes',
    estimatedHours: 1,
    status: 'pending' as const,
    isCritical: false
  }
];

// Mock parts
const mockAssignedParts = [
  {
    id: 'a1',
    itemId: 'p1',
    quantity: 1,
    assignedAt: '2025-06-28T10:30:00Z',
    assignedBy: 'John Smith',
    status: 'assigned' as const
  }
];

// Mock notes
const mockNotes = [
  {
    id: 'n1',
    text: 'Customer reports squeaking from front brakes during braking',
    createdBy: 'Service Advisor',
    createdAt: '2025-06-28T09:15:00Z',
    type: 'customer' as const
  },
  {
    id: 'n2',
    text: 'Confirmed brake pads are worn beyond service limit. Recommend replacement of all pads and inspection of rotors.',
    createdBy: 'John Smith - Senior Mechanic',
    createdAt: '2025-06-28T10:00:00Z',
    type: 'technician' as const
  }
];

const JobCard: React.FC = () => {
  const [jobCard, setJobCard] = useState(mockJobCard);
  const [tasks, setTasks] = useState(mockTasks);
  const [assignedParts, setAssignedParts] = useState(mockAssignedParts);
  const [notes, setNotes] = useState(mockNotes);
  
  // Handler functions for tasks
  const handleTaskUpdate = (taskId: string, updates: any) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };
  
  const handleTaskAdd = (task: any) => {
    const newTask = {
      ...task,
      id: `t${Date.now()}`
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };
  
  const handleTaskDelete = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };
  
  // Handler functions for parts
  const handleAssignPart = (partId: string, quantity: number) => {
    const newAssignment = {
      id: `a${Date.now()}`,
      itemId: partId,
      quantity,
      assignedAt: new Date().toISOString(),
      assignedBy: 'Current User',
      status: 'assigned' as const
    };
    setAssignedParts(prevParts => [...prevParts, newAssignment]);
  };
  
  const handleRemovePart = (assignmentId: string) => {
    setAssignedParts(prevParts => prevParts.filter(part => part.id !== assignmentId));
  };
  
  const handleUpdatePart = (assignmentId: string, updates: any) => {
    setAssignedParts(prevParts => 
      prevParts.map(part => 
        part.id === assignmentId ? { ...part, ...updates } : part
      )
    );
  };
  
  // Handler functions for notes
  const handleAddNote = (text: string, type: 'general' | 'technician' | 'customer' | 'internal') => {
    const newNote = {
      id: `n${Date.now()}`,
      text,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      type
    };
    setNotes(prevNotes => [...prevNotes, newNote]);
  };
  
  const handleEditNote = (id: string, text: string) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id ? { ...note, text } : note
      )
    );
  };
  
  const handleDeleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };
  
  // Handler for job completion
  const handleCompleteJob = async (jobCardId: string) => {
    setJobCard(prev => ({ ...prev, status: 'completed' }));
    // In a real implementation, this would update Firestore
    return Promise.resolve();
  };
  
  // Handler for invoice generation
  const handleGenerateInvoice = async (jobCardId: string) => {
    // In a real implementation, this would create an invoice in Firestore
    alert(`Invoice generated for job card: ${jobCardId}`);
    return Promise.resolve();
  };
  
  return (
    <div className="space-y-6">
      <JobCardHeader 
        jobCard={jobCard}
        onBack={() => {}} // No-op for demo
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TaskManager
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskAdd={handleTaskAdd}
            onTaskDelete={handleTaskDelete}
          />
          
          <JobCardNotes
            notes={notes}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
          />
        </div>
        
        <div className="space-y-6">
          <InventoryPanel
            jobCardId={jobCard.id}
            assignedParts={assignedParts}
            onAssignPart={handleAssignPart}
            onRemovePart={handleRemovePart}
            onUpdatePart={handleUpdatePart}
          />
          
          <CompletionPanel
            jobCardId={jobCard.id}
            status={jobCard.status}
            tasks={tasks}
            onComplete={handleCompleteJob}
            onGenerateInvoice={handleGenerateInvoice}
          />
        </div>
      </div>
    </div>
  );
};

export default JobCard;