import React from 'react';
import { Bell, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
  time: Date;
}

interface NotificationsProps {
  notifications: Notification[];
  hasNew: boolean;
  onClearNew: () => void;
}

export function Notifications({ notifications, hasNew, onClearNew }: NotificationsProps) {
  return (
    <Dialog onOpenChange={(open) => {
      if (open) onClearNew();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasNew && (
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500"></span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <div className="text-sm leading-6 text-gray-500">{notification.message}</div>
                  </div>
                  <div className="flex-none text-xs text-gray-500">{notification.time.toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 