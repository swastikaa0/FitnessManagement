import React, { useState, useEffect } from 'react';

const CalorieTracker = () => {
  const [currentCalories, setCurrentCalories] = useState(1280);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [strokeDashoffset, setStrokeDashoffset] = useState(377);

  const meals = [
    {
      id: 'breakfast',
      name: 'Breakfast',
      calories: 420,
      image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=120&h=120&fit=crop&crop=center'
    },
    {
      id: 'lunch',
      name: 'Lunch',
      calories: 550,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=120&h=120&fit=crop&crop=center'
    },
    {
      id: 'dinner',
      name: 'Dinner',
      calories: 310,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop&crop=center'
    }
  ];

  useEffect(() => {
    const percentage = (currentCalories / targetCalories) * 100;
    const circumference = 2 * Math.PI * 60;
    const dashOffset = circumference - (percentage / 100) * circumference;
    
    const timer = setTimeout(() => {
      setStrokeDashoffset(dashOffset);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentCalories, targetCalories]);

  const editMeal = (mealType) => {
    alert(`Edit ${mealType} meal clicked!`);
  };

  const addMeal = () => {
    alert('Add new meal clicked!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h1 className="text-5xl font-bold text-center text-gray-800 mb-12 tracking-wide">
            TODAY'S MEALS
          </h1>
          
          {/* Calorie Progress Circle */}
          <div className="flex justify-center mb-16">
            <div className="relative w-80 h-80">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor: '#4CAF50'}} />
                    <stop offset="50%" style={{stopColor: '#2196F3'}} />
                    <stop offset="100%" style={{stopColor: '#FF9800'}} />
                  </linearGradient>
                </defs>
                
                {/* Background Circle */}
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                
                {/* Progress Circle */}
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="377"
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              
              {/* Calorie Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-gray-800 mb-2">
                  {currentCalories.toLocaleString()}
                </div>
                <div className="text-xl text-gray-600 font-medium">
                  of {targetCalories.toLocaleString()} Cal
                </div>
              </div>
            </div>
          </div>
          
          {/* Meals List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {meals.map((meal) => (
              <div
                key={meal.id}
                onClick={() => editMeal(meal.name)}
                className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 p-6 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-32 h-32 rounded-2xl object-cover mb-6 shadow-md"
                  />
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-800">
                      {meal.name}
                    </div>
                    <div className="text-xl text-blue-600 font-semibold">
                      {meal.calories} Cal
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add Meal Button */}
          <div className="text-center">
            <button
              onClick={addMeal}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Add Meal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieTracker;