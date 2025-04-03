import React from 'react';
import { useParkingContext } from '../context/ParkingContext';
import ParkingGrid from '../components/ParkingGrid/ParkingGrid';
import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { spots, selectedFloor, setSelectedFloor } = useParkingContext();
  const navigate = useNavigate();

  const floors = ['B1', 'B2', 'B3'];
  const filledSpots = spots.filter(spot => spot.status === 'occupied').length;
  const totalSpots = spots.length;

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-dark to-background-darker text-white">
      {/* Top Bar */}
      <div className="sticky top-0 bg-background-dark/90 backdrop-blur-lg border-b border-primary/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Parking Manager</h1>
          
          <div className="flex items-center gap-6">
            {/* Floor Selection */}
            <div className="flex gap-2">
              {floors.map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`
                    px-4 py-2 rounded-full transition-all duration-200
                    ${selectedFloor === floor
                      ? 'bg-primary text-white shadow-neon'
                      : 'bg-background-darker text-white/70 hover:bg-primary/20'
                    }
                  `}
                >
                  {floor}
                </button>
              ))}
            </div>

            {/* Status Summary */}
            <div className="text-sm">
              <span className="text-status-occupied">{filledSpots}</span>
              <span className="text-white/70"> / </span>
              <span className="text-status-available">{totalSpots}</span>
              <span className="text-white/70"> spots</span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 hover:bg-white/10 rounded-full transition-all duration-200">
              <Bell className="w-6 h-6 text-secondary" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-status-occupied rounded-full" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <ParkingGrid />
      </main>
    </div>
  );
};

export default AdminDashboard;