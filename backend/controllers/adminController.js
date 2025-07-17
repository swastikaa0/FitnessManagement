import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Meal from '../models/Meal.js';
import UserWorkout from '../models/UserWorkout.js';
import UserMeal from '../models/UserMeal.js';
import Subscription from '../models/Subscription.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
    const [totalUsers, activeUsers, totalWorkouts, totalMeals, monthlyRevenue, activeSubscriptions] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ 
        isActive: true, 
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      }),
      Workout.countDocuments({ isActive: true }),
      Meal.countDocuments({ isActive: true }),
      Subscription.aggregate([
        {
          $match: {
            paymentDate: { $gte: thisMonth },
            paymentStatus: 'paid',
            status: { $in: ['active', 'trialing', 'expired'] }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$price' },
            count: { $sum: 1 }
          }
        }
      ]),
      Subscription.countDocuments({ status: { $in: ['active', 'trialing'] } })
    ]);
    
    const recentActivities = await Promise.all([
      UserWorkout.find({ status: 'completed' })
        .populate('user', 'name')
        .populate('workout', 'name')
        .sort({ completedAt: -1 })
        .limit(5),
      UserMeal.find({ isActive: true })
        .populate('user', 'name')
        .populate('meal', 'name')
        .sort({ consumedDate: -1 })
        .limit(5)
    ]);
    
    const activities = [
      ...recentActivities[0].map(workout => ({
        type: 'workout',
        user: workout.user?.name || 'Unknown User',
        action: `completed workout: ${workout.workout?.name || 'Custom Workout'}`,
        timestamp: workout.completedAt || workout.updatedAt
      })),
      ...recentActivities[1].map(meal => ({
        type: 'meal',
        user: meal.user?.name || 'Unknown User',
        action: `logged meal: ${meal.meal?.name || 'Custom Meal'}`,
        timestamp: meal.consumedDate
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    
    const dashboardData = {
      stats: {
        totalUsers,
        activeUsers,
        totalWorkouts,
        totalMeals,
        monthlyRevenue: monthlyRevenue[0]?.totalRevenue || 0,
        activeSubscriptions
      },
      recentActivities: activities
    };
    
    res.json({
      status: 'success',
      data: dashboardData
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching dashboard stats'
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, role, subscriptionStatus } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) query.role = role;
    if (subscriptionStatus) query['subscription.status'] = subscriptionStatus;
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select('name email role subscription stats lastLogin createdAt isActive')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      User.countDocuments(query)
    ]);
    
    res.json({
      status: 'success',
      data: {
        users,
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
    console.error('Get all users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching users'
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    const [userWorkouts, userMeals, subscription] = await Promise.all([
      UserWorkout.countDocuments({ user: user._id, isActive: true }),
      UserMeal.countDocuments({ user: user._id, isActive: true }),
      Subscription.findOne({ user: user._id, status: { $in: ['active', 'trialing'] } })
    ]);
    
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      subscription: user.subscription,
      stats: {
        ...user.stats,
        totalWorkouts: userWorkouts,
        totalMeals: userMeals
      },
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      activeSubscription: subscription
    };
    
    res.json({
      status: 'success',
      data: {
        user: userData
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user'
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user', subscription = {} } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and password are required'
      });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }
    
    const userData = {
      name,
      email,
      password,
      role,
      subscription: {
        plan: subscription.plan || 'none',
        status: subscription.status || 'inactive',
        paymentStatus: subscription.paymentStatus || 'pending'
      }
    };
    
    const user = new User(userData);
    await user.save();
    
    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscription: user.subscription,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating user'
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { role, subscription, isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    if (role) user.role = role;
    if (subscription) {
      user.subscription = { ...user.subscription, ...subscription };
    }
    if (isActive !== undefined) {
      user.isActive = isActive;
    }
    
    await user.save();
    
    res.json({
      status: 'success',
      message: 'User updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscription: user.subscription,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating user'
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting user'
    });
  }
};

export const getAllWorkouts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, category, isPublic } = req.query;
    
    let query = { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) query.category = category;
    if (isPublic !== undefined) query.isPublic = isPublic === 'true';
    
    const [workouts, total] = await Promise.all([
      Workout.find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
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
    console.error('Get all workouts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching workouts'
    });
  }
};

export const createWorkout = async (req, res) => {
  try {
    const workoutData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const workout = new Workout(workoutData);
    await workout.save();
    
    await workout.populate('createdBy', 'name email');
    
    res.status(201).json({
      status: 'success',
      data: { workout },
      message: 'Workout created successfully'
    });
  } catch (error) {
    console.error('Create workout error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating workout'
    });
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    
    const workout = await Workout.findById(id);
    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }
    
    Object.assign(workout, req.body);
    await workout.save();
    
    await workout.populate('createdBy', 'name email');
    
    res.json({
      status: 'success',
      data: { workout },
      message: 'Workout updated successfully'
    });
  } catch (error) {
    console.error('Update workout error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating workout'
    });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    
    const workout = await Workout.findByIdAndDelete(id);
    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }
    
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

