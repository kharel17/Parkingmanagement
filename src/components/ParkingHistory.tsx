import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Car, Bike, Filter } from 'lucide-react';

interface ParkingRecord {
  id: string;
  spotId: string;
  licensePlate: string;
  vehicleType: 'car' | 'bike';
  entryTime: Date;
  exitTime: Date;
  fare: number;
}

interface ParkingHistoryProps {
  history: ParkingRecord[];
}

const ParkingHistory: React.FC<ParkingHistoryProps> = ({ history }) => {
  const [dateFilter, setDateFilter] = useState<string>('');
  const [vehicleFilter, setVehicleFilter] = useState<'all' | 'car' | 'bike'>('all');

  const filteredHistory = history.filter(record => {
    const matchesDate = dateFilter 
      ? format(record.entryTime, 'yyyy-MM-dd') === dateFilter 
      : true;
    const matchesVehicle = vehicleFilter === 'all' 
      ? true 
      : record.vehicleType === vehicleFilter;
    return matchesDate && matchesVehicle;
  });

  return (
    <div className="bg-white dark:bg-background-darker rounded-lg shadow-lg p-4 overflow-hidden">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Parking History</h2>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1.5 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-secondary" />
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value as 'all' | 'car' | 'bike')}
            className="rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1.5 text-sm"
          >
            <option value="all">All Vehicles</option>
            <option value="car">Cars Only</option>
            <option value="bike">Bikes Only</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white/70 uppercase tracking-wider">
                Spot ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white/70 uppercase tracking-wider">
                License Plate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white/70 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white/70 uppercase tracking-wider">
                Entry Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white/70 uppercase tracking-wider">
                Exit Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white/70 uppercase tracking-wider">
                Fare
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {filteredHistory.map((record) => (
              <motion.tr
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {record.spotId}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {record.licensePlate}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    {record.vehicleType === 'car' ? (
                      <Car className="w-4 h-4" />
                    ) : (
                      <Bike className="w-4 h-4" />
                    )}
                    {record.vehicleType}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {format(record.entryTime, 'PPp')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {format(record.exitTime, 'PPp')}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-primary">
                  Nrs. {record.fare}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredHistory.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-white/50">
            No parking records found
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingHistory;