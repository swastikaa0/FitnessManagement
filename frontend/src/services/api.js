import { getTokenFromStorage } from '../utils/localStorage.js';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = getTokenFromStorage();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      console.log(`API Response for ${endpoint}:`, {
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  workouts = {
    getAll: (params = {}) => this.get('/workouts', params),
    getById: (id) => this.get(`/workouts/${id}`),
    getFeatured: () => this.get('/workouts/featured/list'),
    getCategories: () => this.get('/workouts/categories/list'),
    create: (data) => this.post('/workouts', data),
    update: (id, data) => this.put(`/workouts/${id}`, data),
    delete: (id) => this.delete(`/workouts/${id}`),
    rate: (id, rating) => this.post(`/workouts/${id}/rate`, { rating }),
    getUserWorkouts: (params = {}) => this.get('/workouts/user/my-workouts', params),
    addToUserPlan: (workoutId) => this.post(`/workouts/${workoutId}/add-to-plan`),
    removeFromUserPlan: (workoutId) => this.delete(`/workouts/${workoutId}/remove-from-plan`),
    schedule: (id, data) => this.post(`/workouts/${id}/schedule`, data),
    start: (id) => this.post(`/workouts/user/${id}/start`),
    complete: (id, data) => this.post(`/workouts/user/${id}/complete`, data),
    skip: (id) => this.post(`/workouts/user/${id}/skip`),
    cancel: (id) => this.delete(`/workouts/user/${id}`)
  };

  meals = {
    getAll: (params = {}) => this.get('/meals', params),
    getById: (id) => this.get(`/meals/${id}`),
    getFeatured: () => this.get('/meals/featured/list'),
    getByCategory: (category, params = {}) => this.get(`/meals/category/${category}`, params),
    getCategories: () => this.get('/meals/categories/list'),
    create: (data) => this.post('/meals', data),
    update: (id, data) => this.put(`/meals/${id}`, data),
    delete: (id) => this.delete(`/meals/${id}`),
    rate: (id, rating) => this.post(`/meals/${id}/rate`, { rating }),
    toggleFavorite: (id) => this.post(`/meals/${id}/favorite`),
    getUserMeals: (params = {}) => this.get('/meals/user/my-meals', params),
    logMeal: (data) => this.post('/meals/user/log', data),
    updateUserMeal: (id, data) => this.put(`/meals/user/${id}`, data),
    deleteUserMeal: (id) => this.delete(`/meals/user/${id}`),
    getDailyNutrition: (date) => this.get(`/meals/user/nutrition/${date}`)
  };

  users = {
    getProfile: () => this.get('/users/profile'),
    updateProfile: (data) => this.put('/users/profile', data),
    updatePreferences: (data) => this.put('/users/preferences', data),
    getDashboard: () => this.get('/users/dashboard'),
    getStats: () => this.get('/users/stats'),
    getActivityHistory: (params = {}) => this.get('/users/activity', params),
    deleteAccount: () => this.delete('/users/account')
  };

  auth = {
    register: (data) => this.post('/auth/register', data),
    login: (data) => this.post('/auth/login', data),
    logout: () => this.post('/auth/logout'),
    getMe: () => this.get('/auth/me'),
    changePassword: (data) => this.post('/auth/change-password', data),
    forgotPassword: (data) => this.post('/auth/forgot-password', data),
    verifyToken: () => this.get('/auth/verify')
  };

  subscriptions = {
    getPlans: () => this.get('/subscriptions/plans'),
    getCurrentSubscription: () => this.get('/subscriptions/current'),
    subscribe: (data) => this.post('/subscriptions', data),
    updateSubscription: (data) => this.put('/subscriptions/current', data),
    cancel: () => this.delete('/subscriptions/current'),
    updatePayment: (data) => this.put('/subscriptions/payment-method', data),
    confirmPayment: (data) => this.post('/subscriptions/confirm-payment', data)
  };

  suggestions = {
    getAll: (params = {}) => this.get('/suggestions', params),
    getById: (id) => this.get(`/suggestions/${id}`),
    create: (data) => this.post('/suggestions', data),
    update: (id, data) => this.put(`/suggestions/${id}`, data),
    delete: (id) => this.delete(`/suggestions/${id}`),
    like: (id) => this.post(`/suggestions/${id}/like`),
    unlike: (id) => this.delete(`/suggestions/${id}/like`),
    getByCategory: (category, params = {}) => this.get(`/suggestions/category/${category}`, params)
  };

  analytics = {
    getAnalytics: (period = 'week') => this.get(`/analytics/user/${period}`),
    getAchievements: () => this.get('/analytics/achievements'),
    getStats: (params = {}) => this.get('/analytics/stats', params),
    getReports: (params = {}) => this.get('/analytics/reports', params)
  };

  admin = {
    getDashboard: () => this.get('/admin/dashboard'),
    getDashboardStats: () => this.get('/admin/dashboard'),
    getUsers: (params = {}) => this.get('/admin/users', params),
    getUserById: (id) => this.get(`/admin/users/${id}`),
    createUser: (data) => this.post('/admin/users', data),
    updateUser: (id, data) => this.put(`/admin/users/${id}`, data),
    deleteUser: (id) => this.delete(`/admin/users/${id}`),
    toggleUserPaymentStatus: (id) => this.post(`/admin/users/${id}/toggle-payment`),
    getWorkouts: (params = {}) => this.get('/admin/workouts', params),
    createWorkout: (data) => this.post('/admin/workouts', data),
    updateWorkout: (id, data) => this.put(`/admin/workouts/${id}`, data),
    deleteWorkout: (id) => this.delete(`/admin/workouts/${id}`),
    getMeals: (params = {}) => this.get('/admin/meals', params),
    createMeal: (data) => this.post('/admin/meals', data),
    updateMeal: (id, data) => this.put(`/admin/meals/${id}`, data),
    deleteMeal: (id) => this.delete(`/admin/meals/${id}`),
    getAnalytics: (params = {}) => this.get('/admin/analytics', params),
    getRevenue: (params = {}) => this.get('/admin/revenue', params),
    getSubscriptionPlans: () => this.get('/admin/subscription-plans'),
    createSubscriptionPlan: (data) => this.post('/admin/subscription-plans', data),
    updateSubscriptionPlan: (id, data) => this.put(`/admin/subscription-plans/${id}`, data),
    deleteSubscriptionPlan: (id) => this.delete(`/admin/subscription-plans/${id}`),
    toggleSubscriptionPlanStatus: (id) => this.request(`/admin/subscription-plans/${id}/toggle-status`, { method: 'PATCH' })
  };
}

export default new ApiService();