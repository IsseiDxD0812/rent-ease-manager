
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RentalList from '../components/Rentals/RentalList';
import RentalForm from '../components/Rentals/RentalForm';
import RentalCalendar from '../components/Rentals/RentalCalendar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, List } from 'lucide-react';

const RentalsPage = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingRental, setEditingRental] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('list');

  const handleEdit = (rental: any) => {
    setEditingRental(rental);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRental(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Rentals Management</h1>
          <p className="mt-2 text-gray-600">
            Manage rental orders and track equipment usage.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Rental
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {showForm ? (
          <RentalForm 
            rental={editingRental} 
            onClose={handleCloseForm} 
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-96">
              <TabsTrigger value="list" className="flex items-center">
                <List className="h-4 w-4 mr-2" />
                List View
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Calendar View
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="mt-6">
              <RentalList onEdit={user?.role === 'Admin' ? handleEdit : undefined} />
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-6">
              <RentalCalendar />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default RentalsPage;
