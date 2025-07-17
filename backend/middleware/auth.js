import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('JWT decoded:', { userId: decoded.id });
    
    const user = await User.findById(decoded.id).select('-password');
    console.log('User found:', {
      userExists: !!user,
      userId: user?._id,
      userRole: user?.role,
      userEmail: user?.email,
      isActive: user?.isActive
    });
    
    if (!user) {
      console.log('Authentication failed: User not found for ID:', decoded.id);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. User not found.'
      });
    }
    
    if (!user.isActive) {
      console.log('Authentication failed: User account deactivated:', user._id);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token.'
      });
    }
    
    req.user = user;
    console.log('Authentication successful for user:', user._id, 'with role:', user.role);
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired.'
      });
    }
    
    console.error('Authentication error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during authentication.'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorization check:', {
      userExists: !!req.user,
      userRole: req.user?.role,
      requiredRoles: roles,
      userId: req.user?._id,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    if (!req.user) {
      console.log('Authorization failed: No user in request');
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required.'
      });
    }
    
    if (!req.user.role) {
      console.log('Authorization failed: User has no role assigned:', req.user._id);
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      console.log('Authorization failed: Role mismatch', {
        userRole: req.user.role,
        requiredRoles: roles,
        userId: req.user._id,
        timestamp: new Date().toISOString(),
        ip: req.ip
      });
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    console.log('Authorization successful for user:', req.user._id, 'with role:', req.user.role);
    next();
  };
}

export const requirePremium = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required.'
      });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user.hasActivePremium()) {
      return res.status(403).json({
        status: 'error',
        message: 'Premium subscription required to access this feature.',
        code: 'PREMIUM_REQUIRED',
        redirectTo: '/payments'
      });
    }
    
    next();
  } catch (error) {
    console.error('Premium check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during premium verification.'
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};