export const getAllMeals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { search, category, isPublic } = req.query;
    
    let query = { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) query.category = category;
    if (isPublic !== undefined) query.isPublic = isPublic === 'true';
    
    const [meals, total] = await Promise.all([
      Meal.find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      Meal.countDocuments(query)
    ]);
    
    res.json({
      status: 'success',
      data: {
        meals,
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
    console.error('Get all meals error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching meals'
    });
  }
};

export const createMeal = async (req, res) => {
  try {
    const mealData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const meal = new Meal(mealData);
    await meal.save();
    
    await meal.populate('createdBy', 'name email');
    
    res.status(201).json({
      status: 'success',
      data: { meal },
      message: 'Meal created successfully'
    });
  } catch (error) {
    console.error('Create meal error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating meal'
    });
  }
};

export const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const meal = await Meal.findById(id);
    if (!meal) {
      return res.status(404).json({
        status: 'error',
        message: 'Meal not found'
      });
    }
    
    Object.assign(meal, req.body);
    await meal.save();
    
    await meal.populate('createdBy', 'name email');
    
    res.json({
      status: 'success',
      data: { meal },
      message: 'Meal updated successfully'
    });
  } catch (error) {
    console.error('Update meal error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating meal'
    });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const meal = await Meal.findByIdAndDelete(id);
    if (!meal) {
      return res.status(404).json({
        status: 'error',
        message: 'Meal not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Meal deleted successfully'
    });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting meal'
    });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate = new Date();
    let groupFormat = '%Y-%m';
    
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        groupFormat = '%Y-%m-%d';
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        groupFormat = '%Y-%m-%d';
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupFormat = '%Y-%m';
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }
    
    const [userGrowth, workoutStats, mealStats, revenueStats] = await Promise.all([
      User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            isActive: true
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: groupFormat,
                date: '$createdAt'
              }
            },
            newUsers: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      
      UserWorkout.aggregate([
        {
          $match: {
            scheduledDate: { $gte: startDate },
            status: 'completed',
            isActive: true
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: groupFormat,
                date: '$scheduledDate'
              }
            },
            completedWorkouts: { $sum: 1 },
            totalCaloriesBurned: { $sum: '$totalCaloriesBurned' }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      
      UserMeal.aggregate([
        {
          $match: {
            consumedDate: { $gte: startDate },
            isActive: true
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: groupFormat,
                date: '$consumedDate'
              }
            },
            loggedMeals: { $sum: 1 },
            totalCaloriesConsumed: { $sum: '$actualNutrition.calories' }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      
      Subscription.aggregate([
        {
          $match: {
            paymentDate: { $gte: startDate },
            paymentStatus: 'paid',
            status: { $in: ['active', 'trialing', 'expired'] }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: groupFormat,
                date: '$paymentDate'
              }
            },
            revenue: { $sum: '$price' },
            subscriptions: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);
    
    res.json({
      status: 'success',
      data: {
        period,
        userGrowth,
        workoutStats,
        mealStats,
        revenueStats
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching analytics'
    });
  }
};

export const getRevenueStats = async (req, res) => {
  try {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);
    
    const [monthlyRevenue, yearlyRevenue, subscriptionBreakdown] = await Promise.all([
      Subscription.aggregate([
        {
          $match: {
            paymentDate: { $gte: thisMonth },
            paymentStatus: 'paid',
            status: { $in: ['active', 'trialing', 'expired'] }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$price' },
            count: { $sum: 1 }
          }
        }
      ]),
      
      Subscription.aggregate([
        {
          $match: {
            paymentDate: { $gte: thisYear },
            paymentStatus: 'paid',
            status: { $in: ['active', 'trialing', 'expired'] }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$price' },
            count: { $sum: 1 }
          }
        }
      ]),
      
      Subscription.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            status: { $in: ['active', 'trialing', 'expired'] }
          }
        },
        {
          $group: {
            _id: '$plan',
            revenue: { $sum: '$price' },
            count: { $sum: 1 }
          }
        }
      ])
    ]);
    
    res.json({
      status: 'success',
      data: {
        monthlyRevenue: monthlyRevenue[0]?.totalRevenue || 0,
        yearlyRevenue: yearlyRevenue[0]?.totalRevenue || 0,
        subscriptionBreakdown
      }
    });
  } catch (error) {
    console.error('Get revenue stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching revenue stats'
    });
  }
};

export const toggleWorkoutVisibility = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout not found'
      });
    }
    
    workout.isPublic = !workout.isPublic;
    await workout.save();
    
    res.json({
      status: 'success',
      message: `Workout ${workout.isPublic ? 'published' : 'unpublished'} successfully`,
      data: {
        workout: {
          id: workout._id,
          name: workout.name,
          isPublic: workout.isPublic
        }
      }
    });
  } catch (error) {
    console.error('Toggle workout visibility error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating workout visibility'
    });
  }
};

