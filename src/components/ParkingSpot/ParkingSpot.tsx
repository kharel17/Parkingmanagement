import React from 'react';
import { Car, Bike } from 'lucide-react';
import { useParkingContext } from '../../context/ParkingContext';

interface ParkingSpotProps {
  id: string;
  type: 'car' | 'bike';
  status: 'available' | 'occupied' | 'reserved';
  vehicle?: {
    licensePlate: string;
    entryTime: Date;
  };
  onClick: () => void;
}

const ParkingSpot: React.FC<ParkingSpotProps> = ({ id, type, status, vehicle, onClick }) => {
  const statusColors = {
    available: 'bg-status-available hover:bg-status-available/80',
    occupied: 'bg-status-occupied hover:bg-status-occupied/80',
    reserved: 'bg-status-reserved hover:bg-status-reserved/80',
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full aspect-square rounded-lg ${statusColors[status]}
        transition-all duration-200 ease-in-out
        hover:scale-105 hover:shadow-neon
        flex items-center justify-center
        p-4
      `}
      aria-label={`Parking spot ${id} - ${status}`}
    >
      <div className="flex flex-col items-center gap-2">
        {type === 'car' ? (
          <Car className="w-8 h-8 text-white" />
        ) : (
          <Bike className="w-8 h-8 text-white" />
        )}
        <span className="text-white font-semibold">{id}</span>
        {vehicle && (
          <span className="text-xs text-white/80 absolute bottom-2">
            {vehicle.licensePlate}
          </span>
        )}
      </div>
    </button>
  );
};

export default ParkingSpot;