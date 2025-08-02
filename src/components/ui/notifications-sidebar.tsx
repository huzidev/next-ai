import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTimeAgo } from "@/utils/timeUtils";
import { Bell, CheckCheck, Shield, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'update';
  isRead: boolean;
  createdAt: Date | string;
  actionUrl?: string;
}

interface NotificationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onNotificationClick: (notification: Notification) => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCheck className="h-5 w-5 text-green-400" />;
    case 'warning':
      return <Shield className="h-5 w-5 text-yellow-400" />;
    case 'error':
      return <X className="h-5 w-5 text-red-400" />;
    case 'update':
      return <Sparkles className="h-5 w-5 text-purple-400" />;
    case 'info':
    default:
      return <Bell className="h-5 w-5 text-blue-400" />;
  }
};

const getNotificationBgColor = (type: Notification['type'], isRead: boolean) => {
  if (isRead) {
    return 'bg-gray-700/50 border-gray-600';
  }
  
  switch (type) {
    case 'success':
      return 'bg-green-900/20 border-green-700/50';
    case 'warning':
      return 'bg-yellow-900/20 border-yellow-700/50';
    case 'error':
      return 'bg-red-900/20 border-red-700/50';
    case 'update':
      return 'bg-purple-900/20 border-purple-700/50';
    case 'info':
    default:
      return 'bg-blue-900/20 border-blue-700/50';
  }
};

export function NotificationsSidebar({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick
}: NotificationsSidebarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick(notification);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-gray-800 border-l border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
              className="w-full border-gray-600 text-gray-200 hover:bg-gray-700"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
          <div className="p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">No notifications yet</p>
                <p className="text-gray-500 text-xs">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-gray-600/50 ${getNotificationBgColor(
                    notification.type,
                    notification.isRead
                  )}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-medium ${
                          notification.isRead ? 'text-gray-300' : 'text-white'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className={`text-sm mb-2 ${
                        notification.isRead ? 'text-gray-400' : 'text-gray-200'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
