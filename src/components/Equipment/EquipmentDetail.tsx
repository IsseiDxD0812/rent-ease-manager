
import React from 'react';
import { useData, Equipment } from '../../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User } from 'lucide-react';

interface EquipmentDetailProps {
  equipment: Equipment;
  onClose: () => void;
}

const EquipmentDetail: React.FC<EquipmentDetailProps> = ({ equipment, onClose }) => {
  const { rentals, maintenance } = useData();

  // Get rental history for this equipment
  const equipmentRentals = rentals.filter(rental => rental.equipmentId === equipment.id);
  
  // Get maintenance history for this equipment
  const equipmentMaintenance = maintenance.filter(record => record.equipmentId === equipment.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Rented':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRentalStatusColor = (status: string) => {
    switch (status) {
      case 'Reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rented':
        return 'bg-blue-100 text-blue-800';
      case 'Returned':
        return 'bg-green-100 text-green-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onClose} className="mr-3">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium text-gray-900">Equipment Details</h2>
        </div>
      </div>

      <div className="p-6">
        {/* Equipment Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="text-sm text-gray-900">{equipment.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Category</label>
                <p className="text-sm text-gray-900">{equipment.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Condition</label>
                <Badge className={getConditionColor(equipment.condition)}>
                  {equipment.condition}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <Badge className={getStatusColor(equipment.status)}>
                  {equipment.status}
                </Badge>
              </div>
              {equipment.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Description</label>
                  <p className="text-sm text-gray-900">{equipment.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Rental History */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rental History</h3>
            {equipmentRentals.length > 0 ? (
              <div className="space-y-3">
                {equipmentRentals.slice(0, 5).map((rental) => (
                  <div key={rental.id} className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {rental.customerName}
                        </span>
                      </div>
                      <Badge className={getRentalStatusColor(rental.status)}>
                        {rental.status}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {rental.startDate} to {rental.endDate}
                    </div>
                  </div>
                ))}
                {equipmentRentals.length > 5 && (
                  <p className="text-sm text-gray-500">
                    +{equipmentRentals.length - 5} more rentals
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No rental history available</p>
            )}
          </div>
        </div>

        {/* Maintenance History */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance History</h3>
          {equipmentMaintenance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {equipmentMaintenance.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No maintenance history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
