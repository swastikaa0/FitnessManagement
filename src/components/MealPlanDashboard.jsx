// import React, { useState } from 'react';
// import breakfastImg from '../assets/ota.jpeg'; // ✅ Local image import for breakfast
// import lunchImg from '../assets/grill.jpeg'; // ✅ Local image import for lunch
// import dinnerImg from '../assets/dinnersalmon.jpeg'; // ✅ Local image import for dinner

// const MealPlanDashboard = () => {
//   const [nutritionData, setNutritionData] = useState([
//     {
//       id: 'calories',
//       label: 'Calories',
//       current: 1800,
//       target: 2200,
//       unit: '',
//       color: 'stroke-red-500',
//       bgColor: 'bg-red-50'
//     },
//     {
//       id: 'carbs',
//       label: 'Carbs',
//       current: 200,
//       target: 250,
//       unit: 'g',
//       color: 'stroke-blue-500',
//       bgColor: 'bg-blue-50'
//     },
//     {
//       id: 'protein',
//       label: 'Protein',
//       current: 100,
//       target: 150,
//       unit: 'g',
//       color: 'stroke-green-500',
//       bgColor: 'bg-green-50'
//     }
//   ]);

//   const [meals, setMeals] = useState([
//     {
//       id: 'breakfast',
//       type: 'Breakfast',
//       name: 'Oatmeal with Berries',
//       calories: 350,
//       image: breakfastImg // ✅ Using local image (ota.jpeg)
//     },
//     {
//       id: 'lunch',
//       type: 'Lunch',
//       name: 'Grilled Chicken Salad',
//       calories: 450,
//       image: lunchImg // ✅ Using local image (grill.jpeg)
//     },
//     {
//       id: 'dinner',
//       type: 'Dinner',
//       name: 'Salmon with Asparagus',
//       calories: 600,
//       image: dinnerImg // ✅ Using local image (dinnersalmon.jpeg)
//     }
//   ]);

//   const createNewPlan = () => {
//     alert('Create new meal plan clicked!');
//   };

//   const viewMeal = (mealType) => {
//     alert(`View ${mealType} meal clicked!`);
//   };

//   const getProgressPercentage = (current, target) => {
//     return Math.min((current / target) * 100, 100);
//   };

//   const getStrokeDasharray = (current, target) => {
//     const percentage = getProgressPercentage(current, target);
//     return `${percentage} ${100 - percentage}`;
//   };

//   const NutritionCard = ({ nutrition }) => (
//     <div className={`${nutrition.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
//       <div className="flex flex-col items-center">
//         <div className="relative w-24 h-24 mb-4">
//           <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
//             <circle className="stroke-gray-200" cx="21" cy="21" r="15.915" fill="none" strokeWidth="3" />
//             <circle
//               className={`${nutrition.color} transition-all duration-1000 ease-out`}
//               cx="21"
//               cy="21"
//               r="15.915"
//               fill="none"
//               strokeWidth="3"
//               strokeLinecap="round"
//               strokeDasharray={getStrokeDasharray(nutrition.current, nutrition.target)}
//               strokeDashoffset="0"
//             />
//           </svg>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <span className="text-lg font-bold text-gray-800">
//               {nutrition.current}{nutrition.unit}
//             </span>
//           </div>
//         </div>
//         <div className="text-center">
//           <div className="text-xl font-semibold text-gray-800 mb-1">{nutrition.label}</div>
//           <div className="text-sm text-gray-600">
//             {nutrition.current}{nutrition.unit}/{nutrition.target}{nutrition.unit}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const MealCard = ({ meal }) => (
//     <div
//       onClick={() => viewMeal(meal.type)}
//       className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden group"
//     >
//       <div className="relative overflow-hidden">
//         <img
//           src={meal.image}
//           alt={meal.name}
//           className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
//       </div>
//       <div className="p-6">
//         <div className="text-sm font-medium text-blue-600 mb-2 uppercase tracking-wide">{meal.type}</div>
//         <div className="text-xl font-bold text-gray-800 mb-2">{meal.name}</div>
//         <div className="text-lg text-gray-600 font-medium">{meal.calories} Calories</div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
//           <div className="flex justify-between items-center">
//             <h1 className="text-5xl font-bold text-gray-800">Meal Plan</h1>
//             <button
//               onClick={createNewPlan}
//               className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
//             >
//               + Create New Plan
//             </button>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           {/* Nutrition Section */}
//           <div className="xl:col-span-1">
//             <div className="bg-white rounded-2xl shadow-lg p-8">
//               <h2 className="text-3xl font-bold text-gray-800 mb-8">Daily Nutrition</h2>
//               <div className="space-y-6">
//                 {nutritionData.map((nutrition) => (
//                   <NutritionCard key={nutrition.id} nutrition={nutrition} />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Meals Section */}
//           <div className="xl:col-span-2">
//             <div className="bg-white rounded-2xl shadow-lg p-8">
//               <h2 className="text-3xl font-bold text-gray-800 mb-8">Today's Meals</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {meals.map((meal) => (
//                   <MealCard key={meal.id} meal={meal} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MealPlanDashboard;

