import React from 'react';
import { LayoutDashboard, Settings, History } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationProps {
  activeView: 'dashboard' | 'system' | 'history';
  onViewChange: (view: 'dashboard' | 'system' | 'history') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="flex gap-4 mb-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewChange('dashboard')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
          ${activeView === 'dashboard'
            ? 'bg-primary text-white shadow-neon'
            : 'bg-gray-100 dark:bg-background-darker text-gray-700 dark:text-white/70 hover:bg-primary/20'
          }
        `}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Dashboard</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewChange('system')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
          ${activeView === 'system'
            ? 'bg-primary text-white shadow-neon'
            : 'bg-gray-100 dark:bg-background-darker text-gray-700 dark:text-white/70 hover:bg-primary/20'
          }
        `}
      >
        <Settings className="w-5 h-5" />
        <span>System</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewChange('history')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
          ${activeView === 'history'
            ? 'bg-primary text-white shadow-neon'
            : 'bg-gray-100 dark:bg-background-darker text-gray-700 dark:text-white/70 hover:bg-primary/20'
          }
        `}
      >
        <History className="w-5 h-5" />
        <span>History</span>
      </motion.button>
    </div>
  );
};

export default Navigation;