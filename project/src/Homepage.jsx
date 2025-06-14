import React, { useState } from "react";

const HealthOverview = () => {
  const [healthData, setHealthData] = useState({
    date: new Date().toISOString().split('T')[0],
    bloodSugar: 80,
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    height: 170,
    weight: 65,
    activities: Array.from({ length: 30 }, (_, i) => ({
      date: `Apr ${i + 1}`,
      aerobics: false,
      yoga: false,
      meditation: false
    }))
  });

  const calculateBMI = () => {
    const heightInMeters = healthData.height / 100;
    const bmi = (healthData.weight / (heightInMeters * heightInMeters)).toFixed(1);
    let status = "";
    let statusColor = "";
    
    if (bmi < 18.5) {
      status = "Underweight";
      statusColor = "text-blue-500";
    } else if (bmi >= 18.5 && bmi < 25) {
      status = "Healthy";
      statusColor = "text-green-500";
    } else if (bmi >= 25 && bmi < 30) {
      status = "Overweight";
      statusColor = "text-yellow-500";
    } else {
      status = "Obese";
      statusColor = "text-red-500";
    }
    
    return { bmi, status, statusColor };
  };

  const { bmi, status, statusColor } = calculateBMI();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setHealthData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseInt(value) || 0
        }
      }));
    } else {
      setHealthData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    }
  };

  const handleActivityToggle = (index, activity) => {
    const updatedActivities = [...healthData.activities];
    updatedActivities[index][activity] = !updatedActivities[index][activity];
    setHealthData(prev => ({
      ...prev,
      activities: updatedActivities
    }));
  };

  const getBmiPercentage = () => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 15) return 0;
    if (bmiValue > 40) return 100;
    return ((bmiValue - 15) / 25) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">Health Dashboard</h1>
                <p className="text-blue-100">Track your health metrics</p>
              </div>
              <input
                type="date"
                name="date"
                value={healthData.date}
                onChange={handleInputChange}
                className="mt-2 md:mt-0 bg-blue-500 bg-opacity-30 border border-blue-300 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Health Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Blood Sugar Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Blood Sugar</h2>
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      Normal
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    <input
                      type="number"
                      name="bloodSugar"
                      value={healthData.bloodSugar}
                      onChange={handleInputChange}
                      className="text-3xl font-bold text-gray-800 w-24 mr-2 border-b-2 border-blue-200 focus:border-blue-500 focus:outline-none"
                    />
                    <span className="text-xl text-gray-600">mg/dl</span>
                  </div>
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${Math.min(healthData.bloodSugar / 2, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Heart Rate Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Heart Rate</h2>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      Normal
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    <input
                      type="number"
                      name="heartRate"
                      value={healthData.heartRate}
                      onChange={handleInputChange}
                      className="text-3xl font-bold text-gray-800 w-24 mr-2 border-b-2 border-green-200 focus:border-green-500 focus:outline-none"
                    />
                    <span className="text-xl text-gray-600">bpm</span>
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-gray-600">Live pulse</span>
                  </div>
                </div>
              </div>

              {/* Blood Pressure Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Blood Pressure</h2>
                    <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                      Normal
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    <input
                      type="number"
                      name="bloodPressure.systolic"
                      value={healthData.bloodPressure.systolic}
                      onChange={handleInputChange}
                      className="text-3xl font-bold text-gray-800 w-20 mr-1 border-b-2 border-purple-200 focus:border-purple-500 focus:outline-none"
                    />
                    <span className="text-3xl font-bold text-gray-800">/</span>
                    <input
                      type="number"
                      name="bloodPressure.diastolic"
                      value={healthData.bloodPressure.diastolic}
                      onChange={handleInputChange}
                      className="text-3xl font-bold text-gray-800 w-20 ml-1 border-b-2 border-purple-200 focus:border-purple-500 focus:outline-none"
                    />
                    <span className="text-xl text-gray-600 ml-2">mmHg</span>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    {healthData.bloodPressure.systolic < 120 && healthData.bloodPressure.diastolic < 80 ? 
                      "Optimal blood pressure" : "Monitor regularly"}
                  </div>
                </div>
              </div>

              {/* Height & Weight Card */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800">Body Measurements</h2>
                  <div className="mt-3 space-y-4">
                    <div className="flex items-center">
                      <span className="text-gray-600 w-20">Height:</span>
                      <input
                        type="number"
                        name="height"
                        value={healthData.height}
                        onChange={handleInputChange}
                        className="flex-1 text-gray-800 border-b-2 border-indigo-200 focus:border-indigo-500 focus:outline-none px-2 py-1"
                      />
                      <span className="text-gray-600 ml-2">cm</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 w-20">Weight:</span>
                      <input
                        type="number"
                        name="weight"
                        value={healthData.weight}
                        onChange={handleInputChange}
                        className="flex-1 text-gray-800 border-b-2 border-indigo-200 focus:border-indigo-500 focus:outline-none px-2 py-1"
                      />
                      <span className="text-gray-600 ml-2">kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BMI Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 mb-8 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Body Mass Index (BMI)</h2>
              
              <div className="flex flex-col md:flex-row items-center md:items-end justify-between">
                <div className="mb-4 md:mb-0">
                  <p className="text-4xl font-bold text-gray-800">
                    {bmi} 
                    <span className={`ml-3 text-2xl ${statusColor}`}>
                      ({status})
                    </span>
                  </p>
                  <p className="text-gray-600 mt-2">
                    {status === "Healthy" ? 
                      "Your weight is within normal range" : 
                      "Consider consulting with a healthcare provider"}
                  </p>
                </div>
                
                <div className="w-full md:w-2/3">
                  <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div className="absolute h-full bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 w-full"></div>
                    <div 
                      className="absolute h-full bg-white w-1 -ml-0.5"
                      style={{ left: `${getBmiPercentage()}%` }}
                    ></div>
                    <div className="absolute top-0 h-full w-1 bg-black -ml-0.5" style={{ left: "14%" }}></div>
                    <div className="absolute top-0 h-full w-1 bg-black -ml-0.5" style={{ left: "42%" }}></div>
                    <div className="absolute top-0 h-full w-1 bg-black -ml-0.5" style={{ left: "70%" }}></div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <div className="text-center">
                      <span className="block font-medium">Underweight</span>
                      <span>&lt; 18.5</span>
                    </div>
                    <div className="text-center">
                      <span className="block font-medium">Healthy</span>
                      <span>18.5 - 24.9</span>
                    </div>
                    <div className="text-center">
                      <span className="block font-medium">Overweight</span>
                      <span>25 - 29.9</span>
                    </div>
                    <div className="text-center">
                      <span className="block font-medium">Obese</span>
                      <span>30+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Growth */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Activity Tracker</h2>
                
                <div className="overflow-x-auto">
                  <div className="min-w-max">
                    {/* Activity Headers */}
                    <div className="flex border-b border-gray-200 pb-2 mb-2">
                      <div className="w-24 font-medium text-gray-600">Date</div>
                      <div className="w-24 text-center font-medium text-gray-600">Aerobics</div>
                      <div className="w-24 text-center font-medium text-gray-600">Yoga</div>
                      <div className="w-24 text-center font-medium text-gray-600">Meditation</div>
                    </div>
                    
                    {/* Activity Rows */}
                    {healthData.activities.slice(0, 14).map((activity, index) => (
                      <div key={index} className="flex items-center border-b border-gray-100 py-2">
                        <div className="w-24 text-sm text-gray-600">{activity.date}</div>
                        <div className="w-24 flex justify-center">
                          <button
                            onClick={() => handleActivityToggle(index, 'aerobics')}
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${activity.aerobics ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            ✓
                          </button>
                        </div>
                        <div className="w-24 flex justify-center">
                          <button
                            onClick={() => handleActivityToggle(index, 'yoga')}
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${activity.yoga ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            ✓
                          </button>
                        </div>
                        <div className="w-24 flex justify-center">
                          <button
                            onClick={() => handleActivityToggle(index, 'meditation')}
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${activity.meditation ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            ✓
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                      <span className="text-xs text-gray-600">Aerobics</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                      <span className="text-xs text-gray-600">Yoga</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                      <span className="text-xs text-gray-600">Meditation</span>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    View All Activities →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthOverview;