
import React, { useState, useEffect } from 'react';
import { useData, Rental } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';

interface RentalFormProps {
  rental?: Rental;
  onClose: () => void;
}

const RentalForm: React.FC<RentalFormProps> = ({ rental, onClose }) => {
  const { addRental, updateRental, equipment } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    equipmentId: '',
    customerId: user?.id || '',
    customerName: user?.name || '',
    equipmentName: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'Reserved' as Rental['status'],
    totalCost: 0
  });
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const availableEquipment = equipment.filter(eq => eq.status === 'Available' || (rental && eq.id === rental.equipmentId));

  useEffect(() => {
    if (rental) {
      setFormData({
        equipmentId: rental.equipmentId,
        customerId: rental.customerId,
        customerName: rental.customerName,
        equipmentName: rental.equipmentName,
        startDate: new Date(rental.startDate),
        endDate: new Date(rental.endDate),
        status: rental.status,
        totalCost: rental.totalCost || 0
      });
      setStartDate(new Date(rental.startDate));
      setEndDate(new Date(rental.endDate));
    }
  }, [rental]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.equipmentId || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (endDate <= startDate) {
      alert('End date must be after start date');
      return;
    }

    const selectedEquipment = equipment.find(eq => eq.id === formData.equipmentId);
    if (!selectedEquipment) {
      alert('Please select valid equipment');
      return;
    }

    const rentalData = {
      ...formData,
      equipmentName: selectedEquipment.name,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    if (rental) {
      updateRental(rental.id, rentalData);
    } else {
      addRental(rentalData);
    }
    
    onClose();
  };

  const handleEquipmentChange = (equipmentId: string) => {
    const selectedEquipment = equipment.find(eq => eq.id === equipmentId);
    if (selectedEquipment) {
      setFormData(prev => ({
        ...prev,
        equipmentId,
        equipmentName: selectedEquipment.name
      }));
    }
  };

  const calculateCost = () => {
    if (startDate && endDate) {
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const dailyRate = 100; // Default daily rate
      const cost = days * dailyRate;
      setFormData(prev => ({ ...prev, totalCost: cost }));
    }
  };

  useEffect(() => {
    calculateCost();
  }, [startDate, endDate]);

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          {rental ? 'Edit Rental' : 'Create New Rental'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="equipment">Equipment *</Label>
            <Select value={formData.equipmentId} onValueChange={handleEquipmentChange} disabled={!!rental}>
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {availableEquipment.map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.name} - {eq.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              placeholder="Enter customer name"
              required
              disabled={user?.role === 'Customer'}
            />
          </div>

          <div>
            <Label>Start Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : 'Pick start date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>End Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : 'Pick end date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => date < (startDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {user?.role !== 'Customer' && (
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reserved">Reserved</SelectItem>
                  <SelectItem value="Rented">Rented</SelectItem>
                  <SelectItem value="Returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="totalCost">Total Cost</Label>
            <Input
              id="totalCost"
              type="number"
              value={formData.totalCost}
              onChange={(e) => setFormData(prev => ({ ...prev, totalCost: Number(e.target.value) }))}
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {rental ? 'Update Rental' : 'Create Rental'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RentalForm;
