
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import EquipmentForm from './EquipmentForm';
import EquipmentDetail from './EquipmentDetail';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';

const EquipmentList = () => {
  const { user } = useAuth();
  const { equipment, deleteEquipment } = useData();
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [viewingEquipment, setViewingEquipment] = useState(null);

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

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      deleteEquipment(id);
    }
  };

  if (editingEquipment) {
    return (
      <EquipmentForm
        equipment={editingEquipment}
        onClose={() => setEditingEquipment(null)}
      />
    );
  }

  if (viewingEquipment) {
    return (
      <EquipmentDetail
        equipment={viewingEquipment}
        onClose={() => setViewingEquipment(null)}
      />
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Equipment Inventory</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Condition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {equipment.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500">{item.description}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getConditionColor(item.condition)}>
                    {item.condition}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingEquipment(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {user?.role === 'Admin' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingEquipment(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {equipment.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No equipment found. Add some equipment to get started.</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentList;
