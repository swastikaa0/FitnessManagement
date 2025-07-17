import React from 'react';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import StatCard from '../components/statcard';
import AdminNavbar from '../components/adminnavbar';
import AdminHeader from '../components/adminheader';

export default function AdminRevenue() {
  const dashboardStats = {
    monthlyRevenue: 87650,
    totalRevenue: 456789,
    totalUsers: 2847
  };

  const revenueData = [
    { month: 'Jan', revenue: 65000, subscriptions: 52000, oneTime: 13000, users: 180 },
    { month: 'Feb', revenue: 72000, subscriptions: 58000, oneTime: 14000, users: 195 },
    { month: 'Mar', revenue: 68000, subscriptions: 55000, oneTime: 13000, users: 188 },
    { month: 'Apr', revenue: 78000, subscriptions: 62000, oneTime: 16000, users: 210 },
    { month: 'May', revenue: 85000, subscriptions: 68000, oneTime: 17000, users: 225 },
    { month: 'Jun', revenue: 87650, subscriptions: 70000, oneTime: 17650, users: 240 }
  ];

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
                      <p className="font-bold text-green-800">Rs 70,000</p>
                      <p className="text-sm text-green-600">100% of total</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Breakdown</h3>
                <div className="space-y-3">
                  {revenueData.slice(-4).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-900">{item.month} 2025</p>
                        <p className="text-sm text-gray-600">{item.users} users</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">Rs {item.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}