import React from "react";

const GeneralSettings = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">General Settings</h2>

        <div className="space-y-6">
          
          <div className="flex justify-between items-center border-b pb-4">
            <span className="text-lg text-gray-800">Language</span>
            <span className="text-gray-600">English</span>
          </div>

          
          <div className="flex justify-between items-center border-b pb-4">
            <span className="text-lg text-gray-800">Dark Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-black-600 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-full"></div>
            </label>
          </div>

          {/* Privacy Policy */}
          <div className="flex justify-between items-center cursor-pointer hover:bg-black-100 p-3 rounded-md">
            <span className="text-lg text-gray-800">Privacy Policy</span>
            <span className="text-2xl text-gray-400">›</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
