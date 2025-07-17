import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Empty space */}
        <div>
          {/* Overview title removed */}
        </div>

        {/* Right side - Search, notifications, and user */}
        <div className="flex items-center space-x-6">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-gray-50 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                3
              </span>
            </button>
          </div>

          {/* User Profile - Clickable */}
          <button 
            onClick={handleProfileClick}
            className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">Your Name</p>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
              <User size={18} className="text-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}