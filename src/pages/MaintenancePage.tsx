
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MaintenanceList from '../components/Maintenance/MaintenanceList';
import MaintenanceForm from '../components/Maintenance/MaintenanceForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const MaintenancePage = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<any>(null);

  const handleEdit = (maintenance: any) => {
    setEditingMaintenance(maintenance);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMaintenance(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Records</h1>
          <p className="mt-2 text-gray-600">
            Track equipment maintenance history and schedule future maintenance.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {user?.role !== 'Customer' && (
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Maintenance Record
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8">
        {showForm && user?.role !== 'Customer' ? (
          <MaintenanceForm 
            maintenance={editingMaintenance} 
            onClose={handleCloseForm} 
          />
        ) : (
          <MaintenanceList onEdit={user?.role !== 'Customer' ? handleEdit : undefined} />
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;
