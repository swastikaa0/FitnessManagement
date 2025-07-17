import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Header from '../components/header';
import { useUserWorkouts } from '../hooks/useApi';
import apiService from '../services/api';

export default function MyWorkouts() {
  const [activeTab, setActiveTab] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { data: userWorkoutsData, loading, error, refetch } = useUserWorkouts();

  const myWorkouts = userWorkoutsData?.workouts || [];
  console.log("my worksout", userWorkoutsData)

  const getFilteredWorkouts = () => {
    switch(activeTab) {
      case 'completed':
        return myWorkouts.filter(workout => workout.status === 'completed');
      case 'in-progress':
        return myWorkouts.filter(workout => workout.status === 'in-progress');
      case 'not-completed':
        return myWorkouts.filter(workout => workout.status === 'planned');
      default:
        return myWorkouts;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'in-progress':
        return 'bg-orange-100 text-orange-600';
      case 'planned':
        return 'bg-red-100 text-red-600';
      case 'skipped':
        return 'bg-gray-100 text-gray-600';
      case 'cancelled':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleStart = async (workout) => {
    try {
      setActionLoading(workout._id);
      setActionError(null);
      await apiService.workouts.start(workout._id);
      setSuccessMessage('Workout started successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      refetch();
    } catch (error) {
      console.error('Failed to start workout:', error);
      setActionError(error.message || 'Failed to start workout');
      setTimeout(() => setActionError(null), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleted = async (workout) => {
    try {
      setActionLoading(workout._id);
      setActionError(null);
      await apiService.workouts.complete(workout._id, {
        actualDuration: workout.workout?.duration || 0,
        totalCaloriesBurned: workout.workout?.estimatedCalories || 0
      });
      setSuccessMessage('Workout completed successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      refetch();
    } catch (error) {
      console.error('Failed to complete workout:', error);
      setActionError(error.message || 'Failed to complete workout');
      setTimeout(() => setActionError(null), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (workout) => {
    if (window.confirm(`Are you sure you want to delete "${workout.workout?.name}"?`)) {
      try {
        setActionLoading(workout._id);
        await apiService.workouts.cancel(workout._id);
        refetch();
      } catch (error) {
        console.error('Failed to delete workout:', error);
      } finally {
        setActionLoading(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-8 overflow-y-auto">
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">My Workouts</h2>
              <p className="text-gray-600">Manage and track all your workout activities</p>
              
              {successMessage && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  {successMessage}
                </div>
              )}
              
              {actionError && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {actionError}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500">Total Workouts</h3>
                <p className="text-2xl font-bold text-gray-800">{myWorkouts.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <p className="text-2xl font-bold text-green-600">
                  {myWorkouts.filter(w => w.status === 'completed').length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {myWorkouts.filter(w => w.status === 'in-progress').length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500">Planned</h3>
                <p className="text-2xl font-bold text-red-600">
                  {myWorkouts.filter(w => w.status === 'planned').length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500">Calories Burned</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {myWorkouts
                    .filter(w => w.status === 'completed')
                    .reduce((total, w) => total + (w.totalCaloriesBurned || w.workout?.estimatedCalories || 0), 0)
                    .toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">kcal total</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="mb-6">
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      activeTab === 'all' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All Workouts
                  </button>
                  <button
                    onClick={() => setActiveTab('completed')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      activeTab === 'completed' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => setActiveTab('in-progress')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      activeTab === 'in-progress' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setActiveTab('not-completed')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      activeTab === 'not-completed' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Planned
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading workouts...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Error loading workouts
                  </h3>
                  <p className="text-gray-500 mb-4">{error.message}</p>
                  <button
                    onClick={refetch}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : getFilteredWorkouts().length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">💪</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No workouts found
                  </h3>
                  <p className="text-gray-500">
                    {activeTab === 'all' 
                      ? "You haven't added any workouts yet."
                      : `No ${activeTab.replace('-', ' ')} workouts found.`
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getFilteredWorkouts().map((workout, index) => (
                    <div key={workout._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-800">{workout.workout?.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workout.status)}`}>
                              {workout.status.replace('-', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{workout.workout?.duration} min</span>
                            <span>•</span>
                            <span>
                              {workout.status === 'completed' && workout.totalCaloriesBurned 
                                ? `${workout.totalCaloriesBurned} kcal burned`
                                : `${workout.workout?.estimatedCalories} kcal estimated`
                              }
                            </span>
                            <span>•</span>
                            <span>{workout.workout?.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {workout.status === 'planned' && (
                            <button 
                              onClick={() => handleStart(workout)}
                              disabled={actionLoading === workout._id}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === workout._id ? 'Starting...' : 'Start'}
                            </button>
                          )}
                          {workout.status === 'in-progress' && (
                            <button 
                              onClick={() => handleCompleted(workout)}
                              disabled={actionLoading === workout._id}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === workout._id ? 'Completing...' : 'Completed'}
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(workout)}
                            disabled={actionLoading === workout._id}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === workout._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
