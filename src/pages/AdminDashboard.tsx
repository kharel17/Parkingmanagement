import React, { useState } from 'react';
import { useParkingContext } from '../context/ParkingContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import Navigation from '../components/Navigation';
import DashboardView from '../components/DashboardView';
import ParkingGrid from '../components/ParkingGrid/ParkingGrid';
import ParkingHistory from '../components/ParkingHistory';
import NotificationPanel from '../components/NotificationPanel';
import { Bell, LogOut, Sun, Moon, ParkingMeter, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { spots, selectedFloor, setSelectedFloor, parkingHistory } = useParkingContext();
  const { isDarkMode, toggleTheme } = useTheme();
  const { notifications } = useNotifications();
  const [activeView, setActiveView] = useState<'dashboard' | 'system' | 'history'>('dashboard');
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const navigate = useNavigate();

  const floors = ['B1', 'B2', 'B3'];
  const filledSpots = spots.filter(spot => spot.status === 'occupied').length;
  const totalSpots = spots.length;

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'system':
        return (
          <>
            {/* Floor Selection */}
            <div className="flex gap-2 mb-6">
              {floors.map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`
                    px-4 py-2 rounded-full transition-all duration-200
                    ${selectedFloor === floor
                      ? 'bg-primary text-white shadow-neon'
                      : 'bg-gray-100 dark:bg-background-darker text-gray-700 dark:text-white/70 hover:bg-primary/20'
                    }
                  `}
                >
                  {floor}
                </button>
              ))}
            </div>
            <ParkingGrid />
          </>
        );
      case 'history':
        return <ParkingHistory history={parkingHistory} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} transition-colors duration-200`}>
      <div className="min-h-screen bg-background-light dark:bg-gradient-to-br dark:from-background-dark dark:to-background-darker text-gray-900 dark:text-white">
        {/* Top Bar */}
        <div className="sticky top-0 bg-white/90 dark:bg-background-dark/90 backdrop-blur-lg border-b border-gray-200 dark:border-primary/20 p-4 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ParkingMeter className="w-8 h-8 text-primary" />
              <Building2 className="w-8 h-8 text-secondary" />
              <h1 className="text-2xl font-bold text-primary">Parking Manager</h1>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Status Summary */}
              <div className="text-sm">
                <span className="text-status-occupied">{filledSpots}</span>
                <span className="text-gray-500 dark:text-white/70"> / </span>
                <span className="text-status-available">{totalSpots}</span>
                <span className="text-gray-500 dark:text-white/70"> spots</span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-600" />
                )}
              </button>

              {/* Notification Bell */}
              <button
                onClick={() => setIsNotificationPanelOpen(true)}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                aria-label="Open notifications"
              >
                <Bell className="w-6 h-6 text-secondary" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-status-occupied rounded-full" />
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-4 space-y-6">
          <Navigation activeView={activeView} onViewChange={setActiveView} />
          {renderActiveView()}
        </main>

        {/* Notification Panel */}
        <NotificationPanel
          isOpen={isNotificationPanelOpen}
          onClose={() => setIsNotificationPanelOpen(false)}
          notifications={notifications}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;