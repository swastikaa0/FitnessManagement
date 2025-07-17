import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sets: {
    type: Number,
    default: 1
  },
  reps: {
    type: Number,
    default: 1
  },
  duration: {
    type: Number,
    default: 0
  },
  restTime: {
    type: Number,
    default: 30
  },
  caloriesPerMinute: {
    type: Number,
    default: 5
  },
  instructions: [String],
  targetMuscles: [String]
});

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    trim: true,
    maxlength: [100, 'Workout name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['cardio', 'strength', 'flexibility', 'hiit', 'yoga', 'pilates', 'crossfit', 'bodyweight', 'other']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  estimatedCalories: {
    type: Number,
    required: true,
    min: [1, 'Estimated calories must be positive']
  },
  exercises: [exerciseSchema],
  equipment: [{
    type: String,
    enum: ['none', 'dumbbells', 'barbell', 'resistance-bands', 'kettlebell', 'medicine-ball', 'yoga-mat', 'pull-up-bar', 'bench', 'treadmill', 'stationary-bike', 'other']
  }],
  targetMuscles: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'abs', 'obliques', 'glutes', 'quadriceps', 'hamstrings', 'calves', 'full-body']
  }],
  tags: [String],
  image: {
    type: String,
    default: '💪'
  },
  videoUrl: String,
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
  completionCount: {
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

workoutSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
    return;
  }
  
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  this.averageRating = (sum / this.ratings.length).toFixed(1);
  this.totalRatings = this.ratings.length;
};

workoutSchema.methods.addRating = function(userId, rating, review = '') {
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

workoutSchema.methods.incrementCompletion = function() {
  this.completionCount += 1;
};

workoutSchema.index({ name: 'text', description: 'text', tags: 'text' });
workoutSchema.index({ category: 1, difficulty: 1 });
workoutSchema.index({ averageRating: -1 });
workoutSchema.index({ completionCount: -1 });
workoutSchema.index({ createdAt: -1 });

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;