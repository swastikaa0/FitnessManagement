import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Utensils,
  Dumbbell,
  DollarSign,
  LogOut,
  Users,
  Shield,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminNavbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
  };

  const handleLogoClick = () => {
    navigate('/admin');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, path: '/admin/dashboard' },
    { id: 'meals', label: 'Meals', icon: Utensils, path: '/admin/meals' },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell, path: '/admin/workouts' },
    { id: 'revenue', label: 'Revenue', icon: DollarSign, path: '/admin/revenue' },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div 
      className={`${isExpanded ? 'w-64' : 'w-20'} bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative z-50 min-h-screen`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <button 
          onClick={handleLogoClick}
          className="flex items-center space-x-3 w-full text-left hover:bg-gray-50 rounded-lg p-1 transition-colors"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span 
            className={`text-gray-800 font-semibold text-lg transition-all duration-300 ${
              isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}
          >
            Fitme Admin
          </span>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0 w-6 flex justify-center">
                    <IconComponent size={20} />
                  </div>
                  
                  <span 
                    className={`font-medium ml-4 whitespace-nowrap transition-all duration-300 ${
                      isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}
                  >
                    {item.label}
                  </span>

                  {!isExpanded && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin Profile & Sign Out Section */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {/* Admin Profile */}
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          <div 
            className={`transition-all duration-300 ${
              isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}
          >
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">System Administrator</p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-red-50 transition-colors cursor-pointer text-red-600 hover:text-red-700 group relative"
        >
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <LogOut size={16} className="text-white" />
          </div>
          <span 
            className={`font-medium transition-all duration-300 ${
              isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}
          >
            Sign Out
          </span>

          {!isExpanded && (
            <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
              Sign Out
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
