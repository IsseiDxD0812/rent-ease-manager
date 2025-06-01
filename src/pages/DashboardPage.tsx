
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import KPICards from '../components/Dashboard/KPICards';
import { Calendar, Package, AlertTriangle, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const DashboardPage = () => {
  const { user } = useAuth();
  const { equipment, rentals, notifications } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const recentNotifications = notifications.slice(0, 5);
  const overdueRentals = rentals.filter(r => r.status === 'Overdue');
  const availableEquipment = equipment.filter(eq => eq.status === 'Available').slice(0, 5);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-equipment':
        navigate('/equipment');
        toast({
          title: "Navigate to Equipment",
          description: "Use the 'Add Equipment' button to add new equipment",
        });
        break;
      case 'create-rental':
        navigate('/rentals');
        toast({
          title: "Navigate to Rentals",
          description: "Use the 'Create Rental' button to add new rental",
        });
        break;
      case 'schedule-maintenance':
        navigate('/maintenance');
        toast({
          title: "Navigate to Maintenance",
          description: "Use the 'Schedule Maintenance' button to add new maintenance",
        });
        break;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Enhanced Header with gradient and animations */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Welcome back, {user?.name}!
              </h1>
              <div className="flex items-center space-x-2 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <p className="text-gray-600 dark:text-gray-300">
                  Your equipment rental business is performing excellently today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <KPICards />

      {/* Main Content Grid with enhanced styling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-white/20 dark:border-gray-700/20">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              </div>
            </div>
            <div className="p-8">
              {recentNotifications.length > 0 ? (
                <div className="space-y-6">
                  {recentNotifications.map((notification, index) => (
                    <div key={notification.id} className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-700/30 transition-all duration-300 group">
                      <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 shadow-lg ${
                        notification.type === 'success' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                        notification.type === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        notification.type === 'error' ? 'bg-gradient-to-r from-red-400 to-pink-500' :
                        'bg-gradient-to-r from-blue-400 to-purple-500'
                      } group-hover:scale-125 transition-transform duration-300`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions & Status */}
        <div className="space-y-8">
          {/* Enhanced Quick Actions */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-white/20 dark:border-gray-700/20">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
              </div>
            </div>
            <div className="p-8 space-y-4">
              {user?.role === 'Admin' && (
                <button 
                  onClick={() => handleQuickAction('add-equipment')}
                  className="w-full flex items-center px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
                >
                  <Package className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium">Add Equipment</span>
                </button>
              )}
              <button 
                onClick={() => handleQuickAction('create-rental')}
                className="w-full flex items-center px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
              >
                <Calendar className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">Create Rental</span>
              </button>
              {(user?.role === 'Admin' || user?.role === 'Staff') && (
                <button 
                  onClick={() => handleQuickAction('schedule-maintenance')}
                  className="w-full flex items-center px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
                >
                  <AlertTriangle className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium">Schedule Maintenance</span>
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Overdue Rentals Alert */}
          {overdueRentals.length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200/50 dark:border-red-800/50 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-red-800 dark:text-red-200">
                  Overdue Rentals ({overdueRentals.length})
                </h3>
              </div>
              <div className="space-y-3">
                {overdueRentals.slice(0, 3).map((rental) => (
                  <div key={rental.id} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/30 rounded-xl">
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-300">{rental.equipmentName}</p>
                      <p className="text-sm text-red-600 dark:text-red-400">{rental.customerName}</p>
                    </div>
                  </div>
                ))}
                {overdueRentals.length > 3 && (
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">
                    +{overdueRentals.length - 3} more overdue rentals
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Available Equipment */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-900/20 dark:to-indigo-900/20 border-b border-white/20 dark:border-gray-700/20">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Available Equipment</h2>
              </div>
            </div>
            <div className="p-8">
              {availableEquipment.length > 0 ? (
                <div className="space-y-4">
                  {availableEquipment.map((equipment) => (
                    <div key={equipment.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-700/30 transition-all duration-300 group">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {equipment.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{equipment.category}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                        equipment.condition === 'Excellent' ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-200' :
                        equipment.condition === 'Good' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-800 dark:text-blue-200' :
                        equipment.condition === 'Fair' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-800 dark:text-yellow-200' :
                        'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-800 dark:text-red-200'
                      }`}>
                        {equipment.condition}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No equipment available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
