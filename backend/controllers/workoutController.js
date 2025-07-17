import Workout from '../models/Workout.js';
import UserWorkout from '../models/UserWorkout.js';

export const getAllWorkouts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { search, category, difficulty, duration, equipment } = req.query;
    
    let query = { isPublic: true, isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (equipment) query.equipment = { $in: equipment.split(',') };
    if (duration) {
      const [min, max] = duration.split('-').map(Number);
      query.duration = { $gte: min, $lte: max || 999 };
    }
    
    const [workouts, total] = await Promise.all([
      Workout.find(query)
        .populate('createdBy', 'name')
        .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .limit(limit)
        .skip(skip),
      Workout.countDocuments(query)
    ]);
    
    res.json({
      status: 'success',
      data: {
        workouts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: skip + limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching workouts'
    });
  }
};

export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      isActive: true
    }).populate('createdBy', 'name profile.avatar');
    
    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }
    
    if (!workout.isPublic && (!req.user || workout.createdBy._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied to this workout'
      });
    }
    
    res.json({
      status: 'success',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching workout'
    });
  }
};

export const getFeaturedWorkouts = async (req, res) => {
  try {
    const featuredWorkouts = await Workout.find({
      isPublic: true,
      isActive: true,
      averageRating: { $gte: 4.0 },
      completionCount: { $gte: 10 }
    })
    .populate('createdBy', 'name')
    .sort({ averageRating: -1, completionCount: -1 })
    .limit(6);
    
    res.json({
      status: 'success',
      data: {
        workouts: featuredWorkouts
      }
    });
  } catch (error) {
    console.error('Get featured workouts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching featured workouts'
    });
  }
};

export const getWorkoutCategories = async (req, res) => {
  try {
    const categories = await Workout.distinct('category', {
      isPublic: true,
      isActive: true
    });
    
    res.json({
      status: 'success',
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching categories'
    });
  }
};

export const createWorkout = async (req, res) => {
  try {
    const workoutData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    const workout = new Workout(workoutData);
    await workout.save();
    
    await workout.populate('createdBy', 'name');
    
    res.status(201).json({
      status: 'success',
      message: 'Workout created successfully',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating workout'
    });
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      isActive: true
    });
    
    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found or access denied'
      });
    }
    
    Object.assign(workout, req.body);
    await workout.save();
    
    await workout.populate('createdBy', 'name');
    
    res.json({
      status: 'success',
      message: 'Workout updated successfully',
      data: {
        workout
      }
    });
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating workout'
    });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      isActive: true
    });
    
    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found or access denied'
      });
    }
    
    workout.isActive = false;
    await workout.save();
    
    res.json({
      status: 'success',
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting workout'
    });
  }
};

export const rateWorkout = async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const workout = await Workout.findOne({
      _id: req.params.id,
      isActive: true
    });
    
    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }
    
    await workout.addRating(req.user._id, rating, review);
    
    res.json({
      status: 'success',
      message: 'Rating added successfully',
      data: {
        averageRating: workout.averageRating,
        totalRatings: workout.ratings.length
      }
    });
  } catch (error) {
    console.error('Rate workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while rating workout'
    });
  }
};

export const getUserWorkouts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, startDate, endDate } = req.query;
    
    let query = { user: req.user._id, isActive: true };
    
    if (status) query.status = status;
    if (startDate || endDate) {
      query.scheduledDate = {};
      if (startDate) query.scheduledDate.$gte = new Date(startDate);
      if (endDate) query.scheduledDate.$lte = new Date(endDate);
    }
    
    const [userWorkouts, total] = await Promise.all([
      UserWorkout.find(query)
        .populate('workout', 'name category duration estimatedCalories image')
        .sort({ scheduledDate: -1 })
        .limit(limit)
        .skip(skip),
      UserWorkout.countDocuments(query)
    ]);
    
    res.json({
      status: 'success',
      data: {
        workouts: userWorkouts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: skip + limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user workouts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user workouts'
    });
  }
};

export const scheduleWorkout = async (req, res) => {
  try {
    const { workoutId, scheduledDate, customExercises, notes } = req.body;
    
    if (workoutId) {
      const workout = await Workout.findOne({
        _id: workoutId,
        isActive: true
      });
      
      if (!workout) {
        return res.status(404).json({
          status: 'error',
          message: 'Workout not found'
        });
      }
      
      if (!workout.isPublic && workout.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied to this workout'
        });
      }
    }
    
    const userWorkout = new UserWorkout({
      user: req.user._id,
      workout: workoutId || null,
      scheduledDate: new Date(scheduledDate),
      customExercises: customExercises || [],
      notes
    });
    
    await userWorkout.save();
    await userWorkout.populate('workout', 'name category duration estimatedCalories image');
    
    res.status(201).json({
      status: 'success',
      message: 'Workout scheduled successfully',
      data: {
        userWorkout
      }
    });
  } catch (error) {
    console.error('Schedule workout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while scheduling workout'
    });
  }
};

