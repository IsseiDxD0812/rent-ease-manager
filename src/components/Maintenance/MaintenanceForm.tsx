
import React, { useState, useEffect } from 'react';
import { useData, Maintenance } from '../../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';

interface MaintenanceFormProps {
  maintenance?: Maintenance;
  onClose: () => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ maintenance, onClose }) => {
  const { addMaintenance, updateMaintenance, equipment } = useData();
  const [formData, setFormData] = useState({
    equipmentId: '',
    equipmentName: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Routine Check' as Maintenance['type'],
    notes: '',
    cost: 0
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (maintenance) {
      setFormData({
        equipmentId: maintenance.equipmentId,
        equipmentName: maintenance.equipmentName,
        date: maintenance.date,
        type: maintenance.type,
        notes: maintenance.notes,
        cost: maintenance.cost || 0
      });
      setSelectedDate(new Date(maintenance.date));
    }
  }, [maintenance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.equipmentId || !formData.notes.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const selectedEquipment = equipment.find(eq => eq.id === formData.equipmentId);
    if (!selectedEquipment) {
      alert('Please select valid equipment');
      return;
    }

    const maintenanceData = {
      ...formData,
      equipmentName: selectedEquipment.name,
      date: selectedDate.toISOString().split('T')[0]
    };

    if (maintenance) {
      updateMaintenance(maintenance.id, maintenanceData);
    } else {
      addMaintenance(maintenanceData);
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

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          {maintenance ? 'Edit Maintenance Record' : 'Add New Maintenance Record'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="equipment">Equipment *</Label>
            <Select value={formData.equipmentId} onValueChange={handleEquipmentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipment.map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.name} - {eq.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Maintenance Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="type">Maintenance Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Routine Check">Routine Check</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
                <SelectItem value="Overhaul">Overhaul</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cost">Cost ($)</Label>
            <Input
              id="cost"
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes *</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Describe the maintenance work performed..."
            rows={4}
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {maintenance ? 'Update Record' : 'Add Record'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceForm;
