import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  getMe,
  logout,
  changePassword,
  forgotPassword,
  verifyToken
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import {
  validateRegister,
  validateLogin,
  handleValidationErrors
} from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegister, handleValidationErrors, register);

router.post('/login', validateLogin, handleValidationErrors, login);

router.get('/me', authenticate, getMe);

router.post('/logout', authenticate, logout);

router.post('/change-password', authenticate, changePassword);

router.post('/forgot-password', forgotPassword);

router.get('/verify', authenticate, verifyToken);

router.post('/verify-token', verifyToken);

export default router;
