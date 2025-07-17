import Meal from '../models/Meal.js';
import UserMeal from '../models/UserMeal.js';

export const getAllMeals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { search, category, mealType, dietaryRestrictions, maxCalories, minProtein } = req.query;
    
    let query = { isPublic: true, isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) query.category = category;
    if (mealType) query.mealType = { $in: mealType.split(',') };
    if (dietaryRestrictions) {
      query.dietaryRestrictions = { $in: dietaryRestrictions.split(',') };
    }
    if (maxCalories) {
      query['nutrition.calories'] = { $lte: parseInt(maxCalories) };
    }
    if (minProtein) {
      query['nutrition.protein'] = { $gte: parseInt(minProtein) };
    }
    
    const [meals, total] = await Promise.all([
      Meal.find(query)
        .populate('createdBy', 'name')
        .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
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
    console.error('Get meals error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching meals'
    });
  }
};

export const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      isActive: true
    }).populate('createdBy', 'name profile.avatar');
    
    if (!meal) {
      return res.status(404).json({
        status: 'error',
        message: 'Meal not found'
      });
    }
    
    if (!meal.isPublic && (!req.user || meal.createdBy._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied to this meal'
      });
    }
    
    res.json({
      status: 'success',
      data: {
        meal
      }
    });
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching meal'
    });
  }
};

export const getMealCategories = async (req, res) => {
  try {
    const categories = await Meal.distinct('category', {
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

export const getFeaturedMeals = async (req, res) => {
  try {
    const featuredMeals = await Meal.find({
      isPublic: true,
      isActive: true,
      averageRating: { $gte: 4.0 },
      favoriteCount: { $gte: 5 }
    })
    .populate('createdBy', 'name')
    .sort({ averageRating: -1, favoriteCount: -1 })
    .limit(6);
    
    res.json({
      status: 'success',
      data: {
        meals: featuredMeals
      }
    });
  } catch (error) {
    console.error('Get featured meals error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching featured meals'
    });
  }
};

export const getMealsByGoal = async (req, res) => {
  try {
    const { goal } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const validGoals = ['weight-loss', 'muscle-gain', 'maintenance', 'vegetarian'];
    if (!validGoals.includes(goal)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid goal parameter'
      });
    }
    
    let query = { isPublic: true, isActive: true };
    
    switch (goal) {
      case 'weight-loss':
        query['nutrition.calories'] = { $lte: 400 };
        query['nutrition.fat'] = { $lte: 15 };
        break;
      case 'muscle-gain':
        query['nutrition.protein'] = { $gte: 20 };
        break;
      case 'vegetarian':
        query.dietaryRestrictions = { $in: ['vegetarian', 'vegan'] };
        break;
      default:
        break;
    }
    
    const [meals, total] = await Promise.all([
      Meal.find(query)
        .populate('createdBy', 'name')
        .sort({ averageRating: -1 })
        .limit(limit)
        .skip(skip),
      Meal.countDocuments(query)
    ]);
    
    res.json({
      status: 'success',
      data: {
        meals,
        goal,
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
    console.error('Get meals by goal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching meals by goal'
    });
  }
};

export const createMeal = async (req, res) => {
  try {
    const mealData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    const meal = new Meal(mealData);
    await meal.save();
    
    await meal.populate('createdBy', 'name');
    
    res.status(201).json({
      status: 'success',
      message: 'Meal created successfully',
      data: {
        meal
      }
    });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating meal'
    });
  }
};

export const updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      isActive: true
    });
    
    if (!meal) {
      return res.status(404).json({
        status: 'error',
        message: 'Meal not found or access denied'
      });
    }
    
    Object.assign(meal, req.body);
    await meal.save();
    
    await meal.populate('createdBy', 'name');
    
    res.json({
      status: 'success',
      message: 'Meal updated successfully',
      data: {
        meal
      }
    });
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating meal'
    });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      isActive: true
    });
    
    if (!meal) {
      return res.status(404).json({
        status: 'error',
        message: 'Meal not found or access denied'
      });
    }
    
    meal.isActive = false;
    await meal.save();
    
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

export const rateMeal = async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const meal = await Meal.findOne({
      _id: req.params.id,
      isActive: true
    });
    
    if (!meal) {
      return res.status(404).json({
        status: 'error',
        message: 'Meal not found'
      });
    }
    
    await meal.addRating(req.user._id, rating, review);
    
    res.json({
      status: 'success',
      message: 'Rating added successfully',
      data: {
        averageRating: meal.averageRating,
        totalRatings: meal.ratings.length
      }
    });
  } catch (error) {
    console.error('Rate meal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while rating meal'
    });
  }
};

export const favoriteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      isActive: true
    });
    
    if (!meal) {
      return res.status(404).json({
        status: 'error',
        message: 'Meal not found'
      });
    }
    
    await meal.incrementFavoriteCount();
    
    res.json({
      status: 'success',
      message: 'Meal added to favorites',
      data: {
        favoriteCount: meal.favoriteCount
      }
    });
  } catch (error) {
    console.error('Favorite meal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding to favorites'
    });
  }
};

export const unfavoriteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      isActive: true
    });
    
    if (!meal) {
      return res.status(404).json({
        status: 'error',
        message: 'Meal not found'
      });
    }
    
    await meal.decrementFavoriteCount();
    
    res.json({
      status: 'success',
      message: 'Meal removed from favorites',
      data: {
        favoriteCount: meal.favoriteCount
      }
    });
  } catch (error) {
    console.error('Unfavorite meal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while removing from favorites'
    });
  }
};

export const getUserMeals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { mealType, startDate, endDate } = req.query;
    
    let query = { user: req.user._id, isActive: true };
    
    if (mealType) query.mealType = mealType;
    if (startDate || endDate) {
      query.consumedDate = {};
      if (startDate) query.consumedDate.$gte = new Date(startDate);
      if (endDate) query.consumedDate.$lte = new Date(endDate);
    }
    
    const [userMeals, total] = await Promise.all([
      UserMeal.find(query)
        .populate('meal', 'name category image nutrition')
        .sort({ consumedDate: -1 })
        .limit(limit)
        .skip(skip),
      UserMeal.countDocuments(query)
    ]);
    
    res.json({
      status: 'success',
      data: {
        meals: userMeals,
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
    console.error('Get user meals error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user meals'
    });
  }
};

export const logMeal = async (req, res) => {
  try {
    const { mealId, mealType, consumedDate, servingSize, customMeal, rating, notes, status } = req.body;
    
    if (mealId) {
      const meal = await Meal.findOne({
        _id: mealId,
        isActive: true
      });
      
      if (!meal) {
        return res.status(404).json({
          status: 'error',
          message: 'Meal not found'
        });
      }
      
      if (!meal.isPublic && meal.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied to this meal'
        });
      }
    }
    
    const userMealData = {
      user: req.user._id,
      mealType,
      consumedDate: new Date(consumedDate),
      servingSize: servingSize || { quantity: 1, unit: 'serving' }
    };
    
    if (mealId) {
      userMealData.meal = mealId;
    } else if (customMeal) {
      userMealData.customMeal = customMeal;
    }
    if (rating !== undefined) {
      userMealData.rating = rating;
    }
    if (notes) {
      userMealData.notes = notes;
    }
    if (status !== undefined) {
      userMealData.status = status;
    }
    
    const userMeal = new UserMeal(userMealData);
    
    await userMeal.save();
    await userMeal.populate('meal', 'name category image nutrition');
    
    await req.user.updateStats({
      totalCaloriesConsumed: userMeal.actualNutrition.calories
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Meal logged successfully',
      data: {
        userMeal,
        nutrition: userMeal.actualNutrition
      }
    });
  } catch (error) {
    console.error('Log meal error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while logging meal'
    });
  }
};

export const updateUserMeal = async (req, res) => {
  try {
    const { servingSize, rating, notes, status } = req.body;
    
    const userMeal = await UserMeal.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });
    
    if (!userMeal) {
      return res.status(404).json({
        status: 'error',
        message: 'Meal log not found'
      });
    }
    
    if (servingSize) {
      await userMeal.updateServingSize(servingSize);
    }
    
    if (rating !== undefined) userMeal.rating = rating;
    if (notes !== undefined) userMeal.notes = notes;
    if (status !== undefined) userMeal.status = status;
    
    await userMeal.save();
    await userMeal.populate('meal', 'name category image nutrition');
    
    res.json({
      status: 'success',
      message: 'Meal log updated successfully',
      data: {
        userMeal
      }
    });
  } catch (error) {
    console.error('Update meal log error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating meal log'
    });
  }
};

export const deleteUserMeal = async (req, res) => {
  try {
    const userMeal = await UserMeal.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });
    
    if (!userMeal) {
      return res.status(404).json({
        status: 'error',
        message: 'Meal log not found'
      });
    }
    
    userMeal.isActive = false;
    await userMeal.save();
    
    res.json({
      status: 'success',
      message: 'Meal log deleted successfully'
    });
  } catch (error) {
    console.error('Delete meal log error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting meal log'
    });
  }
};

export const getDailyNutrition = async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    
    const dailyNutrition = await UserMeal.getDailyNutrition(req.user._id, targetDate);
    
    res.json({
      status: 'success',
      data: {
        date: targetDate,
        ...dailyNutrition
      }
    });
  } catch (error) {
    console.error('Get daily nutrition error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching daily nutrition'
    });
  }
};

export const getMealsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { search, mealType, dietaryRestrictions, maxCalories, minProtein } = req.query;
    
    let query = { 
      category: category,
      isPublic: true, 
      isActive: true 
    };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (mealType) query.mealType = { $in: mealType.split(',') };
    if (dietaryRestrictions) {
      query.dietaryRestrictions = { $in: dietaryRestrictions.split(',') };
    }
    if (maxCalories) {
      query['nutrition.calories'] = { $lte: parseInt(maxCalories) };
    }
    if (minProtein) {
      query['nutrition.protein'] = { $gte: parseInt(minProtein) };
    }
    
    const [meals, total] = await Promise.all([
      Meal.find(query)
        .populate('createdBy', 'name')
        .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .limit(limit)
        .skip(skip),
      Meal.countDocuments(query)
    ]);
    
    res.json({
      status: 'success',
      data: {
        meals,
        category,
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
    console.error('Get meals by category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching meals by category'
    });
  }
};

export const toggleFavoriteMeal = async (req, res) => {
  try {
    const mealId = req.params.id;
    const userId = req.user._id;
    
    const meal = await Meal.findOne({
      _id: mealId,
      isActive: true
    });
    
    if (!meal) {
      return res.status(404).json({
        status: 'error',
        message: 'Meal not found'
      });
    }
    
    if (!meal.isPublic && meal.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied to this meal'
      });
    }
    
    const user = req.user;
    const isFavorited = user.favoriteMeals && user.favoriteMeals.includes(mealId);
    
    if (isFavorited) {
      user.favoriteMeals = user.favoriteMeals.filter(id => id.toString() !== mealId.toString());
      meal.favoriteCount = Math.max(0, (meal.favoriteCount || 0) - 1);
    } else {
      if (!user.favoriteMeals) {
        user.favoriteMeals = [];
      }
      user.favoriteMeals.push(mealId);
      meal.favoriteCount = (meal.favoriteCount || 0) + 1;
    }
    
    await Promise.all([
      user.save(),
      meal.save()
    ]);
    
    res.json({
       status: 'success',
       message: isFavorited ? 'Meal removed from favorites' : 'Meal added to favorites',
       data: {
         isFavorited: !isFavorited,
         favoriteCount: meal.favoriteCount
       }
     });
   } catch (error) {
     console.error('Toggle favorite meal error:', error);
     res.status(500).json({
       status: 'error',
       message: 'Server error while toggling favorite meal'
     });
   }
 };