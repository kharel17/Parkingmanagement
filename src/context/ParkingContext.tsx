import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useNotifications } from './NotificationContext';

interface Vehicle {
  licensePlate: string;
  entryTime: Date;
}

interface ParkingSpot {
  id: string;
  type: 'car' | 'bike';
  status: 'available' | 'occupied' | 'reserved' | 'problematic';
  floor: string;
  vehicle?: Vehicle;
}

interface ParkingRecord {
  id: string;
  spotId: string;
  licensePlate: string;
  vehicleType: 'car' | 'bike';
  entryTime: Date;
  exitTime: Date;
  fare: number;
}

interface ParkingContextType {
  spots: ParkingSpot[];
  selectedFloor: string;
  parkingHistory: ParkingRecord[];
  setSelectedFloor: (floor: string) => void;
  occupySpot: (spotId: string, licensePlate: string, type: 'car' | 'bike') => void;
  vacateSpot: (spotId: string) => void;
  markSpotProblematic: (spotId: string) => void;
  reserveSpot: (spotId: string) => void;
}

const generateInitialSpots = () => {
  const floors = ['B1', 'B2', 'B3'];
  const spotsPerFloor = 15;
  const spots: ParkingSpot[] = [];

  floors.forEach(floor => {
    for (let i = 1; i <= spotsPerFloor; i++) {
      const spotId = `${floor}-${i.toString().padStart(2, '0')}`;
      spots.push({
        id: spotId,
        type: i % 3 === 0 ? 'bike' : 'car',
        status: 'available',
        floor,
      });
    }
  });

  return spots;
};

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export function ParkingProvider({ children }: { children: React.ReactNode }) {
  const [spots, setSpots] = useState<ParkingSpot[]>(generateInitialSpots());
  const [selectedFloor, setSelectedFloor] = useState('B1');
  const [parkingHistory, setParkingHistory] = useState<ParkingRecord[]>([]);
  const { addNotification } = useNotifications();

  const occupySpot = useCallback((spotId: string, licensePlate: string, type: 'car' | 'bike') => {
    setSpots(currentSpots =>
      currentSpots.map(spot =>
        spot.id === spotId
          ? {
              ...spot,
              status: 'occupied',
              vehicle: {
                licensePlate,
                entryTime: new Date(),
              },
            }
          : spot
      )
    );
    addNotification(`Vehicle ${licensePlate} parked in spot ${spotId}`, 'entry');
  }, [addNotification]);

  const vacateSpot = useCallback((spotId: string) => {
    setSpots(currentSpots => {
      const spot = currentSpots.find(s => s.id === spotId);
      if (!spot?.vehicle) return currentSpots;

      const exitTime = new Date();
      const hours = Math.ceil(
        (exitTime.getTime() - spot.vehicle.entryTime.getTime()) / (1000 * 60 * 60)
      );
      const rate = spot.type === 'car' ? 50 : 20;
      const fare = hours * rate;

      setParkingHistory(prev => [
        {
          id: Date.now().toString(),
          spotId,
          licensePlate: spot.vehicle.licensePlate,
          vehicleType: spot.type,
          entryTime: spot.vehicle.entryTime,
          exitTime,
          fare,
        },
        ...prev,
      ]);

      addNotification(
        `Vehicle ${spot.vehicle.licensePlate} exited from spot ${spotId}. Fare: Nrs. ${fare}`,
        'exit'
      );

      return currentSpots.map(s =>
        s.id === spotId
          ? {
              ...s,
              status: 'available',
              vehicle: undefined,
            }
          : s
      );
    });
  }, [addNotification]);

  const markSpotProblematic = useCallback((spotId: string) => {
    setSpots(currentSpots =>
      currentSpots.map(spot =>
        spot.id === spotId
          ? {
              ...spot,
              status: 'problematic',
            }
          : spot
      )
    );
    addNotification(`Spot ${spotId} marked as problematic`, 'system');
  }, [addNotification]);

  const reserveSpot = useCallback((spotId: string) => {
    setSpots(currentSpots =>
      currentSpots.map(spot =>
        spot.id === spotId
          ? {
              ...spot,
              status: 'reserved',
            }
          : spot
      )
    );
    addNotification(`Spot ${spotId} has been reserved`, 'system');
  }, [addNotification]);

  const visibleSpots = useMemo(() => {
    return spots.filter(spot => spot.floor === selectedFloor);
  }, [spots, selectedFloor]);

  const value = {
    spots: visibleSpots,
    selectedFloor,
    parkingHistory,
    setSelectedFloor,
    occupySpot,
    vacateSpot,
    markSpotProblematic,
    reserveSpot,
  };

  return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>;
}

export function useParkingContext() {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParkingContext must be used within a ParkingProvider');
  }
  return context;
}