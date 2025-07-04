import React from "react";

const MealDashboard = () => {
  const viewMeal = (mealType) => {
    alert(`Viewing ${mealType} details`);
  };

  return (
    <div className="max-w-7xl mx-auto p-10 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Meal Plan</h1>
        <button
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          onClick={() => alert("Create New Plan")}
        >
          + Create New Plan
        </button>
      </div>

      {/* Nutrition Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Daily Nutrition</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Calories", value: "1800", max: "2200", percentage: 72 },
            { label: "Carbs", value: "200g", max: "250g", percentage: 80 },
            { label: "Protein", value: "100g", max: "150g", percentage: 67 },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-100 p-6 rounded-xl flex flex-col items-center"
            >
              {/* Circle with centered value */}
              <div className="relative w-24 h-24 mb-4">
                <svg viewBox="0 0 42 42" className="w-full h-full">
                  <circle
                    className="text-gray-300"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    r="15.915"
                    cx="21"
                    cy="21"
                  />
                  <circle
                    className="text-blue-500"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${item.percentage} 100`}
                    strokeDashoffset="0"
                    fill="transparent"
                    r="15.915"
                    cx="21"
                    cy="21"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
                  {item.value}
                </div>
              </div>

              <div className="text-gray-700">{item.label}</div>
              <div className="text-sm text-gray-500">{`${item.value}/${item.max}`}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Meals Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Today's Meals</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              type: "Breakfast",
              name: "Oatmeal with Berries",
              calories: "350 Calories",
              image:
                "https://images.unsplash.com/photo-1511909525232-61113c912358?w=400&h=300&fit=crop",
            },
            {
              type: "Lunch",
              name: "Grilled Chicken Salad",
              calories: "450 Calories",
              image:
                "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
            },
            {
              type: "Dinner",
              name: "Salmon with Asparagus",
              calories: "600 Calories",
              image:
                "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
            },
          ].map((meal, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-xl shadow hover:shadow-lg cursor-pointer"
              onClick={() => viewMeal(meal.type)}
            >
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <div className="text-gray-500 text-sm">{meal.type}</div>
                <div className="font-semibold text-lg">{meal.name}</div>
                <div className="text-gray-600">{meal.calories}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealDashboard;
