import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Header from '../components/header';
import { Scale, Dumbbell, Utensils, Salad, ArrowLeft, Plus } from 'lucide-react';

const foodsData = {
  'weight-loss': [
    {
      id: 1,
      name: 'Grilled Chicken Breast',
      calories: '165 cal per 100g',
      protein: '31g',
      carbs: '0g',
      fat: '3.6g',
      features: ['High protein', 'Low calories', 'Zero carbs', 'Lean meat'],
      description: 'Perfect lean protein source for weight loss',
      image: '🍗'
    },
    {
      id: 2,
      name: 'Spinach',
      calories: '23 cal per 100g',
      protein: '2.9g',
      carbs: '3.6g',
      fat: '0.4g',
      features: ['Very low calories', 'High fiber', 'Rich in iron', 'Nutrient dense'],
      description: 'Low-calorie leafy green packed with nutrients',
      image: '🥬'
    },
    {
      id: 3,
      name: 'Greek Yogurt (Non-fat)',
      calories: '59 cal per 100g',
      protein: '10g',
      carbs: '3.6g',
      fat: '0.4g',
      features: ['High protein', 'Low fat', 'Probiotics', 'Filling'],
      description: 'High-protein, low-calorie snack option',
      image: '🥛'
    },
    {
      id: 4,
      name: 'Cucumber',
      calories: '16 cal per 100g',
      protein: '0.7g',
      carbs: '4g',
      fat: '0.1g',
      features: ['Very low calories', 'High water content', 'Hydrating', 'Crunchy'],
      description: 'Extremely low-calorie, hydrating vegetable',
      image: '🥒'
    }
  ],
  'muscle-gain': [
    {
      id: 5,
      name: 'Salmon',
      calories: '208 cal per 100g',
      protein: '25g',
      carbs: '0g',
      fat: '12g',
      features: ['High protein', 'Omega-3 fatty acids', 'Quality fats', 'Muscle recovery'],
      description: 'High-quality protein with healthy fats for muscle building',
      image: '🐟'
    },
    {
      id: 6,
      name: 'Quinoa',
      calories: '368 cal per 100g',
      protein: '14g',
      carbs: '64g',
      fat: '6g',
      features: ['Complete protein', 'Complex carbs', 'High calories', 'All amino acids'],
      description: 'Complete protein grain perfect for muscle building',
      image: '🌾'
    },
    {
      id: 7,
      name: 'Whole Eggs',
      calories: '155 cal per 100g',
      protein: '13g',
      carbs: '1.1g',
      fat: '11g',
      features: ['Complete protein', 'Healthy fats', 'Vitamins', 'Muscle building'],
      description: 'Complete protein source with essential amino acids',
      image: '🥚'
    },
    {
      id: 8,
      name: 'Sweet Potato',
      calories: '86 cal per 100g',
      protein: '1.6g',
      carbs: '20g',
      fat: '0.1g',
      features: ['Complex carbs', 'Energy source', 'Vitamins', 'Pre-workout fuel'],
      description: 'Complex carbohydrates for sustained energy and muscle fuel',
      image: '🍠'
    }
  ],
  'maintenance': [
    {
      id: 9,
      name: 'Brown Rice',
      calories: '111 cal per 100g',
      protein: '2.6g',
      carbs: '23g',
      fat: '0.9g',
      features: ['Balanced nutrition', 'Fiber rich', 'Sustained energy', 'Versatile'],
      description: 'Balanced carbohydrate source for maintaining energy levels',
      image: '🍚'
    },
    {
      id: 10,
      name: 'Avocado',
      calories: '160 cal per 100g',
      protein: '2g',
      carbs: '9g',
      fat: '15g',
      features: ['Healthy fats', 'Fiber', 'Potassium', 'Heart healthy'],
      description: 'Healthy fats and fiber for balanced nutrition',
      image: '🥑'
    },
    {
      id: 11,
      name: 'Almonds',
      calories: '579 cal per 100g',
      protein: '21g',
      carbs: '22g',
      fat: '50g',
      features: ['Healthy fats', 'Protein', 'Vitamin E', 'Satisfying'],
      description: 'Nutrient-dense nuts for balanced macronutrients',
      image: '🌰'
    },
    {
      id: 12,
      name: 'Banana',
      calories: '89 cal per 100g',
      protein: '1.1g',
      carbs: '23g',
      fat: '0.3g',
      features: ['Natural sugars', 'Potassium', 'Quick energy', 'Pre-workout'],
      description: 'Natural energy source with essential electrolytes',
      image: '🍌'
    }
  ],
  'vegetarian': [
    {
      id: 13,
      name: 'Lentils',
      calories: '116 cal per 100g',
      protein: '9g',
      carbs: '20g',
      fat: '0.4g',
      features: ['Plant protein', 'High fiber', 'Iron rich', 'Folate'],
      description: 'Excellent plant-based protein source with fiber',
      image: '🫘'
    },
    {
      id: 14,
      name: 'Tofu',
      calories: '76 cal per 100g',
      protein: '8g',
      carbs: '1.9g',
      fat: '4.8g',
      features: ['Complete protein', 'Low carbs', 'Versatile', 'Calcium'],
      description: 'Complete plant protein with all essential amino acids',
      image: '🧈'
    },
    {
      id: 15,
      name: 'Chickpeas',
      calories: '164 cal per 100g',
      protein: '8g',
      carbs: '27g',
      fat: '2.6g',
      features: ['Plant protein', 'Fiber', 'Complex carbs', 'Versatile'],
      description: 'High-protein legume perfect for vegetarian diets',
      image: '🫛'
    },
    {
      id: 16,
      name: 'Chia Seeds',
      calories: '486 cal per 100g',
      protein: '17g',
      carbs: '42g',
      fat: '31g',
      features: ['Omega-3', 'High fiber', 'Complete protein', 'Antioxidants'],
      description: 'Superfood packed with omega-3 and complete protein',
      image: '🌱'
    }
  ]
};

