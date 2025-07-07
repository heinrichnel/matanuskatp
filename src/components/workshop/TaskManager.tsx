import React, { useState } from 'react';
import Button from '../ui/Button';
import { CheckCircle, Clock, AlertTriangle, PenTool as Tool, X, Edit, Plus, Trash2, Save } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  estimatedHours: number;
  status: 'pending' | 'in_progress' | 'completed' | 'not_applicable';
  assignedTo?: string;
  notes?: string;
  actualHours?: number;
  parts?: {
    partName: string;
    quantity: number;
    isRequired: boolean;
  }[];
  isCritical: boolean;
}

interface TaskManagerProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskAdd: (task: Omit<Task, 'id'>) => void;
  onTaskDelete: (taskId: string) => void;
  readonly?: boolean;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onTaskUpdate,
  onTaskAdd,
  onTaskDelete,
  readonly = false
}) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Task>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    category: '',
    estimatedHours: 1,
    status: 'pending',
    isCritical: false,
    parts: []
  });
  
  // Technicians for assignment dropdown
  const technicians = [
    'John Smith - Senior Mechanic',
    'Maria Rodriguez - Technician',
    'David Johnson - Apprentice',
    'Sarah Williams - Specialist'
  ];
  
  // Task categories
  const categories = [
    'Engine',
    'Brakes',
    'Suspension',
    'Electrical',
    'Body',
    'Transmission',
    'Cooling',
    'Tires',
    'General'
  ];
  
  const startEditingTask = (task: Task) => {
    if (readonly) return;
    setEditingTaskId(task.id);
    setEditForm({ ...task });
  };
  
  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditForm({});
  };
  
  const saveTaskEdit = () => {
    if (!editingTaskId || !editForm) return;
    onTaskUpdate(editingTaskId, editForm);
    setEditingTaskId(null);
    setEditForm({});
  };
  
  const handleAddTask = () => {
    if (!newTask.title || !newTask.category) {
      alert('Task title and category are required.');
      return;
    }
    
    onTaskAdd(newTask);
    setShowAddForm(false);
    setNewTask({
      title: '',
      description: '',
      category: '',
      estimatedHours: 1,
      status: 'pending',
      isCritical: false,
      parts: []
    });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'not_applicable': return <X className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'not_applicable': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  const calculateCompletionStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const notApplicable = tasks.filter(task => task.status === 'not_applicable').length;
    
    const completionPercentage = total > 0 
      ? ((completed + notApplicable) / total) * 100 
      : 0;
    
    return {
      total,
      completed,
      inProgress,
      notApplicable,
      completionPercentage
    };
  };
  
  const stats = calculateCompletionStats();
  
  return (
    <div className="space-y-6">
      {/* Task Completion Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Task Completion</h3>
        <div className="flex items-center mb-2">
          <div className="flex-grow">
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-4 bg-blue-600 rounded-full"
                style={{ width: `${stats.completionPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="ml-4 whitespace-nowrap text-sm font-medium">
            {Math.round(stats.completionPercentage)}% Complete
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-4 text-center">
          <div>
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-lg font-bold">{stats.total}</div>
          </div>
          <div>
            <div className="text-sm text-green-600">Completed</div>
            <div className="text-lg font-bold">{stats.completed}</div>
          </div>
          <div>
            <div className="text-sm text-blue-600">In Progress</div>
            <div className="text-lg font-bold">{stats.inProgress}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">N/A</div>
            <div className="text-lg font-bold">{stats.notApplicable}</div>
          </div>
        </div>
      </div>
      
      {/* Task List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
          {!readonly && (
            <Button
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAddForm(true)}
            >
              Add Task
            </Button>
          )}
        </div>
        
        {tasks.length === 0 ? (
          <div className="p-6 text-center">
            <Tool className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new task.</p>
            {!readonly && (
              <div className="mt-4">
                <Button
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowAddForm(true)}
                >
                  Add Task
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={`p-4 hover:bg-gray-50 ${task.isCritical ? 'bg-red-50' : ''}`}
              >
                {editingTaskId === task.id ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <input
                        type="text"
                        className="flex-grow border rounded-md px-3 py-2 mr-2"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        placeholder="Task title"
                      />
                      
                      <select
                        className="border rounded-md px-3 py-2"
                        value={editForm.category || ''}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          className="w-full border rounded-md px-3 py-2"
                          value={editForm.status || 'pending'}
                          onChange={(e) => setEditForm({ 
                            ...editForm, 
                            status: e.target.value as Task['status'] 
                          })}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="not_applicable">Not Applicable</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assigned To
                        </label>
                        <select
                          className="w-full border rounded-md px-3 py-2"
                          value={editForm.assignedTo || ''}
                          onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })}
                        >
                          <option value="">Not assigned</option>
                          {technicians.map(tech => (
                            <option key={tech} value={tech}>{tech}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estimated Hours
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          className="w-full border rounded-md px-3 py-2"
                          value={editForm.estimatedHours || 0}
                          onChange={(e) => setEditForm({ 
                            ...editForm, 
                            estimatedHours: parseFloat(e.target.value) 
                          })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Critical
                        </label>
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            checked={editForm.isCritical || false}
                            onChange={(e) => setEditForm({ 
                              ...editForm, 
                              isCritical: e.target.checked 
                            })}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-700">
                            Mark as critical task
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        className="w-full border rounded-md px-3 py-2"
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        className="w-full border rounded-md px-3 py-2"
                        value={editForm.notes || ''}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        icon={<X className="w-4 h-4" />}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={saveTaskEdit}
                        icon={<Save className="w-4 h-4" />}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h4 className="text-md font-medium text-gray-900">{task.title}</h4>
                          {task.isCritical && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              CRITICAL
                            </span>
                          )}
                          <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusClass(task.status)}`}>
                            {task.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-1">
                          {task.category} • {task.estimatedHours} hour{task.estimatedHours !== 1 ? 's' : ''}
                        </p>
                        
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                        
                        {task.assignedTo && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Assigned to:</span> {task.assignedTo}
                          </p>
                        )}
                        
                        {task.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Notes:</span> {task.notes}
                          </p>
                        )}
                        
                        {task.parts && task.parts.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Parts needed:</p>
                            <ul className="text-sm text-gray-600 list-disc pl-5 mt-1">
                              {task.parts.map((part, index) => (
                                <li key={index}>
                                  {part.partName} ({part.quantity}) {part.isRequired ? '(Required)' : '(Optional)'}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      {!readonly && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingTask(task)}
                            icon={<Edit className="w-3 h-3" />}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => onTaskDelete(task.id)}
                            icon={<Trash2 className="w-3 h-3" />}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {!readonly && (
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
                          <select
                            className="border rounded-md px-2 py-1 text-sm"
                            value={task.status}
                            onChange={(e) => onTaskUpdate(task.id, { 
                              status: e.target.value as Task['status'] 
                            })}
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="not_applicable">Not Applicable</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700 mr-2">Assign:</span>
                          <select
                            className="border rounded-md px-2 py-1 text-sm"
                            value={task.assignedTo || ''}
                            onChange={(e) => onTaskUpdate(task.id, { assignedTo: e.target.value })}
                          >
                            <option value="">Not assigned</option>
                            {technicians.map(tech => (
                              <option key={tech} value={tech}>{tech}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Task Form */}
      {showAddForm && !readonly && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Add New Task</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <input
                type="text"
                className="flex-grow border rounded-md px-3 py-2 mr-2"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
              />
              
              <select
                className="border rounded-md px-3 py-2"
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newTask.status}
                  onChange={(e) => setNewTask({ 
                    ...newTask, 
                    status: e.target.value as Task['status'] 
                  })}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="not_applicable">Not Applicable</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={newTask.assignedTo || ''}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                >
                  <option value="">Not assigned</option>
                  {technicians.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  className="w-full border rounded-md px-3 py-2"
                  value={newTask.estimatedHours}
                  onChange={(e) => setNewTask({ 
                    ...newTask, 
                    estimatedHours: parseFloat(e.target.value) 
                  })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Critical
                </label>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={newTask.isCritical}
                    onChange={(e) => setNewTask({ 
                      ...newTask, 
                      isCritical: e.target.checked 
                    })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Mark as critical task
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full border rounded-md px-3 py-2"
                value={newTask.description || ''}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={2}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                icon={<X className="w-4 h-4" />}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddTask}
                icon={<Plus className="w-4 h-4" />}
                disabled={!newTask.title || !newTask.category}
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;