
Rabin Joshi
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Header from '../components/header';
import { 
  Heart, 
  Plus, 
  User, 
  Utensils, 
  Dumbbell, 
  Moon, 
  Zap,
  Star
} from 'lucide-react';

export default function ProSuggestions() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddSuggestion, setShowAddSuggestion] = useState(false);
  const [likedSuggestions, setLikedSuggestions] = useState(new Set());
  
  const categories = [
    { id: 'all', name: 'All', icon: Star },
    { id: 'nutrition', name: 'Nutrition', icon: Utensils },
    { id: 'training', name: 'Training', icon: Dumbbell },
    { id: 'recovery', name: 'Recovery', icon: Moon },
    { id: 'lifestyle', name: 'Lifestyle', icon: Zap }
  ];

  const suggestions = [
    {
      id: 1,
      user: 'Sarah Johnson',
      avatar: 'SJ',
      category: 'nutrition',
      title: 'Pre-workout nutrition timing',
      content: 'I found that eating a banana with peanut butter 30 minutes before workouts gives me sustained energy without feeling heavy. Game changer for my morning sessions!',
      likes: 24
    },
    {
      id: 2,
      user: 'Mike Chen',
      avatar: 'MC',
      category: 'training',
      title: 'Progressive overload strategy',
      content: 'Instead of always adding weight, try increasing reps or sets first. I went from 8 reps to 12 reps before adding weight, and my form improved dramatically.',
      likes: 31
    },
    {
      id: 3,
      user: 'Dr. Alex Rodriguez',
      avatar: 'AR',
      category: 'recovery',
      title: 'Sleep optimization for athletes',
      content: 'Keep your bedroom temperature between 65-68°F (18-20°C) for optimal sleep quality. Also, avoid screens 1 hour before bed - your recovery will thank you.',
      likes: 45
    },
    {
      id: 4,
      user: 'Emma Wilson',
      avatar: 'EW',
      category: 'lifestyle',
      title: 'Meal prep efficiency hack',
      content: 'Cook proteins in bulk on Sunday, but prep vegetables fresh every 2-3 days. This keeps meals interesting while saving time. Been doing this for 6 months!',
      likes: 18
    },
    {
      id: 5,
      user: 'Coach Lisa Park',
      avatar: 'LP',
      category: 'training',
      title: 'Form over weight always',
      content: 'Dropped my squat weight by 20% to focus on form. Three months later, I\'m squatting more than ever with zero knee pain. Ego lifting isn\'t worth injuries.',
      likes: 67
    },
    {
      id: 6,
      user: 'Tom Anderson',
      avatar: 'TA',
      category: 'nutrition',
      title: 'Hydration tracking method',
      content: 'Use a large water bottle with time markers. Helped me go from 4 glasses to 10 glasses daily. Energy levels and skin improved noticeably.',
      likes: 29
    }
  ];

  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

  const handleLike = (suggestionId) => {
    setLikedSuggestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(suggestionId)) {
        newSet.delete(suggestionId);
      } else {
        newSet.add(suggestionId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Community Suggestions</h2>
                <p className="text-gray-600">Share and discover fitness tips from the community</p>
              </div>
              <button
                onClick={() => setShowAddSuggestion(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-colors"
              >
                <Plus size={20} />
                <span>Add Suggestion</span>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <IconComponent size={16} />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-6">
              {filteredSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {suggestion.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-800">{suggestion.user}</h3>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h4>
                      <p className="text-gray-600 mb-4 leading-relaxed">{suggestion.content}</p>
                      
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(suggestion.id)}
                          className={`flex items-center space-x-2 transition-colors ${
                            likedSuggestions.has(suggestion.id)
                              ? 'text-red-500'
                              : 'text-gray-500 hover:text-red-500'
                          }`}
                        >
                          <Heart 
                            size={18} 
                            fill={likedSuggestions.has(suggestion.id) ? 'currentColor' : 'none'}
                          />
                          <span className="text-sm font-medium">
                            {suggestion.likes + (likedSuggestions.has(suggestion.id) ? 1 : 0)}
                          </span>
                        </button>
                        
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          suggestion.category === 'nutrition' ? 'bg-green-100 text-green-600' :
                          suggestion.category === 'training' ? 'bg-blue-100 text-blue-600' :
                          suggestion.category === 'recovery' ? 'bg-purple-100 text-purple-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {suggestion.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showAddSuggestion && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Share Your Suggestion</h3>
                    <button
                      onClick={() => setShowAddSuggestion(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                      <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="nutrition">Nutrition</option>
                        <option value="training">Training</option>
                        <option value="recovery">Recovery</option>
                        <option value="lifestyle">Lifestyle</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        placeholder="Give your suggestion a catchy title..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Suggestion</label>
                      <textarea
                        placeholder="Share your tip, experience, or advice..."
                        rows="6"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      ></textarea>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddSuggestion(false)}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold"
                      >
                        Share Suggestion
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}