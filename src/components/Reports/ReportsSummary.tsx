
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const ReportsSummary: React.FC = () => {
  const { equipment, rentals, maintenance } = useData();

  // Calculate key metrics
  const totalRevenue = rentals.reduce((sum, rental) => sum + (rental.totalCost || 0), 0);
  const totalMaintenanceCost = maintenance.reduce((sum, record) => sum + (record.cost || 0), 0);
  const activeRentals = rentals.filter(r => r.status === 'Rented').length;
  const overdueRentals = rentals.filter(r => {
    const endDate = new Date(r.endDate);
    return endDate < new Date() && r.status !== 'Returned';
  }).length;

  const utilizationRate = equipment.length > 0 ? (equipment.filter(eq => eq.status === 'Rented').length / equipment.length) * 100 : 0;
  
  // Equipment condition summary
  const conditionSummary = equipment.reduce((acc, eq) => {
    acc[eq.condition] = (acc[eq.condition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const poorConditionCount = conditionSummary['Poor'] || 0;
  const fairConditionCount = conditionSummary['Fair'] || 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {rentals.length} rentals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {equipment.filter(eq => eq.status === 'Rented').length} of {equipment.length} rented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Cost</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMaintenanceCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {maintenance.length} maintenance records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueRentals + poorConditionCount}</div>
            <p className="text-xs text-muted-foreground">
              {overdueRentals} overdue, {poorConditionCount} poor condition
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Equipment:</span>
              <Badge variant="outline">{equipment.length}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Available:</span>
                <span>{equipment.filter(eq => eq.status === 'Available').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Rented:</span>
                <span>{equipment.filter(eq => eq.status === 'Rented').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Maintenance:</span>
                <span>{equipment.filter(eq => eq.status === 'Maintenance').length}</span>
              </div>
            </div>
            <hr />
            <div className="space-y-2">
              <h4 className="font-medium">Condition Breakdown:</h4>
              {Object.entries(conditionSummary).map(([condition, count]) => (
                <div key={condition} className="flex justify-between">
                  <span>{condition}:</span>
                  <Badge variant={condition === 'Poor' ? 'destructive' : condition === 'Fair' ? 'secondary' : 'default'}>
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rental Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Rental Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Rentals:</span>
              <Badge variant="outline">{rentals.length}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Active:</span>
                <span>{activeRentals}</span>
              </div>
              <div className="flex justify-between">
                <span>Reserved:</span>
                <span>{rentals.filter(r => r.status === 'Reserved').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Returned:</span>
                <span>{rentals.filter(r => r.status === 'Returned').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Overdue:</span>
                <Badge variant="destructive">{overdueRentals}</Badge>
              </div>
            </div>
            <hr />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Average Rental Value:</span>
                <span>${rentals.length > 0 ? (totalRevenue / rentals.length).toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span>Net Profit:</span>
                <span className={totalRevenue - totalMaintenanceCost >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ${(totalRevenue - totalMaintenanceCost).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsSummary;
