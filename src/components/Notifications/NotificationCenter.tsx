
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Info, AlertTriangle, CheckCircle, X } from 'lucide-react';

const NotificationCenter: React.FC = () => {
  const { notifications, markNotificationRead } = useData();

  const getNotificationIcon = (type: string) => {
    const icons = {
      info: <Info className="h-5 w-5 text-blue-500" />,
      success: <CheckCircle className="h-5 w-5 text-green-500" />,
      warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      error: <X className="h-5 w-5 text-red-500" />
    };
    return icons[type as keyof typeof icons] || icons.info;
  };

  const getNotificationBg = (type: string) => {
    const backgrounds = {
      info: 'bg-blue-50 border-blue-200',
      success: 'bg-green-50 border-green-200',
      warning: 'bg-yellow-50 border-yellow-200',
      error: 'bg-red-50 border-red-200'
    };
    return backgrounds[type as keyof typeof backgrounds] || backgrounds.info;
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6" />
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          {unreadNotifications.length > 0 && (
            <Badge variant="destructive">
              {unreadNotifications.length} new
            </Badge>
          )}
        </div>
      </div>

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {unreadNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${getNotificationBg(notification.type)} ${
                  !notification.read ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-600">Previous Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {readNotifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border opacity-70 ${getNotificationBg(notification.type)}`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {readNotifications.length > 10 && (
              <p className="text-center text-sm text-gray-500">
                ... and {readNotifications.length - 10} more notifications
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {notifications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              You're all caught up! Notifications will appear here when there's activity.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationCenter;
