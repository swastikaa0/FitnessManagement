import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import StatCard from '../components/statcard';
import AdminNavbar from '../components/adminnavbar';
import AdminHeader from '../components/adminheader';
import { useAdminRevenue } from '../hooks/useApi';
import apiService from '../services/api';

export default function AdminRevenue() {
  const { data: revenueData, loading, error, refetch } = useAdminRevenue();
  const [dashboardStats, setDashboardStats] = useState({
    monthlyRevenue: 0,
    totalRevenue: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const dashboardResponse = await apiService.admin.getDashboardStats();
        console.log('Dashboard Response:', dashboardResponse);
        
        const dashboardData = dashboardResponse.data || dashboardResponse;
        const stats = dashboardData.stats || dashboardData;
        
        setDashboardStats({
          monthlyRevenue: revenueData?.data?.monthlyRevenue || stats.monthlyRevenue || 0,
          totalRevenue: revenueData?.data?.yearlyRevenue || stats.totalRevenue || 0,
          totalUsers: stats.totalUsers || 0
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    if (revenueData) {
      fetchDashboardStats();
    }
  }, [revenueData]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminNavbar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading revenue data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminNavbar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading revenue data: {error}</p>
              <button 
                onClick={refetch}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const monthlyData = revenueData?.data?.subscriptionBreakdown || [];
  
  console.log('Revenue Data:', revenueData);
  console.log('Monthly Data:', monthlyData);
  console.log('Dashboard Stats:', dashboardStats);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Admin Navbar */}
      <AdminNavbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <AdminHeader />
        
        {/* Page Content */}
        <div className="flex-1 p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue Analytics</h1>
              <p className="text-gray-600">Track your financial performance and growth</p>
            </div>
            
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="Monthly Revenue" 
                value={`Rs ${dashboardStats.monthlyRevenue.toLocaleString()}`} 
                icon={DollarSign} 
                color="green"
                subtitle="Current month"
              />
              <StatCard 
                title="Total Revenue" 
                value={`Rs ${dashboardStats.totalRevenue.toLocaleString()}`} 
                icon={TrendingUp} 
                color="blue"
                subtitle="All time"
              />
              <StatCard 
                title="Avg Revenue/User" 
                value={`Rs ${Math.round(dashboardStats.totalRevenue / dashboardStats.totalUsers)}`} 
                icon={Users} 
                color="purple"
                subtitle="Per user value"
              />
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Sources</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-green-800">Subscriptions</p>
                      <p className="text-sm text-green-600">Monthly recurring</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-800">Rs {(revenueData?.data?.monthlyRevenue || dashboardStats.monthlyRevenue).toLocaleString()}</p>
                      <p className="text-sm text-green-600">Current month</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Subscription Breakdown</h3>
                <div className="space-y-3">
                  {monthlyData.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No revenue data available</p>
                    </div>
                  ) : (
                    monthlyData.slice(-4).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-semibold text-gray-900">{item._id || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{item.count || 0} subscriptions</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">Rs {(item.revenue || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
