import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Header from '../components/header';
import apiService from '../services/api';
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

// AddSuggestionModal Component
function AddSuggestionModal({ onClose, onSubmit, submitting }) {
  const [formData, setFormData] = useState({
    category: 'nutrition',
    title: '',
    content: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.content.trim()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Share Your Suggestion</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give your suggestion a catchy title..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Suggestion</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your tip, experience, or advice..."
              rows="6"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            ></textarea>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.title.trim() || !formData.content.trim()}
              className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sharing...
                </>
              ) : (
                'Share Suggestion'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProSuggestions() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddSuggestion, setShowAddSuggestion] = useState(false);
  const [likedSuggestions, setLikedSuggestions] = useState(new Set());
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const categories = [
    { id: 'all', name: 'All', icon: Star },
    { id: 'nutrition', name: 'Nutrition', icon: Utensils },
    { id: 'training', name: 'Training', icon: Dumbbell },
    { id: 'recovery', name: 'Recovery', icon: Moon },
    { id: 'lifestyle', name: 'Lifestyle', icon: Zap }
  ];

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await apiService.suggestions.getAll();
      setSuggestions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setError('Failed to load suggestions');
      // Fallback to mock data if API fails
      setSuggestions([
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
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

  const handleLike = async (suggestionId) => {
    try {
      const isLiked = likedSuggestions.has(suggestionId);
      
      if (isLiked) {
        await apiService.suggestions.unlike(suggestionId);
      } else {
        await apiService.suggestions.like(suggestionId);
      }
      
      const newLikedSuggestions = new Set(likedSuggestions);
      if (isLiked) {
        newLikedSuggestions.delete(suggestionId);
      } else {
        newLikedSuggestions.add(suggestionId);
      }
      setLikedSuggestions(newLikedSuggestions);
      
      // Update the suggestion's like count in the local state
      setSuggestions(prev => prev.map(suggestion => 
        suggestion.id === suggestionId 
          ? { ...suggestion, likes: suggestion.likes + (isLiked ? -1 : 1) }
          : suggestion
      ));
    } catch (error) {
      console.error('Failed to update like:', error);
    }
  };

  const handleSubmitSuggestion = async (suggestionData) => {
    try {
      setSubmitting(true);
      const response = await apiService.suggestions.create(suggestionData);
      setSuggestions(prev => [response.data, ...prev]);
      setShowAddSuggestion(false);
    } catch (error) {
      console.error('Failed to submit suggestion:', error);
      setError('Failed to submit suggestion');
    } finally {
      setSubmitting(false);
    }
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

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={fetchSuggestions}
                  className="mt-2 text-red-600 hover:text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            )}
            
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

            {!loading && !error && (
              <div className="space-y-6">
                {filteredSuggestions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No suggestions found for this category.</p>
                  </div>
                ) : (
                  filteredSuggestions.map((suggestion) => (
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
                  ))
                )}
              </div>
            )}

            {showAddSuggestion && (
              <AddSuggestionModal 
                onClose={() => setShowAddSuggestion(false)}
                onSubmit={handleSubmitSuggestion}
                submitting={submitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

