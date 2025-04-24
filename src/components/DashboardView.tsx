import React, { useMemo } from 'react';
import { useParkingContext } from '../context/ParkingContext';
import { Car, Bike, Clock, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardView = () => {
  const { parkingHistory } = useParkingContext();

  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const monthlyParkings = parkingHistory.filter(
      record => record.entryTime.getMonth() === currentMonth
    );

    const totalRevenue = parkingHistory.reduce((sum, record) => sum + record.fare, 0);
    const totalParkings = monthlyParkings.length;
    
    const bikeCount = monthlyParkings.filter(record => record.vehicleType === 'bike').length;
    const carCount = monthlyParkings.filter(record => record.vehicleType === 'car').length;
    
    const avgDuration = parkingHistory.length > 0
      ? parkingHistory.reduce((sum, record) => {
          const duration = (record.exitTime.getTime() - record.entryTime.getTime()) / (1000 * 60 * 60);
          return sum + duration;
        }, 0) / parkingHistory.length
      : 0;

    const licensePlateCount = parkingHistory.reduce((acc, record) => {
      acc[record.licensePlate] = (acc[record.licensePlate] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostRepeated = Object.entries(licensePlateCount).reduce(
      (max, [plate, count]) => (count > max.count ? { plate, count } : max),
      { plate: '', count: 0 }
    );

    return {
      revenue: totalRevenue,
      totalParkings,
      bikeCount,
      carCount,
      avgDuration: Math.round(avgDuration * 10) / 10,
      mostRepeated,
    };
  }, [parkingHistory]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Revenue Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-background-darker rounded-lg p-6 shadow-lg border border-gray-200 dark:border-primary/20"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Revenue</h3>
        <p className="text-3xl font-bold text-primary">Nrs. {stats.revenue}</p>
      </motion.div>

      {/* Total Parkings Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-background-darker rounded-lg p-6 shadow-lg border border-gray-200 dark:border-primary/20"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Total Parkings</h3>
        <p className="text-3xl font-bold text-primary">{stats.totalParkings}</p>
        <p className="text-sm text-gray-500 dark:text-white/50">This month</p>
      </motion.div>

      {/* Vehicle Type Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-background-darker rounded-lg p-6 shadow-lg border border-gray-200 dark:border-primary/20"
      >
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Bikes</h3>
            <p className="text-3xl font-bold text-primary">{stats.bikeCount}</p>
          </div>
          <Bike className="w-12 h-12 text-secondary opacity-50" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-background-darker rounded-lg p-6 shadow-lg border border-gray-200 dark:border-primary/20"
      >
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Cars</h3>
            <p className="text-3xl font-bold text-primary">{stats.carCount}</p>
          </div>
          <Car className="w-12 h-12 text-secondary opacity-50" />
        </div>
      </motion.div>

      {/* Average Duration Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-background-darker rounded-lg p-6 shadow-lg border border-gray-200 dark:border-primary/20"
      >
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Avg. Duration</h3>
            <p className="text-3xl font-bold text-primary">{stats.avgDuration}h</p>
          </div>
          <Clock className="w-12 h-12 text-secondary opacity-50" />
        </div>
      </motion.div>

      {/* Most Repeated Car Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-background-darker rounded-lg p-6 shadow-lg border border-gray-200 dark:border-primary/20"
      >
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Most Repeated</h3>
            <p className="text-3xl font-bold text-primary">{stats.mostRepeated.plate || 'N/A'}</p>
            {stats.mostRepeated.count > 0 && (
              <p className="text-sm text-gray-500 dark:text-white/50">
                {stats.mostRepeated.count} times
              </p>
            )}
          </div>
          <Repeat className="w-12 h-12 text-secondary opacity-50" />
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardView;