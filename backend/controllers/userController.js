import User from '../models/User.js';
import UserWorkout from '../models/UserWorkout.js';
import UserMeal from '../models/UserMeal.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const userResponse = {
      id: user._id,
      fullName: user.name,
      name: user.name,
      email: user.email,
      phone: user.profile?.phone || '',
      dateOfBirth: user.profile?.dateOfBirth || '',
      gender: user.profile?.gender || '',
      height: user.profile?.height || '',
      weight: user.profile?.weight || '',
      fitnessGoal: user.profile?.fitnessGoal || '',
      role: user.role,
      profile: user.profile,
      subscription: user.subscription,
      stats: user.stats,
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };
    
    res.json({
      status: 'success',
      data: userResponse
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching profile'
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone, dateOfBirth, gender, height, weight, fitnessGoal } = req.body;
    
    const updates = {};
    
    // Update basic user fields
    if (fullName) updates.name = fullName;
    if (email) updates.email = email;
    
    // Update profile fields
    const profileUpdates = {};
    if (phone !== undefined) profileUpdates.phone = phone;
    if (dateOfBirth !== undefined) profileUpdates.dateOfBirth = dateOfBirth;
    if (gender !== undefined) profileUpdates.gender = gender;
    if (height !== undefined) profileUpdates.height = height;
    if (weight !== undefined) profileUpdates.weight = weight;
    if (fitnessGoal !== undefined) profileUpdates.fitnessGoal = fitnessGoal;
    
    if (Object.keys(profileUpdates).length > 0) {
      updates.profile = { ...req.user.profile, ...profileUpdates };
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    const userResponse = {
      id: user._id,
      fullName: user.name,
      name: user.name,
      email: user.email,
      phone: user.profile?.phone || '',
      dateOfBirth: user.profile?.dateOfBirth || '',
      gender: user.profile?.gender || '',
      height: user.profile?.height || '',
      weight: user.profile?.weight || '',
      fitnessGoal: user.profile?.fitnessGoal || '',
      role: user.role,
      profile: user.profile,
      subscription: user.subscription,
      stats: user.stats,
      preferences: user.preferences
    };
    
    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating profile'
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const [todayWorkouts, todayMeals, weeklyWorkouts, monthlyStats] = await Promise.all([
      UserWorkout.find({
        user: req.user._id,
        scheduledDate: { $gte: today, $lt: tomorrow },
        isActive: true
      }).populate('workout', 'name duration estimatedCalories'),
      
      UserMeal.find({
        user: req.user._id,
        consumedDate: { $gte: today, $lt: tomorrow },
        isActive: true
      }).populate('meal', 'name image'),
      
      UserWorkout.find({
        user: req.user._id,
        scheduledDate: { $gte: thisWeekStart },
        status: 'completed',
        isActive: true
      }),
      
      UserWorkout.aggregate([
        {
          $match: {
            user: req.user._id,
            scheduledDate: { $gte: thisMonthStart },
            status: 'completed',
            isActive: true
          }
        },
        {
          $group: {
            _id: null,
            totalWorkouts: { $sum: 1 },
            totalCaloriesBurned: { $sum: '$totalCaloriesBurned' },
            totalDuration: { $sum: '$actualDuration' }
          }
        }
      ])
    ]);
    
    const todayNutrition = await UserMeal.getDailyNutrition(req.user._id, today);
    
    const dashboardData = {
      user: {
        name: user.name,
        stats: user.stats,
        subscription: user.subscription
      },
      today: {
        workouts: todayWorkouts.map(workout => ({
          id: workout._id,
          name: workout.workout?.name || 'Custom Workout',
          status: workout.status,
          scheduledTime: workout.scheduledDate,
          duration: workout.workout?.duration || workout.actualDuration,
          calories: workout.workout?.estimatedCalories || workout.totalCaloriesBurned
        })),
        meals: todayMeals.map(meal => ({
          id: meal._id,
          name: meal.getMealName(),
          type: meal.mealType,
          calories: meal.actualNutrition.calories,
          time: meal.consumedDate,
          image: meal.getMealImage()
        })),
        nutrition: todayNutrition.totalNutrition
      },
      weekly: {
        workoutsCompleted: weeklyWorkouts.length,
        activeDays: new Set(weeklyWorkouts.map(w => w.scheduledDate.toDateString())).size
      },
      monthly: {
        totalWorkouts: monthlyStats[0]?.totalWorkouts || 0,
        totalCaloriesBurned: monthlyStats[0]?.totalCaloriesBurned || 0,
        totalDuration: monthlyStats[0]?.totalDuration || 0
      }
    };
    
    res.json({
      status: 'success',
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching dashboard data'
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }
    
    const [workoutStats, nutritionStats] = await Promise.all([
      UserWorkout.aggregate([
        {
          $match: {
            user: req.user._id,
            scheduledDate: { $gte: startDate },
            status: 'completed',
            isActive: true
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: period === 'week' ? '%Y-%m-%d' : '%Y-%m',
                date: '$scheduledDate'
              }
            },
            workouts: { $sum: 1 },
            totalCalories: { $sum: '$totalCaloriesBurned' },
            totalDuration: { $sum: '$actualDuration' }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      
      UserMeal.aggregate([
        {
          $match: {
            user: req.user._id,
            consumedDate: { $gte: startDate },
            isActive: true
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: period === 'week' ? '%Y-%m-%d' : '%Y-%m',
                date: '$consumedDate'
              }
            },
            totalCalories: { $sum: '$actualNutrition.calories' },
            totalProtein: { $sum: '$actualNutrition.protein' },
            totalCarbs: { $sum: '$actualNutrition.carbohydrates' },
            totalFat: { $sum: '$actualNutrition.fat' },
            mealCount: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);
    
    res.json({
      status: 'success',
      data: {
        period,
        workouts: workoutStats,
        nutrition: nutritionStats
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching stats'
    });
  }
};

export const getActivityHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const [workouts, meals, totalWorkouts, totalMeals] = await Promise.all([
      UserWorkout.find({
        user: req.user._id,
        isActive: true
      })
      .populate('workout', 'name category duration estimatedCalories')
      .sort({ scheduledDate: -1 })
      .limit(limit)
      .skip(skip),
      
      UserMeal.find({
        user: req.user._id,
        isActive: true
      })
      .populate('meal', 'name category image')
      .sort({ consumedDate: -1 })
      .limit(limit)
      .skip(skip),
      
      UserWorkout.countDocuments({ user: req.user._id, isActive: true }),
      UserMeal.countDocuments({ user: req.user._id, isActive: true })
    ]);
    
    const activities = [
      ...workouts.map(workout => ({
        id: workout._id,
        type: 'workout',
        name: workout.workout?.name || 'Custom Workout',
        category: workout.workout?.category || 'other',
        status: workout.status,
        date: workout.scheduledDate,
        duration: workout.actualDuration || workout.workout?.duration,
        calories: workout.totalCaloriesBurned || workout.workout?.estimatedCalories,
        rating: workout.rating
      })),
      ...meals.map(meal => ({
        id: meal._id,
        type: 'meal',
        name: meal.getMealName(),
        category: meal.mealType,
        date: meal.consumedDate,
        calories: meal.actualNutrition.calories,
        rating: meal.rating,
        image: meal.getMealImage()
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({
      status: 'success',
      data: {
        activities: activities.slice(0, limit),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(Math.max(totalWorkouts, totalMeals) / limit),
          totalItems: totalWorkouts + totalMeals,
          hasNext: skip + limit < Math.max(totalWorkouts, totalMeals),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Activity history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching activity history'
    });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const { notifications, emailUpdates, darkMode, publicProfile } = req.body;
    
    const preferencesUpdates = {};
    if (notifications !== undefined) preferencesUpdates.notifications = notifications;
    if (emailUpdates !== undefined) preferencesUpdates.emailUpdates = emailUpdates;
    if (darkMode !== undefined) preferencesUpdates.darkMode = darkMode;
    if (publicProfile !== undefined) preferencesUpdates.publicProfile = publicProfile;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { preferences: { ...req.user.preferences, ...preferencesUpdates } } },
      { new: true, runValidators: true }
    );
    
    res.json({
      status: 'success',
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating preferences'
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        status: 'error',
        message: 'Password is required to delete account'
      });
    }
    
    const user = await User.findById(req.user._id).select('+password');
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid password'
      });
    }
    
    user.isActive = false;
    await user.save();
    
    res.json({
      status: 'success',
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting account'
    });
  }
};