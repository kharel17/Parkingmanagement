import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface Vehicle {
  licensePlate: string;
  entryTime: Date;
}

interface ParkingSpot {
  id: string;
  type: 'car' | 'bike';
  status: 'available' | 'occupied' | 'reserved';
  floor: string;
  vehicle?: Vehicle;
}

interface ParkingContextType {
  spots: ParkingSpot[];
  selectedFloor: string;
  setSelectedFloor: (floor: string) => void;
  occupySpot: (spotId: string, licensePlate: string, type: 'car' | 'bike') => void;
  vacateSpot: (spotId: string) => void;
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
  }, []);

  const vacateSpot = useCallback((spotId: string) => {
    setSpots(currentSpots =>
      currentSpots.map(spot =>
        spot.id === spotId
          ? {
              ...spot,
              status: 'available',
              vehicle: undefined,
            }
          : spot
      )
    );
  }, []);

  const visibleSpots = useMemo(() => {
    return spots.filter(spot => spot.floor === selectedFloor);
  }, [spots, selectedFloor]);

  const value = {
    spots: visibleSpots,
    selectedFloor,
    setSelectedFloor,
    occupySpot,
    vacateSpot,
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