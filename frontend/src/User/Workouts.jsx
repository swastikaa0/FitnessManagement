import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Header from '../components/header';
import { useWorkouts, useFeaturedWorkouts } from '../hooks/useApi';
import apiService from '../services/api';

export default function Workouts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [addingWorkout, setAddingWorkout] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { data: workouts, loading: workoutsLoading, error: workoutsError } = useWorkouts();
  console.log("works: ", workouts)
  const { data: featuredWorkouts, loading: featuredLoading, error: featuredError } = useFeaturedWorkouts();

  const workoutIcons = {
    'Strength': '🏋️‍♂️',
    'Cardio': '🏃‍♀️',
    'Flexibility': '🤸‍♀️',
    'Mindfulness': '🧘‍♀️',
    'HIIT': '🤾‍♀️',
    'Yoga': '🧘‍♂️',
    'default': '💪'
  };

  const workoutColors = {
    'Strength': { bg: 'bg-blue-50', text: 'text-blue-600' },
    'Cardio': { bg: 'bg-orange-50', text: 'text-orange-600' },
    'Flexibility': { bg: 'bg-pink-50', text: 'text-pink-600' },
    'Mindfulness': { bg: 'bg-purple-50', text: 'text-purple-600' },
    'HIIT': { bg: 'bg-yellow-50', text: 'text-yellow-600' },
    'Yoga': { bg: 'bg-teal-50', text: 'text-teal-600' },
    'default': { bg: 'bg-green-50', text: 'text-green-600' }
  };

  useEffect(() => {
    if (workouts?.workouts) {
      const filtered = workouts.workouts.filter(workout =>
        workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWorkouts(filtered);
    }
  }, [workouts, searchTerm]);

  const handleWorkoutClick = (workout) => {
    console.log(`Viewing ${workout.name} workout details`);
    // Add your navigation or workout details logic here
    // Example: navigate(`/workout/${workout._id}`);
  };

  const handleAddWorkout = async (workout) => {
    try {
      setAddingWorkout(workout._id);
      setErrorMessage('');
      setSuccessMessage('');
      
      await apiService.workouts.addToUserPlan(workout._id);
      setSuccessMessage(`${workout.name} added to your workout plan successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to add workout:', error);
      const errorMsg = error.response?.data?.message || 'Failed to add workout to your plan';
      setErrorMessage(errorMsg);
      
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setAddingWorkout(null);
    }
  };

  const getWorkoutIcon = (category) => {
    return workoutIcons[category] || workoutIcons.default;
  };

  const getWorkoutColors = (category) => {
    return workoutColors[category] || workoutColors.default;
  };

  if (workoutsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading workouts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (workoutsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading workouts: {workoutsError}</p>
              <button 
                onClick={() => window.location.reload()}
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
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-8 overflow-y-auto">
          <div>
            {/* Header Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Workout Browser</h2>
              
              {/* Success/Error Messages */}
              {successMessage && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    {successMessage}
                  </div>
                </div>
              )}
              
              {errorMessage && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <div className="flex items-center">
                    <span className="mr-2">❌</span>
                    {errorMessage}
                  </div>
                </div>
              )}
              
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
            
            {/* Workout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredWorkouts.map((workout) => {
                const colors = getWorkoutColors(workout.category);
                return (
                  <div 
                    key={workout._id} 
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    {/* Workout Image/Icon */}
                    <div 
                      onClick={() => handleWorkoutClick(workout)}
                      className={`${colors.bg} h-40 flex items-center justify-center cursor-pointer`}
                    >
                      <span className="text-6xl">{getWorkoutIcon(workout.category)}</span>
                    </div>
                    
                    {/* Workout Info */}
                    <div className="p-4">
                      <div onClick={() => handleWorkoutClick(workout)} className="cursor-pointer mb-3">
                        <h3 className="font-semibold text-gray-800 mb-1">{workout.name}</h3>
                        <p className="text-sm text-gray-500">{workout.duration} min • {workout.category}</p>
                        <p className="text-xs text-gray-400 mt-1">Difficulty: {workout.difficulty}</p>
                      </div>
                      
                      {/* Add to Plan Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddWorkout(workout);
                        }}
                        disabled={addingWorkout === workout._id}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        {addingWorkout === workout._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <span>➕</span>
                            Add to Plan
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredWorkouts.length === 0 && !workoutsLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500">No workouts found matching your search.</p>
              </div>
            )}

            {/* Featured Section */}
            {featuredWorkouts?.data?.workouts && featuredWorkouts.data.workouts.length > 0 && (
              <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Featured Workouts</h3>
                {featuredLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading featured workouts...</p>
                  </div>
                ) : featuredError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">Error loading featured workouts</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredWorkouts.data.workouts.slice(0, 2).map((workout) => (
                      <div 
                        key={workout._id}
                        onClick={() => handleWorkoutClick(workout)}
                        className="bg-gray-50 rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <h4 className="font-semibold text-gray-800 mb-2">{workout.name}</h4>
                        <p className="text-sm text-gray-600 mb-4">{workout.duration} minutes • {workout.difficulty}</p>
                        <p className="text-xs text-gray-500 mb-4">{workout.description}</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddWorkout(workout);
                          }}
                          disabled={addingWorkout === workout._id}
                          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                          {addingWorkout === workout._id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Adding...
                            </>
                          ) : (
                            'Add Workout'
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
