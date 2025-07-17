import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false, requirePremium = false }) => {
  const { user, loading, isAuthenticated, isAdmin, isPremium } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (requirePremium && !isPremium && isAuthenticated && !isAdmin) {
      toast.error('Premium subscription required! Please upgrade to access this feature.');
    }
  }, [requirePremium, isPremium, isAuthenticated, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requirePremium && !isPremium && !isAdmin) {
    return <Navigate to="/payments" replace />;
  }

  return children;
};

export default ProtectedRoute;