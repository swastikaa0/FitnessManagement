import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('useApi - Starting API call');
      const result = await apiCall();
      console.log('useApi - API call result:', result);
      // Extract data from the response if it has a nested structure
      const extractedData = result?.data ? result.data : result;
      setData(extractedData);
    } catch (err) {
      console.error('API call failed:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useWorkouts = (params = {}) => {
  return useApi(() => apiService.workouts.getAll(params), [JSON.stringify(params)]);
};

export const useWorkout = (id) => {
  return useApi(() => apiService.workouts.getById(id), [id]);
};

export const useFeaturedWorkouts = () => {
  return useApi(() => apiService.workouts.getFeatured());
};

export const useUserWorkouts = (params = {}) => {
  return useApi(() => apiService.workouts.getUserWorkouts(params), [JSON.stringify(params)]);
};

export const useMeals = (params = {}) => {
  return useApi(() => apiService.meals.getAll(params), [JSON.stringify(params)]);
};

export const useMeal = (id) => {
  return useApi(() => apiService.meals.getById(id), [id]);
};

export const useFeaturedMeals = () => {
  return useApi(() => apiService.meals.getFeatured());
};

export const useUserMeals = (params = {}) => {
  return useApi(() => apiService.meals.getUserMeals(params), [JSON.stringify(params)]);
};

export const useUserProfile = () => {
  return useApi(() => apiService.users.getProfile());
};

export const useUserStats = () => {
  return useApi(() => apiService.users.getStats());
};

export const useDashboard = () => {
  return useApi(() => apiService.users.getDashboard());
};

export const useSubscriptionPlans = () => {
  return useApi(() => apiService.subscriptions.getPlans());
};

export const useCurrentSubscription = () => {
  return useApi(() => apiService.subscriptions.getCurrentSubscription());
};

export const useAdminMeals = (params = {}) => {
  console.log('useAdminMeals - Called with params:', params);
  return useApi(() => {
    console.log('useAdminMeals - About to call apiService.admin.getMeals with params:', params);
    return apiService.admin.getMeals(params);
  }, [JSON.stringify(params)]);
};

export const useAdminUsers = (params = {}) => {
  return useApi(() => apiService.admin.getUsers(params), [JSON.stringify(params)]);
};

export const useAdminWorkouts = (params = {}) => {
  console.log('useAdminWorkouts - Called with params:', params);
  return useApi(() => {
    console.log('useAdminWorkouts - About to call apiService.admin.getWorkouts with params:', params);
    return apiService.admin.getWorkouts(params);
  }, [JSON.stringify(params)]);
};

export const useAdminRevenue = (params = {}) => {
  return useApi(() => apiService.admin.getRevenue(params), [JSON.stringify(params)]);
};