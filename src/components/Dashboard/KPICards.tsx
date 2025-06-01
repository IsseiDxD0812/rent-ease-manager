
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Package, Calendar, AlertTriangle, Wrench } from 'lucide-react';

const KPICards = () => {
  const { equipment, rentals, maintenance } = useData();

  const totalEquipment = equipment.length;
  const availableEquipment = equipment.filter(eq => eq.status === 'Available').length;
  const rentedEquipment = equipment.filter(eq => eq.status === 'Rented').length;
  const maintenanceEquipment = equipment.filter(eq => eq.status === 'Maintenance').length;

  const activeRentals = rentals.filter(r => r.status === 'Rented' || r.status === 'Reserved').length;
  const overdueRentals = rentals.filter(r => r.status === 'Overdue').length;

  // Calculate upcoming maintenance (next 7 days)
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingMaintenance = maintenance.filter(m => {
    const maintenanceDate = new Date(m.date);
    return maintenanceDate >= today && maintenanceDate <= nextWeek;
  }).length;

  const cards = [
    {
      title: 'Total Equipment',
      value: totalEquipment,
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      description: `${availableEquipment} Available, ${rentedEquipment} Rented, ${maintenanceEquipment} In Maintenance`
    },
    {
      title: 'Active Rentals',
      value: activeRentals,
      icon: Calendar,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      description: `${rentals.filter(r => r.status === 'Reserved').length} Reserved, ${rentals.filter(r => r.status === 'Rented').length} Currently Rented`
    },
    {
      title: 'Overdue Rentals',
      value: overdueRentals,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
      description: overdueRentals > 0 ? 'Require immediate attention' : 'All rentals on time'
    },
    {
      title: 'Upcoming Maintenance',
      value: upcomingMaintenance,
      icon: Wrench,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      description: 'Scheduled for next 7 days'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index} 
            className={`relative overflow-hidden shadow-xl rounded-2xl border-0 bg-gradient-to-br ${card.bgGradient} backdrop-blur-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group`}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-r ${card.gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-110 transition-transform duration-300">
                    {card.value}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
            
            {/* Hover effect border */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}></div>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;
