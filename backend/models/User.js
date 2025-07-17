import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    phone: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    age: {
      type: Number,
      min: [13, 'Age must be at least 13'],
      max: [120, 'Age cannot exceed 120']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    height: {
      type: Number,
      min: [50, 'Height must be at least 50 cm']
    },
    weight: {
      type: Number,
      min: [20, 'Weight must be at least 20 kg']
    },
    fitnessGoal: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance', 'strength']
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active']
    },
    avatar: String
  },
  subscription: {
    plan: {
      type: String,
      default: 'none'
    },
    status: {
      type: String,
      enum: ['inactive', 'active', 'expired', 'cancelled'],
      default: 'inactive'
    },
    startDate: Date,
    endDate: Date,
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    totalSpent: {
      type: Number,
      default: 0
    }
  },
  stats: {
    totalWorkouts: {
      type: Number,
      default: 0
    },
    totalCaloriesBurned: {
      type: Number,
      default: 0
    },
    totalCaloriesConsumed: {
      type: Number,
      default: 0
    },
    activeDays: {
      type: Number,
      default: 0
    },
    fitnessScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      workoutReminders: {
        type: Boolean,
        default: true
      },
      mealReminders: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'private'
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateStats = function(workoutData) {
  if (workoutData.caloriesBurned) {
    this.stats.totalCaloriesBurned += workoutData.caloriesBurned;
  }
  this.stats.totalWorkouts += 1;
  this.stats.fitnessScore = Math.min(100, this.stats.fitnessScore + 1);
};

userSchema.methods.updateMealStats = function(mealData) {
  if (mealData.calories) {
    this.stats.totalCaloriesConsumed += mealData.calories;
  }
};

userSchema.methods.hasActivePremium = function() {
  return this.subscription.status === 'active' && 
         this.subscription.plan !== 'none' && 
         this.subscription.endDate > new Date();
};

const User = mongoose.model('User', userSchema);

export default User;