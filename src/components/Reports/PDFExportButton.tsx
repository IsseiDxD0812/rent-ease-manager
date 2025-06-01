
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useToast } from "@/hooks/use-toast";

interface PDFExportButtonProps {
  chartType: 'equipment' | 'revenue' | 'maintenance' | 'all';
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({ chartType }) => {
  const { user } = useAuth();
  const { equipment, rentals, maintenance } = useData();
  const { toast } = useToast();

  const generatePDFData = () => {
    const currentDate = new Date().toLocaleDateString();
    
    // Equipment by Category
    const equipmentByCategory = equipment.reduce((acc, eq) => {
      acc[eq.category] = (acc[eq.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Revenue data (last 6 months)
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

    // Maintenance costs
    const maintenanceCosts = maintenance.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + (record.cost || 0);
      return acc;
    }, {} as Record<string, number>);

    return {
      exportDate: currentDate,
      userName: user?.name,
      userRole: user?.role,
      equipmentByCategory,
      revenueData,
      maintenanceCosts
    };
  };

  const exportToPDF = async () => {
    try {
      const data = generatePDFData();
      
      // Create a simple HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>ENTNT Equipment Rental Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .table th { background-color: #f2f2f2; }
            .logo { max-height: 50px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ENTNT Equipment Rental Report</h1>
            <p>Generated on: ${data.exportDate}</p>
            <p>Exported by: ${data.userName} (${data.userRole})</p>
          </div>
          
          ${chartType === 'equipment' || chartType === 'all' ? `
          <div class="section">
            <h2>Equipment by Category</h2>
            <table class="table">
              <tr><th>Category</th><th>Count</th></tr>
              ${Object.entries(data.equipmentByCategory).map(([category, count]) => 
                `<tr><td>${category}</td><td>${count}</td></tr>`
              ).join('')}
            </table>
          </div>
          ` : ''}
          
          ${chartType === 'revenue' || chartType === 'all' ? `
          <div class="section">
            <h2>Revenue Trend (Last 6 Months)</h2>
            <table class="table">
              <tr><th>Month</th><th>Revenue</th></tr>
              ${data.revenueData.map(item => 
                `<tr><td>${item.month}</td><td>$${item.revenue}</td></tr>`
              ).join('')}
            </table>
          </div>
          ` : ''}
          
          ${chartType === 'maintenance' || chartType === 'all' ? `
          <div class="section">
            <h2>Maintenance Costs by Type</h2>
            <table class="table">
              <tr><th>Type</th><th>Cost</th></tr>
              ${Object.entries(data.maintenanceCosts).map(([type, cost]) => 
                `<tr><td>${type}</td><td>$${cost}</td></tr>`
              ).join('')}
            </table>
          </div>
          ` : ''}
        </body>
        </html>
      `;

      // Create a blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ENTNT-Report-${chartType}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Report Exported",
        description: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} report has been exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check user permissions
  const canExport = user?.role === 'Admin' || user?.role === 'Staff';

  if (!canExport) {
    return null;
  }

  return (
    <Button
      onClick={exportToPDF}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
    >
      <Download className="h-4 w-4" />
      <span>Export PDF</span>
    </Button>
  );
};

export default PDFExportButton;
