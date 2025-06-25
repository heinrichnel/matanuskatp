import React, { useState } from 'react';
import ModalForm, { FormField } from '../ui/ModalForm';
import Button from '../ui/Button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../ui/Card';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

const ModalFormDemo: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'manager',
      department: 'engineering',
      joinDate: '2023-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'developer',
      department: 'engineering',
      joinDate: '2023-03-22',
      status: 'active'
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      role: 'designer',
      department: 'marketing',
      joinDate: '2023-05-10',
      status: 'inactive'
    }
  ]);

  // Form fields for add/edit user
  const getUserFormFields = (user?: User): FormField[] => [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter full name',
      required: true,
      value: user?.name || ''
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'text',
      placeholder: 'email@example.com',
      required: true,
      value: user?.email || ''
    },
    {
      id: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { label: 'Select a role', value: '' },
        { label: 'Manager', value: 'manager' },
        { label: 'Developer', value: 'developer' },
        { label: 'Designer', value: 'designer' },
        { label: 'Analyst', value: 'analyst' },
        { label: 'Administrator', value: 'admin' }
      ],
      value: user?.role || ''
    },
    {
      id: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      options: [
        { label: 'Select a department', value: '' },
        { label: 'Engineering', value: 'engineering' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Finance', value: 'finance' },
        { label: 'Human Resources', value: 'hr' },
        { label: 'Operations', value: 'operations' }
      ],
      value: user?.department || ''
    },
    {
      id: 'joinDate',
      label: 'Join Date',
      type: 'date',
      required: true,
      value: user?.joinDate || new Date().toISOString().split('T')[0]
    },
    {
      id: 'status',
      label: 'Active Status',
      type: 'checkbox',
      value: user ? user.status === 'active' : true
    }
  ];

  // View-only form fields
  const getViewFormFields = (user: User): FormField[] => [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      value: user.name,
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'text',
      value: user.email,
    },
    {
      id: 'role',
      label: 'Role',
      type: 'text',
      value: user.role === 'manager' ? 'Manager' :
             user.role === 'developer' ? 'Developer' :
             user.role === 'designer' ? 'Designer' :
             user.role === 'analyst' ? 'Analyst' :
             user.role === 'admin' ? 'Administrator' : user.role
    },
    {
      id: 'department',
      label: 'Department',
      type: 'text',
      value: user.department === 'engineering' ? 'Engineering' :
             user.department === 'marketing' ? 'Marketing' :
             user.department === 'finance' ? 'Finance' :
             user.department === 'hr' ? 'Human Resources' :
             user.department === 'operations' ? 'Operations' : user.department
    },
    {
      id: 'joinDate',
      label: 'Join Date',
      type: 'text',
      value: new Date(user.joinDate).toLocaleDateString()
    },
    {
      id: 'status',
      label: 'Status',
      type: 'text',
      value: user.status === 'active' ? 'Active' : 'Inactive'
    }
  ];

  // Delete confirmation form fields
  const getDeleteFormFields = (user: User): FormField[] => [
    {
      id: 'confirmation',
      label: `Type "${user.name}" to confirm deletion`,
      type: 'text',
      placeholder: user.name,
      required: true,
      value: ''
    }
  ];

  // Handle add user
  const handleAddUser = async (data: Record<string, any>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      joinDate: data.joinDate,
      status: data.status ? 'active' : 'inactive'
    };
    
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  // Handle edit user
  const handleEditUser = async (data: Record<string, any>) => {
    if (!selectedUser) return null;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser: User = {
      ...selectedUser,
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      joinDate: data.joinDate,
      status: data.status ? 'active' : 'inactive'
    };
    
    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id ? updatedUser : user
    ));
    
    return updatedUser;
  };

  // Handle delete user
  const handleDeleteUser = async (data: Record<string, any>) => {
    if (!selectedUser) return null;
    
    // Validate confirmation
    if (data.confirmation !== selectedUser.name) {
      throw new Error('Name confirmation does not match. Please try again.');
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
    return { success: true };
  };

  // Open edit modal
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader title="Users" />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.department.charAt(0).toUpperCase() + user.department.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="xs" 
                          variant="outline" 
                          icon={<Eye className="w-3 h-3" />}
                          onClick={() => openViewModal(user)}
                        >
                          View
                        </Button>
                        <Button 
                          size="xs" 
                          variant="outline" 
                          icon={<Edit className="w-3 h-3" />}
                          onClick={() => openEditModal(user)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="xs" 
                          variant="danger" 
                          icon={<Trash2 className="w-3 h-3" />}
                          onClick={() => openDeleteModal(user)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <ModalForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        description="Fill out the form below to add a new user to the system."
        fields={getUserFormFields()}
        onSubmit={handleAddUser}
        submitButtonText="Add User"
      />

      {/* Edit User Modal */}
      {selectedUser && (
        <ModalForm
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit User: ${selectedUser.name}`}
          fields={getUserFormFields(selectedUser)}
          onSubmit={handleEditUser}
          submitButtonText="Save Changes"
        />
      )}

      {/* View User Modal */}
      {selectedUser && (
        <ModalForm
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`User Details: ${selectedUser.name}`}
          fields={getViewFormFields(selectedUser)}
          onSubmit={() => Promise.resolve()} // No-op for view-only
          submitButtonText="Close"
          cancelButtonText="Back"
        />
      )}

      {/* Delete User Modal */}
      {selectedUser && (
        <ModalForm
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title={`Delete User: ${selectedUser.name}`}
          description="This action cannot be undone. All data associated with this user will be permanently removed from our servers."
          fields={getDeleteFormFields(selectedUser)}
          onSubmit={handleDeleteUser}
          submitButtonText="Delete User"
          cancelButtonText="Cancel"
        />
      )}
    </div>
  );
};

export default ModalFormDemo;