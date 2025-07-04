import React, { useState, useEffect } from 'react';

const MealPlanDashboard = () => {
  const [nutritionData, setNutritionData] = useState([
    {
      id: 'calories',
      label: 'Calories',
      current: 1800,
      target: 2200,
      unit: '',
      color: 'stroke-red-500',
      bgColor: 'bg-red-50'
    },
    {
      id: 'carbs',
      label: 'Carbs',
      current: 200,
      target: 250,
      unit: 'g',
      color: 'stroke-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'protein',
      label: 'Protein',
      current: 100,
      target: 150,
      unit: 'g',
      color: 'stroke-green-500',
      bgColor: 'bg-green-50'
    }
  ]);

  const [meals, setMeals] = useState([
    {
      id: 'breakfast',
      type: 'Breakfast',
      name: 'Oatmeal with Berries',
      calories: 350,
      image: 'https://images.unsplash.com/photo-1574168643341-e11cb437d3b9?w=400&h=300&fit=crop' // Pancakes
    },
    {
      id: 'lunch',
      type: 'Lunch',
      name: 'Grilled Chicken Salad',
      calories: 450,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' // Pasta
    },
    {
      id: 'dinner',
      type: 'Dinner',
      name: 'Salmon with Asparagus',
      calories: 600,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' // Pizza
    }
  ]);

  const createNewPlan = () => {
    alert('Create new meal plan clicked!');
  };

  const viewMeal = (mealType) => {
    alert(`View ${mealType} meal clicked!`);
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStrokeDasharray = (current, target) => {
    const percentage = getProgressPercentage(current, target);
    return `${percentage} ${100 - percentage}`;
  };

  const NutritionCard = ({ nutrition }) => (
    <div className={`${nutrition.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
            <circle
              className="stroke-gray-200"
              cx="21"
              cy="21"
              r="15.915"
              fill="none"
              strokeWidth="3"
            />
            <circle
              className={`${nutrition.color} transition-all duration-1000 ease-out`}
              cx="21"
              cy="21"
              r="15.915"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={getStrokeDasharray(nutrition.current, nutrition.target)}
              strokeDashoffset="0"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-800">
              {nutrition.current}{nutrition.unit}
            </span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-800 mb-1">
            {nutrition.label}
          </div>
          <div className="text-sm text-gray-600">
            {nutrition.current}{nutrition.unit}/{nutrition.target}{nutrition.unit}
          </div>
        </div>
      </div>
    </div>
  );

  const MealCard = ({ meal }) => (
    <div
      onClick={() => viewMeal(meal.type)}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>
      <div className="p-6">
        <div className="text-sm font-medium text-blue-600 mb-2 uppercase tracking-wide">
          {meal.type}
        </div>
        <div className="text-xl font-bold text-gray-800 mb-2">
          {meal.name}
        </div>
        <div className="text-lg text-gray-600 font-medium">
          {meal.calories} Calories
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-5xl font-bold text-gray-800">
              Meal Plan
            </h1>
            <button
              onClick={createNewPlan}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              + Create New Plan
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Nutrition Section */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Daily Nutrition
              </h2>
              <div className="space-y-6">
                {nutritionData.map((nutrition) => (
                  <NutritionCard key={nutrition.id} nutrition={nutrition} />
                ))}
              </div>
            </div>
          </div>

          {/* Meals Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Today's Meals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanDashboard;