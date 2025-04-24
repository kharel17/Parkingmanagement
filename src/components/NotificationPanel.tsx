import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  message: string;
  time: string;
  type: 'entry' | 'exit' | 'system';
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-background-darker shadow-lg z-50"
      >
        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold dark:text-white">Notifications</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-white/50">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-b border-gray-100 dark:border-white/10"
              >
                <p className="text-gray-800 dark:text-white mb-1">{notification.message}</p>
                <p className="text-sm text-gray-500 dark:text-white/50">{notification.time}</p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPanel;