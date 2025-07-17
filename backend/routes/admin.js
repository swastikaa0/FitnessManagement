import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getAllMeals,
  createMeal,
  updateMeal,
  deleteMeal,
  getAnalytics,
  getRevenueStats,
  toggleWorkoutVisibility,
  toggleMealVisibility,
  processPayment,
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  toggleSubscriptionPlanStatus
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  validateObjectId,
  validatePagination,
  validateWorkout,
  validateMeal,
  handleValidationErrors
} from '../middleware/validation.js';

const router = express.Router();

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    status: 'error',
    message: 'Too many admin requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply authentication and admin authorization to all routes
router.use(adminLimiter);
router.use(authenticate);
router.use(authorize('admin'));

// Log all admin access attempts
router.use((req, res, next) => {
  console.log(`Admin access attempt: ${req.method} ${req.path} by user ${req.user?._id} with role ${req.user?.role}`);
  next();
});

// Dashboard and Analytics Routes
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);
router.get('/revenue', getRevenueStats);

// Payment Routes
router.post('/payments/process', processPayment);

// User Management Routes
router.get('/users', validatePagination, handleValidationErrors, getAllUsers);
router.get('/users/:id', validateObjectId('id'), handleValidationErrors, getUserById);
router.post('/users', handleValidationErrors, createUser);
router.put('/users/:id', validateObjectId('id'), handleValidationErrors, updateUser);
router.delete('/users/:id', validateObjectId('id'), handleValidationErrors, deleteUser);

// Content Management Routes
router.get('/workouts', validatePagination, handleValidationErrors, getAllWorkouts);
router.post('/workouts', validateWorkout, handleValidationErrors, createWorkout);
router.put('/workouts/:id', validateObjectId('id'), validateWorkout, handleValidationErrors, updateWorkout);
router.delete('/workouts/:id', validateObjectId('id'), handleValidationErrors, deleteWorkout);
router.get('/meals', validatePagination, handleValidationErrors, getAllMeals);
router.post('/meals', validateMeal, handleValidationErrors, createMeal);
router.put('/meals/:id', validateObjectId('id'), validateMeal, handleValidationErrors, updateMeal);
router.delete('/meals/:id', validateObjectId('id'), handleValidationErrors, deleteMeal);

// Content Visibility Management
router.patch('/workouts/:id/visibility', 
  validateObjectId('id'), 
  handleValidationErrors, 
  toggleWorkoutVisibility
);
router.patch('/meals/:id/visibility', 
  validateObjectId('id'), 
  handleValidationErrors, 
  toggleMealVisibility
);

// Subscription Plan Management Routes
router.get('/subscription-plans', getSubscriptionPlans);
router.post('/subscription-plans', createSubscriptionPlan);
router.put('/subscription-plans/:id', updateSubscriptionPlan);
router.delete('/subscription-plans/:id', deleteSubscriptionPlan);
router.patch('/subscription-plans/:id/toggle-status', toggleSubscriptionPlanStatus);

export default router;