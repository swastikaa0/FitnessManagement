import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Header from '../components/header';
import { Scale, Dumbbell, Utensils, Salad, ArrowLeft, Plus, Coffee, Apple } from 'lucide-react';
import { useMeals, useFeaturedMeals } from '../hooks/useApi';
import apiService from '../services/api';

// Mock data removed - now using backend API data

export default function MealsPlans() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [addingMeal, setAddingMeal] = useState(null);
  const [mealCategories, setMealCategories] = useState([
    { id: 'all', name: 'All Meals', icon: Utensils, color: 'bg-gray-100 text-gray-700' },
    { id: 'breakfast', name: 'Breakfast', icon: Coffee, color: 'bg-orange-100 text-orange-700' },
    { id: 'lunch', name: 'Lunch', icon: Utensils, color: 'bg-green-100 text-green-700' },
    { id: 'dinner', name: 'Dinner', icon: Utensils, color: 'bg-blue-100 text-blue-700' },
    { id: 'snack', name: 'Snacks', icon: Apple, color: 'bg-purple-100 text-purple-700' }
  ]);
  
  const { data: meals, loading: mealsLoading, error: mealsError } = useMeals();
  const { data: featuredMeals, loading: featuredLoading, error: featuredError } = useFeaturedMeals();
  console.log("meals: ", meals)

  const fetchMealCategories = async () => {
    try {
      const response = await apiService.meals.getCategories();
      if (response.data && response.data.length > 0) {
        const dynamicCategories = [
          { id: 'all', name: 'All Meals', icon: Utensils, color: 'bg-gray-100 text-gray-700' },
          ...response.data.map(category => ({
            id: category.id || category.name.toLowerCase(),
            name: category.name,
            icon: getCategoryIcon(category.name),
            color: getCategoryColor(category.name)
          }))
        ];
        setMealCategories(dynamicCategories);
      }
    } catch (error) {
      console.error('Failed to fetch meal categories:', error);
      // Keep default categories if API fails
    }
  };

  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('breakfast')) return Coffee;
    if (name.includes('lunch')) return Utensils;
    if (name.includes('dinner')) return Utensils;
    if (name.includes('snack')) return Apple;
    if (name.includes('weight') || name.includes('loss')) return Scale;
    if (name.includes('muscle') || name.includes('gain')) return Dumbbell;
    if (name.includes('vegetarian') || name.includes('vegan')) return Salad;
    return Utensils;
  };

  const getCategoryColor = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('breakfast')) return 'bg-orange-100 text-orange-700';
    if (name.includes('lunch')) return 'bg-green-100 text-green-700';
    if (name.includes('dinner')) return 'bg-blue-100 text-blue-700';
    if (name.includes('snack')) return 'bg-purple-100 text-purple-700';
    if (name.includes('weight') || name.includes('loss')) return 'bg-red-100 text-red-700';
    if (name.includes('muscle') || name.includes('gain')) return 'bg-blue-100 text-blue-700';
    if (name.includes('vegetarian') || name.includes('vegan')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id);
    setSelectedFood(null);
  };

  const getMealCountForCategory = (categoryId) => {
    if (!meals || !meals.meals || !meals.meals) return 0;
    if (categoryId === 'all') return meals.meals.length;
    return meals.meals.filter(meal => {
      const category = meal.category?.toLowerCase();
      return category === categoryId;
    }).length;
  };

  const handleViewDetails = (food) => {
    setSelectedFood(food);
  };

  const getMealTypeFromCategory = (category) => {
    const categoryMap = {
      'breakfast': 'breakfast',
      'lunch': 'lunch', 
      'dinner': 'dinner',
      'snack': 'snack',
      'dessert': 'dessert',
      'beverage': 'beverage',
      'weight loss': 'lunch',
      'muscle gain': 'lunch',
      'balanced': 'lunch',
      'maintenance': 'lunch',
      'vegetarian': 'lunch',
      'vegan': 'lunch'
    };
    return categoryMap[category?.toLowerCase()] || 'lunch';
  };

  const handleAddMeal = async (meal) => {
    try {
      setAddingMeal(meal._id || meal.id);
      await apiService.meals.logMeal({
        mealId: meal._id || meal.id,
        mealType: getMealTypeFromCategory(meal.category),
        consumedDate: new Date().toISOString().split('T')[0],
        servingSize: {
          quantity: 1
        },
        status: 'pending'
      });
      console.log(`Added ${meal.name} to my meal cart`);
      // You can show a success message here
    } catch (error) {
      console.error('Failed to add meal:', error);
      // You can show an error message here
    } finally {
      setAddingMeal(null);
    }
  };

  useEffect(() => {
    fetchMealCategories();
  }, []);

  useEffect(() => {
    if (meals && meals && meals.meals && selectedCategory) {
      console.log('Meals data structure:', meals.meals[0]);
      const filtered = selectedCategory === 'all' 
        ? meals.meals 
        : meals.meals.filter(meal => {
            const category = meal.category?.toLowerCase();
            return category === selectedCategory;
          });
      setFilteredMeals(filtered);
    }
  }, [meals, selectedCategory]);

  const getMealIcon = (category) => {
    const icons = {
      'weight loss': '🥗',
      'low calorie': '🥗',
      'muscle gain': '🥩',
      'high protein': '🥩',
      'balanced': '🍽️',
      'maintenance': '🍽️',
      'vegetarian': '🥬',
      'vegan': '🌱',
      'default': '🍽️'
    };
    return icons[category?.toLowerCase()] || icons.default;
  };

  if (mealsLoading && !selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading meal plans...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mealsError && !selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading meals: {mealsError}</p>
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

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedFood(null);
  };

  const handleBackToFoods = () => {
    setSelectedFood(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-8 overflow-y-auto">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Meals & Plans</h2>
            
            {/* Category Cards */}
            {!selectedCategory && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mealCategories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <div 
                      key={index} 
                      onClick={() => handleCategoryClick(category)}
                      className={`${category.color} rounded-2xl p-6 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300 border border-gray-100`}
                    >
                      <div className="text-center">
                        <div className="mb-4 flex justify-center">
                          <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center">
                            <IconComponent size={32} className={category.iconColor} />
                          </div>
                        </div>
                        <h3 className={`text-lg font-semibold mb-2 ${category.textColor}`}>{category.name}</h3>
                        <p className="text-gray-600 text-sm">{getMealCountForCategory(category.id)} meals available</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Foods List */}
            {selectedCategory && !selectedFood && (
              <div>
                <button
                  onClick={handleBackToCategories}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Categories</span>
                </button>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {mealCategories.find(cat => cat.id === selectedCategory)?.name} Meals
                </h3>
                
                {mealsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading meals...</p>
                  </div>
                ) : filteredMeals.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No meals found for this category.</p>
                    <p className="text-sm text-gray-400 mt-2">Try selecting a different category.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredMeals.map((meal) => (
                      <div
                        key={meal._id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="text-center mb-4">
                          <span className="text-5xl">{getMealIcon(meal.category)}</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{meal.name}</h4>
                        <p className="text-blue-600 font-medium mb-3">{meal.nutrition?.calories || 0} cal</p>
                        <div className="text-sm text-gray-600 mb-4">
                          <p>Protein: {meal.nutrition?.protein || 0}g | Carbs: {meal.nutrition?.carbohydrates || 0}g | Fat: {meal.nutrition?.fat || 0}g</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span 
                            onClick={() => handleViewDetails(meal)}
                            className="text-blue-600 hover:text-blue-800 cursor-pointer underline transition-colors"
                          >
                            View Details
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddMeal(meal);
                            }}
                            disabled={addingMeal === meal._id}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                          >
                            {addingMeal === meal._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Adding...</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                <span>Add Meal</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Meal Details */}
            {selectedFood && (
              <div>
                <button
                  onClick={handleBackToFoods}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Meals</span>
                </button>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="text-center mb-8">
                    <span className="text-8xl">{getMealIcon(selectedFood.category)}</span>
                    <h3 className="text-3xl font-bold text-gray-800 mt-4">{selectedFood.name}</h3>
                    <p className="text-gray-600 mt-2 text-lg">{selectedFood.description}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">Nutritional Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Calories:</span>
                          <span className="font-bold text-blue-600">{selectedFood.nutrition?.calories || 0} cal</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Protein:</span>
                          <span className="font-bold text-green-600">{selectedFood.nutrition?.protein || 0}g</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Carbohydrates:</span>
                          <span className="font-bold text-orange-600">{selectedFood.nutrition?.carbohydrates || 0}g</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Fat:</span>
                          <span className="font-bold text-purple-600">{selectedFood.nutrition?.fat || 0}g</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">Meal Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Category:</span>
                          <span className="font-bold text-blue-600">{selectedFood.category}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Prep Time:</span>
                          <span className="font-bold text-green-600">{selectedFood.prepTime || 'N/A'} min</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Difficulty:</span>
                          <span className="font-bold text-orange-600">{selectedFood.difficulty || 'Easy'}</span>
                        </div>
                        {selectedFood.ingredients && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium block mb-2">Ingredients:</span>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {selectedFood.ingredients.slice(0, 5).map((ingredient, index) => (
                                <li key={index}>• {ingredient}</li>
                              ))}
                              {selectedFood.ingredients.length > 5 && (
                                <li className="text-blue-600">... and {selectedFood.ingredients.length - 5} more</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <button 
                      onClick={() => handleAddMeal(selectedFood)}
                      disabled={addingMeal === selectedFood._id}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg transition-colors font-semibold text-lg flex items-center space-x-2 mx-auto"
                    >
                      {addingMeal === selectedFood._id ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          <span>Add to My Meals</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

