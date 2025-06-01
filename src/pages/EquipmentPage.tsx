
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import EquipmentList from '../components/Equipment/EquipmentList';
import EquipmentForm from '../components/Equipment/EquipmentForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const EquipmentPage = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your equipment inventory and track availability.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {user?.role === 'Admin' && (
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8">
        {showForm && user?.role === 'Admin' ? (
          <EquipmentForm onClose={() => setShowForm(false)} />
        ) : (
          <EquipmentList />
        )}
      </div>
    </div>
  );
};

export default EquipmentPage;
