import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Header from '../components/header';
import apiService from '../services/api';
// Removed useUserMeals hook - using direct API call instead
import { 
  Calendar, 
  Target, 
  Zap, 
  Apple, 
  Coffee, 
  Fish, 
  Beef, 
  Salad,
  Trash2,
  Check
} from 'lucide-react';

export default function MyMealPlans() {
  const [activeTab, setActiveTab] = useState('today');
  const [mealIntakes, setMealIntakes] = useState([]);
  const [dailyNutrition, setDailyNutrition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingMeal, setUpdatingMeal] = useState(null);
  
  // Using mealIntakes from direct API call instead of hook

  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67
  };

  useEffect(() => {
    fetchDailyNutrition();
  }, []);

  const fetchDailyNutrition = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const response = await apiService.meals.getDailyNutrition(today);
      console.log('API Response:', response);
      console.log('Meals data:', response.data?.data?.meals);
      const nutritionData = response.data?.data || response.data || response;
      setDailyNutrition(nutritionData);
      setMealIntakes(nutritionData.meals || []);
    } catch (error) {
      console.error('Failed to fetch daily nutrition:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const consumedCalories = dailyNutrition?.totalNutrition?.calories || 0;
  const consumedProtein = dailyNutrition?.totalNutrition?.protein || 0;
  const consumedCarbs = dailyNutrition?.totalNutrition?.carbohydrates || 0;
  const consumedFat = dailyNutrition?.totalNutrition?.fat || 0;

  const getStatusColor = (status) => {
    return status === 'completed' 
      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
      : 'bg-amber-50 text-amber-600 border border-amber-200';
  };

  const getMealIcon = (mealName) => {
    const name = mealName?.toLowerCase() || '';
    if (name.includes('coffee') || name.includes('tea') || name.includes('oatmeal')) return Coffee;
    if (name.includes('salad') || name.includes('vegetable')) return Salad;
    if (name.includes('fish') || name.includes('salmon')) return Fish;
    if (name.includes('meat') || name.includes('chicken') || name.includes('beef')) return Beef;
    if (name.includes('apple') || name.includes('fruit')) return Apple;
    return Salad; // default icon
  };

  const handleMealComplete = async (mealId) => {
    try {
      setUpdatingMeal(mealId);
      await apiService.meals.updateUserMeal(mealId, { status: 'completed' });
      await fetchDailyNutrition(); // Refresh data
    } catch (error) {
      console.error('Failed to complete meal:', error);
    } finally {
      setUpdatingMeal(null);
    }
  };

  const handleMealDelete = async (mealId) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        setUpdatingMeal(mealId);
        await apiService.meals.deleteUserMeal(mealId);
        await fetchDailyNutrition(); // Refresh data
      } catch (error) {
        console.error('Failed to delete meal:', error);
      } finally {
        setUpdatingMeal(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your meal plan...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading meal plan: {error}</p>
              <button 
                onClick={fetchDailyNutrition}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-8 overflow-y-auto">
          <div>
            {/* Modern Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                My Nutrition
              </h2>
              <p className="text-gray-500 text-lg">Track your daily food intake and nutritional goals</p>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Calories Today</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{consumedCalories}</p>
                  <p className="text-sm text-gray-400 mt-1">of {dailyGoals.calories} goal</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Protein</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{consumedProtein}</p>
                  <p className="text-sm text-gray-400 mt-1">of {dailyGoals.protein} goal</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Carbs</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">{consumedCarbs}</p>
                  <p className="text-sm text-gray-400 mt-1">of {dailyGoals.carbs} goal</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Fat</h3>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{consumedFat}</p>
                  <p className="text-sm text-gray-400 mt-1">of {dailyGoals.fat} goal</p>
                </div>
              </div>
            </div>

            {/* Modern Food Cards */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-800">Today's Food Intake</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                  <div className="w-3 h-3 bg-amber-400 rounded-full ml-4"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mealIntakes && mealIntakes.length > 0 ? mealIntakes.map((meal) => {
                  console.log('Individual meal data:', meal);
                  console.log('Meal name:', meal.name);
                  console.log('Meal id:', meal.id);
                  console.log('Meal status:', meal.status);
                  const IconComponent = getMealIcon(meal.name);
                  const isUpdating = updatingMeal === meal.id;
                  return (
                    <div key={meal.id} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 relative overflow-hidden">
                      {/* Background decoration */}
                      <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                              <IconComponent size={20} className="text-gray-600" />
                            </div>
                            <h4 className="font-semibold text-gray-800 text-lg">{meal.name || 'Unknown Meal'}</h4>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(meal.status || 'pending')}`}>
                            {meal.status === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                            <span className="text-gray-600 font-medium">Calories</span>
                            <span className="font-bold text-gray-800 text-lg">{Math.round(meal.calories || 0)} kcal</span>
                          </div>
                          
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Meal Type: <span className="font-semibold text-gray-800">{meal.type || 'Unknown'}</span></p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {meal.status !== 'completed' && (
                            <button 
                              onClick={() => handleMealComplete(meal.id)}
                              disabled={isUpdating}
                              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Check size={16} />
                              <span>{isUpdating ? 'Updating...' : 'Complete'}</span>
                            </button>
                          )}
                          <button 
                            onClick={() => handleMealDelete(meal.id)}
                            disabled={isUpdating}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={16} />
                            <span>{isUpdating ? 'Deleting...' : 'Delete'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Salad className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No meals logged today</p>
                      <p className="text-sm">Start by adding meals from the meal plans page</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
