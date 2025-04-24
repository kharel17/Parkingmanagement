import React, { createContext, useContext, useState, useCallback } from 'react';

interface Notification {
  id: string;
  message: string;
  time: string;
  type: 'entry' | 'exit' | 'system';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: 'entry' | 'exit' | 'system') => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: 'entry' | 'exit' | 'system') => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      time: new Date().toLocaleTimeString(),
      type,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}