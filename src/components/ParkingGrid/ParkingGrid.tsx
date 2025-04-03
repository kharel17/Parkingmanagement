import React, { useState } from 'react';
import ParkingSpot from '../ParkingSpot/ParkingSpot';
import VehicleEntryModal from '../VehicleEntryModal';
import VehicleExitModal from '../VehicleExitModal';
import { useParkingContext } from '../../context/ParkingContext';

const ParkingGrid: React.FC = () => {
  const { spots, selectedFloor, occupySpot, vacateSpot } = useParkingContext();
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const handleSpotClick = (spotId: string) => {
    const spot = spots.find(s => s.id === spotId);
    if (!spot) return;

    setSelectedSpot(spotId);

    if (spot.status === 'occupied') {
      setIsExitModalOpen(true);
    } else if (spot.status === 'available') {
      setIsEntryModalOpen(true);
    }
  };

  const handleVehicleEntry = (licensePlate: string, type: 'car' | 'bike') => {
    if (selectedSpot) {
      occupySpot(selectedSpot, licensePlate, type);
    }
    setSelectedSpot(null);
  };

  const handleVehicleExit = () => {
    if (selectedSpot) {
      vacateSpot(selectedSpot);
    }
    setIsExitModalOpen(false);
    setSelectedSpot(null);
  };

  const selectedSpotData = selectedSpot 
    ? spots.find(s => s.id === selectedSpot)
    : null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
        {spots.map((spot) => (
          <ParkingSpot
            key={spot.id}
            id={spot.id}
            type={spot.type}
            status={spot.status}
            vehicle={spot.vehicle}
            onClick={() => handleSpotClick(spot.id)}
          />
        ))}
      </div>

      <VehicleEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => {
          setIsEntryModalOpen(false);
          setSelectedSpot(null);
        }}
        onSubmit={handleVehicleEntry}
        spotType={selectedSpotData?.type || 'car'}
      />

      <VehicleExitModal
        isOpen={isExitModalOpen}
        onClose={() => {
          setIsExitModalOpen(false);
          setSelectedSpot(null);
        }}
        onConfirm={handleVehicleExit}
        vehicle={selectedSpotData?.vehicle ? {
          ...selectedSpotData.vehicle,
          type: selectedSpotData.type
        } : undefined}
      />
    </>
  );
};

export default ParkingGrid;