import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Activity, Utensils, TrendingUp, Target, Clock, Zap, Plus } from 'lucide-react';
import StatCard from '../components/statcard';
import AddMealModal from '../components/Addmeal';
import AddWorkoutModal from '../components/Addworkouts';
import AdminNavbar from '../components/adminnavbar';
import AdminHeader from '../components/adminheader';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

export default function AdminOverview() {
  const { user } = useAuth();
  const [showMealModal, setShowMealModal] = useState(false);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalWorkouts: 0,
    totalMeals: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    growthRate: 0,
    conversionRate: 0,
    avgSessionTime: 0,
    userRetention: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.admin.getDashboardStats();
      console.log('Dashboard API Response:', response);
      
      // Backend returns: { status: 'success', data: { stats: {...}, recentActivities: [...] } }
      const dashboardData = response.data || response;
      setDashboardStats(dashboardData.stats || dashboardStats);
      setRecentActivity(dashboardData.recentActivities || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async (data) => {
    try {
      await apiService.admin.createMeal(data);
      setShowMealModal(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to add meal:', error);
    }
  };

  const handleAddWorkout = async (data) => {
    try {
      await apiService.admin.createWorkout(data);
      setShowWorkoutModal(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to add workout:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminNavbar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
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
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchDashboardData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
              <p className="text-gray-600">Welcome back, {user?.fullName || 'Admin'}! Manage your fitness platform here.</p>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Users" 
                value={dashboardStats.totalUsers.toLocaleString()} 
                icon={Users} 
                color="blue"
                subtitle="Active community"
              />
              <StatCard 
                title="Monthly Revenue" 
                value={`$${dashboardStats.monthlyRevenue.toLocaleString()}`} 
                icon={DollarSign} 
                color="green"
                subtitle="This month"
              />
              <StatCard 
                title="Total Workouts" 
                value={dashboardStats.totalWorkouts.toLocaleString()} 
                icon={Activity} 
                color="purple"
                subtitle="Available programs"
              />
              <StatCard 
                title="Total Meals" 
                value={dashboardStats.totalMeals.toLocaleString()} 
                icon={Utensils} 
                color="orange"
                subtitle="Nutrition plans"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowMealModal(true)}
                    className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg transform hover:-translate-y-1"
                  >
                    <Utensils className="w-6 h-6 mb-2" />
                    <span className="font-medium">Add Meal</span>
                  </button>
                  <button
                    onClick={() => setShowWorkoutModal(true)}
                    className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg transform hover:-translate-y-1"
                  >
                    <Activity className="w-6 h-6 mb-2" />
                    <span className="font-medium">Add Workout</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                        <div className={`w-8 h-8 ${activity.type === 'user' ? 'bg-blue-500' : activity.type === 'revenue' ? 'bg-green-500' : 'bg-purple-500'} rounded-full flex items-center justify-center`}>
                          {activity.type === 'user' && <Users className="w-4 h-4 text-white" />}
                          {activity.type === 'revenue' && <DollarSign className="w-4 h-4 text-white" />}
                          {activity.type === 'workout' && <Activity className="w-4 h-4 text-white" />}
                          {activity.type === 'meal' && <Utensils className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium mb-2">No Recent Activity</p>
                      <p className="text-sm text-gray-400">User activities will appear here once they start using the platform</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add Meal Modal */}
            {showMealModal && (
              <AddMealModal
                onClose={() => setShowMealModal(false)}
                onSave={handleAddMeal}
              />
            )}

            {/* Add Workout Modal */}
            {showWorkoutModal && (
              <AddWorkoutModal
                onClose={() => setShowWorkoutModal(false)}
                onSave={handleAddWorkout}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
