
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import PDFExportButton from './PDFExportButton';

const ReportsCharts: React.FC = () => {
  const { equipment, rentals, maintenance } = useData();

  // Equipment by Category
  const equipmentByCategory = equipment.reduce((acc, eq) => {
    acc[eq.category] = (acc[eq.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(equipmentByCategory).map(([category, count]) => ({
    category,
    count
  }));

  // Equipment Status Distribution
  const statusData = equipment.reduce((acc, eq) => {
    acc[eq.status] = (acc[eq.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    status,
    count
  }));

  // Rental Revenue by Month (last 6 months)
  const revenueData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    const monthRentals = rentals.filter(rental => {
      const rentalDate = new Date(rental.startDate);
      return rentalDate.getMonth() === date.getMonth() && 
             rentalDate.getFullYear() === date.getFullYear();
    });
    
    const revenue = monthRentals.reduce((sum, rental) => sum + (rental.totalCost || 0), 0);
    revenueData.push({ month: monthYear, revenue });
  }

  // Maintenance Costs by Type
  const maintenanceCosts = maintenance.reduce((acc, record) => {
    acc[record.type] = (acc[record.type] || 0) + (record.cost || 0);
    return acc;
  }, {} as Record<string, number>);

  const maintenanceData = Object.entries(maintenanceCosts).map(([type, cost]) => ({
    type,
    cost
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      {/* Export All Reports Button */}
      <div className="flex justify-end">
        <PDFExportButton chartType="all" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment by Category */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-white/20 dark:border-gray-700/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">Equipment by Category</CardTitle>
            <PDFExportButton chartType="equipment" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="category" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#374151'
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Equipment Status Distribution */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-white/20 dark:border-gray-700/20">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Equipment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#374151'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-white/20 dark:border-gray-700/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">Revenue Trend (Last 6 Months)</CardTitle>
            <PDFExportButton chartType="revenue" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#374151'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Maintenance Costs by Type */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-white/20 dark:border-gray-700/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">Maintenance Costs by Type</CardTitle>
            <PDFExportButton chartType="maintenance" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="type" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Cost']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#374151'
                  }}
                />
                <Bar dataKey="cost" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsCharts;
