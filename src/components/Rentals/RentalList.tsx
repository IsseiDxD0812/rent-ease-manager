
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Trash2, Search } from 'lucide-react';

interface RentalListProps {
  onEdit?: (rental: any) => void;
  onView?: (rental: any) => void;
}

const RentalList: React.FC<RentalListProps> = ({ onEdit, onView }) => {
  const { rentals, updateRental, equipment } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRentals = rentals.filter(rental => {
    const matchesSearch = rental.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rental.equipmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'Reserved': 'outline',
      'Rented': 'default',
      'Returned': 'secondary',
      'Overdue': 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const handleStatusUpdate = (rentalId: string, newStatus: string) => {
    updateRental(rentalId, { status: newStatus as any });
  };

  const isOverdue = (endDate: string, status: string) => {
    if (status === 'Returned') return false;
    return new Date(endDate) < new Date();
  };

  const isStaffOrAdmin = user?.role === 'Admin' || user?.role === 'Staff';
  const isAdmin = user?.role === 'Admin';
  const isCustomer = user?.role === 'Customer';

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by customer or equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Reserved">Reserved</SelectItem>
            <SelectItem value="Rented">Rented</SelectItem>
            <SelectItem value="Returned">Returned</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rentals Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipment</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Cost</TableHead>
              {isStaffOrAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRentals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isStaffOrAdmin ? 7 : 6} className="text-center py-8 text-gray-500">
                  No rentals found
                </TableCell>
              </TableRow>
            ) : (
              filteredRentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">{rental.equipmentName}</TableCell>
                  <TableCell>{rental.customerName}</TableCell>
                  <TableCell>{new Date(rental.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(rental.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {isOverdue(rental.endDate, rental.status) && rental.status !== 'Returned' ? (
                      <Badge variant="destructive">Overdue</Badge>
                    ) : (
                      getStatusBadge(rental.status)
                    )}
                  </TableCell>
                  <TableCell>${rental.totalCost || 0}</TableCell>
                  {isStaffOrAdmin && (
                    <TableCell>
                      <div className="flex space-x-2">
                        {onView && (
                          <Button variant="ghost" size="sm" onClick={() => onView(rental)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {isAdmin && onEdit && (
                          <Button variant="ghost" size="sm" onClick={() => onEdit(rental)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {isStaffOrAdmin && rental.status !== 'Returned' && (
                          <Select onValueChange={(value) => handleStatusUpdate(rental.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Reserved">Reserved</SelectItem>
                              <SelectItem value="Rented">Rented</SelectItem>
                              <SelectItem value="Returned">Returned</SelectItem>
                            </SelectContent>
                          </Select>
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

export default RentalList;