export const startWorkout = async (req, res) => {
  try {
    const userWorkout = await UserWorkout.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });
    
    if (!userWorkout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }
    
    if (userWorkout.status !== 'planned') {
      return res.status(400).json({
        status: 'error',
        message: 'Workout cannot be started. Current status: ' + userWorkout.status
      });
    }
    
    userWorkout.startWorkout();
    await userWorkout.save();
    
    res.json({
      status: 'success',
      message: 'Workout started successfully',
      data: {
        userWorkout
      }
    });
  } catch (error) {
    console.error('Start workout error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error while starting workout'
    });
  }
};

export const completeWorkout = async (req, res) => {
  try {
    const { exerciseLogs, rating, mood, heartRate, bodyWeight, notes, actualDuration, totalCaloriesBurned } = req.body;
    
    const userWorkout = await UserWorkout.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    }).populate('workout');
    
    if (!userWorkout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }
    
    // Add exercise logs if provided
    if (exerciseLogs && exerciseLogs.length > 0) {
      exerciseLogs.forEach(log => {
        userWorkout.addExerciseLog(log);
      });
    }
    
    // Complete the workout
    userWorkout.completeWorkout();
    
    // Set additional data
    if (rating) userWorkout.rating = rating;
    if (mood) userWorkout.mood = mood;
    if (heartRate) userWorkout.heartRate = heartRate;
    if (bodyWeight) userWorkout.bodyWeight = bodyWeight;
    if (notes) userWorkout.notes = notes;
    if (actualDuration) userWorkout.actualDuration = actualDuration;
    
    // Set calories burned - prioritize frontend value, then exercise logs, then estimated calories
    if (totalCaloriesBurned) {
      userWorkout.totalCaloriesBurned = totalCaloriesBurned;
    } else if (!userWorkout.totalCaloriesBurned && userWorkout.workout?.estimatedCalories) {
      userWorkout.totalCaloriesBurned = userWorkout.workout.estimatedCalories;
    }
    
    await userWorkout.save();
    
    // Update user stats
    req.user.updateStats({
      caloriesBurned: userWorkout.totalCaloriesBurned
    });
    await req.user.save();
    
    res.json({
      status: 'success',
      message: 'Workout completed successfully',
      data: {
        userWorkout,
        caloriesBurned: userWorkout.totalCaloriesBurned
      }
    });
  } catch (error) {
    console.error('Complete workout error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error while completing workout'
    });
  }
};

export const skipWorkout = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const userWorkout = await UserWorkout.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });
    
    if (!userWorkout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }
    
    await userWorkout.skipWorkout(reason);
    
    res.json({
      status: 'success',
      message: 'Workout skipped successfully',
      data: {
        userWorkout
      }
    });
  } catch (error) {
    console.error('Skip workout error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error while skipping workout'
    });
  }
};

export const addToUserPlan = async (req, res) => {
  try {
    const workoutId = req.params.id;
    
    // Check if workout exists and is accessible
    const workout = await Workout.findOne({
      _id: workoutId,
      isActive: true
    });
    
    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }
    
    if (!workout.isPublic && workout.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied to this workout'
      });
    }
    
    // Check if workout is already in user's plan
    const existingUserWorkout = await UserWorkout.findOne({
      user: req.user._id,
      workout: workoutId,
      isActive: true,
      status: { $in: ['planned', 'in-progress'] }
    });
    
    if (existingUserWorkout) {
      return res.status(400).json({
        status: 'error',
        message: 'Workout is already in your plan'
      });
    }
    
    // Add workout to user's plan with 'planned' status
    const userWorkout = new UserWorkout({
      user: req.user._id,
      workout: workoutId,
      scheduledDate: new Date(),
      status: 'planned'
    });
    
    await userWorkout.save();
    await userWorkout.populate('workout', 'name category duration estimatedCalories image');
    
    res.status(201).json({
      status: 'success',
      message: 'Workout added to your plan successfully',
      data: {
        userWorkout
      }
    });
  } catch (error) {
    console.error('Add to user plan error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding workout to plan'
    });
  }
};

export const removeFromUserPlan = async (req, res) => {
  try {
    const workoutId = req.params.id;
    
    const userWorkout = await UserWorkout.findOne({
      user: req.user._id,
      workout: workoutId,
      isActive: true,
      status: { $in: ['planned', 'in-progress'] }
    });
    
    if (!userWorkout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found in your plan'
      });
    }
    
    await userWorkout.cancelWorkout();
    
    res.json({
      status: 'success',
      message: 'Workout removed from your plan successfully'
    });
  } catch (error) {
    console.error('Remove from user plan error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while removing workout from plan'
    });
  }
};

export const cancelWorkout = async (req, res) => {
  try {
    const userWorkout = await UserWorkout.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });
    
    if (!userWorkout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }
    
    await userWorkout.cancelWorkout();
    
    res.json({
      status: 'success',
      message: 'Workout cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel workout error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error while cancelling workout'
    });
  }
};