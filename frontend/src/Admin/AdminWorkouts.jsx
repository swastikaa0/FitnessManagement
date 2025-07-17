import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import AddWorkoutModal from '../components/Addworkouts';
import AdminNavbar from '../components/adminnavbar';
import AdminHeader from '../components/adminheader';
import { useAdminWorkouts } from '../hooks/useApi';
import apiService from '../services/api';
import { toast } from 'react-toastify';

export default function AdminWorkouts() {
  const { data, loading, error, refetch } = useAdminWorkouts();
  console.log('AdminWorkouts - Raw data from useAdminWorkouts:', data);
  console.log('AdminWorkouts - Loading state:', loading);
  console.log('AdminWorkouts - Error state:', error);
  const workouts = data?.workouts || [];
  console.log('AdminWorkouts - Extracted workouts array:', workouts);
  console.log('AdminWorkouts - Workouts array length:', workouts.length);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const handleAddWorkout = async (newWorkout) => {
    try {
      setActionLoading(true);
      setActionError('');
      console.log('Sending workout data:', newWorkout);
      const result = await apiService.admin.createWorkout(newWorkout);
      console.log('Create workout API result:', result);
      setActionSuccess('Workout added successfully!');
      toast.success('Workout added successfully!');
      setShowAddModal(false);
      console.log('About to call refetch after successful workout creation');
      refetch();
      console.log('Refetch called successfully');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      console.error('Create workout error:', error);
      const errorMessage = error.message || 'Failed to add workout';
      setActionError(errorMessage);
      
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        validationErrors.forEach(err => {
          toast.error(`Validation Error: ${err}`);
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditWorkout = (workoutId) => {
    const workoutToEdit = (workouts || []).find(workout => workout._id === workoutId);
    setEditingWorkout(workoutToEdit);
    setShowEditModal(true);
  };

  const handleUpdateWorkout = async (updatedWorkout) => {
    try {
      setActionLoading(true);
      setActionError('');
      await apiService.admin.updateWorkout(updatedWorkout._id, updatedWorkout);
      setActionSuccess('Workout updated successfully!');
      toast.success('Workout updated successfully!');
      setShowEditModal(false);
      setEditingWorkout(null);
      refetch();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      const errorMessage = error.message || 'Failed to update workout';
      setActionError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    
    try {
      setActionLoading(true);
      setActionError('');
      await apiService.admin.deleteWorkout(workoutId);
      setActionSuccess('Workout deleted successfully!');
      toast.success('Workout deleted successfully!');
      refetch();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      const errorMessage = error.message || 'Failed to delete workout';
      setActionError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredWorkouts = (workouts || []).filter(workout => {
    return workout.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminNavbar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading workouts...</p>
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
              <p className="text-red-600 mb-4">Error loading workouts: {error}</p>
              <button 
                onClick={refetch}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'cardio':
        return 'bg-red-100 text-red-800';
      case 'strength':
        return 'bg-blue-100 text-blue-800';
      case 'flexibility':
        return 'bg-green-100 text-green-800';
      case 'hiit':
        return 'bg-orange-100 text-orange-800';
      case 'yoga':
        return 'bg-purple-100 text-purple-800';
      case 'pilates':
        return 'bg-pink-100 text-pink-800';
      case 'crossfit':
        return 'bg-yellow-100 text-yellow-800';
      case 'bodyweight':
        return 'bg-indigo-100 text-indigo-800';
      case 'other':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const EditWorkoutModal = ({ workout, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: workout.name,
      duration: workout.duration,
      difficulty: workout.difficulty,
      equipment: workout.equipment,
      category: workout.category,
      estimatedCalories: workout.estimatedCalories
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({
        ...workout,
        ...formData
      });
    };

    const handleChange = (e) => {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    };

    return (
      <div className="fixed inset-0 backdrop-blur-md bg-white bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Edit Workout</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workout Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment
              </label>
              <input
                type="text"
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
                <option value="flexibility">Flexibility</option>
                <option value="hiit">HIIT</option>
                <option value="yoga">Yoga</option>
                <option value="pilates">Pilates</option>
                <option value="crossfit">CrossFit</option>
                <option value="bodyweight">Bodyweight</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Calories
              </label>
              <input
                type="number"
                name="estimatedCalories"
                value={formData.estimatedCalories}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Update Workout
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Workout Management</h1>
                <p className="text-gray-600">Manage your fitness programs ({(workouts || []).length} workouts)</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                disabled={actionLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all font-medium shadow-lg flex items-center space-x-2 disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Workout</span>
              </button>
            </div>

            {/* Action Messages */}
            {actionError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {actionError}
              </div>
            )}
            {actionSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {actionSuccess}
              </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search workouts..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Workouts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkouts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No workouts found</p>
                  {searchTerm && (
                    <p className="text-gray-400 mt-2">Try adjusting your search terms</p>
                  )}
                </div>
              ) : (
                filteredWorkouts.map((workout) => (
                  <div key={workout._id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{workout.name}</h3>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(workout.category)}`}>
                          {workout.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="font-bold text-purple-600 text-lg">{workout.duration}</div>
                          <div className="text-xs text-gray-600">Minutes</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="font-bold text-blue-600 text-lg">{workout.estimatedCalories}</div>
                          <div className="text-xs text-gray-600">Calories</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Difficulty</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          workout.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          workout.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {workout.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Equipment</span>
                        <span className="text-sm font-medium text-gray-900">{workout.equipment}</span>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEditWorkout(workout._id)}
                        disabled={actionLoading}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Edit Workout"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteWorkout(workout._id)}
                        disabled={actionLoading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Workout"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Workout Modal */}
            {showAddModal && (
              <AddWorkoutModal
                onClose={() => setShowAddModal(false)}
                onSave={handleAddWorkout}
              />
            )}

            {/* Edit Workout Modal */}
            {showEditModal && editingWorkout && (
              <EditWorkoutModal
                workout={editingWorkout}
                onClose={() => {
                  setShowEditModal(false);
                  setEditingWorkout(null);
                }}
                onSave={handleUpdateWorkout}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
