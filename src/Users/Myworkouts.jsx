import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Header from '../components/header';

export default function MyWorkouts() {
  const [activeTab, setActiveTab] = useState('all');

  const initialWorkouts = [
    { 
      id: 1,
      name: 'Morning Cardio', 
      duration: '30 min', 
      calories: 250, 
      status: 'completed',
      bodyPart: 'Full Body'
    },
    { 
      id: 2,
      name: 'Strength Training', 
      duration: '45 min', 
      calories: 320, 
      status: 'completed',
      bodyPart: 'Upper Body'
    },
    { 
      id: 3,
      name: 'Yoga Session', 
      duration: '60 min', 
      calories: 180, 
      status: 'completed',
      bodyPart: 'Full Body'
    },
    { 
      id: 4,
      name: 'HIIT Workout', 
      duration: '25 min', 
      calories: 300, 
      status: 'in-progress',
      bodyPart: 'Full Body'
    },
    { 
      id: 5,
      name: 'Leg Day', 
      duration: '40 min', 
      calories: 280, 
      status: 'in-progress',
      bodyPart: 'Lower Body'
    },
    { 
      id: 6,
      name: 'Core Workout', 
      duration: '15 min', 
      calories: 100, 
      status: 'not-completed',
      bodyPart: 'Core'
    },
    { 
      id: 7,
      name: 'Evening Run', 
      duration: '35 min', 
      calories: 350, 
      status: 'not-completed',
      bodyPart: 'Full Body'
    }
  ];

  const [myWorkouts, setMyWorkouts] = useState(initialWorkouts);

  const getFilteredWorkouts = () => {
    switch(activeTab) {
      case 'completed':
        return myWorkouts.filter(workout => workout.status === 'completed');
      case 'in-progress':
        return myWorkouts.filter(workout => workout.status === 'in-progress');
      case 'not-completed':
        return myWorkouts.filter(workout => workout.status === 'not-completed');
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
      case 'not-completed':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleStart = (workout) => {
    setMyWorkouts(prevWorkouts => 
      prevWorkouts.map(w => 
        w.id === workout.id 
          ? { ...w, status: 'in-progress' }
          : w
      )
    );
  };

  const handleCompleted = (workout) => {
    setMyWorkouts(prevWorkouts => 
      prevWorkouts.map(w => 
        w.id === workout.id 
          ? { ...w, status: 'completed' }
          : w
      )
    );
  };

  const handleDelete = (workout) => {
    if (window.confirm(`Are you sure you want to delete "${workout.name}"?`)) {
      setMyWorkouts(prevWorkouts => 
        prevWorkouts.filter(w => w.id !== workout.id)
      );
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <h3 className="text-sm font-medium text-gray-500">Not Completed</h3>
                <p className="text-2xl font-bold text-red-600">
                  {myWorkouts.filter(w => w.status === 'not-completed').length}
                </p>
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
                    Not Completed
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {getFilteredWorkouts().map((workout, index) => (
                  <div key={workout.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-800">{workout.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workout.status)}`}>
                            {workout.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{workout.duration}</span>
                          <span>•</span>
                          <span>{workout.calories} kcal</span>
                          <span>•</span>
                          <span>{workout.bodyPart}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {workout.status === 'not-completed' && (
                          <button 
                            onClick={() => handleStart(workout)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition"
                          >
                            Start
                          </button>
                        )}
                        {workout.status === 'in-progress' && (
                          <button 
                            onClick={() => handleCompleted(workout)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition"
                          >
                            Completed
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(workout)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {getFilteredWorkouts().length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No workouts found for this filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}