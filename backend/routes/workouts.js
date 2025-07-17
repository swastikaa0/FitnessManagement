import express from 'express';
import {
  getAllWorkouts,
  getWorkoutById,
  getFeaturedWorkouts,
  getWorkoutCategories,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  rateWorkout,
  getUserWorkouts,
  scheduleWorkout,
  startWorkout,
  completeWorkout,
  skipWorkout,
  cancelWorkout,
  addToUserPlan,
  removeFromUserPlan
} from '../controllers/workoutController.js';
import { authenticate, requirePremium } from '../middleware/auth.js';
import {
  validateWorkout,
  validateUserWorkout,
  validateObjectId,
  validatePagination,
  validateSearch,
  handleValidationErrors
} from '../middleware/validation.js';

const router = express.Router();

// Get all workouts (public)
router.get('/', validatePagination, validateSearch, handleValidationErrors, getAllWorkouts);

// Get workout by ID
router.get('/:id', validateObjectId('id'), handleValidationErrors, getWorkoutById);

// Get featured workouts
router.get('/featured/list', getFeaturedWorkouts);

// Get workout categories
router.get('/categories/list', getWorkoutCategories);

// Create workout (Premium required)
router.post('/', authenticate, requirePremium, validateWorkout, handleValidationErrors, createWorkout);

// Update workout
router.put('/:id', authenticate, validateObjectId('id'), validateWorkout, handleValidationErrors, updateWorkout);

// Delete workout
router.delete('/:id', authenticate, validateObjectId('id'), handleValidationErrors, deleteWorkout);

// Rate workout
router.post('/:id/rate', authenticate, requirePremium, validateObjectId('id'), handleValidationErrors, rateWorkout);

// USER WORKOUT ROUTES

// Get user's workouts
router.get('/user/my-workouts', authenticate, validatePagination, handleValidationErrors, getUserWorkouts);

// Schedule a workout
router.post('/user/schedule', authenticate, requirePremium, validateUserWorkout, handleValidationErrors, scheduleWorkout);

// Start a workout
router.post('/user/:id/start', authenticate, requirePremium, validateObjectId('id'), handleValidationErrors, startWorkout);

// Complete a workout
router.post('/user/:id/complete', authenticate, requirePremium, validateObjectId('id'), handleValidationErrors, completeWorkout);

// Skip a workout
router.post('/user/:id/skip', authenticate, validateObjectId('id'), handleValidationErrors, skipWorkout);

// Cancel a workout
router.delete('/user/:id', authenticate, validateObjectId('id'), handleValidationErrors, cancelWorkout);

// Add workout to user plan
router.post('/:id/add-to-plan', authenticate, validateObjectId('id'), handleValidationErrors, addToUserPlan);

// Remove workout from user plan
router.delete('/:id/remove-from-plan', authenticate, validateObjectId('id'), handleValidationErrors, removeFromUserPlan);

export default router;