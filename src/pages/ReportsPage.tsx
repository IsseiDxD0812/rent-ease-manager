
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ReportsSummary from '../components/Reports/ReportsSummary';
import ReportsCharts from '../components/Reports/ReportsCharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, FileText } from 'lucide-react';

const ReportsPage = () => {
  const { user } = useAuth();

  if (user?.role !== 'Admin') {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to view reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive insights into your equipment rental business.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            <TabsTrigger value="summary" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Charts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-6">
            <ReportsSummary />
          </TabsContent>
          
          <TabsContent value="charts" className="mt-6">
            <ReportsCharts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsPage;
