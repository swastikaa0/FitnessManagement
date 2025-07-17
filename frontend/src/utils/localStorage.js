/**
 * Utility functions for localStorage operations
 */

// Get user data from localStorage
export const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

// Get token from localStorage
export const getTokenFromStorage = () => {
  return localStorage.getItem('token');
};

// Check if user is admin
export const isUserAdmin = () => {
  const user = getUserFromStorage();
  return user?.role === 'admin';
};

// Check if user is premium
export const isUserPremium = () => {
  const user = getUserFromStorage();
  return user?.subscription?.status === 'active';
};

// Check if user is authenticated
export const isUserAuthenticated = () => {
  const token = getTokenFromStorage();
  const user = getUserFromStorage();
  return !!(token && user);
};

// Clear all auth data from localStorage
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Save user data to localStorage
export const saveUserToStorage = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
};

// Save token to localStorage
export const saveTokenToStorage = (token) => {
  localStorage.setItem('token', token);
};