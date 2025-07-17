import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      const result = await login(data.email, data.password);
      
      if (!result.success) {
        setLoginError(result.error);
      } else if (result.data.user.role !== 'admin') {
        setLoginError('Access denied. Admin credentials required.');
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      <button 
        onClick={handleLogoClick}
        className="absolute top-4 left-4 text-2xl font-bold text-white hover:text-blue-300 transition z-10 px-4 py-2 rounded hover:bg-white/10"
      >
        FIT ME
      </button>

      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
            <p className="text-blue-200">Secure access to administrative dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {loginError && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
                {loginError}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Admin Email
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-blue-200/70 backdrop-blur-sm"
                placeholder="Enter admin email"
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <input
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-blue-200/70 backdrop-blur-sm"
                placeholder="Enter password"
                disabled={isLoading}
              />
              {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-blue-200/70 text-sm">
              Need user access?{' '}
              <Link to="/login" className="text-blue-300 hover:text-white font-medium transition">
                User Login
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <p className="text-yellow-200 text-xs text-center">
              <Shield className="w-3 h-3 inline mr-1" />
              This is a secure admin portal. All access attempts are logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}