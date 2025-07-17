import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Header from '../components/header';
import { useWorkouts } from '../hooks/useApi';
import apiService from '../services/api';

export default function Workouts() {
  const navigate = useNavigate();
  const { data: workouts, loading, error } = useWorkouts();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredWorkouts, setFeaturedWorkouts] = useState([]);
  const [addingWorkout, setAddingWorkout] = useState(null);

  useEffect(() => {
    if (workouts && workouts.length > 0) {
      setFeaturedWorkouts(workouts.slice(0, 2));
    }
  }, [workouts]);

  const getWorkoutIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'mindfulness':
        return '🧘‍♀️';
      case 'flexibility':
        return '🤸‍♀️';
      case 'cardio':
        return '🏃‍♀️';
      case 'strength':
        return '🏋️‍♂️';
      case 'hiit':
        return '🤾‍♀️';
      default:
        return '💪';
    }
  };

  const getWorkoutColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'mindfulness':
        return 'bg-purple-50';
      case 'flexibility':
        return 'bg-pink-50';
      case 'cardio':
        return 'bg-orange-50';
      case 'strength':
        return 'bg-blue-50';
      case 'hiit':
        return 'bg-yellow-50';
      default:
        return 'bg-green-50';
    }
  };

  const getWorkoutTextColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'mindfulness':
        return 'text-purple-600';
      case 'flexibility':
        return 'text-pink-600';
      case 'cardio':
        return 'text-orange-600';
      case 'strength':
        return 'text-blue-600';
      case 'hiit':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  const filteredWorkouts = workouts?.filter(workout =>
    workout.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.difficulty?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleWorkoutClick = (workout) => {
    navigate(`/workout-details/${workout._id || workout.id}`, { state: { workout } });
  };

  const handleAddWorkout = async (workout) => {
    try {
      setAddingWorkout(workout._id || workout.id);
      await apiService.workouts.addToUserPlan({
        workoutId: workout._id || workout.id,
        scheduledDate: new Date().toISOString().split('T')[0]
      });
      console.log(`Added ${workout.name} to your workout plan`);
    } catch (error) {
      console.error('Error adding workout:', error);
    } finally {
      setAddingWorkout(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-8 overflow-y-auto">
          <div>
            {/* Header Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Workout Browser</h2>
              
              {/* Search Only */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search workouts"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading workouts...</span>
              </div>
            )}
            
            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">Error loading workouts: {error.message}</p>
              </div>
            )}
            
            {/* Workout Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredWorkouts.length > 0 ? (
                  filteredWorkouts.map((workout) => (
                    <div 
                      key={workout._id || workout.id} 
                      onClick={() => handleWorkoutClick(workout)}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      {/* Workout Image/Icon */}
                      <div className={`${getWorkoutColor(workout.type)} h-40 flex items-center justify-center`}>
                        <span className="text-6xl">{getWorkoutIcon(workout.type)}</span>
                      </div>
                      
                      {/* Workout Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-1">{workout.name}</h3>
                        <p className="text-sm text-gray-500">{workout.duration || 'N/A'}</p>
                        <p className="text-xs text-gray-400 mt-1">{workout.difficulty} • {workout.type}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No workouts found matching your search.</p>
                  </div>
                )}
              </div>
            )}

            {/* Featured Section */}
            {!loading && !error && featuredWorkouts.length > 0 && (
              <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Featured Workouts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredWorkouts.map((workout) => (
                    <div 
                      key={workout._id || workout.id}
                      onClick={() => handleWorkoutClick(workout)}
                      className="bg-gray-50 rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <h4 className="font-semibold text-gray-800 mb-2">{workout.name}</h4>
                      <p className="text-sm text-gray-600 mb-4">{workout.duration || 'N/A'} • {workout.difficulty || 'N/A'}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddWorkout(workout);
                        }}
                        disabled={addingWorkout === (workout._id || workout.id)}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        {addingWorkout === (workout._id || workout.id) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Adding...</span>
                          </>
                        ) : (
                          <span>Add Workout</span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
