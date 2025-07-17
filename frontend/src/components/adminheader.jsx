

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Shield } from 'lucide-react';

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/admin/profile');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                5
              </span>
            </button>
          </div>

          <button 
            onClick={handleProfileClick}
            className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg px-3 py-2 hover:from-blue-100 hover:to-purple-100 transition-all cursor-pointer border border-blue-200"
          >
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">Admin</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg">
              <Shield size={18} className="text-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}