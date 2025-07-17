import express from 'express';
import { authenticate, requirePremium } from '../middleware/auth.js';
import { 
  validateMeal, 
  validateUserMeal, 
  validateObjectId, 
  validatePagination,
  validateSearch,
  validateRating,
  handleValidationErrors
} from '../middleware/validation.js';
import {
  getAllMeals,
  getMealById,
  getFeaturedMeals,
  getMealsByCategory,
  getMealCategories,
  createMeal,
  updateMeal,
  deleteMeal,
  rateMeal,
  toggleFavoriteMeal,
  getUserMeals,
  logMeal,
  updateUserMeal,
  deleteUserMeal,
  getDailyNutrition
} from '../controllers/mealController.js';

const router = express.Router();

// Get all meals (public)
router.get('/', validatePagination, validateSearch, handleValidationErrors, getAllMeals);

// Get meal by ID
router.get('/:id', validateObjectId('id'), handleValidationErrors, getMealById);

// Get featured meals
router.get('/featured/list', getFeaturedMeals);

// Get meals by category/goal
router.get('/category/:category', validatePagination, handleValidationErrors, getMealsByCategory);

// Get meal categories
router.get('/categories/list', getMealCategories);

// Create meal (Premium required)
router.post('/', authenticate, requirePremium, validateMeal, handleValidationErrors, createMeal);

// Update meal
router.put('/:id', authenticate, validateObjectId('id'), validateMeal, handleValidationErrors, updateMeal);

// Delete meal
router.delete('/:id', authenticate, validateObjectId('id'), handleValidationErrors, deleteMeal);

// Rate meal
router.post('/:id/rate', authenticate, requirePremium, validateObjectId('id'), validateRating, handleValidationErrors, rateMeal);

// Toggle favorite meal
router.post('/:id/favorite', authenticate, requirePremium, validateObjectId('id'), handleValidationErrors, toggleFavoriteMeal);

// USER MEAL ROUTES

// Get user's meals
router.get('/user/my-meals', authenticate, validatePagination, handleValidationErrors, getUserMeals);

// Log a meal
router.post('/user/log', authenticate, requirePremium, validateUserMeal, handleValidationErrors, logMeal);

// Update user meal
router.put('/user/:id', authenticate, validateObjectId('id'), handleValidationErrors, updateUserMeal);

// Delete user meal
router.delete('/user/:id', authenticate, validateObjectId('id'), handleValidationErrors, deleteUserMeal);

// Get daily nutrition summary
router.get('/user/nutrition/:date', authenticate, getDailyNutrition);

export default router;