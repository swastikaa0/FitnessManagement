import express from 'express';
import {
  getSubscriptionPlans,
  getCurrentSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  renewSubscription,
  getSubscriptionHistory,
  getUsageStats,
  confirmPayment
} from '../controllers/subscriptionController.js';
import { authenticate } from '../middleware/auth.js';
import {
  validateSubscription,
  validatePagination,
  handleValidationErrors
} from '../middleware/validation.js';

const router = express.Router();

// Public route - get available subscription plans
router.get('/plans', getSubscriptionPlans);

// Protected routes - require authentication
router.use(authenticate);

// Get current user's subscription
router.get('/current', getCurrentSubscription);

// Create new subscription
router.post('/', 
  validateSubscription, 
  handleValidationErrors, 
  createSubscription
);

// Update subscription
router.put('/current', 
  validateSubscription, 
  handleValidationErrors, 
  updateSubscription
);

// Cancel subscription
router.delete('/current', cancelSubscription);

// Renew subscription
router.post('/renew', renewSubscription);

// Get subscription history
router.get('/history', 
  validatePagination, 
  handleValidationErrors, 
  getSubscriptionHistory
);

// Get usage statistics
router.get('/usage', getUsageStats);

// Confirm payment
router.post('/confirm-payment', confirmPayment);

export default router;