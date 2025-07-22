import React from 'react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import { Bell, CheckCircle, Inbox, Settings } from 'lucide-react';
import Button from '../components/ui/Button';

const NotificationsPage: React.FC = () => {
  // In a real implementation, this would fetch notifications from Firestore
  const notifications = [
    {
      id: '1',
      title: 'Trip Completed',
      message: 'Trip for Fleet 21H has been marked as completed.',
      date: '2025-07-08T14:30:00Z',
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: 'Tyre Inspection Due',
      message: 'Scheduled tyre inspection for Fleet 23H is due tomorrow.',
      date: '2025-07-07T10:15:00Z',
      read: true,
      type: 'warning'
    },
    {
      id: '3',
      title: 'Invoice Payment Received',
      message: 'Payment received for invoice INV-2025-0042.',
      date: '2025-07-06T16:45:00Z',
      read: false,
      type: 'success'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with important system alerts and updates</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" icon={<CheckCircle className="w-4 h-4" />}>
            Mark All as Read
          </Button>
          <Button variant="outline" icon={<Settings className="w-4 h-4" />}>
            Notification Settings
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader title="Recent Notifications" />
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Inbox className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <Bell className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className={`text-sm font-medium ${notification.read ? 'text-gray-900' : 'text-blue-800'}`}>
                        {notification.title}
                      </h3>
                      <p className={`mt-1 text-sm ${notification.read ? 'text-gray-600' : 'text-blue-700'}`}>
                        {notification.message}
                      </p>
                      <div className="mt-1 text-xs text-gray-500">
                        {new Date(notification.date).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <Button size="xs" variant="outline">
                        {notification.read ? 'Mark Unread' : 'Mark Read'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-blue-800 mb-4">About Notifications</h2>
        <p className="text-blue-700 mb-4">
          The notification system will keep you informed about important events across the platform:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-blue-700">
          <li>Trip status changes and completion alerts</li>
          <li>Maintenance and inspection reminders</li>
          <li>Driver behavior event notifications</li>
          <li>Payment confirmations and invoice updates</li>
          <li>System maintenance and update notifications</li>
        </ul>
        <p className="text-blue-700 mt-4">
          This feature is currently under development. In a production environment, notifications will be 
          fetched from Firestore with real-time updates.
        </p>
      </div>
    </div>
  );
};

export default NotificationsPage;