import React, { useState, useEffect } from 'react';
import { User, Dumbbell, Utensils, Activity, Heart } from 'lucide-react';

const AdminDashboard = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const exerciseCategories = [
    {
      name: 'Aerobics',
      count: 22,
      icon: '🏃',
      color: 'text-yellow-500'
    },
    {
      name: 'Strength',
      count: 32,
      icon: '🏋️',
      color: 'text-red-500'
    },
    {
      name: 'Yoga',
      count: 10,
      icon: '🧘',
      color: 'text-teal-500'
    },
    {
      name: 'Meditation',
      count: 5,
      icon: '🧘‍♀️',
      color: 'text-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`flex justify-between items-start mb-8 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Fitness Management</h1>
            <p className="text-gray-600 text-lg">August 12, 2021</p>
          </div>
          
          {/* Profile Section */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">Akshay Sharma</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Total Users */}
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Total Users</h2>
              <div className="text-8xl font-bold text-gray-900 mb-8">249</div>
            </div>
          </div>

          {/* Right Side - Exercises by Category */}
          <div className={`transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Exercises by Category</h2>
              
              <div className="grid grid-cols-2 gap-6">
                {exerciseCategories.map((category, index) => (
                  <div 
                    key={category.name}
                    className={`flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                    }`}
                    style={{ transitionDelay: `${700 + index * 100}ms` }}
                  >
                    <div className="text-3xl">
                      {category.icon}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{category.name}</p>
                      <p className="text-xl font-bold text-gray-600">{category.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Add Meals Card */}
          <div className={`transform transition-all duration-1000 delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Add Meals</h3>
              </div>
            </div>
          </div>

          {/* Add Exercise Card */}
          <div className={`transform transition-all duration-1000 delay-1100 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Dumbbell className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Add Exercise</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 transform transition-all duration-1000 delay-1200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {[
            { label: 'Active Today', value: '45', icon: Activity, color: 'from-green-400 to-green-600' },
            { label: 'Calories Burned', value: '2,340', icon: Heart, color: 'from-red-400 to-red-600' },
            { label: 'Workouts This Week', value: '12', icon: Dumbbell, color: 'from-blue-400 to-blue-600' },
            { label: 'Average Session', value: '45m', icon: Activity, color: 'from-purple-400 to-purple-600' }
          ].map((stat, index) => (
            <div key={stat.label} className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;