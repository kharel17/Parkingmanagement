import React, { useState } from 'react';
import { X } from 'lucide-react';

interface VehicleEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (licensePlate: string, type: 'car' | 'bike') => void;
  spotType: 'car' | 'bike';
}

const VehicleEntryModal: React.FC<VehicleEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  spotType,
}) => {
  const [licensePlate, setLicensePlate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(licensePlate, spotType);
    setLicensePlate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 w-full max-w-md border border-primary/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Park Vehicle</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="licensePlate" className="block text-sm font-medium text-white mb-1">
              License Plate Number
            </label>
            <input
              id="licensePlate"
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter license plate"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Vehicle Type
            </label>
            <div className="text-white/70">{spotType === 'car' ? 'Car' : 'Bike'}</div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-white px-4 py-2 rounded-lg shadow-neon hover:scale-105 transition-all duration-200 ease-in-out"
            >
              Park Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleEntryModal;