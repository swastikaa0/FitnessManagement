
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import AddModal from '../components/addmodel';
import AdminNavbar from '../components/adminnavbar';
import AdminHeader from '../components/adminheader';

export default function AdminWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const mockWorkouts = [
    { 
      id: 1, 
      name: 'HIIT Cardio Blast', 
      category: 'Cardio', 
      duration: 30, 
      difficulty: 'Intermediate', 
      equipment: 'None', 
      goal: 'Weight Loss',
      workoutType: 'High Intensity',
      calories: 350,
      createdAt: '2025-01-09'
    },
    { 
      id: 2, 
      name: 'Upper Body Strength', 
      category: 'Strength', 
      duration: 45, 
      difficulty: 'Advanced', 
      equipment: 'Dumbbells', 
      goal: 'Weight Gain',
      workoutType: 'Strength Training',
      calories: 280,
      createdAt: '2025-01-11'
    },
    { 
      id: 3, 
      name: 'Yoga Flow Harmony', 
      category: 'Flexibility', 
      duration: 60, 
      difficulty: 'Beginner', 
      equipment: 'Yoga Mat', 
      goal: 'Maintenance',
      workoutType: 'Low Intensity',
      calories: 180,
      createdAt: '2025-01-07'
    },
    { 
      id: 4, 
      name: 'Core Crusher Pro', 
      category: 'Strength', 
      duration: 20, 
      difficulty: 'Intermediate', 
      equipment: 'None', 
      goal: 'Weight Loss',
      workoutType: 'Medium Intensity',
      calories: 200,
      createdAt: '2025-01-06'
    }
  ];

  useEffect(() => {
    setWorkouts(mockWorkouts);
  }, []);

  const handleAddWorkout = (newWorkout) => {
    setWorkouts(prev => [...prev, newWorkout]);
  };

  const filteredWorkouts = workouts.filter(workout => {
    return workout.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getGoalColor = (goal) => {
    switch (goal) {
      case 'Weight Loss':
        return 'bg-red-100 text-red-800';
      case 'Weight Gain':
        return 'bg-green-100 text-green-800';
      case 'Maintenance':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkoutTypeColor = (workoutType) => {
    switch (workoutType) {
      case 'High Intensity':
        return 'bg-red-100 text-red-800';
      case 'Medium Intensity':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low Intensity':
        return 'bg-green-100 text-green-800';
      case 'Strength Training':
        return 'bg-purple-100 text-purple-800';
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Workout Management</h1>
                <p className="text-gray-600">Manage your fitness programs</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all font-medium shadow-lg flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Workout</span>
              </button>
            </div>

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
              {filteredWorkouts.map((workout) => (
                <div key={workout.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{workout.name}</h3>
                      <p className="text-sm text-gray-600">{workout.category}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getGoalColor(workout.goal)}`}>
                        {workout.goal}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getWorkoutTypeColor(workout.workoutType)}`}>
                        {workout.workoutType}
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
                        <div className="font-bold text-blue-600 text-lg">{workout.calories}</div>
                        <div className="text-xs text-gray-600">Calories</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Difficulty</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        workout.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        workout.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
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
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Modal */}
            {showAddModal && (
              <AddModal
                type="workout"
                onClose={() => setShowAddModal(false)}
                onSave={handleAddWorkout}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}