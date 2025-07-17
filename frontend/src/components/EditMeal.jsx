import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function EditMealModal({ meal, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    goal: '',
    dietType: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    ingredients: ''
  });

  useEffect(() => {
    if (meal) {
      const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };
      
      setFormData({
        name: meal.name || '',
        description: meal.description || '',
        category: capitalizeFirst(meal.category) || '',
        goal: meal.mealType || '',
        dietType: meal.difficulty || '',
        calories: meal.nutrition?.calories || 0,
        protein: meal.nutrition?.protein || 0,
        carbs: meal.nutrition?.carbohydrates || 0,
        fat: meal.nutrition?.fat || 0,
        ingredients: meal.ingredients?.map(ing => ing.name).join(', ') || ''
      });
    }
  }, [meal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedMeal = {
      name: formData.name,
      description: formData.description || '',
      category: formData.category?.toLowerCase(),
      mealType: formData.goal || 'maintenance',
      difficulty: formData.dietType || 'easy',
      nutrition: {
        calories: formData.calories || 0,
        protein: formData.protein || 0,
        carbohydrates: formData.carbs || 0,
        fat: formData.fat || 0
      },
      ingredients: formData.ingredients ? formData.ingredients.split(',').map((ingredient, index) => ({
        name: ingredient.trim(),
        quantity: 1,
        unit: 'piece'
      })) : [],
      prepTime: meal?.prepTime || 15,
      servingSize: meal?.servingSize || {
        quantity: 1,
        unit: 'serving'
      }
    };
    
    onSave(meal._id, updatedMeal);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Edit Meal</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Enter meal name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Category</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Type</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                required
              >
                <option value="">Select Meal Type</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="maintenance">Maintenance</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
                <option value="gluten-free">Gluten Free</option>
                <option value="dairy-free">Dairy Free</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={formData.dietType}
                onChange={(e) => setFormData({...formData, dietType: e.target.value})}
                required
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Calories</label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="450"
                value={formData.calories}
                onChange={(e) => setFormData({...formData, calories: parseInt(e.target.value) || 0})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Protein (g)</label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="35"
                value={formData.protein}
                onChange={(e) => setFormData({...formData, protein: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Carbs (g)</label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="25"
                value={formData.carbs}
                onChange={(e) => setFormData({...formData, carbs: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fat (g)</label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="18"
                value={formData.fat}
                onChange={(e) => setFormData({...formData, fat: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              rows="4"
              placeholder="Enter meal description, preparation method, or any special notes..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ingredients</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              rows="4"
              placeholder="List all ingredients (e.g., 2 cups rice, 1 cup chicken breast, 1 tbsp olive oil, salt, pepper...)"
              value={formData.ingredients}
              onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg"
            >
              Update Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}