export default function MealsPlans() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  const mealCategories = [
    { 
      name: 'Weight Loss', 
      plans: 12, 
      icon: Scale, 
      color: 'bg-red-50', 
      textColor: 'text-red-600',
      iconColor: 'text-red-500',
      goal: 'weight-loss'
    },
    { 
      name: 'Muscle Gain', 
      plans: 8, 
      icon: Dumbbell, 
      color: 'bg-blue-50', 
      textColor: 'text-blue-600',
      iconColor: 'text-blue-500',
      goal: 'muscle-gain'
    },
    { 
      name: 'Maintenance', 
      plans: 15, 
      icon: Utensils, 
      color: 'bg-green-50', 
      textColor: 'text-green-600',
      iconColor: 'text-green-500',
      goal: 'maintenance'
    },
    { 
      name: 'Vegetarian', 
      plans: 10, 
      icon: Salad, 
      color: 'bg-yellow-50', 
      textColor: 'text-yellow-600',
      iconColor: 'text-yellow-500',
      goal: 'vegetarian'
    }
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.goal);
    setSelectedFood(null);
  };

  const handleViewDetails = (food) => {
    setSelectedFood(food);
  };

  const handleAddMeal = (food) => {
    console.log(`Adding ${food.name} to my meal plan`);
    // Add logic to add meal to user's meal plan
  };

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
                        <p className="text-gray-600 text-sm">{category.plans} foods available</p>
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
                  {mealCategories.find(cat => cat.goal === selectedCategory)?.name} Foods
                </h3>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {foodsData[selectedCategory].map((food) => (
                    <div
                      key={food.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-center mb-4">
                        <span className="text-5xl">{food.image}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{food.name}</h4>
                      <p className="text-blue-600 font-medium mb-3">{food.calories}</p>
                      <div className="text-sm text-gray-600 mb-4">
                        <p>Protein: {food.protein} | Carbs: {food.carbs} | Fat: {food.fat}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span 
                          onClick={() => handleViewDetails(food)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer underline transition-colors"
                        >
                          View Details
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddMeal(food);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Meal</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Food Details */}
            {selectedFood && (
              <div>
                <button
                  onClick={handleBackToFoods}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Foods</span>
                </button>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="text-center mb-8">
                    <span className="text-8xl">{selectedFood.image}</span>
                    <h3 className="text-3xl font-bold text-gray-800 mt-4">{selectedFood.name}</h3>
                    <p className="text-gray-600 mt-2 text-lg">{selectedFood.description}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">Nutritional Information (per 100g)</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Calories:</span>
                          <span className="font-bold text-blue-600">{selectedFood.calories}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Protein:</span>
                          <span className="font-bold text-green-600">{selectedFood.protein}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Carbohydrates:</span>
                          <span className="font-bold text-orange-600">{selectedFood.carbs}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Fat:</span>
                          <span className="font-bold text-purple-600">{selectedFood.fat}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">Key Benefits</h4>
                      <ul className="space-y-3">
                        {selectedFood.features.map((feature, index) => (
                          <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-green-500 mr-3 text-lg">✓</span>
                            <span className="font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <button 
                      onClick={() => handleAddMeal(selectedFood)}
                      className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add to My Meals</span>
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