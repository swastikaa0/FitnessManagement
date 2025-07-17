import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import AddModal from '../components/addmodel';
import AdminNavbar from '../components/adminnavbar';
import AdminHeader from '../components/adminheader';

export default function AdminMeals() {
  const [meals, setMeals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const mockMeals = [
    { 
      id: 1, 
      name: 'Protein Power Bowl', 
      category: 'Lunch', 
      calories: 450, 
      protein: 35, 
      carbs: 25, 
      fat: 18, 
      goal: 'Weight Gain',
      dietType: 'Non-Vegetarian',
      createdAt: '2025-01-10'
    },
    { 
      id: 2, 
      name: 'Green Smoothie Boost', 
      category: 'Breakfast', 
      calories: 280, 
      protein: 15, 
      carbs: 45, 
      fat: 8, 
      goal: 'Weight Loss',
      dietType: 'Vegetarian',
      createdAt: '2025-01-08'
    },
    { 
      id: 3, 
      name: 'Grilled Chicken Salad', 
      category: 'Dinner', 
      calories: 320, 
      protein: 40, 
      carbs: 15, 
      fat: 12, 
      goal: 'Maintenance',
      dietType: 'Non-Vegetarian',
      createdAt: '2025-01-12'
    },
    { 
      id: 4, 
      name: 'Overnight Oats Delight', 
      category: 'Breakfast', 
      calories: 380, 
      protein: 12, 
      carbs: 55, 
      fat: 14, 
      goal: 'Weight Gain',
      dietType: 'Vegetarian',
      createdAt: '2025-01-05'
    }
  ];

  useEffect(() => {
    setMeals(mockMeals);
  }, []);

  const handleAddMeal = (newMeal) => {
    setMeals(prev => [...prev, newMeal]);
  };

  const filteredMeals = meals.filter(meal => {
    return meal.name.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getDietTypeColor = (dietType) => {
    switch (dietType) {
      case 'Vegetarian':
        return 'bg-green-100 text-green-800';
      case 'Non-Vegetarian':
        return 'bg-orange-100 text-orange-800';
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
                <p className="text-gray-600">Manage your nutrition database</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg flex items-center space-x-2"
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
              {filteredMeals.map((meal) => (
                <div key={meal.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{meal.name}</h3>
                      <p className="text-sm text-gray-600">{meal.category}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getGoalColor(meal.goal)}`}>
                        {meal.goal}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDietTypeColor(meal.dietType)}`}>
                        {meal.dietType}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Calories</span>
                      <span className="font-semibold text-gray-900">{meal.calories}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-600">{meal.protein}g</div>
                        <div className="text-gray-600">Protein</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="font-semibold text-green-600">{meal.carbs}g</div>
                        <div className="text-gray-600">Carbs</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded-lg">
                        <div className="font-semibold text-yellow-600">{meal.fat}g</div>
                        <div className="text-gray-600">Fat</div>
                      </div>
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
                type="meal"
                onClose={() => setShowAddModal(false)}
                onSave={handleAddMeal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}