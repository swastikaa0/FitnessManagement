import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Dumbbell, 
  Salad, 
  TrendingUp, 
  ClipboardList, 
  Users, 
  BarChart3, 
  LogOut,
  CreditCard,
  Crown
} from 'lucide-react';

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isPremium } = useAuth();

  const handleSignOut = async () => {
    await logout();
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell, path: '/workouts' },
    { id: 'meals', label: 'Nutrition', icon: Salad, path: '/meals' },
    { id: 'myworkouts', label: 'Progress', icon: TrendingUp, path: '/my-workouts' },
    { id: 'mymealplans', label: 'Plans', icon: ClipboardList, path: '/my-meal-plans', premium: true },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/payments' },
  ];

  return (
    <div 
      className={`${isExpanded ? 'w-64' : 'w-20'} bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative z-50 min-h-screen`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4 border-b border-gray-200">
        <button 
          onClick={handleLogoClick}
          className="flex items-center space-x-3 w-full text-left hover:bg-gray-50 rounded-lg p-1 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span 
            className={`text-gray-800 font-semibold text-lg transition-all duration-300 ${
              isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}
          >
            Fitme
          </span>
        </button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isDisabled = item.premium && !isPremium;
            
            return (
              <li key={item.id}>
                <Link
                  to={isDisabled ? '/payments' : item.path}
                  className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : isDisabled
                      ? 'text-gray-400 hover:text-gray-500 hover:bg-gray-50 cursor-pointer'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0 w-6 flex justify-center relative">
                    <IconComponent size={20} />
                    {item.premium && (
                      <Crown 
                        size={12} 
                        className={`absolute -top-1 -right-1 ${
                          isPremium ? 'text-yellow-500' : 'text-gray-400'
                        }`} 
                      />
                    )}
                  </div>
                  
                  <span 
                    className={`font-medium ml-4 whitespace-nowrap transition-all duration-300 ${
                      isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}
                  >
                    {item.label}
                    {item.premium && !isPremium && isExpanded && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        PRO
                      </span>
                    )}
                  </span>

                  {!isExpanded && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {item.label}
                      {item.premium && !isPremium && ' (Premium)'}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
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