export const toggleMealVisibility = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    
    if (!meal) {
      return res.status(404).json({
        status: 'error',
        message: 'Meal not found'
      });
    }
    
    meal.isPublic = !meal.isPublic;
    await meal.save();
    
    res.json({
      status: 'success',
      message: `Meal ${meal.isPublic ? 'published' : 'unpublished'} successfully`,
      data: {
        meal: {
          id: meal._id,
          name: meal.name,
          isPublic: meal.isPublic
        }
      }
    });
  } catch (error) {
    console.error('Toggle meal visibility error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating meal visibility'
    });
  }
};

export const processPayment = async (req, res) => {
  try {
    const { subscriptionId, transactionId, paymentMethod } = req.body;
    
    if (!subscriptionId || !transactionId) {
      return res.status(400).json({
        status: 'error',
        message: 'Subscription ID and transaction ID are required'
      });
    }
    
    const subscription = await Subscription.findById(subscriptionId);
    
    if (!subscription) {
      return res.status(404).json({
        status: 'error',
        message: 'Subscription not found'
      });
    }
    
    subscription.paymentStatus = 'paid';
    subscription.paymentDate = new Date();
    subscription.status = 'active';
    subscription.transactionId = transactionId;
    if (paymentMethod) {
      subscription.paymentMethod = paymentMethod;
    }
    
    await subscription.save();
    
    await User.findByIdAndUpdate(subscription.user, {
      'subscription.status': 'active',
      'subscription.paymentStatus': 'paid',
      $inc: { 'subscription.totalSpent': subscription.price }
    });
    
    res.json({
      status: 'success',
      message: 'Payment processed successfully',
      data: {
        subscription: {
          id: subscription._id,
          paymentStatus: subscription.paymentStatus,
          paymentDate: subscription.paymentDate,
          transactionId: subscription.transactionId,
          amount: subscription.price
        }
      }
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while processing payment'
    });
  }
};

export const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({})
      .sort({ displayOrder: 1, createdAt: 1 });
    
    res.json({
      status: 'success',
      data: {
        plans
      }
    });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching subscription plans'
    });
  }
};

export const createSubscriptionPlan = async (req, res) => {
  try {
    const { id, name, price, currency, duration, billingCycle, features, description, popular, displayOrder } = req.body;
    
    if (!id || !name || !price || !duration || !billingCycle || !features || !description) {
      return res.status(400).json({
        status: 'error',
        message: 'All required fields must be provided'
      });
    }
    
    const existingPlan = await SubscriptionPlan.findOne({ id });
    if (existingPlan) {
      return res.status(400).json({
        status: 'error',
        message: 'Plan with this ID already exists'
      });
    }
    
    const plan = new SubscriptionPlan({
      id,
      name,
      price,
      currency: currency || 'NPR',
      duration,
      billingCycle,
      features: Array.isArray(features) ? features : [features],
      description,
      popular: popular || false,
      displayOrder: displayOrder || 0
    });
    
    await plan.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Subscription plan created successfully',
      data: {
        plan
      }
    });
  } catch (error) {
    console.error('Create subscription plan error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating subscription plan'
    });
  }
};

export const updateSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, currency, duration, billingCycle, features, description, popular, displayOrder } = req.body;
    
    const plan = await SubscriptionPlan.findOne({ id });
    
    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Subscription plan not found'
      });
    }
    
    if (name) plan.name = name;
    if (price !== undefined) plan.price = price;
    if (currency) plan.currency = currency;
    if (duration) plan.duration = duration;
    if (billingCycle) plan.billingCycle = billingCycle;
    if (features) plan.features = Array.isArray(features) ? features : [features];
    if (description) plan.description = description;
    if (popular !== undefined) plan.popular = popular;
    if (displayOrder !== undefined) plan.displayOrder = displayOrder;
    
    await plan.save();
    
    res.json({
      status: 'success',
      message: 'Subscription plan updated successfully',
      data: {
        plan
      }
    });
  } catch (error) {
    console.error('Update subscription plan error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating subscription plan'
    });
  }
};

export const deleteSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = await SubscriptionPlan.findOne({ id });
    
    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Subscription plan not found'
      });
    }
    
    const activeSubscriptions = await Subscription.countDocuments({
      plan: id,
      status: { $in: ['active', 'trialing'] }
    });
    
    if (activeSubscriptions > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot delete plan. ${activeSubscriptions} active subscription(s) are using this plan.`
      });
    }
    
    await SubscriptionPlan.deleteOne({ id });
    
    res.json({
      status: 'success',
      message: 'Subscription plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete subscription plan error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting subscription plan'
    });
  }
};

export const toggleSubscriptionPlanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const plan = await SubscriptionPlan.findOne({ id });
    
    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Subscription plan not found'
      });
    }
    
    plan.isActive = !plan.isActive;
    await plan.save();
    
    res.json({
      status: 'success',
      message: `Subscription plan ${plan.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        plan: {
          id: plan.id,
          name: plan.name,
          isActive: plan.isActive
        }
      }
    });
  } catch (error) {
    console.error('Toggle subscription plan status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating subscription plan status'
    });
  }
};