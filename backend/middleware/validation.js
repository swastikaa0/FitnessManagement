import { body, param, query, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

export const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('profile.age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),
  
  body('profile.height')
    .optional()
    .isFloat({ min: 50, max: 300 })
    .withMessage('Height must be between 50 and 300 cm'),
  
  body('profile.weight')
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage('Weight must be between 20 and 500 kg'),
  
  body('profile.gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  
  body('profile.fitnessGoal')
    .optional()
    .isIn(['weight-loss', 'muscle-gain', 'maintenance', 'endurance'])
    .withMessage('Invalid fitness goal'),
  
  body('profile.activityLevel')
    .optional()
    .isIn(['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active'])
    .withMessage('Invalid activity level'),
  
  handleValidationErrors
];

export const validateWorkout = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Workout name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('category')
    .isIn(['cardio', 'strength', 'flexibility', 'hiit', 'yoga', 'pilates', 'crossfit', 'bodyweight', 'other'])
    .withMessage('Invalid workout category'),
  
  body('difficulty')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced'),
  
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 minute'),
  
  body('estimatedCalories')
    .isInt({ min: 1 })
    .withMessage('Estimated calories must be positive'),
  
  body('exercises')
    .isArray({ min: 1 })
    .withMessage('At least one exercise is required'),
  
  body('exercises.*.name')
    .trim()
    .notEmpty()
    .withMessage('Exercise name is required'),
  
  handleValidationErrors
];

export const validateMeal = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Meal name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('category')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage'])
    .withMessage('Invalid meal category'),
  
  body('mealType')
    .isIn(['weight-loss', 'muscle-gain', 'maintenance', 'vegetarian', 'vegan', 'keto', 'paleo', 'gluten-free', 'dairy-free'])
    .withMessage('Invalid meal type'),
  
  body('nutrition.calories')
    .isFloat({ min: 0 })
    .withMessage('Calories must be non-negative'),
  
  body('nutrition.protein')
    .isFloat({ min: 0 })
    .withMessage('Protein must be non-negative'),
  
  body('nutrition.carbohydrates')
    .isFloat({ min: 0 })
    .withMessage('Carbohydrates must be non-negative'),
  
  body('nutrition.fat')
    .isFloat({ min: 0 })
    .withMessage('Fat must be non-negative'),
  
  body('prepTime')
    .isInt({ min: 0 })
    .withMessage('Prep time must be non-negative'),
  
  body('cookTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Cook time must be non-negative'),
  
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  
  handleValidationErrors
];

export const validateUserMeal = [
  body('mealType')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage'])
    .withMessage('Invalid meal type'),
  
  body('servingSize.quantity')
    .isFloat({ min: 0.1 })
    .withMessage('Serving size must be positive'),
  
  body('consumedDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  handleValidationErrors
];

export const validateUserWorkout = [
  body('scheduledDate')
    .isISO8601()
    .withMessage('Invalid scheduled date format'),
  
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('difficulty')
    .optional()
    .isIn(['too-easy', 'just-right', 'too-hard'])
    .withMessage('Invalid difficulty feedback'),
  
  handleValidationErrors
];

export const validateSubscription = [
  body('planType')
    .isIn(['basic', 'standard', 'premium', 'basic-monthly', 'standard-monthly', 'premium-annual'])
    .withMessage('Invalid subscription plan type'),
  
  body('billingCycle')
    .optional()
    .isIn(['monthly', 'quarterly', 'semi-annually', 'annually'])
    .withMessage('Invalid billing cycle'),
  
  body('paymentMethod')
    .optional()
    .isIn(['credit-card', 'debit-card', 'paypal', 'stripe', 'bank-transfer', 'other'])
    .withMessage('Invalid payment method'),
  
  handleValidationErrors
];

export const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`),
  
  handleValidationErrors
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

export const validateSearch = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
  
  handleValidationErrors
];

export const validateUserProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),
  
  body('height')
    .optional()
    .isFloat({ min: 50, max: 300 })
    .withMessage('Height must be between 50 and 300 cm'),
  
  body('weight')
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage('Weight must be between 20 and 500 kg'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  
  body('fitnessGoal')
    .optional()
    .isIn(['weight-loss', 'muscle-gain', 'maintenance', 'endurance'])
    .withMessage('Invalid fitness goal'),
  
  body('activityLevel')
    .optional()
    .isIn(['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active'])
    .withMessage('Invalid activity level'),
  
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  handleValidationErrors
];

export const validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('review')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Review cannot exceed 500 characters'),
  
  handleValidationErrors
];