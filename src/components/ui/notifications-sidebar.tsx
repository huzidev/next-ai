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
  const [isAnimating, setIsAnimating] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Add slight delay to ensure the element is mounted before animating
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => setIsVisible(false), 350);
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
        className={`fixed inset-0 bg-black/50 z-40 transition-all duration-350 ease-out ${
          isAnimating ? 'opacity-100 backdrop-blur-sm' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-gray-800/95 backdrop-blur-lg border-l border-gray-700/50 z-50 shadow-2xl transition-all duration-350 ease-out ${
          isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
        style={{
          transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div className={`p-4 border-b border-gray-700/50 transition-all duration-500 delay-100 ${
          isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-700/50 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
              className="w-full border-gray-600 text-gray-200 hover:bg-gray-700/50 transition-all duration-200 hover:scale-[0.98]"
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
              <div className={`text-center py-12 transition-all duration-700 delay-200 ${
                isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <Bell className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">No notifications yet</p>
                <p className="text-gray-500 text-xs">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:bg-gray-600/50 hover:scale-[0.99] hover:shadow-lg ${getNotificationBgColor(
                    notification.type,
                    notification.isRead
                  )} ${
                    isAnimating 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-8 opacity-0'
                  }`}
                  style={{
                    transitionDelay: `${150 + index * 50}ms`,
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-medium transition-colors duration-200 ${
                          notification.isRead ? 'text-gray-300' : 'text-white'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 animate-pulse" />
                        )}
                      </div>
                      
                      <p className={`text-sm mb-2 transition-colors duration-200 ${
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
