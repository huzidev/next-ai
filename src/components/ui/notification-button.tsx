import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface NotificationButtonProps {
  hasUnread?: boolean;
  unreadCount?: number;
  onClick?: () => void;
}

export function NotificationButton({ hasUnread = false, unreadCount = 0, onClick }: NotificationButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-10 w-10 text-gray-400 hover:text-white hover:bg-gray-700"
      onClick={onClick}
    >
      <Bell className="h-5 w-5" />
      {hasUnread && unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 border-0"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
}
