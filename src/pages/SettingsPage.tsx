import React, { useState } from 'react';
import PageWrapper from '../components/ui/PageWrapper';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/FormElements';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Truck, 
  DollarSign,
  Save,
  RefreshCw
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // In a real implementation, these would be fetched from Firestore or context
  const [userSettings, setUserSettings] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'admin',
    theme: 'light',
    notificationsEnabled: true,
    emailNotifications: true,
    defaultCurrency: 'ZAR'
  });

  const handleSettingChange = (key: string, value: any) => {
    setUserSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real implementation, this would save to Firestore
    alert('Settings saved successfully');
  };

  return (
    <PageWrapper title="Settings">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Configure application preferences and user settings</p>
          </div>
          <Button 
            onClick={handleSaveSettings}
            icon={<Save className="w-4 h-4" />}
          >
            Save Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <Card className="md:col-span-1">
            <CardContent className="p-0">
              <nav className="space-y-1">
                <button
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                
                <button
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </button>
                
                <button
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${activeTab === 'security' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('security')}
                >
                  <Shield className="w-5 h-5" />
                  <span>Security</span>
                </button>
                
                <button
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${activeTab === 'data' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('data')}
                >
                  <Database className="w-5 h-5" />
                  <span>Data Management</span>
                </button>
                
                <button
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${activeTab === 'fleet' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('fleet')}
                >
                  <Truck className="w-5 h-5" />
                  <span>Fleet Defaults</span>
                </button>
                
                <button
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${activeTab === 'billing' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('billing')}
                >
                  <DollarSign className="w-5 h-5" />
                  <span>Billing & Currency</span>
                </button>
                
                <button
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 ${activeTab === 'system' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('system')}
                >
                  <Settings className="w-5 h-5" />
                  <span>System</span>
                </button>
              </nav>
            </CardContent>
          </Card>

          {/* Settings Content */}
          <Card className="md:col-span-3">
            <CardHeader title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + ' Settings'} />
            <CardContent>
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={userSettings.name}
                    onChange={(value) => handleSettingChange('name', value)}
                  />
                  
                  <Input
                    label="Email Address"
                    value={userSettings.email}
                    onChange={(value) => handleSettingChange('email', value)}
                    type="email"
                  />
                  
                  <Select
                    label="User Role"
                    value={userSettings.role}
                    onChange={(value) => handleSettingChange('role', value)}
                    options={[
                      { label: 'Administrator', value: 'admin' },
                      { label: 'Manager', value: 'manager' },
                      { label: 'Operator', value: 'operator' },
                      { label: 'Viewer', value: 'viewer' }
                    ]}
                  />
                  
                  <div className="pt-4 border-t mt-6">
                    <Button>Update Profile</Button>
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Enable Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={userSettings.notificationsEnabled}
                        onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={userSettings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="pt-4 border-t mt-6">
                    <Button>Save Notification Settings</Button>
                  </div>
                </div>
              )}
              
              {activeTab === 'billing' && (
                <div className="space-y-4">
                  <Select
                    label="Default Currency"
                    value={userSettings.defaultCurrency}
                    onChange={(value) => handleSettingChange('defaultCurrency', value)}
                    options={[
                      { label: 'South African Rand (ZAR)', value: 'ZAR' },
                      { label: 'US Dollar (USD)', value: 'USD' }
                    ]}
                  />
                  
                  <div className="pt-4 border-t mt-6">
                    <Button>Save Currency Settings</Button>
                  </div>
                </div>
              )}
              
              {activeTab === 'system' && (
                <div className="space-y-4">
                  <Select
                    label="Theme"
                    value={userSettings.theme}
                    onChange={(value) => handleSettingChange('theme', value)}
                    options={[
                      { label: 'Light', value: 'light' },
                      { label: 'Dark', value: 'dark' },
                      { label: 'System Default', value: 'system' }
                    ]}
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Clear Application Cache</span>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<RefreshCw className="w-4 h-4" />}
                    >
                      Clear Cache
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t mt-6">
                    <Button>Save System Settings</Button>
                  </div>
                </div>
              )}
              
              {(activeTab === 'security' || activeTab === 'data' || activeTab === 'fleet') && (
                <div className="text-center py-8">
                  <Settings className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Coming Soon</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This settings section is currently under development.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-blue-800 mb-4">About Settings</h2>
          <p className="text-blue-700 mb-4">
            The settings page allows you to customize the application to suit your needs and preferences. 
            In a production environment, these settings would be synchronized with Firestore.
          </p>
          <p className="text-blue-700">
            This feature is currently under development and some options may not be fully functional yet.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SettingsPage;