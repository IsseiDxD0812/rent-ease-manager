
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Search, Trash2 } from 'lucide-react';

interface MaintenanceListProps {
  onEdit?: (maintenance: any) => void;
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({ onEdit }) => {
  const { maintenance } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredMaintenance = maintenance.filter(record => {
    const matchesSearch = record.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'Routine Check': 'default',
      'Repair': 'destructive',
      'Overhaul': 'secondary',
      'Emergency': 'destructive'
    };
    return <Badge variant={variants[type] || 'default'}>{type}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by equipment or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Routine Check">Routine Check</SelectItem>
            <SelectItem value="Repair">Repair</SelectItem>
            <SelectItem value="Overhaul">Overhaul</SelectItem>
            <SelectItem value="Emergency">Emergency</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Maintenance Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Cost</TableHead>
              {user?.role !== 'Customer' && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaintenance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={user?.role !== 'Customer' ? 6 : 5} className="text-center py-8 text-gray-500">
                  No maintenance records found
                </TableCell>
              </TableRow>
            ) : (
              filteredMaintenance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.equipmentName}</TableCell>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>{getTypeBadge(record.type)}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.notes}</TableCell>
                  <TableCell>${record.cost || 0}</TableCell>
                  {user?.role !== 'Customer' && (
                    <TableCell>
                      <div className="flex space-x-2">
                        {onEdit && (
                          <Button variant="ghost" size="sm" onClick={() => onEdit(record)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MaintenanceList;
