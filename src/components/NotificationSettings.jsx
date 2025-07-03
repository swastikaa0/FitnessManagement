import React from "react";

const NotificationSettings = () => {
  return (
    <div className="max-w-3xl w-full mx-auto mt-20 p-10 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center">Notifications</h2>

      <div className="space-y-6">
        {/* Push Notifications */}
        <div className="flex justify-between items-center">
          <span className="text-gray-800 text-lg">Push Notifications</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-full"></div>
          </label>
        </div>

        {/* Show Previews */}
        <div className="flex justify-between items-center">
          <span className="text-gray-800 text-lg">Show Previews</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-full"></div>
          </label>
        </div>

        {/* Email Notifications */}
        <div className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-3 rounded-lg">
          <span className="text-gray-800 text-lg">Email Notifications</span>
          <span className="text-2xl text-gray-400">›</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
