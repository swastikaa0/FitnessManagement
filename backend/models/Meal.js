import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
    min: [0, 'Protein cannot be negative']
  },
  carbohydrates: {
    type: Number,
    required: true,
    min: [0, 'Carbohydrates cannot be negative']
  },
  fat: {
    type: Number,
    required: true,
    min: [0, 'Fat cannot be negative']
  },
  fiber: {
    type: Number,
    default: 0,
    min: [0, 'Fiber cannot be negative']
  },
  sugar: {
    type: Number,
    default: 0,
    min: [0, 'Sugar cannot be negative']
  },
  sodium: {
    type: Number,
    default: 0,
    min: [0, 'Sodium cannot be negative']
  }
});

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: true,
    enum: ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'slice', 'oz', 'lb']
  },
  calories: {
    type: Number,
    default: 0
  }
});

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Meal name is required'],
    trim: true,
    maxlength: [100, 'Meal name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage']
  },
  mealType: {
    type: String,
    required: true,
    enum: ['weight-loss', 'muscle-gain', 'maintenance', 'vegetarian', 'vegan', 'keto', 'paleo', 'gluten-free', 'dairy-free']
  },
  servingSize: {
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Serving size must be at least 1']
    },
    unit: {
      type: String,
      required: true,
      enum: ['serving', 'cup', 'bowl', 'plate', 'glass', 'piece']
    }
  },
  nutrition: {
    type: nutritionSchema,
    required: true
  },
  ingredients: [ingredientSchema],
  instructions: [{
    step: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  prepTime: {
    type: Number,
    required: true,
    min: [0, 'Prep time cannot be negative']
  },
  cookTime: {
    type: Number,
    default: 0,
    min: [0, 'Cook time cannot be negative']
  },
  totalTime: {
    type: Number
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  allergens: [{
    type: String,
    enum: ['dairy', 'eggs', 'fish', 'shellfish', 'tree-nuts', 'peanuts', 'wheat', 'soy', 'sesame']
  }],
  dietaryRestrictions: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'low-carb', 'keto', 'paleo']
  }],
  tags: [String],
  image: {
    type: String,
    default: '🍽️'
  },
  imageUrl: String,
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  favoriteCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

mealSchema.pre('save', function(next) {
  this.totalTime = this.prepTime + this.cookTime;
  next();
});

mealSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
    return;
  }
  
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  this.averageRating = (sum / this.ratings.length).toFixed(1);
  this.totalRatings = this.ratings.length;
};

mealSchema.methods.addRating = function(userId, rating, review = '') {
  const existingRating = this.ratings.find(r => r.user.toString() === userId.toString());
  
  if (existingRating) {
    existingRating.rating = rating;
    existingRating.review = review;
    existingRating.createdAt = new Date();
  } else {
    this.ratings.push({
      user: userId,
      rating,
      review
    });
  }
  
  this.calculateAverageRating();
};

mealSchema.methods.incrementFavorite = function() {
  this.favoriteCount += 1;
};

mealSchema.methods.decrementFavorite = function() {
  this.favoriteCount = Math.max(0, this.favoriteCount - 1);
};

mealSchema.index({ name: 'text', description: 'text', tags: 'text' });
mealSchema.index({ category: 1, mealType: 1 });
mealSchema.index({ averageRating: -1 });
mealSchema.index({ favoriteCount: -1 });
mealSchema.index({ 'nutrition.calories': 1 });
mealSchema.index({ createdAt: -1 });

const Meal = mongoose.model('Meal', mealSchema);

export default Meal;