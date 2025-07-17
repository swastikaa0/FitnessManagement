import mongoose from 'mongoose';

const userMealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal'
  },
  customMeal: {
    name: String,
    description: String,
    nutrition: {
      calories: {
        type: Number,
        required: function() {
          return this.customMeal && this.customMeal.name;
        },
        min: [0, 'Calories cannot be negative']
      },
      protein: {
        type: Number,
        default: 0,
        min: [0, 'Protein cannot be negative']
      },
      carbohydrates: {
        type: Number,
        default: 0,
        min: [0, 'Carbohydrates cannot be negative']
      },
      fat: {
        type: Number,
        default: 0,
        min: [0, 'Fat cannot be negative']
      },
      fiber: {
        type: Number,
        default: 0
      },
      sugar: {
        type: Number,
        default: 0
      },
      sodium: {
        type: Number,
        default: 0
      }
    },
    image: String
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage']
  },
  consumedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  servingSize: {
    quantity: {
      type: Number,
      required: true,
      min: [0.1, 'Serving size must be positive'],
      default: 1
    },
    unit: {
      type: String,
      default: 'serving'
    }
  },
  actualNutrition: {
    calories: {
      type: Number,
      default: 0
    },
    protein: {
      type: Number,
      default: 0
    },
    carbohydrates: {
      type: Number,
      default: 0
    },
    fat: {
      type: Number,
      default: 0
    },
    fiber: {
      type: Number,
      default: 0
    },
    sugar: {
      type: Number,
      default: 0
    },
    sodium: {
      type: Number,
      default: 0
    }
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: String,
  mood: {
    before: {
      type: String,
      enum: ['hungry', 'satisfied', 'full', 'craving', 'neutral']
    },
    after: {
      type: String,
      enum: ['satisfied', 'full', 'still-hungry', 'uncomfortable', 'energized']
    }
  },
  location: {
    type: String,
    enum: ['home', 'restaurant', 'work', 'gym', 'other']
  },
  preparationMethod: {
    type: String,
    enum: ['homemade', 'restaurant', 'takeout', 'packaged', 'meal-prep']
  },
  tags: [String],
  photos: [String],
  isCheatMeal: {
    type: Boolean,
    default: false
  },
  waterIntake: {
    type: Number,
    default: 0,
    min: [0, 'Water intake cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

userMealSchema.pre('save', async function(next) {
  console.log('UserMeal pre-save hook triggered');
  console.log('Meal ID:', this.meal);
  console.log('Custom meal:', this.customMeal);
  console.log('Current actualNutrition:', this.actualNutrition);
  
  // Validate that either meal or customMeal is provided, but not both
  if (!this.meal && !this.customMeal) {
    return next(new Error('Either meal or customMeal must be provided'));
  }
  
  if (this.meal && this.actualNutrition.calories === 0) {
    console.log('Calculating nutrition for regular meal');
    await this.calculateActualNutrition();
    console.log('After calculation, actualNutrition:', this.actualNutrition);
  } else if (this.customMeal && this.actualNutrition.calories === 0) {
    console.log('Processing custom meal');
    
    // Set default nutrition values if not provided
    if (!this.customMeal.nutrition) {
      this.customMeal.nutrition = {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      };
    }
    
    this.actualNutrition = {
      calories: (this.customMeal.nutrition.calories || 0) * this.servingSize.quantity,
      protein: (this.customMeal.nutrition.protein || 0) * this.servingSize.quantity,
      carbohydrates: (this.customMeal.nutrition.carbohydrates || 0) * this.servingSize.quantity,
      fat: (this.customMeal.nutrition.fat || 0) * this.servingSize.quantity,
      fiber: (this.customMeal.nutrition.fiber || 0) * this.servingSize.quantity,
      sugar: (this.customMeal.nutrition.sugar || 0) * this.servingSize.quantity,
      sodium: (this.customMeal.nutrition.sodium || 0) * this.servingSize.quantity
    };
  }
  
  console.log('Final actualNutrition before save:', this.actualNutrition);
  next();
});

userMealSchema.methods.calculateActualNutrition = async function() {
  if (!this.meal) {
    console.log('No meal ID provided for nutrition calculation');
    return;
  }
  
  console.log('Calculating nutrition for meal ID:', this.meal);
  await this.populate('meal');
  
  if (this.meal && this.meal.nutrition) {
    console.log('Meal nutrition data:', this.meal.nutrition);
    console.log('Serving size:', this.servingSize);
    const multiplier = this.servingSize.quantity || 1;
    this.actualNutrition = {
      calories: Math.round(this.meal.nutrition.calories * multiplier),
      protein: Math.round((this.meal.nutrition.protein || 0) * multiplier * 10) / 10,
      carbohydrates: Math.round((this.meal.nutrition.carbohydrates || 0) * multiplier * 10) / 10,
      fat: Math.round((this.meal.nutrition.fat || 0) * multiplier * 10) / 10,
      fiber: Math.round((this.meal.nutrition.fiber || 0) * multiplier * 10) / 10,
      sugar: Math.round((this.meal.nutrition.sugar || 0) * multiplier * 10) / 10,
      sodium: Math.round((this.meal.nutrition.sodium || 0) * multiplier * 10) / 10
    };
    console.log('Calculated actualNutrition:', this.actualNutrition);
  } else {
    console.log('Meal not found or missing nutrition data:', this.meal);
  }
};

userMealSchema.methods.updateServingSize = function(newQuantity) {
  const oldQuantity = this.servingSize.quantity;
  this.servingSize.quantity = newQuantity;
  
  const multiplier = newQuantity / oldQuantity;
  
  Object.keys(this.actualNutrition).forEach(key => {
    if (key === 'calories') {
      this.actualNutrition[key] = Math.round(this.actualNutrition[key] * multiplier);
    } else {
      this.actualNutrition[key] = Math.round(this.actualNutrition[key] * multiplier * 10) / 10;
    }
  });
};

userMealSchema.methods.getMealName = function() {
  if (this.meal && this.meal.name) {
    return this.meal.name;
  } else if (this.customMeal && this.customMeal.name) {
    return this.customMeal.name;
  } else {
    return `${this.mealType || 'Unknown'} Meal`;
  }
};

userMealSchema.methods.getMealImage = function() {
  return this.meal ? this.meal.image : this.customMeal.image || '🍽️';
};

userMealSchema.statics.getDailyNutrition = async function(userId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const meals = await this.find({
    user: userId,
    consumedDate: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    isActive: true
  }).populate('meal');
  
  console.log('Found meals for date:', date);
  console.log('Meals count:', meals.length);
  meals.forEach((meal, index) => {
    console.log(`Meal ${index}:`, {
      id: meal._id,
      mealId: meal.meal,
      mealIdType: typeof meal.meal,
      mealPopulated: meal.meal && typeof meal.meal === 'object',
      mealName: meal.meal && meal.meal.name ? meal.meal.name : 'NO MEAL NAME',
      customMeal: meal.customMeal,
      customMealName: meal.customMeal && meal.customMeal.name ? meal.customMeal.name : 'NO CUSTOM MEAL NAME',
      mealType: meal.mealType,
      getMealNameResult: meal.getMealName(),
      status: meal.status
    });
  });
  
  const completedMeals = meals.filter(meal => meal.status === 'completed');
  
  const totalNutrition = completedMeals.reduce((total, meal) => {
    return {
      calories: total.calories + meal.actualNutrition.calories,
      protein: total.protein + meal.actualNutrition.protein,
      carbohydrates: total.carbohydrates + meal.actualNutrition.carbohydrates,
      fat: total.fat + meal.actualNutrition.fat,
      fiber: total.fiber + meal.actualNutrition.fiber,
      sugar: total.sugar + meal.actualNutrition.sugar,
      sodium: total.sodium + meal.actualNutrition.sodium
    };
  }, {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  });
  
  return {
    totalNutrition,
    mealCount: meals.length,
    completedMealCount: completedMeals.length,
    meals: meals.map(meal => ({
      id: meal._id,
      name: meal.getMealName(),
      type: meal.mealType,
      calories: meal.actualNutrition.calories,
      time: meal.consumedDate,
      status: meal.status
    }))
  };
};

userMealSchema.index({ user: 1, consumedDate: -1 });
userMealSchema.index({ user: 1, mealType: 1 });
userMealSchema.index({ meal: 1 });
userMealSchema.index({ consumedDate: -1 });
userMealSchema.index({ createdAt: -1 });

const UserMeal = mongoose.model('UserMeal', userMealSchema);

export default UserMeal;