import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'blue', subtitle }) {
  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    green: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
    pink: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white',
    indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-xl ${colorClasses[color]} shadow-lg`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}