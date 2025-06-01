
import React, { useState, useEffect } from 'react';
import { useData, Equipment } from '../../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface EquipmentFormProps {
  equipment?: Equipment;
  onClose: () => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipment, onClose }) => {
  const { addEquipment, updateEquipment } = useData();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    condition: 'Good' as Equipment['condition'],
    status: 'Available' as Equipment['status'],
    description: ''
  });

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        category: equipment.category,
        condition: equipment.condition,
        status: equipment.status,
        description: equipment.description || ''
      });
    }
  }, [equipment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (equipment) {
      updateEquipment(equipment.id, formData);
    } else {
      addEquipment(formData);
    }
    
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          {equipment ? 'Edit Equipment' : 'Add New Equipment'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Equipment Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter equipment name"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              type="text"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="e.g., Heavy Machinery, Construction"
              required
            />
          </div>

          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Rented">Rented</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter equipment description (optional)"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {equipment ? 'Update Equipment' : 'Add Equipment'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EquipmentForm;
