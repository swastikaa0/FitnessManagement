import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Header from '../components/header';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { 
  Activity, 
  Flame, 
  Calendar, 
  Star, 
  TrendingUp, 
  Clock, 
  Users,
  Play,
  Plus,
  Target,
  Zap,
  Coffee,
  Apple,
  Dumbbell,
  Award,
  Trophy,
  BarChart3,
  Utensils,
  Eye,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [dailyNutrition, setDailyNutrition] = useState(null);
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(!retrying);
      setRetrying(false);
      setError(null);
      
      const today = new Date().toISOString().split('T')[0];
      
      const [dashboardResponse, nutritionResponse, workoutsResponse] = await Promise.all([
        apiService.users.getDashboard(),
        apiService.meals.getDailyNutrition(today),
        apiService.workouts.getUserWorkouts()
      ]);
      
      setDashboardData(dashboardResponse);
      setDailyNutrition(nutritionResponse.data?.data || nutritionResponse.data || nutritionResponse);
      setUserWorkouts(workoutsResponse.data?.workouts || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetrying(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button 
                onClick={handleRetry}
                disabled={retrying}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                {retrying && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                {retrying ? 'Retrying...' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const caloriesBurned = userWorkouts
    .filter(w => w.status === 'completed')
    .reduce((total, w) => total + (w.totalCaloriesBurned || w.workout?.estimatedCalories || 0), 0);

  const consumedCalories = dailyNutrition?.totalNutrition?.calories || 0;
  const consumedProtein = dailyNutrition?.totalNutrition?.protein || 0;

  const healthStats = [
    {
      id: 1,
      title: 'Calories Today',
      value: consumedCalories.toString(),
      unit: 'kcal',
      change: 'Consumed',
      icon: Utensils,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: 'up'
    },
    {
      id: 2,
      title: 'Calories Burned',
      value: caloriesBurned.toLocaleString(),
      unit: 'kcal',
      change: 'Total Burned',
      icon: Flame,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      trend: 'up'
    },
    {
      id: 3,
      title: 'Protein Today',
      value: consumedProtein.toString(),
      unit: 'g',
      change: 'Consumed',
      icon: Target,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      trend: 'up'
    },
    {
      id: 4,
      title: 'Total Workouts',
      value: userWorkouts.length.toString(),
      unit: 'sessions',
      change: 'All Time',
      icon: Dumbbell,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      trend: 'up'
    }
  ];

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const todayActivities = [
    ...(dashboardData?.today?.workouts?.map(workout => ({
      id: `workout-${workout.id}`,
      name: workout.name,
      time: formatTimeAgo(workout.scheduledTime),
      duration: `${workout.duration} min`,
      calories: `${workout.calories} kcal`,
      status: workout.status,
      icon: Dumbbell,
      color: workout.status === 'completed' ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100'
    })) || []),
    ...(dashboardData?.today?.meals?.map(meal => ({
      id: `meal-${meal.id}`,
      name: meal.name,
      time: formatTimeAgo(meal.time),
      duration: meal.type,
      calories: `${meal.calories} kcal`,
      status: 'completed',
      icon: meal.type === 'breakfast' ? Coffee : meal.type === 'lunch' ? Utensils : Apple,
      color: 'text-green-600 bg-green-100'
    })) || [])
  ].slice(0, 4);

  const quickActions = [
    {
      id: 1,
      title: 'Start Workout',
      subtitle: 'Begin your session',
      icon: Play,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
    },
    {
      id: 2,
      title: 'Log Meal',
      subtitle: 'Track your nutrition',
      icon: Utensils,
      color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
    },
    {
      id: 3,
      title: 'View Progress',
      subtitle: 'Check your stats',
      icon: BarChart3,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    },
    {
      id: 4,
      title: 'Set Goals',
      subtitle: 'Plan your targets',
      icon: Target,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -mr-16 -mt-16 opacity-60"></div>
              <div className="relative z-10">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Welcome back, {user?.name || 'Champion'}! 🏆
                  </h1>
                  <p className="text-gray-600 text-lg">Ready to crush your fitness goals today?</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {healthStats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <div key={stat.id} className={`${stat.bgColor} rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group`}>
                    <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/20 rounded-full group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <IconComponent size={24} className="text-white" />
                        </div>
                        <div className={`px-2 py-1 ${stat.bgColor} rounded-full`}>
                          <TrendingUp size={16} className={stat.textColor} />
                        </div>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</h3>
                      <div className="flex items-baseline space-x-1 mb-2">
                        <span className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</span>
                        <span className="text-sm text-gray-500">{stat.unit}</span>
                      </div>
                      <p className="text-xs text-gray-500">{stat.change}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Utensils size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Today's Nutrition</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Calories</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{consumedCalories}</p>
                    <p className="text-sm text-gray-400 mt-1">kcal consumed</p>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-2xl p-6 shadow-sm border border-green-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Protein</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">{consumedProtein}</p>
                    <p className="text-sm text-gray-400 mt-1">grams consumed</p>
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Carbs</h3>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{dailyNutrition?.totalNutrition?.carbohydrates || 0}</p>
                    <p className="text-sm text-gray-400 mt-1">grams consumed</p>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-2xl p-6 shadow-sm border border-purple-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Fat</h3>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{dailyNutrition?.totalNutrition?.fat || 0}</p>
                    <p className="text-sm text-gray-400 mt-1">grams consumed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Clock size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Recent Activities</h2>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1">
                  <Eye size={16} />
                  <span>View All</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todayActivities.length > 0 ? (
                  todayActivities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activity.color}`}>
                          <IconComponent size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{activity.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{activity.time}</span>
                            <span>•</span>
                            <span>{activity.duration}</span>
                            <span>•</span>
                            <span>{activity.calories}</span>
                          </div>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg mb-2">No activities today</p>
                    <p className="text-gray-400 text-sm">Start a workout or log a meal to see your activities here!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Zap size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={action.id}
                      className={`${action.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <IconComponent size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{action.title}</h3>
                          <p className="text-sm opacity-90">{action.subtitle}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
