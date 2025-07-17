import React, { useState, useEffect } from 'react';

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

export default function FoodsModal({ isOpen, onClose, initialCategory = null }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFood, setSelectedFood] = useState(null);

  // Update selected category when initialCategory prop changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Close on Escape key
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCategory(null);
      setSelectedFood(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = [
    { id: 'weight-loss', name: 'Weight Loss Foods', color: 'bg-red-50 border-red-200', textColor: 'text-red-600' },
    { id: 'muscle-gain', name: 'Muscle Gain Foods', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-600' },
    { id: 'maintenance', name: 'Maintenance Foods', color: 'bg-green-50 border-green-200', textColor: 'text-green-600' },
    { id: 'vegetarian', name: 'Vegetarian Foods', color: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-600' }
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
        >
          ✕
        </button>

        <div className="p-6">
          {/* Header */}
          <h2 className="text-3xl font-bold mb-6">
            {selectedFood ? selectedFood.name : 
             selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 
             'Food Categories'}
          </h2>

          {/* Category Selection View */}
          {!selectedCategory && !selectedFood && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`${category.color} border-2 rounded-xl p-6 hover:shadow-lg cursor-pointer transition-all duration-300 hover:scale-105`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <h3 className={`text-xl font-semibold mb-2 ${category.textColor}`}>
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {foodsData[category.id].length} foods available
                  </p>
                  <button className={`px-4 py-2 ${category.textColor} border-2 border-current rounded-lg hover:bg-current hover:text-white transition-colors`}>
                    View Foods
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Foods List View */}
          {selectedCategory && !selectedFood && (
            <div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-blue-600 hover:underline mb-6 flex items-center"
              >
                ← Back to Categories
              </button>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {foodsData[selectedCategory].map((food) => (
                  <div
                    key={food.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-lg cursor-pointer transition-all duration-300 hover:scale-105"
                    onClick={() => setSelectedFood(food)}
                  >
                    <div className="text-center mb-3">
                      <span className="text-4xl">{food.image}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{food.name}</h3>
                    <p className="text-blue-600 font-medium mb-2">{food.calories}</p>
                    <div className="text-sm text-gray-600 mb-3">
                      <p>Protein: {food.protein} | Carbs: {food.carbs} | Fat: {food.fat}</p>
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Food Detail View */}
          {selectedFood && (
            <div>
              <button
                onClick={() => setSelectedFood(null)}
                className="text-blue-600 hover:underline mb-6 flex items-center"
              >
                ← Back to Foods
              </button>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-center mb-6">
                  <span className="text-8xl">{selectedFood.image}</span>
                  <h3 className="text-2xl font-bold mt-4">{selectedFood.name}</h3>
                  <p className="text-gray-600 mt-2">{selectedFood.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Nutritional Information (per 100g)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span>Calories:</span>
                        <span className="font-medium">{selectedFood.calories}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span>Protein:</span>
                        <span className="font-medium">{selectedFood.protein}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span>Carbohydrates:</span>
                        <span className="font-medium">{selectedFood.carbs}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span>Fat:</span>
                        <span className="font-medium">{selectedFood.fat}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Key Benefits</h4>
                    <ul className="space-y-2">
                      {selectedFood.features.map((feature, index) => (
                        <li key={index} className="flex items-center p-2 bg-white rounded">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Add to My Foods
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
