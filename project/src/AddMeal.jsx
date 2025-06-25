import React, { useState } from 'react';

export default function AddMealPlan() {
  const [mealName, setMealName] = useState('');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');

  const handleSubmit = () => {
    console.log('Meal plan added:', { mealName, description, calories });
    // Reset form
    setMealName('');
    setDescription('');
    setCalories('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-8">
          Add New Meal Plan
        </h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xl font-semibold text-gray-800 mb-3">
              Meal Name
            </label>
            <input
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="e.g. High Protein Breakfast"
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-800 mb-3">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the meal"
              rows={4}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-800 mb-3">
              Calories (kcal)
            </label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="450"
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <button
              type="button"
              className="w-full py-4 text-lg font-medium text-blue-600 bg-white border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition-colors mb-6"
            >
              Choose image
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-4 text-xl font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Add Meal Plan
          </button>
        </div>
      </div>
    </div>
  );
}