import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Header from '../components/header';
import { 
  Calendar, 
  Target, 
  Zap, 
  Apple, 
  Coffee, 
  Fish, 
  Beef, 
  Salad,
  Edit,
  Check
} from 'lucide-react';

export default function MyMealPlans() {
  const [activeTab, setActiveTab] = useState('today');

  const mealIntakes = [
    {
      id: 1,
      name: 'Oatmeal with Berries',
      calories: 250,
      protein: '8g',
      carbs: '45g',
      fat: '5g',
      status: 'completed',
      icon: Coffee
    },
    {
      id: 2,
      name: 'Greek Yogurt',
      calories: 150,
      protein: '15g',
      carbs: '10g',
      fat: '8g',
      status: 'completed',
      icon: Coffee
    },
    {
      id: 3,
      name: 'Grilled Chicken Salad',
      calories: 350,
      protein: '35g',
      carbs: '15g',
      fat: '18g',
      status: 'completed',
      icon: Salad
    },
    {
      id: 4,
      name: 'Brown Rice Bowl',
      calories: 220,
      protein: '5g',
      carbs: '45g',
      fat: '2g',
      status: 'pending',
      icon: Beef
    },
    {
      id: 5,
      name: 'Apple with Peanut Butter',
      calories: 190,
      protein: '8g',
      carbs: '20g',
      fat: '12g',
      status: 'pending',
      icon: Apple
    },
    {
      id: 6,
      name: 'Salmon Fillet',
      calories: 280,
      protein: '40g',
      carbs: '0g',
      fat: '12g',
      status: 'pending',
      icon: Fish
    }
  ];

  const dailyGoals = {
    calories: 2000,
    protein: '150g',
    carbs: '250g',
    fat: '67g'
  };

  const consumedCalories = mealIntakes
    .filter(meal => meal.status === 'completed')
    .reduce((total, meal) => total + meal.calories, 0);

  const getStatusColor = (status) => {
    return status === 'completed' 
      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
      : 'bg-amber-50 text-amber-600 border border-amber-200';
  };

  const handleMealComplete = (mealId) => {
    console.log(`Marking meal ${mealId} as completed`);
  };

  const handleMealEdit = (mealId) => {
    console.log(`Editing meal ${mealId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-8 overflow-y-auto">
          <div>
            {/* Modern Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                My Nutrition
              </h2>
              <p className="text-gray-500 text-lg">Track your daily food intake and nutritional goals</p>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Calories Today</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{consumedCalories}</p>
                  <p className="text-sm text-gray-400 mt-1">of {dailyGoals.calories} goal</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Protein</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{dailyGoals.protein}</p>
                  <p className="text-sm text-gray-400 mt-1">daily target</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Carbs</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">{dailyGoals.carbs}</p>
                  <p className="text-sm text-gray-400 mt-1">daily target</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Fat</h3>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{dailyGoals.fat}</p>
                  <p className="text-sm text-gray-400 mt-1">daily target</p>
                </div>
              </div>
            </div>

            {/* Modern Food Cards */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-800">Today's Food Intake</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                  <div className="w-3 h-3 bg-amber-400 rounded-full ml-4"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mealIntakes.map((meal) => {
                  const IconComponent = meal.icon;
                  return (
                    <div key={meal.id} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 relative overflow-hidden">
                      {/* Background decoration */}
                      <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                              <IconComponent size={20} className="text-gray-600" />
                            </div>
                            <h4 className="font-semibold text-gray-800 text-lg">{meal.name}</h4>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(meal.status)}`}>
                            {meal.status}
                          </span>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                            <span className="text-gray-600 font-medium">Calories</span>
                            <span className="font-bold text-gray-800 text-lg">{meal.calories} kcal</span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-center p-2 bg-blue-50 rounded-lg">
                              <p className="text-xs text-blue-600 font-medium">Protein</p>
                              <p className="text-sm font-bold text-blue-700">{meal.protein}</p>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded-lg">
                              <p className="text-xs text-green-600 font-medium">Carbs</p>
                              <p className="text-sm font-bold text-green-700">{meal.carbs}</p>
                            </div>
                            <div className="text-center p-2 bg-orange-50 rounded-lg">
                              <p className="text-xs text-orange-600 font-medium">Fat</p>
                              <p className="text-sm font-bold text-orange-700">{meal.fat}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {meal.status === 'pending' && (
                            <button 
                              onClick={() => handleMealComplete(meal.id)}
                              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                            >
                              <Check size={16} />
                              <span>Complete</span>
                            </button>
                          )}
                          <button 
                            onClick={() => handleMealEdit(meal.id)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                          >
                            <Edit size={16} />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
