
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RentalCalendar: React.FC = () => {
  const { rentals } = useData();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getRentalsForDate = (date: Date) => {
    return rentals.filter(rental => {
      const startDate = new Date(rental.startDate);
      const endDate = new Date(rental.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Reserved': 'bg-blue-100 text-blue-800',
      'Rented': 'bg-green-100 text-green-800',
      'Returned': 'bg-gray-100 text-gray-800',
      'Overdue': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const modifiers = {
    hasRentals: (date: Date) => getRentalsForDate(date).length > 0
  };

  const modifiersClassNames = {
    hasRentals: 'bg-blue-50 font-bold'
  };

  const selectedDateRentals = selectedDate ? getRentalsForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Rental Calendar</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border"
          />
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-50 border rounded"></div>
              <span>Days with rentals</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? (
              <>Rentals for {selectedDate.toLocaleDateString()}</>
            ) : (
              'Select a date'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateRentals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No rentals scheduled for this date
            </p>
          ) : (
            <div className="space-y-4">
              {selectedDateRentals.map((rental) => {
                const isStartDate = selectedDate && new Date(rental.startDate).toDateString() === selectedDate.toDateString();
                const isEndDate = selectedDate && new Date(rental.endDate).toDateString() === selectedDate.toDateString();
                
                return (
                  <div key={rental.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{rental.equipmentName}</h4>
                      <Badge className={getStatusColor(rental.status)}>
                        {rental.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Customer: {rental.customerName}</p>
                    <p className="text-sm text-gray-600">
                      Period: {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                    </p>
                    {rental.totalCost && (
                      <p className="text-sm text-gray-600">Cost: ${rental.totalCost}</p>
                    )}
                    {isStartDate && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Rental Starts Today
                      </Badge>
                    )}
                    {isEndDate && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        Rental Ends Today
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RentalCalendar;
