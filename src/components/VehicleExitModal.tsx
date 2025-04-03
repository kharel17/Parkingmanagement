import React from 'react';
import { X } from 'lucide-react';

interface VehicleExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehicle?: {
    licensePlate: string;
    entryTime: Date;
    type: 'car' | 'bike';
  };
}

const VehicleExitModal: React.FC<VehicleExitModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  vehicle,
}) => {
  if (!isOpen || !vehicle) return null;

  const calculateFare = (entryTime: Date) => {
    const now = new Date();
    const hours = Math.ceil((now.getTime() - entryTime.getTime()) / (1000 * 60 * 60));
    const rate = vehicle.type === 'car' ? 50 : 20;
    return hours * rate;
  };

  const fare = calculateFare(vehicle.entryTime);
  const duration = Math.ceil(
    (new Date().getTime() - vehicle.entryTime.getTime()) / (1000 * 60 * 60)
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 w-full max-w-md border border-primary/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Vehicle Exit</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-white/70">License Plate</p>
            <p className="text-white font-semibold">{vehicle.licensePlate}</p>
          </div>

          <div>
            <p className="text-white/70">Entry Time</p>
            <p className="text-white font-semibold">
              {vehicle.entryTime.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-white/70">Duration</p>
            <p className="text-white font-semibold">{duration} hour(s)</p>
          </div>

          <div>
            <p className="text-white/70">Rate</p>
            <p className="text-white font-semibold">
              Nrs. {vehicle.type === 'car' ? '50' : '20'}/hour
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-white/70">Total Fare</p>
            <p className="text-2xl font-bold text-primary">Nrs. {fare}</p>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-primary text-white px-4 py-2 rounded-lg shadow-neon hover:scale-105 transition-all duration-200 ease-in-out"
            >
              Confirm Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleExitModal;