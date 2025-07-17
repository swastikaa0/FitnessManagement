import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  getUserFromStorage, 
  getTokenFromStorage, 
  saveUserToStorage, 
  saveTokenToStorage, 
  clearAuthData 
} from '../utils/localStorage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getUserFromStorage());
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(getTokenFromStorage());
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        const user = userData.data.user;
        
        saveUserToStorage(user);
        setUser(user);
      } else {
        clearAuthData();
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      clearAuthData();
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data.data;
        
        saveTokenToStorage(token);
        saveUserToStorage(user);
        setToken(token);
        setUser(user);
        
        toast.success('Login successful!');
        
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
        
        return { success: true, data };
      } else {
        const errorMessage = data.message || 'Login failed';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'Network error. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data.data;
        saveTokenToStorage(token);
        saveUserToStorage(user);
        setToken(token);
        setUser(user);
        toast.success('Registration successful!');
        navigate('/dashboard');
        return { success: true, data };
      } else {
        const errorMessage = data.message || 'Registration failed';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = 'Network error. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = data.data.user;
        saveUserToStorage(updatedUser);
        setUser(updatedUser);
        toast.success('Profile updated successfully!');
        return { success: true, data };
      } else {
        const errorMessage = data.message || 'Profile update failed';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = 'Network error. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const refreshUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        const user = userData.data.user;
        saveUserToStorage(user);
        setUser(user);
        return { success: true, user };
      } else {
        return { success: false, error: 'Failed to refresh user data' };
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      return { success: false, error: 'Network error while refreshing user data' };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isPremium: user?.subscription?.status === 'active'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};