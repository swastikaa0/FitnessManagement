import mongoose from 'mongoose';

const exerciseLogSchema = new mongoose.Schema({
  exerciseName: {
    type: String,
    required: true
  },
  sets: [{
    reps: {
      type: Number,
      default: 0
    },
    weight: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    },
    restTime: {
      type: Number,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  totalDuration: {
    type: Number,
    default: 0
  },
  caloriesBurned: {
    type: Number,
    default: 0
  },
  notes: String
});

const userWorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: true
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'skipped', 'cancelled'],
    default: 'planned'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  startTime: Date,
  endTime: Date,
  actualDuration: {
    type: Number,
    default: 0
  },
  totalCaloriesBurned: {
    type: Number,
    default: 0
  },
  exerciseLogs: [exerciseLogSchema],
  difficulty: {
    type: String,
    enum: ['too-easy', 'just-right', 'too-hard']
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
      enum: ['energetic', 'motivated', 'tired', 'stressed', 'neutral']
    },
    after: {
      type: String,
      enum: ['energetic', 'accomplished', 'tired', 'satisfied', 'frustrated']
    }
  },
  heartRate: {
    resting: Number,
    average: Number,
    maximum: Number
  },
  bodyWeight: Number,
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  achievements: [{
    type: String,
    enum: ['personal-best', 'consistency-streak', 'calorie-goal', 'duration-goal', 'first-completion']
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userWorkoutSchema.methods.startWorkout = function() {
  this.status = 'in-progress';
  this.startTime = new Date();
};

userWorkoutSchema.methods.completeWorkout = function() {
  this.status = 'completed';
  this.endTime = new Date();
  
  if (this.startTime) {
    this.actualDuration = Math.round((this.endTime - this.startTime) / (1000 * 60));
  }
  
  this.calculateCompletionPercentage();
  this.calculateTotalCalories();
};

userWorkoutSchema.methods.calculateCompletionPercentage = function() {
  if (this.exerciseLogs.length === 0) {
    this.completionPercentage = 0;
    return;
  }
  
  let totalSets = 0;
  let completedSets = 0;
  
  this.exerciseLogs.forEach(exercise => {
    totalSets += exercise.sets.length;
    completedSets += exercise.sets.filter(set => set.completed).length;
  });
  
  this.completionPercentage = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
};

userWorkoutSchema.methods.calculateTotalCalories = function() {
  this.totalCaloriesBurned = this.exerciseLogs.reduce((total, exercise) => {
    return total + (exercise.caloriesBurned || 0);
  }, 0);
};

userWorkoutSchema.methods.addExerciseLog = function(exerciseData) {
  const existingLog = this.exerciseLogs.find(log => log.exerciseName === exerciseData.exerciseName);
  
  if (existingLog) {
    existingLog.sets = exerciseData.sets;
    existingLog.totalDuration = exerciseData.totalDuration || 0;
    existingLog.caloriesBurned = exerciseData.caloriesBurned || 0;
    existingLog.notes = exerciseData.notes || '';
  } else {
    this.exerciseLogs.push(exerciseData);
  }
  
  this.calculateCompletionPercentage();
  this.calculateTotalCalories();
};

userWorkoutSchema.methods.skipWorkout = function(reason = '') {
  this.status = 'skipped';
  this.notes = reason;
};

userWorkoutSchema.methods.cancelWorkout = function(reason = '') {
  this.status = 'cancelled';
  this.notes = reason;
};

userWorkoutSchema.index({ user: 1, scheduledDate: -1 });
userWorkoutSchema.index({ user: 1, status: 1 });
userWorkoutSchema.index({ workout: 1 });
userWorkoutSchema.index({ scheduledDate: -1 });
userWorkoutSchema.index({ createdAt: -1 });

const UserWorkout = mongoose.model('UserWorkout', userWorkoutSchema);

export default UserWorkout;