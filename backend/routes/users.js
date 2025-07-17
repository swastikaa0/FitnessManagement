import express from 'express';
import {
  getProfile,
  updateProfile,
  updatePreferences,
  getDashboard,
  getStats,
  getActivityHistory,
  deleteAccount
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import {
  validateUserProfile,
  validatePagination,
  handleValidationErrors
} from '../middleware/validation.js';

const router = express.Router();

router.get('/profile', authenticate, getProfile);

router.put('/profile', authenticate, validateUserProfile, handleValidationErrors, updateProfile);

router.put('/preferences', authenticate, updatePreferences);

router.get('/dashboard', authenticate, getDashboard);

router.get('/stats', authenticate, getStats);

router.get('/activity-history', authenticate, validatePagination, handleValidationErrors, getActivityHistory);

router.delete('/account', authenticate, deleteAccount);

export default router;