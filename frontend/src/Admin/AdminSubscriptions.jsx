import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Edit, Trash2, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import AdminNavbar from '../components/adminnavbar';
import AdminHeader from '../components/adminheader';
import apiService from '../services/api';

const AdminSubscriptions = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    currency: 'NPR',
    duration: '',
    billingCycle: 'monthly',
    features: '',
    description: '',
    popular: false,
    displayOrder: 0
  });

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const response = await apiService.admin.getSubscriptionPlans();
      setSubscriptionPlans(response.data.plans || []);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      setError('Failed to fetch subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const planData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        displayOrder: parseInt(formData.displayOrder),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f)
      };

      if (editingPlan) {
        await apiService.admin.updateSubscriptionPlan(editingPlan.id, planData);
      } else {
        await apiService.admin.createSubscriptionPlan(planData);
      }

      await fetchSubscriptionPlans();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving subscription plan:', error);
      setError(editingPlan ? 'Failed to update plan' : 'Failed to create plan');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      id: plan.id,
      name: plan.name,
      price: plan.price.toString(),
      currency: plan.currency,
      duration: plan.duration.toString(),
      billingCycle: plan.billingCycle,
      features: plan.features.join(', '),
      description: plan.description,
      popular: plan.popular,
      displayOrder: plan.displayOrder.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this subscription plan?')) {
      try {
        await apiService.admin.deleteSubscriptionPlan(planId);
        await fetchSubscriptionPlans();
      } catch (error) {
        console.error('Error deleting subscription plan:', error);
        setError('Failed to delete subscription plan');
      }
    }
  };

  const handleToggleStatus = async (planId) => {
    try {
      await apiService.admin.toggleSubscriptionPlanStatus(planId);
      await fetchSubscriptionPlans();
    } catch (error) {
      console.error('Error toggling subscription plan status:', error);
      setError('Failed to toggle subscription plan status');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      price: '',
      currency: 'NPR',
      duration: '',
      billingCycle: 'monthly',
      features: '',
      description: '',
      popular: false,
      displayOrder: 0
    });
    setEditingPlan(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminNavbar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading subscription plans...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNavbar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <div className="flex-1 p-8">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Plans</h1>
                <p className="text-gray-600">Manage your subscription plans and pricing</p>
              </div>
              <button 
                onClick={handleAddNew}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Plan</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
                <span>{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700 font-bold text-xl"
                >
                  ×
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptionPlans.length === 0 ? (
                <div className="col-span-full bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
                  <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No subscription plans found</h3>
                  <p className="text-gray-600 mb-6">Create your first subscription plan to get started</p>
                  <button 
                    onClick={handleAddNew}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Your First Plan</span>
                  </button>
                </div>
              ) : (
                subscriptionPlans.map(plan => (
                  <div key={plan._id} className={`bg-white rounded-2xl p-6 shadow-lg border transition-all hover:shadow-xl relative ${
                    plan.popular ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100'
                  } ${!plan.isActive ? 'opacity-60' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>Popular</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {plan.currency} {plan.price}
                        <span className="text-lg text-gray-500 font-normal">/{plan.billingCycle}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {plan.duration} days duration
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Features:</h4>
                        <ul className="space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <button 
                        onClick={() => handleEdit(plan)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleToggleStatus(plan.id || plan._id)}
                          className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                            plan.isActive 
                              ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' 
                              : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                        >
                          {plan.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          <span>{plan.isActive ? 'Deactivate' : 'Activate'}</span>
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(plan.id || plan._id)}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPlan ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
                    Plan ID *
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    required
                    disabled={editingPlan}
                    placeholder="e.g., premium-monthly"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Premium Monthly"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="999"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="NPR">NPR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (days) *
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="30"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Cycle
                  </label>
                  <select
                    id="billingCycle"
                    name="billingCycle"
                    value={formData.billingCycle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Brief description of the plan"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div>
                <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
                  Features (comma-separated) *
                </label>
                <textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Unlimited workouts, Premium meals, Personal trainer, Priority support"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    id="displayOrder"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center pt-8">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="popular"
                      checked={formData.popular}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptions;