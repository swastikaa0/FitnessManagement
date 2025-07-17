import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import AddMealModal from '../components/Addmeal';
import EditMealModal from '../components/EditMeal';
import AdminNavbar from '../components/adminnavbar';
import AdminHeader from '../components/adminheader';
import { useAdminMeals } from '../hooks/useApi';
import apiService from '../services/api';
import { toast } from 'react-toastify';

export default function AdminMeals() {
  const { data, loading, error, refetch } = useAdminMeals();
  console.log('AdminMeals - Raw data from API:', data);
  const meals = data?.meals || [];
  console.log('AdminMeals - Extracted meals:', meals);
  console.log('AdminMeals - Meals length:', meals.length);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const handleAddMeal = async (newMeal) => {
    try {
      setActionLoading(true);
      await apiService.admin.createMeal(newMeal);
      toast.success('Meal added successfully!');
      setShowAddModal(false);
      refetch();
    } catch (error) {
      console.error('Add meal error:', error);
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach(err => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || 'Failed to add meal');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditMeal = async (mealId, updatedMeal) => {
    try {
      setActionLoading(true);
      await apiService.admin.updateMeal(mealId, updatedMeal);
      toast.success('Meal updated successfully!');
      setShowEditModal(false);
      setEditingMeal(null);
      refetch();
    } catch (error) {
      console.error('Update meal error:', error);
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach(err => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || 'Failed to update meal');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setShowEditModal(true);
  };

  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) return;
    
    try {
      setActionLoading(true);
      await apiService.admin.deleteMeal(mealId);
      toast.success('Meal deleted successfully!');
      refetch();
    } catch (error) {
      toast.error(error.message || 'Failed to delete meal');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredMeals = (meals || []).filter(meal => {
    console.log('AdminMeals - Individual meal object:', meal);
    return meal.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  console.log('AdminMeals - Filtered meals:', filteredMeals);
  console.log('AdminMeals - Filtered meals length:', filteredMeals.length);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminNavbar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading meals...</p>
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
              <p className="text-red-600 mb-4">Error loading meals: {error}</p>
              <button 
                onClick={refetch}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getGoalColor = (mealType) => {
    switch (mealType) {
      case 'weight-loss':
        return 'bg-red-100 text-red-800';
      case 'muscle-gain':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800';
      case 'vegetarian':
        return 'bg-green-100 text-green-800';
      case 'vegan':
        return 'bg-emerald-100 text-emerald-800';
      case 'keto':
        return 'bg-purple-100 text-purple-800';
      case 'paleo':
        return 'bg-orange-100 text-orange-800';
      case 'gluten-free':
        return 'bg-yellow-100 text-yellow-800';
      case 'dairy-free':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Management</h1>
                <p className="text-gray-600">Manage your nutrition database ({(meals || []).length} meals)</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                disabled={actionLoading}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg flex items-center space-x-2 disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Meal</span>
              </button>
            </div>



            {/* Search */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search meals..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeals.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No meals found</p>
                  {searchTerm && (
                    <p className="text-gray-400 mt-2">Try adjusting your search terms</p>
                  )}
                </div>
              ) : (
                filteredMeals.map((meal, index) => (
                  <div key={meal._id || index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{meal.name}</h3>
                        <p className="text-sm text-gray-600">{meal.category}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getGoalColor(meal.mealType)}`}>
                          {meal.mealType}
                        </span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(meal.difficulty)}`}>
                          {meal.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Calories</span>
                        <span className="font-semibold text-gray-900">{meal.nutrition?.calories || 0}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-blue-50 rounded-lg">
                          <div className="font-semibold text-blue-600">{meal.nutrition?.protein || 0}g</div>
                          <div className="text-gray-600">Protein</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="font-semibold text-green-600">{meal.nutrition?.carbohydrates || 0}g</div>
                          <div className="text-gray-600">Carbs</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-50 rounded-lg">
                          <div className="font-semibold text-yellow-600">{meal.nutrition?.fat || 0}g</div>
                          <div className="text-gray-600">Fat</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEdit(meal)}
                        disabled={actionLoading}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Edit meal"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMeal(meal._id)}
                        disabled={actionLoading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete meal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Meal Modal */}
            {showAddModal && (
              <AddMealModal
                onClose={() => setShowAddModal(false)}
                onSave={handleAddMeal}
              />
            )}

            {/* Edit Meal Modal */}
            {showEditModal && editingMeal && (
              <EditMealModal
                meal={editingMeal}
                onClose={() => {
                  setShowEditModal(false);
                  setEditingMeal(null);
                }}
                onSave={handleEditMeal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
